<template>
  <BaseCard>
    <div class="executive-metric-card">
      <div class="metric-header">
        <h3 class="metric-label">{{ metric.label }}</h3>
        <div v-if="metric.status" class="status-indicator" :class="statusClass">
          {{ metric.status }}
        </div>
      </div>
      
      <div class="metric-main">
        <div class="metric-value" :class="valueTypeClass">
          {{ formattedValue }}
        </div>
        <div v-if="metric.unit" class="metric-unit">{{ metric.unit }}</div>
      </div>
      
      <div v-if="showTrend" class="metric-trend" :class="trendClass">
        <span class="trend-arrow">{{ trendIcon }}</span>
        <span class="trend-text">{{ trendText }}</span>
      </div>
      
      <div v-if="metric.subtitle" class="metric-subtitle">
        {{ metric.subtitle }}
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '../common/BaseCard.vue'

const props = defineProps({
  metric: {
    type: Object,
    required: true
  }
})

const formattedValue = computed(() => {
  const { value, type, format } = props.metric
  
  if (format === 'percentage') {
    return `${value}%`
  }
  if (format === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value)
  }
  if (format === 'number') {
    return new Intl.NumberFormat('en-US').format(value)
  }
  if (format === 'decimal') {
    return parseFloat(value).toFixed(2)
  }
  
  return value
})

const valueTypeClass = computed(() => ({
  'value-currency': props.metric.format === 'currency',
  'value-percentage': props.metric.format === 'percentage',
  'value-large': props.metric.size === 'large'
}))

const statusClass = computed(() => ({
  'status-good': props.metric.status === 'Good' || props.metric.status === 'On Track',
  'status-warning': props.metric.status === 'Warning' || props.metric.status === 'At Risk',
  'status-critical': props.metric.status === 'Critical' || props.metric.status === 'Behind'
}))

const showTrend = computed(() => 
  props.metric.trend && (props.metric.change || props.metric.change === 0)
)

const trendClass = computed(() => ({
  'trend-up': props.metric.trend === 'up',
  'trend-down': props.metric.trend === 'down',
  'trend-neutral': props.metric.trend === 'neutral'
}))

const trendIcon = computed(() => {
  if (props.metric.trend === 'up') return '↗'
  if (props.metric.trend === 'down') return '↘'
  return '→'
})

const trendText = computed(() => {
  const change = Math.abs(props.metric.change || 0)
  const period = props.metric.period || 'vs last period'
  return `${change}% ${period}`
})
</script>

<style scoped>
.executive-metric-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 120px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.metric-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  font-weight: 600;
  flex: 1;
  line-height: 1.3;
}

.status-indicator {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-good {
  background: #dcfce7;
  color: #166534;
}

.status-warning {
  background: #fef3c7;
  color: #92400e;
}

.status-critical {
  background: #fee2e2;
  color: #991b1b;
}

.metric-main {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.value-large {
  font-size: 36px;
}

.metric-unit {
  font-size: 16px;
  color: #6b7280;
  font-weight: 500;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
}

.trend-arrow {
  font-size: 16px;
}

.trend-up {
  color: #10b981;
}

.trend-down {
  color: #ef4444;
}

.trend-neutral {
  color: #6b7280;
}

.metric-subtitle {
  font-size: 12px;
  color: #9ca3af;
  margin-top: auto;
}

@media (prefers-color-scheme: dark) {
  .metric-label {
    color: #9ca3af;
  }
  
  .metric-value {
    color: #f9fafb;
  }
  
  .metric-unit {
    color: #9ca3af;
  }
  
  .status-good {
    background: #166534;
    color: #dcfce7;
  }
  
  .status-warning {
    background: #92400e;
    color: #fef3c7;
  }
  
  .status-critical {
    background: #991b1b;
    color: #fee2e2;
  }
}
</style>