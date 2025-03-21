<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">Tableau de bord</h1>
    
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-file-audio"></i></div>
        <div class="stat-content">
          <h3>256</h3>
          <p>Transcriptions</p>
        </div>
        <div class="stat-progress">
          <div class="progress-bar" style="width: 75%"></div>
        </div>
        <div class="stat-footer">
          <span class="trend up"><i class="fas fa-arrow-up"></i> 12%</span>
          <span class="period">ce mois</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-clock"></i></div>
        <div class="stat-content">
          <h3>42h</h3>
          <p>Temps économisé</p>
        </div>
        <div class="stat-progress">
          <div class="progress-bar" style="width: 85%"></div>
        </div>
        <div class="stat-footer">
          <span class="trend up"><i class="fas fa-arrow-up"></i> 18%</span>
          <span class="period">ce mois</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-language"></i></div>
        <div class="stat-content">
          <h3>12</h3>
          <p>Langues utilisées</p>
        </div>
        <div class="stat-progress">
          <div class="progress-bar" style="width: 60%"></div>
        </div>
        <div class="stat-footer">
          <span class="trend up"><i class="fas fa-arrow-up"></i> 5%</span>
          <span class="period">ce mois</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-user-friends"></i></div>
        <div class="stat-content">
          <h3>8</h3>
          <p>Projets actifs</p>
        </div>
        <div class="stat-progress">
          <div class="progress-bar" style="width: 40%"></div>
        </div>
        <div class="stat-footer">
          <span class="trend down"><i class="fas fa-arrow-down"></i> 3%</span>
          <span class="period">ce mois</span>
        </div>
      </div>
    </div>
    
    <div class="charts-section">
      <div class="chart-container">
        <div class="chart-header">
          <h2>Activité de transcription</h2>
          <div class="chart-actions">
            <select v-model="timeframeActivity">
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </select>
          </div>
        </div>
        <canvas ref="activityChart"></canvas>
      </div>
      
      <div class="chart-container">
        <div class="chart-header">
          <h2>Distribution des langues</h2>
          <div class="chart-actions">
            <button class="chart-action-btn">
              <i class="fas fa-download"></i>
            </button>
          </div>
        </div>
        <canvas ref="languageChart"></canvas>
      </div>
    </div>
    
    <div class="recent-activity">
      <h2>Activité récente</h2>
      <div class="activity-list">
        <div class="activity-item">
          <div class="activity-icon"><i class="fas fa-file-audio"></i></div>
          <div class="activity-content">
            <h4>Transcription terminée</h4>
            <p>Interview_projet_A.mp3 - 15 minutes</p>
          </div>
          <div class="activity-time">Il y a 2 heures</div>
        </div>
        
        <div class="activity-item">
          <div class="activity-icon"><i class="fab fa-youtube"></i></div>
          <div class="activity-content">
            <h4>Vidéo YouTube analysée</h4>
            <p>Comment optimiser son workflow - 20 minutes</p>
          </div>
          <div class="activity-time">Il y a 5 heures</div>
        </div>
        
        <div class="activity-item">
          <div class="activity-icon"><i class="fas fa-language"></i></div>
          <div class="activity-content">
            <h4>Traduction terminée</h4>
            <p>Français → Anglais - 8 pages</p>
          </div>
          <div class="activity-time">Hier</div>
        </div>
        
        <div class="activity-item">
          <div class="activity-icon"><i class="fas fa-cog"></i></div>
          <div class="activity-content">
            <h4>Paramètres API mis à jour</h4>
            <p>Nouvelle clé API configurée</p>
          </div>
          <div class="activity-time">Il y a 2 jours</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'DashboardView',
  setup() {
    const activityChart = ref(null);
    const languageChart = ref(null);
    const timeframeActivity = ref('month');
    
    onMounted(() => {
      // Graphique d'activité de transcription
      const activityCtx = activityChart.value.getContext('2d');
      new Chart(activityCtx, {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
          datasets: [{
            label: 'Transcriptions',
            data: [5, 10, 8, 15, 12, 6, 9],
            borderColor: '#FF6B00',
            backgroundColor: 'rgba(255, 107, 0, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: true,
                color: 'rgba(200, 200, 200, 0.2)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
      
      // Graphique de distribution des langues
      const languageCtx = languageChart.value.getContext('2d');
      new Chart(languageCtx, {
        type: 'doughnut',
        data: {
          labels: ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Autres'],
          datasets: [{
            data: [45, 30, 15, 5, 5],
            backgroundColor: [
              '#FF6B00',
              '#FF8C00',
              '#FFA500',
              '#FFD700',
              '#FFE4B5'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right'
            }
          },
          cutout: '70%'
        }
      });
    });
    
    return {
      activityChart,
      languageChart,
      timeframeActivity
    };
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--text-color);
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.stat-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  color: var(--primary-color);
  opacity: 0.8;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: var(--text-color);
}

.stat-content p {
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.9rem;
}

.stat-progress {
  margin-top: 1rem;
  height: 6px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 3px;
}

.stat-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.trend {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.trend.up {
  color: #4CAF50;
}

.trend.down {
  color: #F44336;
}

.period {
  color: var(--text-color);
  opacity: 0.7;
}

.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-container {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  height: 350px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-header h2 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
}

.chart-actions select,
.chart-action-btn {
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: transparent;
  color: var(--text-color);
  font-size: 0.9rem;
  cursor: pointer;
}

canvas {
  flex: 1;
}

.recent-activity {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.recent-activity h2 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1.5rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.03);
  transition: background-color 0.2s;
}

.activity-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.activity-content {
  flex: 1;
}

.activity-content h4 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.3rem;
  color: var(--text-color);
}

.activity-content p {
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.7;
}

.activity-time {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.5;
}

@media (max-width: 992px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .chart-container {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .stats-overview {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 576px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 1rem;
  }
}
</style> 