<template>
  <div class="thesis-dashboard">
    <div class="thesis-header">
      <div class="thesis-info">
        <h2 class="thesis-title">{{ thesis.name }}</h2>
        <p class="thesis-description">{{ thesis.description }}</p>
      </div>
      <div class="thesis-status">
        <div class="status-indicator" :class="overallStatusClass">
          <span class="status-dot"></span>
          <span class="status-label">{{ overallStatus }}</span>
        </div>
      </div>
    </div>

    <div class="validation-metrics">
      <BaseCard>
        <h3 class="section-title">Thesis Validation Metrics</h3>
        <div class="validation-grid">
          <div class="validation-item">
            <div class="validation-header">
              <h4>Market Size Growth</h4>
              <span class="validation-status" :class="validation.marketSizeValidation.status">
                {{ validation.marketSizeValidation.status === 'on_track' ? 'On Track' : 'Deviation' }}
              </span>
            </div>
            <div class="validation-metrics-detail">
              <div class="metric-row">
                <span>Expected Growth:</span>
                <span>{{ validation.marketSizeValidation.expected.toFixed(1) }}%</span>
              </div>
              <div class="metric-row">
                <span>Actual Growth:</span>
                <span>{{ validation.marketSizeValidation.actual.toFixed(1) }}%</span>
              </div>
              <div class="metric-row">
                <span>Variance:</span>
                <span :class="validation.marketSizeValidation.variance >= 0 ? 'positive' : 'negative'">
                  {{ validation.marketSizeValidation.variance > 0 ? '+' : '' }}{{ validation.marketSizeValidation.variance.toFixed(1) }}%
                </span>
              </div>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: Math.min(100, (validation.marketSizeValidation.actual / validation.marketSizeValidation.expected) * 100) + '%' }"
              ></div>
            </div>
          </div>

          <div class="validation-item">
            <div class="validation-header">
              <h4>Adoption Rate Progress</h4>
              <span class="validation-status" :class="validation.adoptionValidation.status">
                {{ validation.adoptionValidation.status === 'on_track' ? 'On Track' : 'Behind' }}
              </span>
            </div>
            <div class="validation-metrics-detail">
              <div class="metric-row">
                <span>Current Adoption:</span>
                <span>{{ validation.adoptionValidation.current }}%</span>
              </div>
              <div class="metric-row">
                <span>Target (2025):</span>
                <span>{{ validation.adoptionValidation.expected }}%</span>
              </div>
              <div class="metric-row">
                <span>Progress:</span>
                <span class="positive">{{ validation.adoptionValidation.progress.toFixed(1) }}%</span>
              </div>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: validation.adoptionValidation.progress + '%' }"
              ></div>
            </div>
          </div>

          <div class="validation-item">
            <div class="validation-header">
              <h4>Exit Environment</h4>
              <span class="validation-status" :class="validation.exitEnvironment.status">
                {{ validation.exitEnvironment.status === 'favorable' ? 'Favorable' : 'Challenging' }}
              </span>
            </div>
            <div class="validation-metrics-detail">
              <div class="metric-row">
                <span>Avg Exit Multiple:</span>
                <span>{{ validation.exitEnvironment.avgMultiple.toFixed(1) }}x</span>
              </div>
              <div class="metric-row">
                <span>IPO Success Rate:</span>
                <span>{{ validation.exitEnvironment.ipoSuccessRate }}%</span>
              </div>
              <div class="metric-row">
                <span>Trend:</span>
                <span :class="validation.exitEnvironment.trend === 'stable' ? 'positive' : 'neutral'">
                  {{ validation.exitEnvironment.trend }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="thesis-alignment">
      <BaseCard>
        <h3 class="section-title">Portfolio-Thesis Alignment</h3>
        <div class="alignment-content">
          <div class="alignment-summary">
            <div class="alignment-score">
              <div class="score-circle" :class="alignmentStatusClass">
                <span class="score-percentage">{{ portfolioAlignment.alignmentPercentage }}%</span>
              </div>
              <div class="score-details">
                <div class="score-label">Thesis Aligned</div>
                <div class="score-amount">
                  ${{ formatValue(portfolioAlignment.alignedInvestment) }} / ${{ formatValue(portfolioAlignment.totalInvestment) }}
                </div>
              </div>
            </div>
            <div class="alignment-recommendation">
              <h4>Recommendation</h4>
              <p>{{ portfolioAlignment.recommendation }}</p>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="competitive-landscape">
      <BaseCard>
        <h3 class="section-title">Competitive Landscape Analysis</h3>
        <div class="landscape-table">
          <div class="table-header">
            <div class="col-sector">Sector</div>
            <div class="col-market">Market Size</div>
            <div class="col-growth">Growth</div>
            <div class="col-funding">Competitor Funding</div>
            <div class="col-multiple">Avg Multiple</div>
            <div class="col-exposure">Our Exposure</div>
            <div class="col-position">Position</div>
          </div>
          <div class="table-body">
            <div 
              v-for="sector in competitiveLandscape" 
              :key="sector.sector"
              class="table-row"
              :class="sector.trend"
            >
              <div class="col-sector">
                <span class="sector-name">{{ sector.sector }}</span>
                <span class="trend-indicator" :class="sector.trend">
                  {{ sector.trend === 'up' ? '↗️' : sector.trend === 'down' ? '↘️' : '↔️' }}
                </span>
              </div>
              <div class="col-market">${{ formatValue(sector.marketSize) }}</div>
              <div class="col-growth">
                <span :class="sector.growth > 15 ? 'positive' : sector.growth > 10 ? 'neutral' : 'negative'">
                  {{ sector.growth }}%
                </span>
              </div>
              <div class="col-funding">${{ formatValue(sector.competitorFunding) }}</div>
              <div class="col-multiple">{{ sector.avgExitMultiple.toFixed(1) }}x</div>
              <div class="col-exposure">
                <span class="exposure-amount">${{ formatValue(sector.portfolioInvestment) }}</span>
                <span class="exposure-count">({{ sector.portfolioCompanies }} cos)</span>
              </div>
              <div class="col-position">
                <span class="position-badge" :class="sector.competitivePosition">
                  {{ formatPosition(sector.competitivePosition) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="market-trends">
      <BaseCard>
        <h3 class="section-title">Market Trend Analysis</h3>
        <div class="trends-grid">
          <div 
            v-for="trend in trendAnalysis" 
            :key="trend.name"
            class="trend-card"
            :class="trend.onTrack ? 'on-track' : 'behind'"
          >
            <div class="trend-header">
              <h4 class="trend-name">{{ formatTrendName(trend.name) }}</h4>
              <span class="trend-impact" :class="trend.impact">{{ trend.impact }}</span>
            </div>
            
            <div class="trend-progress">
              <div class="progress-info">
                <span>{{ trend.current }}% → {{ trend.target }}%</span>
                <span class="timeline">{{ trend.timeline }}</span>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill"
                  :class="trend.onTrack ? 'on-track' : 'behind'"
                  :style="{ width: trend.progress + '%' }"
                ></div>
              </div>
              <div class="progress-percentage">{{ trend.progress }}% complete</div>
            </div>
            
            <div class="trend-insight">
              <span class="insight-label">Monthly progress needed:</span>
              <span class="insight-value">{{ trend.monthlyProgressNeeded }}%</span>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="scenario-analysis">
      <BaseCard>
        <h3 class="section-title">Scenario Analysis</h3>
        <div class="scenario-controls">
          <button @click="runScenarios" class="scenario-button" :disabled="loadingScenarios">
            {{ loadingScenarios ? 'Running...' : 'Run Scenarios' }}
          </button>
        </div>
        
        <div v-if="scenarios.length > 0" class="scenarios-grid">
          <div 
            v-for="scenario in scenarios" 
            :key="scenario.scenario"
            class="scenario-card"
            :class="scenario.scenario"
          >
            <div class="scenario-header">
              <h4 class="scenario-name">{{ formatScenarioName(scenario.scenario) }}</h4>
              <span class="scenario-probability">{{ scenario.probability }}% probability</span>
            </div>
            
            <div class="scenario-metrics">
              <div class="scenario-metric">
                <span>Market Growth:</span>
                <span>{{ scenario.marketGrowth }}%</span>
              </div>
              <div class="scenario-metric">
                <span>Exit Multiple:</span>
                <span>{{ scenario.exitMultiple }}x</span>
              </div>
              <div class="scenario-metric">
                <span>Portfolio Multiple:</span>
                <span class="multiple-value">{{ scenario.projectedMultiple }}x</span>
              </div>
              <div class="scenario-metric">
                <span>Portfolio Value:</span>
                <span class="value-amount">${{ formatValue(scenario.projectedPortfolioValue) }}</span>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useThesis } from '@/composables/useThesis'
import BaseCard from '../common/BaseCard.vue'

const { 
  thesis, 
  thesisValidation: validation, 
  portfolioAlignment, 
  competitiveLandscape,
  trendAnalysis,
  runScenarioAnalysis
} = useThesis()

const scenarios = ref([])
const loadingScenarios = ref(false)

const overallStatus = computed(() => {
  const validationStatuses = [
    validation.value.marketSizeValidation.status,
    validation.value.adoptionValidation.status,
    validation.value.exitEnvironment.status
  ]
  
  const onTrackCount = validationStatuses.filter(status => 
    status === 'on_track' || status === 'favorable'
  ).length
  
  if (onTrackCount >= 2) return 'On Track'
  if (onTrackCount === 1) return 'Mixed Signals'
  return 'Needs Attention'
})

const overallStatusClass = computed(() => {
  switch(overallStatus.value) {
    case 'On Track': return 'status-positive'
    case 'Mixed Signals': return 'status-warning'
    case 'Needs Attention': return 'status-negative'
    default: return 'status-neutral'
  }
})

const alignmentStatusClass = computed(() => {
  const percentage = parseFloat(portfolioAlignment.value.alignmentPercentage)
  if (percentage >= 80) return 'excellent'
  if (percentage >= 70) return 'good'
  if (percentage >= 60) return 'average'
  return 'poor'
})

async function runScenarios() {
  loadingScenarios.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    scenarios.value = runScenarioAnalysis()
  } finally {
    loadingScenarios.value = false
  }
}

function formatValue(value) {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`
  }
  return value.toLocaleString()
}

function formatPosition(position) {
  switch(position) {
    case 'strong': return 'Strong'
    case 'emerging': return 'Emerging'
    case 'no_exposure': return 'No Exposure'
    default: return position
  }
}

function formatTrendName(name) {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

function formatScenarioName(scenario) {
  return scenario.charAt(0).toUpperCase() + scenario.slice(1) + ' Case'
}
</script>

<style scoped>
.thesis-dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.thesis-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.thesis-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
}

.thesis-description {
  margin: 0;
  opacity: 0.9;
  font-size: 16px;
  line-height: 1.5;
}

.thesis-status {
  display: flex;
  align-items: center;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 14px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-positive {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.status-positive .status-dot {
  background: #10b981;
}

.status-warning {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.status-warning .status-dot {
  background: #f59e0b;
}

.status-negative {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.status-negative .status-dot {
  background: #ef4444;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.validation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.validation-item {
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fafafa;
}

.validation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.validation-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.validation-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
}

.validation-status.on_track,
.validation-status.favorable {
  background: #d1fae5;
  color: #065f46;
}

.validation-status.deviation,
.validation-status.behind,
.validation-status.challenging {
  background: #fee2e2;
  color: #991b1b;
}

.validation-metrics-detail {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.positive {
  color: #059669;
  font-weight: 500;
}

.negative {
  color: #dc2626;
  font-weight: 500;
}

.neutral {
  color: #374151;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  transition: width 0.3s ease;
}

.alignment-content {
  display: flex;
  gap: 24px;
}

.alignment-summary {
  display: flex;
  gap: 24px;
  align-items: center;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: white;
  position: relative;
}

.score-circle.excellent {
  background: linear-gradient(135deg, #10b981, #059669);
}

.score-circle.good {
  background: linear-gradient(135deg, #84cc16, #65a30d);
}

.score-circle.average {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.score-circle.poor {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.score-details {
  margin-left: 16px;
}

.score-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
}

.score-amount {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.alignment-recommendation h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.alignment-recommendation p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

.landscape-table {
  overflow-x: auto;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 0.8fr 1fr 0.8fr 1fr 1fr;
  gap: 12px;
  padding: 12px;
  align-items: center;
}

.table-header {
  background: #f3f4f6;
  font-weight: 600;
  font-size: 12px;
  color: #374151;
  text-transform: uppercase;
  border-radius: 6px;
}

.table-row {
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}

.table-row:hover {
  background: #fafafa;
}

.sector-name {
  font-weight: 500;
  color: #111827;
}

.trend-indicator {
  margin-left: 8px;
}

.exposure-amount {
  font-weight: 500;
  color: #111827;
}

.exposure-count {
  font-size: 12px;
  color: #6b7280;
  margin-left: 4px;
}

.position-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
}

.position-badge.strong {
  background: #d1fae5;
  color: #065f46;
}

.position-badge.emerging {
  background: #fef3c7;
  color: #92400e;
}

.position-badge.no_exposure {
  background: #f3f4f6;
  color: #6b7280;
}

.trends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.trend-card {
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
}

.trend-card.on-track {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5, #ffffff);
}

.trend-card.behind {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb, #ffffff);
}

.trend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.trend-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.trend-impact {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
}

.trend-impact.high {
  background: #fee2e2;
  color: #991b1b;
}

.trend-impact.medium {
  background: #fef3c7;
  color: #92400e;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.timeline {
  color: #6b7280;
  font-size: 12px;
}

.progress-fill.on-track {
  background: linear-gradient(90deg, #10b981, #059669);
}

.progress-fill.behind {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.progress-percentage {
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
  text-align: right;
}

.trend-insight {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.insight-label {
  color: #6b7280;
}

.insight-value {
  font-weight: 500;
  color: #111827;
}

.scenario-controls {
  margin-bottom: 20px;
}

.scenario-button {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s ease;
}

.scenario-button:hover:not(:disabled) {
  background: #2563eb;
}

.scenario-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.scenario-card {
  padding: 16px;
  border-radius: 8px;
  background: white;
}

.scenario-card.bearish {
  border: 2px solid #ef4444;
  background: linear-gradient(135deg, #fef2f2, #ffffff);
}

.scenario-card.base {
  border: 2px solid #6b7280;
  background: linear-gradient(135deg, #f9fafb, #ffffff);
}

.scenario-card.bullish {
  border: 2px solid #10b981;
  background: linear-gradient(135deg, #ecfdf5, #ffffff);
}

.scenario-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.scenario-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.scenario-probability {
  font-size: 12px;
  color: #6b7280;
}

.scenario-metrics {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scenario-metric {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #374151;
}

.multiple-value,
.value-amount {
  font-weight: 600;
  color: #111827;
}

@media (max-width: 768px) {
  .thesis-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .validation-grid,
  .trends-grid,
  .scenarios-grid {
    grid-template-columns: 1fr;
  }
  
  .alignment-summary {
    flex-direction: column;
    text-align: center;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .landscape-table {
    font-size: 12px;
  }
}

@media (prefers-color-scheme: dark) {
  .section-title {
    color: #f9fafb;
  }
  
  .validation-item {
    background: #1f2937;
    border-color: #4b5563;
  }
  
  .table-header {
    background: #1f2937;
    color: #d1d5db;
  }
  
  .table-row:hover {
    background: #1f2937;
  }
  
  .trend-card,
  .scenario-card {
    background: #1f2937;
  }
  
  .trend-name,
  .scenario-name {
    color: #f9fafb;
  }
  
  .score-amount {
    color: #f9fafb;
  }
}
</style>