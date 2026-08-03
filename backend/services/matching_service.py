import json
from typing import List, Tuple, Optional
from sqlalchemy.orm import Session
from backend.config import settings
from backend.models.item import LostItem, FoundItem
from backend.models.embedding import ItemEmbedding
from backend.models.match import Match
from backend.models.notification import Notification
from backend.services.ai_service import ai_service
from backend.services.faiss_service import faiss_service
from backend.services.email_service import email_service

class AIMatchingEngine:
    """
    AI Matching Engine combining SentenceTransformers text similarity
    and OpenCLIP image similarity with FAISS candidate retrieval.
    """

    @staticmethod
    def process_new_item_matches(db: Session, item_type: str, item_id: int) -> List[Match]:
        """
        Evaluate candidate matches for a newly reported item.
        If confidence > MATCH_THRESHOLD (80%), create match & notify owner.
        """
        created_matches = []

        # Retrieve source item and target candidate type
        if item_type == "lost":
            source_item = db.query(LostItem).filter(LostItem.id == item_id).first()
            target_type = "found"
        else:
            source_item = db.query(FoundItem).filter(FoundItem.id == item_id).first()
            target_type = "lost"

        if not source_item:
            return []

        # Fetch source item embedding
        source_emb = db.query(ItemEmbedding).filter(
            ItemEmbedding.item_type == item_type,
            ItemEmbedding.item_id == item_id
        ).first()

        if not source_emb or not source_emb.text_vector:
            return []

        source_text_vec = json.loads(source_emb.text_vector)
        source_img_vec = json.loads(source_emb.image_vector) if source_emb.image_vector else None

        # Query FAISS for top 5 nearest candidates
        neighbors = faiss_service.search_nearest_neighbors(
            query_vector=source_text_vec,
            target_type=target_type,
            k=5
        )

        for cand_id, approx_score in neighbors:
            # Avoid duplicate matches
            if item_type == "lost":
                existing = db.query(Match).filter(
                    Match.lost_item_id == item_id,
                    Match.found_item_id == cand_id
                ).first()
                lost_obj = source_item
                found_obj = db.query(FoundItem).filter(FoundItem.id == cand_id).first()
            else:
                existing = db.query(Match).filter(
                    Match.lost_item_id == cand_id,
                    Match.found_item_id == item_id
                ).first()
                found_obj = source_item
                lost_obj = db.query(LostItem).filter(LostItem.id == cand_id).first()

            if existing or not lost_obj or not found_obj:
                continue

            # Fetch candidate embedding
            cand_emb = db.query(ItemEmbedding).filter(
                ItemEmbedding.item_type == target_type,
                ItemEmbedding.item_id == cand_id
            ).first()

            if not cand_emb:
                continue

            cand_text_vec = json.loads(cand_emb.text_vector)
            cand_img_vec = json.loads(cand_emb.image_vector) if cand_emb.image_vector else None

            # Calculate precise Text Similarity
            text_sim = ai_service.calculate_cosine_similarity(source_text_vec, cand_text_vec)

            # Calculate precise Image Similarity if both items have uploaded images
            has_img_source = source_img_vec is not None and bool(source_item.image_path)
            has_img_cand = cand_img_vec is not None and bool(found_obj.image_path if item_type == "lost" else lost_obj.image_path)

            if has_img_source and has_img_cand:
                image_sim = ai_service.calculate_cosine_similarity(source_img_vec, cand_img_vec)
            else:
                image_sim = text_sim  # Default fallback to text similarity

            # Combine scores (50% text + 50% image if available, else 100% text)
            combined_confidence = ai_service.combine_scores(
                text_score=text_sim,
                image_score=image_sim,
                has_image_a=has_img_source,
                has_image_b=has_img_cand
            )

            # Evaluate threshold (> 80%)
            if combined_confidence >= settings.MATCH_THRESHOLD:
                match_record = Match(
                    lost_item_id=lost_obj.id,
                    found_item_id=found_obj.id,
                    similarity_score=round(combined_confidence, 4),
                    text_score=round(text_sim, 4),
                    image_score=round(image_sim, 4),
                    status="matched"
                )
                db.add(match_record)
                
                # Update item statuses
                lost_obj.status = "matched"
                found_obj.status = "matched"
                db.commit()
                db.refresh(match_record)

                created_matches.append(match_record)

                # Send email notification to owner of the lost item
                owner = lost_obj.owner
                if owner:
                    sent_ok = email_service.send_match_notification(
                        recipient_email=owner.email,
                        user_name=owner.name,
                        lost_item=lost_obj,
                        found_item=found_obj,
                        similarity_score=combined_confidence
                    )
                    
                    # Record notification log
                    notification = Notification(
                        user_id=owner.id,
                        match_id=match_record.id,
                        recipient_email=owner.email,
                        email_sent=sent_ok,
                        message=f"Match notification sent for item '{lost_obj.name}' with {round(combined_confidence*100,1)}% score."
                    )
                    db.add(notification)
                    db.commit()

        return created_matches

    @staticmethod
    def get_user_matches(db: Session, user_id: int) -> List[Match]:
        """Fetch all matches relevant to a specific user's lost or found items."""
        return db.query(Match).join(LostItem).filter(
            (LostItem.user_id == user_id) | (Match.found_item.has(user_id=user_id))
        ).order_by(Match.created_at.desc()).all()

matching_engine = AIMatchingEngine()
