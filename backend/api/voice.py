from fastapi import APIRouter
from models.schemas import VoiceIntentRequest, VoiceIntentResponse
from services.voice_service import parse_voice_transcript

router = APIRouter(prefix="", tags=["Voice"])

@router.post("/voice/intent", response_model=VoiceIntentResponse)
async def process_voice_intent(req: VoiceIntentRequest):
    """
    Parses speech transcript into an intent and returns an elderly-friendly spoken audio prompt.
    """
    parsed = parse_voice_transcript(req.transcript, language=req.language)

    return VoiceIntentResponse(
        detected_intent=parsed["detected_intent"],
        spoken_response=parsed["spoken_response"],
        action=parsed["action"],
        action_data=parsed["action_data"]
    )

