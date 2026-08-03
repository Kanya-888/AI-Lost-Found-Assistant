import os
import hashlib
import numpy as np
from PIL import Image
from typing import Optional, List, Tuple
from backend.config import settings

# Global model references
_text_model = None
_clip_model = None
_clip_preprocess = None

def _get_text_model():
    """Lazy initialization of SentenceTransformers model."""
    global _text_model
    if _text_model is None:
        try:
            from sentence_transformers import SentenceTransformer
            print("[AI Service] Loading SentenceTransformers (all-MiniLM-L6-v2)...")
            _text_model = SentenceTransformer("all-MiniLM-L6-v2")
            print("[AI Service] SentenceTransformers loaded successfully.")
        except Exception as e:
            print(f"[AI Service Warning] Failed to load SentenceTransformers ({e}). Using fallback vector generator.")
            _text_model = "FALLBACK"
    return _text_model

def _get_clip_model():
    """Lazy initialization of OpenCLIP model."""
    global _clip_model, _clip_preprocess
    if _clip_model is None:
        try:
            import open_clip
            import torch
            print("[AI Service] Loading OpenCLIP (ViT-B-32, laion2b_s34b_b79k)...")
            model, _, preprocess = open_clip.create_model_and_transforms('ViT-B-32', pretrained='laion2b_s34b_b79k')
            model.eval()
            _clip_model = model
            _clip_preprocess = preprocess
            print("[AI Service] OpenCLIP model loaded successfully.")
        except Exception as e:
            print(f"[AI Service Warning] Failed to load OpenCLIP ({e}). Using fallback image vector generator.")
            _clip_model = "FALLBACK"
    return _clip_model, _clip_preprocess

def _fallback_vector(text: str, dim: int = 384) -> np.ndarray:
    """Generate a deterministic normalized fallback vector based on string hash."""
    sha = hashlib.sha256(text.encode("utf-8")).digest()
    # Repeat sha bytes to reach target dimension
    byte_array = (sha * (dim // len(sha) + 1))[:dim]
    vec = np.frombuffer(byte_array, dtype=np.uint8).astype(np.float32)
    # Normalize to unit length
    norm = np.linalg.norm(vec)
    return vec / norm if norm > 0 else vec

class AIService:
    """Business logic service for AI embeddings and similarity computation."""

    @staticmethod
    def generate_text_embedding(text: str) -> List[float]:
        """
        Generate 384-dimensional vector embedding for item name, category, and description
        using SentenceTransformers (all-MiniLM-L6-v2).
        """
        if not text or not text.strip():
            return _fallback_vector("empty_text", 384).tolist()

        model = _get_text_model()
        if model != "FALLBACK" and hasattr(model, "encode"):
            try:
                embedding = model.encode(text, convert_to_numpy=True)
                # Normalize vector
                norm = np.linalg.norm(embedding)
                if norm > 0:
                    embedding = embedding / norm
                return embedding.tolist()
            except Exception as e:
                print(f"[AI Service] Error encoding text: {e}")

        return _fallback_vector(text, 384).tolist()

    @staticmethod
    def generate_image_embedding(image_path: Optional[str]) -> List[float]:
        """
        Generate 512-dimensional image vector embedding using OpenCLIP ViT-B/32.
        """
        dim = 512
        if not image_path:
            return _fallback_vector("no_image", dim).tolist()

        # Resolve full filesystem path
        full_path = image_path
        if image_path.startswith("/uploads/"):
            rel = image_path.lstrip("/uploads/")
            full_path = os.path.join(settings.UPLOAD_DIR, rel)

        if not os.path.exists(full_path):
            return _fallback_vector(f"missing_{image_path}", dim).tolist()

        model, preprocess = _get_clip_model()
        if model != "FALLBACK" and model is not None and preprocess is not None:
            try:
                import torch
                img = Image.open(full_path).convert("RGB")
                img_tensor = preprocess(img).unsqueeze(0)
                with torch.no_grad():
                    image_features = model.encode_image(img_tensor)
                    image_features /= image_features.norm(dim=-1, keepdim=True)
                    return image_features.cpu().numpy().flatten().tolist()
            except Exception as e:
                print(f"[AI Service] Error encoding image with OpenCLIP: {e}")

        # Fallback image vector derived from image filename/path
        return _fallback_vector(os.path.basename(full_path), dim).tolist()

    @staticmethod
    def calculate_cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
        """Compute cosine similarity between two normalized vector embeddings."""
        if not vec_a or not vec_b:
            return 0.0
        
        # Ensure dimensions match
        dim = min(len(vec_a), len(vec_b))
        a = np.array(vec_a[:dim], dtype=np.float32)
        b = np.array(vec_b[:dim], dtype=np.float32)

        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)

        if norm_a == 0 or norm_b == 0:
            return 0.0

        similarity = float(np.dot(a, b) / (norm_a * norm_b))
        # Clamp value between 0.0 and 1.0
        return max(0.0, min(1.0, similarity))

    @staticmethod
    def combine_scores(text_score: float, image_score: float, has_image_a: bool, has_image_b: bool) -> float:
        """
        Calculate weighted confidence score.
        If both items have images: 50% Text + 50% Image.
        If any item lacks image: 100% Text.
        """
        if has_image_a and has_image_b:
            return (0.5 * text_score) + (0.5 * image_score)
        return text_score

ai_service = AIService()
