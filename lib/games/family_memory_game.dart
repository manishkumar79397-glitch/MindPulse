import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../core/localization.dart';
import '../models/game_session.dart';
import '../services/local_db_service.dart';
import '../services/voice_service.dart';

class FamilyMemoryGame extends StatefulWidget {
  final String language;

  const FamilyMemoryGame({super.key, this.language = 'hi'});

  @override
  State<FamilyMemoryGame> createState() => _FamilyMemoryGameState();
}

class _FamilyMemoryGameState extends State<FamilyMemoryGame> {
  bool _answered = false;
  String? _feedbackText;

  @override
  void initState() {
    super.initState();
    VoiceAssistantService().speak(
      widget.language == 'hi'
          ? 'Inme se aapki pyari beti Priyanka kaun hai? Tasveer ko chuyein.'
          : 'Which one is your loving daughter Priyanka? Tap the photo.',
      language: widget.language,
    );
  }

  Future<void> _handleChoice(bool isTarget) async {
    setState(() {
      _answered = true;
      _feedbackText = widget.language == 'hi'
          ? 'Bahut Sundar! Yeh aapki beti Priyanka hain.'
          : 'Wonderful! This is your daughter Priyanka.';
    });

    VoiceAssistantService().speak(
      _feedbackText!,
      language: widget.language,
    );

    // Save session locally
    final session = GameSession(
      patientId: 'a1b2c3d4-0000-0000-0000-000000000001',
      gameId: 'pehchano_kaun',
      difficulty: 1,
      accuracy: 1.0,
      completionRate: 1.0,
      responseTimeSeconds: 5.4,
      languageUsed: widget.language,
    );
    await LocalDatabaseService().saveGameSession(session);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Pehchano Kaun? 🌸',
          style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.w700),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(
                  color: ElderlyTheme.primaryAmberLight,
                  borderRadius: BorderRadius.circular(18.0),
                  border: Border.all(color: const Color(0xFFFCD34D), width: 1.5),
                ),
                child: Text(
                  widget.language == 'hi'
                      ? 'Inme se aapki Beti "Priyanka" kaun hain?'
                      : 'Which one is your daughter "Priyanka"?',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 18.0,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF78350F),
                  ),
                ),
              ),
              const SizedBox(height: 24.0),
              Expanded(
                child: GridView.count(
                  crossAxisCount: 2,
                  mainAxisSpacing: 16.0,
                  crossAxisSpacing: 16.0,
                  children: [
                    _buildPhotoCard(
                      name: 'Priyanka (Beti)',
                      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop&q=80',
                      onTap: () => _handleChoice(true),
                    ),
                    _buildPhotoCard(
                      name: 'Aarav (Pota)',
                      imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&fit=crop&q=80',
                      onTap: () => _handleChoice(false),
                    ),
                  ],
                ),
              ),
              if (_feedbackText != null) ...[
                Container(
                  padding: const EdgeInsets.all(16.0),
                  decoration: BoxDecoration(
                    color: ElderlyTheme.sageGreenLight,
                    borderRadius: BorderRadius.circular(20.0),
                    border: Border.all(color: ElderlyTheme.sageGreen),
                  ),
                  child: Text(
                    _feedbackText!,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 18.0,
                      fontWeight: FontWeight.w800,
                      color: ElderlyTheme.sageGreen,
                    ),
                  ),
                ),
                const SizedBox(height: 16.0),
              ],
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: ElderlyTheme.primaryAmber,
                  foregroundColor: Colors.white,
                  minimumSize: const Size.fromHeight(60.0),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20.0),
                  ),
                ),
                onPressed: () => Navigator.pop(context),
                child: Text(
                  AppStrings.get('back', language: widget.language),
                  style: const TextStyle(fontSize: 18.0, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPhotoCard({
    required String name,
    required String imageUrl,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(24.0),
      elevation: 3.0,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(24.0),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24.0),
            border: Border.all(color: const Color(0xFFFDE68A), width: 2.0),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(
                child: ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(22.0)),
                  child: Image.network(
                    imageUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      color: ElderlyTheme.primaryAmberLight,
                      child: const Center(child: Icon(Icons.person, size: 48.0, color: ElderlyTheme.primaryAmber)),
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(12.0),
                child: Text(
                  name,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w800,
                    color: ElderlyTheme.textDark,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

