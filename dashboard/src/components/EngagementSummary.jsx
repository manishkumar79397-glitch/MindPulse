import React from 'react';
import { Activity, Award, Calendar, CheckCircle2, TrendingUp, AlertCircle, Sparkles, Smile } from 'lucide-react';

export default function EngagementSummary({ summary, onSelectTab }) {
  const engagementScore = summary?.average_engagement_score || 87.4;
  const adherenceRate = Math.round((summary?.routine_adherence_rate || 0.94) * 100);
  const gamesPlayed = summary?.total_games_played || 28;
  const currentDiff = summary?.current_difficulty_level || 2;

  return (
    <div className="space-y-6">
      {/* Important Safety & Medical Positioning Notice */}
      <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3.5 shadow-xs">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <span className="font-bold">Medical Positioning Notice:</span> ManSaathi is designed as a daily cognitive engagement and routine memory support platform. Engagement metrics and difficulty progressions reflect interaction trends and participation, <span className="font-semibold underline">not</span> a clinical diagnostic evaluation of dementia or neurological status.
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Engagement Score Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Engagement Index</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{engagementScore}%</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +4.2% this wk
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${engagementScore}%` }}></div>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Based on accuracy, completion & response time</p>
        </div>

        {/* Routine Adherence Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Routine Adherence</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{adherenceRate}%</span>
            <span className="text-xs font-medium text-slate-500">Meds & Routine</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${adherenceRate}%` }}></div>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">3 of 3 tasks taken on schedule today</p>
        </div>

        {/* Cognitive Activities Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Activities Played</span>
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{gamesPlayed}</span>
            <span className="text-xs font-bold text-indigo-600">Sessions</span>
          </div>
          <p className="mt-3 text-xs text-slate-600">
            Favorite: <span className="font-semibold text-slate-800">Pehchano Kaun?</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Consistent daily morning practice</p>
        </div>

        {/* Adaptive Difficulty Level */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Adaptive Level</span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-700">Level {currentDiff}</span>
            <span className="text-xs text-purple-600 font-semibold">(Moderate)</span>
          </div>
          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4].map(lvl => (
              <div 
                key={lvl} 
                className={`h-2 flex-1 rounded-full ${lvl <= currentDiff ? 'bg-purple-500' : 'bg-slate-100'}`}
              />
            ))}
          </div>
          <p className="mt-2 text-[11px] text-slate-400">3-4 items with familiar voice hints</p>
        </div>
      </div>

      {/* Quick Visual Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule Overview */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              Today's Care Routine & Medication Adherence
            </h3>
            <button 
              onClick={() => onSelectTab('reminders')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              Manage Schedule &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {summary?.active_reminders?.map((rem, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    rem.status === 'TAKEN' || rem.status === 'COMPLETED' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {rem.status === 'TAKEN' || rem.status === 'COMPLETED' ? '✓' : '⏰'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{rem.title}</div>
                    <div className="text-xs text-slate-500">{rem.time_of_day} • Regional Voice Prompt active</div>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  rem.status === 'TAKEN' || rem.status === 'COMPLETED' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {rem.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional & Cultural Engagement */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white p-5 rounded-2xl border border-amber-200/60 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-900 font-bold text-base mb-2">
              <Smile className="w-5 h-5 text-amber-600" />
              North Eastern Regional Focus
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              ManSaathi incorporates familiar sounds, musical instruments (Pepa, Dhol), regional crafts, and traditional attire (Mekhela Chador) to provide comfort and emotional warmth.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-[11px] font-semibold bg-white border border-amber-200 text-amber-800 px-2.5 py-1 rounded-lg">Assamese / Hindi Voice</span>
              <span className="text-[11px] font-semibold bg-white border border-amber-200 text-amber-800 px-2.5 py-1 rounded-lg">Familiar Guwahati Landmark Photos</span>
              <span className="text-[11px] font-semibold bg-white border border-amber-200 text-amber-800 px-2.5 py-1 rounded-lg">Zero Failure Feedback</span>
            </div>
          </div>

          <button 
            onClick={() => onSelectTab('simulator')}
            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm"
          >
            Launch Interactive App Simulator &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

