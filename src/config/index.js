const config = {
    API: {
      BASE_URL: process.env.VUE_APP_API_URL,
      AUTH_URL: process.env.VUE_APP_AUTH_URL,
      MEDIA_URL: process.env.VUE_APP_MEDIA_URL,
      TIMEOUT: 60000,
      RETRY_ATTEMPTS: 3
    },
    WEBSOCKET: {
      URL: process.env.VUE_APP_WS_URL,
      RECONNECT_INTERVAL: 5000
    },
    UPLOAD: {
      MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
      ACCEPTED_AUDIO_FORMATS: ['mp3', 'wav', 'm4a', 'flac', 'ogg'],
      ACCEPTED_VIDEO_FORMATS: ['mp4', 'mov', 'avi', 'webm']
    },
    SUBSCRIPTION: {
      TIERS: ['free', 'basic', 'pro', 'enterprise'],
      FEATURE_LIMITS: {
        // Détails des limites par abonnement
      }
    },
    FEATURES: {
      TRANSCRIPTION: {
        SPEAKER_DETECTION: true,
        TIMESTAMPS: true,
        MULTILINGUAL: true
      },
      TEXT_TO_AUDIO: {
        VOICE_VARIETY: true,
        MULTI_FORMAT: true
      }
    }
  };
  
  export default config;