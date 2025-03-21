// Un service simple pour suivre les événements utilisateur
export default {
    trackEvent(category, action, label = null, value = null) {
      // Si vous utilisez Google Analytics
      if (window.gtag) {
        window.gtag('event', action, {
          event_category: category,
          event_label: label,
          value
        });
      }
      
      // Envoyer aussi à votre propre backend pour analytics
      try {
        fetch('/api/analytics/event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            category,
            action,
            label,
            value,
            timestamp: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Failed to track event:', error);
      }
    },
    
    trackPageView(page) {
      if (window.gtag) {
        window.gtag('config', 'YOUR-GA-ID', {
          page_path: page
        });
      }
      
      this.trackEvent('navigation', 'page_view', page);
    }
  };
  
  // Mettre à jour src/router/index.js pour suivre les changements de page
  import analytics from '@/services/analytics';
  
  // Plus loin dans le code...
  router.afterEach((to) => {
    // Suivre les vues de page
    analytics.trackPageView(to.fullPath);
  });