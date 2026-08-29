import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../core/localization.dart';
import '../widgets/audio_prompt_bar.dart';
import '../services/voice_service.dart';

class RoutineScreen extends StatelessWidget {
  final String language;

  const RoutineScreen({super.key, this.language = 'hi'});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          AppStrings.get('btn_my_routine', language: language),
          style: const TextStyle(fontSize: 20.0, fontWeight: FontWeight.w700),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              AudioPromptBar(
                text: 'Aapki subah ki dawa lene ka samay ho gaya hai.',
                language: language,
              ),
              const SizedBox(height: 16.0),
              Expanded(
                child: ListView(
                  children: [
                    _buildRoutineCard(
                      context,
                      time: '08:30 AM',
                      title: 'Subah ki BP Dawa (Amlodipine)',
                      description: 'Take 1 tablet with warm water after breakfast',
                      isTaken: true,
                    ),
                    _buildRoutineCard(
                      context,
                      time: '04:00 PM',
                      title: 'Taaza Paani aur Baageeche ki Sair',
                      description: 'Drink a glass of water and enjoy 10 minutes outside',
                      isTaken: false,
                    ),
                    _buildRoutineCard(
                      context,
                      time: '08:30 PM',
                      title: 'Raat ka Calcium aur Garam Doodh',
                      description: 'Take calcium tablet before sleep',
                      isTaken: false,
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

  Widget _buildRoutineCard(
    BuildContext context, {
    required String time,
    required String title,
    required String description,
    required bool isTaken,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14.0),
      padding: const EdgeInsets.all(18.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22.0),
        border: Border.all(
          color: isTaken ? ElderlyTheme.sageGreen : const Color(0xFFE2E8F0),
          width: isTaken ? 2.0 : 1.0,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0A000000),
            blurRadius: 8.0,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Text(
                time,
                style: const TextStyle(
                  fontSize: 18.0,
                  fontWeight: FontWeight.w800,
                  color: ElderlyTheme.primaryAmber,
                ),
              ),
              if (isTaken)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 4.0),
                  decoration: BoxDecoration(
                    color: ElderlyTheme.sageGreenLight,
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                  child: const Text(
                    '✓ Li Gayi',
                    style: TextStyle(
                      color: ElderlyTheme.sageGreen,
                      fontWeight: FontWeight.bold,
                      fontSize: 13.0,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 8.0),
          Text(
            title,
            style: const TextStyle(
              fontSize: 17.0,
              fontWeight: FontWeight.w700,
              color: ElderlyTheme.textDark,
            ),
          ),
          const SizedBox(height: 4.0),
          Text(
            description,
            style: const TextStyle(
              fontSize: 14.0,
              color: ElderlyTheme.textMuted,
            ),
          ),
        ],
      ),
    );
  }
}

