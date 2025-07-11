<template>
  <div class="batting-stats-card">
    <div class="card-header">
      <h3 class="card-title">{{ stats.title }}</h3>
      <div class="card-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L14.09 8.26L22 9L16 14.74L17.18 22.02L12 18.74L6.82 22.02L8 14.74L2 9L9.91 8.26L12 2Z" fill="#10b981"/>
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
        <div v-if="metric.players" class="stat-players">{{ metric.players }}</div>
        <div v-if="metric.description" class="stat-description">{{ metric.description }}</div>
      </div>
    </div>
    
    <!-- Performance Indicator -->
    <div class="performance-indicator">
      <div class="indicator-label">Innings Performance</div>
      <div class="indicator-bar">
        <div 
          class="indicator-fill"
          :style="{ width: performancePercent + '%' }"
        ></div>
      </div>
      <div class="indicator-text">{{ performanceText }}</div>
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

const performancePercent = computed(() => {
  // Calculate performance based on strike rate and runs scored
  const strikeRate = parseFloat(props.stats.metrics.find(m => m.label === 'Strike Rate')?.value || '0')
  return Math.min(100, (strikeRate / 100) * 100)
})

const performanceText = computed(() => {
  const percent = performancePercent.value
  if (percent >= 80) return 'Excellent'
  if (percent >= 60) return 'Good'
  if (percent >= 40) return 'Average'
  return 'Below Par'
})
</script>

<style scoped>
.batting-stats-card {
  background: linear-gradient(135deg, #1e293b 0%, #374151 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #4b5563;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.batting-stats-card:hover {
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
  background: rgba(16, 185, 129, 0.1);
  border-radius: 50%;
  border: 2px solid #10b981;
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
  background: rgba(16, 185, 129, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(16, 185, 129, 0.2);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(16, 185, 129, 0.2);
  transform: scale(1.05);
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #10b981;
  margin-bottom: 8px;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  font-weight: 600;
  color: #e5e7eb;
  margin-bottom: 4px;
}

.stat-player,
.stat-players {
  font-size: 12px;
  color: #10b981;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-description {
  font-size: 11px;
  color: #94a3b8;
  font-style: italic;
}

.performance-indicator {
  background: rgba(55, 65, 81, 0.5);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #4b5563;
}

.indicator-label {
  font-size: 14px;
  font-weight: 600;
  color: #e5e7eb;
  margin-bottom: 8px;
  text-align: center;
}

.indicator-bar {
  width: 100%;
  height: 8px;
  background: #374151;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.indicator-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  border-radius: 4px;
  transition: width 0.8s ease;
}

.indicator-text {
  font-size: 12px;
  font-weight: 600;
  color: #10b981;
  text-align: center;
}

@media (max-width: 768px) {
  .batting-stats-card {
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
}
</style>