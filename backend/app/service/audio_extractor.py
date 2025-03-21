# core/audio_extractor.py
import os
import tempfile
import subprocess
import yt_dlp
import certifi
import logging
from ..utils.error_handling import handle_error, ErrorType, AppError
from typing import Optional

os.environ['SSL_CERT_FILE'] = certifi.where()

def download_youtube_audio(url: str, output_dir: Optional[str] = None) -> str:
    """Télécharge l'audio d'une vidéo YouTube."""
    extractor = AudioExtractor()
    return extractor.download_youtube_audio(url, output_dir)

class AudioExtractor:
    """Classe pour l'extraction audio."""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'outtmpl': '%(title)s.%(ext)s',
        }
    
    @handle_error
    def download_youtube_audio(self, url: str, output_dir: Optional[str] = None) -> str:
        """Télécharge l'audio d'une vidéo YouTube."""
        try:
            if output_dir:
                os.makedirs(output_dir, exist_ok=True)
                self.ydl_opts['outtmpl'] = os.path.join(output_dir, '%(title)s.%(ext)s')
            
            with yt_dlp.YoutubeDL(self.ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                return os.path.join(
                    output_dir or os.getcwd(),
                    f"{info['title']}.mp3"
                )
        
        except Exception as e:
            raise AppError(
                message=f"Erreur lors du téléchargement de l'audio: {str(e)}",
                error_type=ErrorType.NETWORK,
                error_code="DOWNLOAD_ERROR",
                details={"url": url}
            )
    
    @handle_error
    def extract_audio_from_video(self, video_path: str, output_dir: Optional[str] = None) -> str:
        """Extrait l'audio d'un fichier vidéo."""
        try:
            if not os.path.exists(video_path):
                raise AppError(
                    message="Le fichier vidéo n'existe pas",
                    error_type=ErrorType.VALIDATION,
                    error_code="FILE_NOT_FOUND",
                    details={"video_path": video_path}
                )
            
            if output_dir:
                os.makedirs(output_dir, exist_ok=True)
            
            output_path = os.path.join(
                output_dir or os.path.dirname(video_path),
                f"{os.path.splitext(os.path.basename(video_path))[0]}.mp3"
            )
            
            # Utiliser FFmpeg pour l'extraction
            os.system(f'ffmpeg -i "{video_path}" -vn -acodec libmp3lame "{output_path}"')
            
            if not os.path.exists(output_path):
                raise AppError(
                    message="L'extraction audio a échoué",
                    error_type=ErrorType.PROCESSING,
                    error_code="EXTRACTION_ERROR",
                    details={"video_path": video_path}
                )
            
            return output_path
        
        except Exception as e:
            raise AppError(
                message=f"Erreur lors de l'extraction audio: {str(e)}",
                error_type=ErrorType.PROCESSING,
                error_code="EXTRACTION_ERROR",
                details={"video_path": video_path}
            )

def extract_audio_from_mp4(file_path: str) -> str:
    """
    Extrait la piste audio d'un fichier .mp4 local en .wav via FFmpeg.
    Retourne le chemin du fichier audio résultant.
    """
    if not file_path:
        return handle_error(ValueError("Aucun fichier fourni"), ErrorType.INPUT_ERROR,
                           "Aucun fichier vidéo n'a été fourni.")

    try:
        base_name = os.path.splitext(os.path.basename(file_path))[0]
        temp_dir = tempfile.gettempdir()
        audio_path = os.path.join(temp_dir, f"{base_name}.wav")

        cmd = [
            'ffmpeg', '-y',
            '-i', file_path,
            '-vn',
            '-acodec', 'pcm_s16le',
            '-ar', '44100',
            '-ac', '2',
            '-compression_level', '8',
            audio_path
        ]
        subprocess.run(cmd, check=True)

        return audio_path

    except Exception as e:
        return handle_error(e, ErrorType.PROCESSING_ERROR,
                           "Échec de l'extraction audio. Vérifiez que le format vidéo est supporté et que ffmpeg est correctement installé.")