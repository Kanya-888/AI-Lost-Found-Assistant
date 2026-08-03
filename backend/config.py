import os
from pathlib import Path
from pydantic_settings import BaseSettings

# Build paths inside the project like this: BASE_DIR / 'subfolder'
BASE_DIR = Path(__file__).resolve().parent

class Settings(BaseSettings):
    """System configuration settings loaded from environment variables."""
    APP_NAME: str = "AI Lost & Found Assistant"
    ENV: str = "development"
    PORT: int = 8000
    
    # Security & JWT
    SECRET_KEY: str = "super-secret-jwt-key-please-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database
    DATABASE_URL: str = f"sqlite:///{BASE_DIR}/lost_and_found.db"
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "*"
    ]

    
    # Email SMTP (Gmail)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM_NAME: str = "AI Lost & Found System"
    
    # AI Engine & Vector Settings
    MATCH_THRESHOLD: float = 0.80  # 80% confidence score
    FAISS_INDEX_DIR: str = str(BASE_DIR / "embeddings" / "faiss_data")
    UPLOAD_DIR: str = str(BASE_DIR / "uploads")
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Ensure required directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.FAISS_INDEX_DIR, exist_ok=True)
