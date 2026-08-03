import json
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_

from backend.models.item import LostItem, FoundItem
from backend.models.embedding import ItemEmbedding
from backend.schemas.item import LostItemCreate, FoundItemCreate, ItemQueryFilter
from backend.services.ai_service import ai_service
from backend.services.faiss_service import faiss_service

class ItemService:
    """Business logic service for managing Lost and Found item reports and embeddings."""

    @staticmethod
    def create_lost_item(db: Session, user_id: int, item_data: LostItemCreate, image_path: Optional[str] = None) -> LostItem:
        """Create a Lost Item, generate AI embeddings, update FAISS index, and return model."""
        lost_item = LostItem(
            user_id=user_id,
            name=item_data.name,
            category=item_data.category,
            description=item_data.description,
            date_lost=item_data.date_lost,
            location=item_data.location,
            image_path=image_path,
            status="pending"
        )
        db.add(lost_item)
        db.commit()
        db.refresh(lost_item)

        # 1. Generate text embedding from name + category + description
        text_content = f"{lost_item.name} {lost_item.category} {lost_item.description} {lost_item.location}"
        text_vector = ai_service.generate_text_embedding(text_content)

        # 2. Generate image embedding if image provided
        image_vector = ai_service.generate_image_embedding(image_path) if image_path else None

        # 3. Save ItemEmbedding record
        embedding_record = ItemEmbedding(
            item_type="lost",
            item_id=lost_item.id,
            text_vector=json.dumps(text_vector),
            image_vector=json.dumps(image_vector) if image_vector else None,
            combined_vector=json.dumps(text_vector)
        )
        db.add(embedding_record)
        db.commit()

        # 4. Add text embedding into FAISS index for quick candidate lookup
        faiss_service.add_vector(item_type="lost", item_id=lost_item.id, vector=text_vector)

        return lost_item

    @staticmethod
    def create_found_item(db: Session, user_id: int, item_data: FoundItemCreate, image_path: Optional[str] = None) -> FoundItem:
        """Create a Found Item, generate AI embeddings, update FAISS index, and return model."""
        found_item = FoundItem(
            user_id=user_id,
            name=item_data.name,
            category=item_data.category,
            description=item_data.description,
            date_found=item_data.date_found,
            location=item_data.location,
            image_path=image_path,
            status="pending"
        )
        db.add(found_item)
        db.commit()
        db.refresh(found_item)

        # 1. Generate text embedding
        text_content = f"{found_item.name} {found_item.category} {found_item.description} {found_item.location}"
        text_vector = ai_service.generate_text_embedding(text_content)

        # 2. Generate image embedding if image provided
        image_vector = ai_service.generate_image_embedding(image_path) if image_path else None

        # 3. Save ItemEmbedding record
        embedding_record = ItemEmbedding(
            item_type="found",
            item_id=found_item.id,
            text_vector=json.dumps(text_vector),
            image_vector=json.dumps(image_vector) if image_vector else None,
            combined_vector=json.dumps(text_vector)
        )
        db.add(embedding_record)
        db.commit()

        # 4. Add text embedding into FAISS index
        faiss_service.add_vector(item_type="found", item_id=found_item.id, vector=text_vector)

        return found_item

    @staticmethod
    def get_lost_items(db: Session, filters: ItemQueryFilter, user_id: Optional[int] = None) -> List[LostItem]:
        """Fetch Lost items with optional filters."""
        query = db.query(LostItem)
        if user_id:
            query = query.filter(LostItem.user_id == user_id)
        if filters.category:
            query = query.filter(LostItem.category.ilike(f"%{filters.category}%"))
        if filters.status:
            query = query.filter(LostItem.status == filters.status)
        if filters.search:
            search_pattern = f"%{filters.search}%"
            query = query.filter(
                or_(
                    LostItem.name.ilike(search_pattern),
                    LostItem.description.ilike(search_pattern),
                    LostItem.location.ilike(search_pattern)
                )
            )
        return query.order_by(LostItem.created_at.desc()).all()

    @staticmethod
    def get_found_items(db: Session, filters: ItemQueryFilter, user_id: Optional[int] = None) -> List[FoundItem]:
        """Fetch Found items with optional filters."""
        query = db.query(FoundItem)
        if user_id:
            query = query.filter(FoundItem.user_id == user_id)
        if filters.category:
            query = query.filter(FoundItem.category.ilike(f"%{filters.category}%"))
        if filters.status:
            query = query.filter(FoundItem.status == filters.status)
        if filters.search:
            search_pattern = f"%{filters.search}%"
            query = query.filter(
                or_(
                    FoundItem.name.ilike(search_pattern),
                    FoundItem.description.ilike(search_pattern),
                    FoundItem.location.ilike(search_pattern)
                )
            )
        return query.order_by(FoundItem.created_at.desc()).all()

item_service = ItemService()
