<template>
  <div class="donut-chart">
    <h3 class="chart-title">{{ title }}</h3>
    <div class="donut-container">
      <div class="donut-wrapper">
        <svg class="donut-svg" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#e2e8f0"
            stroke-width="8"
            class="donut-background"
          />
          <circle
            v-for="(segment, index) in segments"
            :key="index"
            cx="50"
            cy="50"
            r="40"
            fill="none"
            :stroke="segment.color"
            stroke-width="8"
            :stroke-dasharray="segment.dashArray"
            :stroke-dashoffset="segment.dashOffset"
            :style="{ transform: `rotate(${segment.rotation}deg)`, transformOrigin: '50% 50%' }"
            class="donut-segment"
          />
        </svg>
        <div class="donut-center">
          <div class="total-label">Total</div>
          <div class="total-value">{{ totalValue }}</div>
        </div>
      </div>
      
      <div class="donut-legend">
        <div
          v-for="(item, index) in data.labels"
          :key="item"
          class="legend-item"
        >
          <div
            class="legend-color"
            :style="{ backgroundColor: data.colors[index] }"
          ></div>
          <div class="legend-text">
            <div class="legend-label">{{ item }}</div>
            <div class="legend-value">{{ data.values[index] }}%</div>
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
      return data.labels && data.values && data.colors && 
             data.labels.length === data.values.length &&
             data.values.length === data.colors.length
    }
  }
})

const totalValue = computed(() => {
  return props.data.values.reduce((sum, value) => sum + value, 0)
})

const segments = computed(() => {
  const circumference = 2 * Math.PI * 40 // radius = 40
  let currentOffset = 0
  
  return props.data.values.map((value, index) => {
    const percentage = value / totalValue.value
    const strokeLength = circumference * percentage
    const dashArray = `${strokeLength} ${circumference}`
    const dashOffset = -currentOffset
    const rotation = (currentOffset / circumference) * 360 - 90 // Start from top
    
    currentOffset += strokeLength
    
    return {
      color: props.data.colors[index],
      dashArray,
      dashOffset,
      rotation: rotation
    }
  })
})
</script>

<style scoped>
.donut-chart {
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

.donut-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  height: calc(100% - 60px);
}

.donut-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
}

.donut-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.donut-background {
  opacity: 0.2;
}

.donut-segment {
  transition: stroke-width 0.2s ease;
}

.donut-segment:hover {
  stroke-width: 10;
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
  color: #64748b;
  font-weight: 500;
  margin-bottom: 2px;
}

.total-value {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 200px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.legend-item:hover {
  background: #f8fafc;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-text {
  flex: 1;
}

.legend-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 2px;
}

.legend-value {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .donut-chart {
    padding: 16px;
  }
  
  .donut-wrapper {
    width: 160px;
    height: 160px;
  }
  
  .total-value {
    font-size: 16px;
  }
  
  .legend-item {
    padding: 6px;
  }
  
  .legend-label {
    font-size: 13px;
  }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .donut-chart {
    background: #334155;
  }
  
  .chart-title {
    color: #f1f5f9;
  }
  
  .total-label {
    color: #94a3b8;
  }
  
  .total-value {
    color: #f1f5f9;
  }
  
  .legend-item:hover {
    background: #475569;
  }
  
  .legend-label {
    color: #f1f5f9;
  }
  
  .legend-value {
    color: #94a3b8;
  }
  
  .donut-background {
    stroke: #475569;
  }
}
</style>