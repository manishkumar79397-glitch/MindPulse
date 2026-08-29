from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.games import router as games_router
from api.recommendations import router as recommendations_router
from api.sync import router as sync_router
from api.voice import router as voice_router
from api.emergency import router as emergency_router
from api.patients import router as patients_router

app = FastAPI(
    title="ManSaathi AI Backend API",
    description="Adaptive Cognitive Gaming & Memory Assistance Platform for Elderly Dementia Patients (North Eastern Region)",
    version="1.0.0"
)

# CORS setup for mobile app and web dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all modular routers
app.include_router(games_router)
app.include_router(recommendations_router)
app.include_router(sync_router)
app.include_router(voice_router)
app.include_router(emergency_router)
app.include_router(patients_router)

@app.get("/")
async def health_check():
    return {
        "status": "healthy",
        "service": "ManSaathi AI Cognitive & Caregiver Engine",
        "target_region": "North Eastern Region (NER) of India",
        "supported_languages": ["hi", "en", "as", "mni", "kha"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

