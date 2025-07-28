<template>
  <div class="operational-kpi-card" :class="[`priority-${kpi.priority}`, { alert: kpi.hasAlert }]">
    <div class="kpi-header">
      <div class="kpi-info">
        <div class="kpi-icon" :class="kpi.category">
          <ClockIcon v-if="kpi.category === 'processing'" />
          <FileCheckIcon v-else-if="kpi.category === 'claims'" />
          <DollarSignIcon v-else-if="kpi.category === 'financial'" />
          <UsersIcon v-else-if="kpi.category === 'customer'" />
          <ShieldIcon v-else-if="kpi.category === 'risk'" />
          <TrendingUpIcon v-else-if="kpi.category === 'performance'" />
          <CogIcon v-else />
        </div>
        <div class="kpi-meta">
          <h3 class="kpi-title">{{ kpi.title }}</h3>
          <span class="kpi-description">{{ kpi.description }}</span>
        </div>
      </div>
      
      <div class="kpi-actions">
        <button
          v-if="kpi.hasAlert"
          @click="viewAlert"
          class="alert-indicator"
          :title="kpi.alertMessage"
        >
          <AlertTriangleIcon />
        </button>
        
        <button @click="drillDown" class="drill-down-btn" title="View details">
          <ChevronRightIcon />
        </button>
      </div>
    </div>
    
    <div class="kpi-content">
      <div class="primary-metric">
        <div class="metric-value">
          <span class="value">{{ formatValue(kpi.currentValue, kpi.format) }}</span>
          <span class="unit" v-if="kpi.unit">{{ kpi.unit }}</span>
        </div>
        
        <div class="metric-change" :class="getChangeClass(kpi.change, kpi.changeDirection)">
          <TrendingUpIcon v-if="kpi.change > 0 && kpi.changeDirection === 'positive'" class="trend-icon" />
          <TrendingDownIcon v-else-if="kpi.change < 0 && kpi.changeDirection === 'positive'" class="trend-icon" />
          <TrendingUpIcon v-else-if="kpi.change > 0 && kpi.changeDirection === 'negative'" class="trend-icon" />
          <TrendingDownIcon v-else-if="kpi.change < 0 && kpi.changeDirection === 'negative'" class="trend-icon" />
          
          <span class="change-value">
            {{ kpi.change >= 0 ? '+' : '' }}{{ kpi.change.toFixed(1) }}%
          </span>
          <span class="change-period">{{ kpi.changePeriod }}</span>
        </div>
      </div>
      
      <!-- Mini Chart -->
      <div v-if="kpi.trendData" class="trend-chart">
        <svg class="chart-svg" viewBox="0 0 100 30">
          <polyline
            :points="generateTrendPoints(kpi.trendData)"
            :class="getTrendClass(kpi.change, kpi.changeDirection)"
            stroke-width="2"
            fill="none"
          />
          <circle
            v-for="(point, index) in kpi.trendData"
            :key="index"
            :cx="(index / (kpi.trendData.length - 1)) * 100"
            :cy="30 - ((point - Math.min(...kpi.trendData)) / (Math.max(...kpi.trendData) - Math.min(...kpi.trendData))) * 30"
            r="1.5"
            :class="getTrendClass(kpi.change, kpi.changeDirection)"
          />
        </svg>
      </div>
      
      <!-- Target and Benchmark -->
      <div class="kpi-benchmarks">
        <div v-if="kpi.target" class="benchmark-item">
          <span class="benchmark-label">Target:</span>
          <span class="benchmark-value" :class="getTargetStatusClass(kpi.currentValue, kpi.target, kpi.targetDirection)">
            {{ formatValue(kpi.target, kpi.format) }}{{ kpi.unit || '' }}
          </span>
        </div>
        
        <div v-if="kpi.industryBenchmark" class="benchmark-item">
          <span class="benchmark-label">Industry:</span>
          <span class="benchmark-value">
            {{ formatValue(kpi.industryBenchmark, kpi.format) }}{{ kpi.unit || '' }}
          </span>
        </div>
        
        <div v-if="kpi.previousPeriod" class="benchmark-item">
          <span class="benchmark-label">{{ kpi.previousPeriodLabel || 'Previous' }}:</span>
          <span class="benchmark-value">
            {{ formatValue(kpi.previousPeriod, kpi.format) }}{{ kpi.unit || '' }}
          </span>
        </div>
      </div>
      
      <!-- Regional Breakdown (if available) -->
      <div v-if="kpi.regionalData" class="regional-breakdown">
        <h5>Regional Performance</h5>
        <div class="regional-items">
          <div
            v-for="region in kpi.regionalData"
            :key="region.name"
            class="regional-item"
            :class="{ highlighted: region.isOutlier }"
          >
            <span class="region-name">{{ region.name }}</span>
            <span class="region-value">{{ formatValue(region.value, kpi.format) }}</span>
            <span class="region-change" :class="getChangeClass(region.change, kpi.changeDirection)">
              {{ region.change >= 0 ? '+' : '' }}{{ region.change.toFixed(1) }}%
            </span>
          </div>
        </div>
      </div>
      
      <!-- Key Insights -->
      <div v-if="kpi.insights && kpi.insights.length > 0" class="kpi-insights">
        <div class="insights-header">
          <BrainIcon class="insights-icon" />
          <span>AI Insights</span>
        </div>
        <div class="insights-list">
          <div
            v-for="insight in kpi.insights.slice(0, 2)"
            :key="insight.id"
            class="insight-item"
            :class="insight.type"
          >
            <div class="insight-text">{{ insight.text }}</div>
            <div class="insight-confidence">{{ Math.round(insight.confidence * 100) }}%</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="kpi-footer">
      <div class="last-updated">
        <span class="update-label">Updated:</span>
        <span class="update-time">{{ formatLastUpdated(kpi.lastUpdated) }}</span>
      </div>
      
      <div class="data-quality">
        <div class="quality-indicator" :class="getDataQualityClass(kpi.dataQuality)">
          <div class="quality-dot"></div>
          <span class="quality-text">{{ getDataQualityText(kpi.dataQuality) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ClockIcon from '@/components/icons/ClockIcon.vue'
import FileCheckIcon from '@/components/icons/FileCheckIcon.vue'
import DollarSignIcon from '@/components/icons/DollarSignIcon.vue'
import UsersIcon from '@/components/icons/UsersIcon.vue'
import ShieldIcon from '@/components/icons/ShieldIcon.vue'
import TrendingUpIcon from '@/components/icons/TrendingUpIcon.vue'
import TrendingDownIcon from '@/components/icons/TrendingDownIcon.vue'
import CogIcon from '@/components/icons/CogIcon.vue'
import AlertTriangleIcon from '@/components/icons/AlertTriangleIcon.vue'
import ChevronRightIcon from '@/components/icons/ChevronRightIcon.vue'
import BrainIcon from '@/components/icons/BrainIcon.vue'

const props = defineProps({
  kpi: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['drill-down', 'view-alert'])

// Methods
const formatValue = (value, format) => {
  if (!value && value !== 0) return 'N/A'
  
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value)
    
    case 'percentage':
      return (value * 100).toFixed(1) + '%'
    
    case 'decimal':
      return value.toFixed(2)
    
    case 'time':
      if (value < 60) return `${value.toFixed(1)}s`
      if (value < 3600) return `${(value / 60).toFixed(1)}m`
      if (value < 86400) return `${(value / 3600).toFixed(1)}h`
      return `${(value / 86400).toFixed(1)}d`
    
    case 'large-number':
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
      return value.toLocaleString()
    
    default:
      return value.toLocaleString()
  }
}

const getChangeClass = (change, direction) => {
  const isPositive = direction === 'positive' ? change >= 0 : change <= 0
  return isPositive ? 'positive' : 'negative'
}

const getTrendClass = (change, direction) => {
  const isPositive = direction === 'positive' ? change >= 0 : change <= 0
  return isPositive ? 'trend-positive' : 'trend-negative'
}

const getTargetStatusClass = (current, target, direction) => {
  const isOnTarget = direction === 'higher' ? current >= target : current <= target
  return isOnTarget ? 'on-target' : 'off-target'
}

const getDataQualityClass = (quality) => {
  if (quality >= 0.9) return 'excellent'
  if (quality >= 0.8) return 'good'
  if (quality >= 0.7) return 'fair'
  return 'poor'
}

const getDataQualityText = (quality) => {
  if (quality >= 0.9) return 'Excellent'
  if (quality >= 0.8) return 'Good'
  if (quality >= 0.7) return 'Fair'
  return 'Poor'
}

const generateTrendPoints = (data) => {
  if (!data || data.length === 0) return ''
  
  const minValue = Math.min(...data)
  const maxValue = Math.max(...data)
  const range = maxValue - minValue || 1
  
  return data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 30 - ((value - minValue) / range) * 30
      return `${x},${y}`
    })
    .join(' ')
}

const formatLastUpdated = (timestamp) => {
  const now = new Date()
  const updated = new Date(timestamp)
  const diffInMinutes = Math.floor((now - updated) / 60000)
  
  if (diffInMinutes < 1) return 'just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  return updated.toLocaleDateString()
}

const drillDown = () => {
  emit('drill-down', props.kpi.id)
}

const viewAlert = () => {
  emit('view-alert', props.kpi.alertDetails)
}
</script>

<style scoped>
.operational-kpi-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.operational-kpi-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: #cbd5e1;
}

.operational-kpi-card.alert {
  border-left: 4px solid #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, white 100%);
}

.operational-kpi-card.priority-high {
  border-top: 3px solid #3b82f6;
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.kpi-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.kpi-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-icon.processing {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.kpi-icon.claims {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.kpi-icon.financial {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.kpi-icon.customer {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.kpi-icon.risk {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.kpi-icon.performance {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.kpi-meta {
  flex: 1;
  min-width: 0;
}

.kpi-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.kpi-description {
  font-size: 13px;
  color: #64748b;
  line-height: 1.3;
}

.kpi-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.alert-indicator {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 4px;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s ease;
}

.alert-indicator:hover {
  background: #fee2e2;
}

.drill-down-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 4px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.drill-down-btn:hover {
  background: #f1f5f9;
  color: #374151;
}

.kpi-content {
  margin-bottom: 16px;
}

.primary-metric {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
}

.metric-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.unit {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.metric-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.metric-change.positive {
  color: #16a34a;
}

.metric-change.negative {
  color: #dc2626;
}

.trend-icon {
  width: 12px;
  height: 12px;
}

.change-period {
  color: #94a3b8;
  font-weight: 400;
}

.trend-chart {
  height: 30px;
  margin-bottom: 16px;
}

.chart-svg {
  width: 100%;
  height: 100%;
}

.chart-svg polyline.trend-positive {
  stroke: #16a34a;
}

.chart-svg polyline.trend-negative {
  stroke: #dc2626;
}

.chart-svg circle.trend-positive {
  fill: #16a34a;
}

.chart-svg circle.trend-negative {
  fill: #dc2626;
}

.kpi-benchmarks {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.benchmark-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.benchmark-label {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.benchmark-value {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.benchmark-value.on-target {
  color: #16a34a;
}

.benchmark-value.off-target {
  color: #dc2626;
}

.regional-breakdown {
  margin-bottom: 16px;
}

.regional-breakdown h5 {
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.regional-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.regional-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  align-items: center;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 11px;
  transition: background 0.15s ease;
}

.regional-item:hover {
  background: #f8fafc;
}

.regional-item.highlighted {
  background: #fef3c7;
  border: 1px solid #fbbf24;
}

.region-name {
  color: #64748b;
  font-weight: 500;
}

.region-value {
  color: #1e293b;
  font-weight: 600;
}

.region-change {
  font-weight: 500;
}

.region-change.positive {
  color: #16a34a;
}

.region-change.negative {
  color: #dc2626;
}

.kpi-insights {
  margin-bottom: 16px;
}

.insights-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.insights-icon {
  width: 14px;
  height: 14px;
  color: #3b82f6;
}

.insights-header span {
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.insight-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 11px;
}

.insight-item.opportunity {
  background: rgba(16, 185, 129, 0.05);
  border-left: 3px solid #10b981;
}

.insight-item.risk {
  background: rgba(239, 68, 68, 0.05);
  border-left: 3px solid #ef4444;
}

.insight-item.trend {
  background: rgba(59, 130, 246, 0.05);
  border-left: 3px solid #3b82f6;
}

.insight-text {
  flex: 1;
  color: #374151;
  line-height: 1.4;
}

.insight-confidence {
  font-size: 10px;
  color: #64748b;
  font-weight: 500;
  flex-shrink: 0;
}

.kpi-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  font-size: 11px;
}

.last-updated {
  display: flex;
  align-items: center;
  gap: 4px;
}

.update-label {
  color: #94a3b8;
  font-weight: 500;
}

.update-time {
  color: #64748b;
}

.data-quality {
  display: flex;
  align-items: center;
}

.quality-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}

.quality-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.quality-indicator.excellent .quality-dot {
  background: #10b981;
}

.quality-indicator.good .quality-dot {
  background: #22c55e;
}

.quality-indicator.fair .quality-dot {
  background: #f59e0b;
}

.quality-indicator.poor .quality-dot {
  background: #ef4444;
}

.quality-text {
  color: #64748b;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .operational-kpi-card {
    padding: 16px;
  }
  
  .primary-metric {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .value {
    font-size: 24px;
  }
  
  .kpi-benchmarks {
    grid-template-columns: 1fr;
  }
  
  .regional-item {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>