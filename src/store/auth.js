import { authService } from '@/services';

export default {
  namespaced: true,
  state: {
    user: null,
    isAuthenticated: false,
    token: localStorage.getItem('token') || null,
    refreshTokenPromise: null,
    subscription: null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = !!user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },
    SET_SUBSCRIPTION(state, subscription) {
      state.subscription = subscription;
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await authService.login(credentials);
        commit('SET_USER', response.data.user);
        commit('SET_TOKEN', response.data.token);
        commit('SET_SUBSCRIPTION', response.data.subscription);
        return response.data;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    // Autres actions liées à l'authentification...
    
    async checkFeatureAccess({ state }, featureName) {
      // Vérification des droits d'accès aux fonctionnalités premium
      if (!state.subscription) return false;
      
      return state.subscription.features.includes(featureName) ||
             state.subscription.tier === 'premium';
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    subscription: state => state.subscription,
    subscriptionTier: state => state.subscription?.tier || 'free',
    // Autres getters...
  }
};