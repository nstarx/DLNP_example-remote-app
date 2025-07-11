<template>
  <div class="tb-dashboard">
    <header class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">TB Burden Country Analysis</h1>
        <p class="dashboard-subtitle">Global Tuberculosis Surveillance & Analytics Dashboard</p>
      </div>
      <div class="header-controls">
        <button @click="exportData" class="export-button">
          <span class="export-icon">↓</span>
          Export Data
        </button>
        <button @click="showInfo = !showInfo" class="info-button">
          <span class="info-icon">?</span>
          About
        </button>
      </div>
    </header>

    <!-- Key Metrics Cards -->
    <section class="metrics-section">
      <div class="metrics-grid">
        <div class="metric-card primary">
          <div class="metric-icon">🌍</div>
          <div class="metric-content">
            <div class="metric-value">{{ totalCountries }}</div>
            <div class="metric-label">Countries Analyzed</div>
          </div>
        </div>
        <div class="metric-card secondary">
          <div class="metric-icon">📊</div>
          <div class="metric-content">
            <div class="metric-value">{{ totalCases.toLocaleString() }}</div>
            <div class="metric-label">Total TB Cases</div>
          </div>
        </div>
        <div class="metric-card tertiary">
          <div class="metric-icon">💊</div>
          <div class="metric-content">
            <div class="metric-value">{{ avgTreatmentSuccess.toFixed(1) }}%</div>
            <div class="metric-label">Avg Treatment Success</div>
          </div>
        </div>
        <div class="metric-card quaternary">
          <div class="metric-icon">⚠️</div>
          <div class="metric-content">
            <div class="metric-value">{{ totalMdrTb.toLocaleString() }}</div>
            <div class="metric-label">MDR-TB Cases</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Filters -->
    <section class="filters-section">
      <div class="filters-container">
        <div class="filter-group">
          <label class="filter-label">WHO Region:</label>
          <select v-model="selectedRegion" class="filter-select">
            <option value="">All Regions</option>
            <option v-for="region in whoRegions" :key="region.code" :value="region.code">
              {{ region.name }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">Income Group:</label>
          <select v-model="selectedIncome" class="filter-select">
            <option value="">All Income Groups</option>
            <option v-for="income in incomeGroups" :key="income" :value="income">
              {{ income }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">Incidence Rate:</label>
          <div class="range-input">
            <input 
              type="range" 
              v-model="incidenceRange[0]" 
              :min="incidenceMin" 
              :max="incidenceMax" 
              class="range-slider"
            />
            <input 
              type="range" 
              v-model="incidenceRange[1]" 
              :min="incidenceMin" 
              :max="incidenceMax" 
              class="range-slider"
            />
            <div class="range-values">
              {{ incidenceRange[0] }} - {{ incidenceRange[1] }}
            </div>
          </div>
        </div>
        <div class="filter-group">
          <label class="filter-label">Search Country:</label>
          <input 
            v-model="searchCountry" 
            placeholder="Type country name..."
            class="search-input"
          />
        </div>
      </div>
    </section>

    <!-- Main Visualizations -->
    <section class="visualizations-section">
      <!-- World Map -->
      <div class="visualization-card full-width">
        <WorldMap 
          :data="filteredData" 
          title="Global TB Burden Geographic Distribution"
          :width="1000"
          :height="500"
        />
      </div>

      <!-- Scatter Plot and Bar Chart -->
      <div class="visualization-row">
        <div class="visualization-card">
          <ScatterPlot 
            :data="filteredData" 
            :regions="whoRegions"
            title="TB Burden Correlation Analysis"
            :width="500"
            :height="400"
          />
        </div>
        <div class="visualization-card">
          <BarChart 
            :data="topCountriesData"
            :labels="topCountriesLabels"
            title="Top 10 Countries by TB Cases"
          />
        </div>
      </div>

      <!-- Heatmap -->
      <div class="visualization-card full-width">
        <Heatmap 
          :data="filteredData"
          title="TB Burden Intensity by Country"
          :width="1000"
          :height="400"
        />
      </div>

      <!-- Regional Analysis -->
      <div class="visualization-row">
        <div class="visualization-card">
          <LineChart 
            :data="regionalTrendsData"
            :labels="regionalTrendsLabels"
            title="TB Incidence Trends by Region"
          />
        </div>
        <div class="visualization-card">
          <div class="statistical-analysis">
            <h3>Statistical Analysis</h3>
            <div class="stat-grid">
              <div class="stat-item">
                <div class="stat-label">Correlation (Incidence vs Mortality)</div>
                <div class="stat-value">{{ correlationCoefficient.toFixed(3) }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Std Deviation (Incidence)</div>
                <div class="stat-value">{{ incidenceStdDev.toFixed(2) }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Median Treatment Success</div>
                <div class="stat-value">{{ medianTreatmentSuccess.toFixed(1) }}%</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">High Burden Countries</div>
                <div class="stat-value">{{ highBurdenCount }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Data Table -->
    <section class="table-section">
      <div class="table-container">
        <h3>Detailed Country Data</h3>
        <div class="table-controls">
          <select v-model="sortBy" class="sort-select">
            <option value="country">Country</option>
            <option value="incidence">Incidence Rate</option>
            <option value="mortality">Mortality Rate</option>
            <option value="treatment_success">Treatment Success</option>
            <option value="notification">Total Cases</option>
          </select>
          <button @click="sortAsc = !sortAsc" class="sort-button">
            {{ sortAsc ? '↑' : '↓' }}
          </button>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Country</th>
                <th>Region</th>
                <th>Incidence Rate</th>
                <th>Mortality Rate</th>
                <th>Treatment Success</th>
                <th>Total Cases</th>
                <th>MDR-TB</th>
                <th>HIV-TB</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="country in sortedTableData" :key="country.country">
                <td class="country-cell">{{ country.country }}</td>
                <td>{{ country.region }}</td>
                <td>{{ country.incidence.toFixed(1) }}</td>
                <td>{{ country.mortality.toFixed(1) }}</td>
                <td>{{ country.treatment_success.toFixed(1) }}%</td>
                <td>{{ country.notification?.toLocaleString() || 'N/A' }}</td>
                <td>{{ country.mdr_tb?.toLocaleString() || 'N/A' }}</td>
                <td>{{ country.hiv_tb?.toLocaleString() || 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Information Modal -->
    <div v-if="showInfo" class="modal-overlay" @click="showInfo = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>About TB Burden Analysis</h2>
          <button @click="showInfo = false" class="close-button">×</button>
        </div>
        <div class="modal-body">
          <p><strong>Tuberculosis (TB)</strong> remains one of the leading causes of death from an infectious disease worldwide.</p>
          <p>This dashboard provides comprehensive analysis of TB burden across countries, including:</p>
          <ul>
            <li><strong>Incidence Rate:</strong> New TB cases per 100,000 population</li>
            <li><strong>Mortality Rate:</strong> TB deaths per 100,000 population</li>
            <li><strong>Treatment Success:</strong> Percentage of TB cases successfully treated</li>
            <li><strong>MDR-TB:</strong> Multidrug-resistant tuberculosis cases</li>
            <li><strong>HIV-TB:</strong> HIV-associated tuberculosis cases</li>
          </ul>
          <p><strong>Data Sources:</strong> World Health Organization (WHO) Global TB Report</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { tbBurdenData, whoRegions, calculateStatistics } from '@/data/tbBurdenData';
import WorldMap from '@/components/charts/WorldMap.vue';
import ScatterPlot from '@/components/charts/ScatterPlot.vue';
import Heatmap from '@/components/charts/Heatmap.vue';
import LineChart from '@/components/charts/LineChart.vue';
import BarChart from '@/components/charts/BarChart.vue';

// Reactive state
const selectedRegion = ref('');
const selectedIncome = ref('');
const incidenceRange = ref([0, 700]);
const searchCountry = ref('');
const sortBy = ref('country');
const sortAsc = ref(true);
const showInfo = ref(false);

// Computed properties
const incidenceMin = computed(() => Math.min(...tbBurdenData.map(d => d.incidence)));
const incidenceMax = computed(() => Math.max(...tbBurdenData.map(d => d.incidence)));

const incomeGroups = computed(() => {
  return [...new Set(tbBurdenData.map(d => d.income_group))].sort();
});

const filteredData = computed(() => {
  return tbBurdenData.filter(country => {
    const regionMatch = !selectedRegion.value || country.who_region === selectedRegion.value;
    const incomeMatch = !selectedIncome.value || country.income_group === selectedIncome.value;
    const incidenceMatch = country.incidence >= incidenceRange.value[0] && country.incidence <= incidenceRange.value[1];
    const searchMatch = !searchCountry.value || country.country.toLowerCase().includes(searchCountry.value.toLowerCase());
    
    return regionMatch && incomeMatch && incidenceMatch && searchMatch;
  });
});

const totalCountries = computed(() => filteredData.value.length);
const totalCases = computed(() => filteredData.value.reduce((sum, country) => sum + (country.notification || 0), 0));
const avgTreatmentSuccess = computed(() => {
  const avg = filteredData.value.reduce((sum, country) => sum + country.treatment_success, 0) / filteredData.value.length;
  return isNaN(avg) ? 0 : avg;
});
const totalMdrTb = computed(() => filteredData.value.reduce((sum, country) => sum + (country.mdr_tb || 0), 0));

const topCountriesData = computed(() => {
  const sorted = [...filteredData.value].sort((a, b) => (b.notification || 0) - (a.notification || 0));
  return sorted.slice(0, 10).map(country => country.notification || 0);
});

const topCountriesLabels = computed(() => {
  const sorted = [...filteredData.value].sort((a, b) => (b.notification || 0) - (a.notification || 0));
  return sorted.slice(0, 10).map(country => country.country);
});

const regionalTrendsData = computed(() => {
  const regionMap = new Map();
  
  filteredData.value.forEach(country => {
    if (!regionMap.has(country.who_region)) {
      regionMap.set(country.who_region, []);
    }
    regionMap.get(country.who_region).push(country.incidence);
  });
  
  const result = [];
  regionMap.forEach((values, region) => {
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    result.push(avg);
  });
  
  return result;
});

const regionalTrendsLabels = computed(() => {
  const regionMap = new Map();
  
  filteredData.value.forEach(country => {
    if (!regionMap.has(country.who_region)) {
      regionMap.set(country.who_region, []);
    }
    regionMap.get(country.who_region).push(country.incidence);
  });
  
  return Array.from(regionMap.keys()).map(code => {
    const region = whoRegions.find(r => r.code === code);
    return region ? region.name : code;
  });
});

const correlationCoefficient = computed(() => {
  const data = filteredData.value;
  const n = data.length;
  
  if (n < 2) return 0;
  
  const sumX = data.reduce((sum, d) => sum + d.incidence, 0);
  const sumY = data.reduce((sum, d) => sum + d.mortality, 0);
  const sumXY = data.reduce((sum, d) => sum + d.incidence * d.mortality, 0);
  const sumX2 = data.reduce((sum, d) => sum + d.incidence * d.incidence, 0);
  const sumY2 = data.reduce((sum, d) => sum + d.mortality * d.mortality, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
});

const incidenceStdDev = computed(() => {
  const data = filteredData.value;
  const mean = data.reduce((sum, d) => sum + d.incidence, 0) / data.length;
  const variance = data.reduce((sum, d) => sum + Math.pow(d.incidence - mean, 2), 0) / data.length;
  return Math.sqrt(variance);
});

const medianTreatmentSuccess = computed(() => {
  const sorted = [...filteredData.value].sort((a, b) => a.treatment_success - b.treatment_success);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 
    ? (sorted[mid - 1].treatment_success + sorted[mid].treatment_success) / 2
    : sorted[mid].treatment_success;
});

const highBurdenCount = computed(() => {
  return filteredData.value.filter(country => country.incidence > 200).length;
});

const sortedTableData = computed(() => {
  const data = [...filteredData.value];
  
  data.sort((a, b) => {
    let aVal = a[sortBy.value];
    let bVal = b[sortBy.value];
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (sortAsc.value) {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
  
  return data;
});

// Methods
const exportData = () => {
  const csvContent = [
    ['Country', 'Region', 'Incidence Rate', 'Mortality Rate', 'Treatment Success', 'Total Cases', 'MDR-TB', 'HIV-TB'].join(','),
    ...filteredData.value.map(country => [
      country.country,
      country.region,
      country.incidence,
      country.mortality,
      country.treatment_success,
      country.notification || 0,
      country.mdr_tb || 0,
      country.hiv_tb || 0
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tb_burden_data.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};

onMounted(() => {
  incidenceRange.value = [incidenceMin.value, incidenceMax.value];
});
</script>

<style scoped>
.tb-dashboard {
  background: #f9fafb;
  min-height: 100vh;
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.dashboard-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 5px 0 0 0;
}

.header-controls {
  display: flex;
  gap: 10px;
}

.export-button, .info-button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.export-button:hover, .info-button:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.metrics-section {
  margin-bottom: 30px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.metric-card.primary { border-left: 4px solid #3b82f6; }
.metric-card.secondary { border-left: 4px solid #10b981; }
.metric-card.tertiary { border-left: 4px solid #f59e0b; }
.metric-card.quaternary { border-left: 4px solid #ef4444; }

.metric-icon {
  font-size: 24px;
  width: 40px;
  text-align: center;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.metric-label {
  font-size: 14px;
  color: #6b7280;
}

.filters-section {
  margin-bottom: 30px;
}

.filters-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.filter-select, .search-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.range-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.range-slider {
  width: 150px;
}

.range-values {
  font-size: 12px;
  color: #6b7280;
}

.visualizations-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 30px;
}

.visualization-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.visualization-card.full-width {
  width: 100%;
}

.visualization-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.statistical-analysis {
  padding: 20px;
}

.statistical-analysis h3 {
  margin-top: 0;
  color: #1f2937;
}

.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.table-section {
  margin-bottom: 30px;
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.table-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.sort-select {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.sort-button {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 16px;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.country-cell {
  font-weight: 500;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  color: #1f2937;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
}

.close-button:hover {
  color: #1f2937;
}

.modal-body {
  padding: 20px;
}

.modal-body p {
  margin-bottom: 15px;
  line-height: 1.6;
  color: #374151;
}

.modal-body ul {
  margin-left: 20px;
  margin-bottom: 15px;
}

.modal-body li {
  margin-bottom: 8px;
  line-height: 1.5;
  color: #374151;
}

@media (max-width: 1024px) {
  .visualization-row {
    grid-template-columns: 1fr;
  }
  
  .stat-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .filters-container {
    flex-direction: column;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-color-scheme: dark) {
  .tb-dashboard {
    background: #111827;
  }
  
  .dashboard-header,
  .metric-card,
  .filters-container,
  .visualization-card,
  .table-container {
    background: #1f2937;
    color: #f9fafb;
  }
  
  .header-content h1,
  .metric-value,
  .stat-value {
    color: #f9fafb;
  }
  
  .filter-select,
  .search-input,
  .sort-select {
    background: #374151;
    color: #f9fafb;
    border-color: #4b5563;
  }
  
  .data-table th {
    background: #374151;
    color: #f9fafb;
  }
  
  .modal-content {
    background: #1f2937;
    color: #f9fafb;
  }
}
</style>