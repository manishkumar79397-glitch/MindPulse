from fastapi import APIRouter
from datetime import datetime, timezone
import uuid

from models.schemas import EmergencyRequest, EmergencyResponse

router = APIRouter(prefix="", tags=["Emergency"])

SOS_LOGS = []

@router.post("/emergency", response_model=EmergencyResponse)
async def trigger_emergency_alert(req: EmergencyRequest):
    """
    Creates an urgent SOS event, generates Google Maps location link, and simulates notifying registered caregivers.
    """
    alert_id = str(uuid.uuid4())
    ts = datetime.now(timezone.utc).isoformat()

    lat = req.latitude or 26.1445  # Default Guwahati coordinates if missing
    lng = req.longitude or 91.7362
    maps_url = f"https://www.google.com/maps/search/?api=1&query={lat},{lng}"

    # Registered contacts to alert
    caregivers = [
        {"name": "Priyanka Sharma (Daughter)", "phone": "+919876543210", "channel": "SMS & WhatsApp"},
        {"name": "Dr. Baruah (Family Doctor)", "phone": "+919811223344", "channel": "Emergency Alert"}
    ]

    event = {
        "alert_id": alert_id,
        "patient_id": req.patient_id,
        "patient_name": "Aai (Anjali Sharma)",
        "latitude": lat,
        "longitude": lng,
        "location_name": req.location_name,
        "maps_url": maps_url,
        "status": "SENT",
        "trigger_type": req.trigger_type,
        "caregivers_notified": caregivers,
        "timestamp": ts
    }
    SOS_LOGS.append(event)

    return EmergencyResponse(
        alert_id=alert_id,
        patient_id=req.patient_id,
        patient_name="Aai (Anjali Sharma)",
        status="SENT",
        message="Emergency alerts dispatched to caregivers with GPS location.",
        caregivers_notified=caregivers,
        maps_url=maps_url,
        timestamp=ts
    )
