"""Routes API de l'application."""

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from ....backend.services.transcription_service import TranscriptionService
from ....backend.services.audio_extractor import AudioExtractor
from ..core.auth_manager import get_current_active_user
from ....backend.core.database import get_db
from ..models.user import User

# Création du router
router = APIRouter()

# Initialisation des services
transcription_service = TranscriptionService()
audio_extractor = AudioExtractor()

@router.post("/transcribe/")
async def transcribe_audio(
    file: UploadFile = File(...),
    language: str = Form("fr"),
    task: str = Form("transcribe"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Transcrit un fichier audio.

    Args:
        file: Fichier audio à transcrire
        language: Langue de l'audio
        task: Type de tâche (transcribe ou translate)
        current_user: Utilisateur actuel
        db: Session de base de données
    """
    try:
        # Sauvegarder le fichier temporairement
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Transcrire le fichier
        result = transcription_service.transcribe_file(
            file_path,
            language=language,
            task=task
        )

        return result

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/youtube/")
async def download_youtube(
    url: str = Form(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Télécharge et transcrit une vidéo YouTube.

    Args:
        url: URL de la vidéo YouTube
        current_user: Utilisateur actuel
        db: Session de base de données
    """
    try:
        # Valider l'URL
        if not audio_extractor.validate_youtube_url(url):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="URL YouTube invalide"
            )

        # Récupérer les informations de la vidéo
        video_info = audio_extractor.get_video_info(url)

        # Télécharger l'audio
        audio_path = audio_extractor.download_youtube_audio(url)

        # Transcrire l'audio
        result = transcription_service.transcribe_file(audio_path)

        # Ajouter les informations de la vidéo
        result["video_info"] = video_info

        return result

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/extract-audio/")
async def extract_audio(
    file: UploadFile = File(...),
    output_format: str = Form("wav"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Extrait l'audio d'un fichier vidéo.

    Args:
        file: Fichier vidéo
        output_format: Format de sortie audio
        current_user: Utilisateur actuel
        db: Session de base de données
    """
    try:
        # Sauvegarder le fichier temporairement
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Extraire l'audio
        audio_path = audio_extractor.extract_audio_from_video(
            file_path,
            output_format=output_format
        )

        return {"audio_path": audio_path}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/translate/")
async def translate_text(
    text: str = Form(...),
    target_language: str = Form(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Traduit un texte.

    Args:
        text: Texte à traduire
        target_language: Langue cible
        current_user: Utilisateur actuel
        db: Session de base de données
    """
    try:
        result = transcription_service.translate_transcription(
            text,
            target_language
        )
        return {"translated_text": result}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        ) 