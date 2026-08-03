from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.user import User
from backend.schemas.user import UserResponse
from backend.schemas.admin import AdminStatsResponse, SystemMetricsResponse
from backend.services.admin_service import admin_service
from backend.utils.security import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin Operations"])

@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_dashboard_stats(
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Retrieve overall system analytics for admin dashboard."""
    return admin_service.get_dashboard_stats(db)

@router.get("/metrics", response_model=SystemMetricsResponse)
def get_system_metrics(
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Retrieve FAISS vector index status and upload disk usage."""
    return admin_service.get_system_metrics(db)

@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Retrieve list of all registered platform users."""
    return db.query(User).order_by(User.created_at.desc()).all()

@router.delete("/reports/{item_type}/{item_id}")
def delete_spam_report(
    item_type: str,
    item_id: int,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a spam or invalid lost/found item report."""
    if item_type not in ["lost", "found"]:
        raise HTTPException(status_code=400, detail="Invalid item_type. Must be 'lost' or 'found'")

    success = admin_service.delete_spam_report(db, item_type, item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Report not found")

    return {"message": f"Successfully deleted {item_type} report #{item_id}"}
