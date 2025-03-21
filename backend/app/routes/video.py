from fastapi import APIRouter, HTTPException, BackgroundTasks, UploadFile, File, Form
from pydantic import BaseModel
import yt_dlp
import os
from typing import Optional
import uuid
import shutil
import ffmpeg
from ..service.audio_extractor import AudioExtractor, extract_audio_from_mp4

router = APIRouter()

class VideoInfo(BaseModel):
    id: str
    title: str
    duration: str
    author: str
    status: str
    download_url: Optional[str] = None
    error: Optional[str] = None

# Stockage temporaire des tâches d'extraction
video_tasks = {}

def format_duration(seconds):
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    seconds = seconds % 60
    if hours > 0:
        return f"{int(hours)}:{int(minutes):02d}:{int(seconds):02d}"
    return f"{int(minutes):02d}:{int(seconds):02d}"

def get_video_duration(file_path):
    try:
        probe = ffmpeg.probe(file_path)
        duration = float(probe['streams'][0]['duration'])
        return format_duration(int(duration))
    except:
        return "00:00"

def process_uploaded_video(task_id: str, file_path: str, output_format: str, quality: str, start_time: Optional[str], end_time: Optional[str]):
    try:
        output_dir = "downloads"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # Utiliser la fonction d'extraction audio existante
        audio_path = extract_audio_from_mp4(file_path)
        
        if not audio_path:
            raise Exception("Échec de l'extraction audio")

        # Convertir en format demandé si nécessaire
        if output_format != 'wav':
            output_path = f"{output_dir}/{os.path.splitext(os.path.basename(file_path))[0]}-{task_id}.{output_format}"
            stream = ffmpeg.input(audio_path)
            
            # Appliquer le découpage si spécifié
            if start_time and end_time:
                stream = stream.trim(start=start_time, end=end_time).setpts('PTS-STARTPTS')

            # Configuration de la qualité audio
            audio_bitrate = '192k' if quality == 'high' else '128k' if quality == 'medium' else '96k'
            
            stream = ffmpeg.output(stream, output_path, 
                                 acodec='libmp3lame' if output_format == 'mp3' else 'libvorbis',
                                 audio_bitrate=audio_bitrate)
            ffmpeg.run(stream, overwrite_output=True)
            
            # Supprimer le fichier WAV temporaire
            os.remove(audio_path)
        else:
            # Déplacer le fichier WAV vers le dossier downloads
            output_path = f"{output_dir}/{os.path.splitext(os.path.basename(file_path))[0]}-{task_id}.wav"
            shutil.move(audio_path, output_path)

        # Mise à jour des informations de la tâche
        video_tasks[task_id].update({
            "title": os.path.splitext(os.path.basename(file_path))[0],
            "duration": get_video_duration(file_path),
            "author": "Fichier local",
            "status": "completed",
            "download_url": f"/downloads/{os.path.splitext(os.path.basename(file_path))[0]}-{task_id}.{output_format}"
        })

        # Nettoyage du fichier source
        os.remove(file_path)

    except Exception as e:
        video_tasks[task_id]["status"] = "failed"
        video_tasks[task_id]["error"] = str(e)
        if os.path.exists(file_path):
            os.remove(file_path)

def download_video(task_id: str, url: str, quality: str, format: str, start_time: Optional[str], end_time: Optional[str]):
    try:
        output_dir = "downloads"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # Utiliser la classe AudioExtractor existante
        extractor = AudioExtractor()
        audio_path = extractor.download_youtube_audio(url, output_dir)

        if not audio_path:
            raise Exception("Échec du téléchargement de l'audio")

        # Convertir en format demandé si nécessaire
        if format != 'mp3':
            output_path = f"{output_dir}/{os.path.splitext(os.path.basename(audio_path))[0]}-{task_id}.{format}"
            stream = ffmpeg.input(audio_path)
            
            # Appliquer le découpage si spécifié
            if start_time and end_time:
                stream = stream.trim(start=start_time, end=end_time).setpts('PTS-STARTPTS')

            # Configuration de la qualité audio
            audio_bitrate = '192k' if quality == 'high' else '128k' if quality == 'medium' else '96k'
            
            stream = ffmpeg.output(stream, output_path, 
                                 acodec='libvorbis' if format == 'ogg' else 'pcm_s16le',
                                 audio_bitrate=audio_bitrate)
            ffmpeg.run(stream, overwrite_output=True)
            
            # Supprimer le fichier MP3 temporaire
            os.remove(audio_path)
        else:
            # Renommer le fichier avec l'ID de la tâche
            output_path = f"{output_dir}/{os.path.splitext(os.path.basename(audio_path))[0]}-{task_id}.mp3"
            os.rename(audio_path, output_path)

        # Mise à jour des informations de la tâche
        video_tasks[task_id].update({
            "title": os.path.splitext(os.path.basename(output_path))[0],
            "duration": get_video_duration(output_path),
            "author": "YouTube",
            "status": "completed",
            "download_url": f"/downloads/{os.path.splitext(os.path.basename(output_path))[0]}.{format}"
        })

    except Exception as e:
        video_tasks[task_id]["status"] = "failed"
        video_tasks[task_id]["error"] = str(e)

@router.post("/extract", response_model=VideoInfo)
async def extract_video(
    background_tasks: BackgroundTasks,
    file: Optional[UploadFile] = File(None),
    url: Optional[str] = Form(None),
    quality: str = Form("high"),
    format: str = Form("mp3"),
    start_time: Optional[str] = Form(None),
    end_time: Optional[str] = Form(None)
):
    if not file and not url:
        raise HTTPException(status_code=400, detail="Vous devez fournir un fichier ou une URL")

    task_id = str(uuid.uuid4())
    
    video_tasks[task_id] = {
        "id": task_id,
        "title": "",
        "duration": "",
        "author": "",
        "status": "processing"
    }

    if file:
        # Créer le dossier temporaire s'il n'existe pas
        temp_dir = "temp"
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)

        # Sauvegarder le fichier temporairement
        file_path = f"{temp_dir}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        background_tasks.add_task(
            process_uploaded_video,
            task_id,
            file_path,
            format,
            quality,
            start_time,
            end_time
        )
    else:
        background_tasks.add_task(
            download_video,
            task_id,
            url,
            quality,
            format,
            start_time,
            end_time
        )

    return VideoInfo(**video_tasks[task_id])

@router.get("/status/{task_id}", response_model=VideoInfo)
async def get_video_status(task_id: str):
    if task_id not in video_tasks:
        raise HTTPException(status_code=404, detail="Tâche non trouvée")
    return VideoInfo(**video_tasks[task_id]) 