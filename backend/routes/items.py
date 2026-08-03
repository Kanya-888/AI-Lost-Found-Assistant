from typing import List, Optional
from fastapi import APIRouter, Depends, Form, UploadFile, File, Query, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.user import User
from backend.schemas.item import (
    LostItemCreate, LostItemResponse,
    FoundItemCreate, FoundItemResponse,
    ItemQueryFilter
)
from backend.services.item_service import item_service
from backend.services.matching_service import matching_engine
from backend.utils.image_processing import validate_and_save_image
from backend.utils.security import get_current_user

router = APIRouter(prefix="/api/items", tags=["Lost & Found Items"])

@router.post("/lost", response_model=LostItemResponse, status_code=status.HTTP_201_CREATED)
def report_lost_item(
    name: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    date_lost: str = Form(...),
    location: str = Form(...),
    image: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Report a Lost Item.
    Saves item in DB, generates SentenceTransformers text embedding & OpenCLIP image embedding,
    stores vectors in FAISS, and triggers AI matching engine.
    """
    image_path = validate_and_save_image(image) if image and image.filename else None

    item_data = LostItemCreate(
        name=name,
        category=category,
        description=description,
        date_lost=date_lost,
        location=location
    )

    lost_item = item_service.create_lost_item(
        db=db,
        user_id=current_user.id,
        item_data=item_data,
        image_path=image_path
    )

    # Evaluate AI matching candidates in background / synchronously
    matching_engine.process_new_item_matches(db=db, item_type="lost", item_id=lost_item.id)

    return lost_item

@router.post("/found", response_model=FoundItemResponse, status_code=status.HTTP_201_CREATED)
def report_found_item(
    name: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    date_found: str = Form(...),
    location: str = Form(...),
    image: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Report a Found Item.
    Saves item in DB, generates AI embeddings, updates FAISS index,
    and triggers AI matching engine to notify lost item owner if score > 80%.
    """
    image_path = validate_and_save_image(image) if image and image.filename else None

    item_data = FoundItemCreate(
        name=name,
        category=category,
        description=description,
        date_found=date_found,
        location=location
    )

    found_item = item_service.create_found_item(
        db=db,
        user_id=current_user.id,
        item_data=item_data,
        image_path=image_path
    )

    # Evaluate AI matching candidates
    matching_engine.process_new_item_matches(db=db, item_type="found", item_id=found_item.id)

    return found_item

@router.get("/lost", response_model=List[LostItemResponse])
def get_lost_items(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    my_items: bool = Query(False),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetch lost items with optional filters."""
    filters = ItemQueryFilter(category=category, status=status, search=search)
    user_id = current_user.id if my_items else None
    return item_service.get_lost_items(db, filters, user_id=user_id)

@router.get("/found", response_model=List[FoundItemResponse])
def get_found_items(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    my_items: bool = Query(False),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetch found items with optional filters."""
    filters = ItemQueryFilter(category=category, status=status, search=search)
    user_id = current_user.id if my_items else None
    return item_service.get_found_items(db, filters, user_id=user_id)
