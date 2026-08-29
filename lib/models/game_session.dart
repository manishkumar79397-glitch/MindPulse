class GameSession {
  final String? id;
  final String patientId;
  final String gameId;
  final int difficulty;
  final double accuracy;
  final double completionRate;
  final double responseTimeSeconds;
  final double? engagementScore;
  final int hintsUsed;
  final String languageUsed;
  final DateTime completedAt;

  GameSession({
    this.id,
    required this.patientId,
    required this.gameId,
    required this.difficulty,
    required this.accuracy,
    required this.completionRate,
    required this.responseTimeSeconds,
    this.engagementScore,
    this.hintsUsed = 0,
    this.languageUsed = 'hi',
    DateTime? completedAt,
  }) : completedAt = completedAt ?? DateTime.now();

  factory GameSession.fromJson(Map<String, dynamic> json) {
    return GameSession(
      id: json['id'],
      patientId: json['patient_id'] ?? '',
      gameId: json['game_id'] ?? '',
      difficulty: json['difficulty'] ?? 1,
      accuracy: (json['accuracy'] as num?)?.toDouble() ?? 0.0,
      completionRate: (json['completion_rate'] as num?)?.toDouble() ?? 0.0,
      responseTimeSeconds: (json['response_time_seconds'] as num?)?.toDouble() ?? 0.0,
      engagementScore: (json['engagement_score'] as num?)?.toDouble(),
      hintsUsed: json['hints_used'] ?? 0,
      languageUsed: json['language_used'] ?? 'hi',
      completedAt: json['completed_at'] != null 
          ? DateTime.parse(json['completed_at']) 
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'patient_id': patientId,
      'game_id': gameId,
      'difficulty': difficulty,
      'accuracy': accuracy,
      'completion_rate': completionRate,
      'response_time_seconds': responseTimeSeconds,
      'hints_used': hintsUsed,
      'language_used': languageUsed,
      'completed_at': completedAt.toIso8601String(),
    };
  }
}

