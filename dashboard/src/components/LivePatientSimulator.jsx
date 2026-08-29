import React, { useState } from 'react';
import { 
  Volume2, 
  Wifi, 
  WifiOff, 
  PhoneCall, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Heart, 
  ArrowLeft,
  Mic,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { analyzeGameSession, triggerSOSAlert, processVoiceQuery } from '../services/api';

export default function LivePatientSimulator({ onSyncSession }) {
  // Client state
  const [screen, setScreen] = useState('home'); // 'home', 'game_select', 'game_active', 'routine', 'voice', 'progress', 'sos_sent'
  const [activeGame, setActiveGame] = useState(null);
  const [language, setLanguage] = useState('hi'); // 'hi', 'en', 'as'
  const [isAirplaneMode, setIsAirplaneMode] = useState(false);
  const [localSyncQueue, setLocalSyncQueue] = useState([]);
  const [spokenAudioText, setSpokenAudioText] = useState('Namaste Aai! Aap kya karna chahengi?');
  const [gameStep, setGameStep] = useState(0);
  const [gameFeedback, setGameFeedback] = useState(null);
  const [voiceQueryText, setVoiceQueryText] = useState('');
  const [voiceResponse, setVoiceResponse] = useState(null);

  // Localization strings
  const labels = {
    hi: {
      greeting: "Namaste, Aai! 🌸",
      subtitle: "Aap aaj kya karna chahengi?",
      playGame: "KHEL KHELEIN (GAMES)",
      myRoutine: "MERI DAWA AUR ROUTINE",
      voiceAssist: "MANSAATHI SE BAAT KAREIN",
      myProgress: "MERA ABHYAS (PROGRESS)",
      helpSos: "MADAT / SOS",
      offlineBadge: "Bina Internet (Offline)",
      onlineBadge: "Juda Hua (Online)"
    },
    en: {
      greeting: "Namaste, Aai! 🌸",
      subtitle: "What would you like to do today?",
      playGame: "PLAY GAMES",
      myRoutine: "MY ROUTINE & MEDICINE",
      voiceAssist: "TALK TO MANSAATHI",
      myProgress: "MY DAILY PROGRESS",
      helpSos: "HELP / SOS",
      offlineBadge: "Offline Mode",
      onlineBadge: "Online Sync"
    },
    as: {
      greeting: "Namaskar, Aai! 🌸",
      subtitle: "Aaji apuni ki koribo bisare?",
      playGame: "KHEL KHELU",
      myRoutine: "MUKHYO NIYAM ARU OUKHUDH",
      voiceAssist: "MANSAATHIR LOGOT KOTHA PATU",
      myProgress: "AAMAR PRAGATI",
      helpSos: "SOHAI / SOS",
      offlineBadge: "Offline",
      onlineBadge: "Online"
    }
  };

  const t = labels[language] || labels.hi;

  const playVoice = (text) => {
    setSpokenAudioText(text);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // Calming, slower pace for elderly users
      utterance.pitch = 1.0;
      if (language === 'hi') utterance.lang = 'hi-IN';
      else if (language === 'en') utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartGame = (gameId) => {
    setActiveGame(gameId);
    setGameStep(0);
    setGameFeedback(null);
    setScreen('game_active');
    
    if (gameId === 'pehchano_kaun') {
      playVoice(language === 'hi' ? "Pehchaniye, inme se aapki pyari beti Priyanka kaun hai?" : "Which one is your loving daughter Priyanka?");
    } else if (gameId === 'ghar_ki_cheezein') {
      playVoice(language === 'hi' ? "Chashme ka joda kiske saath banta hai?" : "What do spectacles pair with?");
    } else if (gameId === 'dawa_subah_routine') {
      playVoice(language === 'hi' ? "Subah ka sahi kram chuniye: Chai, Brush ya Dawa?" : "Arrange your morning sequence.");
    } else {
      playVoice(language === 'hi' ? "Pepa aur Dhol ko chhu kar anand lein." : "Tap the traditional NER musical instruments.");
    }
  };

  const handleAnswerGame = async (isCorrect, choiceName) => {
    setGameFeedback({
      correct: true, // Always positive reinforcement!
      message: language === 'hi' 
        ? `Bahut sundar! Aapne bilkul sahi pehchana.` 
        : `Wonderful! You recognized beautifully.`
    });
    playVoice(language === 'hi' ? "Wah Aai! Bahut sundar." : "Wonderful Aai! Well done.");

    // Prepare session result
    const sessionData = {
      patient_id: "a1b2c3d4-0000-0000-0000-000000000001",
      game_id: activeGame,
      difficulty: 2,
      accuracy: 1.0,
      completion_rate: 1.0,
      response_time_seconds: 6.2,
      hints_used: 0,
      language_used: language
    };

    if (isAirplaneMode) {
      // Save locally to offline sync queue
      const queueItem = {
        local_id: "queue-" + Date.now(),
        entity_type: "game_session",
        operation: "INSERT",
        payload: sessionData,
        created_at: new Date().toISOString()
      };
      setLocalSyncQueue([...localSyncQueue, queueItem]);
    } else {
      // Sync immediately with backend
      const result = await analyzeGameSession(sessionData);
      if (onSyncSession) onSyncSession(result);
    }
  };

  const handleToggleAirplaneMode = async () => {
    const nextMode = !isAirplaneMode;
    setIsAirplaneMode(nextMode);

    if (!nextMode && localSyncQueue.length > 0) {
      // Reconnected to internet -> Drain local sync queue
      playVoice("Internet jud gaya hai. Aapka data Surakshit Cloud se sync ho gaya.");
      setLocalSyncQueue([]);
      if (onSyncSession) onSyncSession({ game_name: "Synced Session", engagement_score: 91.5 });
    }
  };

  const handleVoiceQuery = async (query) => {
    setVoiceQueryText(query);
    const res = await processVoiceQuery(query, language);
    setVoiceResponse(res);
    playVoice(res.spoken_response);
  };

  const handleTriggerSOS = async () => {
    playVoice("Madat ka sandesh aapki beti Priyanka ko bhej diya gaya hai.");
    setScreen('sos_sent');
    await triggerSOSAlert({
      patient_id: "a1b2c3d4-0000-0000-0000-000000000001",
      latitude: 26.1445,
      longitude: 91.7362,
      location_name: "Guwahati, Assam"
    });
  };

  return (
    <div className="space-y-6">
      {/* Simulator Control Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-xl">📱</span>
          <div>
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">Interactive Elderly App Simulator</div>
            <div className="text-xs text-slate-400">Experience the interface exactly as an elderly patient experiences it.</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-bold">
            <button 
              onClick={() => setLanguage('hi')} 
              className={`px-3 py-1 rounded-lg ${language === 'hi' ? 'bg-amber-500 text-slate-900' : 'text-slate-300'}`}
            >
              Hindi
            </button>
            <button 
              onClick={() => setLanguage('en')} 
              className={`px-3 py-1 rounded-lg ${language === 'en' ? 'bg-amber-500 text-slate-900' : 'text-slate-300'}`}
            >
              English
            </button>
            <button 
              onClick={() => setLanguage('as')} 
              className={`px-3 py-1 rounded-lg ${language === 'as' ? 'bg-amber-500 text-slate-900' : 'text-slate-300'}`}
            >
              Assamese
            </button>
          </div>

          {/* Airplane Mode Toggle */}
          <button
            onClick={handleToggleAirplaneMode}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              isAirplaneMode 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500' 
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
            }`}
          >
            {isAirplaneMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{isAirplaneMode ? 'Simulate Airplane Mode (Offline)' : 'Online Connected'}</span>
          </button>
        </div>
      </div>

      {/* Offline Queue Indicator */}
      {isAirplaneMode && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2 font-semibold">
            <WifiOff className="w-4 h-4 text-amber-600" />
            <span>Device is in Offline Mode. Core games and reminders continue seamlessly.</span>
          </div>
          <span className="font-bold bg-amber-200 px-2.5 py-1 rounded-lg">
            {localSyncQueue.length} offline actions queued
          </span>
        </div>
      )}

      {/* Spoken Voice Bar */}
      <div className="bg-amber-100/70 border border-amber-300/80 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
        <button 
          onClick={() => playVoice(spokenAudioText)}
          className="p-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition shrink-0 shadow-xs"
          title="Repeat Audio"
        >
          <Volume2 className="w-5 h-5" />
        </button>
        <div className="text-xs sm:text-sm font-medium text-amber-950">
          <span className="font-bold text-amber-900 mr-2">Audio Guide:</span>
          "{spokenAudioText}"
        </div>
      </div>

      {/* Simulated Device Frame */}
      <div className="max-w-md mx-auto bg-amber-50/40 border-8 border-slate-800 rounded-[44px] shadow-2xl overflow-hidden min-h-[620px] flex flex-col justify-between">
        {/* Device Top Speaker / Camera Notch */}
        <div className="bg-slate-800 text-slate-400 py-1.5 px-6 flex items-center justify-between text-[10px]">
          <span>08:30 AM</span>
          <div className="w-16 h-3 bg-slate-900 rounded-full"></div>
          <span>{isAirplaneMode ? '✈ No Net' : '📶 4G Online'}</span>
        </div>

        {/* Screen Container */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          {screen === 'home' && (
            <div className="space-y-4 text-center">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">{t.greeting}</h2>
                <p className="text-sm text-slate-600 mt-1">{t.subtitle}</p>
              </div>

              {/* 5 Massive Elderly Touch Target Action Buttons (Each >= 70px) */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setScreen('game_select')}
                  className="w-full min-h-[74px] p-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-base flex items-center justify-center gap-3 shadow-md shadow-amber-500/20 active:scale-95 transition"
                >
                  <span className="text-2xl">🌸</span>
                  <span>{t.playGame}</span>
                </button>

                <button
                  onClick={() => { setScreen('routine'); playVoice("Aapki dawa aur subah ka samay yahan hai."); }}
                  className="w-full min-h-[74px] p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-md shadow-emerald-600/20 active:scale-95 transition"
                >
                  <span className="text-2xl">⏰</span>
                  <span>{t.myRoutine}</span>
                </button>

                <button
                  onClick={() => { setScreen('voice'); playVoice("Main sun raha hoon, boliye Aai."); }}
                  className="w-full min-h-[74px] p-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-md shadow-sky-600/20 active:scale-95 transition"
                >
                  <span className="text-2xl">🎙️</span>
                  <span>{t.voiceAssist}</span>
                </button>

                <button
                  onClick={() => { setScreen('progress'); playVoice("Aapka abhyas bahut sundar raha hai."); }}
                  className="w-full min-h-[70px] p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-md shadow-indigo-600/20 active:scale-95 transition"
                >
                  <span className="text-2xl">❤️</span>
                  <span>{t.myProgress}</span>
                </button>

                <button
                  onClick={handleTriggerSOS}
                  className="w-full min-h-[70px] p-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-md shadow-rose-600/20 active:scale-95 transition"
                >
                  <span className="text-2xl">🚨</span>
                  <span>{t.helpSos}</span>
                </button>
              </div>
            </div>
          )}

          {screen === 'game_select' && (
            <div className="space-y-4">
              <button 
                onClick={() => { setScreen('home'); playVoice(t.subtitle); }} 
                className="text-xs font-bold text-slate-600 flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200"
              >
                <ArrowLeft className="w-4 h-4" /> <span>Peeche (Back)</span>
              </button>

              <h3 className="text-lg font-extrabold text-slate-900 text-center">Apna Pasandida Khel Chunein</h3>

              <div className="space-y-2.5">
                <button
                  onClick={() => handleStartGame('pehchano_kaun')}
                  className="w-full p-4 rounded-2xl bg-white border-2 border-amber-300 hover:border-amber-500 text-left shadow-xs flex items-center gap-3"
                >
                  <span className="text-3xl">👨‍👩‍👧</span>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Pehchano Kaun?</div>
                    <div className="text-xs text-slate-500">Parivar ke pyare sadasyo ko pehchanein</div>
                  </div>
                </button>

                <button
                  onClick={() => handleStartGame('ghar_ki_cheezein')}
                  className="w-full p-4 rounded-2xl bg-white border-2 border-amber-300 hover:border-amber-500 text-left shadow-xs flex items-center gap-3"
                >
                  <span className="text-3xl">👓</span>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Ghar Ki Cheezein</div>
                    <div className="text-xs text-slate-500">Chashma aur rozmarrah ki cheezein</div>
                  </div>
                </button>

                <button
                  onClick={() => handleStartGame('dawa_subah_routine')}
                  className="w-full p-4 rounded-2xl bg-white border-2 border-amber-300 hover:border-amber-500 text-left shadow-xs flex items-center gap-3"
                >
                  <span className="text-3xl">📋</span>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Subah Ka Routine</div>
                    <div className="text-xs text-slate-500">Chai, Brush aur Dawa ka kram</div>
                  </div>
                </button>

                <button
                  onClick={() => handleStartGame('ner_cultural_memory')}
                  className="w-full p-4 rounded-2xl bg-white border-2 border-amber-300 hover:border-amber-500 text-left shadow-xs flex items-center gap-3"
                >
                  <span className="text-3xl">🪕</span>
                  <div>
                    <div className="font-bold text-sm text-slate-900">NER Sanskriti Chitra</div>
                    <div className="text-xs text-slate-500">Pepa, Dhol aur Mekhela Chador</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {screen === 'game_active' && activeGame === 'pehchano_kaun' && (
            <div className="space-y-4 text-center">
              <button 
                onClick={() => setScreen('game_select')} 
                className="text-xs font-bold text-slate-600 flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200"
              >
                <ArrowLeft className="w-4 h-4" /> <span>Back</span>
              </button>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">Inme se Beti "Priyanka" kaun hain?</h3>
                <p className="text-xs text-amber-800 font-medium mt-1">Tasveer par sparsh karein (Tap image)</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAnswerGame(true, "Priyanka")}
                  className="p-2 rounded-2xl bg-white border-3 border-amber-400 hover:border-amber-600 shadow-md active:scale-95 transition flex flex-col items-center"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80" 
                    alt="Priyanka" 
                    className="w-28 h-28 rounded-xl object-cover"
                  />
                  <span className="mt-2 text-xs font-bold text-slate-800">Priyanka (Beti)</span>
                </button>

                <button
                  onClick={() => handleAnswerGame(true, "Aarav")}
                  className="p-2 rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-400 shadow-md active:scale-95 transition flex flex-col items-center"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&fit=crop&q=80" 
                    alt="Aarav" 
                    className="w-28 h-28 rounded-xl object-cover"
                  />
                  <span className="mt-2 text-xs font-bold text-slate-800">Aarav (Pota)</span>
                </button>
              </div>

              {gameFeedback && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 font-bold text-xs animate-in zoom-in-90 duration-200">
                  🌸 {gameFeedback.message}
                </div>
              )}
            </div>
          )}

          {screen === 'game_active' && activeGame === 'ghar_ki_cheezein' && (
            <div className="space-y-4 text-center">
              <button onClick={() => setScreen('game_select')} className="text-xs font-bold text-slate-600 flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200">
                <ArrowLeft className="w-4 h-4" /> <span>Back</span>
              </button>

              <h3 className="text-base font-extrabold text-slate-900">Chashma (Spectacles) kiske liye hota hai?</h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAnswerGame(true, "Aankhein")}
                  className="p-4 rounded-2xl bg-white border-3 border-amber-400 shadow-md active:scale-95 transition flex flex-col items-center gap-2"
                >
                  <span className="text-4xl">👀</span>
                  <span className="text-xs font-bold text-slate-800">Aankhon Ke Liye</span>
                </button>

                <button
                  onClick={() => handleAnswerGame(true, "Kaan")}
                  className="p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-md active:scale-95 transition flex flex-col items-center gap-2"
                >
                  <span className="text-4xl">👂</span>
                  <span className="text-xs font-bold text-slate-800">Kaan Ke Liye</span>
                </button>
              </div>

              {gameFeedback && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 font-bold text-xs">
                  🌸 {gameFeedback.message}
                </div>
              )}
            </div>
          )}

          {screen === 'routine' && (
            <div className="space-y-3">
              <button onClick={() => setScreen('home')} className="text-xs font-bold text-slate-600 flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200">
                <ArrowLeft className="w-4 h-4" /> <span>Back</span>
              </button>

              <h3 className="text-base font-extrabold text-slate-900 text-center">Aaj Ka Niyam (Routine)</h3>

              <div className="space-y-2">
                <div className="p-3.5 rounded-2xl bg-white border-2 border-emerald-400 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Subah Ki Dawa (Amlodipine)</div>
                    <div className="text-[11px] text-emerald-700 font-semibold">08:30 AM • Li gayi (Taken)</div>
                  </div>
                  <span className="text-emerald-700 text-lg font-bold">✓</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border-2 border-amber-400 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Taaza Paani aur Sair</div>
                    <div className="text-[11px] text-amber-700 font-semibold">04:00 PM • Agli baar</div>
                  </div>
                  <span className="text-amber-700 text-sm font-bold">⏰</span>
                </div>
              </div>
            </div>
          )}

          {screen === 'voice' && (
            <div className="space-y-4 text-center">
              <button onClick={() => setScreen('home')} className="text-xs font-bold text-slate-600 flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200">
                <ArrowLeft className="w-4 h-4" /> <span>Back</span>
              </button>

              <h3 className="text-base font-extrabold text-slate-900">Boliye, Hum Sun Rahe Hain</h3>
              
              <div className="w-20 h-20 mx-auto rounded-full bg-sky-100 border-4 border-sky-500 flex items-center justify-center text-sky-600 animate-pulse">
                <Mic className="w-10 h-10" />
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-slate-500">Jaise boliye:</p>
                <button 
                  onClick={() => handleVoiceQuery("Subah ki dawa kab leni hai?")}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 font-semibold text-slate-800 hover:border-sky-500 text-left"
                >
                  💬 "Subah ki dawa kab leni hai?"
                </button>
                <button 
                  onClick={() => handleVoiceQuery("Beti Priyanka se baat karni hai")}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 font-semibold text-slate-800 hover:border-sky-500 text-left"
                >
                  💬 "Beti Priyanka se baat karni hai"
                </button>
                <button 
                  onClick={() => handleVoiceQuery("Parivar ke purane din yaad karne hain")}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 font-semibold text-slate-800 hover:border-sky-500 text-left"
                >
                  💬 "Purane din yaad karne hain"
                </button>
              </div>

              {voiceResponse && (
                <div className="p-3 bg-sky-50 border border-sky-300 rounded-2xl text-sky-900 text-xs text-left font-medium">
                  <span className="font-bold">ManSaathi:</span> {voiceResponse.spoken_response}
                </div>
              )}
            </div>
          )}

          {screen === 'progress' && (
            <div className="space-y-4 text-center">
              <button onClick={() => setScreen('home')} className="text-xs font-bold text-slate-600 flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200">
                <ArrowLeft className="w-4 h-4" /> <span>Back</span>
              </button>

              <h3 className="text-base font-extrabold text-slate-900">Aapka Pyara Abhyas 🌸</h3>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="text-3xl">🌟</div>
                <div className="text-sm font-bold text-slate-800">Shabash Aai!</div>
                <p className="text-xs text-slate-500">Aapne lagataar 5 din parivar ki yaadein aur games khele hain.</p>
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 py-1.5 rounded-xl">
                  Dawa Routine: 100% Pura
                </div>
              </div>
            </div>
          )}

          {screen === 'sos_sent' && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 border-4 border-rose-500 flex items-center justify-center text-rose-600">
                <PhoneCall className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-rose-800">Madat Sandesh Bheja Gaya</h3>
              <p className="text-xs text-slate-600">
                Priyanka (+91 98765 43210) aur Dr. Baruah ko aapki sthiti aur GPS location bhej di gayi hai.
              </p>
              <button 
                onClick={() => setScreen('home')} 
                className="w-full py-3 bg-slate-900 text-white font-bold rounded-2xl text-xs"
              >
                Ghar Wapas (Back to Home)
              </button>
            </div>
          )}
        </div>

        {/* Device Bottom Home Bar */}
        <div className="bg-slate-800 py-3 flex justify-center">
          <div className="w-28 h-1 bg-slate-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

