<template>
  <div class="match-progression-chart">
    <div class="chart-header">
      <h3 class="chart-title">Match Progression</h3>
      <div class="chart-controls">
        <button 
          v-for="view in ['Runs', 'Run Rate', 'Wickets']"
          :key="view"
          :class="{ active: activeView === view }"
          @click="activeView = view"
          class="view-button"
        >
          {{ view }}
        </button>
      </div>
    </div>
    
    <div class="chart-container">
      <svg :width="chartWidth" :height="chartHeight" class="progression-chart">
        <!-- Grid lines -->
        <g class="grid">
          <line
            v-for="i in 5"
            :key="`h-${i}`"
            :x1="padding.left"
            :y1="padding.top + (chartHeight - padding.top - padding.bottom) * (i - 1) / 4"
            :x2="chartWidth - padding.right"
            :y2="padding.top + (chartHeight - padding.top - padding.bottom) * (i - 1) / 4"
            stroke="#374151"
            stroke-dasharray="2,2"
          />
          <line
            v-for="i in 10"
            :key="`v-${i}`"
            :x1="padding.left + (chartWidth - padding.left - padding.right) * (i - 1) / 9"
            :y1="padding.top"
            :x2="padding.left + (chartWidth - padding.left - padding.right) * (i - 1) / 9"
            :y2="chartHeight - padding.bottom"
            stroke="#374151"
            stroke-dasharray="2,2"
          />
        </g>
        
        <!-- India line -->
        <path
          :d="indiaPath"
          fill="none"
          stroke="#10b981"
          stroke-width="3"
          class="india-line"
        />
        
        <!-- England line -->
        <path
          :d="englandPath"
          fill="none"
          stroke="#ef4444"
          stroke-width="3"
          class="england-line"
        />
        
        <!-- Data points -->
        <g class="data-points">
          <circle
            v-for="(point, index) in indiaPoints"
            :key="`india-${index}`"
            :cx="point.x"
            :cy="point.y"
            r="4"
            fill="#10b981"
            class="data-point"
            @mouseover="showTooltip($event, point, 'India')"
            @mouseout="hideTooltip"
          />
          <circle
            v-for="(point, index) in englandPoints"
            :key="`england-${index}`"
            :cx="point.x"
            :cy="point.y"
            r="4"
            fill="#ef4444"
            class="data-point"
            @mouseover="showTooltip($event, point, 'England')"
            @mouseout="hideTooltip"
          />
        </g>
        
        <!-- Axes -->
        <g class="axes">
          <!-- X-axis -->
          <line
            :x1="padding.left"
            :y1="chartHeight - padding.bottom"
            :x2="chartWidth - padding.right"
            :y2="chartHeight - padding.bottom"
            stroke="#6b7280"
            stroke-width="2"
          />
          
          <!-- Y-axis -->
          <line
            :x1="padding.left"
            :y1="padding.top"
            :x2="padding.left"
            :y2="chartHeight - padding.bottom"
            stroke="#6b7280"
            stroke-width="2"
          />
        </g>
        
        <!-- Axis labels -->
        <g class="axis-labels">
          <text
            v-for="i in 6"
            :key="`x-${i}`"
            :x="padding.left + (chartWidth - padding.left - padding.right) * (i - 1) / 5"
            :y="chartHeight - padding.bottom + 20"
            text-anchor="middle"
            fill="#94a3b8"
            font-size="12"
          >
            {{ Math.round(maxOvers * (i - 1) / 5) }}
          </text>
          
          <text
            v-for="i in 5"
            :key="`y-${i}`"
            :x="padding.left - 10"
            :y="padding.top + (chartHeight - padding.top - padding.bottom) * (5 - i) / 4 + 5"
            text-anchor="end"
            fill="#94a3b8"
            font-size="12"
          >
            {{ Math.round(maxRuns * (i - 1) / 4) }}
          </text>
        </g>
        
        <!-- Axis titles -->
        <text
          :x="(chartWidth - padding.left - padding.right) / 2 + padding.left"
          :y="chartHeight - 5"
          text-anchor="middle"
          fill="#e5e7eb"
          font-size="14"
          font-weight="600"
        >
          Overs
        </text>
        
        <text
          :x="15"
          :y="(chartHeight - padding.top - padding.bottom) / 2 + padding.top"
          text-anchor="middle"
          fill="#e5e7eb"
          font-size="14"
          font-weight="600"
          transform="rotate(-90, 15, 200)"
        >
          {{ activeView === 'Runs' ? 'Runs' : activeView === 'Run Rate' ? 'Run Rate' : 'Wickets' }}
        </text>
      </svg>
      
      <!-- Legend -->
      <div class="chart-legend">
        <div class="legend-item">
          <div class="legend-color india"></div>
          <span>India</span>
        </div>
        <div class="legend-item">
          <div class="legend-color england"></div>
          <span>England</span>
        </div>
      </div>
    </div>
    
    <!-- Tooltip -->
    <div
      v-if="tooltip.show"
      class="tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <div class="tooltip-content">
        <div class="tooltip-team">{{ tooltip.team }}</div>
        <div class="tooltip-data">
          Over: {{ tooltip.over }} | {{ activeView }}: {{ tooltip.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const activeView = ref('Runs')
const tooltip = ref({ show: false, x: 0, y: 0, team: '', over: 0, value: 0 })

const chartWidth = ref(800)
const chartHeight = ref(400)
const padding = { top: 40, right: 40, bottom: 60, left: 60 }

const maxOvers = computed(() => 
  Math.max(...props.data.labels)
)

const maxRuns = computed(() => {
  const indiaData = props.data.datasets[0].data
  const englandData = props.data.datasets[1].data
  return Math.max(...indiaData, ...englandData) * 1.1
})

const indiaPoints = computed(() => {
  const data = props.data.datasets[0].data
  return data.map((value, index) => ({
    x: padding.left + (chartWidth.value - padding.left - padding.right) * index / (data.length - 1),
    y: chartHeight.value - padding.bottom - (chartHeight.value - padding.top - padding.bottom) * value / maxRuns.value,
    over: index + 1,
    value: value
  }))
})

const englandPoints = computed(() => {
  const data = props.data.datasets[1].data
  return data.map((value, index) => ({
    x: padding.left + (chartWidth.value - padding.left - padding.right) * index / (data.length - 1),
    y: chartHeight.value - padding.bottom - (chartHeight.value - padding.top - padding.bottom) * value / maxRuns.value,
    over: index + 1,
    value: value
  }))
})

const indiaPath = computed(() => {
  if (indiaPoints.value.length === 0) return ''
  
  let path = `M ${indiaPoints.value[0].x} ${indiaPoints.value[0].y}`
  
  for (let i = 1; i < indiaPoints.value.length; i++) {
    path += ` L ${indiaPoints.value[i].x} ${indiaPoints.value[i].y}`
  }
  
  return path
})

const englandPath = computed(() => {
  if (englandPoints.value.length === 0) return ''
  
  let path = `M ${englandPoints.value[0].x} ${englandPoints.value[0].y}`
  
  for (let i = 1; i < englandPoints.value.length; i++) {
    path += ` L ${englandPoints.value[i].x} ${englandPoints.value[i].y}`
  }
  
  return path
})

function showTooltip(event, point, team) {
  tooltip.value = {
    show: true,
    x: event.pageX + 10,
    y: event.pageY - 10,
    team: team,
    over: point.over,
    value: point.value
  }
}

function hideTooltip() {
  tooltip.value.show = false
}

function handleResize() {
  chartWidth.value = Math.min(800, window.innerWidth - 100)
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.match-progression-chart {
  background: #1e293b;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #374151;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.chart-title {
  font-size: 20px;
  font-weight: 700;
  color: #e5e7eb;
  margin: 0;
}

.chart-controls {
  display: flex;
  gap: 8px;
}

.view-button {
  padding: 8px 16px;
  background: #374151;
  border: none;
  border-radius: 8px;
  color: #94a3b8;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-button:hover {
  background: #4b5563;
  color: white;
}

.view-button.active {
  background: #10b981;
  color: white;
}

.chart-container {
  position: relative;
  width: 100%;
  overflow-x: auto;
}

.progression-chart {
  width: 100%;
  height: 400px;
}

.data-point {
  cursor: pointer;
  transition: r 0.2s ease;
}

.data-point:hover {
  r: 6;
}

.india-line {
  filter: drop-shadow(0 0 4px rgba(16, 185, 129, 0.3));
}

.england-line {
  filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.3));
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e5e7eb;
  font-weight: 600;
}

.legend-color {
  width: 16px;
  height: 3px;
  border-radius: 2px;
}

.legend-color.india {
  background: #10b981;
}

.legend-color.england {
  background: #ef4444;
}

.tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  pointer-events: none;
  z-index: 1000;
  border: 1px solid #374151;
}

.tooltip-team {
  font-weight: 700;
  margin-bottom: 4px;
}

.tooltip-data {
  font-size: 12px;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .chart-controls {
    width: 100%;
    justify-content: center;
  }
  
  .view-button {
    flex: 1;
  }
}
</style>