"""
ManSaathi Voice Assistant Service
Natural intent mapping for spoken Hindi, English, and Assamese/NER phrases.
"""

from typing import Dict, Any

INTENT_PATTERNS = {
    "NEXT_REMINDER": [
        "dawa", "medicine", "remind", "samay", "kab", "time", "tablet", "routine",
        "dawai", "paani", "water", "ausodh"
    ],
    "PLAY_GAME": [
        "khel", "game", "play", "pehchano", "khelna", "picture", "photo", "tasveer",
        "khela"
    ],
    "CALL_CAREGIVER": [
        "beti", "priyanka", "phone", "call", "baat", "daughter", "son", "caregiver",
        "madat", "help", "doctor", "sohai"
    ],
    "TELL_STORY": [
        "kahani", "story", "purane", "din", "bhajan", "gaana", "song", "smriti"
    ],
    "WHERE_AM_I": [
        "kahan hoon", "kahan hu", "main kahan", "where am i", "location", "jagah",
        "ghar kahan", "sthan", "kot aasu", "kontha"
    ],
    "SAFE_WALK": [
        "safe walk", "walk", "sair", "tahalna", "ghoomna", "park jana", "khoj"
    ]
}

def parse_voice_transcript(transcript: str, language: str = "hi") -> Dict[str, Any]:
    """
    Parses a recognized audio transcript into an intent and returns a warm audio response.
    """
    text_lower = transcript.lower()
    
    detected = "UNKNOWN"
    for intent, keywords in INTENT_PATTERNS.items():
        if any(kw in text_lower for kw in keywords):
            detected = intent
            break

    if detected == "NEXT_REMINDER":
        if language == "hi":
            spoken = "Aapki agli dawa subah saade aath baje Amlodipine tablet hai."
        elif language == "as":
            spoken = "Aapunar poroborti oukhudh puwa aath baji trish minitot Amlodipine."
        else:
            spoken = "Your next scheduled medicine is Amlodipine at 8:30 AM."
        action = "NAVIGATE_ROUTINE"
        action_data = {"category": "medicine", "time": "08:30"}

    elif detected == "PLAY_GAME":
        if language == "hi":
            spoken = "Chaliye, aaj ka pyara Parivar Pehchano game shuru karte hain."
        elif language == "as":
            spoken = "Aahok, aaji Poriyalor Khel shuru koru."
        else:
            spoken = "Let's start your favorite Family Memory game."
        action = "LAUNCH_GAME"
        action_data = {"game_id": "pehchano_kaun"}

    elif detected == "CALL_CAREGIVER":
        if language == "hi":
            spoken = "Main aapki beti Priyanka ko call jod raha hoon."
        elif language == "as":
            spoken = "Moi aapunar suwali Priyanka loloi phone lagai aasu."
        else:
            spoken = "Connecting to your daughter Priyanka now."
        action = "DIAL_PHONE"
        action_data = {"phone": "+919876543210", "name": "Priyanka Sharma"}

    elif detected == "TELL_STORY":
        if language == "hi":
            spoken = "Aaiye Guwahati aur Kaziranga ki sundar yatra ki meethi baatein yaad karein."
        elif language == "as":
            spoken = "Aahok Kazirangar bhal loga jatra monot pelawo."
        else:
            spoken = "Let's enjoy sweet memories of your trip to Kaziranga."
        action = "LAUNCH_GAME"
        action_data = {"game_id": "purane_din"}

    elif detected == "WHERE_AM_I":
        if language == "hi":
            spoken = "Namaste Aai, aap surakshit hain. Aap ghar ke paas hain."
        elif language == "as":
            spoken = "Apuni surakshit aase, ghoror usorote aase."
        else:
            spoken = "You are safe and close to home."
        action = "NAVIGATE_WHERE_AM_I"
        action_data = {"location": "Ghar (Home)", "caregiver": "Amit"}

    elif detected == "SAFE_WALK":
        if language == "hi":
            spoken = "Safe Walk shuru ho gayi hai. Hum aapki suraksha ka dhyan rakh rahe hain."
        elif language == "as":
            spoken = "Safe Walk shuru hoise. Apuni nishinte khoj karibo pare."
        else:
            spoken = "Safe Walk mode is active. Enjoy your walk."
        action = "NAVIGATE_SAFE_WALK"
        action_data = {"safe_radius": "400m"}

    else:
        if language == "hi":
            spoken = "Namaste! Aap dawa, parivar ke game ya beti se baat karne ke liye bol sakte hain."
        elif language == "as":
            spoken = "Namaskar! Apuni oukhudh, khel ba kothapatibole kobo pare."
        else:
            spoken = "Namaste! You can ask about your medicine, play a memory game, or call your caregiver."
        action = "SHOW_HELP"
        action_data = {}

    return {
        "detected_intent": detected,
        "spoken_response": spoken,
        "action": action,
        "action_data": action_data
    }

