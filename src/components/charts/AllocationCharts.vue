<template>
  <div class="allocation-charts">
    <div class="charts-grid">
      <!-- Sector Allocation Chart -->
      <BaseCard class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Sector Allocation</h3>
          <div class="chart-controls">
            <button 
              @click="sectorViewType = 'amount'"
              :class="{ active: sectorViewType === 'amount' }"
              class="view-toggle"
            >
              Amount
            </button>
            <button 
              @click="sectorViewType = 'percentage'"
              :class="{ active: sectorViewType === 'percentage' }"
              class="view-toggle"
            >
              %
            </button>
          </div>
        </div>
        
        <div class="chart-container">
          <div class="donut-chart">
            <svg :width="chartSize" :height="chartSize" class="sector-chart">
              <g :transform="`translate(${chartSize/2}, ${chartSize/2})`">
                <!-- Donut segments -->
                <path
                  v-for="(segment, index) in sectorSegments"
                  :key="segment.sector"
                  :d="segment.path"
                  :fill="segment.color"
                  :class="`sector-segment sector-${index}`"
                  @mouseenter="hoveredSector = segment.sector"
                  @mouseleave="hoveredSector = null"
                  @click="$emit('sector-selected', segment.sector)"
                />
              </g>
              
              <!-- Center text -->
              <text 
                :x="chartSize/2" 
                :y="chartSize/2 - 5" 
                text-anchor="middle" 
                class="center-label"
              >
                Total
              </text>
              <text 
                :x="chartSize/2" 
                :y="chartSize/2 + 8" 
                text-anchor="middle" 
                class="center-value"
              >
                {{ sectorViewType === 'amount' ? formatValue(totalSectorAmount) : '100%' }}
              </text>
            </svg>
          </div>
          
          <div class="chart-legend">
            <div 
              v-for="(item, index) in sectorAllocation" 
              :key="item.sector"
              class="legend-item"
              :class="{ highlighted: hoveredSector === item.sector }"
              @click="$emit('sector-selected', item.sector)"
            >
              <div class="legend-indicator">
                <span 
                  class="legend-color" 
                  :style="{ backgroundColor: getSectorColor(index) }"
                ></span>
                <span class="legend-label">{{ item.sector }}</span>
              </div>
              <div class="legend-values">
                <span class="legend-amount">{{ formatValue(item.amount) }}</span>
                <span class="legend-percentage">{{ item.percentage.toFixed(1) }}%</span>
                <span class="legend-companies">{{ item.companies }} companies</span>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Geographic Distribution Chart -->
      <BaseCard class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Geographic Distribution</h3>
          <div class="chart-controls">
            <button 
              @click="geoViewType = 'amount'"
              :class="{ active: geoViewType === 'amount' }"
              class="view-toggle"
            >
              Amount
            </button>
            <button 
              @click="geoViewType = 'companies'"
              :class="{ active: geoViewType === 'companies' }"
              class="view-toggle"
            >
              Companies
            </button>
          </div>
        </div>
        
        <div class="chart-container">
          <div class="bar-chart">
            <div 
              v-for="(region, index) in geoAllocation" 
              :key="region.region"
              class="bar-container"
            >
              <div class="bar-label">{{ region.region }}</div>
              <div class="bar-track">
                <div 
                  class="bar-fill"
                  :style="{ 
                    width: getBarWidth(region, geoViewType) + '%',
                    backgroundColor: getGeoColor(index)
                  }"
                  @mouseenter="hoveredRegion = region.region"
                  @mouseleave="hoveredRegion = null"
                  @click="$emit('region-selected', region.region)"
                ></div>
              </div>
              <div class="bar-value">
                {{ geoViewType === 'amount' ? formatValue(region.amount) : `${region.companies} cos` }}
                <span class="bar-percentage">({{ region.percentage.toFixed(1) }}%)</span>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Stage Distribution Chart -->
      <BaseCard class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Stage Distribution</h3>
          <div class="chart-subtitle">Portfolio companies by funding stage</div>
        </div>
        
        <div class="chart-container">
          <div class="pyramid-chart">
            <div 
              v-for="(stage, index) in stageAllocation" 
              :key="stage.stage"
              class="pyramid-level"
              :style="{ 
                width: (stage.percentage * 0.8 + 20) + '%',
                backgroundColor: getStageColor(index),
                opacity: hoveredStage === stage.stage ? 1 : 0.85
              }"
              @mouseenter="hoveredStage = stage.stage"
              @mouseleave="hoveredStage = null"
              @click="$emit('stage-selected', stage.stage)"
            >
              <div class="pyramid-content">
                <span class="pyramid-label">{{ stage.stage }}</span>
                <span class="pyramid-value">{{ formatValue(stage.amount) }}</span>
                <span class="pyramid-percentage">{{ stage.percentage.toFixed(1) }}%</span>
              </div>
            </div>
          </div>
          
          <div class="stage-insights">
            <div class="insight-item">
              <span class="insight-label">Largest Stage:</span>
              <span class="insight-value">{{ largestStage.stage }} ({{ formatValue(largestStage.amount) }})</span>
            </div>
            <div class="insight-item">
              <span class="insight-label">Portfolio Balance:</span>
              <span class="insight-value" :class="balanceStatus">{{ portfolioBalance }}</span>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseCard from '../common/BaseCard.vue'

const props = defineProps({
  sectorAllocation: {
    type: Array,
    required: true
  },
  geographyAllocation: {
    type: Array,
    required: true
  },
  stageAllocation: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['sector-selected', 'region-selected', 'stage-selected'])

const sectorViewType = ref('amount')
const geoViewType = ref('amount')
const hoveredSector = ref(null)
const hoveredRegion = ref(null)
const hoveredStage = ref(null)
const chartSize = 200

const sectorColors = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#64748b'
]

const geoColors = [
  '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'
]

const stageColors = [
  '#fef3c7', '#fed7aa', '#fecaca', '#ddd6fe', '#c7d2fe'
]

const totalSectorAmount = computed(() => {
  return props.sectorAllocation.reduce((sum, item) => sum + item.amount, 0)
})

const geoAllocation = computed(() => {
  return props.geographyAllocation.map(item => ({
    ...item,
    region: item.geography || item.region || 'Unknown'
  }))
})

const largestStage = computed(() => {
  return props.stageAllocation.reduce((largest, current) => 
    current.amount > largest.amount ? current : largest
  )
})

const portfolioBalance = computed(() => {
  const stages = props.stageAllocation.map(s => s.percentage)
  const max = Math.max(...stages)
  const min = Math.min(...stages)
  const ratio = max / min
  
  if (ratio < 2) return 'Well Balanced'
  if (ratio < 4) return 'Moderately Skewed'
  return 'Heavily Concentrated'
})

const balanceStatus = computed(() => {
  switch (portfolioBalance.value) {
    case 'Well Balanced': return 'positive'
    case 'Moderately Skewed': return 'warning'
    case 'Heavily Concentrated': return 'critical'
    default: return 'neutral'
  }
})

const sectorSegments = computed(() => {
  const total = totalSectorAmount.value
  let currentAngle = -Math.PI / 2 // Start from top
  const innerRadius = 60
  const outerRadius = 90
  
  return props.sectorAllocation.map((sector, index) => {
    const percentage = sector.amount / total
    const angle = percentage * 2 * Math.PI
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    
    // Create arc path
    const x1 = Math.cos(startAngle) * outerRadius
    const y1 = Math.sin(startAngle) * outerRadius
    const x2 = Math.cos(endAngle) * outerRadius
    const y2 = Math.sin(endAngle) * outerRadius
    const x3 = Math.cos(endAngle) * innerRadius
    const y3 = Math.sin(endAngle) * innerRadius
    const x4 = Math.cos(startAngle) * innerRadius
    const y4 = Math.sin(startAngle) * innerRadius
    
    const largeArcFlag = angle > Math.PI ? 1 : 0
    
    const path = [
      `M ${x1} ${y1}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ')
    
    currentAngle += angle
    
    return {
      sector: sector.sector,
      path,
      color: getSectorColor(index),
      percentage: (percentage * 100).toFixed(1)
    }
  })
})

function getSectorColor(index) {
  return sectorColors[index % sectorColors.length]
}

function getGeoColor(index) {
  return geoColors[index % geoColors.length]
}

function getStageColor(index) {
  return stageColors[index % stageColors.length]
}

function getBarWidth(item, type) {
  const maxValue = Math.max(...geoAllocation.value.map(g => 
    type === 'amount' ? g.amount : g.companies
  ))
  const value = type === 'amount' ? item.amount : item.companies
  return (value / maxValue) * 100
}

function formatValue(value) {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(0)}M`
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toLocaleString()}`
}
</script>

<style scoped>
.allocation-charts {
  width: 100%;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.chart-card {
  min-height: 400px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.chart-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.chart-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

.chart-controls {
  display: flex;
  gap: 4px;
  background: #f3f4f6;
  padding: 2px;
  border-radius: 6px;
}

.view-toggle {
  padding: 6px 12px;
  background: transparent;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.view-toggle:hover {
  color: #374151;
}

.view-toggle.active {
  background: white;
  color: #111827;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.chart-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Donut Chart Styles */
.donut-chart {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.sector-chart {
  cursor: pointer;
}

.sector-segment {
  transition: all 0.3s ease;
  cursor: pointer;
}

.sector-segment:hover {
  opacity: 0.8;
  stroke: #374151;
  stroke-width: 2;
}

.center-label {
  font-size: 12px;
  font-weight: 500;
  fill: #6b7280;
}

.center-value {
  font-size: 14px;
  font-weight: 700;
  fill: #111827;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.legend-item:hover,
.legend-item.highlighted {
  background: #f9fafb;
}

.legend-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.legend-values {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.legend-amount {
  font-weight: 600;
  color: #111827;
  font-size: 14px;
}

.legend-percentage {
  font-size: 12px;
  color: #6b7280;
}

.legend-companies {
  font-size: 11px;
  color: #9ca3af;
}

/* Bar Chart Styles */
.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bar-container {
  display: grid;
  grid-template-columns: 120px 1fr 100px;
  gap: 12px;
  align-items: center;
}

.bar-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  text-align: right;
}

.bar-track {
  height: 24px;
  background: #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.bar-fill:hover {
  opacity: 0.8;
}

.bar-value {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  text-align: right;
}

.bar-percentage {
  font-size: 11px;
  color: #6b7280;
  font-weight: 400;
}

/* Pyramid Chart Styles */
.pyramid-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.pyramid-level {
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.pyramid-level:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.pyramid-content {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #374151;
  font-weight: 500;
}

.pyramid-label {
  font-size: 14px;
  min-width: 80px;
}

.pyramid-value {
  font-size: 14px;
  font-weight: 600;
}

.pyramid-percentage {
  font-size: 12px;
  opacity: 0.8;
}

.stage-insights {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
}

.insight-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.insight-label {
  color: #6b7280;
}

.insight-value {
  font-weight: 500;
  color: #111827;
}

.insight-value.positive {
  color: #059669;
}

.insight-value.warning {
  color: #d97706;
}

.insight-value.critical {
  color: #dc2626;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .bar-container {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .bar-label,
  .bar-value {
    text-align: left;
  }
  
  .pyramid-content {
    flex-direction: column;
    gap: 4px;
  }
  
  .pyramid-label {
    min-width: auto;
  }
}

@media (prefers-color-scheme: dark) {
  .chart-title {
    color: #f9fafb;
  }
  
  .chart-subtitle {
    color: #9ca3af;
  }
  
  .view-toggle {
    color: #d1d5db;
  }
  
  .view-toggle:hover {
    color: #f3f4f6;
  }
  
  .view-toggle.active {
    background: #374151;
    color: #f9fafb;
  }
  
  .center-label {
    fill: #9ca3af;
  }
  
  .center-value {
    fill: #f9fafb;
  }
  
  .legend-item:hover,
  .legend-item.highlighted {
    background: #374151;
  }
  
  .legend-label {
    color: #d1d5db;
  }
  
  .legend-amount {
    color: #f9fafb;
  }
  
  .bar-track {
    background: #374151;
  }
  
  .bar-label {
    color: #d1d5db;
  }
  
  .bar-value {
    color: #f9fafb;
  }
  
  .pyramid-content {
    color: #f3f4f6;
  }
  
  .stage-insights {
    background: #374151;
  }
  
  .insight-value {
    color: #f9fafb;
  }
}
</style>