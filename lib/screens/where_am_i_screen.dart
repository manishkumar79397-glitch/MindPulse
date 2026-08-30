import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../core/theme.dart';
import '../core/localization.dart';
import '../services/geofencing_service.dart';
import '../services/voice_service.dart';

class WhereAmIScreen extends StatefulWidget {
  final String language;

  const WhereAmIScreen({super.key, this.language = 'hi'});

  @override
  State<WhereAmIScreen> createState() => _WhereAmIScreenState();
}

class _WhereAmIScreenState extends State<WhereAmIScreen> {
  Map<String, dynamic>? _locationData;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadLocation();
  }

  Future<void> _loadLocation() async {
    final data = await GeofencingService().checkWhereAmI(language: widget.language);
    if (mounted) {
      setState(() {
        _locationData = data;
        _isLoading = false;
      });
      VoiceAssistantService().speak(
        data['spoken_audio'] ?? 'Aap ghar ke paas hain.',
        language: widget.language,
      );
    }
  }

  Future<void> _callCaregiver(String phone) async {
    final uri = Uri.parse('tel:$phone');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Main Kahan Hoon? 🏠',
          style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.w700),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: _isLoading
              ? const Center(child: CircularProgressIndicator(color: ElderlyTheme.primaryAmber))
              : Column(
                  children: [
                    const Spacer(),
                    Container(
                      width: 110.0,
                      height: 110.0,
                      decoration: BoxDecoration(
                        color: const Color(0xFFCCFBF1),
                        shape: BoxShape.circle,
                        border: Border.all(color: const Color(0xFF0D9488), width: 3.5),
                      ),
                      child: const Center(
                        child: Text(
                          '🏠',
                          style: TextStyle(fontSize: 50.0),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24.0),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(24.0),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(28.0),
                        border: Border.all(color: const Color(0xFF99F6E4), width: 2.0),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x0F000000),
                            blurRadius: 16.0,
                            offset: Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          const Text(
                            'AAPKI STHITI',
                            style: TextStyle(
                              fontSize: 13.0,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF0F766E),
                              letterSpacing: 1.2,
                            ),
                          ),
                          const SizedBox(height: 8.0),
                          Text(
                            _locationData?['comforting_message'] ?? 'Aap ghar ke paas hain.',
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: 22.0,
                              fontWeight: FontWeight.w800,
                              color: ElderlyTheme.textDark,
                            ),
                          ),
                          const SizedBox(height: 8.0),
                          const Text(
                            'Borpukhuri, Uzan Bazar • Guwahati',
                            style: TextStyle(
                              fontSize: 14.0,
                              color: ElderlyTheme.textMuted,
                            ),
                          ),
                          const SizedBox(height: 16.0),
                          const Divider(),
                          const SizedBox(height: 8.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Caregiver:',
                                style: TextStyle(
                                  fontSize: 14.0,
                                  fontWeight: FontWeight.w600,
                                  color: ElderlyTheme.textMuted,
                                ),
                              ),
                              Text(
                                '${_locationData?['caregiver_name'] ?? "Amit Sharma"} (Beta)',
                                style: const TextStyle(
                                  fontSize: 15.0,
                                  fontWeight: FontWeight.w800,
                                  color: ElderlyTheme.textDark,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24.0),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0F766E),
                        foregroundColor: Colors.white,
                        minimumSize: const Size.fromHeight(74.0),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(22.0),
                        ),
                      ),
                      onPressed: () => _callCaregiver(_locationData?['caregiver_phone'] ?? '+919876543210'),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.phone_in_talk_rounded, size: 28.0),
                          const SizedBox(width: 12.0),
                          Text(
                            'Call ${_locationData?['caregiver_name'] ?? "Amit"}',
                            style: const TextStyle(fontSize: 19.0, fontWeight: FontWeight.w800),
                          ),
                        ],
                      ),
                    ),
                    const Spacer(),
                  ],
                ),
        ),
      ),
    );
  }
}

