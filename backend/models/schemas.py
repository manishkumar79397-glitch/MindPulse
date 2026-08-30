from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class GameCategory(str, Enum):
    MEMORY = "memory"
    SEQUENCING = "sequencing"
    MATCHING = "matching"
    CULTURAL = "cultural"
    MOTOR = "motor"

class LanguageEnum(str, Enum):
    HINDI = "hi"
    ENGLISH = "en"
    ASSAMESE = "as"
    MANIPURI = "mni"
    KHASI = "kha"

# Game Session Model
class GameSessionCreate(BaseModel):
    patient_id: str
    game_id: str
    difficulty: int = Field(default=1, ge=1, le=4)
    accuracy: float = Field(..., ge=0.0, le=1.0, description="Accuracy between 0.0 and 1.0")
    completion_rate: float = Field(..., ge=0.0, le=1.0, description="Completion rate between 0.0 and 1.0")
    response_time_seconds: float = Field(..., ge=0.0, description="Average response time in seconds")
    hints_used: int = 0
    language_used: str = "hi"
    completed_at: Optional[datetime] = None

class GameSessionResponse(BaseModel):
    session_id: str
    patient_id: str
    game_id: str
    difficulty: int
    engagement_score: float
    next_difficulty: int
    feedback_message: str
    recorded_at: datetime

# Recommendation Model
class RecommendGameRequest(BaseModel):
    patient_id: str
    current_game_id: Optional[str] = None
    recent_accuracy: Optional[float] = None
    recent_completion: Optional[float] = None
    recent_response_time: Optional[float] = None
    current_difficulty: int = 1
    language: str = "hi"

class RecommendGameResponse(BaseModel):
    patient_id: str
    recommended_game_id: str
    recommended_game_name: str
    category: str
    difficulty: int
    rationale: str
    voice_prompt: str

# Sync Engine Model
class SyncQueueItem(BaseModel):
    local_id: str
    entity_type: str  # 'game_session', 'reminder_status', 'daily_activity', 'sos_event'
    operation: str    # 'INSERT', 'UPDATE', 'DELETE'
    payload: Dict[str, Any]
    created_at: str

class SyncBatchRequest(BaseModel):
    patient_id: str
    client_timestamp: str
    items: List[SyncQueueItem]

class SyncBatchResponse(BaseModel):
    success: bool
    processed_count: int
    synced_ids: List[str]
    failed_ids: List[str] = []
    server_timestamp: str

# Voice Assistant Model
class VoiceIntentRequest(BaseModel):
    patient_id: str
    transcript: str
    language: str = "hi"

class VoiceIntentResponse(BaseModel):
    detected_intent: str # 'NEXT_REMINDER', 'PLAY_GAME', 'CALL_CAREGIVER', 'TELL_STORY', 'UNKNOWN'
    spoken_response: str
    action: Optional[str] = None
    action_data: Optional[Dict[str, Any]] = None

# Emergency SOS Model
class EmergencyRequest(BaseModel):
    patient_id: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_name: Optional[str] = "Guwahati, Assam"
    trigger_type: str = "manual_sos" # 'manual_sos', 'test_drill'

class EmergencyResponse(BaseModel):
    alert_id: str
    patient_id: str
    patient_name: str
    status: str
    message: str
    caregivers_notified: List[Dict[str, str]]
    maps_url: Optional[str] = None
    timestamp: str

# Caregiver Summary Models
class CaregiverPatientSummary(BaseModel):
    patient_id: str
    name: str
    age: int
    preferred_language: str
    total_games_played: int
    average_engagement_score: float
    current_difficulty_level: int
    routine_adherence_rate: float
    last_active_at: Optional[datetime] = None
    recent_sessions: List[Dict[str, Any]]
    active_reminders: List[Dict[str, Any]]
    recent_sos_alerts: List[Dict[str, Any]]

# Safe Locations & Geofencing Models
class SafeLocation(BaseModel):
    id: str
    patient_id: str
    name: str  # e.g., "Ghar (Home)", "Nehru Park", "Dr. Baruah Clinic"
    category: str = "home" # 'home', 'park', 'clinic', 'temple', 'community'
    latitude: float
    longitude: float
    radius_meters: float = 300.0  # Safe perimeter radius in meters
    icon: str = "🏠"
    address: Optional[str] = "Guwahati, Assam"

class WhereAmIRequest(BaseModel):
    patient_id: str
    latitude: float
    longitude: float
    language: str = "hi"

class WhereAmIResponse(BaseModel):
    status: str # 'INSIDE_SAFE_ZONE', 'NEAR_SAFE_ZONE', 'OUTSIDE_SAFE_ZONE'
    location_name: str # e.g. "Ghar (Home)"
    location_icon: str # "🏠"
    comforting_message: str # e.g. "Aap ghar ke paas hain."
    spoken_audio: str # Spoken audio prompt
    distance_meters: float
    caregiver_name: str # "Amit" or "Priyanka"
    caregiver_phone: str # "+919876543210"
    can_call_caregiver: bool = True

class SafeWalkStartRequest(BaseModel):
    patient_id: str
    initial_latitude: float
    initial_longitude: float
    language: str = "hi"

class SafeWalkStartResponse(BaseModel):
    walk_id: str
    status: str # 'ACTIVE'
    safe_zone_name: str
    safe_radius_meters: float
    comforting_message: str
    started_at: str

class GeofenceCheckRequest(BaseModel):
    patient_id: str
    walk_id: Optional[str] = None
    latitude: float
    longitude: float
    language: str = "hi"

class GeofenceCheckResponse(BaseModel):
    is_inside_safe_zone: bool
    nearest_safe_location: str
    distance_meters: float
    safe_radius_meters: float
    patient_message: str
    spoken_audio: str
    alert_triggered: bool
    alert_details: Optional[Dict[str, Any]] = None

class SafeWalkStopRequest(BaseModel):
    patient_id: str
    walk_id: str
    final_latitude: float
    final_longitude: float
    duration_minutes: int = 15

class SafeWalkStopResponse(BaseModel):
    walk_id: str
    status: str # 'COMPLETED'
    duration_minutes: int
    summary_message: str


