import datetime
from pydantic import BaseModel, Field
from backend.schemas.user import UserResponse

class LostItemCreate(BaseModel):
    """Payload to create a Lost Item."""
    name: str = Field(..., min_length=2, max_length=150)
    category: str = Field(..., min_length=2, max_length=50)
    description: str = Field(..., min_length=5)
    date_lost: str = Field(..., example="2026-08-01")
    location: str = Field(..., min_length=2, max_length=200)

class FoundItemCreate(BaseModel):
    """Payload to create a Found Item."""
    name: str = Field(..., min_length=2, max_length=150)
    category: str = Field(..., min_length=2, max_length=50)
    description: str = Field(..., min_length=5)
    date_found: str = Field(..., example="2026-08-02")
    location: str = Field(..., min_length=2, max_length=200)

class LostItemResponse(BaseModel):
    """Response model for a Lost Item."""
    id: int
    user_id: int
    name: str
    category: str
    description: str
    date_lost: str
    location: str
    image_path: str | None = None
    status: str
    created_at: datetime.datetime
    owner: UserResponse | None = None

    class Config:
        from_attributes = True

class FoundItemResponse(BaseModel):
    """Response model for a Found Item."""
    id: int
    user_id: int
    name: str
    category: str
    description: str
    date_found: str
    location: str
    image_path: str | None = None
    status: str
    created_at: datetime.datetime
    finder: UserResponse | None = None

    class Config:
        from_attributes = True

class ItemQueryFilter(BaseModel):
    """Query parameters for filtering lost and found items."""
    category: str | None = None
    status: str | None = None
    search: str | None = None
