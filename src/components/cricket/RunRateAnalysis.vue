<template>
  <div class="run-rate-analysis">
    <div class="analysis-header">
      <h3 class="analysis-title">{{ runRates.title }}</h3>
    </div>
    
    <div class="current-rate">
      <div class="rate-display">
        <span class="rate-value">{{ runRates.currentRR.toFixed(2) }}</span>
        <span class="rate-label">Current RR</span>
      </div>
    </div>
    
    <div class="over-analysis">
      <div class="analysis-title-small">Over-by-Over Analysis</div>
      <div class="over-chart">
        <div
          v-for="(over, index) in runRates.overAnalysis"
          :key="index"
          class="over-item"
        >
          <div class="over-label">{{ over.over }}</div>
          <div class="over-bar">
            <div
              class="over-fill"
              :style="{ width: (over.rr / maxRR) * 100 + '%' }"
            ></div>
          </div>
          <div class="over-stats">
            <div class="runs">{{ over.runs }}r</div>
            <div class="rr">{{ over.rr.toFixed(1) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  runRates: {
    type: Object,
    required: true
  }
})

const maxRR = computed(() => 
  Math.max(...props.runRates.overAnalysis.map(o => o.rr))
)
</script>

<style scoped>
.run-rate-analysis {
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

.current-rate {
  background: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  text-align: center;
}

.rate-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.rate-value {
  font-size: 36px;
  font-weight: 800;
  color: #3b82f6;
}

.rate-label {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 600;
}

.analysis-title-small {
  font-size: 14px;
  font-weight: 600;
  color: #e5e7eb;
  margin-bottom: 16px;
}

.over-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.over-item {
  display: grid;
  grid-template-columns: 80px 1fr 80px;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.over-label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
}

.over-bar {
  height: 8px;
  background: #374151;
  border-radius: 4px;
  overflow: hidden;
}

.over-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 4px;
  transition: width 0.8s ease;
}

.over-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.runs {
  font-size: 12px;
  font-weight: 600;
  color: #10b981;
}

.rr {
  font-size: 12px;
  font-weight: 600;
  color: #3b82f6;
}

@media (max-width: 768px) {
  .run-rate-analysis {
    padding: 16px;
  }
  
  .over-item {
    grid-template-columns: 1fr;
    gap: 8px;
    text-align: center;
  }
  
  .over-stats {
    justify-content: center;
    gap: 16px;
  }
}
</style>