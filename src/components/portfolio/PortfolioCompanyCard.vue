<template>
  <BaseCard class="company-card" :class="healthStatusClass" @click="showDetails = !showDetails">
    <div class="company-header">
      <div class="company-info">
        <div class="company-logo">{{ company.logo }}</div>
        <div class="company-meta">
          <h3 class="company-name">{{ company.name }}</h3>
          <div class="company-details">
            <span class="sector">{{ company.sector }}</span>
            <span class="stage">{{ company.stage }}</span>
            <span class="geography">{{ company.geography }}</span>
          </div>
        </div>
      </div>
      
      <div class="company-status">
        <div class="health-indicator" :class="healthStatusClass">
          <span class="health-dot"></span>
          <span class="health-label">{{ healthLabel }}</span>
        </div>
        <div class="valuation">
          <span class="valuation-label">Valuation</span>
          <span class="valuation-amount">${{ formatValue(company.lastValuation) }}</span>
        </div>
      </div>
    </div>

    <div class="company-metrics">
      <div class="metric-item">
        <div class="metric-label">ARR Growth</div>
        <div class="metric-value" :class="getTrendClass(company.financials.arrGrowth)">
          {{ company.financials.arrGrowth }}%
        </div>
      </div>
      <div class="metric-item">
        <div class="metric-label">Cash Runway</div>
        <div class="metric-value" :class="getRunwayClass(company.financials.cashRunway)">
          {{ company.financials.cashRunway }}mo
        </div>
      </div>
      <div class="metric-item">
        <div class="metric-label">Ownership</div>
        <div class="metric-value">{{ company.ownershipPercent }}%</div>
      </div>
      <div class="metric-item">
        <div class="metric-label">Investment</div>
        <div class="metric-value">${{ formatValue(company.lastValuation * (company.ownershipPercent / 100)) }}</div>
      </div>
    </div>

    <div class="risk-indicators" v-if="hasRisks">
      <div class="risk-item" v-if="company.risks.managementTurnover">
        <span class="risk-icon">⚠️</span>
        <span class="risk-text">Management Changes</span>
      </div>
      <div class="risk-item" v-if="company.risks.missedTargets > 0">
        <span class="risk-icon">📉</span>
        <span class="risk-text">{{ company.risks.missedTargets }} Missed Target{{ company.risks.missedTargets > 1 ? 's' : '' }}</span>
      </div>
      <div class="risk-item" v-if="company.risks.competitorThreat === 'high'">
        <span class="risk-icon">🎯</span>
        <span class="risk-text">High Competition</span>
      </div>
    </div>

    <Transition name="details">
      <div v-if="showDetails" class="company-details-expanded">
        <div class="details-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab"
            @click.stop="activeTab = tab"
            :class="{ active: activeTab === tab }"
            class="tab-button"
          >
            {{ tab }}
          </button>
        </div>
        
        <div class="details-content">
          <div v-if="activeTab === 'Financial'" class="metrics-grid">
            <div v-for="metric in financialMetrics" :key="metric.label" class="detail-metric">
              <span class="detail-label">{{ metric.label }}</span>
              <span class="detail-value" :class="getTrendClass(metric.change)">
                {{ metric.value }}
                <small v-if="metric.change" :class="getTrendClass(metric.change)">
                  {{ metric.change > 0 ? '+' : '' }}{{ metric.change }}%
                </small>
              </span>
            </div>
          </div>
          
          <div v-if="activeTab === 'Operational'" class="metrics-grid">
            <div v-for="metric in operationalMetrics" :key="metric.label" class="detail-metric">
              <span class="detail-label">{{ metric.label }}</span>
              <span class="detail-value" :class="getTrendClass(metric.change)">
                {{ metric.value }}
                <small v-if="metric.change" :class="getTrendClass(metric.change)">
                  {{ metric.change > 0 ? '+' : '' }}{{ metric.change }}%
                </small>
              </span>
            </div>
          </div>
          
          <div v-if="activeTab === 'Funding'" class="funding-history">
            <div v-for="round in company.funding" :key="round.round" class="funding-round">
              <div class="round-info">
                <span class="round-name">{{ round.round }}</span>
                <span class="round-date">{{ formatDate(round.date) }}</span>
              </div>
              <div class="round-details">
                <span class="round-amount">${{ formatValue(round.amount) }}</span>
                <span class="round-lead">{{ round.leadInvestor }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </BaseCard>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseCard from '../common/BaseCard.vue'

const props = defineProps({
  company: {
    type: Object,
    required: true
  }
})

const showDetails = ref(false)
const activeTab = ref('Financial')
const tabs = ['Financial', 'Operational', 'Funding']

const healthLabel = computed(() => {
  switch(props.company.healthStatus) {
    case 'healthy': return 'Healthy'
    case 'warning': return 'Warning'
    case 'critical': return 'Critical'
    default: return 'Unknown'
  }
})

const healthStatusClass = computed(() => `health-${props.company.healthStatus}`)

const hasRisks = computed(() => {
  return props.company.risks.managementTurnover || 
         props.company.risks.missedTargets > 0 || 
         props.company.risks.competitorThreat === 'high'
})

const financialMetrics = computed(() => [
  { 
    label: 'Annual Recurring Revenue', 
    value: `$${formatValue(props.company.financials.arr)}`,
    change: props.company.financials.arrGrowth
  },
  { 
    label: 'Gross Margin', 
    value: `${props.company.financials.grossMargin}%`,
    change: 2.1
  },
  { 
    label: 'Monthly Burn Rate', 
    value: `$${formatValue(props.company.financials.burnRate)}`,
    change: -5.2
  },
  { 
    label: 'Cash Runway', 
    value: `${props.company.financials.cashRunway} months`,
    change: -2.0
  }
])

const operationalMetrics = computed(() => [
  { 
    label: 'Total Customers', 
    value: props.company.operations.customers.toLocaleString(),
    change: props.company.operations.customerGrowth
  },
  { 
    label: 'Monthly Churn Rate', 
    value: `${props.company.operations.churnRate}%`,
    change: -0.3
  },
  { 
    label: 'Net Promoter Score', 
    value: props.company.operations.nps.toString(),
    change: 3.2
  },
  { 
    label: 'LTV/CAC Ratio', 
    value: `${props.company.operations.ltvCacRatio.toFixed(1)}x`,
    change: 1.8
  }
])

function formatValue(value) {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`
  }
  return value.toLocaleString()
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  })
}

function getTrendClass(change) {
  if (change > 0) return 'trend-positive'
  if (change < 0) return 'trend-negative'
  return 'trend-neutral'
}

function getRunwayClass(runway) {
  if (runway < 6) return 'runway-critical'
  if (runway < 12) return 'runway-warning'
  return 'runway-healthy'
}
</script>

<style scoped>
.company-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.company-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.company-card.health-healthy {
  border-left-color: #10b981;
}

.company-card.health-warning {
  border-left-color: #f59e0b;
}

.company-card.health-critical {
  border-left-color: #ef4444;
}

.company-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.company-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.company-logo {
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 8px;
}

.company-name {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.company-details {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.company-details span {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
}

.company-status {
  text-align: right;
}

.health-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 500;
}

.health-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.health-healthy .health-dot {
  background: #10b981;
}

.health-warning .health-dot {
  background: #f59e0b;
}

.health-critical .health-dot {
  background: #ef4444;
}

.valuation-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 2px;
}

.valuation-amount {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.company-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 12px;
  padding: 12px 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.metric-item {
  text-align: center;
}

.metric-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
}

.trend-positive {
  color: #10b981;
}

.trend-negative {
  color: #ef4444;
}

.trend-neutral {
  color: #6b7280;
}

.runway-critical {
  color: #ef4444;
}

.runway-warning {
  color: #f59e0b;
}

.runway-healthy {
  color: #10b981;
}

.risk-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.risk-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  padding: 4px 6px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 4px;
  color: #dc2626;
}

.risk-icon {
  font-size: 12px;
}

.company-details-expanded {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px solid #e5e7eb;
}

.details-tabs {
  display: flex;
  margin-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.tab-button {
  background: none;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab-button:hover {
  color: #374151;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.details-content {
  min-height: 120px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.detail-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.detail-label {
  font-size: 13px;
  color: #6b7280;
}

.detail-value {
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-value small {
  font-size: 11px;
  font-weight: 500;
}

.funding-history {
  space-y: 8px;
}

.funding-round {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  margin-bottom: 8px;
}

.round-info {
  display: flex;
  flex-direction: column;
}

.round-name {
  font-weight: 600;
  color: #111827;
  font-size: 14px;
}

.round-date {
  font-size: 12px;
  color: #6b7280;
}

.round-details {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.round-amount {
  font-weight: 600;
  color: #059669;
  font-size: 14px;
}

.round-lead {
  font-size: 12px;
  color: #6b7280;
}

.details-enter-active,
.details-leave-active {
  transition: all 0.3s ease;
}

.details-enter-from,
.details-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.details-enter-to,
.details-leave-from {
  opacity: 1;
  max-height: 400px;
}

@media (max-width: 640px) {
  .company-metrics,
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .company-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .company-status {
    text-align: left;
  }
}

@media (prefers-color-scheme: dark) {
  .company-name {
    color: #f9fafb;
  }
  
  .company-details span {
    background: #374151;
    color: #d1d5db;
  }
  
  .valuation-amount {
    color: #f9fafb;
  }
  
  .company-logo {
    background: #374151;
  }
  
  .funding-round {
    background: #1f2937;
  }
  
  .round-name {
    color: #f9fafb;
  }
}
</style>