<template>
  <div class="settings">
    <h2>Paramètres</h2>
    
    <div class="card settings-section">
      <h3>Préférences générales</h3>
      <div class="form-group">
        <label>Langue de l'interface</label>
        <select v-model="interfaceLanguage">
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>

      <div class="form-group">
        <label>Thème</label>
        <div class="theme-options">
          <button 
            class="theme-button" 
            :class="{ active: theme === 'light' }"
            @click="setTheme('light')"
          >
            <i class="fas fa-sun"></i>
            Clair
          </button>
          <button 
            class="theme-button" 
            :class="{ active: theme === 'dark' }"
            @click="setTheme('dark')"
          >
            <i class="fas fa-moon"></i>
            Sombre
          </button>
          <button 
            class="theme-button" 
            :class="{ active: theme === 'system' }"
            @click="setTheme('system')"
          >
            <i class="fas fa-desktop"></i>
            Système
          </button>
        </div>
      </div>
    </div>

    <div class="card settings-section">
      <h3>Paramètres de transcription</h3>
      <div class="form-group">
        <label>Format de sortie par défaut</label>
        <select v-model="defaultTranscriptionFormat">
          <option value="txt">Texte (.txt)</option>
          <option value="srt">Sous-titres (.srt)</option>
          <option value="vtt">Web VTT (.vtt)</option>
        </select>
      </div>

      <div class="form-group">
        <label>Langue de transcription par défaut</label>
        <select v-model="defaultTranscriptionLanguage">
          <option value="fr">Français</option>
          <option value="en">Anglais</option>
          <option value="es">Espagnol</option>
        </select>
      </div>
    </div>

    <div class="card settings-section">
      <h3>Paramètres de synthèse vocale</h3>
      <div class="form-group">
        <label>Voix par défaut</label>
        <select v-model="defaultVoice">
          <option value="fr-FR-1">Français - Femme</option>
          <option value="fr-FR-2">Français - Homme</option>
          <option value="en-US-1">Anglais - Femme</option>
          <option value="en-US-2">Anglais - Homme</option>
        </select>
      </div>

      <div class="form-group">
        <label>Vitesse de lecture par défaut</label>
        <div class="range-control">
          <input 
            type="range" 
            v-model="defaultSpeed" 
            min="0.5" 
            max="2" 
            step="0.1"
          >
          <span>{{ defaultSpeed }}x</span>
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="btn btn-primary" @click="saveSettings">
        <i class="fas fa-save"></i>
        Enregistrer les modifications
      </button>
      <button class="btn btn-secondary" @click="resetSettings">
        <i class="fas fa-undo"></i>
        Réinitialiser
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'SettingsView',
  setup() {
    const interfaceLanguage = ref('fr')
    const theme = ref('system')
    const defaultTranscriptionFormat = ref('txt')
    const defaultTranscriptionLanguage = ref('fr')
    const defaultVoice = ref('fr-FR-1')
    const defaultSpeed = ref(1)

    const setTheme = (newTheme) => {
      theme.value = newTheme
      // TODO: Implémenter la logique de changement de thème
    }

    const saveSettings = () => {
      // TODO: Implémenter la sauvegarde des paramètres
      console.log('Sauvegarde des paramètres:', {
        interfaceLanguage: interfaceLanguage.value,
        theme: theme.value,
        defaultTranscriptionFormat: defaultTranscriptionFormat.value,
        defaultTranscriptionLanguage: defaultTranscriptionLanguage.value,
        defaultVoice: defaultVoice.value,
        defaultSpeed: defaultSpeed.value
      })
    }

    const resetSettings = () => {
      // TODO: Implémenter la réinitialisation des paramètres
      interfaceLanguage.value = 'fr'
      theme.value = 'system'
      defaultTranscriptionFormat.value = 'txt'
      defaultTranscriptionLanguage.value = 'fr'
      defaultVoice.value = 'fr-FR-1'
      defaultSpeed.value = 1
    }

    return {
      interfaceLanguage,
      theme,
      defaultTranscriptionFormat,
      defaultTranscriptionLanguage,
      defaultVoice,
      defaultSpeed,
      setTheme,
      saveSettings,
      resetSettings
    }
  }
}
</script>

<style scoped>
.settings {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.settings-section {
  margin-bottom: 2rem;
}

.settings-section h3 {
  margin-bottom: 1.5rem;
  color: var(--accent-primary);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.theme-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.theme-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-button:hover {
  border-color: var(--accent-primary);
}

.theme-button.active {
  background: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
}

.range-control {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.range-control input[type="range"] {
  flex: 1;
}

.range-control span {
  min-width: 3ch;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-secondary {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--border-color);
}

@media (max-width: 768px) {
  .settings {
    padding: 1rem;
  }

  .actions {
    flex-direction: column;
  }

  .theme-options {
    grid-template-columns: 1fr;
  }
}
</style> 