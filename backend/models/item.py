import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class LostItem(Base):
    """LostItem ORM entity representing an item reported lost by a user."""
    __tablename__ = "lost_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(150), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)
    description = Column(Text, nullable=False)
    date_lost = Column(String(50), nullable=False)
    location = Column(String(200), nullable=False)
    image_path = Column(String(300), nullable=True)
    status = Column(String(30), default="pending", nullable=False)  # 'pending', 'matched', 'resolved', 'spam'
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    # Relationships
    owner = relationship("User", back_populates="lost_items")
    matches = relationship("Match", back_populates="lost_item", cascade="all, delete-orphan")


class FoundItem(Base):
    """FoundItem ORM entity representing an item reported found by a user."""
    __tablename__ = "found_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(150), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)
    description = Column(Text, nullable=False)
    date_found = Column(String(50), nullable=False)
    location = Column(String(200), nullable=False)
    image_path = Column(String(300), nullable=True)
    status = Column(String(30), default="pending", nullable=False)  # 'pending', 'matched', 'resolved', 'spam'
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    # Relationships
    finder = relationship("User", back_populates="found_items")
    matches = relationship("Match", back_populates="found_item", cascade="all, delete-orphan")
