import 'package:flutter/material.dart';
import '../core/theme.dart';

class LargeElderlyButton extends StatelessWidget {
  final String label;
  final String? emoji;
  final IconData? icon;
  final Color backgroundColor;
  final Color textColor;
  final VoidCallback onPressed;

  const LargeElderlyButton({
    super.key,
    required this.label,
    this.emoji,
    this.icon,
    this.backgroundColor = ElderlyTheme.primaryAmber,
    this.textColor = ElderlyTheme.textDark,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 6.0),
      child: Material(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(24.0),
        elevation: 2.0,
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(24.0),
          child: Container(
            constraints: const BoxConstraints(
              minHeight: ElderlyTheme.minTouchTarget,
            ),
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (emoji != null) ...[
                  Text(
                    emoji!,
                    style: const TextStyle(fontSize: 28.0),
                  ),
                  const SizedBox(width: 14.0),
                ] else if (icon != null) ...[
                  Icon(icon, size: 28.0, color: textColor),
                  const SizedBox(width: 14.0),
                ],
                Flexible(
                  child: Text(
                    label,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 19.0,
                      fontWeight: FontWeight.w800,
                      color: textColor,
                      letterSpacing: 0.2,
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

