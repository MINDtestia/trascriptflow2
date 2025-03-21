export default {
    API_URL: process.env.VUE_APP_API_URL || 'http://localhost:5000/api',
    AUTH_API_URL: process.env.VUE_APP_AUTH_API_URL || 'http://localhost:5000/api/auth',
    TRANSCRIPTION_API_URL: process.env.VUE_APP_TRANSCRIPTION_API_URL || 'http://localhost:5000/api/transcribe',
    YOUTUBE_API_URL: process.env.VUE_APP_YOUTUBE_API_URL || 'http://localhost:5000/api/youtube',
    TEXT_TO_AUDIO_API_URL: process.env.VUE_APP_TEXT_TO_AUDIO_API_URL || 'http://localhost:5000/api/text-to-audio',
    TIMEOUT: 60000
  }