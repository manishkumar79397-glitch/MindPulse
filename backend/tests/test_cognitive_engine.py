import pytest
from services.cognitive_engine import calculate_engagement_score, adjust_difficulty, normalize_response_time

def test_engagement_score_calculation():
    # 40% Accuracy + 25% Completion + 20% Consistency + 15% Response Time
    # If acc=1.0 (40), comp=1.0 (25), cons=1.0 (20), resp=1.0 (15) -> 100.0
    score = calculate_engagement_score(
        accuracy=1.0,
        completion_rate=1.0,
        consistency=1.0,
        response_time_seconds=5.0
    )
    assert score == 100.0

def test_engagement_score_moderate():
    # acc=0.8 (32), comp=0.9 (22.5), cons=0.9 (18), resp ~0.9
    score = calculate_engagement_score(
        accuracy=0.80,
        completion_rate=0.90,
        consistency=0.90,
        response_time_seconds=8.0
    )
    assert 70.0 <= score <= 95.0

def test_difficulty_advancement():
    # If accuracy >= 0.85 and completion >= 0.80 -> level + 1
    next_diff, reason = adjust_difficulty(current_difficulty=1, accuracy=0.90, completion_rate=0.85)
    assert next_diff == 2

    # Cannot exceed MAX_DIFFICULTY (4)
    next_diff_max, _ = adjust_difficulty(current_difficulty=4, accuracy=0.95, completion_rate=1.0)
    assert next_diff_max == 4

def test_difficulty_easing():
    # If accuracy < 0.55 -> level - 1
    next_diff, _ = adjust_difficulty(current_difficulty=3, accuracy=0.45, completion_rate=0.80)
    assert next_diff == 2

    # Cannot drop below MIN_DIFFICULTY (1)
    next_diff_min, _ = adjust_difficulty(current_difficulty=1, accuracy=0.30, completion_rate=0.40)
    assert next_diff_min == 1

def test_difficulty_steady():
    # In between threshold keeps steady
    next_diff, _ = adjust_difficulty(current_difficulty=2, accuracy=0.70, completion_rate=0.75)
    assert next_diff == 2

