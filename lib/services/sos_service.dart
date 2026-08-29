import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';
import '../core/constants.dart';

class SOSService {
  static final SOSService _instance = SOSService._internal();
  factory SOSService() => _instance;
  SOSService._internal();

  Future<bool> triggerEmergencyAlert({
    double lat = AppConstants.defaultLat,
    double lng = AppConstants.defaultLng,
  }) async {
    try {
      final payload = {
        'patient_id': AppConstants.defaultPatientId,
        'latitude': lat,
        'longitude': lng,
        'location_name': 'Guwahati, Assam',
        'trigger_type': 'manual_sos',
      };

      final response = await http.post(
        Uri.parse('${AppConstants.defaultApiUrl}/emergency'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(payload),
      ).timeout(const Duration(seconds: 4));

      return response.statusCode == 200;
    } catch (e) {
      // Offline fallback: Attempt direct SMS / telephone dialer to primary caregiver
      final fallbackTel = Uri.parse('tel:+919876543210');
      if (await canLaunchUrl(fallbackTel)) {
        await launchUrl(fallbackTel);
      }
      return true;
    }
  }
}

