<template>
  <div id="app" :class="{ 'dark-theme': isDarkMode }">
    <nav class="navbar">
      <div class="navbar-brand">
        <h1>TranscriptFlow</h1>
      </div>
      <div class="navbar-menu">
        <router-link to="/" class="nav-item">
          <i class="fas fa-home"></i>
          <span>Accueil</span>
        </router-link>
        <router-link to="/dashboard" class="nav-item">
          <i class="fas fa-chart-line"></i>
          <span>Tableau de bord</span>
        </router-link>
        <router-link to="/transcribe" class="nav-item">
          <i class="fas fa-file-audio"></i>
          <span>Transcription</span>
        </router-link>
        <router-link to="/text-to-audio" class="nav-item">
          <i class="fas fa-volume-up"></i>
          <span>Texte vers Audio</span>
        </router-link>
        <router-link to="/youtube" class="nav-item">
          <i class="fab fa-youtube"></i>
          <span>YouTube</span>
        </router-link>
        <router-link to="/video" class="nav-item">
          <i class="fas fa-video"></i>
          <span>Vidéo</span>
        </router-link>
        <router-link to="/settings" class="nav-item">
          <i class="fas fa-cog"></i>
          <span>Paramètres</span>
        </router-link>
        <router-link to="/api-keys" class="nav-item">
          <i class="fas fa-key"></i>
          <span>Clés API</span>
        </router-link>
        <router-link to="/profile" class="nav-item">
          <i class="fas fa-user"></i>
          <span>Profil</span>
        </router-link>
      </div>
      <div class="navbar-end">
        <button class="theme-toggle" @click="toggleTheme">
          <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
        </button>
      </div>
    </nav>
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    const isDarkMode = ref(true)

    onMounted(() => {
      const savedTheme = localStorage.getItem('theme')
      isDarkMode.value = savedTheme ? savedTheme === 'dark' : true
      document.documentElement.classList.toggle('dark-theme', isDarkMode.value)
    })

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value
      localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark-theme', isDarkMode.value)
    }

    return {
      isDarkMode,
      toggleTheme
    }
  }
}
</script>

<style>
:root {
  /* Couleurs du thème clair */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #2c3e50;
  --text-secondary: #505d6b;
  --accent-primary: #ff6b00;
  --accent-secondary: #ff8533;
  --accent-hover: #ff944d;
  --border-color: #e9ecef;
  --card-bg: #ffffff;
  --card-border: #e9ecef;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dark-theme {
  /* Couleurs du thème sombre */
  --bg-primary: #1a1a1a;
  --bg-secondary: #242424;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --accent-primary: #ff6b00;
  --accent-secondary: #ff8533;
  --accent-hover: #ff944d;
  --border-color: #404040;
  --card-bg: #2a2a2a;
  --card-border: #404040;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

#app {
  min-height: 100vh;
  display: flex;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.navbar-brand {
  margin-bottom: 2rem;
}

.navbar-brand h1 {
  color: var(--accent-primary);
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-item i {
  width: 20px;
  text-align: center;
}

.nav-item:hover {
  background-color: var(--accent-primary);
  color: white;
}

.nav-item.router-link-active {
  background-color: var(--accent-primary);
  color: white;
}

.navbar-end {
  margin-top: auto;
}

.theme-toggle {
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background-color: var(--accent-primary);
  color: white;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
  background-color: var(--bg-primary);
}

/* Styles globaux */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

/* Styles des cartes */
.card {
  background-color: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

/* Styles des boutons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--accent-primary);
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: var(--accent-hover);
}

/* Media queries pour le responsive */
@media (max-width: 768px) {
  .navbar {
    width: 100%;
    height: auto;
    position: relative;
    flex-direction: row;
    align-items: center;
    padding: 1rem;
  }

  .navbar-brand {
    margin-bottom: 0;
    margin-right: 1rem;
  }

  .navbar-menu {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .main-content {
    margin-left: 0;
    padding: 1rem;
  }
}
</style> 