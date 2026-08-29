from fastapi import APIRouter
from datetime import datetime, timedelta, timezone
from typing import Dict, Any

from models.schemas import CaregiverPatientSummary

router = APIRouter(prefix="", tags=["Patients"])

@router.get("/patient/{patient_id}/summary", response_model=CaregiverPatientSummary)
async def get_patient_summary(patient_id: str):
    """
    Returns aggregated engagement data, reminder adherence, recent game sessions, and alert status for the Caregiver Dashboard.
    Strictly non-diagnostic engagement analytics.
    """
    now = datetime.now(timezone.utc)
    
    recent_sessions = [
        {
            "game_id": "pehchano_kaun",
            "game_name": "Pehchano Kaun? (Family Memory)",
            "difficulty": 2,
            "accuracy": 0.88,
            "completion_rate": 1.0,
            "response_time_seconds": 6.8,
            "engagement_score": 89.2,
            "completed_at": (now - timedelta(hours=2)).isoformat()
        },
        {
            "game_id": "dawa_subah_routine",
            "game_name": "Dawa Aur Routine (Sequencing)",
            "difficulty": 2,
            "accuracy": 0.82,
            "completion_rate": 0.90,
            "response_time_seconds": 7.4,
            "engagement_score": 83.5,
            "completed_at": (now - timedelta(hours=5)).isoformat()
        },
        {
            "game_id": "ghar_ki_cheezein",
            "game_name": "Ghar Ki Cheezein (Object Matching)",
            "difficulty": 1,
            "accuracy": 0.95,
            "completion_rate": 1.0,
            "response_time_seconds": 5.2,
            "engagement_score": 93.8,
            "completed_at": (now - timedelta(days=1)).isoformat()
        }
    ]

    active_reminders = [
        {
            "id": "rem-1",
            "title": "Morning BP Medicine (Amlodipine)",
            "time_of_day": "08:30 AM",
            "status": "TAKEN",
            "category": "medicine"
        },
        {
            "id": "rem-2",
            "title": "Afternoon Hydration & Garden Walk",
            "time_of_day": "04:00 PM",
            "status": "COMPLETED",
            "category": "hydration"
        },
        {
            "id": "rem-3",
            "title": "Night Calcium & Warm Milk",
            "time_of_day": "08:30 PM",
            "status": "PENDING",
            "category": "medicine"
        }
    ]

    recent_sos = [
        {
            "id": "sos-drill-1",
            "trigger_type": "Safety Drill Test",
            "location_name": "Home, Guwahati",
            "time": (now - timedelta(days=2)).strftime("%d %b %Y, %I:%M %p"),
            "status": "RESOLVED"
        }
    ]

    return CaregiverPatientSummary(
        patient_id=patient_id,
        name="Aai (Anjali Sharma)",
        age=76,
        preferred_language="hi",
        total_games_played=28,
        average_engagement_score=87.4,
        current_difficulty_level=2,
        routine_adherence_rate=0.94, # 94% medicine and routine adherence
        last_active_at=now - timedelta(hours=2),
        recent_sessions=recent_sessions,
        active_reminders=active_reminders,
        recent_sos_alerts=recent_sos
    )
