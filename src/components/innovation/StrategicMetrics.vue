<template>
  <div class="strategic-metrics">
    <div class="tech-readiness">
      <h3 class="chart-title">Emerging Tech Readiness</h3>
      <div class="tech-bars">
        <div 
          v-for="(tech, index) in strategicData.emergingTechReadiness.labels" 
          :key="tech"
          class="tech-item"
        >
          <div class="tech-header">
            <span class="tech-name">{{ tech }}</span>
            <span class="tech-value">{{ strategicData.emergingTechReadiness.values[index] }}%</span>
          </div>
          <div class="tech-bar">
            <div 
              class="tech-fill"
              :style="{ width: strategicData.emergingTechReadiness.values[index] + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="competitive-benchmark">
      <h3 class="chart-title">Competitive Benchmarking</h3>
      <div class="benchmark-content">
        <div class="benchmark-categories">
          <div class="category-header">
            <span class="category-label">Company</span>
            <span class="metric-label">Attach Rate</span>
            <span class="metric-label">Recurring Rev %</span>
          </div>
          <div 
            v-for="(company, index) in strategicData.competitiveBenchmark.labels" 
            :key="company"
            class="benchmark-row"
            :class="{ 'highlight': company === 'SHI' }"
          >
            <span class="company-name">{{ company }}</span>
            <div class="metric-bar-container">
              <div class="metric-bar">
                <div 
                  class="metric-fill attach-fill"
                  :style="{ width: (strategicData.competitiveBenchmark.attachRates[index] / 80 * 100) + '%' }"
                ></div>
              </div>
              <span class="metric-value">{{ strategicData.competitiveBenchmark.attachRates[index] }}%</span>
            </div>
            <div class="metric-bar-container">
              <div class="metric-bar">
                <div 
                  class="metric-fill revenue-fill"
                  :style="{ width: (strategicData.competitiveBenchmark.recurringRevenue[index] / 40 * 100) + '%' }"
                ></div>
              </div>
              <span class="metric-value">{{ strategicData.competitiveBenchmark.recurringRevenue[index] }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  strategicData: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.strategic-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.tech-readiness,
.competitive-benchmark {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px 0;
}

.tech-bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tech-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tech-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tech-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.tech-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.tech-bar {
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.tech-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.benchmark-content {
  width: 100%;
}

.benchmark-categories {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-header {
  display: grid;
  grid-template-columns: 1fr 120px 120px;
  gap: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.category-label,
.metric-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.benchmark-row {
  display: grid;
  grid-template-columns: 1fr 120px 120px;
  gap: 12px;
  align-items: center;
  padding: 8px 0;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.benchmark-row.highlight {
  background: #eff6ff;
  font-weight: 600;
}

.company-name {
  font-size: 14px;
  color: #111827;
}

.metric-bar-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.metric-bar {
  flex: 1;
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
  min-width: 60px;
}

.metric-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.attach-fill {
  background: linear-gradient(90deg, #10b981, #059669);
}

.revenue-fill {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.metric-value {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  min-width: 30px;
  text-align: right;
}

@media (max-width: 1024px) {
  .strategic-metrics {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .category-header,
  .benchmark-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .category-header {
    display: none;
  }
  
  .metric-bar-container {
    justify-content: space-between;
  }
}

@media (prefers-color-scheme: dark) {
  .tech-readiness,
  .competitive-benchmark {
    background: #1f2937;
  }
  
  .chart-title {
    color: #f9fafb;
  }
  
  .tech-name {
    color: #d1d5db;
  }
  
  .tech-value {
    color: #f9fafb;
  }
  
  .tech-bar {
    background: #374151;
  }
  
  .category-header {
    border-bottom-color: #4b5563;
  }
  
  .category-label,
  .metric-label {
    color: #9ca3af;
  }
  
  .benchmark-row.highlight {
    background: #1e3a8a;
  }
  
  .company-name {
    color: #f9fafb;
  }
  
  .metric-bar {
    background: #374151;
  }
  
  .metric-value {
    color: #9ca3af;
  }
}
</style>