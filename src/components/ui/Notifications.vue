<template>
    <div class="notifications-container">
      <transition-group name="notification">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="notification"
          :class="`notification-${notification.type}`"
        >
          <div class="notification-icon">
            <i :class="getIconClass(notification.type)"></i>
          </div>
          <div class="notification-content">
            <div v-if="notification.title" class="notification-title">
              {{ notification.title }}
            </div>
            <div class="notification-message">
              {{ notification.message }}
            </div>
          </div>
          <button class="notification-close" @click="closeNotification(notification.id)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </transition-group>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  
  export default {
    name: 'Notifications',
    setup() {
      const store = useStore();
      
      const notifications = computed(() => store.state.notifications);
      
      const getIconClass = (type) => {
        switch (type) {
          case 'success': return 'fas fa-check-circle';
          case 'error': return 'fas fa-exclamation-circle';
          case 'warning': return 'fas fa-exclamation-triangle';
          case 'info': 
          default: return 'fas fa-info-circle';
        }
      };
      
      const closeNotification = (id) => {
        store.commit('REMOVE_NOTIFICATION', id);
      };
      
      return {
        notifications,
        getIconClass,
        closeNotification
      };
    }
  };
  </script>
  
  <style scoped>
  .notifications-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 9999;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .notification {
    display: flex;
    align-items: flex-start;
    background-color: var(--card-bg);
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    animation: slide-in 0.3s ease forwards;
  }
  
  /* Définir styles pour chaque type de notification */
  .notification-success {
    border-left: 4px solid #10b981;
  }
  
  .notification-error {
    border-left: 4px solid #ef4444;
  }
  
  /* Autres styles... */
  
  .notification-enter-active,
  .notification-leave-active {
    transition: all 0.3s ease;
  }
  
  .notification-enter-from,
  .notification-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  </style>