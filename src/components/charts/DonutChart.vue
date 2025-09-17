<template>
  <BaseCard class="donut-chart">
    <div class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
      <p class="chart-description">{{ description }}</p>
    </div>
    
    <div class="donut-container">
      <div class="donut-wrapper">
        <svg :width="size" :height="size" class="donut-svg">
          <g :transform="`translate(${size/2}, ${size/2})`">
            <circle
              v-for="(segment, index) in segments"
              :key="index"
              :r="radius"
              :stroke="segment.color"
              :stroke-width="strokeWidth"
              :stroke-dasharray="segment.dashArray"
              :stroke-dashoffset="segment.dashOffset"
              fill="transparent"
              :class="['donut-segment', { active: hoveredSegment === index }]"
              @mouseenter="hoveredSegment = index"
              @mouseleave="hoveredSegment = -1"
            />
            
            <!-- Center text -->
            <text class="center-text-main" text-anchor="middle" dy="-8">
              {{ totalValue.toLocaleString() }}
            </text>
            <text class="center-text-sub" text-anchor="middle" dy="12">
              Total {{ unit }}
            </text>
          </g>
        </svg>
        
        <!-- Hover tooltip -->
        <div v-if="hoveredSegment >= 0" class="hover-tooltip">
          <div class="tooltip-label">{{ labels[hoveredSegment] }}</div>
          <div class="tooltip-value">{{ data[hoveredSegment] }}{{ unit === '%' ? '%' : ` ${unit}` }}</div>
          <div class="tooltip-percentage">{{ calculatePercentage(hoveredSegment) }}% of total</div>
        </div>
      </div>
      
      <div class="legend">
        <div
          v-for="(label, index) in labels"
          :key="index"
          class="legend-item"
          :class="{ active: hoveredSegment === index }"
          @mouseenter="hoveredSegment = index"
          @mouseleave="hoveredSegment = -1"
        >
          <div 
            class="legend-color" 
            :style="{ backgroundColor: colors[index] }"
          ></div>
          <div class="legend-content">
            <div class="legend-label">{{ label }}</div>
            <div class="legend-value">
              {{ data[index] }}{{ unit === '%' ? '%' : ` ${unit}` }}
              <span class="legend-percentage">({{ calculatePercentage(index) }}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseCard from '../common/BaseCard.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Distribution'
  },
  description: {
    type: String,
    default: 'Breakdown by category'
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
    default: () => ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6']
  },
  size: {
    type: Number,
    default: 200
  },
  unit: {
    type: String,
    default: ''
  }
})

const hoveredSegment = ref(-1)
const strokeWidth = 30
const radius = (props.size / 2) - strokeWidth

const totalValue = computed(() => {
  return props.data.reduce((sum, value) => sum + Number(value), 0)
})

const segments = computed(() => {
  const total = totalValue.value
  const circumference = 2 * Math.PI * radius
  let currentOffset = 0
  
  return props.data.map((value, index) => {
    const percentage = (Number(value) / total) * 100
    const dashArray = `${(percentage / 100) * circumference} ${circumference}`
    const dashOffset = -currentOffset
    
    currentOffset += (percentage / 100) * circumference
    
    return {
      dashArray,
      dashOffset,
      color: props.colors[index] || '#6B7280',
      percentage
    }
  })
})

const calculatePercentage = (index) => {
  const percentage = (Number(props.data[index]) / totalValue.value) * 100
  return Math.round(percentage * 10) / 10 // Round to 1 decimal place
}
</script>

<style scoped>
.donut-chart {
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

.donut-container {
  display: flex;
  align-items: center;
  gap: 32px;
}

.donut-wrapper {
  position: relative;
  flex-shrink: 0;
}

.donut-svg {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.donut-segment {
  transition: all 0.3s ease;
  cursor: pointer;
}

.donut-segment.active {
  stroke-width: 35;
  filter: brightness(1.1);
}

.center-text-main {
  font-size: 24px;
  font-weight: 700;
  fill: #111827;
}

.center-text-sub {
  font-size: 12px;
  font-weight: 500;
  fill: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.hover-tooltip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  pointer-events: none;
  z-index: 10;
  min-width: 120px;
}

.tooltip-label {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
}

.tooltip-value {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 2px;
}

.tooltip-percentage {
  font-size: 11px;
  opacity: 0.8;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.legend-item:hover,
.legend-item.active {
  background: #f3f4f6;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.legend-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.legend-value {
  font-size: 13px;
  color: #6b7280;
}

.legend-percentage {
  font-weight: 500;
  color: #9ca3af;
}

@media (prefers-color-scheme: dark) {
  .chart-title {
    color: #f9fafb;
  }
  
  .chart-description {
    color: #d1d5db;
  }
  
  .center-text-main {
    fill: #f9fafb;
  }
  
  .center-text-sub {
    fill: #d1d5db;
  }
  
  .legend-item:hover,
  .legend-item.active {
    background: #374151;
  }
  
  .legend-label {
    color: #d1d5db;
  }
  
  .legend-value {
    color: #9ca3af;
  }
}

@media (max-width: 768px) {
  .donut-container {
    flex-direction: column;
    gap: 24px;
  }
  
  .legend {
    width: 100%;
  }
  
  .legend-item {
    padding: 12px;
  }
}
</style>