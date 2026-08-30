import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../core/localization.dart';
import '../widgets/large_elderly_button.dart';
import '../widgets/audio_prompt_bar.dart';
import '../services/voice_service.dart';
import 'routine_screen.dart';
import 'voice_screen.dart';
import 'emergency_sos_screen.dart';
import 'where_am_i_screen.dart';
import 'safe_walk_screen.dart';
import '../games/family_memory_game.dart';

class HomeScreen extends StatefulWidget {
  final String language;
  final ValueChanged<String> onLanguageChanged;

  const HomeScreen({
    super.key,
    this.language = 'hi',
    required this.onLanguageChanged,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    // Play initial greeting automatically
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final greeting = AppStrings.get('home_subtitle', language: widget.language);
      VoiceAssistantService().speak(greeting, language: widget.language);
    });
  }

  @override
  Widget build(BuildContext context) {
    final lang = widget.language;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        title: Text(
          AppStrings.get('greeting', language: lang),
          style: const TextStyle(
            fontSize: 22.0,
            fontWeight: FontWeight.w800,
            color: ElderlyTheme.textDark,
          ),
        ),
        actions: [
          // Language selector
          Padding(
            padding: const EdgeInsets.only(right: 12.0),
            child: PopupMenuButton<String>(
              icon: const Icon(Icons.language_rounded, color: ElderlyTheme.primaryAmber, size: 28.0),
              onSelected: widget.onLanguageChanged,
              itemBuilder: (context) => [
                const PopupMenuItem(value: 'hi', child: Text('हिंदी (Hindi)')),
                const PopupMenuItem(value: 'en', child: Text('English')),
                const PopupMenuItem(value: 'as', child: Text('অসমীয়া (Assamese)')),
              ],
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
          child: Column(
            children: [
              AudioPromptBar(
                text: AppStrings.get('home_subtitle', language: lang),
                language: lang,
              ),
              const SizedBox(height: 12.0),
              Expanded(
                child: ListView(
                  children: [
                    // 1. PLAY GAMES
                    LargeElderlyButton(
                      label: AppStrings.get('btn_play_game', language: lang),
                      emoji: '🌸',
                      backgroundColor: ElderlyTheme.primaryAmber,
                      textColor: Colors.white,
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => FamilyMemoryGame(language: lang),
                          ),
                        );
                      },
                    ),

                    // 2. WHERE AM I? (Requirement #8)
                    LargeElderlyButton(
                      label: lang == 'hi' ? 'MAIN KAHAN HOON?' : (lang == 'as' ? 'MOI KOT AASU?' : 'WHERE AM I?'),
                      emoji: '🏠',
                      backgroundColor: const Color(0xFF0D9488),
                      textColor: Colors.white,
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => WhereAmIScreen(language: lang),
                          ),
                        );
                      },
                    ),

                    // 3. SAFE WALK (Requirement #9)
                    LargeElderlyButton(
                      label: lang == 'hi' ? 'SAFE WALK (SAIR)' : (lang == 'as' ? 'SURAKSHIT KHOJ' : 'SAFE WALK MODE'),
                      emoji: '🚶‍♂️',
                      backgroundColor: ElderlyTheme.sageGreen,
                      textColor: Colors.white,
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => SafeWalkScreen(language: lang),
                          ),
                        );
                      },
                    ),

                    // 4. MY ROUTINE
                    LargeElderlyButton(
                      label: AppStrings.get('btn_my_routine', language: lang),
                      emoji: '⏰',
                      backgroundColor: const Color(0xFF334155),
                      textColor: Colors.white,
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => RoutineScreen(language: lang),
                          ),
                        );
                      },
                    ),

                    // 5. VOICE ASSISTANT
                    LargeElderlyButton(
                      label: AppStrings.get('btn_voice_assist', language: lang),
                      emoji: '🎙️',
                      backgroundColor: const Color(0xFF0284C7),
                      textColor: Colors.white,
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => VoiceScreen(language: lang),
                          ),
                        );
                      },
                    ),

                    const SizedBox(height: 8.0),

                    // 6. SOS / HELP
                    LargeElderlyButton(
                      label: AppStrings.get('btn_help_sos', language: lang),
                      emoji: '🚨',
                      backgroundColor: ElderlyTheme.emergencyRed,
                      textColor: Colors.white,
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => EmergencySOSScreen(language: lang),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

