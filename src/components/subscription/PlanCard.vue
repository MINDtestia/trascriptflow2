<template>
    <div class="plan-card" :class="{ 'plan-active': isActive, 'plan-recommended': isRecommended }">
      <div class="plan-header">
        <h3>{{ plan.name }}</h3>
        <div v-if="isRecommended" class="recommended-badge">Recommandé</div>
      </div>
      <div class="plan-price">
        <span class="currency">€</span>
        <span class="amount">{{ plan.price }}</span>
        <span class="period">/mois</span>
      </div>
      <div class="plan-features">
        <div v-for="(feature, index) in plan.features" :key="index" class="feature-item">
          <i class="fas fa-check"></i>
          <span>{{ feature }}</span>
        </div>
      </div>
      <button 
        class="btn btn-primary plan-button" 
        :disabled="isActive" 
        @click="selectPlan"
      >
        {{ isActive ? 'Plan actuel' : 'Sélectionner' }}
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PlanCard',
    props: {
      plan: {
        type: Object,
        required: true
      },
      isActive: {
        type: Boolean,
        default: false
      },
      isRecommended: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      selectPlan() {
        this.$emit('select', this.plan);
      }
    }
  }
  </script>
  
  <style scoped>
  .plan-card {
    background-color: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 8px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .plan-active {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 1px var(--accent-primary);
  }
  
  .plan-recommended {
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    z-index: 1;
  }
  
  /* Autres styles... */
  </style>