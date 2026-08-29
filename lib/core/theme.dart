import 'package:flutter/material.dart';

class ElderlyTheme {
  // Soothing, high-contrast, elderly-friendly color palette
  static const Color primaryAmber = Color(0xFFD97706);
  static const Color primaryAmberLight = Color(0xFFFEF3C7);
  static const Color sageGreen = Color(0xFF3D6749);
  static const Color sageGreenLight = Color(0xFFE5EBE5);
  static const Color backgroundWarm = Color(0xFFFDFBF7);
  static const Color surfaceCard = Color(0xFFFFFFFF);
  static const Color textDark = Color(0xFF1E293B);
  static const Color textMuted = Color(0xFF64748B);
  static const Color emergencyRed = Color(0xFFDC2626);
  static const Color emergencyRedLight = Color(0xFFFEE2E2);

  // Minimum touch target sizes for elderly accessibility
  static const double minTouchTarget = 72.0;
  static const double largeButtonHeight = 78.0;

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: backgroundWarm,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryAmber,
        primary: primaryAmber,
        secondary: sageGreen,
        background: backgroundWarm,
        surface: surfaceCard,
      ),
      textTheme: const TextTheme(
        headlineLarge: TextStyle(
          fontSize: 28.0,
          fontWeight: FontWeight.w800,
          color: textDark,
          height: 1.3,
        ),
        headlineMedium: TextStyle(
          fontSize: 24.0,
          fontWeight: FontWeight.w700,
          color: textDark,
          height: 1.3,
        ),
        titleLarge: TextStyle(
          fontSize: 20.0,
          fontWeight: FontWeight.w700,
          color: textDark,
        ),
        bodyLarge: TextStyle(
          fontSize: 18.0,
          fontWeight: FontWeight.w600,
          color: textDark,
          height: 1.4,
        ),
        bodyMedium: TextStyle(
          fontSize: 16.0,
          fontWeight: FontWeight.w500,
          color: textMuted,
        ),
        labelLarge: TextStyle(
          fontSize: 18.0,
          fontWeight: FontWeight.w700,
          color: textDark,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          minimumSize: const Size.fromHeight(largeButtonHeight),
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 18.0),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20.0),
          ),
          elevation: 2.0,
        ),
      ),
    );
  }
}

