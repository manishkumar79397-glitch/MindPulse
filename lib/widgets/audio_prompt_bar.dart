import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../services/voice_service.dart';

class AudioPromptBar extends StatelessWidget {
  final String text;
  final String language;

  const AudioPromptBar({
    super.key,
    required this.text,
    this.language = 'hi',
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
      decoration: BoxDecoration(
        color: ElderlyTheme.primaryAmberLight,
        borderRadius: BorderRadius.circular(18.0),
        border: Border.all(color: const Color(0xFFFCD34D), width: 1.5),
      ),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.volume_up_rounded, color: ElderlyTheme.primaryAmber, size: 28.0),
            onPressed: () {
              VoiceAssistantService().speak(text, language: language);
            },
          ),
          const SizedBox(width: 8.0),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 16.0,
                fontWeight: FontWeight.w600,
                color: Color(0xFF78350F),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

