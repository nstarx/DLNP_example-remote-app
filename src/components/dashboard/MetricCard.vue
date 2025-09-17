<template>
  <BaseCard>
    <div class="metric-card">
      <div class="metric-header">
        <h3 class="metric-label">{{ metric.label }}</h3>
        <div class="metric-trend" :class="trendClass" v-if="metric.trend">
          <span class="trend-arrow">{{ trendIcon }}</span>
          <span class="trend-value">{{ metric.trend.percentage }}%</span>
        </div>
      </div>
      
      <div class="metric-value">{{ metric.value }}</div>
      
      <div class="metric-footer" v-if="metric.description || metric.target || metric.comparison">
        <div class="metric-description" v-if="metric.description">
          {{ metric.description }}
        </div>
        <div class="metric-target" v-if="metric.target">
          Target: {{ metric.target }}
        </div>
        <div class="metric-comparison" v-if="metric.comparison">
          {{ metric.comparison }}
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
  }
})

const trendClass = computed(() => {
  if (!props.metric.trend) return ''
  return `trend-${props.metric.trend.direction}`
})

const trendIcon = computed(() => {
  if (!props.metric.trend) return ''
  switch (props.metric.trend.direction) {
    case 'up':
      return '↗'
    case 'down':
      return '↘'
    default:
      return '→'
  }
})
</script>

<style scoped>
.metric-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 140px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.metric-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
  line-height: 1.4;
  flex: 1;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}

.trend-up {
  background: #dcfce7;
  color: #166534;
}

.trend-down {
  background: #fef2f2;
  color: #dc2626;
}

.trend-stable {
  background: #f1f5f9;
  color: #475569;
}

.trend-arrow {
  font-size: 14px;
  line-height: 1;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  line-height: 1.1;
  margin: 4px 0;
}

.metric-footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-description {
  font-size: 12px;
  color: #64748b;
  line-height: 1.3;
}

.metric-target {
  font-size: 12px;
  color: #3b82f6;
  font-weight: 600;
}

.metric-comparison {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .metric-card {
    min-height: 120px;
  }
  
  .metric-value {
    font-size: 24px;
  }
  
  .metric-header {
    flex-direction: column;
    gap: 6px;
  }
  
  .metric-trend {
    align-self: flex-end;
  }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .metric-label {
    color: #9ca3af;
  }
  
  .metric-value {
    color: #f9fafb;
  }
  
  .metric-description,
  .metric-comparison {
    color: #9ca3af;
  }
  
  .metric-target {
    color: #60a5fa;
  }
  
  .trend-up {
    background: #064e3b;
    color: #6ee7b7;
  }
  
  .trend-down {
    background: #7f1d1d;
    color: #fca5a5;
  }
  
  .trend-stable {
    background: #334155;
    color: #cbd5e1;
  }
}
</style>