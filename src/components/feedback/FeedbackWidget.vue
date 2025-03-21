<template>
    <div class="feedback-widget">
      <button 
        class="feedback-trigger" 
        :class="{ 'feedback-open': isOpen }"
        @click="toggleFeedback"
      >
        <i class="fas fa-comment-alt"></i>
        <span>Feedback</span>
      </button>
      
      <div v-if="isOpen" class="feedback-panel">
        <div class="feedback-header">
          <h3>{{ $t('feedback.title') }}</h3>
          <button class="close-button" @click="toggleFeedback">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="feedback-content">
          <template v-if="!feedbackSent">
            <div class="feedback-type-selector">
              <button 
                v-for="type in feedbackTypes" 
                :key="type.id"
                :class="['type-button', { active: selectedType === type.id }]"
                @click="selectedType = type.id"
              >
                <i :class="type.icon"></i>
                <span>{{ $t(type.label) }}</span>
              </button>
            </div>
            
            <textarea 
              v-model="feedbackText" 
              class="feedback-textarea"
              :placeholder="$t('feedback.placeholder')"
              rows="4"
            ></textarea>
            
            <div class="feedback-actions">
              <button 
                class="btn btn-primary send-button" 
                :disabled="!canSubmit"
                @click="submitFeedback"
              >
                {{ $t('feedback.send') }}
              </button>
            </div>
          </template>
          
          <div v-else class="feedback-success">
            <i class="fas fa-check-circle success-icon"></i>
            <p>{{ $t('feedback.thankYou') }}</p>
            <button class="btn btn-secondary" @click="resetForm">
              {{ $t('feedback.sendAnother') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import analytics from '@/services/analytics';
  
  export default {
    name: 'FeedbackWidget',
    setup() {
      const isOpen = ref(false);
      const selectedType = ref('general');
      const feedbackText = ref('');
      const feedbackSent = ref(false);
      
      const feedbackTypes = [
        { id: 'general', label: 'feedback.types.general', icon: 'fas fa-comment' },
        { id: 'bug', label: 'feedback.types.bug', icon: 'fas fa-bug' },
        { id: 'feature', label: 'feedback.types.feature', icon: 'fas fa-lightbulb' },
        { id: 'praise', label: 'feedback.types.praise', icon: 'fas fa-heart' }
      ];
      
      const canSubmit = computed(() => {
        return feedbackText.value.trim().length >= 10;
      });
      
      const toggleFeedback = () => {
        isOpen.value = !isOpen.value;
      };
      
      const submitFeedback = async () => {
        try {
          await fetch('/api/feedback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              type: selectedType.value,
              text: feedbackText.value,
              url: window.location.href,
              timestamp: new Date().toISOString()
            })
          });
          
          // Tracker l'événement
          analytics.trackEvent('feedback', 'submit', selectedType.value);
          
          feedbackSent.value = true;
        } catch (error) {
          console.error('Failed to send feedback:', error);
          // Afficher une notification d'erreur
        }
      };
      
      const resetForm = () => {
        feedbackText.value = '';
        selectedType.value = 'general';
        feedbackSent.value = false;
      };
      
      return {
        isOpen,
        selectedType,
        feedbackText,
        feedbackSent,
        feedbackTypes,
        canSubmit,
        toggleFeedback,
        submitFeedback,
        resetForm
      };
    }
  };
  </script>
  
  <style scoped>
  .feedback-widget {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 9990;
  }
  
  /* Autres styles... */
  </style>