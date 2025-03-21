import { computed } from 'vue';
import { useStore } from 'vuex';

export function useSubscription() {
  const store = useStore();
  
  const currentPlan = computed(() => store.getters['auth/subscription']?.plan || null);
  const subscriptionTier = computed(() => store.getters['auth/subscriptionTier']);
  
  const limitationMap = {
    transcription: {
      free: { minutes: 10, files: 3 },
      basic: { minutes: 60, files: 20 },
      pro: { minutes: 300, files: 100 },
      enterprise: { minutes: -1, files: -1 } // -1 signifie illimité
    },
    textToAudio: {
      free: { characters: 1000, voices: 2 },
      basic: { characters: 10000, voices: 5 },
      pro: { characters: 50000, voices: 10 },
      enterprise: { characters: -1, voices: -1 }
    },
    // Autres limitations...
  };
  
  const getLimit = (feature, metric) => {
    const tier = subscriptionTier.value;
    return limitationMap[feature]?.[tier]?.[metric] || 0;
  };
  
  const hasFeatureAccess = (featureName) => {
    return store.dispatch('auth/checkFeatureAccess', featureName);
  };
  
  const remainingUsage = async (feature, metric) => {
    try {
      const response = await store.dispatch('usage/getRemainingUsage', { feature, metric });
      return response.remaining;
    } catch (error) {
      console.error('Failed to get remaining usage:', error);
      return 0;
    }
  };
  
  const isFeatureAvailable = async (feature, additionalUsage = 1) => {
    if (feature.startsWith('premium_')) {
      return await hasFeatureAccess(feature);
    }
    
    // Pour les fonctionnalités de base avec des limites d'utilisation
    const limit = getLimit(feature, 'units');
    if (limit === -1) return true; // Illimité
    
    const remaining = await remainingUsage(feature, 'units');
    return remaining >= additionalUsage;
  };
  
  return {
    currentPlan,
    subscriptionTier,
    getLimit,
    hasFeatureAccess,
    remainingUsage,
    isFeatureAvailable
  };
}

// Ensuite, créer la directive Vue pour limiter l'accès
// src/directives/requireFeature.js
export default {
  beforeMount(el, binding, vnode) {
    const { value } = binding;
    const store = vnode.ctx.$.appContext.config.globalProperties.$store;
    
    const checkAccess = async () => {
      let hasAccess;
      if (typeof value === 'string') {
        hasAccess = await store.dispatch('auth/checkFeatureAccess', value);
      } else if (typeof value === 'object') {
        hasAccess = await store.dispatch('auth/checkFeatureAccess', value.feature);
      }
      
      if (!hasAccess) {
        // Cacher l'élément ou afficher un badge premium
        el.classList.add('premium-feature');
        
        // Si une action alternative est fournie
        if (value.fallback) {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            value.fallback();
          });
        } else {
          // Action par défaut: rediriger vers la page d'abonnement
          el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Rediriger ou afficher modal
            store.dispatch('ui/showUpgradeModal', { feature: value.feature || value });
          });
        }
      }
    };
    
    checkAccess();
  }
};