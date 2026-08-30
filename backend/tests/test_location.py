import pytest
from services.location_service import (
    calculate_haversine_distance_meters,
    find_nearest_safe_location,
    get_where_am_i_response,
    check_geofence_status,
)
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_haversine_distance():
    # Test distance between Home (26.1445, 91.7362) and same point is 0
    d0 = calculate_haversine_distance_meters(26.1445, 91.7362, 26.1445, 91.7362)
    assert d0 == 0.0

    # Test nearby distance to Dighalipukhuri (approx 450-500 meters)
    d1 = calculate_haversine_distance_meters(26.1445, 91.7362, 26.1480, 91.7390)
    assert 400.0 <= d1 <= 600.0

def test_where_am_i_near_home():
    # Coordinates right next to home
    res = get_where_am_i_response(26.1446, 91.7363, language="hi")
    assert res["status"] in ["INSIDE_SAFE_ZONE", "NEAR_SAFE_ZONE"]
    assert "ghar" in res["comforting_message"].lower() or "home" in res["location_name"].lower()
    assert res["caregiver_name"] == "Amit Sharma"
    assert res["can_call_caregiver"] is True

def test_geofence_inside_safe_zone():
    # Location within 100m of home
    status = check_geofence_status(
        patient_id="a1b2c3d4-0000-0000-0000-000000000001",
        lat=26.1447,
        lon=91.7364,
        language="hi"
    )
    assert status["is_inside_safe_zone"] is True
    assert status["alert_triggered"] is False
    assert "safe zone" in status["patient_message"].lower()

def test_geofence_outside_breach():
    # Far location (e.g. 5km away: 26.1800, 91.7800)
    status = check_geofence_status(
        patient_id="a1b2c3d4-0000-0000-0000-000000000001",
        lat=26.1800,
        lon=91.7800,
        language="hi"
    )
    assert status["is_inside_safe_zone"] is False
    assert status["alert_triggered"] is True
    assert status["alert_details"] is not None
    assert "SAFE_ZONE_BREACH" in status["alert_details"]["type"]

def test_api_where_am_i_endpoint():
    payload = {
        "patient_id": "a1b2c3d4-0000-0000-0000-000000000001",
        "latitude": 26.1445,
        "longitude": 91.7362,
        "language": "hi"
    }
    response = client.post("/location/where-am-i", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["location_name"] == "Ghar (Home)"
    assert "ghar" in data["comforting_message"].lower()

def test_api_safe_walk_start_and_geofence():
    # Start Safe Walk
    start_payload = {
        "patient_id": "a1b2c3d4-0000-0000-0000-000000000001",
        "initial_latitude": 26.1445,
        "initial_longitude": 91.7362,
        "language": "hi"
    }
    start_resp = client.post("/location/safe-walk/start", json=start_payload)
    assert start_resp.status_code == 200
    walk_id = start_resp.json()["walk_id"]

    # Check Geofence Breach
    check_payload = {
        "patient_id": "a1b2c3d4-0000-0000-0000-000000000001",
        "walk_id": walk_id,
        "latitude": 26.1700, # moved outside
        "longitude": 91.7700,
        "language": "hi"
    }
    check_resp = client.post("/location/geofence-check", json=check_payload)
    assert check_resp.status_code == 200
    assert check_resp.json()["alert_triggered"] is True

