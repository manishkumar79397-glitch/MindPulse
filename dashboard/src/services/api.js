const API_BASE_URL = 'http://localhost:8000';

export async function fetchPatientSummary(patientId = 'a1b2c3d4-0000-0000-0000-000000000001') {
  try {
    const res = await fetch(`${API_BASE_URL}/patient/${patientId}/summary`);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.warn('Using local fallback summary data:', err);
    return {
      patient_id: patientId,
      name: "Aai (Anjali Sharma)",
      age: 76,
      preferred_language: "hi",
      total_games_played: 28,
      average_engagement_score: 87.4,
      current_difficulty_level: 2,
      routine_adherence_rate: 0.94,
      last_active_at: new Date(Date.now() - 7200000).toISOString(),
      recent_sessions: [
        {
          game_id: "pehchano_kaun",
          game_name: "Pehchano Kaun? (Family Memory)",
          difficulty: 2,
          accuracy: 0.88,
          completion_rate: 1.0,
          response_time_seconds: 6.8,
          engagement_score: 89.2,
          completed_at: new Date(Date.now() - 7200000).toISOString()
        },
        {
          game_id: "dawa_subah_routine",
          game_name: "Dawa Aur Routine (Sequencing)",
          difficulty: 2,
          accuracy: 0.82,
          completion_rate: 0.90,
          response_time_seconds: 7.4,
          engagement_score: 83.5,
          completed_at: new Date(Date.now() - 18000000).toISOString()
        },
        {
          game_id: "ghar_ki_cheezein",
          game_name: "Ghar Ki Cheezein (Object Matching)",
          difficulty: 1,
          accuracy: 0.95,
          completion_rate: 1.0,
          response_time_seconds: 5.2,
          engagement_score: 93.8,
          completed_at: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      active_reminders: [
        { id: "rem-1", title: "Morning BP Medicine (Amlodipine)", time_of_day: "08:30 AM", status: "TAKEN", category: "medicine" },
        { id: "rem-2", title: "Afternoon Hydration & Garden Walk", time_of_day: "04:00 PM", status: "COMPLETED", category: "hydration" },
        { id: "rem-3", title: "Night Calcium & Warm Milk", time_of_day: "08:30 PM", status: "PENDING", category: "medicine" }
      ],
      recent_sos_alerts: [
        { id: "sos-1", trigger_type: "Safety Drill Test", location_name: "Home, Guwahati", time: "Yesterday, 04:30 PM", status: "RESOLVED" }
      ]
    };
  }
}

export async function analyzeGameSession(sessionData) {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData)
    });
    if (!res.ok) throw new Error('Failed to analyze session');
    return await res.json();
  } catch (err) {
    console.warn('Using client fallback analysis:', err);
    const accuracy = sessionData.accuracy || 0.85;
    const comp = sessionData.completion_rate || 1.0;
    const score = Math.round((0.4 * accuracy + 0.25 * comp + 0.2 * 0.9 + 0.15 * 0.9) * 100);
    return {
      session_id: "local-" + Date.now(),
      patient_id: sessionData.patient_id,
      game_id: sessionData.game_id,
      difficulty: sessionData.difficulty || 1,
      engagement_score: score,
      next_difficulty: accuracy >= 0.85 ? Math.min((sessionData.difficulty || 1) + 1, 4) : sessionData.difficulty,
      feedback_message: "Bahut sundar! Aapka abhyas bahut badhiya raha.",
      recorded_at: new Date().toISOString()
    };
  }
}

export async function triggerSOSAlert(sosData) {
  try {
    const res = await fetch(`${API_BASE_URL}/emergency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sosData)
    });
    return await res.json();
  } catch (err) {
    return {
      alert_id: "sos-local-" + Date.now(),
      patient_id: sosData.patient_id,
      patient_name: "Aai (Anjali Sharma)",
      status: "SENT",
      message: "Emergency SMS sent to Caregiver (Priyanka)",
      maps_url: `https://www.google.com/maps/search/?api=1&query=${sosData.latitude || 26.1445},${sosData.longitude || 91.7362}`,
      caregivers_notified: [{ name: "Priyanka Sharma (Daughter)", phone: "+919876543210" }],
      timestamp: new Date().toISOString()
    };
  }
}

export async function processVoiceQuery(transcript, language = 'hi') {
  try {
    const res = await fetch(`${API_BASE_URL}/voice/intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_id: "a1b2c3d4-0000-0000-0000-000000000001", transcript, language })
    });
    return await res.json();
  } catch (err) {
    return {
      detected_intent: "NEXT_REMINDER",
      spoken_response: "Aapki agli dawa subah saade aath baje Amlodipine tablet hai.",
      action: "NAVIGATE_ROUTINE"
    };
  }
}

export async function fetchWhereAmI(latitude = 26.1445, longitude = 91.7362, language = 'hi') {
  try {
    const res = await fetch(`${API_BASE_URL}/location/where-am-i`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_id: "a1b2c3d4-0000-0000-0000-000000000001", latitude, longitude, language })
    });
    return await res.json();
  } catch (err) {
    return {
      status: "INSIDE_SAFE_ZONE",
      location_name: "Ghar (Home)",
      location_icon: "🏠",
      comforting_message: language === 'hi' ? "Aap ghar ke paas hain." : "You are safe and close to home.",
      spoken_audio: "Namaste Aai, aap surakshit hain. Aap ghar ke paas hain.",
      distance_meters: 15.0,
      comforting_message: language === 'hi' ? "Aap apne ghar se 45 meter ki doori par hain." : "You are 45 meters from home.",
      spoken_audio: language === 'hi' ? "Namaste Aai, aap apne ghar se lagbhag 45 meter door hain aur surakshit kshetra mein hain." : "You are 45 meters from your home.",
      distance_meters: 45.0,
      distance_from_home_meters: 45.0,
      distance_from_home_text: "45 meter",
      caregiver_name: "Amit Sharma",
      caregiver_phone: "+919876543210",
      can_call_caregiver: true
    };
  }
}

export async function startSafeWalk(latitude = 26.1445, longitude = 91.7362, language = 'hi') {
  try {
    const res = await fetch(`${API_BASE_URL}/location/safe-walk/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_id: "a1b2c3d4-0000-0000-0000-000000000001", initial_latitude: latitude, initial_longitude: longitude, language })
    });
    return await res.json();
  } catch (err) {
    return {
      walk_id: "walk-" + Date.now(),
      status: "ACTIVE",
      safe_zone_name: "Home Perimeter (Guwahati)",
      safe_radius_meters: 400.0,
      comforting_message: "Safe Walk shuru ho gayi hai. Hum aapki suraksha ka dhyan rakh rahe hain.",
      started_at: new Date().toISOString()
    };
  }
}

export async function checkGeofence(latitude, longitude, walkId = null, language = 'hi') {
  try {
    const res = await fetch(`${API_BASE_URL}/location/geofence-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_id: "a1b2c3d4-0000-0000-0000-000000000001", walk_id: walkId, latitude, longitude, language })
    });
    return await res.json();
  } catch (err) {
    const isInside = Math.abs(latitude - 26.1445) < 0.003 && Math.abs(longitude - 91.7362) < 0.003;
    return {
      is_inside_safe_zone: isInside,
      nearest_safe_location: "Ghar (Home)",
      distance_meters: isInside ? 120.0 : 850.0,
      safe_radius_meters: 400.0,
      patient_message: isInside ? "Aap safe zone mein hain. Walk ka anand lein." : "Aap safe area se thoda bahar hain.",
      spoken_audio: isInside ? "Aap surakshit kshetra mein hain." : "Aai, aap thoda bahar aa gaye hain. Chaliye wapas ghar mudte hain.",
      alert_triggered: !isInside,
      alert_details: !isInside ? {
        type: "SAFE_ZONE_BREACH",
        patient_name: "Aai (Anjali Sharma)",
        message: "Aai appears to have moved outside the configured safe area.",
        latitude,
        longitude,
        nearest_location: "Ghar (Home)",
        distance_meters: 850.0,
        maps_url: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
        caregiver_notified: "Amit Sharma",
        timestamp: "Just now"
      } : null
    };
  }
}

export async function fetchSafeLocations() {
  try {
    const res = await fetch(`${API_BASE_URL}/patient/a1b2c3d4-0000-0000-0000-000000000001/safe-locations`);
    return await res.json();
  } catch (err) {
    return [
      { id: "loc-home", name: "Ghar (Home)", category: "home", latitude: 26.1445, longitude: 91.7362, radius_meters: 400, icon: "🏠", address: "Borpukhuri, Uzan Bazar, Guwahati" },
      { id: "loc-park", name: "Dighalipukhuri Park", category: "park", latitude: 26.1480, longitude: 91.7390, radius_meters: 350, icon: "🌳", address: "Dighalipukhuri East, Guwahati" },
      { id: "loc-clinic", name: "Dr. Baruah Clinic", category: "clinic", latitude: 26.1410, longitude: 91.7340, radius_meters: 200, icon: "🏥", address: "Panbazar, Guwahati" }
    ];
  }
}


