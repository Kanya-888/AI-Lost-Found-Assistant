from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.user import User
from backend.models.item import LostItem, FoundItem
from backend.models.match import Match
from backend.schemas.item import LostItemResponse, FoundItemResponse
from backend.utils.security import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("")
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get user dashboard summary metrics:
    - Number of Lost Items
    - Number of Found Items
    - Matched Items
    - Pending Reports
    - Recent Reports Activity Stream
    """
    user_id = current_user.id

    # User specific metrics
    user_lost_count = db.query(LostItem).filter(LostItem.user_id == user_id).count()
    user_found_count = db.query(FoundItem).filter(FoundItem.user_id == user_id).count()
    
    # Global / User match metrics
    matched_count = db.query(Match).filter(Match.status == "matched").count()
    pending_reports_count = (
        db.query(LostItem).filter(LostItem.status == "pending").count() +
        db.query(FoundItem).filter(FoundItem.status == "pending").count()
    )

    # Recent 5 lost reports
    recent_lost = db.query(LostItem).order_by(LostItem.created_at.desc()).limit(5).all()
    # Recent 5 found reports
    recent_found = db.query(FoundItem).order_by(FoundItem.created_at.desc()).limit(5).all()

    return {
        "stats": {
            "user_lost_items": user_lost_count,
            "user_found_items": user_found_count,
            "total_matched_items": matched_count,
            "pending_reports": pending_reports_count,
            "global_lost_count": db.query(LostItem).count(),
            "global_found_count": db.query(FoundItem).count()
        },
        "recent_lost_reports": [LostItemResponse.model_validate(item) for item in recent_lost],
        "recent_found_reports": [FoundItemResponse.model_validate(item) for item in recent_found]
    }
