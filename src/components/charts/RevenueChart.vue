<template>
  <BaseCard class="revenue-chart">
    <div class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
      <p class="chart-description">{{ description }}</p>
      <div class="chart-legend">
        <div class="legend-item">
          <div class="legend-color innovation-color"></div>
          <span>Innovation Revenue</span>
        </div>
        <div class="legend-item">
          <div class="legend-color traditional-color"></div>
          <span>Traditional Revenue</span>
        </div>
      </div>
    </div>
    
    <div class="chart-container">
      <svg :width="chartWidth" :height="chartHeight" class="revenue-svg">
        <!-- Grid lines -->
        <g class="grid-lines">
          <line
            v-for="i in 5"
            :key="`grid-${i}`"
            :x1="padding.left"
            :x2="chartWidth - padding.right"
            :y1="padding.top + ((chartHeight - padding.top - padding.bottom) / 4) * (i - 1)"
            :y2="padding.top + ((chartHeight - padding.top - padding.bottom) / 4) * (i - 1)"
            stroke="#e5e7eb"
            stroke-width="1"
            stroke-dasharray="2,2"
          />
        </g>
        
        <!-- Innovation revenue line -->
        <path
          :d="innovationPath"
          fill="none"
          stroke="#10b981"
          stroke-width="3"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
        
        <!-- Traditional revenue line -->
        <path
          :d="traditionalPath"
          fill="none"
          stroke="#6b7280"
          stroke-width="3"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
        
        <!-- Data points for innovation -->
        <g class="innovation-points">
          <circle
            v-for="(point, index) in innovationPoints"
            :key="`innovation-${index}`"
            :cx="point.x"
            :cy="point.y"
            r="4"
            fill="#10b981"
            stroke="white"
            stroke-width="2"
            class="data-point"
            @mouseenter="showTooltip(index, 'innovation')"
            @mouseleave="hideTooltip"
          />
        </g>
        
        <!-- Data points for traditional -->
        <g class="traditional-points">
          <circle
            v-for="(point, index) in traditionalPoints"
            :key="`traditional-${index}`"
            :cx="point.x"
            :cy="point.y"
            r="4"
            fill="#6b7280"
            stroke="white"
            stroke-width="2"
            class="data-point"
            @mouseenter="showTooltip(index, 'traditional')"
            @mouseleave="hideTooltip"
          />
        </g>
        
        <!-- X-axis labels -->
        <g class="x-axis-labels">
          <text
            v-for="(label, index) in data.labels"
            :key="`label-${index}`"
            :x="padding.left + (chartWidth - padding.left - padding.right) / (data.labels.length - 1) * index"
            :y="chartHeight - padding.bottom + 20"
            text-anchor="middle"
            class="axis-label"
          >
            {{ label }}
          </text>
        </g>
        
        <!-- Y-axis labels -->
        <g class="y-axis-labels">
          <text
            v-for="(value, index) in yAxisLabels"
            :key="`y-label-${index}`"
            :x="padding.left - 10"
            :y="padding.top + ((chartHeight - padding.top - padding.bottom) / 4) * (4 - index) + 5"
            text-anchor="end"
            class="axis-label"
          >
            ${{ value }}M
          </text>
        </g>
      </svg>
      
      <!-- Tooltip -->
      <div v-if="tooltip.visible" class="tooltip" :style="tooltipStyle">
        <div class="tooltip-title">{{ tooltip.label }}</div>
        <div class="tooltip-content">
          <div class="tooltip-item">
            <span class="tooltip-label">{{ tooltip.type === 'innovation' ? 'Innovation' : 'Traditional' }}:</span>
            <span class="tooltip-value">${{ tooltip.value }}M</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chart-insights">
      <div class="insight-item">
        <span class="insight-label">Innovation Growth:</span>
        <span class="insight-value growth-positive">+{{ innovationGrowth }}%</span>
      </div>
      <div class="insight-item">
        <span class="insight-label">Innovation Share:</span>
        <span class="insight-value">{{ innovationShare }}%</span>
      </div>
      <div class="insight-item">
        <span class="insight-label">YoY Trend:</span>
        <span class="insight-value growth-positive">Accelerating</span>
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
    default: 'Revenue Growth Comparison'
  },
  description: {
    type: String,
    default: 'Innovation vs Traditional Revenue Trends'
  },
  data: {
    type: Object,
    required: true
  },
  chartWidth: {
    type: Number,
    default: 500
  },
  chartHeight: {
    type: Number,
    default: 300
  }
})

const padding = {
  top: 40,
  right: 40,
  bottom: 60,
  left: 60
}

const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  label: '',
  value: '',
  type: ''
})

const maxValue = computed(() => {
  const allValues = [...props.data.innovation, ...props.data.traditional]
  return Math.max(...allValues) * 1.1 // Add 10% padding
})

const yAxisLabels = computed(() => {
  const max = maxValue.value
  return [0, max * 0.25, max * 0.5, max * 0.75, max].map(val => Math.round(val))
})

const createPoints = (values) => {
  const width = props.chartWidth - padding.left - padding.right
  const height = props.chartHeight - padding.top - padding.bottom
  
  return values.map((value, index) => ({
    x: padding.left + (width / (values.length - 1)) * index,
    y: padding.top + height - (value / maxValue.value) * height
  }))
}

const innovationPoints = computed(() => createPoints(props.data.innovation))
const traditionalPoints = computed(() => createPoints(props.data.traditional))

const createPath = (points) => {
  if (points.length === 0) return ''
  
  let path = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`
  }
  return path
}

const innovationPath = computed(() => createPath(innovationPoints.value))
const traditionalPath = computed(() => createPath(traditionalPoints.value))

const innovationGrowth = computed(() => {
  const first = props.data.innovation[0]
  const last = props.data.innovation[props.data.innovation.length - 1]
  return Math.round(((last - first) / first) * 100)
})

const innovationShare = computed(() => {
  const lastInnovation = props.data.innovation[props.data.innovation.length - 1]
  const lastTraditional = props.data.traditional[props.data.traditional.length - 1]
  const total = lastInnovation + lastTraditional
  return Math.round((lastInnovation / total) * 100)
})

const tooltipStyle = computed(() => ({
  left: tooltip.value.x + 'px',
  top: tooltip.value.y + 'px'
}))

const showTooltip = (index, type) => {
  const value = type === 'innovation' 
    ? props.data.innovation[index] 
    : props.data.traditional[index]
  
  const points = type === 'innovation' ? innovationPoints.value : traditionalPoints.value
  
  tooltip.value = {
    visible: true,
    x: points[index].x,
    y: points[index].y - 10,
    label: props.data.labels[index],
    value: value,
    type: type
  }
}

const hideTooltip = () => {
  tooltip.value.visible = false
}
</script>

<style scoped>
.revenue-chart {
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
  margin: 0 0 16px 0;
}

.chart-legend {
  display: flex;
  gap: 24px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.legend-color {
  width: 16px;
  height: 3px;
  border-radius: 2px;
}

.innovation-color {
  background: #10b981;
}

.traditional-color {
  background: #6b7280;
}

.chart-container {
  position: relative;
  margin-bottom: 24px;
}

.revenue-svg {
  width: 100%;
  height: auto;
}

.axis-label {
  font-size: 12px;
  fill: #6b7280;
  font-weight: 500;
}

.data-point {
  cursor: pointer;
  transition: r 0.2s ease;
}

.data-point:hover {
  r: 6;
}

.tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px;
  border-radius: 8px;
  pointer-events: none;
  z-index: 10;
  transform: translateX(-50%);
  min-width: 140px;
}

.tooltip-title {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
}

.tooltip-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tooltip-label {
  font-size: 12px;
}

.tooltip-value {
  font-size: 14px;
  font-weight: 700;
}

.chart-insights {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.insight-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
}

.insight-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.insight-value {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.growth-positive {
  color: #059669;
}

@media (prefers-color-scheme: dark) {
  .chart-title {
    color: #f9fafb;
  }
  
  .chart-description {
    color: #d1d5db;
  }
  
  .legend-item {
    color: #d1d5db;
  }
  
  .axis-label {
    fill: #9ca3af;
  }
  
  .chart-insights {
    background: #1f2937;
    border-color: #374151;
  }
  
  .insight-label {
    color: #9ca3af;
  }
  
  .insight-value {
    color: #f9fafb;
  }
}

@media (max-width: 768px) {
  .chart-legend {
    justify-content: center;
    gap: 16px;
  }
  
  .chart-insights {
    flex-direction: column;
    gap: 16px;
  }
  
  .insight-item {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}
</style>