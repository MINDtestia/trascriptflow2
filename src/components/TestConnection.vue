<template>
  <div class="test-connection">
    <h2>Test de connexion au backend</h2>
    <div class="card">
      <p v-if="message">{{ message }}</p>
      <p v-if="error" class="error-message">{{ error }}</p>
      <button @click="testConnection" class="btn btn-primary">
        Tester la connexion
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { apiService } from '../service/api'

export default {
  name: 'TestConnection',
  setup() {
    const message = ref('')
    const error = ref('')

    const testConnection = async () => {
      try {
        const response = await apiService.getWelcomeMessage()
        message.value = response.message
        error.value = ''
      } catch (err) {
        error.value = 'Erreur de connexion au backend'
        message.value = ''
      }
    }

    return {
      message,
      error,
      testConnection
    }
  }
}
</script>

<style scoped>
.test-connection {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
}

.card {
  background-color: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
  text-align: center;
}
</style> 