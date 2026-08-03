from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.user import User
from backend.models.match import Match
from backend.schemas.match import MatchResponse, MatchStatusUpdate
from backend.services.matching_service import matching_engine
from backend.services.ai_service import ai_service
from backend.services.faiss_service import faiss_service
from backend.utils.security import get_current_user

router = APIRouter(prefix="/api/matches", tags=["AI Matching & History"])

@router.get("", response_model=List[MatchResponse])
def get_user_matches(
    status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve AI matches associated with the authenticated user's reports."""
    matches = matching_engine.get_user_matches(db, current_user.id)
    if status:
        matches = [m for m in matches if m.status == status]
    return matches

@router.put("/{match_id}/status", response_model=MatchResponse)
def update_match_status(
    match_id: int,
    payload: MatchStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update match resolution status (e.g. 'matched' or 'rejected')."""
    match_record = db.query(Match).filter(Match.id == match_id).first()
    if not match_record:
        raise HTTPException(status_code=404, detail="Match record not found")

    match_record.status = payload.status
    if payload.status == "rejected":
        # Reset items back to pending if rejected
        if match_record.lost_item:
            match_record.lost_item.status = "pending"
        if match_record.found_item:
            match_record.found_item.status = "pending"

    db.commit()
    db.refresh(match_record)
    return match_record

@router.post("/vector-search")
def perform_vector_search(
    query_text: str = Query(...),
    target_type: str = Query("found"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Perform real-time FAISS nearest neighbor vector search
    for arbitrary search text across lost/found vector embeddings.
    """
    # Generate query embedding
    query_vec = ai_service.generate_text_embedding(query_text)
    
    # Query FAISS index for top 5 candidates
    nearest = faiss_service.search_nearest_neighbors(query_vec, target_type=target_type, k=5)
    
    results = []
    for item_id, score in nearest:
        if target_type == "found":
            item = db.query(Match).filter(Match.found_item_id == item_id).first()
        else:
            item = db.query(Match).filter(Match.lost_item_id == item_id).first()
        
        results.append({
            "item_id": item_id,
            "similarity_score": round(score, 4),
            "similarity_percentage": round(score * 100, 1)
        })

    return {
        "query": query_text,
        "target_type": target_type,
        "top_matches": results
    }
