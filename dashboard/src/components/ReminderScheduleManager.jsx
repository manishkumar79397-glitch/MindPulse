import React, { useState } from 'react';
import { Clock, Plus, Bell, Volume2, Pill, Droplet, Sun, Trash2 } from 'lucide-react';

export default function ReminderScheduleManager() {
  const [reminders, setReminders] = useState([
    {
      id: "rem-1",
      title: "Subah ki BP Dawa (Amlodipine)",
      description: "1 tablet with lukewarm water after morning tea",
      time: "08:30 AM",
      category: "medicine",
      voice_prompt: "Namaste Aai, aapki subah ki dawa lene ka samay ho gaya hai.",
      repeat: "Everyday",
      active: true
    },
    {
      id: "rem-2",
      title: "Taaza Paani aur Baageeche ki Sair",
      description: "Drink 1 glass of water and sit in the garden for fresh air",
      time: "04:00 PM",
      category: "hydration",
      voice_prompt: "Aai, thoda paani pee lijiye aur baageeche mein taazi hawa lijiye.",
      repeat: "Everyday",
      active: true
    },
    {
      id: "rem-3",
      title: "Raat ka Calcium aur Garam Doodh",
      description: "Take calcium tablet with warm milk before sleep",
      time: "08:30 PM",
      category: "medicine",
      voice_prompt: "Aai, raat ka doodh aur calcium lene ka samay ho gaya hai.",
      repeat: "Everyday",
      active: true
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00 AM');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('medicine');
  const [voicePrompt, setVoicePrompt] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title) return;
    const newRem = {
      id: "rem-" + Date.now(),
      title,
      description: desc || "Daily scheduled reminder",
      time,
      category,
      voice_prompt: voicePrompt || `Namaste, ${title} ka samay ho gaya hai.`,
      repeat: "Everyday",
      active: true
    };
    setReminders([...reminders, newRem]);
    setTitle('');
    setDesc('');
    setVoicePrompt('');
    setShowModal(false);
  };

  const toggleActive = (id) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const handleDelete = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'medicine': return <Pill className="w-4 h-4 text-rose-500" />;
      case 'hydration': return <Droplet className="w-4 h-4 text-sky-500" />;
      default: return <Sun className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            Routine & Medication Schedules
          </h2>
          <p className="text-xs text-slate-500">
            Schedules sync automatically to the patient's device for 100% offline alarm notifications with regional audio prompts.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reminders.map((rem) => (
          <div key={rem.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    {getCategoryIcon(rem.category)}
                  </span>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">{rem.category}</span>
                </div>
                <span className="text-sm font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  {rem.time}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{rem.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{rem.description}</p>

              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                <Volume2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-600 italic">
                  "{rem.voice_prompt}"
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rem.active} 
                  onChange={() => toggleActive(rem.id)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span>Active Local Alarm</span>
              </label>

              <button 
                onClick={() => handleDelete(rem.id)}
                className="text-slate-400 hover:text-rose-600 transition p-1"
                title="Delete reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Medication / Routine Alarm</h3>
            <p className="text-xs text-slate-500 mb-4">Set audio-assisted local alerts for your loved one.</p>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reminder Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Afternoon Blood Pressure Tablet" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Time</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 02:00 PM" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-amber-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-amber-500"
                  >
                    <option value="medicine">Medicine</option>
                    <option value="hydration">Hydration</option>
                    <option value="walk">Daily Walk / Fresh Air</option>
                    <option value="meal">Meal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Instructions / Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. 1 tablet with fresh water" 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Voice Audio Announcement Text</label>
                <textarea 
                  rows={2}
                  placeholder="e.g. Namaste Aai, dopahar ki dawa lene ka samay ho gaya hai." 
                  value={voicePrompt}
                  onChange={(e) => setVoicePrompt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

