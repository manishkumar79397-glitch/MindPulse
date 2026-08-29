from fastapi import APIRouter
from models.schemas import RecommendGameRequest, RecommendGameResponse
from services.recommendation_service import recommend_next_game

router = APIRouter(prefix="", tags=["Recommendations"])

@router.post("/recommend-game", response_model=RecommendGameResponse)
async def get_recommended_game(req: RecommendGameRequest):
    """
    Recommends the next complementary game based on variety and difficulty level.
    """
    rec = recommend_next_game(
        current_game_id=req.current_game_id,
        current_difficulty=req.current_difficulty,
        language=req.language
    )

    return RecommendGameResponse(
        patient_id=req.patient_id,
        recommended_game_id=rec["recommended_game_id"],
        recommended_game_name=rec["recommended_game_name"],
        category=rec["category"],
        difficulty=rec["difficulty"],
        rationale=rec["rationale"],
        voice_prompt=rec["voice_prompt"]
    )

