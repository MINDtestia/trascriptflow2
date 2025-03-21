import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    isAuthenticated: false,
    apiKey: null,
    apiKeys: [],
    textToAudioHistory: [],
    recentTranscriptions: [],
    recentDownloads: [],
    settings: {
      defaultLanguage: 'fr',
      audioQuality: 'high',
      autoTranslate: false
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      state.isAuthenticated = !!user
    },
    setApiKey(state, apiKey) {
      state.apiKey = apiKey
    },
    setApiKeys(state, keys) {
      state.apiKeys = keys
    },
    addApiKey(state, key) {
      state.apiKeys.push(key)
    },
    removeApiKey(state, keyId) {
      state.apiKeys = state.apiKeys.filter(key => key.id !== keyId)
    },
    addTextToAudio(state, item) {
      state.textToAudioHistory.unshift(item)
      if (state.textToAudioHistory.length > 10) {
        state.textToAudioHistory.pop()
      }
    },
    addTranscription(state, transcription) {
      state.recentTranscriptions.unshift(transcription)
      if (state.recentTranscriptions.length > 10) {
        state.recentTranscriptions.pop()
      }
    },
    addDownload(state, download) {
      state.recentDownloads.unshift(download)
      if (state.recentDownloads.length > 10) {
        state.recentDownloads.pop()
      }
    },
    updateSettings(state, settings) {
      state.settings = { ...state.settings, ...settings }
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })
        const data = await response.json()
        commit('setUser', data.user)
        commit('setApiKey', data.apiKey)
        return data
      } catch (error) {
        console.error('Erreur de connexion:', error)
        throw error
      }
    },
    async register({ commit }, userData) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })
        const data = await response.json()
        commit('setUser', data.user)
        commit('setApiKey', data.apiKey)
        return data
      } catch (error) {
        console.error('Erreur d\'inscription:', error)
        throw error
      }
    },
    logout({ commit }) {
      commit('setUser', null)
      commit('setApiKey', null)
    },
    async updateUserSettings({ commit, state }, settings) {
      try {
        const response = await fetch('http://localhost:5000/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.apiKey}`
          },
          body: JSON.stringify(settings)
        })
        const data = await response.json()
        commit('updateSettings', data.settings)
        return data
      } catch (error) {
        console.error('Erreur de mise à jour des paramètres:', error)
        throw error
      }
    },
    async transcribeAudio({ commit, state }, formData) {
      try {
        const response = await fetch('http://localhost:5000/api/transcribe', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${state.apiKey}`
          },
          body: formData
        })
        if (!response.ok) {
          throw new Error('Erreur lors de la transcription')
        }
        const data = await response.json()
        commit('addTranscription', data)
        return data
      } catch (error) {
        console.error('Erreur de transcription:', error)
        throw error
      }
    },
    async downloadYouTube({ commit, state }, options) {
      try {
        const response = await fetch('http://localhost:5000/api/youtube/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.apiKey}`
          },
          body: JSON.stringify(options)
        })
        if (!response.ok) {
          throw new Error('Erreur lors du téléchargement')
        }
        const data = await response.json()
        commit('addDownload', data)
        return data
      } catch (error) {
        console.error('Erreur de téléchargement YouTube:', error)
        throw error
      }
    },
    async getVideoInfo({ state }, url) {
      try {
        const response = await fetch('http://localhost:5000/api/youtube/info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.apiKey}`
          },
          body: JSON.stringify({ url })
        })
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des informations')
        }
        return await response.json()
      } catch (error) {
        console.error('Erreur de récupération des informations:', error)
        throw error
      }
    },
    async downloadTranscription({ state }, { id, format }) {
      try {
        const response = await fetch(`http://localhost:5000/api/transcribe/${id}/download`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${state.apiKey}`
          },
          params: { format }
        })
        if (!response.ok) {
          throw new Error('Erreur lors du téléchargement')
        }
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `transcription.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } catch (error) {
        console.error('Erreur de téléchargement:', error)
        throw error
      }
    },
    async fetchApiKeys({ commit, state }) {
      try {
        const response = await fetch('http://localhost:5000/api/keys', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${state.apiKey}`
          }
        })
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des clés API')
        }
        const data = await response.json()
        commit('setApiKeys', data.keys)
        return data.keys
      } catch (error) {
        console.error('Erreur de récupération des clés API:', error)
        throw error
      }
    },
    async createApiKey({ commit, state }, { name, permissions }) {
      try {
        const response = await fetch('http://localhost:5000/api/keys', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.apiKey}`
          },
          body: JSON.stringify({ name, permissions })
        })
        if (!response.ok) {
          throw new Error('Erreur lors de la création de la clé API')
        }
        const data = await response.json()
        commit('addApiKey', data.key)
        return data.key
      } catch (error) {
        console.error('Erreur de création de clé API:', error)
        throw error
      }
    },
    async deleteApiKey({ commit, state }, keyId) {
      try {
        const response = await fetch(`http://localhost:5000/api/keys/${keyId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${state.apiKey}`
          }
        })
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de la clé API')
        }
        commit('removeApiKey', keyId)
      } catch (error) {
        console.error('Erreur de suppression de clé API:', error)
        throw error
      }
    },
    async textToAudio({ commit, state }, { text, voice, options }) {
      try {
        const response = await fetch('/api/text-to-audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.apiKey}`
          },
          body: JSON.stringify({
            text,
            voice,
            ...options
          })
        })
        if (!response.ok) {
          throw new Error('Erreur lors de la conversion texte vers audio')
        }
        const data = await response.json()
        commit('addTextToAudio', {
          id: data.id,
          text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
          status: 'completed',
          url: data.audioUrl,
          createdAt: new Date().toISOString()
        })
        return data
      } catch (error) {
        console.error('Erreur de conversion texte vers audio:', error)
        throw error
      }
    },
    async downloadAudio({ state }, audioId) {
      try {
        const response = await fetch(`/api/text-to-audio/${audioId}/download`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${state.apiKey}`
          }
        })
        if (!response.ok) {
          throw new Error('Erreur lors du téléchargement de l\'audio')
        }
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `audio_${audioId}.mp3`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } catch (error) {
        console.error('Erreur de téléchargement audio:', error)
        throw error
      }
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user,
    apiKey: state => state.apiKey,
    apiKeys: state => state.apiKeys,
    textToAudioHistory: state => state.textToAudioHistory,
    recentTranscriptions: state => state.recentTranscriptions,
    recentDownloads: state => state.recentDownloads,
    settings: state => state.settings
  }
}) 