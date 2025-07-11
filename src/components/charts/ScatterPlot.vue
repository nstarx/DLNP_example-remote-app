<template>
  <div class="scatter-plot-container">
    <div class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
      <div class="chart-controls">
        <select v-model="selectedXAxis" @change="updateChart" class="axis-selector">
          <option value="incidence">Incidence Rate</option>
          <option value="mortality">Mortality Rate</option>
          <option value="prevalence">Prevalence</option>
          <option value="treatment_success">Treatment Success</option>
        </select>
        <select v-model="selectedYAxis" @change="updateChart" class="axis-selector">
          <option value="mortality">Mortality Rate</option>
          <option value="incidence">Incidence Rate</option>
          <option value="prevalence">Prevalence</option>
          <option value="treatment_success">Treatment Success</option>
        </select>
      </div>
    </div>
    <div class="chart-content">
      <canvas ref="chartCanvas" :width="width" :height="height"></canvas>
      <div class="chart-legend">
        <div class="legend-item" v-for="region in regions" :key="region.code">
          <div class="legend-color" :style="{ backgroundColor: region.color }"></div>
          <span class="legend-label">{{ region.name }}</span>
        </div>
      </div>
    </div>
    <div class="chart-tooltip" ref="tooltip" v-show="tooltipVisible" :style="tooltipStyle">
      <div class="tooltip-content">
        <strong>{{ tooltipData.country }}</strong>
        <div>{{ xAxisLabel }}: {{ tooltipData.x }}</div>
        <div>{{ yAxisLabel }}: {{ tooltipData.y }}</div>
        <div>Population: {{ tooltipData.population?.toLocaleString() }}</div>
        <div>Region: {{ tooltipData.region }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'TB Burden Correlation Analysis'
  },
  width: {
    type: Number,
    default: 800
  },
  height: {
    type: Number,
    default: 500
  },
  regions: {
    type: Array,
    required: true
  }
});

const chartCanvas = ref(null);
const tooltip = ref(null);
const selectedXAxis = ref('incidence');
const selectedYAxis = ref('mortality');
const tooltipVisible = ref(false);
const tooltipData = ref({});
const tooltipStyle = ref({});

let ctx = null;
let animationId = null;

const xAxisLabel = computed(() => {
  const labels = {
    incidence: 'Incidence Rate (per 100,000)',
    mortality: 'Mortality Rate (per 100,000)',
    prevalence: 'Prevalence (per 100,000)',
    treatment_success: 'Treatment Success Rate (%)'
  };
  return labels[selectedXAxis.value] || selectedXAxis.value;
});

const yAxisLabel = computed(() => {
  const labels = {
    incidence: 'Incidence Rate (per 100,000)',
    mortality: 'Mortality Rate (per 100,000)',
    prevalence: 'Prevalence (per 100,000)',
    treatment_success: 'Treatment Success Rate (%)'
  };
  return labels[selectedYAxis.value] || selectedYAxis.value;
});

const processedData = computed(() => {
  if (!props.data || props.data.length === 0) return [];
  
  return props.data.map(country => {
    const region = props.regions.find(r => r.code === country.who_region);
    return {
      ...country,
      x: country[selectedXAxis.value],
      y: country[selectedYAxis.value],
      color: region?.color || '#999',
      regionName: region?.name || country.who_region
    };
  }).filter(d => d.x !== undefined && d.y !== undefined);
});

const chartBounds = computed(() => {
  if (processedData.value.length === 0) return { minX: 0, maxX: 100, minY: 0, maxY: 100 };
  
  const xValues = processedData.value.map(d => d.x);
  const yValues = processedData.value.map(d => d.y);
  
  return {
    minX: Math.min(...xValues),
    maxX: Math.max(...xValues),
    minY: Math.min(...yValues),
    maxY: Math.max(...yValues)
  };
});

const drawChart = () => {
  if (!ctx || processedData.value.length === 0) return;
  
  const { width, height } = props;
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw grid
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  
  // Vertical grid lines
  for (let i = 0; i <= 10; i++) {
    const x = padding + (i / 10) * chartWidth;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, height - padding);
    ctx.stroke();
  }
  
  // Horizontal grid lines
  for (let i = 0; i <= 10; i++) {
    const y = padding + (i / 10) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }
  
  // Draw axes
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 2;
  
  // X-axis
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();
  
  // Y-axis
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.stroke();
  
  // Draw axis labels
  ctx.fillStyle = '#374151';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  // X-axis labels
  for (let i = 0; i <= 5; i++) {
    const value = chartBounds.value.minX + (i / 5) * (chartBounds.value.maxX - chartBounds.value.minX);
    const x = padding + (i / 5) * chartWidth;
    ctx.fillText(Math.round(value), x, height - padding + 5);
  }
  
  // Y-axis labels
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= 5; i++) {
    const value = chartBounds.value.minY + (i / 5) * (chartBounds.value.maxY - chartBounds.value.minY);
    const y = height - padding - (i / 5) * chartHeight;
    ctx.fillText(Math.round(value), padding - 5, y);
  }
  
  // Draw data points
  processedData.value.forEach(point => {
    const x = padding + ((point.x - chartBounds.value.minX) / (chartBounds.value.maxX - chartBounds.value.minX)) * chartWidth;
    const y = height - padding - ((point.y - chartBounds.value.minY) / (chartBounds.value.maxY - chartBounds.value.minY)) * chartHeight;
    
    const radius = Math.sqrt(point.population / 1000000) * 3 + 3; // Size by population
    
    ctx.fillStyle = point.color;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw border
    ctx.strokeStyle = point.color;
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  
  // Draw axis titles
  ctx.fillStyle = '#374151';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(xAxisLabel.value, width / 2, height - 30);
  
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(yAxisLabel.value, 0, 0);
  ctx.restore();
};

const updateChart = () => {
  if (ctx) {
    drawChart();
  }
};

const handleMouseMove = (event) => {
  if (!chartCanvas.value) return;
  
  const rect = chartCanvas.value.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  const padding = 60;
  const chartWidth = props.width - 2 * padding;
  const chartHeight = props.height - 2 * padding;
  
  let hoveredPoint = null;
  
  processedData.value.forEach(point => {
    const x = padding + ((point.x - chartBounds.value.minX) / (chartBounds.value.maxX - chartBounds.value.minX)) * chartWidth;
    const y = props.height - padding - ((point.y - chartBounds.value.minY) / (chartBounds.value.maxY - chartBounds.value.minY)) * chartHeight;
    
    const radius = Math.sqrt(point.population / 1000000) * 3 + 3;
    const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
    
    if (distance <= radius) {
      hoveredPoint = point;
    }
  });
  
  if (hoveredPoint) {
    tooltipVisible.value = true;
    tooltipData.value = {
      country: hoveredPoint.country,
      x: hoveredPoint.x,
      y: hoveredPoint.y,
      population: hoveredPoint.population,
      region: hoveredPoint.regionName
    };
    tooltipStyle.value = {
      left: `${event.clientX + 10}px`,
      top: `${event.clientY - 10}px`
    };
  } else {
    tooltipVisible.value = false;
  }
};

const handleMouseLeave = () => {
  tooltipVisible.value = false;
};

onMounted(() => {
  if (chartCanvas.value) {
    ctx = chartCanvas.value.getContext('2d');
    drawChart();
    
    chartCanvas.value.addEventListener('mousemove', handleMouseMove);
    chartCanvas.value.addEventListener('mouseleave', handleMouseLeave);
  }
});

watch([selectedXAxis, selectedYAxis], () => {
  updateChart();
});

watch(() => props.data, () => {
  updateChart();
}, { deep: true });
</script>

<style scoped>
.scatter-plot-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 20px;
  position: relative;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.chart-controls {
  display: flex;
  gap: 10px;
}

.axis-selector {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
}

.axis-selector:hover {
  border-color: #9ca3af;
}

.chart-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 150px;
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

.chart-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 10px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

@media (prefers-color-scheme: dark) {
  .scatter-plot-container {
    background: #1f2937;
    color: #f9fafb;
  }
  
  .chart-title {
    color: #f9fafb;
  }
  
  .axis-selector {
    background: #374151;
    color: #f9fafb;
    border-color: #4b5563;
  }
  
  .legend-label {
    color: #d1d5db;
  }
}
</style>