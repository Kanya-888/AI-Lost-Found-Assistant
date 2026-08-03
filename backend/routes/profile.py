from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.user import User
from backend.schemas.user import UserResponse, UserUpdate
from backend.schemas.item import LostItemResponse, FoundItemResponse
from backend.services.item_service import item_service
from backend.utils.security import get_current_user

router = APIRouter(prefix="/api/profile", tags=["User Profile"])

@router.get("", response_model=dict)
def get_profile_details(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve current user profile data and list of submitted reports."""
    lost_items = item_service.get_lost_items(db, filters=type('Filter', (), {'category': None, 'status': None, 'search': None})(), user_id=current_user.id)
    found_items = item_service.get_found_items(db, filters=type('Filter', (), {'category': None, 'status': None, 'search': None})(), user_id=current_user.id)

    return {
        "user": UserResponse.model_validate(current_user),
        "lost_items": [LostItemResponse.model_validate(item) for item in lost_items],
        "found_items": [FoundItemResponse.model_validate(item) for item in found_items]
    }

@router.put("", response_model=UserResponse)
def update_profile(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update profile details (name/email)."""
    if payload.name:
        current_user.name = payload.name
    if payload.email:
        current_user.email = payload.email
    db.commit()
    db.refresh(current_user)
    return current_user
