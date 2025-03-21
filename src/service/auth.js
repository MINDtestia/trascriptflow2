import axios from 'axios';
import config from '@/config';
import store from '@/store';
import router from '@/router';

class AuthService {
  constructor() {
    this.tokenRefreshTimeout = null;
    this.initializing = this._initialize();
  }

  async _initialize() {
    // Vérifiez si un token existe et s'il est toujours valide
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = this._parseJwt(token);
        const now = Date.now() / 1000;
        
        if (decoded.exp > now) {
          // Token valide, configurer le renouvellement
          this._setupTokenRefresh(decoded.exp);
          
          // Récupérer les infos utilisateur
          await this.fetchUserProfile();
          return true;
        } else {
          // Token expiré, essayer de le rafraîchir
          await this.refreshToken();
          return true;
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        this.logout();
        return false;
      }
    }
    return false;
  }

  async login(credentials) {
    try {
      const response = await axios.post(`${config.API.AUTH_URL}/login`, credentials);
      this._handleAuthResponse(response);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async register(userData) {
    try {
      const response = await axios.post(`${config.API.AUTH_URL}/register`, userData);
      this._handleAuthResponse(response);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      const response = await axios.post(`${config.API.AUTH_URL}/refresh-token`, {
        refreshToken
      });
      
      this._handleAuthResponse(response);
      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout();
      throw error;
    }
  }

  async fetchUserProfile() {
    try {
      const response = await axios.get(`${config.API.AUTH_URL}/profile`);
      store.commit('auth/SET_USER', response.data);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await axios.put(`${config.API.AUTH_URL}/profile`, profileData);
      store.commit('auth/SET_USER', response.data);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async changePassword(passwordData) {
    try {
      await axios.post(`${config.API.AUTH_URL}/change-password`, passwordData);
      return true;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  logout() {
    // Annuler le renouvellement programmé
    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
      this.tokenRefreshTimeout = null;
    }
    
    // Supprimer les tokens
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    // Mettre à jour le store
    store.commit('auth/SET_USER', null);
    store.commit('auth/SET_TOKEN', null);
    
    // Rediriger vers la page de connexion
    router.push('/login');
  }

  _handleAuthResponse(response) {
    const { token, refreshToken, user } = response.data;
    
    // Stocker les tokens
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    // Mettre à jour le store
    store.commit('auth/SET_USER', user);
    store.commit('auth/SET_TOKEN', token);
    
    // Configurer le renouvellement du token
    const decoded = this._parseJwt(token);
    this._setupTokenRefresh(decoded.exp);
  }

  _setupTokenRefresh(expirationTime) {
    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
    }
    
    // Calculer le délai jusqu'à l'expiration (refresh 1 minute avant)
    const now = Date.now() / 1000;
    const timeUntilRefresh = (expirationTime - now - 60) * 1000;
    
    if (timeUntilRefresh > 0) {
      this.tokenRefreshTimeout = setTimeout(() => {
        this.refreshToken().catch(error => {
          console.error('Token refresh failed:', error);
          this.logout();
        });
      }, timeUntilRefresh);
    } else {
      // Token déjà expiré ou sur le point d'expirer, rafraîchir immédiatement
      this.refreshToken().catch(error => {
        console.error('Token refresh failed:', error);
        this.logout();
      });
    }
  }

  _parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      throw new Error('Invalid token format');
    }
  }

  _handleError(error) {
    // Transformer les erreurs API en messages utilisateur compréhensibles
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Requête invalide');
        case 401:
          this.logout();
          return new Error('Session expirée. Veuillez vous reconnecter.');
        case 403:
          return new Error('Accès refusé');
        case 404:
          return new Error('Ressource non trouvée');
        case 422:
          // Erreurs de validation
          if (data.errors) {
            const errorMessages = Object.values(data.errors).flat().join(', ');
            return new Error(errorMessages || 'Données invalides');
          }
          return new Error(data.message || 'Validation échouée');
        default:
          return new Error('Une erreur est survenue. Veuillez réessayer.');
      }
    }
    
    return error;
  }
}

export default new AuthService();