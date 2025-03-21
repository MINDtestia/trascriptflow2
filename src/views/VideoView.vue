<template>
  <div class="video-extraction">
    <h2>Extraction Audio depuis une Vidéo</h2>
    
    <div class="content-grid">
      <div class="card upload-section">
        <h3>Téléchargement de la vidéo</h3>
        
        <div class="upload-methods">
          <!-- Zone de glisser-déposer -->
          <div 
            class="dropzone"
            :class="{ 'active': isDragging }"
            @dragenter.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @dragover.prevent
            @drop.prevent="handleFileDrop"
          >
            <div class="dropzone-content">
              <i class="fas fa-cloud-upload-alt"></i>
              <p>Glissez et déposez votre fichier vidéo ici</p>
              <p class="supported-formats">Formats supportés: MP4, AVI, MOV, MKV</p>
              <span class="or-divider">ou</span>
              <button class="btn btn-secondary" @click="triggerFileInput">
                <i class="fas fa-folder-open"></i>
                Parcourir les fichiers
              </button>
            </div>
            <input 
              type="file"
              ref="fileInput"
              @change="handleFileSelect"
              accept="video/*"
              class="hidden-input"
            >
          </div>

          <!-- Séparateur -->
          <div class="separator">
            <span>OU</span>
          </div>

          <!-- Input URL -->
          <div class="url-section">
            <h4>URL de la vidéo</h4>
            <div class="url-input">
              <input 
                type="text" 
                v-model="videoUrl" 
                placeholder="Collez l'URL de la vidéo (YouTube, Vimeo, etc.)"
                :class="{ 'error': urlError }"
              >
              <button 
                class="btn btn-primary"
                @click="extractVideo" 
                :disabled="(!videoUrl && !selectedFile) || isProcessing"
              >
                <i class="fas fa-download"></i>
                {{ isProcessing ? 'Extraction en cours...' : 'Extraire l\'audio' }}
              </button>
            </div>
            <p v-if="urlError" class="error-message">{{ urlError }}</p>
          </div>
        </div>

        <!-- Aperçu du fichier sélectionné -->
        <div v-if="selectedFile" class="selected-file">
          <div class="file-info">
            <i class="fas fa-file-video"></i>
            <div class="file-details">
              <span class="file-name">{{ selectedFile.name }}</span>
              <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
            </div>
          </div>
          <button class="btn-icon" @click="removeFile">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="card options-section">
        <h3>Options d'extraction</h3>
        <div class="form-group">
          <label>Qualité audio</label>
          <select v-model="quality">
            <option value="high">Haute qualité (192kbps)</option>
            <option value="medium">Qualité moyenne (128kbps)</option>
            <option value="low">Basse qualité (96kbps)</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Format de sortie</label>
          <select v-model="format">
            <option value="mp3">MP3</option>
            <option value="wav">WAV</option>
            <option value="ogg">OGG</option>
          </select>
        </div>

        <div class="form-group">
          <label>Découpage (optionnel)</label>
          <div class="time-range">
            <div class="time-input">
              <label>Début</label>
              <input 
                type="text" 
                v-model="startTime" 
                placeholder="00:00"
                pattern="[0-9]{2}:[0-9]{2}"
              >
            </div>
            <div class="time-input">
              <label>Fin</label>
              <input 
                type="text" 
                v-model="endTime" 
                placeholder="10:00"
                pattern="[0-9]{2}:[0-9]{2}"
              >
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentTask" class="card status-section">
        <h3>État de l'extraction</h3>
        <div class="status-content">
          <div class="status-indicator" :class="currentTask.status">
            <i :class="statusIcon"></i>
            {{ statusText }}
          </div>

          <div v-if="currentTask.status === 'completed'" class="video-info">
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Titre</span>
                <span class="value">{{ currentTask.title }}</span>
              </div>
              <div class="info-item">
                <span class="label">Durée</span>
                <span class="value">{{ currentTask.duration }}</span>
              </div>
              <div class="info-item">
                <span class="label">Auteur</span>
                <span class="value">{{ currentTask.author }}</span>
              </div>
            </div>

            <div class="download-section" v-if="currentTask.download_url">
              <a 
                :href="'http://localhost:8002' + currentTask.download_url" 
                class="btn btn-primary"
                download
              >
                <i class="fas fa-download"></i>
                Télécharger l'audio
              </a>
            </div>
          </div>

          <div v-if="currentTask.status === 'failed'" class="error-details">
            <p class="error-message">{{ currentTask.error }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'VideoView',
  setup() {
    const videoUrl = ref('')
    const urlError = ref('')
    const isProcessing = ref(false)
    const quality = ref('high')
    const format = ref('mp3')
    const startTime = ref('')
    const endTime = ref('')
    const currentTask = ref(null)
    const isDragging = ref(false)
    const selectedFile = ref(null)
    const fileInput = ref(null)

    const statusIcon = computed(() => {
      switch (currentTask.value?.status) {
        case 'processing':
          return 'fas fa-spinner fa-spin'
        case 'completed':
          return 'fas fa-check-circle'
        case 'failed':
          return 'fas fa-times-circle'
        default:
          return 'fas fa-question-circle'
      }
    })

    const statusText = computed(() => {
      switch (currentTask.value?.status) {
        case 'processing':
          return 'Extraction en cours...'
        case 'completed':
          return 'Extraction terminée'
        case 'failed':
          return 'Échec de l\'extraction'
        default:
          return 'État inconnu'
      }
    })

    const validateUrl = (url) => {
      const videoRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.+$/
      return videoRegex.test(url)
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
    }

    const triggerFileInput = () => {
      fileInput.value.click()
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file && file.type.startsWith('video/')) {
        selectedFile.value = file
        videoUrl.value = ''
        urlError.value = ''
      } else {
        urlError.value = 'Veuillez sélectionner un fichier vidéo valide'
      }
    }

    const handleFileDrop = (event) => {
      isDragging.value = false
      const file = event.dataTransfer.files[0]
      if (file && file.type.startsWith('video/')) {
        selectedFile.value = file
        videoUrl.value = ''
        urlError.value = ''
      } else {
        urlError.value = 'Veuillez déposer un fichier vidéo valide'
      }
    }

    const removeFile = () => {
      selectedFile.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    const checkTaskStatus = async (taskId) => {
      try {
        const response = await fetch(`http://localhost:8002/api/video/status/${taskId}`)
        if (!response.ok) throw new Error('Erreur lors de la vérification du statut')
        
        const data = await response.json()
        currentTask.value = data

        if (data.status === 'processing') {
          setTimeout(() => checkTaskStatus(taskId), 2000)
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du statut:', error)
      }
    }

    const extractVideo = async () => {
      if (!videoUrl.value && !selectedFile.value) {
        urlError.value = 'Veuillez fournir une URL ou sélectionner un fichier vidéo'
        return
      }

      if (videoUrl.value && !validateUrl(videoUrl.value)) {
        urlError.value = 'URL vidéo invalide'
        return
      }

      isProcessing.value = true
      urlError.value = ''

      try {
        const formData = new FormData()
        
        if (selectedFile.value) {
          formData.append('file', selectedFile.value)
        } else {
          formData.append('url', videoUrl.value)
        }
        
        formData.append('quality', quality.value)
        formData.append('format', format.value)
        if (startTime.value) formData.append('start_time', startTime.value)
        if (endTime.value) formData.append('end_time', endTime.value)

        const response = await fetch('http://localhost:8002/api/video/extract', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Erreur lors du lancement de l\'extraction')
        }

        const data = await response.json()
        currentTask.value = data
        checkTaskStatus(data.id)
      } catch (error) {
        urlError.value = error.message
      } finally {
        isProcessing.value = false
      }
    }

    return {
      videoUrl,
      urlError,
      isProcessing,
      quality,
      format,
      startTime,
      endTime,
      currentTask,
      statusIcon,
      statusText,
      extractVideo,
      isDragging,
      selectedFile,
      fileInput,
      handleFileSelect,
      handleFileDrop,
      triggerFileInput,
      removeFile,
      formatFileSize
    }
  }
}
</script>

<style scoped>
.video-extraction {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.content-grid {
  display: grid;
  gap: 2rem;
  margin-top: 2rem;
}

.upload-methods {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dropzone {
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  background-color: var(--bg-secondary);
}

.dropzone.active {
  border-color: var(--accent-primary);
  background-color: var(--bg-primary);
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.dropzone-content i {
  font-size: 3rem;
  color: var(--text-secondary);
}

.supported-formats {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.or-divider {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.hidden-input {
  display: none;
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--text-secondary);
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border-color);
}

.separator span {
  padding: 0 1rem;
}

.selected-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-radius: 4px;
  margin-top: 1rem;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-info i {
  font-size: 1.5rem;
  color: var(--accent-primary);
}

.file-details {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-weight: 500;
}

.file-size {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.btn-icon {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  color: var(--accent-primary);
  background-color: var(--bg-primary);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 4px;
  background-color: var(--bg-secondary);
  margin-bottom: 1rem;
}

.status-indicator.processing {
  color: #0d6efd;
}

.status-indicator.completed {
  color: #198754;
}

.status-indicator.failed {
  color: #dc3545;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item .label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.info-item .value {
  font-weight: 500;
}

.download-section {
  margin-top: 2rem;
  text-align: center;
}

@media (max-width: 768px) {
  .video-extraction {
    padding: 1rem;
  }

  .url-input {
    flex-direction: column;
  }

  .time-range {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style> 