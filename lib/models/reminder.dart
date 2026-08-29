class ReminderItem {
  final String id;
  final String patientId;
  final String title;
  final String description;
  final String timeOfDay;
  final String category;
  final String voicePromptText;
  final String status;
  final bool isActive;

  ReminderItem({
    required this.id,
    required this.patientId,
    required this.title,
    required this.description,
    required this.timeOfDay,
    this.category = 'medicine',
    required this.voicePromptText,
    this.status = 'active',
    this.isActive = true,
  });

  factory ReminderItem.fromJson(Map<String, dynamic> json) {
    return ReminderItem(
      id: json['id'] ?? '',
      patientId: json['patient_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      timeOfDay: json['time_of_day'] ?? '',
      category: json['category'] ?? 'medicine',
      voicePromptText: json['voice_prompt_text'] ?? '',
      status: json['status'] ?? 'active',
      isActive: json['is_active'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'patient_id': patientId,
      'title': title,
      'description': description,
      'time_of_day': timeOfDay,
      'category': category,
      'voice_prompt_text': voicePromptText,
      'status': status,
      'is_active': isActive,
    };
  }
}

