<template>
  <BaseCard>
    <div class="chart-container">
      <h3 class="chart-title">{{ title }}</h3>
      <svg :viewBox="`0 0 ${width} ${height}`" class="scatter-plot">
        <!-- Grid lines -->
        <g class="grid">
          <line
            v-for="i in 5"
            :key="`grid-x-${i}`"
            :x1="padding + (i * (width - 2 * padding)) / 4"
            :x2="padding + (i * (width - 2 * padding)) / 4"
            :y1="padding"
            :y2="height - padding"
            class="grid-line"
          />
          <line
            v-for="i in 5"
            :key="`grid-y-${i}`"
            :x1="padding"
            :x2="width - padding"
            :y1="padding + (i * (height - 2 * padding)) / 4"
            :y2="padding + (i * (height - 2 * padding)) / 4"
            class="grid-line"
          />
        </g>
        
        <!-- Axes -->
        <g class="axes">
          <line
            :x1="padding"
            :x2="width - padding"
            :y1="height - padding"
            :y2="height - padding"
            class="axis-line"
          />
          <line
            :x1="padding"
            :x2="padding"
            :y1="padding"
            :y2="height - padding"
            class="axis-line"
          />
        </g>
        
        <!-- Data points -->
        <g class="data-points">
          <circle
            v-for="(point, index) in scaledPoints"
            :key="`point-${index}`"
            :cx="point.x"
            :cy="point.y"
            :r="point.size || 4"
            :fill="point.color || '#3b82f6'"
            :stroke="point.color || '#3b82f6'"
            class="data-point"
            @mouseover="showTooltip(point, index, $event)"
            @mouseout="hideTooltip"
          />
        </g>
        
        <!-- Axis labels -->
        <g class="axis-labels">
          <text
            :x="width / 2"
            :y="height - 10"
            text-anchor="middle"
            class="axis-label"
          >
            {{ xLabel }}
          </text>
          <text
            :x="15"
            :y="height / 2"
            text-anchor="middle"
            class="axis-label"
            transform="rotate(-90 15 200)"
          >
            {{ yLabel }}
          </text>
        </g>
      </svg>
      
      <!-- Tooltip -->
      <div
        v-if="tooltip.visible"
        class="tooltip"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      >
        <div class="tooltip-content">
          <div class="tooltip-title">{{ tooltip.title }}</div>
          <div class="tooltip-info">
            <div>{{ xLabel }}: {{ tooltip.xValue }}</div>
            <div>{{ yLabel }}: {{ tooltip.yValue }}</div>
            <div v-if="tooltip.extra">{{ tooltip.extra }}</div>
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
    default: 'Scatter Plot'
  },
  data: {
    type: Array,
    required: true
  },
  xLabel: {
    type: String,
    default: 'X Axis'
  },
  yLabel: {
    type: String,
    default: 'Y Axis'
  }
})

const width = 600
const height = 400
const padding = 60

const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  title: '',
  xValue: '',
  yValue: '',
  extra: ''
})

const xExtent = computed(() => {
  const values = props.data.map(d => d.x)
  return [Math.min(...values), Math.max(...values)]
})

const yExtent = computed(() => {
  const values = props.data.map(d => d.y)
  return [Math.min(...values), Math.max(...values)]
})

const scaledPoints = computed(() => {
  const xScale = (width - 2 * padding) / (xExtent.value[1] - xExtent.value[0])
  const yScale = (height - 2 * padding) / (yExtent.value[1] - yExtent.value[0])
  
  return props.data.map(point => ({
    ...point,
    x: padding + (point.x - xExtent.value[0]) * xScale,
    y: height - padding - (point.y - yExtent.value[0]) * yScale
  }))
})

const showTooltip = (point, index, event) => {
  const rect = event.target.getBoundingClientRect()
  tooltip.value = {
    visible: true,
    x: rect.left + window.scrollX + 10,
    y: rect.top + window.scrollY - 10,
    title: point.label || `Point ${index + 1}`,
    xValue: point.x,
    yValue: point.y,
    extra: point.extra || ''
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

.scatter-plot {
  width: 100%;
  height: auto;
}

.grid-line {
  stroke: #e5e7eb;
  stroke-width: 1;
}

.axis-line {
  stroke: #374151;
  stroke-width: 2;
}

.axis-label {
  font-size: 12px;
  font-weight: 500;
  fill: #4b5563;
}

.data-point {
  stroke-width: 2;
  stroke-opacity: 0.7;
  fill-opacity: 0.7;
  cursor: pointer;
  transition: all 0.2s ease;
}

.data-point:hover {
  stroke-width: 3;
  stroke-opacity: 1;
  fill-opacity: 1;
  r: 6;
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

.tooltip-info div {
  margin-bottom: 2px;
}

.tooltip-info div:last-child {
  margin-bottom: 0;
}

@media (prefers-color-scheme: dark) {
  .chart-title {
    color: #f9fafb;
  }
  
  .grid-line {
    stroke: #374151;
  }
  
  .axis-line {
    stroke: #9ca3af;
  }
  
  .axis-label {
    fill: #9ca3af;
  }
  
  .tooltip {
    background: rgba(255, 255, 255, 0.9);
    color: #111827;
  }
}
</style>