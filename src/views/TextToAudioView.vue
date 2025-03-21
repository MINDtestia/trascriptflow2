<template>
  <div class="text-to-audio">
    <h2>Conversion Texte vers Audio</h2>
    <div class="card editor-section">
      <div class="form-group">
        <label>Votre texte</label>
        <textarea
          v-model="text"
          placeholder="Entrez votre texte ici..."
          rows="8"
        ></textarea>
        <div class="text-counter">{{ text.length }} caractères</div>
      </div>
      
      <div class="options">
        <div class="form-group">
          <label>Voix</label>
          <select v-model="voice">
            <option value="fr-FR-1">Français - Femme</option>
            <option value="fr-FR-2">Français - Homme</option>
            <option value="en-US-1">Anglais - Femme</option>
            <option value="en-US-2">Anglais - Homme</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Vitesse</label>
          <div class="range-control">
            <input 
              type="range" 
              v-model="speed" 
              min="0.5" 
              max="2" 
              step="0.1"
            >
            <span>{{ speed }}x</span>
          </div>
        </div>

        <div class="form-group">
          <label>Format de sortie</label>
          <select v-model="outputFormat">
            <option value="mp3">MP3</option>
            <option value="wav">WAV</option>
          </select>
        </div>
      </div>

      <button 
        class="btn btn-primary" 
        @click="generateAudio"
        :disabled="!text || isGenerating"
      >
        <i class="fas fa-volume-up"></i>
        {{ isGenerating ? 'Génération en cours...' : 'Générer l\'audio' }}
      </button>
    </div>

    <div v-if="audioUrl" class="card preview-section">
      <h3>Aperçu</h3>
      <audio controls :src="audioUrl" class="audio-preview"></audio>
      <button class="btn btn-primary" @click="downloadAudio">
        <i class="fas fa-download"></i>
        Télécharger
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'TextToAudioView',
  setup() {
    const text = ref('')
    const voice = ref('fr-FR-1')
    const speed = ref(1)
    const outputFormat = ref('mp3')
    const isGenerating = ref(false)
    const audioUrl = ref(null)

    const generateAudio = async () => {
      isGenerating.value = true
      // TODO: Implémenter la logique de génération audio
      console.log('Génération audio:', {
        text: text.value,
        voice: voice.value,
        speed: speed.value,
        outputFormat: outputFormat.value
      })
      setTimeout(() => {
        isGenerating.value = false
        audioUrl.value = 'data:audio/mp3;base64,...' // URL simulée
      }, 2000)
    }

    const downloadAudio = () => {
      // TODO: Implémenter la logique de téléchargement
      console.log('Téléchargement audio')
    }

    return {
      text,
      voice,
      speed,
      outputFormat,
      isGenerating,
      audioUrl,
      generateAudio,
      downloadAudio
    }
  }
}
</script>

<style scoped>
.text-to-audio {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.editor-section {
  margin-top: 2rem;
}

textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
}

textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.text-counter {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: right;
}

.options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
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

.preview-section {
  margin-top: 2rem;
  text-align: center;
}

.audio-preview {
  width: 100%;
  margin: 1rem 0;
}

@media (max-width: 768px) {
  .text-to-audio {
    padding: 1rem;
  }

  .options {
    grid-template-columns: 1fr;
  }
}
</style> 