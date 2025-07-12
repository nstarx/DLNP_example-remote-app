<template>
  <BaseCard>
    <div class="chart-container">
      <h3 class="chart-title">{{ title }}</h3>
      <svg :viewBox="`0 0 ${width} ${height}`" class="heatmap-chart">
        <!-- Heatmap cells -->
        <g class="heatmap-cells">
          <rect
            v-for="(cell, index) in cells"
            :key="`cell-${index}`"
            :x="cell.x"
            :y="cell.y"
            :width="cellWidth"
            :height="cellHeight"
            :fill="cell.color"
            class="heatmap-cell"
            @mouseover="showTooltip(cell, $event)"
            @mouseout="hideTooltip"
          />
        </g>
        
        <!-- Row labels -->
        <g class="row-labels">
          <text
            v-for="(label, index) in rowLabels"
            :key="`row-${index}`"
            :x="labelPadding - 5"
            :y="labelPadding + index * cellHeight + cellHeight / 2"
            text-anchor="end"
            dominant-baseline="middle"
            class="axis-label"
          >
            {{ label }}
          </text>
        </g>
        
        <!-- Column labels -->
        <g class="column-labels">
          <text
            v-for="(label, index) in columnLabels"
            :key="`col-${index}`"
            :x="labelPadding + index * cellWidth + cellWidth / 2"
            :y="labelPadding - 5"
            text-anchor="middle"
            dominant-baseline="text-bottom"
            class="axis-label"
          >
            {{ label }}
          </text>
        </g>
        
        <!-- Values on cells -->
        <g class="cell-values" v-if="showValues">
          <text
            v-for="(cell, index) in cells"
            :key="`value-${index}`"
            :x="cell.x + cellWidth / 2"
            :y="cell.y + cellHeight / 2"
            text-anchor="middle"
            dominant-baseline="middle"
            class="cell-value"
            :fill="getTextColor(cell.value)"
          >
            {{ formatValue(cell.value) }}
          </text>
        </g>
      </svg>
      
      <!-- Color scale legend -->
      <div class="legend">
        <div class="legend-title">{{ legendTitle }}</div>
        <div class="color-scale">
          <div
            v-for="(color, index) in colorScale"
            :key="`scale-${index}`"
            class="color-step"
            :style="{ backgroundColor: color }"
          ></div>
        </div>
        <div class="scale-labels">
          <span>{{ formatValue(minValue) }}</span>
          <span>{{ formatValue(maxValue) }}</span>
        </div>
      </div>
      
      <!-- Tooltip -->
      <div
        v-if="tooltip.visible"
        class="tooltip"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      >
        <div class="tooltip-content">
          <div class="tooltip-title">{{ tooltip.row }} vs {{ tooltip.col }}</div>
          <div class="tooltip-value">Value: {{ formatValue(tooltip.value) }}</div>
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
    default: 'Heatmap Chart'
  },
  data: {
    type: Array,
    required: true
  },
  rowLabels: {
    type: Array,
    required: true
  },
  columnLabels: {
    type: Array,
    required: true
  },
  showValues: {
    type: Boolean,
    default: false
  },
  legendTitle: {
    type: String,
    default: 'Value'
  },
  colorScheme: {
    type: String,
    default: 'blue', // 'blue', 'red', 'green', 'purple'
    validator: value => ['blue', 'red', 'green', 'purple'].includes(value)
  }
})

const labelPadding = 80
const cellWidth = 40
const cellHeight = 30
const width = labelPadding + props.columnLabels.length * cellWidth + 20
const height = labelPadding + props.rowLabels.length * cellHeight + 60

const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  row: '',
  col: '',
  value: 0
})

const flatData = computed(() => {
  const flat = []
  props.data.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      flat.push({
        value,
        row: rowIndex,
        col: colIndex,
        rowLabel: props.rowLabels[rowIndex],
        colLabel: props.columnLabels[colIndex]
      })
    })
  })
  return flat
})

const minValue = computed(() => Math.min(...flatData.value.map(d => d.value)))
const maxValue = computed(() => Math.max(...flatData.value.map(d => d.value)))

const colorSchemes = {
  blue: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e'],
  red: ['#fef2f2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#6b0f0f'],
  green: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'],
  purple: ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7c3aed', '#6d28d9', '#5b21b6']
}

const colorScale = computed(() => colorSchemes[props.colorScheme])

const getColor = (value) => {
  const normalized = (value - minValue.value) / (maxValue.value - minValue.value)
  const index = Math.floor(normalized * (colorScale.value.length - 1))
  return colorScale.value[Math.min(index, colorScale.value.length - 1)]
}

const getTextColor = (value) => {
  const normalized = (value - minValue.value) / (maxValue.value - minValue.value)
  return normalized > 0.5 ? '#ffffff' : '#000000'
}

const cells = computed(() => {
  return flatData.value.map(d => ({
    x: labelPadding + d.col * cellWidth,
    y: labelPadding + d.row * cellHeight,
    color: getColor(d.value),
    value: d.value,
    rowLabel: d.rowLabel,
    colLabel: d.colLabel
  }))
})

const formatValue = (value) => {
  if (typeof value === 'number') {
    return value % 1 === 0 ? value.toString() : value.toFixed(2)
  }
  return value
}

const showTooltip = (cell, event) => {
  const rect = event.target.getBoundingClientRect()
  tooltip.value = {
    visible: true,
    x: rect.left + window.scrollX + 10,
    y: rect.top + window.scrollY - 10,
    row: cell.rowLabel,
    col: cell.colLabel,
    value: cell.value
  }
}

const hideTooltip = () => {
  tooltip.value.visible = false
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  position: relative;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #111827;
  text-align: center;
}

.heatmap-chart {
  width: 100%;
  height: auto;
  overflow: visible;
}

.heatmap-cell {
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.heatmap-cell:hover {
  opacity: 0.8;
  stroke: #000;
  stroke-width: 2;
}

.axis-label {
  font-size: 11px;
  font-weight: 500;
  fill: #4b5563;
}

.cell-value {
  font-size: 10px;
  font-weight: 500;
  pointer-events: none;
}

.legend {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.legend-title {
  font-size: 12px;
  font-weight: 500;
  color: #4b5563;
}

.color-scale {
  display: flex;
  height: 20px;
  width: 200px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.color-step {
  flex: 1;
  height: 100%;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  width: 200px;
  font-size: 11px;
  color: #6b7280;
}

.tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.tooltip-title {
  font-weight: 600;
  margin-bottom: 4px;
}

@media (prefers-color-scheme: dark) {
  .chart-title {
    color: #f9fafb;
  }
  
  .axis-label {
    fill: #9ca3af;
  }
  
  .legend-title {
    color: #9ca3af;
  }
  
  .scale-labels {
    color: #9ca3af;
  }
  
  .color-scale {
    border-color: #374151;
  }
  
  .tooltip {
    background: rgba(255, 255, 255, 0.9);
    color: #111827;
  }
}
</style>