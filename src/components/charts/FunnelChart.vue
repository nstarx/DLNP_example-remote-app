<template>
  <div class="funnel-chart">
    <h3 class="chart-title">{{ title }}</h3>
    <div class="funnel-container">
      <div
        v-for="(stage, index) in data.stages"
        :key="stage"
        class="funnel-stage"
        :style="getFunnelStageStyle(index)"
      >
        <div class="funnel-content">
          <div class="stage-label">{{ stage }}</div>
          <div class="stage-value">{{ data.values[index] }}</div>
          <div class="stage-percentage" v-if="index > 0">
            {{ getConversionRate(index) }}% conversion
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: true,
    validator: (data) => {
      return data.stages && data.values && data.stages.length === data.values.length
    }
  }
})

const getFunnelStageStyle = (index) => {
  const maxValue = Math.max(...props.data.values)
  const currentValue = props.data.values[index]
  const widthPercentage = (currentValue / maxValue) * 100
  const color = props.data.colors[index] || '#3b82f6'
  
  return {
    '--stage-width': `${widthPercentage}%`,
    '--stage-color': color,
    '--stage-opacity': 1 - (index * 0.1)
  }
}

const getConversionRate = (index) => {
  if (index === 0) return 100
  const previousValue = props.data.values[index - 1]
  const currentValue = props.data.values[index]
  return Math.round((currentValue / previousValue) * 100)
}
</script>

<style scoped>
.funnel-chart {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: 100%;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 24px 0;
  text-align: center;
}

.funnel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  height: calc(100% - 60px);
  justify-content: center;
}

.funnel-stage {
  width: var(--stage-width);
  max-width: 100%;
  min-width: 200px;
  height: 60px;
  background: var(--stage-color);
  opacity: var(--stage-opacity);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
}

.funnel-stage:hover {
  opacity: 1;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.funnel-content {
  text-align: center;
  color: white;
}

.stage-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
}

.stage-value {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 2px;
}

.stage-percentage {
  font-size: 11px;
  opacity: 0.9;
}

/* Responsive Design */
@media (max-width: 768px) {
  .funnel-chart {
    padding: 16px;
  }
  
  .funnel-stage {
    min-width: 150px;
    height: 50px;
  }
  
  .stage-label {
    font-size: 12px;
  }
  
  .stage-value {
    font-size: 16px;
  }
  
  .stage-percentage {
    font-size: 10px;
  }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .funnel-chart {
    background: #334155;
  }
  
  .chart-title {
    color: #f1f5f9;
  }
}
</style>