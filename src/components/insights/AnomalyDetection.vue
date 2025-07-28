<template>
  <div class="anomaly-detection">
    <div class="anomaly-header">
      <h3 class="anomaly-title">⚠️ Anomaly Detection System</h3>
      <div class="detection-status">
        <div class="status-indicator" :class="systemStatus">
          <div class="status-dot"></div>
          <span>{{ systemStatusText }}</span>
        </div>
        <div class="last-scan">
          Last scan: {{ formatTime(lastScan) }}
        </div>
      </div>
    </div>
    
    <!-- Quick Stats -->
    <div class="anomaly-stats">
      <div class="stat-card critical">
        <div class="stat-value">{{ anomalies.filter(a => a.severity === 'Critical').length }}</div>
        <div class="stat-label">Critical</div>
      </div>
      <div class="stat-card high">
        <div class="stat-value">{{ anomalies.filter(a => a.severity === 'High').length }}</div>
        <div class="stat-label">High</div>
      </div>
      <div class="stat-card medium">
        <div class="stat-value">{{ anomalies.filter(a => a.severity === 'Medium').length }}</div>
        <div class="stat-label">Medium</div>
      </div>
      <div class="stat-card resolved">
        <div class="stat-value">{{ resolvedCount }}</div>
        <div class="stat-label">Resolved (24h)</div>
      </div>
    </div>
    
    <!-- Anomaly Timeline -->
    <div class="anomaly-timeline">
      <h4 class="timeline-title">Recent Anomalies</h4>
      <div class="timeline-container">
        <div 
          v-for="anomaly in sortedAnomalies" 
          :key="anomaly.id"
          class="timeline-item"
          :class="[anomaly.severity.toLowerCase(), { resolved: anomaly.resolved }]"
        >
          <div class="timeline-marker">
            <div class="marker-dot" :class="anomaly.severity.toLowerCase()"></div>
            <div class="timeline-line"></div>
          </div>
          
          <div class="anomaly-card">
            <div class="anomaly-card-header">
              <div class="anomaly-info">
                <span class="anomaly-severity" :class="anomaly.severity.toLowerCase()">
                  {{ anomaly.severity }}
                </span>
                <span class="anomaly-type">{{ anomaly.type }}</span>
                <span class="anomaly-time">{{ formatTime(anomaly.detected) }}</span>
              </div>
              <div class="anomaly-actions">
                <button 
                  class="action-btn investigate"
                  @click="investigateAnomaly(anomaly)"
                  :disabled="anomaly.resolved"
                >
                  🔍 Investigate
                </button>
                <button 
                  class="action-btn resolve"
                  @click="resolveAnomaly(anomaly)"
                  :disabled="anomaly.resolved"
                >
                  ✅ Resolve
                </button>
              </div>
            </div>
            
            <div class="anomaly-description">{{ anomaly.description }}</div>
            
            <div class="anomaly-details">
              <div class="detail-row">
                <span class="detail-label">Confidence:</span>
                <div class="confidence-bar">
                  <div 
                    class="confidence-fill" 
                    :style="{ width: (anomaly.confidence * 100) + '%' }"
                    :class="getConfidenceClass(anomaly.confidence)"
                  ></div>
                </div>
                <span class="confidence-value">{{ Math.round(anomaly.confidence * 100) }}%</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Impact:</span>
                <span class="impact-value" :class="getImpactClass(anomaly.impact)">
                  {{ anomaly.impact }}
                </span>
              </div>
              
              <div class="detail-row" v-if="anomaly.affectedMetrics">
                <span class="detail-label">Affected Metrics:</span>
                <div class="affected-metrics">
                  <span 
                    v-for="metric in anomaly.affectedMetrics" 
                    :key="metric"
                    class="metric-tag"
                  >
                    {{ metric }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Root Cause Hint -->
            <div v-if="anomaly.rootCauseHint" class="root-cause-hint">
              <span class="hint-icon">💡</span>
              <span class="hint-text">{{ anomaly.rootCauseHint }}</span>
            </div>
            
            <!-- Anomaly Chart -->
            <div v-if="anomaly.chartData" class="anomaly-chart">
              <div class="chart-title">Metric Trend</div>
              <div class="mini-chart">
                <svg width="100%" height="60" viewBox="0 0 300 60">
                  <defs>
                    <gradient id="anomalyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#ef4444;stop-opacity:0.3" />
                      <stop offset="100%" style="stop-color:#ef4444;stop-opacity:0.1" />
                    </gradient>
                  </defs>
                  
                  <!-- Normal range -->
                  <rect x="0" y="15" width="300" height="30" fill="#f3f4f6" rx="2"/>
                  
                  <!-- Anomaly indicators -->
                  <circle 
                    v-for="(point, index) in anomaly.chartData" 
                    :key="index"
                    :cx="(index / (anomaly.chartData.length - 1)) * 300"
                    :cy="60 - (point.value * 50)"
                    :r="point.isAnomaly ? 4 : 2"
                    :fill="point.isAnomaly ? '#ef4444' : '#3b82f6'"
                    :opacity="point.isAnomaly ? 1 : 0.6"
                  />
                  
                  <!-- Trend line -->
                  <polyline
                    :points="generateTrendLine(anomaly.chartData)"
                    fill="none"
                    stroke="#6b7280"
                    stroke-width="1"
                    opacity="0.5"
                  />
                </svg>
              </div>
              <div class="chart-legend">
                <span class="legend-item">
                  <span class="legend-color normal"></span>
                  Normal Range
                </span>
                <span class="legend-item">
                  <span class="legend-color anomaly"></span>
                  Anomaly Detected
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Anomaly Patterns -->
    <div class="anomaly-patterns">
      <h4 class="patterns-title">Detected Patterns</h4>
      <div class="patterns-grid">
        <div v-for="pattern in patterns" :key="pattern.id" class="pattern-card">
          <div class="pattern-header">
            <span class="pattern-icon">{{ pattern.icon }}</span>
            <div class="pattern-info">
              <div class="pattern-name">{{ pattern.name }}</div>
              <div class="pattern-frequency">{{ pattern.frequency }} occurrences</div>
            </div>
          </div>
          <div class="pattern-description">{{ pattern.description }}</div>
          <div class="pattern-recommendation">
            <strong>Recommendation:</strong> {{ pattern.recommendation }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Detection Settings -->
    <div class="detection-settings">
      <h4 class="settings-title">Detection Settings</h4>
      <div class="settings-grid">
        <div class="setting-item">
          <label>Sensitivity Level</label>
          <select v-model="settings.sensitivity" @change="updateSettings">
            <option value="low">Low (fewer false positives)</option>
            <option value="medium">Medium (balanced)</option>
            <option value="high">High (catch more anomalies)</option>
          </select>
        </div>
        <div class="setting-item">
          <label>Scan Frequency</label>
          <select v-model="settings.scanFrequency" @change="updateSettings">
            <option value="realtime">Real-time</option>
            <option value="5min">Every 5 minutes</option>
            <option value="15min">Every 15 minutes</option>
            <option value="hourly">Hourly</option>
          </select>
        </div>
        <div class="setting-item">
          <label>Auto-resolve Low Priority</label>
          <input 
            type="checkbox" 
            v-model="settings.autoResolve" 
            @change="updateSettings"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive data
const lastScan = ref(new Date())
const systemStatus = ref('active')
const resolvedCount = ref(23)

const settings = ref({
  sensitivity: 'medium',
  scanFrequency: 'realtime',
  autoResolve: false
})

// Mock anomaly data
const anomalies = ref([
  {
    id: 'ANO_001',
    type: 'Performance Degradation',
    severity: 'Critical',
    description: 'Claims processing time increased by 45% in Southeast region over the past 2 hours',
    detected: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    confidence: 0.94,
    impact: 'High - Customer satisfaction at risk',
    resolved: false,
    affectedMetrics: ['Processing Time', 'Customer Satisfaction', 'Regional Efficiency'],
    rootCauseHint: 'Staffing shortage detected in Southeast processing center',
    chartData: generateMockChartData(20, true)
  },
  {
    id: 'ANO_002',
    type: 'Cost Variance',
    severity: 'High',
    description: 'Operating expenses trending 15% above quarterly budget in technology spending',
    detected: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    confidence: 0.87,
    impact: 'Medium - Budget variance alert',
    resolved: false,
    affectedMetrics: ['Technology Costs', 'Budget Variance'],
    rootCauseHint: 'Unplanned cloud infrastructure scaling detected',
    chartData: generateMockChartData(15, true)
  },
  {
    id: 'ANO_003',
    type: 'Quality Issue',
    severity: 'Medium',
    description: 'Customer satisfaction scores dropped by 8% in digital channels over past week',
    detected: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    confidence: 0.91,
    impact: 'Medium - Service quality concern',
    resolved: false,
    affectedMetrics: ['Customer Satisfaction', 'Digital Experience'],
    rootCauseHint: 'Recent system update may have impacted user experience',
    chartData: generateMockChartData(25, true)
  },
  {
    id: 'ANO_004',
    type: 'Volume Surge',
    severity: 'High',
    description: 'Claims volume increased by 35% above normal levels in the past 24 hours',
    detected: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    confidence: 0.89,
    impact: 'High - Resource capacity concern',
    resolved: true,
    affectedMetrics: ['Claims Volume', 'Processing Capacity'],
    rootCauseHint: 'Weather event in multiple regions triggered surge',
    chartData: generateMockChartData(30, false)
  }
])

// Detected patterns
const patterns = ref([
  {
    id: 'PAT_001',
    name: 'Weekend Processing Delays',
    icon: '📅',
    frequency: 8,
    description: 'Processing times consistently increase by 20-30% on weekends across all regions',
    recommendation: 'Consider weekend staffing adjustments or workload redistribution'
  },
  {
    id: 'PAT_002', 
    name: 'Month-end Volume Spikes',
    icon: '📈',
    frequency: 12,
    description: 'Claims and customer inquiries spike 40% during last week of each month',
    recommendation: 'Implement predictive staffing model for month-end periods'
  },
  {
    id: 'PAT_003',
    name: 'System Performance Correlation',
    icon: '💻',
    frequency: 15,
    description: 'Customer satisfaction drops when system response time exceeds 3 seconds',
    recommendation: 'Set up automated scaling when response time reaches 2.5 seconds'
  }
])

// Computed properties
const sortedAnomalies = computed(() => {
  return [...anomalies.value].sort((a, b) => {
    // Sort by resolved status (unresolved first), then by severity, then by time
    if (a.resolved !== b.resolved) return a.resolved ? 1 : -1
    
    const severityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 }
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[b.severity] - severityOrder[a.severity]
    }
    
    return new Date(b.detected) - new Date(a.detected)
  })
})

const systemStatusText = computed(() => {
  const statusMap = {
    'active': 'Active Monitoring',
    'warning': 'Performance Issues',
    'error': 'System Error',
    'maintenance': 'Maintenance Mode'
  }
  return statusMap[systemStatus.value] || 'Unknown'
})

// Methods
function generateMockChartData(points, includeAnomalies) {
  const data = []
  for (let i = 0; i < points; i++) {
    const normalValue = 0.3 + Math.random() * 0.4 // 0.3-0.7 range
    const isAnomaly = includeAnomalies && Math.random() < 0.2 && i > points * 0.6 // Anomalies in last 40%
    const value = isAnomaly ? Math.random() * 0.3 + 0.7 : normalValue // Anomalies in 0.7-1.0 range
    
    data.push({
      value,
      isAnomaly,
      timestamp: new Date(Date.now() - (points - i) * 10 * 60 * 1000) // 10 min intervals
    })
  }
  return data
}

function generateTrendLine(chartData) {
  return chartData.map((point, index) => {
    const x = (index / (chartData.length - 1)) * 300
    const y = 60 - (point.value * 50)
    return `${x},${y}`
  }).join(' ')
}

function formatTime(date) {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  
  if (minutes < 60) {
    return `${minutes}m ago`
  } else if (hours < 24) {
    return `${hours}h ago`
  } else {
    return date.toLocaleDateString()
  }
}

function getConfidenceClass(confidence) {
  if (confidence >= 0.9) return 'high'
  if (confidence >= 0.8) return 'medium'
  return 'low'
}

function getImpactClass(impact) {
  if (impact.toLowerCase().includes('high')) return 'high-impact'
  if (impact.toLowerCase().includes('medium')) return 'medium-impact'
  return 'low-impact'
}

function investigateAnomaly(anomaly) {
  console.log('Investigating anomaly:', anomaly.id)
  // In real app: open detailed analysis view, trigger investigation workflow
}

function resolveAnomaly(anomaly) {
  anomaly.resolved = true
  resolvedCount.value++
  console.log('Resolved anomaly:', anomaly.id)
  // In real app: update database, create resolution record
}

function updateSettings() {
  console.log('Updated detection settings:', settings.value)
  // In real app: save settings to backend, adjust detection algorithms
}

// Lifecycle
onMounted(() => {
  // Simulate real-time updates
  setInterval(() => {
    lastScan.value = new Date()
    
    // Occasionally generate new anomalies
    if (Math.random() < 0.1) {
      generateNewAnomaly()
    }
  }, 5000) // Update every 5 seconds
})

function generateNewAnomaly() {
  const types = ['Performance Degradation', 'Cost Variance', 'Quality Issue', 'Volume Surge', 'Security Alert']
  const severities = ['Medium', 'High', 'Critical']
  
  const newAnomaly = {
    id: `ANO_${Date.now()}`,
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    description: 'Real-time anomaly detected by AI monitoring system',
    detected: new Date(),
    confidence: 0.7 + Math.random() * 0.3,
    impact: 'Medium - Requires investigation',
    resolved: false,
    affectedMetrics: ['System Performance'],
    rootCauseHint: 'Investigation in progress...',
    chartData: generateMockChartData(10, true)
  }
  
  anomalies.value.unshift(newAnomaly)
  
  // Keep only last 20 anomalies
  if (anomalies.value.length > 20) {
    anomalies.value = anomalies.value.slice(0, 20)
  }
}
</script>

<style scoped>
.anomaly-detection {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.anomaly-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}

.anomaly-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.detection-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.status-indicator.active { color: #10b981; }
.status-indicator.warning { color: #f59e0b; }
.status-indicator.error { color: #ef4444; }

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-indicator.active .status-dot { background: #10b981; }
.status-indicator.warning .status-dot { background: #f59e0b; }
.status-indicator.error .status-dot { background: #ef4444; }

.last-scan {
  font-size: 12px;
  color: #64748b;
}

.anomaly-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  border: 2px solid transparent;
}

.stat-card.critical {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-color: #ef4444;
}

.stat-card.high {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #f59e0b;
}

.stat-card.medium {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-color: #3b82f6;
}

.stat-card.resolved {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border-color: #10b981;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  margin-top: 4px;
}

.anomaly-timeline {
  margin-bottom: 32px;
}

.timeline-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.timeline-container {
  position: relative;
}

.timeline-item {
  display: flex;
  margin-bottom: 24px;
  position: relative;
}

.timeline-item.resolved {
  opacity: 0.6;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
  position: relative;
}

.marker-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 0 2px;
  z-index: 1;
}

.marker-dot.critical { background: #ef4444; box-shadow: 0 0 0 2px #ef4444; }
.marker-dot.high { background: #f59e0b; box-shadow: 0 0 0 2px #f59e0b; }
.marker-dot.medium { background: #3b82f6; box-shadow: 0 0 0 2px #3b82f6; }

.timeline-line {
  width: 2px;
  height: 80px;
  background: #e2e8f0;
  margin-top: 4px;
}

.timeline-item:last-child .timeline-line {
  display: none;
}

.anomaly-card {
  flex: 1;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
}

.anomaly-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.anomaly-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.anomaly-severity {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.anomaly-severity.critical {
  background: #fee2e2;
  color: #991b1b;
}

.anomaly-severity.high {
  background: #fef3c7;
  color: #92400e;
}

.anomaly-severity.medium {
  background: #dbeafe;
  color: #1e40af;
}

.anomaly-type {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.anomaly-time {
  font-size: 12px;
  color: #64748b;
}

.anomaly-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.investigate {
  background: #dbeafe;
  color: #1e40af;
}

.action-btn.investigate:hover:not(:disabled) {
  background: #3b82f6;
  color: white;
}

.action-btn.resolve {
  background: #dcfce7;
  color: #166534;
}

.action-btn.resolve:hover:not(:disabled) {
  background: #10b981;
  color: white;
}

.anomaly-description {
  font-size: 14px;
  color: #374151;
  margin-bottom: 16px;
  line-height: 1.5;
}

.anomaly-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.detail-label {
  font-weight: 500;
  color: #64748b;
  min-width: 80px;
}

.confidence-bar {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  max-width: 100px;
}

.confidence-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.confidence-fill.high { background: #10b981; }
.confidence-fill.medium { background: #f59e0b; }
.confidence-fill.low { background: #ef4444; }

.confidence-value {
  font-weight: 600;
  color: #374151;
  min-width: 35px;
}

.impact-value {
  font-weight: 500;
}

.impact-value.high-impact { color: #ef4444; }
.impact-value.medium-impact { color: #f59e0b; }
.impact-value.low-impact { color: #10b981; }

.affected-metrics {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.metric-tag {
  background: #e2e8f0;
  color: #374151;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.root-cause-hint {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.hint-icon {
  font-size: 14px;
}

.hint-text {
  font-size: 12px;
  color: #92400e;
  font-style: italic;
}

.anomaly-chart {
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
}

.chart-title {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 8px;
}

.mini-chart {
  margin-bottom: 8px;
}

.chart-legend {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #64748b;
}

.legend-color {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.legend-color.normal { background: #f3f4f6; }
.legend-color.anomaly { background: #ef4444; }

.anomaly-patterns {
  margin-bottom: 32px;
}

.patterns-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.patterns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.pattern-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
}

.pattern-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.pattern-icon {
  font-size: 20px;
}

.pattern-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.pattern-frequency {
  font-size: 12px;
  color: #64748b;
}

.pattern-description {
  font-size: 13px;
  color: #374151;
  margin-bottom: 8px;
  line-height: 1.4;
}

.pattern-recommendation {
  font-size: 12px;
  color: #64748b;
  background: #f1f5f9;
  padding: 8px;
  border-radius: 4px;
  border-left: 3px solid #3b82f6;
}

.detection-settings {
  border-top: 1px solid #e2e8f0;
  padding-top: 24px;
}

.settings-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.setting-item select,
.setting-item input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
}

.setting-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  padding: 0;
}

@media (max-width: 768px) {
  .anomaly-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .detection-status {
    align-items: flex-start;
  }
  
  .anomaly-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .anomaly-card-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .patterns-grid {
    grid-template-columns: 1fr;
  }
  
  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>