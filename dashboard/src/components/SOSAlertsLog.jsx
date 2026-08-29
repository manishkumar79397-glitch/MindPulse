import React, { useState } from 'react';
import { AlertTriangle, MapPin, PhoneCall, ShieldCheck, ExternalLink, CheckCircle } from 'lucide-react';

export default function SOSAlertsLog({ alerts, onTriggerTestAlert }) {
  const [drillSuccess, setDrillSuccess] = useState(false);

  const handleDrill = () => {
    onTriggerTestAlert();
    setDrillSuccess(true);
    setTimeout(() => setDrillSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            Emergency SOS & Safety Monitoring
          </h2>
          <p className="text-xs text-slate-500">
            One-touch high-contrast SOS on patient's device dispatches real-time alerts with GPS coordinates to configured family contacts.
          </p>
        </div>

        <button
          onClick={handleDrill}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm self-start sm:self-auto"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Simulate Safety Drill</span>
        </button>
      </div>

      {drillSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-xs animate-in fade-in duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold">Test Emergency Drill Dispatched:</span> Verified SMS alert simulation sent to Priyanka Sharma (+91 98765 43210) and Dr. Baruah with current GPS coordinates.
          </div>
        </div>
      )}

      {/* Emergency Contacts Config */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Designated Emergency Contacts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                PS
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Priyanka Sharma (Daughter)</div>
                <div className="text-[11px] text-slate-500">+91 98765 43210 • Primary Caregiver</div>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">Priority 1</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                DB
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Dr. Baruah (Family Clinic)</div>
                <div className="text-[11px] text-slate-500">+91 98112 23344 • Guwahati</div>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">Priority 2</span>
          </div>
        </div>
      </div>

      {/* Emergency Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Event & Drill History</h3>

        <div className="space-y-3">
          {alerts?.map((alert, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{alert.trigger_type}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{alert.location_name} • {alert.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=26.1445,91.7362" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs text-amber-700 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>View GPS Location</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  {alert.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

