import 'package:flutter_tts/flutter_tts.dart';

class VoiceAssistantService {
  static final VoiceAssistantService _instance = VoiceAssistantService._internal();
  factory VoiceAssistantService() => _instance;
  VoiceAssistantService._internal();

  final FlutterTts _tts = FlutterTts();
  bool _isInitialized = false;

  Future<void> init() async {
    if (_isInitialized) return;
    await _tts.setSpeechRate(0.42); // Slow, patient, reassuring pace for elderly users
    await _tts.setPitch(1.0);
    await _tts.setVolume(1.0);
    _isInitialized = true;
  }

  Future<void> speak(String text, {String language = 'hi'}) async {
    await init();
    if (language == 'hi') {
      await _tts.setLanguage('hi-IN');
    } else if (language == 'as') {
      await _tts.setLanguage('as-IN');
    } else {
      await _tts.setLanguage('en-IN');
    }
    await _tts.speak(text);
  }

  Future<void> stop() async {
    await _tts.stop();
  }
}

