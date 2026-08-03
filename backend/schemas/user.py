import datetime
from pydantic import BaseModel, EmailStr

class UserResponse(BaseModel):
    """Public user response schema."""
    id: int
    name: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    """Payload for updating user profile."""
    name: str | None = None
    email: EmailStr | None = None
