import 'package:flutter/material.dart';
import 'core/theme.dart';
import 'screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ManSaathiApp());
}

class ManSaathiApp extends StatefulWidget {
  const ManSaathiApp({super.key});

  @override
  State<ManSaathiApp> createState() => _ManSaathiAppState();
}

class _ManSaathiAppState extends State<ManSaathiApp> {
  String _selectedLanguage = 'hi';

  void _updateLanguage(String newLang) {
    setState(() {
      _selectedLanguage = newLang;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ManSaathi',
      debugShowCheckedModeBanner: false,
      theme: ElderlyTheme.lightTheme,
      home: HomeScreen(
        language: _selectedLanguage,
        onLanguageChanged: _updateLanguage,
      ),
    );
  }
}

