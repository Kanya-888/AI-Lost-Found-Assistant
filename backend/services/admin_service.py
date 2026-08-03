import os
from sqlalchemy.orm import Session

from backend.config import settings
from backend.models.user import User
from backend.models.item import LostItem, FoundItem
from backend.models.match import Match
from backend.models.embedding import ItemEmbedding
from backend.schemas.admin import AdminStatsResponse, SystemMetricsResponse
from backend.services.faiss_service import faiss_service

class AdminService:
    """Business logic service for administrative system oversight and moderation."""

    @staticmethod
    def get_dashboard_stats(db: Session) -> AdminStatsResponse:
        """Calculate high-level dashboard statistics."""
        total_users = db.query(User).count()
        total_lost = db.query(LostItem).count()
        total_found = db.query(FoundItem).count()
        total_matches = db.query(Match).count()
        pending_matches = db.query(Match).filter(Match.status == "pending").count()
        confirmed_matches = db.query(Match).filter(Match.status == "matched").count()
        rejected_matches = db.query(Match).filter(Match.status == "rejected").count()

        return AdminStatsResponse(
            total_users=total_users,
            total_lost_items=total_lost,
            total_found_items=total_found,
            total_matches=total_matches,
            pending_matches=pending_matches,
            confirmed_matches=confirmed_matches,
            rejected_matches=rejected_matches
        )

    @staticmethod
    def get_system_metrics(db: Session) -> SystemMetricsResponse:
        """Calculate vector database size and storage health metrics."""
        total_embeddings = db.query(ItemEmbedding).count()
        faiss_size = len(faiss_service.lost_id_map) + len(faiss_service.found_id_map)

        # Compute storage used in upload directory
        storage_bytes = 0
        if os.path.exists(settings.UPLOAD_DIR):
            for entry in os.scandir(settings.UPLOAD_DIR):
                if entry.is_file():
                    storage_bytes += entry.stat().st_size
        storage_mb = round(storage_bytes / (1024 * 1024), 2)

        return SystemMetricsResponse(
            total_embeddings=total_embeddings,
            faiss_index_size=faiss_size,
            storage_used_mb=storage_mb,
            ai_engine_status="Online (SentenceTransformers + OpenCLIP + FAISS)"
        )

    @staticmethod
    def delete_spam_report(db: Session, item_type: str, item_id: int) -> bool:
        """Delete a spam report and associated embeddings."""
        if item_type == "lost":
            item = db.query(LostItem).filter(LostItem.id == item_id).first()
        else:
            item = db.query(FoundItem).filter(FoundItem.id == item_id).first()

        if not item:
            return False

        # Remove image file if exists
        if item.image_path:
            filename = os.path.basename(item.image_path)
            file_on_disk = os.path.join(settings.UPLOAD_DIR, filename)
            if os.path.exists(file_on_disk):
                try:
                    os.remove(file_on_disk)
                except Exception as e:
                    print(f"Error removing image: {e}")

        # Delete embeddings
        db.query(ItemEmbedding).filter(
            ItemEmbedding.item_type == item_type,
            ItemEmbedding.item_id == item_id
        ).delete()

        db.delete(item)
        db.commit()
        return True

admin_service = AdminService()
