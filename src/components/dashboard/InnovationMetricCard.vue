<template>
  <BaseCard class="innovation-metric-card">
    <div class="metric-card">
      <div class="metric-header">
        <h3 class="metric-label">{{ metric.label }}</h3>
        <div v-if="metric.category" class="metric-category">{{ metric.category }}</div>
      </div>
      
      <div class="metric-value">
        {{ formattedValue }}
      </div>
      
      <div class="metric-footer">
        <div class="metric-change" :class="changeClass">
          <span class="arrow">{{ trendIcon }}</span>
          {{ metric.change }}
        </div>
        
        <div v-if="showBenchmark" class="metric-benchmark">
          <span class="benchmark-label">vs Industry:</span>
          <span class="benchmark-value" :class="benchmarkClass">{{ benchmarkComparison }}</span>
        </div>
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
  },
  showBenchmark: {
    type: Boolean,
    default: false
  }
})

const formattedValue = computed(() => {
  const { value, format, unit } = props.metric
  
  switch (format) {
    case 'currency':
      return `$${value}${unit || ''}`
    case 'percentage':
      return `${value}%`
    case 'ratio':
      return `${value}${unit || ''}`
    case 'decimal':
      return value.toFixed(1)
    case 'score':
      return `${value}/100`
    case 'number':
    default:
      return value.toLocaleString()
  }
})

const trendIcon = computed(() => {
  switch (props.metric.trend) {
    case 'up':
      return '↗'
    case 'down':
      return '↘'
    case 'neutral':
    default:
      return '→'
  }
})

const changeClass = computed(() => ({
  'trend-up': props.metric.trend === 'up',
  'trend-down': props.metric.trend === 'down',
  'trend-neutral': props.metric.trend === 'neutral'
}))

const benchmarkComparison = computed(() => {
  // Mock benchmark data - in real implementation this would come from props or service
  const benchmarks = {
    'Innovation Revenue': '+23%',
    'Innovation ROI': '+18%',
    'Software Attach Rate': '+12%',
    'Market Share Growth': '+8%'
  }
  
  return benchmarks[props.metric.label] || '+5%'
})

const benchmarkClass = computed(() => ({
  'benchmark-positive': benchmarkComparison.value.startsWith('+'),
  'benchmark-negative': benchmarkComparison.value.startsWith('-')
}))
</script>

<style scoped>
.innovation-metric-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.innovation-metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.metric-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px;
}

.metric-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  font-weight: 600;
  line-height: 1.2;
}

.metric-category {
  font-size: 11px;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 36px;
  font-weight: 800;
  color: #111827;
  line-height: 1;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.metric-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-change {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  align-self: flex-start;
}

.arrow {
  font-size: 14px;
  line-height: 1;
}

.trend-up {
  color: #059669;
  background: rgba(16, 185, 129, 0.1);
}

.trend-down {
  color: #dc2626;
  background: rgba(239, 68, 68, 0.1);
}

.trend-neutral {
  color: #6b7280;
  background: rgba(107, 114, 128, 0.1);
}

.metric-benchmark {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.benchmark-label {
  color: #9ca3af;
  font-weight: 500;
}

.benchmark-value {
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

.benchmark-positive {
  color: #059669;
  background: rgba(16, 185, 129, 0.1);
}

.benchmark-negative {
  color: #dc2626;
  background: rgba(239, 68, 68, 0.1);
}

/* Special formatting for specific metric types */
.metric-card:has(.metric-label:contains('ROI')) .metric-value {
  color: #059669;
}

.metric-card:has(.metric-label:contains('Revenue')) .metric-value {
  color: #2563eb;
}

.metric-card:has(.metric-label:contains('Time')) .metric-value {
  color: #7c3aed;
}

@media (prefers-color-scheme: dark) {
  .metric-label {
    color: #d1d5db;
  }
  
  .metric-category {
    color: #9ca3af;
  }
  
  .metric-value {
    color: #f9fafb;
  }
  
  .benchmark-label {
    color: #9ca3af;
  }
  
  .trend-up {
    color: #34d399;
    background: rgba(52, 211, 153, 0.1);
  }
  
  .trend-down {
    color: #f87171;
    background: rgba(248, 113, 113, 0.1);
  }
  
  .trend-neutral {
    color: #9ca3af;
    background: rgba(156, 163, 175, 0.1);
  }
}

@media (max-width: 768px) {
  .metric-value {
    font-size: 28px;
  }
  
  .metric-change {
    font-size: 12px;
  }
  
  .metric-benchmark {
    font-size: 11px;
  }
}
</style>