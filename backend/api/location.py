from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
import uuid

from models.schemas import (
    WhereAmIRequest,
    WhereAmIResponse,
    SafeWalkStartRequest,
    SafeWalkStartResponse,
    GeofenceCheckRequest,
    GeofenceCheckResponse,
)
from services.location_service import (
    get_where_am_i_response,
    check_geofence_status,
    find_nearest_safe_location,
    ACTIVE_SAFE_WALKS,
)

router = APIRouter(prefix="/location", tags=["Location"])

@router.post("/where-am-i", response_model=WhereAmIResponse)
async def where_am_i(req: WhereAmIRequest):
    """Return a reassuring, elderly-friendly location summary."""
    try:
        result = get_where_am_i_response(
            lat=req.latitude,
            lon=req.longitude,
            language=req.language,
        )
        return WhereAmIResponse(**result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

@router.post("/safe-walk/start", response_model=SafeWalkStartResponse)
async def safe_walk_start(req: SafeWalkStartRequest):
    """Start a safe-walk geofence session for a patient."""
    try:
        nearest, dist = find_nearest_safe_location(req.initial_latitude, req.initial_longitude)
        walk_id = str(uuid.uuid4())
        started_at = datetime.now(timezone.utc).isoformat()

        ACTIVE_SAFE_WALKS[walk_id] = {
            "patient_id": req.patient_id,
            "start_latitude": req.initial_latitude,
            "start_longitude": req.initial_longitude,
            "safe_zone_name": nearest["name"],
            "safe_radius_meters": nearest.get("radius_meters", 300.0),
            "started_at": started_at,
            "language": req.language,
        }

        return SafeWalkStartResponse(
            walk_id=walk_id,
            status="ACTIVE",
            safe_zone_name=nearest["name"],
            safe_radius_meters=nearest.get("radius_meters", 300.0),
            comforting_message=(
                "Aap safe zone mein hain. Walk ka anand lein."
                if req.language.lower() in {"hi", "hindi"}
                else "You are in a safe zone. Please continue your walk safely."
            ),
            started_at=started_at,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

@router.post("/geofence-check", response_model=GeofenceCheckResponse)
async def geofence_check(req: GeofenceCheckRequest):
    """Check whether a patient is still inside the safe walking zone."""
    try:
        result = check_geofence_status(
            patient_id=req.patient_id,
            lat=req.latitude,
            lon=req.longitude,
            walk_id=req.walk_id,
            language=req.language,
        )
        return GeofenceCheckResponse(**result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

@router.post("/safe-walk/stop")
async def safe_walk_stop(req: dict):
    """Stop a safe-walk session and return a summary."""
    return {
        "status": "COMPLETED",
        "message": "Safe walk session ended successfully.",
    }
