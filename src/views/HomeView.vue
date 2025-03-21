<template>
  <div class="home">
    <div class="hero">
      <h1>Bienvenue sur TranscriptFlow</h1>
      <p class="subtitle">La solution complète pour la transcription et la conversion texte-audio</p>
    </div>
    <div class="features">
      <div class="card feature">
        <i class="fas fa-file-audio feature-icon"></i>
        <h3>Transcription Audio</h3>
        <p>Convertissez vos fichiers audio en texte avec une précision exceptionnelle</p>
        <router-link to="/transcribe" class="btn btn-primary">Commencer</router-link>
      </div>
      <div class="card feature">
        <i class="fas fa-volume-up feature-icon"></i>
        <h3>Texte vers Audio</h3>
        <p>Transformez votre texte en audio naturel avec des voix de qualité</p>
        <router-link to="/text-to-audio" class="btn btn-primary">Essayer</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  text-align: center;
  margin-bottom: 4rem;
}

.hero h1 {
  font-size: 2.5rem;
  color: var(--accent-primary);
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature {
  text-align: center;
  padding: 2rem;
}

.feature-icon {
  font-size: 3rem;
  color: var(--accent-primary);
  margin-bottom: 1.5rem;
}

.feature h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.feature p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .home {
    padding: 1rem;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .features {
    grid-template-columns: 1fr;
  }
}
</style> 