class SyncItem {
  final String localId;
  final String entityType; // 'game_session', 'reminder_status', 'sos_event'
  final String operation;  // 'INSERT', 'UPDATE', 'DELETE'
  final Map<String, dynamic> payload;
  final DateTime createdAt;

  SyncItem({
    required this.localId,
    required this.entityType,
    required this.operation,
    required this.payload,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  factory SyncItem.fromJson(Map<String, dynamic> json) {
    return SyncItem(
      localId: json['local_id'] ?? '',
      entityType: json['entity_type'] ?? '',
      operation: json['operation'] ?? 'INSERT',
      payload: Map<String, dynamic>.from(json['payload'] ?? {}),
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at']) 
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'local_id': localId,
      'entity_type': entityType,
      'operation': operation,
      'payload': payload,
      'created_at': createdAt.toIso8601String(),
    };
  }
}

