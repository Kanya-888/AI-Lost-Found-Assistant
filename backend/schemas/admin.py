from pydantic import BaseModel

class AdminStatsResponse(BaseModel):
    """Analytics response for admin dashboard."""
    total_users: int
    total_lost_items: int
    total_found_items: int
    total_matches: int
    pending_matches: int
    confirmed_matches: int
    rejected_matches: int

class SystemMetricsResponse(BaseModel):
    """System health & FAISS vector index status metrics."""
    total_embeddings: int
    faiss_index_size: int
    storage_used_mb: float
    ai_engine_status: str
