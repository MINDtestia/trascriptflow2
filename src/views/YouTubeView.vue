<template>
  <div class="youtube-view">
    <div class="page-header">
      <h1>Extraction Audio YouTube</h1>
      <p>Téléchargez l'audio de vos vidéos YouTube préférées</p>
    </div>

    <div class="content-grid">
      <!-- Zone de saisie URL -->
      <div class="url-section">
        <div class="url-card">
          <h3>URL YouTube</h3>
          <div class="url-input-group">
            <input
              type="text"
              v-model="youtubeUrl"
              placeholder="Collez l'URL de la vidéo YouTube"
              class="url-input"
              :class="{ 'error': urlError }"
            >
            <button 
              class="download-btn"
              :disabled="!isValidUrl || isDownloading"
              @click="downloadAudio"
            >
              <i class="fas fa-download"></i>
              {{ isDownloading ? 'Téléchargement...' : 'Télécharger' }}
            </button>
          </div>
          <p v-if="urlError" class="error-message">{{ urlError }}</p>
        </div>
      </div>

      <!-- Informations de la vidéo -->
      <div v-if="videoInfo" class="video-info">
        <div class="info-card">
          <div class="video-thumbnail">
            <img :src="videoInfo.thumbnail" :alt="videoInfo.title">
          </div>
          <div class="video-details">
            <h3>{{ videoInfo.title }}</h3>
            <p class="channel">{{ videoInfo.channel }}</p>
            <div class="meta-info">
              <span><i class="fas fa-clock"></i> {{ videoInfo.duration }}</span>
              <span><i class="fas fa-eye"></i> {{ videoInfo.views }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Options de téléchargement -->
      <div class="download-options">
        <div class="options-card">
          <h3>Options de téléchargement</h3>
          
          <div class="option-group">
            <label>Qualité audio</label>
            <select v-model="audioQuality" class="select-input">
              <option value="best">Meilleure qualité (320kbps)</option>
              <option value="high">Haute qualité (256kbps)</option>
              <option value="medium">Qualité moyenne (192kbps)</option>
              <option value="low">Basse qualité (128kbps)</option>
            </select>
          </div>

          <div class="option-group">
            <label>Format</label>
            <select v-model="audioFormat" class="select-input">
              <option value="mp3">MP3 (Recommandé)</option>
              <option value="wav">WAV (Sans perte)</option>
              <option value="m4a">M4A (AAC)</option>
              <option value="ogg">OGG (Vorbis)</option>
            </select>
          </div>

          <div class="option-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="extractMetadata">
              Extraire les métadonnées
              <i class="fas fa-info-circle tooltip-trigger">
                <span class="tooltip-text">
                  Inclut le titre, l'artiste, la pochette et autres informations de la vidéo
                </span>
              </i>
            </label>
          </div>

          <div class="option-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="options.splitChapters">
              Diviser par chapitres
              <i class="fas fa-info-circle tooltip-trigger">
                <span class="tooltip-text">
                  Crée des fichiers séparés pour chaque chapitre de la vidéo
                </span>
              </i>
            </label>
          </div>

          <div class="option-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="options.normalizeAudio">
              Normaliser l'audio
              <i class="fas fa-info-circle tooltip-trigger">
                <span class="tooltip-text">
                  Ajuste le volume pour une meilleure uniformité
                </span>
              </i>
            </label>
          </div>

          <div class="option-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="options.removeNoise">
              Réduction du bruit
              <i class="fas fa-info-circle tooltip-trigger">
                <span class="tooltip-text">
                  Réduit les bruits de fond indésirables
                </span>
              </i>
            </label>
          </div>
        </div>

        <div class="batch-options" v-if="downloadHistory.length > 0">
          <h4>Actions groupées</h4>
          <div class="batch-actions">
            <button class="batch-btn" @click="downloadAll">
              <i class="fas fa-cloud-download-alt"></i>
              Tout télécharger
            </button>
            <button class="batch-btn" @click="clearHistory">
              <i class="fas fa-trash-alt"></i>
              Vider l'historique
            </button>
          </div>
        </div>
      </div>

      <!-- Historique des téléchargements -->
      <div class="download-history">
        <div class="history-card">
          <div class="history-header">
            <h3>Historique des téléchargements</h3>
            <div class="history-filters">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Rechercher..."
                class="search-input"
              >
              <select v-model="filterStatus" class="filter-select">
                <option value="all">Tous les statuts</option>
                <option value="completed">Terminés</option>
                <option value="error">Erreurs</option>
                <option value="processing">En cours</option>
              </select>
            </div>
          </div>

          <div class="history-list" v-if="filteredHistory.length > 0">
            <div v-for="item in filteredHistory" 
              :key="item.id" 
              class="history-item"
              :class="{ 'expanded': item.expanded }"
            >
              <div class="history-main" @click="toggleItemExpand(item)">
                <div class="history-thumbnail">
                  <img :src="item.thumbnail" :alt="item.title">
                  <span class="duration">{{ item.duration }}</span>
                </div>
                <div class="history-details">
                  <h4>{{ item.title }}</h4>
                  <p class="channel">{{ item.channel }}</p>
                  <div class="meta-info">
                    <span><i class="fas fa-calendar"></i> {{ formatDate(item.date) }}</span>
                    <span><i class="fas fa-file-audio"></i> {{ item.format }}</span>
                    <span><i class="fas fa-signal"></i> {{ item.quality }}</span>
                  </div>
                </div>
                <div class="history-status" :class="item.status">
                  <i :class="getStatusIcon(item.status)"></i>
                  {{ getStatusText(item.status) }}
                </div>
              </div>

              <div class="history-expanded" v-if="item.expanded">
                <div class="expanded-content">
                  <div class="expanded-info">
                    <div class="info-group">
                      <label>URL</label>
                      <div class="url-display">
                        <span>{{ item.url }}</span>
                        <button @click="copyToClipboard(item.url)" class="copy-btn">
                          <i class="fas fa-copy"></i>
                        </button>
                      </div>
                    </div>
                    <div class="info-group">
                      <label>Taille du fichier</label>
                      <span>{{ formatFileSize(item.fileSize) }}</span>
                    </div>
                    <div class="info-group">
                      <label>Options utilisées</label>
                      <div class="options-tags">
                        <span class="option-tag" v-for="option in getActiveOptions(item.options)" 
                          :key="option.key"
                        >
                          {{ option.label }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="expanded-actions">
                    <button class="action-btn primary" @click="downloadAgain(item)">
                      <i class="fas fa-redo"></i>
                      Télécharger à nouveau
                    </button>
                    <button class="action-btn" @click="playAudio(item)">
                      <i class="fas fa-play"></i>
                      Écouter
                    </button>
                    <button class="action-btn" @click="showDetails(item)">
                      <i class="fas fa-info-circle"></i>
                      Détails
                    </button>
                    <button class="action-btn danger" @click="deleteItem(item)">
                      <i class="fas fa-trash"></i>
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-history">
            <i class="fas fa-history"></i>
            <p>Aucun téléchargement dans l'historique</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de détails -->
    <div class="modal" v-if="selectedItem" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Détails du téléchargement</h3>
          <button class="close-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="details-grid">
            <div class="detail-item">
              <label>Titre</label>
              <p>{{ selectedItem.title }}</p>
            </div>
            <div class="detail-item">
              <label>Chaîne</label>
              <p>{{ selectedItem.channel }}</p>
            </div>
            <div class="detail-item">
              <label>Date de téléchargement</label>
              <p>{{ formatDate(selectedItem.date) }}</p>
            </div>
            <div class="detail-item">
              <label>Format</label>
              <p>{{ selectedItem.format }}</p>
            </div>
            <div class="detail-item">
              <label>Qualité</label>
              <p>{{ selectedItem.quality }}</p>
            </div>
            <div class="detail-item">
              <label>Taille</label>
              <p>{{ formatFileSize(selectedItem.fileSize) }}</p>
            </div>
          </div>
          
          <div class="metadata-section" v-if="selectedItem.metadata">
            <h4>Métadonnées</h4>
            <div class="metadata-grid">
              <div v-for="(value, key) in selectedItem.metadata" 
                :key="key" 
                class="metadata-item"
              >
                <label>{{ formatMetadataKey(key) }}</label>
                <p>{{ value }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'YouTubeView',
  setup() {
    const store = useStore()
    const youtubeUrl = ref('')
    const urlError = ref('')
    const isDownloading = ref(false)
    const videoInfo = ref(null)
    const audioQuality = ref('best')
    const audioFormat = ref('mp3')
    const extractMetadata = ref(true)
    const options = ref({
      splitChapters: false,
      normalizeAudio: true,
      removeNoise: false
    })
    const downloadHistory = ref([])
    const searchQuery = ref('')
    const filterStatus = ref('all')
    const selectedItem = ref(null)

    const isValidUrl = computed(() => {
      const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
      return pattern.test(youtubeUrl.value)
    })

    const filteredHistory = computed(() => {
      return downloadHistory.value.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesStatus = filterStatus.value === 'all' || item.status === filterStatus.value
        return matchesSearch && matchesStatus
      })
    })

    const validateUrl = () => {
      if (!youtubeUrl.value) {
        urlError.value = 'Veuillez entrer une URL YouTube'
        return false
      }
      if (!isValidUrl.value) {
        urlError.value = 'URL YouTube invalide'
        return false
      }
      urlError.value = ''
      return true
    }

    const getVideoInfo = async () => {
      try {
        const response = await store.dispatch('getVideoInfo', youtubeUrl.value)
        videoInfo.value = response
      } catch (err) {
        urlError.value = err.message
        console.error('Erreur lors de la récupération des informations:', err)
      }
    }

    const downloadAudio = async () => {
      if (!validateUrl()) return

      try {
        isDownloading.value = true
        const downloadOptions = {
          url: youtubeUrl.value,
          quality: audioQuality.value,
          format: audioFormat.value,
          extractMetadata: extractMetadata.value,
          ...options.value
        }

        const response = await store.dispatch('downloadYouTube', downloadOptions)
        downloadHistory.value.unshift({
          id: Date.now(),
          ...response,
          date: new Date(),
          expanded: false
        })
      } catch (err) {
        urlError.value = err.message
        console.error('Erreur lors du téléchargement:', err)
      } finally {
        isDownloading.value = false
      }
    }

    const downloadAll = async () => {
      const pendingDownloads = downloadHistory.value
        .filter(item => item.status === 'pending')
        .map(item => item.url)

      for (const url of pendingDownloads) {
        youtubeUrl.value = url
        await downloadAudio()
      }
    }

    const clearHistory = () => {
      downloadHistory.value = []
    }

    const toggleItemExpand = (item) => {
      item.expanded = !item.expanded
    }

    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text)
    }

    const downloadAgain = async (item) => {
      youtubeUrl.value = item.url
      await downloadAudio()
    }

    const playAudio = (item) => {
      // Implémenter la lecture audio
      console.log('Lecture audio:', item)
    }

    const showDetails = (item) => {
      selectedItem.value = item
    }

    const closeModal = () => {
      selectedItem.value = null
    }

    const deleteItem = (item) => {
      const index = downloadHistory.value.findIndex(i => i.id === item.id)
      if (index !== -1) {
        downloadHistory.value.splice(index, 1)
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getStatusIcon = (status) => {
      const icons = {
        completed: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        processing: 'fas fa-spinner fa-spin',
        pending: 'fas fa-clock'
      }
      return icons[status] || 'fas fa-question-circle'
    }

    const getStatusText = (status) => {
      const texts = {
        completed: 'Terminé',
        error: 'Erreur',
        processing: 'En cours',
        pending: 'En attente'
      }
      return texts[status] || status
    }

    const getActiveOptions = (itemOptions) => {
      return Object.entries(itemOptions)
        .filter(([, value]) => value)
        .map(([key]) => ({
          key,
          label: {
            splitChapters: 'Chapitres',
            normalizeAudio: 'Normalisation',
            removeNoise: 'Réduction du bruit'
          }[key]
        }))
    }

    return {
      youtubeUrl,
      urlError,
      isDownloading,
      videoInfo,
      audioQuality,
      audioFormat,
      extractMetadata,
      options,
      downloadHistory,
      searchQuery,
      filterStatus,
      selectedItem,
      isValidUrl,
      filteredHistory,
      validateUrl,
      getVideoInfo,
      downloadAudio,
      downloadAll,
      clearHistory,
      toggleItemExpand,
      copyToClipboard,
      downloadAgain,
      playAudio,
      showDetails,
      closeModal,
      deleteItem,
      formatDate,
      formatFileSize,
      getStatusIcon,
      getStatusText,
      getActiveOptions
    }
  }
}
</script>

<style scoped>
.youtube-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--secondary-color);
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.url-section {
  grid-column: 1 / -1;
}

.url-card {
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.url-input-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.url-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.url-input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.download-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.download-btn:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.download-btn:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.video-info {
  grid-column: 1 / -1;
}

.info-card {
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1.5rem;
}

.video-thumbnail {
  width: 240px;
  height: 135px;
  border-radius: 0.5rem;
  overflow: hidden;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-details {
  flex: 1;
}

.video-details h3 {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.channel {
  color: var(--secondary-color);
  margin-bottom: 1rem;
}

.meta-info {
  display: flex;
  gap: 1rem;
  color: var(--secondary-color);
}

.meta-info span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.download-options {
  grid-column: 1 / 2;
}

.options-card {
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.option-group {
  margin-bottom: 1.5rem;
}

.option-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--secondary-color);
}

.select-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.download-history {
  grid-column: 2 / 3;
}

.history-card {
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.history-list {
  margin-top: 1rem;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.history-item:last-child {
  border-bottom: none;
}

.history-thumbnail {
  width: 120px;
  height: 68px;
  border-radius: 0.5rem;
  overflow: hidden;
}

.history-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.history-details {
  flex: 1;
}

.history-details h4 {
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.history-details p {
  color: var(--secondary-color);
  font-size: 0.75rem;
}

.history-actions {
  display: flex;
  gap: 0.5rem;
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
  background-color: var(--background-color);
}

.tooltip-trigger {
  position: relative;
  margin-left: 0.5rem;
  color: var(--secondary-color);
  cursor: help;
}

.tooltip-text {
  visibility: hidden;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1F2937;
  color: white;
  text-align: center;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  white-space: nowrap;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip-trigger:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.batch-options {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #E5E7EB;
}

.batch-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.batch-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  background-color: var(--background-color);
  color: var(--primary-color);
  cursor: pointer;
  transition: background-color 0.2s;
}

.batch-btn:hover {
  background-color: #E5E7EB;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.history-filters {
  display: flex;
  gap: 1rem;
}

.search-input {
  padding: 0.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  width: 200px;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  background: white;
}

.history-item {
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.history-item:hover {
  border-color: var(--primary-color);
}

.history-main {
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  background: white;
}

.history-thumbnail {
  position: relative;
  width: 160px;
  height: 90px;
  border-radius: 0.5rem;
  overflow: hidden;
}

.duration {
  position: absolute;
  bottom: 0.25rem;
  right: 0.25rem;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.channel {
  color: var(--secondary-color);
  font-size: 0.875rem;
  margin: 0.25rem 0;
}

.meta-info {
  display: flex;
  gap: 1rem;
  color: var(--secondary-color);
  font-size: 0.875rem;
}

.history-status {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
}

.history-status.completed {
  color: #10B981;
  background: #D1FAE5;
}

.history-status.processing {
  color: #3B82F6;
  background: #DBEAFE;
}

.history-status.error {
  color: #EF4444;
  background: #FEE2E2;
}

.history-expanded {
  border-top: 1px solid #E5E7EB;
  background: var(--background-color);
}

.expanded-content {
  padding: 1rem;
}

.expanded-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-group label {
  color: var(--secondary-color);
  font-size: 0.875rem;
}

.url-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.copy-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  padding: 0.25rem;
}

.options-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.option-tag {
  background: white;
  color: var(--primary-color);
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
}

.expanded-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #E5E7EB;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  background: var(--background-color);
  color: var(--primary-color);
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #E5E7EB;
}

.action-btn.primary {
  background: var(--primary-color);
  color: white;
}

.action-btn.primary:hover {
  background: var(--primary-dark);
}

.action-btn.danger {
  color: #EF4444;
}

.action-btn.danger:hover {
  background: #FEE2E2;
}

.empty-history {
  text-align: center;
  padding: 3rem;
  color: var(--secondary-color);
}

.empty-history i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #E5E7EB;
}

.close-btn {
  background: none;
  border: none;
  color: var(--secondary-color);
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.25rem;
}

.modal-body {
  padding: 1.5rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.detail-item label {
  color: var(--secondary-color);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  display: block;
}

.metadata-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #E5E7EB;
}

.metadata-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.metadata-item label {
  color: var(--secondary-color);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  display: block;
}
</style> 