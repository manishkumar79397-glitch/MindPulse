class Patient {
  final String id;
  final String name;
  final int age;
  final String preferredLanguage;
  final String photoUrl;
  final String notes;

  Patient({
    required this.id,
    required this.name,
    required this.age,
    required this.preferredLanguage,
    required this.photoUrl,
    required this.notes,
  });

  factory Patient.fromJson(Map<String, dynamic> json) {
    return Patient(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      age: json['age'] ?? 0,
      preferredLanguage: json['preferred_language'] ?? 'hi',
      photoUrl: json['photo_url'] ?? '',
      notes: json['notes'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'age': age,
      'preferred_language': preferredLanguage,
      'photo_url': photoUrl,
      'notes': notes,
    };
  }
}

