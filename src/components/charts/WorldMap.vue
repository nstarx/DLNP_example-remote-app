<template>
  <div class="world-map-container">
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
      <svg ref="mapSvg" :width="width" :height="height" class="world-map-svg">
        <!-- Country circles -->
        <circle
          v-for="country in processedData"
          :key="country.country"
          :cx="getX(country.longitude)"
          :cy="getY(country.latitude)"
          :r="getRadius(country.value)"
          :fill="getColor(country.value)"
          :stroke="getColor(country.value)"
          :stroke-width="2"
          :opacity="0.7"
          @mouseover="showTooltip($event, country)"
          @mouseleave="hideTooltip"
          class="country-circle"
        />
        
        <!-- Grid lines -->
        <g class="grid-lines">
          <line
            v-for="lng in gridLongitudes"
            :key="`lng-${lng}`"
            :x1="getX(lng)"
            :y1="padding"
            :x2="getX(lng)"
            :y2="height - padding"
            stroke="#e5e7eb"
            stroke-width="1"
            opacity="0.3"
          />
          <line
            v-for="lat in gridLatitudes"
            :key="`lat-${lat}`"
            :x1="padding"
            :y1="getY(lat)"
            :x2="width - padding"
            :y2="getY(lat)"
            stroke="#e5e7eb"
            stroke-width="1"
            opacity="0.3"
          />
        </g>
        
        <!-- Axis labels -->
        <g class="axis-labels">
          <text
            v-for="lng in axisLongitudes"
            :key="`lng-label-${lng}`"
            :x="getX(lng)"
            :y="height - padding + 20"
            text-anchor="middle"
            font-size="12"
            fill="#6b7280"
          >
            {{ lng }}°
          </text>
          <text
            v-for="lat in axisLatitudes"
            :key="`lat-label-${lat}`"
            :x="padding - 10"
            :y="getY(lat)"
            text-anchor="end"
            dominant-baseline="middle"
            font-size="12"
            fill="#6b7280"
          >
            {{ lat }}°
          </text>
        </g>
        
        <!-- Axis titles -->
        <text
          :x="width / 2"
          :y="height - 10"
          text-anchor="middle"
          font-size="14"
          font-weight="bold"
          fill="#374151"
        >
          Longitude
        </text>
        <text
          :x="15"
          :y="height / 2"
          text-anchor="middle"
          font-size="14"
          font-weight="bold"
          fill="#374151"
          transform="rotate(-90, 15, ${height / 2})"
        >
          Latitude
        </text>
      </svg>
      
      <div class="map-legend">
        <div class="legend-title">{{ scaleLabel }}</div>
        <div class="legend-scale">
          <div class="legend-circles">
            <div
              v-for="(size, index) in legendSizes"
              :key="index"
              class="legend-circle-item"
            >
              <div
                class="legend-circle"
                :style="{
                  width: size.radius * 2 + 'px',
                  height: size.radius * 2 + 'px',
                  backgroundColor: getColor(size.value),
                  borderRadius: '50%'
                }"
              ></div>
              <span class="legend-value">{{ formatValue(size.value) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chart-tooltip" ref="tooltip" v-show="tooltipVisible" :style="tooltipStyle">
      <div class="tooltip-content">
        <strong>{{ tooltipData.country }}</strong>
        <div>{{ scaleLabel }}: {{ formatValue(tooltipData.value) }}</div>
        <div>Region: {{ tooltipData.region }}</div>
        <div>Coordinates: {{ tooltipData.latitude?.toFixed(2) }}°, {{ tooltipData.longitude?.toFixed(2) }}°</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Global TB Burden Map'
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

const mapSvg = ref(null);
const tooltip = ref(null);
const selectedMetric = ref('incidence');
const tooltipVisible = ref(false);
const tooltipData = ref({});
const tooltipStyle = ref({});

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
  })).filter(country => country.latitude && country.longitude);
});

const dataRange = computed(() => {
  if (processedData.value.length === 0) return { min: 0, max: 100 };
  
  const values = processedData.value.map(d => d.value);
  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
});

const gridLongitudes = computed(() => {
  const lngs = [];
  for (let lng = -180; lng <= 180; lng += 60) {
    lngs.push(lng);
  }
  return lngs;
});

const gridLatitudes = computed(() => {
  const lats = [];
  for (let lat = -90; lat <= 90; lat += 30) {
    lats.push(lat);
  }
  return lats;
});

const axisLongitudes = computed(() => [-180, -120, -60, 0, 60, 120, 180]);
const axisLatitudes = computed(() => [-90, -60, -30, 0, 30, 60, 90]);

const legendSizes = computed(() => {
  const { min, max } = dataRange.value;
  const values = [min, (min + max) * 0.25, (min + max) * 0.5, (min + max) * 0.75, max];
  
  return values.map(value => ({
    value,
    radius: getRadius(value)
  }));
});

const getX = (longitude) => {
  return padding + ((longitude + 180) / 360) * (props.width - 2 * padding);
};

const getY = (latitude) => {
  return padding + ((90 - latitude) / 180) * (props.height - 2 * padding);
};

const getRadius = (value) => {
  if (dataRange.value.max === dataRange.value.min) return 8;
  
  const normalized = (value - dataRange.value.min) / (dataRange.value.max - dataRange.value.min);
  return Math.max(4, Math.min(20, 4 + normalized * 16));
};

const getColor = (value) => {
  if (dataRange.value.max === dataRange.value.min) return '#fcd34d';
  
  const normalized = (value - dataRange.value.min) / (dataRange.value.max - dataRange.value.min);
  
  // Color scale from light to dark red
  const colors = [
    '#fef3c7', // Very light yellow
    '#fcd34d', // Light yellow
    '#f59e0b', // Yellow
    '#d97706', // Orange
    '#b45309', // Dark orange
    '#92400e', // Brown
    '#78350f'  // Dark brown
  ];
  
  const colorIndex = Math.floor(normalized * (colors.length - 1));
  return colors[colorIndex] || colors[0];
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

const showTooltip = (event, country) => {
  tooltipVisible.value = true;
  tooltipData.value = {
    country: country.country,
    value: country.value,
    region: country.region,
    latitude: country.latitude,
    longitude: country.longitude
  };
  tooltipStyle.value = {
    left: `${event.clientX + 10}px`,
    top: `${event.clientY - 10}px`
  };
};

const hideTooltip = () => {
  tooltipVisible.value = false;
};

const updateChart = () => {
  // Chart updates are reactive through computed properties
};

onMounted(() => {
  updateChart();
});

watch(selectedMetric, () => {
  updateChart();
});

watch(() => props.data, () => {
  updateChart();
}, { deep: true });
</script>

<style scoped>
.world-map-container {
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
  gap: 20px;
  align-items: flex-start;
}

.world-map-svg {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.country-circle {
  cursor: pointer;
  transition: opacity 0.2s;
}

.country-circle:hover {
  opacity: 1 !important;
  stroke-width: 3;
}

.map-legend {
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: 200px;
}

.legend-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.legend-circles {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-circle-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-circle {
  border: 2px solid currentColor;
  opacity: 0.7;
}

.legend-value {
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

@media (max-width: 1200px) {
  .chart-content {
    flex-direction: column;
  }
  
  .map-legend {
    min-width: auto;
  }
}

@media (prefers-color-scheme: dark) {
  .world-map-container {
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
  
  .legend-title {
    color: #f9fafb;
  }
  
  .legend-value {
    color: #d1d5db;
  }
  
  .world-map-svg {
    background: #374151;
    border-color: #4b5563;
  }
}
</style>