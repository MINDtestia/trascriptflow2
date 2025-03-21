<template>
  <div class="advanced-transcription">
    <div class="feature-header">
      <h2>Transcription Avancée</h2>
      <div class="feature-status">
        <span class="status-badge premium">Premium</span>
      </div>
    </div>

    <div class="feature-grid">
      <!-- Détection des locuteurs -->
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-users"></i>
        </div>
        <h3>Détection des locuteurs</h3>
        <p>Identification automatique des différents intervenants dans l'audio</p>
        <div class="feature-controls">
          <label class="switch">
            <input type="checkbox" v-model="features.speakerDetection">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Marqueurs temporels -->
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-clock"></i>
        </div>
        <h3>Marqueurs temporels</h3>
        <p>Segmentation précise avec horodatage pour chaque segment</p>
        <div class="feature-controls">
          <label class="switch">
            <input type="checkbox" v-model="features.timestamps">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Transcription en temps réel -->
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-broadcast-tower"></i>
        </div>
        <h3>Transcription en temps réel</h3>
        <p>Transcription instantanée pendant l'enregistrement</p>
        <div class="feature-controls">
          <label class="switch">
            <input type="checkbox" v-model="features.realtimeTranscription">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Support multilingue -->
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-language"></i>
        </div>
        <h3>Support multilingue</h3>
        <p>Détection automatique et support de plus de 30 langues</p>
        <div class="feature-controls">
          <label class="switch">
            <input type="checkbox" v-model="features.multilingual">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Correction automatique -->
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3>Correction automatique</h3>
        <p>Correction intelligente des erreurs de transcription</p>
        <div class="feature-controls">
          <label class="switch">
            <input type="checkbox" v-model="features.autoCorrection">
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Export multi-format -->
      <div class="feature-card">
        <div class="feature-icon">
          <i class="fas fa-file-export"></i>
        </div>
        <h3>Export multi-format</h3>
        <p>Export dans différents formats (SRT, VTT, Word, PDF)</p>
        <div class="feature-controls">
          <label class="switch">
            <input type="checkbox" v-model="features.multiFormatExport">
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>

    <div class="feature-actions">
      <button class="btn-primary" @click="saveSettings">
        <i class="fas fa-save"></i> Enregistrer les paramètres
      </button>
      <button class="btn-secondary" @click="testFeatures">
        <i class="fas fa-play"></i> Tester les fonctionnalités
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdvancedTranscription',
  data() {
    return {
      features: {
        speakerDetection: true,
        timestamps: true,
        realtimeTranscription: false,
        multilingual: true,
        autoCorrection: true,
        multiFormatExport: true
      }
    }
  },
  methods: {
    saveSettings() {
      // Implémentation de la sauvegarde des paramètres
      console.log('Saving settings:', this.features)
    },
    testFeatures() {
      // Implémentation du test des fonctionnalités
      console.log('Testing features:', this.features)
    }
  }
}
</script>

<style scoped>
.advanced-transcription {
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