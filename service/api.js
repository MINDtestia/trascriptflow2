// services/api.js
import axios from 'axios';

// Configuration de base d'axios
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Gérer les erreurs 401 (non authentifié)
    if (error.response && error.response.status === 401) {
      // Rediriger vers login ou rafraîchir le token
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services API
export const authService = {
  login: credentials => apiClient.post('/auth/login', credentials),
  register: userData => apiClient.post('/auth/register', userData),
  getProfile: () => apiClient.get('/profile'),
  updateProfile: data => apiClient.put('/profile', data)
};

export const transcriptionService = {
  transcribeAudio: formData => {
    return apiClient.post('/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  downloadTranscription: (id, format) => apiClient.get(`/transcribe/${id}/download?format=${format}`)
};

export const youtubeService = {
  getVideoInfo: url => apiClient.post('/youtube/info', { url }),
  downloadAudio: options => apiClient.post('/youtube/download', options)
};

export const textToAudioService = {
  convert: data => apiClient.post('/text-to-audio', data),
  download: id => apiClient.get(`/text-to-audio/${id}/download`)
};

export const settingsService = {
  getSettings: () => apiClient.get('/settings'),
  updateSettings: settings => apiClient.put('/settings', settings),
  updateApiKeys: keys => apiClient.post('/settings/api-keys', keys)
};

const API_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const apiService = {
    // Méthodes pour interagir avec l'API
    async getWelcomeMessage() {
        try {
            const response = await api.get('/');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération du message de bienvenue:', error);
            throw error;
        }
    },

    // Ajoutez d'autres méthodes ici selon vos besoins
};

export default apiClient;