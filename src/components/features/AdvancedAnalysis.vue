<template>
  <div class="advanced-analysis">
    <div class="feature-header">
      <h2>Analyse Avancée</h2>
      <div class="feature-status">
        <span class="status-badge premium">Premium</span>
      </div>
    </div>

    <div class="feature-grid">
      <!-- Analyse de sentiment -->
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-smile"></i>
        </div>
        <h3>Analyse de sentiment</h3>
        <p>Analyse des émotions et du ton dans le texte transcrit</p>
        <div class="feature-controls">
          <label class="switch">
            <input type="checkbox" v-model="features.sentimentAnalysis">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Extraction des mots-clés -->
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-tags"></i>
        </div>
        <h3>Mots-clés</h3>
        <p>Identification automatique des mots-clés et sujets principaux</p>
        <div class="feature-controls">
          <label class="switch">
            <input type="checkbox" v-model="features.keywords">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Résumé automatique -->
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-compress-alt"></i>
        </div>
        <h3>Résumé automatique</h3>
        <p>Génération de résumés concis des transcriptions</p>
        <div class="feature-controls">
          <label class="switch">
            <input type="checkbox" v-model="features.autoSummary">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Statistiques de parole -->
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <h3>Statistiques de parole</h3>
        <p>Analyse de la vitesse, pauses et rythme de parole</p>
        <div class="feature-controls">
          <label class="switch">
            <input type="checkbox" v-model="features.speechStats">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Visualisation des données -->
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-chart-bar"></i>
        </div>
        <h3>Visualisation</h3>
        <p>Graphiques et nuages de mots pour une meilleure compréhension</p>
        <div class="feature-controls">
          <label class="switch">
            <input type="checkbox" v-model="features.visualization">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Détection des entités -->
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-user-tag"></i>
        </div>
        <h3>Détection des entités</h3>
        <p>Identification des personnes, organisations, dates et lieux</p>
        <div class="feature-controls">
          <label class="switch">
            <input type="checkbox" v-model="features.entityDetection">
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>

    <div class="feature-actions">
      <button class="btn-primary" @click="saveSettings">
        <i class="fas fa-save"></i> Enregistrer les paramètres
      </button>
      <button class="btn-secondary" @click="generateReport">
        <i class="fas fa-file-alt"></i> Générer un rapport
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdvancedAnalysis',
  data() {
    return {
      features: {
        sentimentAnalysis: true,
        keywords: true,
        autoSummary: true,
        speechStats: true,
        visualization: true,
        entityDetection: true
      }
    }
  },
  methods: {
    saveSettings() {
      // Implémentation de la sauvegarde des paramètres
      console.log('Saving analysis settings:', this.features)
    },
    generateReport() {
      // Implémentation de la génération de rapport
      console.log('Generating analysis report')
    }
  }
}
</script>

<style scoped>
.advanced-analysis {
  padding: 2rem;
}

.feature-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.feature-header h2 {
  color: var(--text-color);
  font-size: 1.8rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-badge.premium {
  background-color: var(--primary-color);
  color: white;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.feature-card {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: var(--text-color);
  opacity: 0.8;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.feature-controls {
  display: flex;
  justify-content: flex-end;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary-color);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.feature-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-primary, .btn-secondary {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-secondary {
  background-color: var(--card-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-primary:hover {
  background-color: var(--secondary-color);
}

.btn-secondary:hover {
  background-color: var(--hover-color);
}

@media (max-width: 768px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }

  .feature-actions {
    flex-direction: column;
  }

  .btn-primary, .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style> 