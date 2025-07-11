<template>
  <div class="partnership-analysis">
    <div class="analysis-header">
      <h3 class="analysis-title">Partnership Analysis</h3>
    </div>
    
    <div class="current-partnership">
      <div class="partnership-title">Current Partnership</div>
      <div class="partnership-details">
        <div class="partnership-stat">
          <div class="stat-value">{{ partnerships.current.runs }}</div>
          <div class="stat-label">Runs</div>
        </div>
        <div class="partnership-stat">
          <div class="stat-value">{{ partnerships.current.balls }}</div>
          <div class="stat-label">Balls</div>
        </div>
        <div class="partnership-stat">
          <div class="stat-value">{{ partnerships.current.runRate.toFixed(1) }}</div>
          <div class="stat-label">Run Rate</div>
        </div>
      </div>
    </div>
    
    <div class="partnership-history">
      <div class="history-title">Partnership History</div>
      <div class="history-chart">
        <div
          v-for="(partnership, index) in partnerships.history"
          :key="index"
          class="partnership-bar"
          :style="{ height: (partnership.runs / maxRuns) * 100 + '%' }"
        >
          <div class="bar-value">{{ partnership.runs }}</div>
          <div class="bar-label">{{ partnership.wicket }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  partnerships: {
    type: Object,
    required: true
  }
})

const maxRuns = computed(() => 
  Math.max(...props.partnerships.history.map(p => p.runs))
)
</script>

<style scoped>
.partnership-analysis {
  background: #1e293b;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #374151;
}

.analysis-header {
  margin-bottom: 24px;
}

.analysis-title {
  font-size: 18px;
  font-weight: 700;
  color: #e5e7eb;
  margin: 0;
}

.current-partnership {
  background: rgba(16, 185, 129, 0.1);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.partnership-title {
  font-size: 14px;
  font-weight: 600;
  color: #10b981;
  margin-bottom: 16px;
  text-align: center;
}

.partnership-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.partnership-stat {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #10b981;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
}

.history-title {
  font-size: 14px;
  font-weight: 600;
  color: #e5e7eb;
  margin-bottom: 16px;
}

.history-chart {
  display: flex;
  align-items: end;
  gap: 8px;
  height: 120px;
}

.partnership-bar {
  flex: 1;
  background: linear-gradient(to top, #10b981, #059669);
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
}

.bar-value {
  font-size: 10px;
  font-weight: 700;
  color: white;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

.bar-label {
  font-size: 10px;
  color: white;
  margin-top: auto;
}

@media (max-width: 768px) {
  .partnership-details {
    grid-template-columns: 1fr;
  }
  
  .partnership-analysis {
    padding: 16px;
  }
}
</style>