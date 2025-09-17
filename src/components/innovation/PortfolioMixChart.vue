<template>
  <div class="portfolio-chart-container">
    <h3 class="chart-title">Innovation Portfolio Mix</h3>
    <div class="chart-content">
      <div class="portfolio-segments">
        <div 
          v-for="(segment, key) in portfolioData" 
          :key="key"
          class="segment"
          :class="`segment-${key}`"
        >
          <div class="segment-header">
            <div class="segment-indicator" :class="`indicator-${key}`"></div>
            <span class="segment-label">{{ getSegmentLabel(key) }}</span>
          </div>
          <div class="segment-value">{{ segment }}%</div>
          <div class="segment-bar">
            <div 
              class="segment-fill" 
              :class="`fill-${key}`"
              :style="{ width: segment + '%' }"
            ></div>
          </div>
        </div>
      </div>
      <div class="portfolio-donut">
        <svg viewBox="0 0 100 100" class="donut-svg">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#e5e7eb"
            stroke-width="8"
          />
          <circle
            v-for="(segment, index) in donutSegments"
            :key="index"
            cx="50"
            cy="50"
            r="40"
            fill="none"
            :stroke="segment.color"
            stroke-width="8"
            :stroke-dasharray="segment.dasharray"
            :stroke-dashoffset="segment.offset"
            stroke-linecap="round"
            class="donut-segment"
          />
        </svg>
        <div class="donut-center">
          <div class="total-label">Total</div>
          <div class="total-value">100%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  portfolioData: {
    type: Object,
    required: true
  }
})

const getSegmentLabel = (key) => {
  const labels = {
    core: 'Core (Incremental)',
    adjacent: 'Adjacent (Expansion)', 
    transformational: 'Transformational (New)'
  }
  return labels[key] || key
}

const donutSegments = computed(() => {
  const colors = {
    core: '#3b82f6',
    adjacent: '#10b981', 
    transformational: '#f59e0b'
  }
  
  const circumference = 2 * Math.PI * 40
  let cumulativeOffset = 0
  
  return Object.entries(props.portfolioData).map(([key, value]) => {
    const dasharray = `${(value / 100) * circumference} ${circumference}`
    const offset = -cumulativeOffset
    cumulativeOffset += (value / 100) * circumference
    
    return {
      color: colors[key],
      dasharray,
      offset
    }
  })
})
</script>

<style scoped>
.portfolio-chart-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px 0;
}

.chart-content {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 32px;
  align-items: center;
}

.portfolio-segments {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.segment {
  display: flex;
  align-items: center;
  gap: 12px;
}

.segment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 180px;
}

.segment-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.indicator-core { background: #3b82f6; }
.indicator-adjacent { background: #10b981; }
.indicator-transformational { background: #f59e0b; }

.segment-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.segment-value {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  min-width: 40px;
}

.segment-bar {
  flex: 1;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.segment-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.fill-core { background: #3b82f6; }
.fill-adjacent { background: #10b981; }
.fill-transformational { background: #f59e0b; }

.portfolio-donut {
  position: relative;
  width: 200px;
  height: 200px;
}

.donut-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.donut-segment {
  transition: stroke-dasharray 0.3s ease, stroke-dashoffset 0.3s ease;
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.total-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.total-value {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

@media (max-width: 768px) {
  .chart-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .portfolio-donut {
    margin: 0 auto;
  }
}

@media (prefers-color-scheme: dark) {
  .portfolio-chart-container {
    background: #1f2937;
  }
  
  .chart-title {
    color: #f9fafb;
  }
  
  .segment-label {
    color: #9ca3af;
  }
  
  .segment-value {
    color: #f9fafb;
  }
  
  .segment-bar {
    background: #374151;
  }
  
  .total-label {
    color: #9ca3af;
  }
  
  .total-value {
    color: #f9fafb;
  }
}
</style>