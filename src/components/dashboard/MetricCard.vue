<template>
  <BaseCard>
    <div class="metric-card">
      <h3 class="metric-label">{{ metric.label }}</h3>
      <div class="metric-value">{{ metric.value }}</div>
      <div class="metric-change" :class="changeClass">
        <span class="arrow">{{ metric.trend === 'up' ? '↑' : '↓' }}</span>
        {{ Math.abs(metric.change) }}%
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

const changeClass = computed(() => ({
  'trend-up': props.metric.trend === 'up',
  'trend-down': props.metric.trend === 'down'
}))
</script>

<style scoped>
.metric-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.metric-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
}

.arrow {
  font-size: 16px;
}

.trend-up {
  color: #10b981;
}

.trend-down {
  color: #ef4444;
}

@media (prefers-color-scheme: dark) {
  .metric-label {
    color: #9ca3af;
  }
  
  .metric-value {
    color: #f9fafb;
  }
}
</style>