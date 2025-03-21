from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routes import video

app = FastAPI()

# Configuration CORS pour permettre les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # URL du frontend Vue.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montage du dossier de téléchargement
app.mount("/downloads", StaticFiles(directory="downloads"), name="downloads")

# Routes
app.include_router(video.router, prefix="/api/video", tags=["video"])

@app.get("/")
async def root():
    return {"message": "Bienvenue sur l'API Transcriptflow"}
