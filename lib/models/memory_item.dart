class MemoryItem {
  final String id;
  final String patientId;
  final String title;
  final String relationship;
  final String imageUrl;
  final String? voiceClipUrl;
  final String storyText;
  final String language;
  final List<String> tags;

  MemoryItem({
    required this.id,
    required this.patientId,
    required this.title,
    required this.relationship,
    required this.imageUrl,
    this.voiceClipUrl,
    required this.storyText,
    this.language = 'hi',
    this.tags = const ['family'],
  });

  factory MemoryItem.fromJson(Map<String, dynamic> json) {
    return MemoryItem(
      id: json['id'] ?? '',
      patientId: json['patient_id'] ?? '',
      title: json['title'] ?? '',
      relationship: json['relationship'] ?? '',
      imageUrl: json['image_url'] ?? '',
      voiceClipUrl: json['voice_clip_url'],
      storyText: json['story_text'] ?? '',
      language: json['language'] ?? 'hi',
      tags: List<String>.from(json['tags'] ?? ['family']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'patient_id': patientId,
      'title': title,
      'relationship': relationship,
      'image_url': imageUrl,
      'voice_clip_url': voiceClipUrl,
      'story_text': storyText,
      'language': language,
      'tags': tags,
    };
  }
}

