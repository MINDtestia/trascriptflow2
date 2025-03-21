<template>
  <div class="api-keys">
    <h2>Gestion des clés API</h2>
    
    <div class="card api-section">
      <h3>OpenAI API</h3>
      <div class="api-form">
        <div class="form-group">
          <label>Clé API OpenAI</label>
          <div class="api-key-input">
            <input 
              :type="showOpenAIKey ? 'text' : 'password'"
              v-model="openAIKey"
              placeholder="sk-..."
            >
            <button class="btn-icon" @click="showOpenAIKey = !showOpenAIKey">
              <i :class="showOpenAIKey ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>
        <div class="api-status" :class="{ active: openAIKeyValid }">
          <i :class="openAIKeyValid ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
          {{ openAIKeyValid ? 'Clé API valide' : 'Clé API non valide' }}
        </div>
      </div>
    </div>

    <div class="card api-section">
      <h3>Google Cloud API</h3>
      <div class="api-form">
        <div class="form-group">
          <label>Clé API Google Cloud</label>
          <div class="api-key-input">
            <input 
              :type="showGoogleKey ? 'text' : 'password'"
              v-model="googleKey"
              placeholder="AIza..."
            >
            <button class="btn-icon" @click="showGoogleKey = !showGoogleKey">
              <i :class="showGoogleKey ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>
        <div class="api-status" :class="{ active: googleKeyValid }">
          <i :class="googleKeyValid ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
          {{ googleKeyValid ? 'Clé API valide' : 'Clé API non valide' }}
        </div>
      </div>
    </div>

    <div class="card api-section">
      <h3>Azure Speech Services</h3>
      <div class="api-form">
        <div class="form-group">
          <label>Clé API Azure</label>
          <div class="api-key-input">
            <input 
              :type="showAzureKey ? 'text' : 'password'"
              v-model="azureKey"
              placeholder="..."
            >
            <button class="btn-icon" @click="showAzureKey = !showAzureKey">
              <i :class="showAzureKey ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>
        <div class="form-group">
          <label>Région Azure</label>
          <select v-model="azureRegion">
            <option value="westeurope">Europe de l'Ouest</option>
            <option value="eastus">États-Unis Est</option>
            <option value="eastasia">Asie de l'Est</option>
          </select>
        </div>
        <div class="api-status" :class="{ active: azureKeyValid }">
          <i :class="azureKeyValid ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
          {{ azureKeyValid ? 'Clé API valide' : 'Clé API non valide' }}
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="btn btn-primary" @click="saveKeys">
        <i class="fas fa-save"></i>
        Enregistrer les clés
      </button>
      <button class="btn btn-secondary" @click="testConnections">
        <i class="fas fa-sync"></i>
        Tester les connexions
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ApiKeysView',
  setup() {
    const openAIKey = ref('')
    const googleKey = ref('')
    const azureKey = ref('')
    const azureRegion = ref('westeurope')

    const showOpenAIKey = ref(false)
    const showGoogleKey = ref(false)
    const showAzureKey = ref(false)

    const openAIKeyValid = ref(false)
    const googleKeyValid = ref(false)
    const azureKeyValid = ref(false)

    const saveKeys = async () => {
      // TODO: Implémenter la sauvegarde des clés API
      console.log('Sauvegarde des clés API:', {
        openAI: openAIKey.value,
        google: googleKey.value,
        azure: {
          key: azureKey.value,
          region: azureRegion.value
        }
      })
    }

    const testConnections = async () => {
      // TODO: Implémenter les tests de connexion
      console.log('Test des connexions API')
      openAIKeyValid.value = openAIKey.value.startsWith('sk-')
      googleKeyValid.value = googleKey.value.startsWith('AIza')
      azureKeyValid.value = azureKey.value.length > 0
    }

    return {
      openAIKey,
      googleKey,
      azureKey,
      azureRegion,
      showOpenAIKey,
      showGoogleKey,
      showAzureKey,
      openAIKeyValid,
      googleKeyValid,
      azureKeyValid,
      saveKeys,
      testConnections
    }
  }
}
</script>

<style scoped>
.api-keys {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.api-section {
  margin-bottom: 2rem;
}

.api-section h3 {
  margin-bottom: 1.5rem;
  color: var(--accent-primary);
}

.api-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.api-key-input {
  display: flex;
  gap: 0.5rem;
}

.api-key-input input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.api-key-input input:focus {
  outline: none;
  border-color: var(--accent-primary);
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
  background-color: var(--bg-secondary);
}

.api-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.api-status i {
  font-size: 1rem;
}

.api-status.active {
  color: #4caf50;
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

select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

select:focus {
  outline: none;
  border-color: var(--accent-primary);
}

@media (max-width: 768px) {
  .api-keys {
    padding: 1rem;
  }

  .actions {
    flex-direction: column;
  }
}
</style> 