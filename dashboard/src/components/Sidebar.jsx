import React from 'react';
import { 
  LayoutDashboard, 
  Gamepad2, 
  Image as ImageIcon, 
  Clock, 
  AlertTriangle, 
  Smartphone, 
  BookHeart,
  Compass,
  HelpCircle
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'overview', label: 'Engagement Overview', icon: LayoutDashboard },
    { id: 'games', label: 'Cognitive Activities', icon: Gamepad2 },
    { id: 'memory_vault', label: 'Personal Memory Vault', icon: ImageIcon },
    { id: 'reminders', label: 'Routine & Medicines', icon: Clock },
    { id: 'geofencing', label: 'Safe Zones & Geofencing', icon: Compass },
    { id: 'sos', label: 'SOS & Safety Logs', icon: AlertTriangle },
    { id: 'simulator', label: 'Elderly App Simulator', icon: Smartphone, highlight: true },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 lg:min-h-[calc(100vh-73px)] p-4 flex flex-col justify-between">
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Caregiver Management
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-amber-50 text-amber-900 border border-amber-200/80 font-semibold shadow-xs' 
                  : item.highlight
                    ? 'text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200/60'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : item.highlight ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.highlight && (
                <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full font-bold">Interactive</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 pt-4 border-t border-slate-100">
        <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-100">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-bold mb-1">
            <BookHeart className="w-4 h-4 text-amber-600" />
            <span>Support & Care Tip</span>
          </div>
          <p className="text-xs text-amber-900/80 leading-relaxed">
            Encourage daily morning reminiscence with family photos before medicine routines.
          </p>
        </div>
      </div>
    </aside>
  );
}

