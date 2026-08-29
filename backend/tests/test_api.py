import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_analyze_session_endpoint():
    payload = {
        "patient_id": "a1b2c3d4-0000-0000-0000-000000000001",
        "game_id": "pehchano_kaun",
        "difficulty": 1,
        "accuracy": 0.90,
        "completion_rate": 1.0,
        "response_time_seconds": 6.5,
        "hints_used": 0,
        "language_used": "hi"
    }
    response = client.post("/analyze-session", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["next_difficulty"] == 2
    assert data["engagement_score"] > 80.0
    assert "feedback_message" in data

def test_recommend_game_endpoint():
    payload = {
        "patient_id": "a1b2c3d4-0000-0000-0000-000000000001",
        "current_game_id": "pehchano_kaun",
        "current_difficulty": 2,
        "language": "hi"
    }
    response = client.post("/recommend-game", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["recommended_game_id"] == "ghar_ki_cheezein"
    assert "voice_prompt" in data

def test_voice_intent_endpoint():
    payload = {
        "patient_id": "a1b2c3d4-0000-0000-0000-000000000001",
        "transcript": "Subah ki dawa ka samay kab hai?",
        "language": "hi"
    }
    response = client.post("/voice/intent", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["detected_intent"] == "NEXT_REMINDER"
    assert "dawa" in data["spoken_response"].lower() or "medicine" in data["spoken_response"].lower() or "amlodipine" in data["spoken_response"].lower()

def test_emergency_alert_endpoint():
    payload = {
        "patient_id": "a1b2c3d4-0000-0000-0000-000000000001",
        "latitude": 26.1445,
        "longitude": 91.7362,
        "location_name": "Guwahati Residence"
    }
    response = client.post("/emergency", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SENT"
    assert len(data["caregivers_notified"]) > 0
    assert "google.com/maps" in data["maps_url"]

def test_patient_summary_endpoint():
    response = client.get("/patient/a1b2c3d4-0000-0000-0000-000000000001/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Aai (Anjali Sharma)"
    assert len(data["recent_sessions"]) > 0
    assert len(data["active_reminders"]) > 0
