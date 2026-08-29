import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../core/localization.dart';
import '../services/sos_service.dart';
import '../services/voice_service.dart';

class EmergencySOSScreen extends StatefulWidget {
  final String language;

  const EmergencySOSScreen({super.key, this.language = 'hi'});

  @override
  State<EmergencySOSScreen> createState() => _EmergencySOSScreenState();
}

class _EmergencySOSScreenState extends State<EmergencySOSScreen> {
  bool _isSent = false;

  @override
  void initState() {
    super.initState();
    _triggerAlert();
  }

  Future<void> _triggerAlert() async {
    await SOSService().triggerEmergencyAlert();
    VoiceAssistantService().speak(
      'Madat ka sandesh aapki beti Priyanka aur doctor ko bhej diya gaya hai.',
      language: widget.language,
    );
    if (mounted) {
      setState(() {
        _isSent = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ElderlyTheme.emergencyRedLight,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 130.0,
                height: 130.0,
                decoration: BoxDecoration(
                  color: ElderlyTheme.emergencyRed,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: ElderlyTheme.emergencyRed.withOpacity(0.4),
                      blurRadius: 20.0,
                      spreadRadius: 6.0,
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.phone_in_talk_rounded,
                  size: 64.0,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 32.0),
              Text(
                AppStrings.get('sos_sent_title', language: widget.language),
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 24.0,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF991B1B),
                ),
              ),
              const SizedBox(height: 12.0),
              Text(
                AppStrings.get('sos_sent_desc', language: widget.language),
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 16.0,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFFB91C1C),
                ),
              ),
              const SizedBox(height: 24.0),
              Container(
                padding: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20.0),
                  border: Border.all(color: const Color(0xFFFECACA)),
                ),
                child: const Column(
                  children: [
                    Text(
                      'Priyanka Sharma (Beti): +91 98765 43210',
                      style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15.0),
                    ),
                    SizedBox(height: 4.0),
                    Text(
                      'Sthan: Guwahati, Assam (GPS Pin Bheja)',
                      style: TextStyle(fontSize: 13.0, color: ElderlyTheme.textMuted),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40.0),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: ElderlyTheme.textDark,
                  foregroundColor: Colors.white,
                  minimumSize: const Size.fromHeight(64.0),
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
}

