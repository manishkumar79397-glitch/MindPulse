import React from 'react';
import { Heart, Bell, ShieldCheck, Wifi, User, PhoneCall } from 'lucide-react';

export default function Header({ patient, isOnline, onTriggerDrill }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 font-bold text-xl">
          🌸
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">ManSaathi</h1>
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">Caregiver Portal</span>
          </div>
          <p className="text-xs text-slate-500">Mind ka Saathi • North Eastern Region Care Companion</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Patient Badge */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5">
          <img 
            src={patient?.photo_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&fit=crop&q=80"} 
            alt="Patient" 
            className="w-8 h-8 rounded-full object-cover border border-amber-300"
          />
          <div className="text-left">
            <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              {patient?.name || "Aai (Anjali Sharma)"}
              <span className="text-xs text-slate-400">({patient?.age || 76} yrs)</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active today
            </div>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border ${
          isOnline ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
        }`}>
          <Wifi className="w-3.5 h-3.5" />
          <span>{isOnline ? 'Cloud Synced' : 'Offline Mode'}</span>
        </div>

        {/* Safety Drill Action */}
        <button 
          onClick={onTriggerDrill}
          className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Test SOS Drill</span>
        </button>
      </div>
    </header>
  );
}

