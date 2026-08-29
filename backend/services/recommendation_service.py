"""
ManSaathi Game Recommendation Service
Selects optimal cognitive activities considering variety, patient preferences, and difficulty.
"""

from typing import Dict, Any, List

GAMES_CATALOG = {
    "pehchano_kaun": {
        "name": "Pehchano Kaun? (Family Memory)",
        "category": "memory",
        "description": "Familiar faces and family voices",
        "prompts": {
            "hi": "Aaiye parivar ke pyare sadasyo ko pehchante hain.",
            "en": "Let's see pictures of your loved ones.",
            "as": "Aahok aamar poriyalor porichito mukhbar sawo."
        }
    },
    "purane_din": {
        "name": "Purane Din (Story & Memory)",
        "category": "memory",
        "description": "Reminiscence of historic landmarks and celebrations",
        "prompts": {
            "hi": "Aaiye purani meethi yaadon ko taaza karein.",
            "en": "Let's remember sweet past memories and places.",
            "as": "Puroni dinor bhal loga smriti monot pelawo."
        }
    },
    "dawa_subah_routine": {
        "name": "Dawa Aur Subah Ka Routine (Sequencing)",
        "category": "sequencing",
        "description": "Chronological daily activity ordering",
        "prompts": {
            "hi": "Aaiye subah ke kamo ko sahi kram mein sajayein.",
            "en": "Let's arrange morning routines in order.",
            "as": "Puwar kam bur kramot hojai lo."
        }
    },
    "ghar_ki_cheezein": {
        "name": "Ghar Ki Cheezein (Object Matching)",
        "category": "matching",
        "description": "Pair familiar everyday objects to their usage",
        "prompts": {
            "hi": "Ghar ki cheezo ko unke sahi jode se milayein.",
            "en": "Match familiar objects with their pairs.",
            "as": "Ghoror bostubur thik jodit milawo."
        }
    },
    "ner_cultural_memory": {
        "name": "NER Cultural Heritage",
        "category": "cultural",
        "description": "Traditional North Eastern musical instruments, crafts and attire",
        "prompts": {
            "hi": "Pepa aur Mekhela Chador jaise sundar sanskriti chitra dekhein.",
            "en": "Explore traditional instruments and cultural artifacts.",
            "as": "Pepa aru Mekhela Chadoror dore sundor bostu sawo."
        }
    },
    "gentle_motor_tap": {
        "name": "Gentle Petals & Bubbles",
        "category": "motor",
        "description": "Calming floating bubble taps for fine motor relaxation",
        "prompts": {
            "hi": "Shant bhav se behte hue phoolon ko chhu kar anand lein.",
            "en": "Gently tap floating petals and bubbles.",
            "as": "Uti thoka phulbur aadori louk."
        }
    }
}

def recommend_next_game(
    current_game_id: str = None,
    current_difficulty: int = 1,
    language: str = "hi"
) -> Dict[str, Any]:
    """
    Recommends a complementary activity to maintain variety across memory, sequencing, and matching.
    """
    game_keys = list(GAMES_CATALOG.keys())
    
    # Simple alternating recommendation logic
    if not current_game_id or current_game_id not in GAMES_CATALOG:
        recommended_key = "pehchano_kaun"
        rationale = "Recommended starting activity with personal family photos."
    elif current_game_id == "pehchano_kaun":
        recommended_key = "ghar_ki_cheezein"
        rationale = "Transitioning to familiar object matching for associative memory."
    elif current_game_id == "ghar_ki_cheezein":
        recommended_key = "dawa_subah_routine"
        rationale = "Practicing daily routine sequence to reinforce schedule adherence."
    elif current_game_id == "dawa_subah_routine":
        recommended_key = "ner_cultural_memory"
        rationale = "Engaging with regional North Eastern cultural imagery."
    elif current_game_id == "ner_cultural_memory":
        recommended_key = "gentle_motor_tap"
        rationale = "Relaxing fine motor activity for soothing rest."
    else:
        recommended_key = "pehchano_kaun"
        rationale = "Returning to beloved family memory reminiscence."

    meta = GAMES_CATALOG[recommended_key]
    voice_prompt = meta["prompts"].get(language, meta["prompts"]["hi"])

    return {
        "recommended_game_id": recommended_key,
        "recommended_game_name": meta["name"],
        "category": meta["category"],
        "difficulty": current_difficulty,
        "rationale": rationale,
        "voice_prompt": voice_prompt
    }

