import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Plus, 
  AlertTriangle, 
  PhoneCall, 
  Compass, 
  Sliders, 
  CheckCircle2, 
  ExternalLink,
  Navigation,
  Activity,
  BatteryCharging,
  EyeOff
} from 'lucide-react';
import { fetchSafeLocations, checkGeofence } from '../services/api';

export default function SafeZonesGeofencing({ onLaunchSimulator }) {
  const [locations, setLocations] = useState([]);
  const [simulatedBreach, setSimulatedBreach] = useState(false);
  const [breachData, setBreachData] = useState(null);
  const [activeTab, setActiveTab] = useState('zones'); // 'zones', 'alerts'

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    const data = await fetchSafeLocations();
    setLocations(data);
  };

  const handleSimulateBreach = async () => {
    setSimulatedBreach(true);
    const result = await checkGeofence(26.1750, 91.7750, 'sim-walk-1', 'hi');
    setBreachData(result.alert_details || {
      type: "SAFE_ZONE_BREACH",
      patient_name: "Aai (Anjali Sharma)",
      message: "Aai appears to have moved outside the configured safe area (850m from Ghar).",
      latitude: 26.1750,
      longitude: 91.7750,
      nearest_location: "Ghar (Home)",
      distance_meters: 850,
      maps_url: "https://www.google.com/maps/search/?api=1&query=26.1750,91.7750",
      caregiver_notified: "Amit Sharma",
      timestamp: "Just now"
    });
  };

  const handleClearBreach = () => {
    setSimulatedBreach(false);
    setBreachData(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-600" />
            Safe Zones & Geofencing Intelligence
          </h2>
          <p className="text-xs text-slate-500">
            Configure familiar safety perimeters and monitor gentle Safe Walks with automated caregiver alerts upon perimeter exit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateBreach}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Test Geofence Breach</span>
          </button>
        </div>
      </div>

      {/* Geofence Breach Alert Banner (Spec Requirement #9) */}
      {simulatedBreach && breachData && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 shadow-md animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-rose-600 text-white rounded-2xl shrink-0 shadow-sm animate-pulse">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold bg-rose-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    ⚠️ SAFE ZONE ALERT
                  </span>
                  <span className="text-xs text-rose-800 font-semibold">{breachData.timestamp}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                  {breachData.message}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Designated Caregiver <span className="font-bold text-slate-800">Amit Sharma (+91 98765 43210)</span> has been alerted via SMS.
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
              <a
                href={breachData.maps_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-rose-300 text-rose-700 hover:bg-rose-100/50 rounded-xl text-xs font-bold transition shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>VIEW LOCATION</span>
              </a>

              <a
                href="tel:+919876543210"
                className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>CALL AMIT</span>
              </a>

              <button
                onClick={handleClearBreach}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-white text-xs font-semibold"
                title="Acknowledge alert"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Walk Status Card */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-white border border-emerald-200/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-md shadow-emerald-600/20">
            🚶‍♂️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Safe Walk Active</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              Inside Safe Zone: <span className="text-emerald-700">🏠 Ghar (Home) Perimeter</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Current distance: 45m from center • Safe perimeter: 400m
            </div>
          </div>
        </div>

        {/* Privacy & Battery Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
            <span>Battery-Efficient Periodic GPS</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
            <EyeOff className="w-3.5 h-3.5 text-blue-600" />
            <span>Privacy First (Zero Public Logs)</span>
          </div>
        </div>
      </div>

      {/* Configured Safe Locations Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Configured Safe Locations & Geofence Perimeters
          </h3>
          <span className="text-xs text-slate-400">Total {locations.length} Safe Zones</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {locations.map((loc) => (
            <div 
              key={loc.id} 
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-amber-300 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{loc.icon}</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    {loc.radius_meters}m Safe Radius
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{loc.name}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{loc.address}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Guwahati, Assam</span>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-700 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Map Pin</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* "Where Am I?" Concept Demonstration */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
            <span>🏠</span>
            <span>"Where Am I?" ("Main Kahan Hoon?") Safety Feature</span>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            When elderly users feel disoriented, they can ask <span className="font-bold text-slate-800">"Main kahan hoon?"</span>. The system suppresses complex GPS coordinates and gives a gentle, calming response: <span className="font-semibold text-emerald-800">"Aap ghar ke paas hain."</span> with a 1-tap button to call caregiver Amit.
          </p>
        </div>

        <button
          onClick={onLaunchSimulator}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shrink-0 shadow-sm"
        >
          Try in App Simulator &rarr;
        </button>
      </div>
    </div>
  );
}

