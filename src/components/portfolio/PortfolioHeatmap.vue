<template>
  <BaseCard>
    <div class="heatmap-container">
      <div class="heatmap-header">
        <h3 class="heatmap-title">Portfolio Performance Heatmap</h3>
        <div class="heatmap-controls">
          <select v-model="selectedMetric" @change="updateHeatmap" class="metric-selector">
            <option value="arrGrowth">ARR Growth</option>
            <option value="cashRunway">Cash Runway</option>
            <option value="grossMargin">Gross Margin</option>
            <option value="customerGrowth">Customer Growth</option>
            <option value="nps">Net Promoter Score</option>
            <option value="ltvCacRatio">LTV/CAC Ratio</option>
          </select>
          <div class="view-toggle">
            <button 
              @click="viewMode = 'grid'" 
              :class="{ active: viewMode === 'grid' }"
              class="view-button"
            >
              Grid
            </button>
            <button 
              @click="viewMode = 'bubble'" 
              :class="{ active: viewMode === 'bubble' }"
              class="view-button"
            >
              Bubble
            </button>
          </div>
        </div>
      </div>

      <div class="heatmap-legend">
        <div class="legend-item">
          <span class="legend-color excellent"></span>
          <span>Excellent</span>
        </div>
        <div class="legend-item">
          <span class="legend-color good"></span>
          <span>Good</span>
        </div>
        <div class="legend-item">
          <span class="legend-color average"></span>
          <span>Average</span>
        </div>
        <div class="legend-item">
          <span class="legend-color poor"></span>
          <span>Poor</span>
        </div>
        <div class="legend-item">
          <span class="legend-color critical"></span>
          <span>Critical</span>
        </div>
      </div>

      <div v-if="viewMode === 'grid'" class="heatmap-grid">
        <div 
          v-for="company in companies" 
          :key="company.id"
          class="heatmap-cell"
          :class="getPerformanceClass(company)"
          :title="getTooltipText(company)"
          @click="$emit('company-selected', company)"
        >
          <div class="cell-content">
            <div class="cell-logo">{{ company.logo }}</div>
            <div class="cell-info">
              <div class="cell-name">{{ company.name }}</div>
              <div class="cell-value">{{ getMetricValue(company) }}</div>
              <div class="cell-sector">{{ company.sector }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="heatmap-bubble">
        <svg :width="bubbleWidth" :height="bubbleHeight" class="bubble-chart">
          <g v-for="bubble in bubbleData" :key="bubble.id">
            <circle
              :cx="bubble.x"
              :cy="bubble.y"
              :r="bubble.radius"
              :class="bubble.performanceClass"
              class="bubble"
              @click="$emit('company-selected', bubble.company)"
            />
            <text
              :x="bubble.x"
              :y="bubble.y - 5"
              class="bubble-name"
              text-anchor="middle"
            >
              {{ bubble.company.name.length > 12 ? bubble.company.name.substring(0, 12) + '...' : bubble.company.name }}
            </text>
            <text
              :x="bubble.x"
              :y="bubble.y + 8"
              class="bubble-value"
              text-anchor="middle"
            >
              {{ bubble.value }}
            </text>
          </g>
          
          <!-- Quadrant lines -->
          <line 
            :x1="bubbleWidth / 2" 
            y1="20" 
            :x2="bubbleWidth / 2" 
            :y2="bubbleHeight - 20"
            class="quadrant-line"
          />
          <line 
            x1="20" 
            :y1="bubbleHeight / 2" 
            :x2="bubbleWidth - 20" 
            :y2="bubbleHeight / 2"
            class="quadrant-line"
          />
          
          <!-- Quadrant labels -->
          <text :x="bubbleWidth * 0.75" y="35" class="quadrant-label">High Growth</text>
          <text :x="bubbleWidth * 0.25" y="35" class="quadrant-label">Stable</text>
          <text :x="bubbleWidth * 0.25" :y="bubbleHeight - 25" class="quadrant-label">At Risk</text>
          <text :x="bubbleWidth * 0.75" :y="bubbleHeight - 25" class="quadrant-label">Turnaround</text>
        </svg>
      </div>

      <div class="heatmap-insights">
        <div class="insight-card">
          <span class="insight-label">Top Performer</span>
          <span class="insight-value">{{ topPerformer?.name || 'N/A' }}</span>
        </div>
        <div class="insight-card">
          <span class="insight-label">Needs Attention</span>
          <span class="insight-value">{{ needsAttention?.name || 'N/A' }}</span>
        </div>
        <div class="insight-card">
          <span class="insight-label">Portfolio Avg</span>
          <span class="insight-value">{{ portfolioAverage }}</span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseCard from '../common/BaseCard.vue'

const props = defineProps({
  companies: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['company-selected'])

const selectedMetric = ref('arrGrowth')
const viewMode = ref('grid')
const bubbleWidth = ref(600)
const bubbleHeight = ref(400)

const metricConfig = {
  arrGrowth: {
    label: 'ARR Growth',
    unit: '%',
    getValue: (company) => company.financials.arrGrowth,
    thresholds: { excellent: 100, good: 50, average: 25, poor: 10 }
  },
  cashRunway: {
    label: 'Cash Runway',
    unit: 'mo',
    getValue: (company) => company.financials.cashRunway,
    thresholds: { excellent: 24, good: 18, average: 12, poor: 6 }
  },
  grossMargin: {
    label: 'Gross Margin',
    unit: '%',
    getValue: (company) => company.financials.grossMargin,
    thresholds: { excellent: 80, good: 70, average: 60, poor: 50 }
  },
  customerGrowth: {
    label: 'Customer Growth',
    unit: '%',
    getValue: (company) => company.operations.customerGrowth,
    thresholds: { excellent: 60, good: 40, average: 25, poor: 10 }
  },
  nps: {
    label: 'Net Promoter Score',
    unit: '',
    getValue: (company) => company.operations.nps,
    thresholds: { excellent: 70, good: 50, average: 30, poor: 10 }
  },
  ltvCacRatio: {
    label: 'LTV/CAC Ratio',
    unit: 'x',
    getValue: (company) => company.operations.ltvCacRatio,
    thresholds: { excellent: 15, good: 10, average: 5, poor: 3 }
  }
}

const currentMetric = computed(() => metricConfig[selectedMetric.value])

const topPerformer = computed(() => {
  return props.companies.reduce((top, company) => {
    const value = currentMetric.value.getValue(company)
    const topValue = top ? currentMetric.value.getValue(top) : -Infinity
    return value > topValue ? company : top
  }, null)
})

const needsAttention = computed(() => {
  return props.companies.reduce((worst, company) => {
    const value = currentMetric.value.getValue(company)
    const worstValue = worst ? currentMetric.value.getValue(worst) : Infinity
    return value < worstValue ? company : worst
  }, null)
})

const portfolioAverage = computed(() => {
  const sum = props.companies.reduce((acc, company) => {
    return acc + currentMetric.value.getValue(company)
  }, 0)
  const avg = sum / props.companies.length
  return `${avg.toFixed(1)}${currentMetric.value.unit}`
})

const bubbleData = computed(() => {
  if (!props.companies.length) return []
  
  const data = props.companies.map(company => {
    const value = currentMetric.value.getValue(company)
    const performanceClass = getPerformanceClass(company)
    
    // Normalize value for bubble size (min 15, max 50)
    const maxValue = Math.max(...props.companies.map(c => currentMetric.value.getValue(c)))
    const minValue = Math.min(...props.companies.map(c => currentMetric.value.getValue(c)))
    const normalizedSize = 15 + (value - minValue) / (maxValue - minValue) * 35
    
    return {
      id: company.id,
      company,
      value: `${value}${currentMetric.value.unit}`,
      radius: normalizedSize,
      performanceClass: `bubble-${performanceClass}`,
      rawValue: value
    }
  })
  
  // Position bubbles in quadrants based on performance
  return data.map((bubble, index) => {
    const angle = (index * 2 * Math.PI) / data.length
    const centerX = bubbleWidth.value / 2
    const centerY = bubbleHeight.value / 2
    const radiusX = (bubbleWidth.value / 2) - bubble.radius - 30
    const radiusY = (bubbleHeight.value / 2) - bubble.radius - 30
    
    // Adjust position based on performance
    let offsetX = 0
    let offsetY = 0
    
    const performance = bubble.performanceClass
    if (performance.includes('excellent') || performance.includes('good')) {
      offsetX = radiusX * 0.3 // Move to right quadrants
    } else {
      offsetX = -radiusX * 0.3 // Move to left quadrants
    }
    
    if (bubble.company.financials.cashRunway > 12) {
      offsetY = -radiusY * 0.3 // Move to top quadrants
    } else {
      offsetY = radiusY * 0.3 // Move to bottom quadrants
    }
    
    return {
      ...bubble,
      x: centerX + offsetX + Math.cos(angle) * radiusX * 0.3,
      y: centerY + offsetY + Math.sin(angle) * radiusY * 0.3
    }
  })
})

function getPerformanceClass(company) {
  const value = currentMetric.value.getValue(company)
  const thresholds = currentMetric.value.thresholds
  
  if (value >= thresholds.excellent) return 'excellent'
  if (value >= thresholds.good) return 'good'
  if (value >= thresholds.average) return 'average'
  if (value >= thresholds.poor) return 'poor'
  return 'critical'
}

function getMetricValue(company) {
  const value = currentMetric.value.getValue(company)
  return `${value}${currentMetric.value.unit}`
}

function getTooltipText(company) {
  const value = getMetricValue(company)
  return `${company.name}\n${currentMetric.value.label}: ${value}\nSector: ${company.sector}\nStage: ${company.stage}`
}

function updateHeatmap() {
  // Force reactivity update when metric changes
}

onMounted(() => {
  // Adjust bubble chart size based on container
  const container = document.querySelector('.heatmap-bubble')
  if (container) {
    bubbleWidth.value = Math.min(600, container.clientWidth - 40)
    bubbleHeight.value = Math.min(400, bubbleWidth.value * 0.67)
  }
})
</script>

<style scoped>
.heatmap-container {
  padding: 4px;
}

.heatmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.heatmap-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.heatmap-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.metric-selector {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  color: #374151;
}

.view-toggle {
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
}

.view-button {
  padding: 6px 12px;
  background: white;
  border: none;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.view-button:hover {
  background: #f3f4f6;
}

.view-button.active {
  background: #3b82f6;
  color: white;
}

.heatmap-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #374151;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.excellent {
  background: #10b981;
}

.legend-color.good {
  background: #84cc16;
}

.legend-color.average {
  background: #f59e0b;
}

.legend-color.poor {
  background: #f97316;
}

.legend-color.critical {
  background: #ef4444;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.heatmap-cell {
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 100px;
  display: flex;
  align-items: center;
}

.heatmap-cell:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.heatmap-cell.excellent {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.heatmap-cell.good {
  background: linear-gradient(135deg, #84cc16, #65a30d);
  color: white;
}

.heatmap-cell.average {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.heatmap-cell.poor {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
}

.heatmap-cell.critical {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.cell-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.cell-logo {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}

.cell-info {
  flex: 1;
}

.cell-name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.cell-value {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 2px;
}

.cell-sector {
  font-size: 11px;
  opacity: 0.9;
}

.heatmap-bubble {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.bubble-chart {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fafafa;
}

.bubble {
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.8;
}

.bubble:hover {
  opacity: 1;
  stroke: #374151;
  stroke-width: 2;
}

.bubble-excellent {
  fill: #10b981;
}

.bubble-good {
  fill: #84cc16;
}

.bubble-average {
  fill: #f59e0b;
}

.bubble-poor {
  fill: #f97316;
}

.bubble-critical {
  fill: #ef4444;
}

.bubble-name {
  font-size: 11px;
  font-weight: 600;
  fill: #111827;
  pointer-events: none;
}

.bubble-value {
  font-size: 10px;
  font-weight: 500;
  fill: #374151;
  pointer-events: none;
}

.quadrant-line {
  stroke: #d1d5db;
  stroke-width: 1;
  stroke-dasharray: 5,5;
}

.quadrant-label {
  font-size: 12px;
  font-weight: 500;
  fill: #6b7280;
  text-anchor: middle;
}

.heatmap-insights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.insight-card {
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.insight-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
  text-transform: uppercase;
  font-weight: 500;
}

.insight-value {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

@media (max-width: 768px) {
  .heatmap-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .heatmap-controls {
    justify-content: space-between;
  }
  
  .heatmap-legend {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .heatmap-grid {
    grid-template-columns: 1fr;
  }
  
  .bubble-chart {
    width: 100%;
    height: auto;
  }
}

@media (prefers-color-scheme: dark) {
  .heatmap-title {
    color: #f9fafb;
  }
  
  .metric-selector {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }
  
  .view-button {
    background: #374151;
    color: #d1d5db;
  }
  
  .view-button:hover {
    background: #4b5563;
  }
  
  .heatmap-legend {
    background: #1f2937;
  }
  
  .legend-item {
    color: #d1d5db;
  }
  
  .bubble-chart {
    background: #1f2937;
    border-color: #4b5563;
  }
  
  .insight-card {
    background: #1f2937;
    border-color: #4b5563;
  }
  
  .insight-label {
    color: #9ca3af;
  }
  
  .insight-value {
    color: #f9fafb;
  }
}
</style>