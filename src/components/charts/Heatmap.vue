<template>
  <div class="heatmap-container">
    <div class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
      <div class="chart-controls">
        <select v-model="selectedMetric" @change="updateChart" class="metric-selector">
          <option value="incidence">Incidence Rate</option>
          <option value="mortality">Mortality Rate</option>
          <option value="prevalence">Prevalence</option>
          <option value="treatment_success">Treatment Success</option>
          <option value="mdr_tb">MDR-TB Cases</option>
          <option value="hiv_tb">HIV-TB Co-infection</option>
        </select>
      </div>
    </div>
    <div class="chart-content">
      <canvas ref="chartCanvas" :width="width" :height="height"></canvas>
      <div class="color-scale">
        <div class="scale-label">{{ scaleLabel }}</div>
        <div class="scale-bar">
          <div class="scale-gradient" :style="{ background: colorGradient }"></div>
          <div class="scale-values">
            <span class="scale-min">{{ formatValue(scaleMin) }}</span>
            <span class="scale-max">{{ formatValue(scaleMax) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-tooltip" ref="tooltip" v-show="tooltipVisible" :style="tooltipStyle">
      <div class="tooltip-content">
        <strong>{{ tooltipData.country }}</strong>
        <div>{{ scaleLabel }}: {{ formatValue(tooltipData.value) }}</div>
        <div>Region: {{ tooltipData.region }}</div>
        <div>Income: {{ tooltipData.income }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'TB Burden Heatmap'
  },
  width: {
    type: Number,
    default: 1000
  },
  height: {
    type: Number,
    default: 600
  }
});

const chartCanvas = ref(null);
const tooltip = ref(null);
const selectedMetric = ref('incidence');
const tooltipVisible = ref(false);
const tooltipData = ref({});
const tooltipStyle = ref({});

let ctx = null;
const cellSize = 40;
const padding = 60;

const scaleLabel = computed(() => {
  const labels = {
    incidence: 'Incidence Rate (per 100,000)',
    mortality: 'Mortality Rate (per 100,000)',
    prevalence: 'Prevalence (per 100,000)',
    treatment_success: 'Treatment Success Rate (%)',
    mdr_tb: 'MDR-TB Cases',
    hiv_tb: 'HIV-TB Co-infection Cases'
  };
  return labels[selectedMetric.value] || selectedMetric.value;
});

const processedData = computed(() => {
  if (!props.data || props.data.length === 0) return [];
  
  return props.data.map(country => ({
    ...country,
    value: country[selectedMetric.value] || 0
  })).sort((a, b) => b.value - a.value);
});

const scaleMin = computed(() => {
  if (processedData.value.length === 0) return 0;
  return Math.min(...processedData.value.map(d => d.value));
});

const scaleMax = computed(() => {
  if (processedData.value.length === 0) return 100;
  return Math.max(...processedData.value.map(d => d.value));
});

const colorGradient = computed(() => {
  return 'linear-gradient(to right, #fef3c7, #fcd34d, #f59e0b, #d97706, #b45309, #92400e, #78350f)';
});

const getColorForValue = (value) => {
  if (scaleMax.value === scaleMin.value) return '#fcd34d';
  
  const normalized = (value - scaleMin.value) / (scaleMax.value - scaleMin.value);
  const colors = [
    [254, 243, 199], // Light yellow
    [252, 211, 77],  // Yellow
    [245, 158, 11],  // Orange
    [217, 119, 6],   // Dark orange
    [180, 83, 9],    // Brown
    [146, 64, 14],   // Dark brown
    [120, 53, 15]    // Darkest brown
  ];
  
  const colorIndex = Math.floor(normalized * (colors.length - 1));
  const nextColorIndex = Math.min(colorIndex + 1, colors.length - 1);
  const factor = (normalized * (colors.length - 1)) - colorIndex;
  
  const color1 = colors[colorIndex];
  const color2 = colors[nextColorIndex];
  
  const r = Math.round(color1[0] + factor * (color2[0] - color1[0]));
  const g = Math.round(color1[1] + factor * (color2[1] - color1[1]));
  const b = Math.round(color1[2] + factor * (color2[2] - color1[2]));
  
  return `rgb(${r}, ${g}, ${b})`;
};

const formatValue = (value) => {
  if (value === undefined || value === null) return 'N/A';
  
  if (selectedMetric.value === 'treatment_success') {
    return `${value.toFixed(1)}%`;
  }
  
  if (selectedMetric.value === 'mdr_tb' || selectedMetric.value === 'hiv_tb') {
    return value.toLocaleString();
  }
  
  return value.toFixed(1);
};

const drawChart = () => {
  if (!ctx || processedData.value.length === 0) return;
  
  const { width, height } = props;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Calculate grid dimensions
  const cols = Math.floor((width - 2 * padding) / cellSize);
  const rows = Math.ceil(processedData.value.length / cols);
  
  // Draw title
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Countries by ' + scaleLabel.value, width / 2, 30);
  
  // Draw cells
  processedData.value.forEach((country, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    const x = padding + col * cellSize;
    const y = padding + row * cellSize;
    
    // Draw cell background
    ctx.fillStyle = getColorForValue(country.value);
    ctx.fillRect(x, y, cellSize - 2, cellSize - 2);
    
    // Draw border
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, cellSize - 2, cellSize - 2);
    
    // Draw country code (first 3 letters)
    ctx.fillStyle = '#1f2937';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      country.country.substring(0, 3).toUpperCase(),
      x + cellSize / 2,
      y + cellSize / 2 - 5
    );
    
    // Draw value
    ctx.font = '8px Arial';
    ctx.fillText(
      formatValue(country.value),
      x + cellSize / 2,
      y + cellSize / 2 + 5
    );
  });
  
  // Store cell positions for mouse interaction
  processedData.value.forEach((country, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    country._x = padding + col * cellSize;
    country._y = padding + row * cellSize;
    country._width = cellSize - 2;
    country._height = cellSize - 2;
  });
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
  
  let hoveredCountry = null;
  
  processedData.value.forEach(country => {
    if (country._x !== undefined && country._y !== undefined &&
        mouseX >= country._x && mouseX <= country._x + country._width &&
        mouseY >= country._y && mouseY <= country._y + country._height) {
      hoveredCountry = country;
    }
  });
  
  if (hoveredCountry) {
    tooltipVisible.value = true;
    tooltipData.value = {
      country: hoveredCountry.country,
      value: hoveredCountry.value,
      region: hoveredCountry.region,
      income: hoveredCountry.income_group
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

watch(selectedMetric, () => {
  updateChart();
});

watch(() => props.data, () => {
  updateChart();
}, { deep: true });
</script>

<style scoped>
.heatmap-container {
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

.metric-selector {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
}

.metric-selector:hover {
  border-color: #9ca3af;
}

.chart-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.color-scale {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.scale-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.scale-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.scale-gradient {
  width: 300px;
  height: 20px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
}

.scale-values {
  display: flex;
  justify-content: space-between;
  width: 300px;
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
  .heatmap-container {
    background: #1f2937;
    color: #f9fafb;
  }
  
  .chart-title {
    color: #f9fafb;
  }
  
  .metric-selector {
    background: #374151;
    color: #f9fafb;
    border-color: #4b5563;
  }
  
  .scale-label {
    color: #f9fafb;
  }
  
  .scale-values {
    color: #d1d5db;
  }
}
</style>