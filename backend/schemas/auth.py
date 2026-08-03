from pydantic import BaseModel, EmailStr, Field, field_validator

class RegisterRequest(BaseModel):
    """Payload for user registration."""
    name: str = Field(..., min_length=1, max_length=100, example="John Doe")
    email: EmailStr = Field(..., example="john@example.com")
    password: str = Field(..., min_length=4, max_length=100, example="secret123")
    confirm_password: str | None = None


class LoginRequest(BaseModel):
    """Payload for user login."""
    email: EmailStr = Field(..., example="john@example.com")
    password: str = Field(..., example="secret123")

class PasswordChangeRequest(BaseModel):
    """Payload for changing password."""
    current_password: str = Field(..., min_length=6)
    new_password: str = Field(..., min_length=6)

class Token(BaseModel):
    """JWT Token response payload."""
    access_token: str
    token_type: str = "bearer"
    user_id: int
    name: str
    email: str
    role: str

class TokenData(BaseModel):
    """JWT Token decoded payload data."""
    email: str | None = None
    role: str | None = None
