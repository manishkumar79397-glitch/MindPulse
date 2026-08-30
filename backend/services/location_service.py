"""
ManSaathi Location & Geofencing Service
Implements 'Where Am I?' zero-confusion safety mode and Safe Walk geofence monitoring.
"""

import math
from typing import Dict, Any, List, Optional, Tuple

# Default configured safe locations for demo patient (Guwahati, Assam)
DEFAULT_SAFE_LOCATIONS = [
    {
        "id": "loc-home",
        "patient_id": "a1b2c3d4-0000-0000-0000-000000000001",
        "name": "Ghar (Home)",
        "category": "home",
        "latitude": 26.1445,
        "longitude": 91.7362,
        "radius_meters": 400.0,
        "icon": "🏠",
        "address": "Borpukhuri, Uzan Bazar, Guwahati"
    },
    {
        "id": "loc-park",
        "patient_id": "a1b2c3d4-0000-0000-0000-000000000001",
        "name": "Dighalipukhuri Park",
        "category": "park",
        "latitude": 26.1480,
        "longitude": 91.7390,
        "radius_meters": 350.0,
        "icon": "🌳",
        "address": "Dighalipukhuri East, Guwahati"
    },
    {
        "id": "loc-clinic",
        "patient_id": "a1b2c3d4-0000-0000-0000-000000000001",
        "name": "Dr. Baruah Clinic",
        "category": "clinic",
        "latitude": 26.1410,
        "longitude": 91.7340,
        "radius_meters": 200.0,
        "icon": "🏥",
        "address": "Panbazar, Guwahati"
    },
    {
        "id": "loc-temple",
        "patient_id": "a1b2c3d4-0000-0000-0000-000000000001",
        "name": "Ugratara Mandir",
        "category": "temple",
        "latitude": 26.1495,
        "longitude": 91.7410,
        "radius_meters": 250.0,
        "icon": "🛕",
        "address": "Uzan Bazar, Guwahati"
    }
]

# Primary caregiver contact details
DEFAULT_CAREGIVER = {
    "name": "Amit Sharma",
    "phone": "+919876543210",
    "relationship": "Son / Caregiver"
}

# In-memory store for active safe walk sessions and geofence alerts
ACTIVE_SAFE_WALKS: Dict[str, Dict[str, Any]] = {}
GEOFENCE_ALERTS_LOG: List[Dict[str, Any]] = []

def calculate_haversine_distance_meters(
    lat1: float, lon1: float, lat2: float, lon2: float
) -> float:
    """
    Calculates great-circle distance between two points on earth in meters.
    """
    R = 6371000.0  # Earth's radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2)
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 1)

def find_nearest_safe_location(
    lat: float, lon: float, safe_locations: List[Dict[str, Any]] = None
) -> Tuple[Dict[str, Any], float]:
    """
    Finds the closest configured safe location and returns it with distance in meters.
    """
    locations = safe_locations or DEFAULT_SAFE_LOCATIONS
    nearest = locations[0]
    min_dist = float("inf")

    for loc in locations:
        dist = calculate_haversine_distance_meters(
            lat, lon, loc["latitude"], loc["longitude"]
        )
        if dist < min_dist:
            min_dist = dist
            nearest = loc

    return nearest, min_dist

def get_where_am_i_response(
    lat: float, lon: float, language: str = "hi"
) -> Dict[str, Any]:
    """
    Constructs an elderly-friendly, comforting response to 'Where Am I?'
    Only presents necessary, reassuring context without confusing GPS jargon.
    """
    nearest, dist = find_nearest_safe_location(lat, lon)
    radius = nearest.get("radius_meters", 300.0)

    is_inside = dist <= radius
    is_near = dist <= (radius + 250.0)

    loc_name = nearest["name"]
    loc_icon = nearest.get("icon", "🏠")

    if is_inside or is_near:
        status = "INSIDE_SAFE_ZONE" if is_inside else "NEAR_SAFE_ZONE"
        if "Ghar" in loc_name or nearest["category"] == "home":
            if language == "hi":
                msg = "Aap ghar ke paas hain."
                spoken = "Namaste Aai, aap surakshit hain. Aap ghar ke paas hain."
            elif language == "as":
                msg = "Apuni ghoror usorote aase."
                spoken = "Apuni surakshit, apuni ghoror usorote aase."
            else:
                msg = "You are safe and close to home."
                spoken = "You are in a safe area close to your home."
        else:
            if language == "hi":
                msg = f"Aap {loc_name} ke paas hain. Sab surakshit hai."
                spoken = f"Aap {loc_name} ke paas hain."
            elif language == "as":
                msg = f"Apuni {loc_name}r usorot aase."
                spoken = f"Apuni {loc_name}r usorot aase."
            else:
                msg = f"You are near {loc_name}. You are in a safe area."
                spoken = f"You are safe near {loc_name}."
    else:
        status = "OUTSIDE_SAFE_ZONE"
        if language == "hi":
            msg = f"Aap {loc_name} se thoda aage hain. Amit ji ko call kar sakte hain."
            spoken = "Aap thoda aage aa gaye hain. Agar zaroorat ho to Amit ji ko call karein."
        elif language == "as":
            msg = f"Apuni {loc_name}r pora olop aagoloi goise."
            spoken = "Apuni olop doorot aase, sohai lage jodi Amitok phone koribo pare."
        else:
            msg = f"You have walked a bit past {loc_name}."
            spoken = "You have walked past your safe area. You can call Amit anytime."

    return {
        "status": status,
        "location_name": loc_name,
        "location_icon": loc_icon,
        "comforting_message": msg,
        "spoken_audio": spoken,
        "distance_meters": dist,
        "caregiver_name": DEFAULT_CAREGIVER["name"],
        "caregiver_phone": DEFAULT_CAREGIVER["phone"],
        "can_call_caregiver": True
    }

def check_geofence_status(
    patient_id: str,
    lat: float,
    lon: float,
    walk_id: Optional[str] = None,
    language: str = "hi"
) -> Dict[str, Any]:
    """
    Evaluates current position against safe zones during Safe Walk mode.
    Dispatches alerts to caregiver if breached.
    """
    nearest, dist = find_nearest_safe_location(lat, lon)
    radius = nearest.get("radius_meters", 300.0)
    is_inside = dist <= radius

    alert_triggered = False
    alert_details = None

    if is_inside:
        if language == "hi":
            patient_msg = "Aap safe zone mein hain. Walk ka anand lein."
            spoken = "Aap surakshit kshetra mein hain. Walk jari rakhein."
        elif language == "as":
            patient_msg = "Apuni safe zone-ot aase. Khoj kora anand louk."
            spoken = "Apuni surakshit aase."
        else:
            patient_msg = "You are inside the safe area. Enjoy your walk."
            spoken = "You are inside the safe walking zone."
    else:
        alert_triggered = True
        if language == "hi":
            patient_msg = "Aap safe area se thoda bahar hain. Chaliye ghar mudte hain."
            spoken = "Aai, aap thoda bahar aa gaye hain. Chaliye wapas ghar mudte hain."
        elif language == "as":
            patient_msg = "Apuni safe area-r bahirot aase."
            spoken = "Apuni olop doorot aase, ghoroloi ghurou aahok."
        else:
            patient_msg = "You have moved outside the safe area."
            spoken = "You are outside the configured safe walking area."

        alert_details = {
            "type": "SAFE_ZONE_BREACH",
            "patient_name": "Aai (Anjali Sharma)",
            "message": f"Aai appears to have moved outside the configured safe area ({round(dist)}m from {nearest['name']}).",
            "latitude": lat,
            "longitude": lon,
            "nearest_location": nearest["name"],
            "distance_meters": dist,
            "maps_url": f"https://www.google.com/maps/search/?api=1&query={lat},{lon}",
            "caregiver_notified": DEFAULT_CAREGIVER["name"],
            "timestamp": "Just now"
        }
        GEOFENCE_ALERTS_LOG.append(alert_details)

    return {
        "is_inside_safe_zone": is_inside,
        "nearest_safe_location": nearest["name"],
        "distance_meters": dist,
        "safe_radius_meters": radius,
        "patient_message": patient_msg,
        "spoken_audio": spoken,
        "alert_triggered": alert_triggered,
        "alert_details": alert_details
    }

