from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
import uuid

from models.schemas import GameSessionCreate, GameSessionResponse
from services.cognitive_engine import calculate_engagement_score, adjust_difficulty, get_positive_feedback

router = APIRouter(prefix="", tags=["Games"])

# In-memory storage for demo and offline server mode
SESSION_STORE = []

@router.post("/analyze-session", response_model=GameSessionResponse)
async def analyze_session(session: GameSessionCreate):
    """
    Analyzes a completed game session, computes the engagement score, and calculates difficulty transition.
    """
    try:
        engagement_score = calculate_engagement_score(
            accuracy=session.accuracy,
            completion_rate=session.completion_rate,
            consistency=0.92, # Estimated based on steady daily engagement
            response_time_seconds=session.response_time_seconds
        )

        next_diff, reason = adjust_difficulty(
            current_difficulty=session.difficulty,
            accuracy=session.accuracy,
            completion_rate=session.completion_rate
        )

        feedback_msg = get_positive_feedback(session.language_used)
        session_id = str(uuid.uuid4())
        recorded_time = session.completed_at or datetime.now(timezone.utc)

        record = {
            "session_id": session_id,
            "patient_id": session.patient_id,
            "game_id": session.game_id,
            "difficulty": session.difficulty,
            "accuracy": session.accuracy,
            "completion_rate": session.completion_rate,
            "response_time_seconds": session.response_time_seconds,
            "engagement_score": engagement_score,
            "next_difficulty": next_diff,
            "feedback_message": feedback_msg,
            "recorded_at": recorded_time
        }
        SESSION_STORE.append(record)

        return GameSessionResponse(
            session_id=session_id,
            patient_id=session.patient_id,
            game_id=session.game_id,
            difficulty=session.difficulty,
            engagement_score=engagement_score,
            next_difficulty=next_diff,
            feedback_message=f"{feedback_msg} {reason}",
            recorded_at=recorded_time
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
