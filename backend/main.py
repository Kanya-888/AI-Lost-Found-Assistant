import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.config import settings
from backend.database import engine, Base, SessionLocal
from backend.models.user import User
from backend.utils.security import hash_password

# Import routers
from backend.routes.auth import router as auth_router
from backend.routes.items import router as items_router
from backend.routes.matches import router as matches_router
from backend.routes.dashboard import router as dashboard_router
from backend.routes.profile import router as profile_router
from backend.routes.admin import router as admin_router

# Initialize database tables
Base.metadata.create_all(bind=engine)

def seed_default_admin():
    """Seed initial administrator account if no users exist in database."""
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin:
            admin_user = User(
                name="System Admin",
                email="admin@example.com",
                hashed_password=hash_password("admin123"),
                role="admin",
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            print("[Backend Startup] Created default admin account: admin@example.com / admin123")
    except Exception as e:
        print(f"[Backend Startup Error] Admin seed failed: {e}")
    finally:
        db.close()

# Run seed on module import/startup
seed_default_admin()

app = FastAPI(
    title=settings.APP_NAME,
    description="Production-Grade AI Lost & Found Platform using SentenceTransformers, OpenCLIP, and FAISS",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Mount static file route for uploaded item images
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth_router)
app.include_router(items_router)
app.include_router(matches_router)
app.include_router(dashboard_router)
app.include_router(profile_router)
app.include_router(admin_router)

@app.get("/", tags=["Health Check"])
def root():
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "docs_url": "/docs",
        "ai_engine": "SentenceTransformers (all-MiniLM-L6-v2) + OpenCLIP (ViT-B/32) + FAISS Vector Search"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
