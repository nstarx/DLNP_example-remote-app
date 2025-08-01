<template>
  <BaseCard>
    <div class="chart-container">
      <h3 class="chart-title">{{ title }}</h3>
      <svg :viewBox="`0 0 ${width} ${height}`" class="chart">
        <g>
          <line
            v-for="(_, i) in 5"
            :key="`grid-${i}`"
            :x1="padding"
            :x2="width - padding"
            :y1="padding + (i * (height - 2 * padding)) / 4"
            :y2="padding + (i * (height - 2 * padding)) / 4"
            class="grid-line"
          />
        </g>
        <polyline
          :points="points"
          class="chart-line"
          fill="none"
        />
        <g>
          <circle
            v-for="(point, i) in chartPoints"
            :key="`dot-${i}`"
            :cx="point.x"
            :cy="point.y"
            r="4"
            class="chart-dot"
          />
        </g>
      </svg>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '../common/BaseCard.vue'
import { CHART_COLORS } from '@/data/constants'

const props = defineProps({
  title: {
    type: String,
    default: 'Line Chart'
  },
  data: {
    type: Array,
    required: true
  },
  labels: {
    type: Array,
    required: true
  }
})

const width = 600
const height = 300
const padding = 40

const chartPoints = computed(() => {
  const max = Math.max(...props.data)
  const min = Math.min(...props.data)
  const range = max - min || 1
  
  return props.data.map((value, index) => ({
    x: padding + (index * (width - 2 * padding)) / (props.data.length - 1),
    y: height - padding - ((value - min) / range) * (height - 2 * padding)
  }))
})

const points = computed(() => {
  return chartPoints.value
    .map(point => `${point.x},${point.y}`)
    .join(' ')
})
</script>

<style scoped>
.chart-container {
  width: 100%;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #111827;
}

.chart {
  width: 100%;
  height: auto;
}

.grid-line {
  stroke: #e5e7eb;
  stroke-width: 1;
}

.chart-line {
  stroke: v-bind('CHART_COLORS.primary');
  stroke-width: 2;
}

.chart-dot {
  fill: v-bind('CHART_COLORS.primary');
}

@media (prefers-color-scheme: dark) {
  .chart-title {
    color: #f9fafb;
  }
  
  .grid-line {
    stroke: #374151;
  }
}
</style>