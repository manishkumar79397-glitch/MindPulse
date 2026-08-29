import React from 'react';
import { Gamepad2, Award, Clock, Sparkles, Check, ArrowRight } from 'lucide-react';

export default function GameSessionHistory({ sessions, onPlayDemo }) {
  const gamesCatalog = [
    {
      id: "pehchano_kaun",
      name: "Pehchano Kaun? (Family Memory)",
      description: "Shows 3–4 family photos with audio guidance to recognize children & grandchildren.",
      category: "Memory & Facial Recognition",
      icon: "👨‍👩‍👧‍👦",
      level: 2
    },
    {
      id: "purane_din",
      name: "Purane Din (Story & Event Recall)",
      description: "Reminisce about pleasant family gatherings and regional landmarks with simple Yes/No questions.",
      category: "Reminiscence Therapy",
      icon: "🏡",
      level: 1
    },
    {
      id: "dawa_subah_routine",
      name: "Dawa Aur Routine (Sequencing)",
      description: "Arrange daily morning activities in logical sequence (Tea -> Brushing -> Medicine).",
      category: "Executive Function",
      icon: "📋",
      level: 2
    },
    {
      id: "ghar_ki_cheezein",
      name: "Ghar Ki Cheezein (Object Matching)",
      description: "Match familiar everyday objects with their functional pairs (Spectacles -> Eyes).",
      category: "Associative Recall",
      icon: "👓",
      level: 1
    },
    {
      id: "ner_cultural_memory",
      name: "NER Cultural Heritage",
      description: "Traditional North Eastern items: Pepa, Dhol, Bamboo Flute, Mekhela Chador.",
      category: "Cultural Visual Memory",
      icon: "🪕",
      level: 2
    },
    {
      id: "gentle_motor_tap",
      name: "Gentle Petals & Bubbles",
      description: "Calming, low-stress motor exercise touching gentle floating bubbles with peaceful nature sounds.",
      category: "Motor Coordination",
      icon: "🌸",
      level: 1
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-amber-600" />
            Cognitive Engagement Suite
          </h2>
          <p className="text-xs text-slate-500">6 non-stressful, repeatable exercises tuned for elderly accessibility</p>
        </div>
      </div>

      {/* Available Games Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gamesCatalog.map((game) => (
          <div 
            key={game.id} 
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-amber-300 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{game.icon}</span>
                <span className="text-xs bg-purple-50 text-purple-700 font-semibold px-2.5 py-1 rounded-full border border-purple-200">
                  Level {game.level}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{game.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{game.description}</p>
              <div className="mt-3 text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-1 rounded-lg inline-block">
                {game.category}
              </div>
            </div>

            <button
              onClick={() => onPlayDemo(game.id)}
              className="mt-5 w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-amber-500 hover:text-white text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-200 hover:border-amber-500"
            >
              <span>Simulate Game</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Recent Session Logs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          Recent Engagement Sessions
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-2">Activity Name</th>
                <th className="pb-3">Difficulty</th>
                <th className="pb-3">Participation Accuracy</th>
                <th className="pb-3">Avg Response Time</th>
                <th className="pb-3">Engagement Index</th>
                <th className="pb-3">Completed Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sessions?.map((session, index) => (
                <tr key={index} className="hover:bg-slate-50/60">
                  <td className="py-3.5 pl-2 font-semibold text-slate-900">{session.game_name}</td>
                  <td className="py-3.5">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      Level {session.difficulty}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      {Math.round(session.accuracy * 100)}%
                    </span>
                  </td>
                  <td className="py-3.5">{session.response_time_seconds}s</td>
                  <td className="py-3.5 font-bold text-amber-700">{session.engagement_score}%</td>
                  <td className="py-3.5 text-slate-400">
                    {new Date(session.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

