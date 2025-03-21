<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <h1>Transcriptflow</h1>
    </div>
    <div class="navbar-menu">
      <router-link to="/" class="nav-item">Accueil</router-link>
      <router-link to="/dashboard" class="nav-item">Tableau de bord</router-link>
      <router-link to="/settings" class="nav-item">Paramètres</router-link>
      <router-link to="/profile" class="nav-item">Profil</router-link>
    </div>
    <div class="navbar-end">
      <button class="theme-toggle" @click="toggleTheme">
        <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
      </button>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'Navbar',
  setup() {
    const isDarkMode = ref(true)

    onMounted(() => {
      const savedTheme = localStorage.getItem('theme')
      isDarkMode.value = savedTheme ? savedTheme === 'dark' : true
    })

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value
      localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark-theme')
    }

    return {
      isDarkMode,
      toggleTheme
    }
  }
}
</script>

<style scoped>
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
}

.navbar-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
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

@media (max-width: 768px) {
  .navbar {
    width: 100%;
    height: auto;
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
    flex: 1;
    justify-content: center;
  }

  .navbar-end {
    margin-top: 0;
    margin-left: 1rem;
  }
}
</style> 