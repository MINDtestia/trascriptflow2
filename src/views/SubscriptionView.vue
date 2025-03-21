<template>
    <div class="subscription-view">
      <h2>Abonnements</h2>
      <p class="subscription-intro">Choisissez le plan qui correspond à vos besoins.</p>
      
      <div class="plans-container">
        <PlanCard 
          v-for="plan in plans" 
          :key="plan.id" 
          :plan="plan" 
          :isActive="currentPlan && currentPlan.id === plan.id"
          :isRecommended="plan.recommended"
          @select="selectPlan"
        />
      </div>
      
      <div v-if="currentPlan" class="current-plan-info">
        <h3>Votre abonnement actuel</h3>
        <div class="plan-details">
          <p><strong>Plan:</strong> {{ currentPlan.name }}</p>
          <p><strong>Statut:</strong> {{ subscriptionStatus }}</p>
          <p><strong>Prochain renouvellement:</strong> {{ nextBillingDate }}</p>
        </div>
        <button v-if="canCancel" class="btn btn-secondary" @click="cancelSubscription">
          Annuler l'abonnement
        </button>
      </div>
      
      <!-- Ajoutez d'autres sections comme l'historique de facturation, etc. -->
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import PlanCard from '@/components/subscription/PlanCard.vue';
  
  export default {
    name: 'SubscriptionView',
    components: {
      PlanCard
    },
    setup() {
      const store = useStore();
      const plans = ref([]);
      const loading = ref(true);
      const error = ref(null);
      
      const currentPlan = computed(() => {
        return store.getters['auth/subscription']?.plan;
      });
      
      const subscriptionStatus = computed(() => {
        const status = store.getters['auth/subscription']?.status;
        const statusMap = {
          'active': 'Actif',
          'canceled': 'Annulé (expire bientôt)',
          'past_due': 'Paiement en retard',
          'trialing': 'Période d\'essai'
        };
        return statusMap[status] || status;
      });
      
      const nextBillingDate = computed(() => {
        const date = store.getters['auth/subscription']?.currentPeriodEnd;
        if (!date) return 'Non disponible';
        return new Date(date * 1000).toLocaleDateString();
      });
      
      const canCancel = computed(() => {
        const status = store.getters['auth/subscription']?.status;
        return status === 'active' || status === 'trialing';
      });
      
      const fetchPlans = async () => {
        try {
          loading.value = true;
          // Appel à un service qui récupérerait les plans disponibles
          const response = await fetch('/api/subscription/plans');
          plans.value = await response.json();
        } catch (err) {
          error.value = 'Impossible de charger les plans d\'abonnement';
          console.error(err);
        } finally {
          loading.value = false;
        }
      };
      
      const selectPlan = async (plan) => {
        // Rediriger vers le checkout ou ouvrir un modal de confirmation
        if (currentPlan.value && currentPlan.value.id === plan.id) {
          return; // Déjà abonné à ce plan
        }
        
        // Rediriger vers le système de paiement (Stripe par exemple)
        window.location.href = `/checkout?plan=${plan.id}`;
      };
      
      const cancelSubscription = async () => {
        if (confirm('Êtes-vous sûr de vouloir annuler votre abonnement?')) {
          try {
            await store.dispatch('auth/cancelSubscription');
            alert('Votre abonnement a été annulé avec succès');
          } catch (err) {
            alert('Erreur lors de l\'annulation: ' + err.message);
          }
        }
      };
      
      onMounted(fetchPlans);
      
      return {
        plans,
        loading,
        error,
        currentPlan,
        subscriptionStatus,
        nextBillingDate,
        canCancel,
        selectPlan,
        cancelSubscription
      };
    }
  };
  </script>
  
  <style scoped>
  .subscription-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .subscription-intro {
    margin-bottom: 2rem;
    color: var(--text-secondary);
  }
  
  .plans-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  .current-plan-info {
    background-color: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 8px;
    padding: 1.5rem;
    margin-top: 2rem;
  }
  
  /* Autres styles... */
  </style>