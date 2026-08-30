import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../core/theme.dart';
import '../services/voice_service.dart';

class SafeWalkScreen extends StatefulWidget {
  final String language;

  const SafeWalkScreen({super.key, this.language = 'hi'});

  @override
  State<SafeWalkScreen> createState() => _SafeWalkScreenState();
}

class _SafeWalkScreenState extends State<SafeWalkScreen> {
  bool _isOutsideGeofence = false;
  int _minutes = 12;
  int _steps = 620;
  String _statusText = 'Aap safe zone mein hain. Sair ka anand lein.';

  @override
  void initState() {
    super.initState();
    VoiceAssistantService().speak(
      widget.language == 'hi'
          ? 'Safe Walk shuru ho gayi hai. Hum aapki suraksha ka dhyan rakh rahe hain.'
          : 'Safe Walk mode active. Enjoy your walk.',
      language: widget.language,
    );
  }

  void _simulateMoveOutside() {
    setState(() {
      _isOutsideGeofence = true;
      _statusText = 'Aai, aap thoda bahar aa gaye hain. Chaliye wapas ghar mudte hain.';
    });
    VoiceAssistantService().speak(
      _statusText,
      language: widget.language,
    );
  }

  void _simulateReturnToSafeZone() {
    setState(() {
      _isOutsideGeofence = false;
      _statusText = 'Shabash Aai! Aap wapas safe zone mein aa gaye hain.';
    });
    VoiceAssistantService().speak(
      _statusText,
      language: widget.language,
    );
  }

  Future<void> _callCaregiver() async {
    final uri = Uri.parse('tel:+919876543210');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Safe Walk Mode 🚶‍♂️',
          style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.w700),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(20.0),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24.0),
                  border: Border.all(
                    color: _isOutsideGeofence ? ElderlyTheme.emergencyRed : ElderlyTheme.sageGreen,
                    width: 2.0,
                  ),
                  boxShadow: const [
                    BoxShadow(color: Color(0x0A000000), blurRadius: 10.0),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Column(
                          children: [
                            Text(
                              '$_minutes min',
                              style: const TextStyle(
                                fontSize: 26.0,
                                fontWeight: FontWeight.w800,
                                color: ElderlyTheme.textDark,
                              ),
                            ),
                            const Text('Samay', style: TextStyle(color: ElderlyTheme.textMuted)),
                          ],
                        ),
                        Container(width: 1, height: 40, color: Colors.grey.shade300),
                        Column(
                          children: [
                            Text(
                              '$_steps',
                              style: const TextStyle(
                                fontSize: 26.0,
                                fontWeight: FontWeight.w800,
                                color: ElderlyTheme.sageGreen,
                              ),
                            ),
                            const Text('Kadam (Steps)', style: TextStyle(color: ElderlyTheme.textMuted)),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 16.0),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
                      decoration: BoxDecoration(
                        color: _isOutsideGeofence
                            ? ElderlyTheme.emergencyRedLight
                            : ElderlyTheme.sageGreenLight,
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                      child: Text(
                        _isOutsideGeofence
                            ? '⚠️ SAFE ZONE SE BAHAR'
                            : '✓ SURAKSHIT AREA MEIN',
                        style: TextStyle(
                          fontSize: 14.0,
                          fontWeight: FontWeight.w800,
                          color: _isOutsideGeofence
                              ? ElderlyTheme.emergencyRed
                              : ElderlyTheme.sageGreen,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12.0),
                    Text(
                      _statusText,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 15.0, fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ),
              const Spacer(),
              if (!_isOutsideGeofence)
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: ElderlyTheme.primaryAmber,
                    foregroundColor: Colors.white,
                    minimumSize: const Size.fromHeight(66.0),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
                  ),
                  onPressed: _simulateMoveOutside,
                  child: const Text(
                    'Simulate Walk Outside Safe Zone',
                    style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
                  ),
                )
              else ...[
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: ElderlyTheme.emergencyRed,
                    foregroundColor: Colors.white,
                    minimumSize: const Size.fromHeight(70.0),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
                  ),
                  onPressed: _callCaregiver,
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.phone_in_talk, size: 26.0),
                      SizedBox(width: 10.0),
                      Text('Call Amit (+91 98765 43210)', style: TextStyle(fontSize: 18.0, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
                const SizedBox(height: 12.0),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: ElderlyTheme.sageGreen,
                    foregroundColor: Colors.white,
                    minimumSize: const Size.fromHeight(60.0),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
                  ),
                  onPressed: _simulateReturnToSafeZone,
                  child: const Text('Return to Safe Zone', style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold)),
                ),
              ],
              const Spacer(),
            ],
          ),
        ),
      ),
    );
  }
}

