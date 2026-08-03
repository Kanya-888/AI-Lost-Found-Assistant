import os
import json
import numpy as np
from typing import List, Tuple, Dict, Any
from backend.config import settings

# Global index structures
_faiss_available = False
try:
    import faiss
    _faiss_available = True
except ImportError:
    _faiss_available = False

class FAISSIndexManager:
    """FAISS Vector Search Service for nearest neighbor similarity matching."""

    def __init__(self, dimension: int = 384):
        self.dimension = dimension
        self.lost_index_path = os.path.join(settings.FAISS_INDEX_DIR, "lost_items.index")
        self.found_index_path = os.path.join(settings.FAISS_INDEX_DIR, "found_items.index")
        self.mapping_path = os.path.join(settings.FAISS_INDEX_DIR, "id_mappings.json")

        # Memory fallbacks / ID mapping dictionaries: index_id -> db_item_id
        self.lost_id_map: Dict[int, int] = {}
        self.found_id_map: Dict[int, int] = {}

        # Vector stores for numpy fallback
        self.lost_vectors: List[np.ndarray] = []
        self.found_vectors: List[np.ndarray] = []

        self._load_mappings()
        self._init_indices()

    def _load_mappings(self):
        """Load ID mappings from disk JSON if exists."""
        if os.path.exists(self.mapping_path):
            try:
                with open(self.mapping_path, "r") as f:
                    data = json.load(f)
                    self.lost_id_map = {int(k): int(v) for k, v in data.get("lost", {}).items()}
                    self.found_id_map = {int(k): int(v) for k, v in data.get("found", {}).items()}
            except Exception as e:
                print(f"[FAISS Service] Warning loading mappings: {e}")

    def _save_mappings(self):
        """Save ID mappings to disk JSON."""
        try:
            with open(self.mapping_path, "w") as f:
                json.dump({
                    "lost": self.lost_id_map,
                    "found": self.found_id_map
                }, f, indent=2)
        except Exception as e:
            print(f"[FAISS Service] Warning saving mappings: {e}")

    def _init_indices(self):
        """Initialize or load FAISS indices."""
        if _faiss_available:
            try:
                if os.path.exists(self.lost_index_path):
                    self.lost_index = faiss.read_index(self.lost_index_path)
                else:
                    # IndexFlatIP uses Inner Product (equivalent to Cosine for normalized vectors)
                    self.lost_index = faiss.IndexFlatIP(self.dimension)

                if os.path.exists(self.found_index_path):
                    self.found_index = faiss.read_index(self.found_index_path)
                else:
                    self.found_index = faiss.IndexFlatIP(self.dimension)
                print("[FAISS Service] FAISS indices initialized successfully.")
                return
            except Exception as e:
                print(f"[FAISS Service] Error setting up FAISS indices: {e}")

        # Fallback in-memory index
        self.lost_index = None
        self.found_index = None

    def save_indices(self):
        """Persist FAISS indices to disk."""
        self._save_mappings()
        if _faiss_available:
            try:
                if self.lost_index:
                    faiss.write_index(self.lost_index, self.lost_index_path)
                if self.found_index:
                    faiss.write_index(self.found_index, self.found_index_path)
            except Exception as e:
                print(f"[FAISS Service] Error writing FAISS indices to disk: {e}")

    def add_vector(self, item_type: str, item_id: int, vector: List[float]):
        """Add item embedding vector to FAISS index."""
        vec = np.array([vector[:self.dimension]], dtype=np.float32)
        # Normalize vector for cosine similarity
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm

        if item_type == "lost":
            idx = len(self.lost_id_map)
            self.lost_id_map[idx] = item_id
            self.lost_vectors.append(vec[0])
            if self.lost_index is not None:
                self.lost_index.add(vec)
        elif item_type == "found":
            idx = len(self.found_id_map)
            self.found_id_map[idx] = item_id
            self.found_vectors.append(vec[0])
            if self.found_index is not None:
                self.found_index.add(vec)

        self.save_indices()

    def search_nearest_neighbors(self, query_vector: List[float], target_type: str, k: int = 5) -> List[Tuple[int, float]]:
        """
        Search top k nearest neighbor matches for query_vector in target_type ('lost' or 'found').
        Returns list of (item_id, similarity_score) tuples.
        """
        vec = np.array([query_vector[:self.dimension]], dtype=np.float32)
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm

        target_index = self.lost_index if target_type == "lost" else self.found_index
        target_map = self.lost_id_map if target_type == "lost" else self.found_id_map
        target_vectors = self.lost_vectors if target_type == "lost" else self.found_vectors

        if not target_map:
            return []

        actual_k = min(k, len(target_map))

        # FAISS search path
        if _faiss_available and target_index is not None and target_index.ntotal > 0:
            try:
                distances, indices = target_index.search(vec, actual_k)
                results = []
                for score, idx in zip(distances[0], indices[0]):
                    if idx != -1 and idx in target_map:
                        item_id = target_map[idx]
                        results.append((item_id, float(score)))
                return results
            except Exception as e:
                print(f"[FAISS Search Error]: {e}")

        # Fallback numpy search path
        results = []
        if target_vectors:
            target_matrix = np.array(target_vectors, dtype=np.float32)
            # Dot product for normalized vectors = cosine similarity
            sims = np.dot(target_matrix, vec[0])
            top_indices = np.argsort(sims)[::-1][:actual_k]
            for idx in top_indices:
                if idx in target_map:
                    results.append((target_map[idx], float(sims[idx])))

        return results

faiss_service = FAISSIndexManager(dimension=384)
