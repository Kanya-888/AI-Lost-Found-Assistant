import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class Match(Base):
    """Match ORM entity storing AI matching records between lost and found items."""
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    lost_item_id = Column(Integer, ForeignKey("lost_items.id"), nullable=False)
    found_item_id = Column(Integer, ForeignKey("found_items.id"), nullable=False)
    similarity_score = Column(Float, nullable=False)  # Overall combined confidence score (0.0 - 1.0)
    text_score = Column(Float, nullable=False)        # Text similarity score
    image_score = Column(Float, nullable=False)       # Image similarity score
    status = Column(String(30), default="pending", nullable=False)  # 'pending', 'matched', 'rejected'
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    # Relationships
    lost_item = relationship("LostItem", back_populates="matches")
    found_item = relationship("FoundItem", back_populates="matches")
    notifications = relationship("Notification", back_populates="match", cascade="all, delete-orphan")
