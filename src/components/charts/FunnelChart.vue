<template>
  <BaseCard class="funnel-chart">
    <div class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
      <p class="chart-description">{{ description }}</p>
    </div>
    
    <div class="funnel-container">
      <div
        v-for="(stage, index) in funnelStages"
        :key="stage.label"
        class="funnel-stage"
        :style="{ '--stage-width': stage.width + '%', '--stage-color': stage.color }"
      >
        <div class="stage-bar">
          <div class="stage-fill"></div>
        </div>
        
        <div class="stage-content">
          <div class="stage-label">{{ stage.label }}</div>
          <div class="stage-value">{{ stage.value.toLocaleString() }}</div>
          <div v-if="index > 0" class="stage-conversion">
            {{ calculateConversion(index) }}% conversion
          </div>
        </div>
      </div>
    </div>
    
    <div class="funnel-summary">
      <div class="summary-item">
        <span class="summary-label">Overall Conversion:</span>
        <span class="summary-value">{{ overallConversion }}%</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Funnel Health:</span>
        <span class="summary-value" :class="funnelHealthClass">{{ funnelHealth }}</span>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '../common/BaseCard.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Innovation Pipeline Funnel'
  },
  description: {
    type: String,
    default: 'Track ideas from submission to scaled deployment'
  },
  data: {
    type: Array,
    required: true
  },
  labels: {
    type: Array,
    required: true
  },
  colors: {
    type: Array,
    default: () => ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
  }
})

const funnelStages = computed(() => {
  const maxValue = Math.max(...props.data)
  
  return props.labels.map((label, index) => ({
    label,
    value: props.data[index],
    width: (props.data[index] / maxValue) * 100,
    color: props.colors[index] || '#6B7280'
  }))
})

const calculateConversion = (index) => {
  if (index === 0) return 100
  const current = props.data[index]
  const previous = props.data[index - 1]
  return Math.round((current / previous) * 100)
}

const overallConversion = computed(() => {
  if (props.data.length === 0) return 0
  const first = props.data[0]
  const last = props.data[props.data.length - 1]
  return Math.round((last / first) * 100)
})

const funnelHealth = computed(() => {
  const conversion = overallConversion.value
  if (conversion >= 15) return 'Excellent'
  if (conversion >= 10) return 'Good'
  if (conversion >= 5) return 'Fair'
  return 'Needs Improvement'
})

const funnelHealthClass = computed(() => ({
  'health-excellent': funnelHealth.value === 'Excellent',
  'health-good': funnelHealth.value === 'Good',
  'health-fair': funnelHealth.value === 'Fair',
  'health-poor': funnelHealth.value === 'Needs Improvement'
}))
</script>

<style scoped>
.funnel-chart {
  width: 100%;
}

.chart-header {
  margin-bottom: 24px;
}

.chart-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.chart-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.funnel-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.funnel-stage {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stage-bar {
  flex: 1;
  height: 48px;
  background: #f3f4f6;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.stage-fill {
  height: 100%;
  width: var(--stage-width);
  background: var(--stage-color);
  border-radius: 8px;
  transition: width 0.6s ease;
  position: relative;
}

.stage-fill::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 0 8px 8px 0;
}

.stage-content {
  min-width: 160px;
  text-align: right;
}

.stage-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.stage-value {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2px;
}

.stage-conversion {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.funnel-summary {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 18px;
  font-weight: 700;
}

.health-excellent {
  color: #059669;
}

.health-good {
  color: #0d9488;
}

.health-fair {
  color: #d97706;
}

.health-poor {
  color: #dc2626;
}

@media (prefers-color-scheme: dark) {
  .chart-title {
    color: #f9fafb;
  }
  
  .chart-description {
    color: #d1d5db;
  }
  
  .stage-bar {
    background: #374151;
  }
  
  .stage-label {
    color: #d1d5db;
  }
  
  .stage-value {
    color: #f9fafb;
  }
  
  .stage-conversion {
    color: #9ca3af;
  }
  
  .funnel-summary {
    background: #1f2937;
    border-color: #374151;
  }
  
  .summary-label {
    color: #9ca3af;
  }
}

@media (max-width: 768px) {
  .funnel-stage {
    flex-direction: column;
    gap: 8px;
  }
  
  .stage-content {
    width: 100%;
    text-align: center;
    min-width: auto;
  }
  
  .funnel-summary {
    flex-direction: column;
    gap: 16px;
  }
  
  .summary-item {
    text-align: center;
  }
}
</style>