import 'dart:convert';
import 'package:http/http.dart' as http;
import '../core/constants.dart';
import 'local_db_service.dart';

class SyncEngine {
  static final SyncEngine _instance = SyncEngine._internal();
  factory SyncEngine() => _instance;
  SyncEngine._internal();

  final LocalDatabaseService _db = LocalDatabaseService();

  // Check connectivity and flush sync queue
  Future<bool> synchronize() async {
    try {
      final pendingItems = await _db.getPendingSyncItems();
      if (pendingItems.isEmpty) return true;

      final payload = {
        'patient_id': AppConstants.defaultPatientId,
        'client_timestamp': DateTime.now().toIso8601String(),
        'items': pendingItems.map((item) => item.toJson()).toList(),
      };

      final response = await http.post(
        Uri.parse('${AppConstants.defaultApiUrl}/sync'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(payload),
      ).timeout(const Duration(seconds: 4));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final List<String> syncedIds = List<String>.from(data['synced_ids'] ?? []);
        await _db.removeSyncedItems(syncedIds);
        return true;
      }
      return false;
    } catch (e) {
      // Offline fallback: keep items in queue for next sync attempt
      return false;
    }
  }
}

