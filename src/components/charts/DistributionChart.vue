


<template>
  <BaseCard class="distribution-chart">
    <div class="chart-header">
      <h3>{{ title }}</h3>
    </div>
    <div class="chart-container">
      <div class="distribution-summary">
        <div class="summary-item">
          <span class="label">Min:</span>
          <span class="value">{{ minValue }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Max:</span>
          <span class="value">{{ maxValue }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Mean:</span>
          <span class="value">{{ meanValue.toFixed(2) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Median:</span>
          <span class="value">{{ medianValue }}</span>
        </div>
      </div>
      <div class="histogram-chart">
        <div v-for="(bar, index) in histogramBars" :key="index" class="histogram-bar">
          <div class="bar-label">{{ bar.label }}</div>
          <div class="bar-container">
            <div class="bar" :style="{ width: bar.width + '%' }"></div>
          </div>
          <div class="bar-count">{{ bar.count }}</div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  bins: {
    type: Number,
    default: 10
  }
})

const minValue = computed(() => Math.min(...props.data))
const maxValue = computed(() => Math.max(...props.data))
const meanValue = computed(() => {
  const sum = props.data.reduce((a, b) => a + b, 0)
  return sum / props.data.length
})
const medianValue = computed(() => {
  const sorted = [...props.data].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
})

const histogramBars = computed(() => {
  const min = minValue.value
  const max = maxValue.value
  const binSize = (max - min) / props.bins

  const histogram = Array(props.bins).fill(0)

  props.data.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binSize), props.bins - 1)
    histogram[binIndex]++
  })

  const maxCount = Math.max(...histogram)

  return histogram.map((count, i) => {
    const binStart = min + i * binSize
    const binEnd = binStart + binSize
    return {
      label: `${binStart.toFixed(0)}-${binEnd.toFixed(0)}`,
      count,
      width: maxCount > 0 ? (count / maxCount) * 100 : 0
    }
  })
})
</script>

<style scoped>
.distribution-chart {
  width: 100%;
  height: 400px;
}

.chart-header {
  margin-bottom: 16px;
}

.chart-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.distribution-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
}

.label {
  color: #6b7280;
  font-weight: 500;
}

.value {
  color: #111827;
  font-weight: 600;
}

.histogram-chart {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.histogram-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.bar-label {
  width: 80px;
  color: #6b7280;
}

.bar-container {
  flex: 1;
  background: #f3f4f6;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: #3b82f6;
  border-radius: 4px;
}

.bar-count {
  width: 40px;
  text-align: right;
  color: #374151;
}

@media (prefers-color-scheme: dark) {
  .distribution-chart {
    background: #1f2937;
  }

  .chart-header h3 {
    color: #f9fafb;
  }

  .label, .bar-count {
    color: #9ca3af;
  }

  .value {
    color: #f9fafb;
  }

  .bar-container {
    background: #374151;
  }

  .bar {
    background: #60a5fa;
  }
}
</style>


