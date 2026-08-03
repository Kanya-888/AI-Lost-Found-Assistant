import datetime
from pydantic import BaseModel
from backend.schemas.item import LostItemResponse, FoundItemResponse

class MatchResponse(BaseModel):
    """Response model for item match results."""
    id: int
    lost_item_id: int
    found_item_id: int
    similarity_score: float
    text_score: float
    image_score: float
    status: str
    created_at: datetime.datetime
    lost_item: LostItemResponse | None = None
    found_item: FoundItemResponse | None = None

    class Config:
        from_attributes = True

class MatchStatusUpdate(BaseModel):
    """Payload to update match status (confirmed / rejected)."""
    status: str  # 'matched' or 'rejected'
