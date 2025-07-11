<template>
  <div class="bowling-stats-card">
    <div class="card-header">
      <h3 class="card-title">{{ stats.title }}</h3>
      <div class="card-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#ef4444" stroke-width="2" fill="none"/>
          <circle cx="12" cy="12" r="3" fill="#ef4444"/>
          <path d="M12 2v4m0 12v4m10-10h-4m-12 0H2" stroke="#ef4444" stroke-width="2"/>
        </svg>
      </div>
    </div>
    
    <div class="stats-grid">
      <div 
        v-for="metric in stats.metrics"
        :key="metric.label"
        class="stat-item"
      >
        <div class="stat-value">{{ metric.value }}</div>
        <div class="stat-label">{{ metric.label }}</div>
        <div v-if="metric.player" class="stat-player">{{ metric.player }}</div>
        <div v-if="metric.description" class="stat-description">{{ metric.description }}</div>
      </div>
    </div>
    
    <!-- Bowling Analysis -->
    <div class="bowling-analysis">
      <div class="analysis-header">
        <h4>Bowling Analysis</h4>
      </div>
      <div class="analysis-grid">
        <div class="analysis-item">
          <div class="analysis-label">Pressure Index</div>
          <div class="analysis-bar">
            <div 
              class="analysis-fill pressure"
              :style="{ width: pressureIndex + '%' }"
            ></div>
          </div>
          <div class="analysis-value">{{ pressureIndex }}%</div>
        </div>
        <div class="analysis-item">
          <div class="analysis-label">Control Rate</div>
          <div class="analysis-bar">
            <div 
              class="analysis-fill control"
              :style="{ width: controlRate + '%' }"
            ></div>
          </div>
          <div class="analysis-value">{{ controlRate }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stats: {
    type: Object,
    required: true
  }
})

const pressureIndex = computed(() => {
  // Calculate pressure based on economy rate
  const economyRate = parseFloat(props.stats.metrics.find(m => m.label === 'Economy Rate')?.value || '0')
  return Math.max(0, Math.min(100, (6 - economyRate) * 20))
})

const controlRate = computed(() => {
  // Calculate control rate based on wickets and economy
  const wickets = parseInt(props.stats.metrics.find(m => m.label === 'Wickets')?.value || '0')
  const economyRate = parseFloat(props.stats.metrics.find(m => m.label === 'Economy Rate')?.value || '0')
  return Math.min(100, (wickets * 10) + (6 - economyRate) * 10)
})
</script>

<style scoped>
.bowling-stats-card {
  background: linear-gradient(135deg, #1e293b 0%, #374151 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #4b5563;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.bowling-stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #e5e7eb;
  margin: 0;
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 50%;
  border: 2px solid #ef4444;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.05);
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #ef4444;
  margin-bottom: 8px;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  font-weight: 600;
  color: #e5e7eb;
  margin-bottom: 4px;
}

.stat-player {
  font-size: 12px;
  color: #ef4444;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-description {
  font-size: 11px;
  color: #94a3b8;
  font-style: italic;
}

.bowling-analysis {
  background: rgba(55, 65, 81, 0.5);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #4b5563;
}

.analysis-header {
  margin-bottom: 16px;
}

.analysis-header h4 {
  font-size: 14px;
  font-weight: 600;
  color: #e5e7eb;
  margin: 0;
  text-align: center;
}

.analysis-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.analysis-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.analysis-label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  min-width: 80px;
}

.analysis-bar {
  flex: 1;
  height: 6px;
  background: #374151;
  border-radius: 3px;
  overflow: hidden;
}

.analysis-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s ease;
}

.analysis-fill.pressure {
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

.analysis-fill.control {
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
}

.analysis-value {
  font-size: 12px;
  font-weight: 600;
  color: #e5e7eb;
  min-width: 35px;
  text-align: right;
}

@media (max-width: 768px) {
  .bowling-stats-card {
    padding: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .card-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .analysis-item {
    flex-direction: column;
    gap: 8px;
  }
  
  .analysis-label {
    min-width: auto;
    text-align: center;
  }
  
  .analysis-value {
    min-width: auto;
    text-align: center;
  }
}
</style>