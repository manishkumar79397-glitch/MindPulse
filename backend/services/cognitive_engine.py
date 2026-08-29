"""
ManSaathi Adaptive Cognitive Engine
Calculates elderly-friendly engagement metrics and rules-based difficulty adjustment.
Strictly non-diagnostic: scores reflect engagement, not clinical cognitive status.
"""

from typing import Tuple, Dict

MAX_DIFFICULTY = 4
MIN_DIFFICULTY = 1

def normalize_response_time(response_time_seconds: float) -> float:
    """
    Normalizes response time to a gentle score between 0.0 and 1.0.
    In elderly UX, we do not penalize thoughtful, slower interactions harshly.
    - Slower than 20 seconds returns ~0.4 - 0.5 (still encouraging)
    - Between 3 to 10 seconds returns ~0.8 - 1.0
    """
    if response_time_seconds <= 0:
        return 1.0
    if response_time_seconds <= 6.0:
        return 1.0
    elif response_time_seconds <= 15.0:
        return max(0.6, 1.0 - (response_time_seconds - 6.0) * 0.04)
    elif response_time_seconds <= 30.0:
        return max(0.4, 0.64 - (response_time_seconds - 15.0) * 0.015)
    else:
        return 0.4

def calculate_engagement_score(
    accuracy: float,
    completion_rate: float,
    consistency: float = 0.90,
    response_time_seconds: float = 8.0
) -> float:
    """
    Calculates engagement score based on specification formula:
    Engagement Score = 40% Accuracy + 25% Completion + 20% Consistency + 15% Response Time
    Returns score as a percentage (0.0 to 100.0)
    """
    acc = max(0.0, min(1.0, accuracy))
    comp = max(0.0, min(1.0, completion_rate))
    cons = max(0.0, min(1.0, consistency))
    resp = normalize_response_time(response_time_seconds)

    raw_score = (0.40 * acc) + (0.25 * comp) + (0.20 * cons) + (0.15 * resp)
    return round(raw_score * 100.0, 1)

def adjust_difficulty(
    current_difficulty: int,
    accuracy: float,
    completion_rate: float
) -> Tuple[int, str]:
    """
    Adaptive difficulty rule:
    - If accuracy >= 0.85 and completion >= 0.80 -> level up (+1, up to MAX_LEVEL)
    - If accuracy < 0.55 or completion < 0.50 -> ease difficulty (-1, down to MIN_LEVEL)
    - Otherwise -> maintain level
    """
    curr = max(MIN_DIFFICULTY, min(MAX_DIFFICULTY, current_difficulty))
    
    if accuracy >= 0.85 and completion_rate >= 0.80:
        next_diff = min(curr + 1, MAX_DIFFICULTY)
        if next_diff > curr:
            reason = "Great engagement! Progressing gently to next level."
        else:
            reason = "Excellent mastery at highest level."
    elif accuracy < 0.55 or completion_rate < 0.50:
        next_diff = max(curr - 1, MIN_DIFFICULTY)
        if next_diff < curr:
            reason = "Adjusting to simpler visuals for maximum comfort."
        else:
            reason = "Maintaining supportive base level."
    else:
        next_diff = curr
        reason = "Maintaining steady and comfortable pace."

    return next_diff, reason

def get_positive_feedback(language: str = "hi") -> str:
    """
    Returns positive, reassuring feedback without failure alerts.
    """
    feedbacks = {
        "hi": [
            "Bahut sundar! Aapne bahut achha khela.",
            "Shabash! Aapka abhyas bahut badhiya raha.",
            "Wah Aai! Bahut pyara anubhav raha."
        ],
        "en": [
            "Wonderful! You did great today.",
            "Well done! That was a lovely session.",
            "Warm congratulations! You practiced beautifully."
        ],
        "as": [
            "Bhal lagil! Apuni bhal kheli.",
            "Khub bhal hoise! Dhanyabad.",
            "Bhal kheli aase, shabash!"
        ]
    }
    lang_msgs = feedbacks.get(language, feedbacks["hi"])
    return lang_msgs[0]

