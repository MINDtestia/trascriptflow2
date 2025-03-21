import axios from 'axios';

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

export default apiService; 