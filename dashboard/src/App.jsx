import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import EngagementSummary from './components/EngagementSummary';
import GameSessionHistory from './components/GameSessionHistory';
import MemoryVaultManager from './components/MemoryVaultManager';
import ReminderScheduleManager from './components/ReminderScheduleManager';
import SOSAlertsLog from './components/SOSAlertsLog';
import LivePatientSimulator from './components/LivePatientSimulator';
import { fetchPatientSummary, triggerSOSAlert } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [patientSummary, setPatientSummary] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const data = await fetchPatientSummary();
      setPatientSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerDrill = async () => {
    await triggerSOSAlert({
      patient_id: "a1b2c3d4-0000-0000-0000-000000000001",
      latitude: 26.1445,
      longitude: 91.7362,
      location_name: "Guwahati, Assam",
      trigger_type: "Caregiver Safety Drill"
    });
    // Refresh alerts
    loadSummary();
  };

  const handleSyncSession = (newSession) => {
    if (!patientSummary) return;
    setPatientSummary(prev => ({
      ...prev,
      total_games_played: prev.total_games_played + 1,
      average_engagement_score: Math.min(100, Math.round((prev.average_engagement_score * 0.9 + 90 * 0.1) * 10) / 10),
      recent_sessions: [
        {
          game_id: newSession.game_id || "pehchano_kaun",
          game_name: newSession.game_name || "Pehchano Kaun? (Family Memory)",
          difficulty: newSession.next_difficulty || 2,
          accuracy: 1.0,
          completion_rate: 1.0,
          response_time_seconds: 6.2,
          engagement_score: newSession.engagement_score || 91.5,
          completed_at: new Date().toISOString()
        },
        ...prev.recent_sessions
      ]
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col">
      <Header 
        patient={patientSummary} 
        isOnline={isOnline} 
        onTriggerDrill={handleTriggerDrill} 
      />

      <div className="flex-1 flex flex-col lg:flex-row">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'overview' && (
            <EngagementSummary 
              summary={patientSummary} 
              onSelectTab={setActiveTab} 
            />
          )}

          {activeTab === 'games' && (
            <GameSessionHistory 
              sessions={patientSummary?.recent_sessions} 
              onPlayDemo={(gameId) => {
                setActiveTab('simulator');
              }}
            />
          )}

          {activeTab === 'memory_vault' && (
            <MemoryVaultManager />
          )}

          {activeTab === 'reminders' && (
            <ReminderScheduleManager />
          )}

          {activeTab === 'sos' && (
            <SOSAlertsLog 
              alerts={patientSummary?.recent_sos_alerts} 
              onTriggerTestAlert={handleTriggerDrill} 
            />
          )}

          {activeTab === 'simulator' && (
            <LivePatientSimulator onSyncSession={handleSyncSession} />
          )}
        </main>
      </div>
    </div>
  );
}

