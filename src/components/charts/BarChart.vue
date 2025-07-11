<template>
  <div class="chart-container">
    <h3 class="chart-title">{{ title }}</h3>
    <svg :viewBox="`0 0 ${width} ${height}`" class="chart">
      <g>
        <rect
          v-for="(bar, i) in bars"
          :key="`bar-${i}`"
          :x="bar.x"
          :y="bar.y"
          :width="barWidth"
          :height="bar.height"
          class="chart-bar"
        />
      </g>
      <g>
        <text
          v-for="(label, i) in labels"
          :key="`label-${i}`"
          :x="bars[i].x + barWidth / 2"
          :y="height - 10"
          class="chart-label"
          text-anchor="middle"
        >
          {{ label.length > 8 ? label.substring(0, 8) + '...' : label }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Bar Chart'
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
const barWidth = 40

const bars = computed(() => {
  const max = Math.max(...props.data)
  const chartHeight = height - padding * 2
  
  return props.data.map((value, index) => {
    const barHeight = (value / max) * chartHeight
    return {
      x: padding + index * (barWidth + 20),
      y: height - padding - barHeight,
      height: barHeight
    }
  })
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

.chart-bar {
  fill: #10b981;
  transition: fill 0.3s ease;
}

.chart-bar:hover {
  fill: #059669;
}

.chart-label {
  fill: #6b7280;
  font-size: 12px;
}

@media (prefers-color-scheme: dark) {
  .chart-title {
    color: #f9fafb;
  }
  
  .chart-label {
    fill: #9ca3af;
  }
}
</style>