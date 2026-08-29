import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../core/localization.dart';
import '../services/voice_service.dart';

class VoiceScreen extends StatefulWidget {
  final String language;

  const VoiceScreen({super.key, this.language = 'hi'});

  @override
  State<VoiceScreen> createState() => _VoiceScreenState();
}

class _VoiceScreenState extends State<VoiceScreen> {
  String _assistantResponse = 'Namaste Aai! Boliye, main sun raha hoon.';

  @override
  void initState() {
    super.initState();
    VoiceAssistantService().speak(_assistantResponse, language: widget.language);
  }

  void _handleQuickCommand(String text, String response) {
    setState(() {
      _assistantResponse = response;
    });
    VoiceAssistantService().speak(response, language: widget.language);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          AppStrings.get('btn_voice_assist', language: widget.language),
          style: const TextStyle(fontSize: 20.0, fontWeight: FontWeight.w700),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            children: [
              const SizedBox(height: 20.0),
              Container(
                width: 120.0,
                height: 120.0,
                decoration: BoxDecoration(
                  color: const Color(0xFFE0F2FE),
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFF0284C7), width: 4.0),
                ),
                child: const Icon(
                  Icons.mic_rounded,
                  size: 54.0,
                  color: Color(0xFF0284C7),
                ),
              ),
              const SizedBox(height: 24.0),
              Container(
                padding: const EdgeInsets.all(18.0),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(22.0),
                  border: Border.all(color: const Color(0xFFBAE6FD), width: 1.5),
                ),
                child: Text(
                  _assistantResponse,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 18.0,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF0369A1),
                  ),
                ),
              ),
              const SizedBox(height: 30.0),
              const Text(
                'Aap yeh pooch sakte hain:',
                style: TextStyle(
                  fontSize: 16.0,
                  fontWeight: FontWeight.w600,
                  color: ElderlyTheme.textMuted,
                ),
              ),
              const SizedBox(height: 12.0),
              _buildCommandOption(
                "💬 Subah ki dawa kab leni hai?",
                "Aapki agli dawa subah saade aath baje Amlodipine tablet hai.",
              ),
              _buildCommandOption(
                "💬 Beti Priyanka ko phone lagao",
                "Main aapki beti Priyanka ko call jod raha hoon.",
              ),
              _buildCommandOption(
                "💬 Purane din yaad karne hain",
                "Aaiye Guwahati aur Kaziranga ki yatra ki meethi baatein yaad karein.",
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCommandOption(String query, String response) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 4.0),
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.0),
        child: InkWell(
          onTap: () => _handleQuickCommand(query, response),
          borderRadius: BorderRadius.circular(16.0),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 14.0),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16.0),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    query,
                    style: const TextStyle(
                      fontSize: 16.0,
                      fontWeight: FontWeight.w600,
                      color: ElderlyTheme.textDark,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

