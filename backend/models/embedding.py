import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from backend.database import Base

class ItemEmbedding(Base):
    """ItemEmbedding ORM entity storing JSON-serialized vectors for fast lookup and rebuilds."""
    __tablename__ = "embeddings"

    id = Column(Integer, primary_key=True, index=True)
    item_type = Column(String(10), nullable=False)  # 'lost' or 'found'
    item_id = Column(Integer, nullable=False, index=True)
    text_vector = Column(Text, nullable=True)   # JSON string of float list
    image_vector = Column(Text, nullable=True)  # JSON string of float list
    combined_vector = Column(Text, nullable=True) # Combined vector for FAISS search
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
