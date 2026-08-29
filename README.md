# 🌸 ManSaathi ("Mind ka Saathi")
### AI-Based Cognitive Gaming & Memory Assistance Platform for Elderly Dementia Patients in the North Eastern Region (NER)

---

## 🌟 Overview & Mission

**ManSaathi** is an elderly-centric, offline-first digital companion built to support memory recall, daily routine adherence, emotional comfort, and caregiver connection for elderly individuals in the North Eastern Region (NER) of India.

> **Important Safety Note**: ManSaathi is strictly a **support and engagement platform**, *not* a clinical diagnostic tool for dementia or Alzheimer's disease.

---

## 🚀 Key Features

1. **Elderly-First Accessibility**:
   - Touch targets $\ge 72\text{px}$ for all primary buttons.
   - Zero-stress / no countdown timers and no fail buzzers.
   - High-contrast, warm, calming color palette.
2. **Multilingual Voice-First Interaction**:
   - Full audio guidance in **Hindi**, **English**, and regional **Assamese / NER** dialects.
   - Voice assistant intent parser for medicine queries, family recall, and emergencies.
3. **Cognitive Games Suite**:
   - **Pehchano Kaun? (Family Memory)**: Uses family photos and voices to recognize loved ones.
   - **Purane Din (Story & Event Recall)**: Reminiscence of familiar landmarks (Guwahati, Kaziranga, etc.).
   - **Dawa Aur Routine (Sequencing)**: Chronological daily schedule arrangement.
   - **Ghar Ki Cheezein (Object Matching)**: Associative everyday item matching.
   - **NER Cultural Memory**: Traditional instruments (Pepa, Dhol) and attires (Mekhela Chador).
4. **Adaptive Cognitive Engine (FastAPI)**:
   - Engagement Score: $40\% \text{ Accuracy} + 25\% \text{ Completion} + 20\% \text{ Consistency} + 15\% \text{ Response Time}$.
   - Automatic, non-punitive difficulty adjustment (Levels 1 to 4).
5. **Offline-First Resilience & Sync Queue**:
   - Runs 100% offline in remote areas with local SQLite storage.
   - Background sync queue automatically drains to cloud (Supabase) when internet returns.
6. **Caregiver Web Dashboard & SOS Monitoring**:
   - Real-time patient overview, engagement trends, and routine adherence tracking.
   - Personal Memory Vault management (curate photos & stories).
   - One-touch emergency SOS with real-time GPS location pin sharing.

---

## 📁 Project Architecture

```
MANSAATHI/
├── backend/                  # Python FastAPI Adaptive AI Engine & APIs
│   ├── main.py               # FastAPI entrypoint
│   ├── api/                  # Games, Sync, Voice, SOS, and Patient endpoints
│   ├── services/             # Cognitive engine & recommendation algorithms
│   ├── models/               # Pydantic schemas
│   └── tests/                # Pytest unit & API test suites
│
├── dashboard/                # Caregiver Web Dashboard (React + Tailwind CSS + Vite)
│   ├── src/                  # Dashboard components, charts & live simulator
│   └── dist/                 # Production web build
│
├── database/                 # PostgreSQL / Supabase Schema
│   └── schema.sql            # RLS policies, tables, and demo seed data
│
├── lib/                      # Flutter Mobile Application
│   ├── main.dart             # App entrypoint & ElderlyTheme
│   ├── core/                 # Themes, localization (Hindi/English/Assamese)
│   ├── models/               # Patient, GameSession, SyncItem, Reminder models
│   ├── services/             # Local DB, SyncEngine, VoiceAssistant, SOS
│   ├── widgets/              # Large accessible buttons & audio prompt bars
│   ├── screens/              # Home, Routine, Voice, SOS, and Progress screens
│   └── games/                # Pehchano Kaun, Matching, and Sequencing games
└── pubspec.yaml              # Flutter dependencies configuration
```

---

## 🛠️ How to Run

### 1. Run the Python FastAPI Backend
```bash
cd backend
python -m pip install -r requirements.txt
python -m pytest tests/                # Run all test suites
python -m uvicorn main:app --reload --port 8000
```
Backend API will be live at: `http://localhost:8000` (API Docs: `http://localhost:8000/docs`)

### 2. Run the Caregiver Dashboard
```bash
cd dashboard
npm install
npm run dev
```
Dashboard will be live at: `http://localhost:3000` (includes live patient app simulator)

### 3. Database Deployment (Supabase)
Execute `database/schema.sql` in your Supabase SQL Editor to initialize all tables, RLS policies, and sample data.

---

## 🧪 Verification & Test Results
- **Pytest**: 11 passed in 0.70s (Engagement score calculation, difficulty step adjustments, and endpoint integration).
- **Vite Build**: Successfully compiled 1,479 modules into production bundle in `dashboard/dist/`.

