import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/game_session.dart';
import '../models/reminder.dart';
import '../models/memory_item.dart';
import '../models/sync_item.dart';

class LocalDatabaseService {
  static final LocalDatabaseService _instance = LocalDatabaseService._internal();
  factory LocalDatabaseService() => _instance;
  LocalDatabaseService._internal();

  static const String _sessionsKey = 'local_game_sessions';
  static const String _syncQueueKey = 'local_sync_queue';
  static const String _remindersKey = 'local_reminders';
  static const String _memoryVaultKey = 'local_memory_vault';

  // Save game session locally
  Future<void> saveGameSession(GameSession session) async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> sessions = prefs.getStringList(_sessionsKey) ?? [];
    sessions.add(jsonEncode(session.toJson()));
    await prefs.setStringList(_sessionsKey, sessions);

    // Also add to sync queue
    await addToSyncQueue(SyncItem(
      localId: 'sess_${DateTime.now().millisecondsSinceEpoch}',
      entityType: 'game_session',
      operation: 'INSERT',
      payload: session.toJson(),
    ));
  }

  // Get all local game sessions
  Future<List<GameSession>> getGameSessions() async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> sessionsJson = prefs.getStringList(_sessionsKey) ?? [];
    return sessionsJson
        .map((s) => GameSession.fromJson(jsonDecode(s)))
        .toList();
  }

  // Add item to sync queue
  Future<void> addToSyncQueue(SyncItem item) async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> queue = prefs.getStringList(_syncQueueKey) ?? [];
    queue.add(jsonEncode(item.toJson()));
    await prefs.setStringList(_syncQueueKey, queue);
  }

  // Get pending sync queue items
  Future<List<SyncItem>> getPendingSyncItems() async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> queue = prefs.getStringList(_syncQueueKey) ?? [];
    return queue.map((s) => SyncItem.fromJson(jsonDecode(s))).toList();
  }

  // Clear synced items from queue
  Future<void> removeSyncedItems(List<String> localIds) async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> queue = prefs.getStringList(_syncQueueKey) ?? [];
    final updatedQueue = queue.where((itemStr) {
      final item = SyncItem.fromJson(jsonDecode(itemStr));
      return !localIds.contains(item.localId);
    }).toList();
    await prefs.setStringList(_syncQueueKey, updatedQueue);
  }

  // Seed default Memory Vault items
  Future<List<MemoryItem>> getMemoryVaultItems() async {
    return [
      MemoryItem(
        id: 'mem-1',
        patientId: 'a1b2c3d4-0000-0000-0000-000000000001',
        title: 'Priyanka Sharma',
        relationship: 'Beti (Daughter)',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop&q=80',
        storyText: 'Yeh aapki beti Priyanka hai. Guwahati mein software engineer hai.',
        language: 'hi',
      ),
      MemoryItem(
        id: 'mem-2',
        patientId: 'a1b2c3d4-0000-0000-0000-000000000001',
        title: 'Aarav Sharma',
        relationship: 'Pota (Grandson)',
        imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&fit=crop&q=80',
        storyText: 'Yeh aapka pota Aarav hai. Usse aapke haath ke bane besan ke laddoo pasand hain.',
        language: 'hi',
      ),
    ];
  }
}

