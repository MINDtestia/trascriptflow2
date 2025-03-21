<template>
  <div class="profile">
    <h2>Profil Utilisateur</h2>

    <div class="profile-content">
      <div class="card profile-section">
        <div class="profile-header">
          <div class="profile-avatar">
            <img :src="userAvatar" alt="Avatar" @error="onAvatarError">
            <button class="btn-icon edit-avatar" @click="uploadAvatar">
              <i class="fas fa-camera"></i>
            </button>
          </div>
          <div class="profile-info">
            <h3>{{ userName }}</h3>
            <p class="email">{{ userEmail }}</p>
            <p class="member-since">Membre depuis {{ memberSince }}</p>
          </div>
        </div>
      </div>

      <div class="card profile-section">
        <h3>Informations personnelles</h3>
        <form class="profile-form" @submit.prevent="saveProfile">
          <div class="form-group">
            <label>Nom complet</label>
            <input type="text" v-model="form.fullName" placeholder="Votre nom complet">
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="form.email" placeholder="votre@email.com">
          </div>

          <div class="form-group">
            <label>Langue préférée</label>
            <select v-model="form.language">
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div class="form-group">
            <label>Fuseau horaire</label>
            <select v-model="form.timezone">
              <option value="Europe/Paris">Europe/Paris</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
            </select>
          </div>
        </form>
      </div>

      <div class="card profile-section">
        <h3>Sécurité</h3>
        <div class="security-options">
          <div class="form-group">
            <label>Authentification à deux facteurs</label>
            <div class="toggle-wrapper">
              <button 
                class="toggle-button" 
                :class="{ active: twoFactorEnabled }"
                @click="toggleTwoFactor"
              >
                <span class="toggle-slider"></span>
              </button>
              <span class="toggle-label">
                {{ twoFactorEnabled ? 'Activée' : 'Désactivée' }}
              </span>
            </div>
          </div>

          <button class="btn btn-secondary" @click="changePassword">
            <i class="fas fa-key"></i>
            Changer le mot de passe
          </button>
        </div>
      </div>

      <div class="card profile-section">
        <h3>Statistiques d'utilisation</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <i class="fas fa-file-audio"></i>
            <div class="stat-info">
              <span class="stat-value">{{ stats.transcriptions }}</span>
              <span class="stat-label">Transcriptions</span>
            </div>
          </div>
          <div class="stat-item">
            <i class="fas fa-volume-up"></i>
            <div class="stat-info">
              <span class="stat-value">{{ stats.textToAudio }}</span>
              <span class="stat-label">Conversions texte-audio</span>
            </div>
          </div>
          <div class="stat-item">
            <i class="fas fa-clock"></i>
            <div class="stat-info">
              <span class="stat-value">{{ stats.totalDuration }}</span>
              <span class="stat-label">Heures traitées</span>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="btn btn-primary" @click="saveProfile">
          <i class="fas fa-save"></i>
          Enregistrer les modifications
        </button>
        <button class="btn btn-secondary" @click="resetProfile">
          <i class="fas fa-undo"></i>
          Réinitialiser
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'ProfileView',
  setup() {
    const userAvatar = ref('/default-avatar.png')
    const userName = ref('John Doe')
    const userEmail = ref('john.doe@example.com')
    const memberSince = ref('Janvier 2024')
    const twoFactorEnabled = ref(false)

    const form = ref({
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      language: 'fr',
      timezone: 'Europe/Paris'
    })

    const stats = ref({
      transcriptions: 42,
      textToAudio: 15,
      totalDuration: '23.5'
    })

    const onAvatarError = (e) => {
      e.target.src = '/default-avatar.png'
    }

    const uploadAvatar = () => {
      // TODO: Implémenter l'upload d'avatar
      console.log('Upload avatar')
    }

    const toggleTwoFactor = () => {
      twoFactorEnabled.value = !twoFactorEnabled.value
      // TODO: Implémenter l'activation/désactivation de la 2FA
    }

    const changePassword = () => {
      // TODO: Implémenter le changement de mot de passe
      console.log('Change password')
    }

    const saveProfile = () => {
      // TODO: Implémenter la sauvegarde du profil
      console.log('Save profile:', form.value)
    }

    const resetProfile = () => {
      // TODO: Implémenter la réinitialisation du profil
      form.value = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        language: 'fr',
        timezone: 'Europe/Paris'
      }
    }

    onMounted(() => {
      // TODO: Charger les données du profil
    })

    return {
      userAvatar,
      userName,
      userEmail,
      memberSince,
      form,
      stats,
      twoFactorEnabled,
      onAvatarError,
      uploadAvatar,
      toggleTwoFactor,
      changePassword,
      saveProfile,
      resetProfile
    }
  }
}
</script>

<style scoped>
.profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-section {
  margin-bottom: 2rem;
}

.profile-header {
  display: flex;
  gap: 2rem;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.profile-avatar {
  position: relative;
  width: 120px;
  height: 120px;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent-primary);
}

.edit-avatar {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--accent-primary);
  color: white;
  border-radius: 50%;
  padding: 0.5rem;
  border: 2px solid var(--bg-primary);
}

.profile-info h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.email {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.member-since {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.security-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toggle-button {
  position: relative;
  width: 50px;
  height: 26px;
  border-radius: 13px;
  background: var(--border-color);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-button.active {
  background: var(--accent-primary);
}

.toggle-slider {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  transition: all 0.3s ease;
}

.toggle-button.active .toggle-slider {
  transform: translateX(24px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.stat-item i {
  font-size: 1.5rem;
  color: var(--accent-primary);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: bold;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.actions {
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  .profile {
    padding: 1rem;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .profile-avatar {
    margin: 0 auto;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }
}
</style> 