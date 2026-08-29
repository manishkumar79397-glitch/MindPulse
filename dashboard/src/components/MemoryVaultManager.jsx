import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Mic, Heart, Tag, Trash2 } from 'lucide-react';

export default function MemoryVaultManager() {
  const [items, setItems] = useState([
    {
      id: "vault-1",
      title: "Priyanka Sharma",
      relationship: "Beti (Daughter)",
      image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop&q=80",
      story_text: "Yeh aapki beti Priyanka hai. Guwahati mein software engineer hai.",
      voice_clip: "priyanka_voice.mp3",
      tag: "Family",
      language: "Hindi"
    },
    {
      id: "vault-2",
      title: "Aarav Sharma",
      relationship: "Pota (Grandson)",
      image_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&fit=crop&q=80",
      story_text: "Yeh aapka pota Aarav hai. Usse aapke haath ke bane besan ke laddoo pasand hain.",
      voice_clip: "aarav_laugh.mp3",
      tag: "Family",
      language: "Hindi"
    },
    {
      id: "vault-3",
      title: "Kaziranga Vacation",
      relationship: "Trip with Family",
      image_url: "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=400&fit=crop&q=80",
      story_text: "Aap sabhi parivar ke saath Kaziranga National Park ghoomne gaye the.",
      voice_clip: null,
      tag: "Places & Travel",
      language: "Hindi"
    },
    {
      id: "vault-4",
      title: "Ancestral Home in Guwahati",
      relationship: "Home & Garden",
      image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&fit=crop&q=80",
      story_text: "Guwahati ka ghar jahan aapne tulsi ka pyara paudha lagaya tha.",
      voice_clip: null,
      tag: "Home",
      language: "Hindi"
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRel, setNewRel] = useState('');
  const [newStory, setNewStory] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newTitle) return;
    const newItem = {
      id: "vault-" + Date.now(),
      title: newTitle,
      relationship: newRel || "Family Member",
      image_url: newImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80",
      story_text: newStory || `Yeh ${newTitle} hain.`,
      voice_clip: null,
      tag: "Family",
      language: "Hindi"
    };
    setItems([newItem, ...items]);
    setNewTitle('');
    setNewRel('');
    setNewStory('');
    setNewImageUrl('');
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            Personal Memory Vault
          </h2>
          <p className="text-xs text-slate-500">
            Caregiver-curated family photos, names, and memories automatically power the "Pehchano Kaun?" and "Purane Din" games.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Memory</span>
        </button>
      </div>

      {/* Grid of Vault Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs group flex flex-col justify-between">
            <div>
              <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {item.tag}
                </span>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-rose-600 transition"
                  title="Remove memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4">
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs font-semibold text-amber-700 mt-0.5">{item.relationship}</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed italic line-clamp-2">
                  "{item.story_text}"
                </p>
              </div>
            </div>

            <div className="px-4 pb-4 pt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Mic className="w-3 h-3 text-emerald-600" /> Voice audio prompt
              </span>
              <span className="font-semibold text-slate-600">{item.language}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Memory to Vault</h3>
            <p className="text-xs text-slate-500 mb-4">Upload family photos to personalize your loved one's cognitive activities.</p>

            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name / Place Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Ramesh (Bhai) or Shillong Trip" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Relationship / Connection</label>
                <input 
                  type="text" 
                  placeholder="e.g. Bhai (Brother) / Daughter / Favorite Garden" 
                  value={newRel}
                  onChange={(e) => setNewRel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Image URL (or Photo file)</label>
                <input 
                  type="url" 
                  placeholder="https://... (or choose photo)" 
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Gentle Memory Story (Spoken text prompt)</label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Yeh aapke bhai Ramesh hain. Inhone Diwali par aapko pyari saree bheji thi." 
                  value={newStory}
                  onChange={(e) => setNewStory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

