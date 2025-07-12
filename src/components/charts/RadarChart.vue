<template>
  <BaseCard>
    <div class="chart-container">
      <h3 class="chart-title">{{ title }}</h3>
      <svg :viewBox="`0 0 ${size} ${size}`" class="radar-chart">
        <!-- Grid lines -->
        <g class="grid">
          <circle
            v-for="i in 5"
            :key="`grid-${i}`"
            :cx="center"
            :cy="center"
            :r="(i * maxRadius) / 5"
            class="grid-circle"
          />
          <line
            v-for="(axis, index) in axes"
            :key="`axis-${index}`"
            :x1="center"
            :y1="center"
            :x2="axis.x"
            :y2="axis.y"
            class="grid-line"
          />
        </g>
        
        <!-- Labels -->
        <g class="labels">
          <text
            v-for="(label, index) in labels"
            :key="`label-${index}`"
            :x="labelPositions[index].x"
            :y="labelPositions[index].y"
            class="axis-label"
            text-anchor="middle"
          >
            {{ label }}
          </text>
        </g>
        
        <!-- Data polygon -->
        <polygon
          v-for="(dataset, dataIndex) in datasets"
          :key="`data-${dataIndex}`"
          :points="getPolygonPoints(dataset.data)"
          :class="`data-polygon data-${dataIndex}`"
          :fill="dataset.color"
          :stroke="dataset.color"
        />
        
        <!-- Data points -->
        <g v-for="(dataset, dataIndex) in datasets" :key="`points-${dataIndex}`">
          <circle
            v-for="(point, index) in getDataPoints(dataset.data)"
            :key="`point-${dataIndex}-${index}`"
            :cx="point.x"
            :cy="point.y"
            r="4"
            :fill="dataset.color"
            class="data-point"
          />
        </g>
      </svg>
      
      <!-- Legend -->
      <div class="legend">
        <div
          v-for="(dataset, index) in datasets"
          :key="`legend-${index}`"
          class="legend-item"
        >
          <div class="legend-color" :style="{ backgroundColor: dataset.color }"></div>
          <span class="legend-label">{{ dataset.name }}</span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '../common/BaseCard.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Radar Chart'
  },
  labels: {
    type: Array,
    required: true
  },
  datasets: {
    type: Array,
    required: true
  }
})

const size = 400
const center = size / 2
const maxRadius = 150
const labelOffset = 20

const axes = computed(() => {
  const angleStep = (2 * Math.PI) / props.labels.length
  return props.labels.map((_, index) => {
    const angle = index * angleStep - Math.PI / 2
    return {
      x: center + Math.cos(angle) * maxRadius,
      y: center + Math.sin(angle) * maxRadius
    }
  })
})

const labelPositions = computed(() => {
  const angleStep = (2 * Math.PI) / props.labels.length
  return props.labels.map((_, index) => {
    const angle = index * angleStep - Math.PI / 2
    const radius = maxRadius + labelOffset
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius + 5
    }
  })
})

const getDataPoints = (data) => {
  const angleStep = (2 * Math.PI) / data.length
  return data.map((value, index) => {
    const angle = index * angleStep - Math.PI / 2
    const radius = (value / 100) * maxRadius
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius
    }
  })
}

const getPolygonPoints = (data) => {
  return getDataPoints(data)
    .map(point => `${point.x},${point.y}`)
    .join(' ')
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  text-align: center;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: #111827;
}

.radar-chart {
  width: 100%;
  height: auto;
  max-width: 400px;
}

.grid-circle {
  fill: none;
  stroke: #e5e7eb;
  stroke-width: 1;
}

.grid-line {
  stroke: #e5e7eb;
  stroke-width: 1;
}

.axis-label {
  font-size: 12px;
  font-weight: 500;
  fill: #4b5563;
}

.data-polygon {
  fill-opacity: 0.2;
  stroke-width: 2;
}

.data-0 {
  fill: #3b82f6;
  stroke: #3b82f6;
}

.data-1 {
  fill: #ef4444;
  stroke: #ef4444;
}

.data-2 {
  fill: #10b981;
  stroke: #10b981;
}

.data-point {
  stroke: white;
  stroke-width: 2;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-label {
  font-size: 12px;
  color: #6b7280;
}

@media (prefers-color-scheme: dark) {
  .chart-title {
    color: #f9fafb;
  }
  
  .grid-circle,
  .grid-line {
    stroke: #374151;
  }
  
  .axis-label {
    fill: #9ca3af;
  }
  
  .legend-label {
    color: #9ca3af;
  }
}
</style>