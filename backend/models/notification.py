import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class Notification(Base):
    """Notification ORM entity recording email notification dispatch history."""
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=False)
    recipient_email = Column(String(150), nullable=False)
    email_sent = Column(Boolean, default=False, nullable=False)
    message = Column(String(500), nullable=True)
    sent_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="notifications")
    match = relationship("Match", back_populates="notifications")
