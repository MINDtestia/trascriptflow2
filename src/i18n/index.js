import { createI18n } from 'vue-i18n';

const messages = {
  fr: {
    nav: {
      home: 'Accueil',
      dashboard: 'Tableau de bord',
      transcribe: 'Transcrire',
      textToAudio: 'Texte vers Audio',
      youtube: 'YouTube',
      video: 'Vidéo',
      settings: 'Paramètres',
      apiKeys: 'Clés API',
      profile: 'Profil'
    }
  },
  en: {
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      transcribe: 'Transcribe',
      textToAudio: 'Text to Audio',
      youtube: 'YouTube',
      video: 'Video',
      settings: 'Settings',
      apiKeys: 'API Keys',
      profile: 'Profile'
    }
  }
};

export default createI18n({
  legacy: true, // Passer en mode legacy
  locale: 'fr',
  fallbackLocale: 'en',
  messages
}); 