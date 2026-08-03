from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from backend.models.user import User
from backend.schemas.auth import RegisterRequest, LoginRequest, PasswordChangeRequest, Token
from backend.utils.security import hash_password, verify_password, create_access_token

class AuthService:
    """Service for user authentication, registration, password hashing, and token issuance."""

    @staticmethod
    def register_user(db: Session, request: RegisterRequest) -> User:
        """Register a new user after validating email uniqueness."""
        existing_user = db.query(User).filter(User.email == request.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )

        hashed = hash_password(request.password)
        new_user = User(
            name=request.name,
            email=request.email,
            hashed_password=hashed,
            role="user"
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    @staticmethod
    def authenticate_user(db: Session, request: LoginRequest) -> Token:
        """Authenticate user credentials and issue JWT token."""
        user = db.query(User).filter(User.email == request.email).first()
        if not user or not verify_password(request.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive"
            )

        access_token = create_access_token(
            data={"sub": user.email, "role": user.role, "user_id": user.id}
        )

        return Token(
            access_token=access_token,
            token_type="bearer",
            user_id=user.id,
            name=user.name,
            email=user.email,
            role=user.role
        )

    @staticmethod
    def change_password(db: Session, user: User, request: PasswordChangeRequest) -> bool:
        """Change user password after verifying current password."""
        if not verify_password(request.current_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect current password"
            )

        user.hashed_password = hash_password(request.new_password)
        db.commit()
        return True

auth_service = AuthService()
