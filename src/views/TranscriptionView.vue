<template>
  <div class="transcription-view">
    <div class="page-header">
      <h1>Transcription Audio</h1>
      <p>Convertissez vos fichiers audio en texte</p>
    </div>

    <div class="content-grid">
      <!-- Zone de dépôt de fichier -->
      <div class="upload-section">
        <div class="upload-card" 
          @dragover.prevent 
          @drop.prevent="handleDrop"
          :class="{ 'dragging': isDragging }"
          @dragenter.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
        >
          <div class="upload-content">
            <i class="fas fa-cloud-upload-alt upload-icon"></i>
            <h3>Déposez vos fichiers audio ici</h3>
            <p>ou</p>
            <label class="upload-btn">
              Parcourir
              <input 
                type="file" 
                accept="audio/*" 
                @change="handleFileSelect" 
                multiple
                class="hidden"
              >
            </label>
            <p class="upload-info">Formats supportés: MP3, WAV, M4A, FLAC</p>
          </div>
        </div>
      </div>

      <!-- Options de transcription -->
      <div class="options-section">
        <div class="options-card">
          <h3>Options de transcription</h3>
          
          <div class="option-group">
            <label>Langue source</label>
            <select v-model="options.sourceLanguage" class="select-input">
              <option value="auto">Détection automatique</option>
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
              <option value="es">Espagnol</option>
              <option value="de">Allemand</option>
            </select>
          </div>

          <div class="option-group">
            <label>Modèle</label>
            <select v-model="options.model" class="select-input">
              <option value="standard">Standard</option>
              <option value="enhanced">Amélioré</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <div class="option-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="options.speakerDiarization">
              Identification des locuteurs
            </label>
          </div>

          <div class="option-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="options.timestamps">
              Ajouter les marqueurs temporels
            </label>
          </div>

          <div class="option-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="options.punctuation">
              Ponctuation automatique
            </label>
          </div>

          <div class="option-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="options.keywords">
              Extraction des mots-clés
            </label>
          </div>
        </div>
      </div>

      <!-- Liste des fichiers -->
      <div class="files-section">
        <div class="files-card">
          <h3>Fichiers à transcrire</h3>
          <div class="files-list">
            <div v-for="file in files" :key="file.id" class="file-item">
              <div class="file-info">
                <i class="fas fa-file-audio file-icon"></i>
                <div class="file-details">
                  <h4>{{ file.name }}</h4>
                  <p>{{ formatFileSize(file.size) }} • {{ file.duration }}</p>
                </div>
              </div>
              <div class="file-status" :class="file.status">
                <span class="status-text">{{ getStatusText(file.status) }}</span>
                <div v-if="file.status === 'processing'" class="progress-bar">
                  <div :style="{ width: file.progress + '%' }" class="progress"></div>
                </div>
                <button v-if="file.status === 'completed'" class="action-btn" @click="downloadTranscription(file)">
                  <i class="fas fa-download"></i>
                </button>
                <button v-if="file.status === 'error'" class="action-btn error" @click="retryTranscription(file)">
                  <i class="fas fa-redo"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Résultat de la transcription -->
      <div v-if="currentTranscription" class="transcription-section">
        <div class="transcription-card">
          <div class="transcription-header">
            <h3>Résultat de la transcription</h3>
            <div class="transcription-actions">
              <button class="action-btn" @click="copyTranscription">
                <i class="fas fa-copy"></i>
                Copier
              </button>
              <button class="action-btn" @click="downloadTranscription">
                <i class="fas fa-download"></i>
                Télécharger
              </button>
              <div class="format-select">
                <select v-model="exportFormat">
                  <option value="txt">TXT</option>
                  <option value="srt">SRT</option>
                  <option value="vtt">VTT</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="transcription-content">
            <div v-if="options.speakerDiarization" class="speaker-segments">
              <div v-for="(segment, index) in currentTranscription.segments" 
                :key="index" 
                class="segment"
              >
                <div class="segment-header">
                  <span class="speaker">{{ segment.speaker }}</span>
                  <span class="timestamp">{{ formatTime(segment.start) }} - {{ formatTime(segment.end) }}</span>
                </div>
                <p class="segment-text">{{ segment.text }}</p>
              </div>
            </div>
            <div v-else class="plain-text">
              {{ currentTranscription.text }}
            </div>
          </div>

          <div v-if="options.keywords" class="keywords-section">
            <h4>Mots-clés détectés</h4>
            <div class="keywords-list">
              <span v-for="(keyword, index) in currentTranscription.keywords" 
                :key="index" 
                class="keyword-tag"
              >
                {{ keyword }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'TranscriptionView',
  setup() {
    const store = useStore()
    const isDragging = ref(false)
    const files = ref([])
    const options = ref({
      sourceLanguage: 'auto',
      model: 'standard',
      speakerDiarization: false,
      timestamps: true,
      punctuation: true,
      keywords: false
    })
    const exportFormat = ref('txt')
    const currentTranscription = ref(null)
    const error = ref(null)

    const handleDrop = (e) => {
      isDragging.value = false
      const droppedFiles = [...e.dataTransfer.files].filter(file => file.type.startsWith('audio/'))
      addFiles(droppedFiles)
    }

    const handleFileSelect = (e) => {
      const selectedFiles = [...e.target.files]
      addFiles(selectedFiles)
    }

    const addFiles = (newFiles) => {
      const filesToAdd = newFiles.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        duration: '00:00',
        status: 'pending',
        progress: 0,
        file
      }))
      files.value.push(...filesToAdd)
      processFiles(filesToAdd)
    }

    const processFiles = async (filesToProcess) => {
      for (const file of filesToProcess) {
        try {
          file.status = 'processing'
          const formData = new FormData()
          formData.append('file', file.file)
          formData.append('options', JSON.stringify(options.value))

          const response = await store.dispatch('transcribeAudio', formData)
          
          file.status = 'completed'
          currentTranscription.value = response
        } catch (err) {
          file.status = 'error'
          error.value = err.message
          console.error('Erreur lors de la transcription:', err)
        }
      }
    }

    const downloadTranscription = async (file) => {
      try {
        await store.dispatch('downloadTranscription', {
          id: file.id,
          format: exportFormat.value
        })
      } catch (err) {
        error.value = err.message
        console.error('Erreur lors du téléchargement:', err)
      }
    }

    const retryTranscription = async (file) => {
      file.status = 'pending'
      await processFiles([file])
    }

    const copyTranscription = () => {
      const text = currentTranscription.value?.text || ''
      navigator.clipboard.writeText(text)
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.floor(seconds % 60)
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const getStatusText = (status) => {
      const statusMap = {
        pending: 'En attente',
        processing: 'En cours',
        completed: 'Terminé',
        error: 'Erreur'
      }
      return statusMap[status] || status
    }

    return {
      isDragging,
      files,
      options,
      exportFormat,
      currentTranscription,
      error,
      handleDrop,
      handleFileSelect,
      downloadTranscription,
      retryTranscription,
      copyTranscription,
      formatFileSize,
      formatTime,
      getStatusText
    }
  }
}
</script>

<style scoped>
.transcription-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.upload-section {
  grid-column: 1 / -1;
}

.upload-card {
  background: white;
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 2px dashed #E5E7EB;
  transition: all 0.3s ease;
}

.upload-card.dragging {
  border-color: var(--primary-color);
  background: var(--background-color);
}

.upload-content {
  text-align: center;
}

.upload-icon {
  font-size: 4rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.upload-btn {
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  margin: 1rem 0;
  transition: background-color 0.2s;
}

.upload-btn:hover {
  background: var(--primary-dark);
}

.upload-info {
  color: var(--secondary-color);
  font-size: 0.875rem;
}

.hidden {
  display: none;
}

.options-section {
  grid-column: 1 / 2;
}

.options-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.option-group {
  margin-bottom: 1.5rem;
}

.option-group:last-child {
  margin-bottom: 0;
}

.option-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--secondary-color);
}

.select-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  background: white;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.files-section {
  grid-column: 2 / 3;
}

.files-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #E5E7EB;
}

.file-item:last-child {
  border-bottom: none;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-icon {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.file-details h4 {
  margin-bottom: 0.25rem;
}

.file-details p {
  color: var(--secondary-color);
  font-size: 0.875rem;
}

.file-status {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-text {
  font-size: 0.875rem;
}

.file-status.pending .status-text {
  color: #9CA3AF;
}

.file-status.processing .status-text {
  color: #3B82F6;
}

.file-status.completed .status-text {
  color: #10B981;
}

.file-status.error .status-text {
  color: #EF4444;
}

.progress-bar {
  width: 100px;
  height: 0.5rem;
  background: #E5E7EB;
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.action-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background: var(--background-color);
}

.action-btn.error {
  color: #EF4444;
}

.transcription-section {
  grid-column: 1 / -1;
}

.transcription-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.transcription-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.transcription-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.format-select select {
  padding: 0.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  background: white;
}

.transcription-content {
  max-height: 500px;
  overflow-y: auto;
  padding: 1rem;
  background: var(--background-color);
  border-radius: 0.5rem;
}

.speaker-segments .segment {
  margin-bottom: 1.5rem;
}

.segment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.speaker {
  font-weight: 600;
  color: var(--primary-color);
}

.timestamp {
  color: var(--secondary-color);
  font-size: 0.875rem;
}

.segment-text {
  line-height: 1.6;
}

.keywords-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #E5E7EB;
}

.keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.keyword-tag {
  background: var(--background-color);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}
</style> 