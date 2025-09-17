<template>
  <BaseCard class="competitive-chart">
    <div class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
      <p class="chart-description">{{ description }}</p>
      <div class="chart-legend">
        <div
          v-for="(dataset, index) in data.datasets"
          :key="dataset.label"
          class="legend-item"
        >
          <div 
            class="legend-color" 
            :style="{ backgroundColor: dataset.backgroundColor }"
          ></div>
          <span>{{ dataset.label }}</span>
        </div>
      </div>
    </div>
    
    <div class="chart-container">
      <svg :width="chartWidth" :height="chartHeight" class="benchmark-svg">
        <!-- Grid lines -->
        <g class="grid-lines">
          <line
            v-for="i in 6"
            :key="`grid-${i}`"
            :x1="padding.left"
            :x2="chartWidth - padding.right"
            :y1="padding.top + ((chartHeight - padding.top - padding.bottom) / 5) * (i - 1)"
            :y2="padding.top + ((chartHeight - padding.top - padding.bottom) / 5) * (i - 1)"
            stroke="#e5e7eb"
            stroke-width="1"
            stroke-dasharray="2,2"
          />
        </g>
        
        <!-- Bars -->
        <g class="bars">
          <g
            v-for="(company, companyIndex) in data.labels"
            :key="company"
            class="company-group"
          >
            <rect
              v-for="(dataset, datasetIndex) in data.datasets"
              :key="`${company}-${dataset.label}`"
              :x="getBarX(companyIndex, datasetIndex)"
              :y="getBarY(dataset.data[companyIndex])"
              :width="barWidth"
              :height="getBarHeight(dataset.data[companyIndex])"
              :fill="dataset.backgroundColor"
              :class="['bar', { 'shi-bar': company === 'SHI' }]"
              @mouseenter="showTooltip(companyIndex, datasetIndex, $event)"
              @mouseleave="hideTooltip"
            />
            
            <!-- Company labels -->
            <text
              :x="getCompanyLabelX(companyIndex)"
              :y="chartHeight - padding.bottom + 20"
              text-anchor="middle"
              :class="['company-label', { 'shi-label': company === 'SHI' }]"
            >
              {{ company }}
            </text>
          </g>
        </g>
        
        <!-- Y-axis labels -->
        <g class="y-axis-labels">
          <text
            v-for="(value, index) in yAxisLabels"
            :key="`y-label-${index}`"
            :x="padding.left - 10"
            :y="padding.top + ((chartHeight - padding.top - padding.bottom) / 5) * (5 - index) + 5"
            text-anchor="end"
            class="axis-label"
          >
            {{ value }}
          </text>
        </g>
      </svg>
      
      <!-- Tooltip -->
      <div v-if="tooltip.visible" class="tooltip" :style="tooltipStyle">
        <div class="tooltip-title">{{ tooltip.company }}</div>
        <div class="tooltip-content">
          <div class="tooltip-item">
            <span class="tooltip-label">{{ tooltip.metric }}:</span>
            <span class="tooltip-value">{{ tooltip.value }}{{ tooltip.unit }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="benchmark-insights">
      <div class="insight-section">
        <h4 class="insight-title">SHI Performance</h4>
        <div class="insight-grid">
          <div
            v-for="(dataset, index) in data.datasets"
            :key="`shi-${dataset.label}`"
            class="insight-metric"
          >
            <span class="metric-name">{{ dataset.label }}</span>
            <span class="metric-value">{{ getSHIValue(index) }}{{ getUnit(dataset.label) }}</span>
            <span :class="['metric-rank', getRankClass(index)]">
              #{{ getSHIRank(index) }} of 4
            </span>
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
    default: 'Competitive Benchmarking'
  },
  description: {
    type: String,
    default: 'SHI vs Competitors on Key Innovation Metrics'
  },
  data: {
    type: Object,
    required: true
  },
  chartWidth: {
    type: Number,
    default: 600
  },
  chartHeight: {
    type: Number,
    default: 350
  }
})

const padding = {
  top: 40,
  right: 40,
  bottom: 80,
  left: 60
}

const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  company: '',
  metric: '',
  value: '',
  unit: ''
})

const maxValue = computed(() => {
  const allValues = props.data.datasets.flatMap(dataset => dataset.data)
  return Math.max(...allValues) * 1.1
})

const yAxisLabels = computed(() => {
  const max = Math.ceil(maxValue.value)
  return Array.from({ length: 6 }, (_, i) => Math.round((max / 5) * i))
})

const barWidth = computed(() => {
  const availableWidth = props.chartWidth - padding.left - padding.right
  const groupWidth = availableWidth / props.data.labels.length
  const barSpacing = 4
  return (groupWidth - (barSpacing * (props.data.datasets.length - 1))) / props.data.datasets.length
})

const getBarX = (companyIndex, datasetIndex) => {
  const availableWidth = props.chartWidth - padding.left - padding.right
  const groupWidth = availableWidth / props.data.labels.length
  const groupStartX = padding.left + (groupWidth * companyIndex)
  const barSpacing = 4
  
  return groupStartX + (barWidth.value + barSpacing) * datasetIndex
}

const getCompanyLabelX = (companyIndex) => {
  const availableWidth = props.chartWidth - padding.left - padding.right
  const groupWidth = availableWidth / props.data.labels.length
  return padding.left + (groupWidth * companyIndex) + (groupWidth / 2)
}

const getBarY = (value) => {
  const chartArea = props.chartHeight - padding.top - padding.bottom
  return padding.top + chartArea - (value / maxValue.value) * chartArea
}

const getBarHeight = (value) => {
  const chartArea = props.chartHeight - padding.top - padding.bottom
  return (value / maxValue.value) * chartArea
}

const tooltipStyle = computed(() => ({
  left: tooltip.value.x + 'px',
  top: tooltip.value.y + 'px'
}))

const getSHIValue = (datasetIndex) => {
  const shiIndex = props.data.labels.findIndex(label => label === 'SHI')
  return props.data.datasets[datasetIndex].data[shiIndex]
}

const getSHIRank = (datasetIndex) => {
  const values = props.data.datasets[datasetIndex].data
  const shiValue = getSHIValue(datasetIndex)
  
  const sortedValues = [...values].sort((a, b) => b - a)
  return sortedValues.findIndex(value => value === shiValue) + 1
}

const getRankClass = (datasetIndex) => {
  const rank = getSHIRank(datasetIndex)
  return {
    'rank-1': rank === 1,
    'rank-2': rank === 2,
    'rank-3': rank === 3,
    'rank-4': rank === 4
  }
}

const getUnit = (label) => {
  const units = {
    'Attach Rate %': '%',
    'Recurring Revenue %': '%',
    'Innovation ROI': 'x'
  }
  return units[label] || ''
}

const showTooltip = (companyIndex, datasetIndex, event) => {
  const rect = event.target.getBoundingClientRect()
  const containerRect = event.target.closest('.chart-container').getBoundingClientRect()
  
  tooltip.value = {
    visible: true,
    x: rect.left - containerRect.left + rect.width / 2,
    y: rect.top - containerRect.top - 10,
    company: props.data.labels[companyIndex],
    metric: props.data.datasets[datasetIndex].label,
    value: props.data.datasets[datasetIndex].data[companyIndex],
    unit: getUnit(props.data.datasets[datasetIndex].label)
  }
}

const hideTooltip = () => {
  tooltip.value.visible = false
}
</script>

<style scoped>
.competitive-chart {
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
  flex-wrap: wrap;
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
  height: 16px;
  border-radius: 3px;
}

.chart-container {
  position: relative;
  margin-bottom: 24px;
}

.benchmark-svg {
  width: 100%;
  height: auto;
}

.bar {
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.bar:hover {
  opacity: 0.8;
}

.shi-bar {
  filter: brightness(1.1);
  stroke: #fff;
  stroke-width: 2;
}

.company-label {
  font-size: 12px;
  fill: #6b7280;
  font-weight: 500;
}

.shi-label {
  fill: #059669;
  font-weight: 700;
}

.axis-label {
  font-size: 12px;
  fill: #6b7280;
  font-weight: 500;
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
  min-width: 120px;
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

.benchmark-insights {
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.insight-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
}

.insight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.insight-metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.metric-name {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.metric-rank {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  align-self: flex-start;
}

.rank-1 {
  color: #059669;
  background: rgba(16, 185, 129, 0.1);
}

.rank-2 {
  color: #0d9488;
  background: rgba(13, 148, 136, 0.1);
}

.rank-3 {
  color: #d97706;
  background: rgba(217, 119, 6, 0.1);
}

.rank-4 {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
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
  
  .company-label {
    fill: #9ca3af;
  }
  
  .shi-label {
    fill: #34d399;
  }
  
  .axis-label {
    fill: #9ca3af;
  }
  
  .benchmark-insights {
    background: #1f2937;
    border-color: #374151;
  }
  
  .insight-title {
    color: #f9fafb;
  }
  
  .insight-metric {
    background: #374151;
    border-color: #4b5563;
  }
  
  .metric-name {
    color: #9ca3af;
  }
  
  .metric-value {
    color: #f9fafb;
  }
}

@media (max-width: 768px) {
  .chart-legend {
    justify-content: center;
    gap: 12px;
  }
  
  .insight-grid {
    grid-template-columns: 1fr;
  }
}
</style>