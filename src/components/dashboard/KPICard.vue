<template>
  <div class="kpi-card" :class="`kpi-${kpi.color}`">
    <div class="kpi-header">
      <div class="kpi-icon">{{ kpi.icon }}</div>
      <div class="kpi-trend" :class="`trend-${kpi.trend.direction}`">
        <span class="trend-arrow">{{ trendIcon }}</span>
        <span class="trend-value">{{ kpi.trend.percentage }}%</span>
      </div>
    </div>
    
    <div class="kpi-content">
      <div class="kpi-value">{{ kpi.value }}</div>
      <div class="kpi-label">{{ kpi.label }}</div>
    </div>

    <div class="kpi-footer" v-if="kpi.target || kpi.comparison">
      <div v-if="kpi.target" class="kpi-target">
        Target: {{ kpi.target }}
      </div>
      <div v-if="kpi.comparison" class="kpi-comparison">
        {{ kpi.comparison }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  kpi: {
    type: Object,
    required: true
  }
})

const trendIcon = computed(() => {
  switch (props.kpi.trend.direction) {
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
.kpi-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, var(--kpi-color) 50%, transparent 100%);
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

/* Color Variants */
.kpi-blue {
  --kpi-color: #3b82f6;
  border-left-color: #3b82f6;
}

.kpi-emerald {
  --kpi-color: #10b981;
  border-left-color: #10b981;
}

.kpi-purple {
  --kpi-color: #8b5cf6;
  border-left-color: #8b5cf6;
}

.kpi-orange {
  --kpi-color: #f59e0b;
  border-left-color: #f59e0b;
}

.kpi-red {
  --kpi-color: #ef4444;
  border-left-color: #ef4444;
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.kpi-icon {
  font-size: 32px;
  opacity: 0.9;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
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
  font-size: 16px;
  line-height: 1;
}

.kpi-content {
  margin-bottom: 12px;
}

.kpi-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
  margin-bottom: 4px;
}

.kpi-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  line-height: 1.4;
}

.kpi-footer {
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.kpi-target,
.kpi-comparison {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.kpi-target {
  color: var(--kpi-color);
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .kpi-card {
    padding: 16px;
  }
  
  .kpi-icon {
    font-size: 24px;
  }
  
  .kpi-value {
    font-size: 24px;
  }
  
  .kpi-label {
    font-size: 13px;
  }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .kpi-card {
    background: #334155;
  }
  
  .kpi-value {
    color: #f1f5f9;
  }
  
  .kpi-label {
    color: #94a3b8;
  }
  
  .kpi-footer {
    border-top-color: #475569;
  }
  
  .kpi-target,
  .kpi-comparison {
    color: #94a3b8;
  }
  
  .kpi-target {
    color: var(--kpi-color);
  }
}
</style>