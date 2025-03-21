<template>
  <div class="transcribe">
    <h2>Transcription Audio</h2>
    <div class="card upload-section">
      <div class="upload-zone" @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileInput">
        <input type="file" ref="fileInput" @change="handleFileSelect" accept="audio/*" class="hidden">
        <i class="fas fa-cloud-upload-alt upload-icon"></i>
        <p>Glissez et déposez votre fichier audio ici<br>ou cliquez pour sélectionner</p>
        <p class="supported-formats">Formats supportés: MP3, WAV, M4A</p>
      </div>
      <div v-if="selectedFile" class="selected-file">
        <i class="fas fa-file-audio"></i>
        <span>{{ selectedFile.name }}</span>
        <button class="btn-icon" @click="removeFile">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <div v-if="selectedFile" class="card options-section">
      <h3>Options de transcription</h3>
      <div class="form-group">
        <label>Langue source</label>
        <select v-model="language">
          <option value="fr">Français</option>
          <option value="en">Anglais</option>
          <option value="es">Espagnol</option>
        </select>
      </div>
      <div class="form-group">
        <label>Format de sortie</label>
        <select v-model="outputFormat">
          <option value="txt">Texte (.txt)</option>
          <option value="srt">Sous-titres (.srt)</option>
          <option value="vtt">Web VTT (.vtt)</option>
        </select>
      </div>
      <button class="btn btn-primary" @click="startTranscription" :disabled="isTranscribing">
        <i class="fas fa-play"></i>
        {{ isTranscribing ? 'Transcription en cours...' : 'Démarrer la transcription' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'TranscribeView',
  setup() {
    const fileInput = ref(null)
    const selectedFile = ref(null)
    const language = ref('fr')
    const outputFormat = ref('txt')
    const isTranscribing = ref(false)

    const triggerFileInput = () => {
      fileInput.value.click()
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        selectedFile.value = file
      }
    }

    const handleDrop = (event) => {
      const file = event.dataTransfer.files[0]
      if (file && file.type.startsWith('audio/')) {
        selectedFile.value = file
      }
    }

    const removeFile = () => {
      selectedFile.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    const startTranscription = async () => {
      isTranscribing.value = true
      // TODO: Implémenter la logique de transcription
      console.log('Démarrage de la transcription:', {
        file: selectedFile.value,
        language: language.value,
        outputFormat: outputFormat.value
      })
      setTimeout(() => {
        isTranscribing.value = false
      }, 2000)
    }

    return {
      fileInput,
      selectedFile,
      language,
      outputFormat,
      isTranscribing,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      removeFile,
      startTranscription
    }
  }
}
</script>

<style scoped>
.transcribe {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.upload-section {
  margin-top: 2rem;
}

.upload-zone {
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-zone:hover {
  border-color: var(--accent-primary);
}

.upload-icon {
  font-size: 3rem;
  color: var(--accent-primary);
  margin-bottom: 1rem;
}

.supported-formats {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 1rem;
}

.hidden {
  display: none;
}

.selected-file {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-radius: 4px;
}

.selected-file i {
  color: var(--accent-primary);
}

.btn-icon {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  color: var(--accent-primary);
  background-color: var(--bg-primary);
}

.options-section {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.form-group select:focus {
  outline: none;
  border-color: var(--accent-primary);
}

@media (max-width: 768px) {
  .transcribe {
    padding: 1rem;
  }

  .upload-zone {
    padding: 2rem 1rem;
  }
}
</style> 