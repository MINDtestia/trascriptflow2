// Refactoriser src/service/api.js en src/services/index.js
import axios from 'axios';
import config from './config';

// Client API principal avec intercepteurs
const createAPIClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    timeout: config.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Intercepteur pour ajouter le token d'authentification
  client.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Intercepteur de réponse unifié
  client.interceptors.response.use(
    response => response,
    error => {
      // Gérer les erreurs d'authentification
      if (error.response && error.response.status === 401) {
        // Événement global pour signaler une déconnexion
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        localStorage.removeItem('token');
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Création des clients API spécifiques
const api = createAPIClient(config.API_URL);
const authApi = createAPIClient(config.AUTH_API_URL);
const transcriptionApi = createAPIClient(config.TRANSCRIPTION_API_URL);
const youtubeApi = createAPIClient(config.YOUTUBE_API_URL);
const textToAudioApi = createAPIClient(config.TEXT_TO_AUDIO_API_URL);

// Exporter les services organisés par domaine fonctionnel
export const authService = {
  login: credentials => authApi.post('/login', credentials),
  register: userData => authApi.post('/register', userData),
  getProfile: () => authApi.get('/profile'),
  updateProfile: data => authApi.put('/profile', data),
  refreshToken: () => authApi.post('/refresh-token'),
  logout: () => authApi.post('/logout')
};

export const transcriptionService = {
  transcribeAudio: formData => {
    return transcriptionApi.post('/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getTranscription: id => transcriptionApi.get(`/${id}`),
  listTranscriptions: params => transcriptionApi.get('/', { params }),
  downloadTranscription: (id, format) => transcriptionApi.get(`/${id}/download`, { 
    params: { format },
    responseType: 'blob'
  })
};

// Définir les autres services de façon similaire...

// Service utilitaire pour les fonctionnalités communes
export const utilsService = {
  ping: () => api.get('/ping'),
  getStatistics: () => api.get('/statistics'),
  getServerStatus: () => api.get('/status')
};

export default api;