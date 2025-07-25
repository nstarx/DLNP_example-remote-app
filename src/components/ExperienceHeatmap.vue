<template>
  <div class="experience-heatmap">
    <header class="heatmap-header">
      <div class="header-left">
        <h1 class="heatmap-title">Experience Quality Heatmap</h1>
        <p class="heatmap-subtitle">
          Monitor device health and automation success across your organization
        </p>
      </div>
      <div class="header-right">
        <button 
          class="refresh-button"
          @click="refreshData"
          :disabled="loading"
        >
          <span class="refresh-icon" :class="{ spinning: loading }">⟳</span>
          Refresh
        </button>
      </div>
    </header>

    <!-- Alert Banners -->
    <AlertBanner 
      :alerts="visibleAlerts"
      @view-details="viewZoneDetails"
      @dismiss-alert="dismissAlert"
    />

    <!-- Filters -->
    <HeatmapFilters 
      :filters="filters"
      @update:filters="updateFilters"
    />

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" />
    
    <!-- Error State -->
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Main Content -->
    <div v-else class="heatmap-content">
      <!-- Summary Stats -->
      <div class="summary-section">
        <div class="summary-stats">
          <div class="stat-item">
            <span class="stat-value">{{ totalDevices }}</span>
            <span class="stat-label">Total Devices</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ healthyZones }}</span>
            <span class="stat-label">Healthy Zones</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ problemZones }}</span>
            <span class="stat-label">Problem Zones</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ avgScore }}%</span>
            <span class="stat-label">Avg Score</span>
          </div>
        </div>
      </div>

      <!-- Heatmap Grid -->
      <div class="grid-section">
        <div v-if="zones.length === 0" class="empty-state">
          <div class="empty-icon">📊</div>
          <h3 class="empty-title">No zones found</h3>
          <p class="empty-message">
            Try adjusting your filters to see more zones.
          </p>
        </div>
        <HeatmapGrid 
          v-else
          :zones="zones"
          :get-score-color="getScoreColor"
          :get-score-label="getScoreLabel"
          @zone-click="viewZoneDetails"
        />
      </div>

      <!-- Legend -->
      <div class="legend-section">
        <h3 class="legend-title">Health Score Legend</h3>
        <div class="legend-items">
          <div class="legend-item">
            <div class="legend-color" style="background: #10b981;"></div>
            <span class="legend-label">85-100: Healthy</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: #f59e0b;"></div>
            <span class="legend-label">70-84: Warning</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: #ef4444;"></div>
            <span class="legend-label">50-69: Critical</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background: #dc2626;"></div>
            <span class="legend-label">0-49: Severe</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Zone Detail Modal -->
    <ZoneDetailModal 
      :is-visible="showZoneModal"
      :zone="selectedZone"
      :get-score-color="getScoreColor"
      :get-score-label="getScoreLabel"
      @close="closeZoneModal"
      @apply-fix="applyFix"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useExperienceHeatmap } from '@/composables/useExperienceHeatmap'
import HeatmapFilters from './heatmap/HeatmapFilters.vue'
import HeatmapGrid from './heatmap/HeatmapGrid.vue'
import ZoneDetailModal from './heatmap/ZoneDetailModal.vue'
import AlertBanner from './heatmap/AlertBanner.vue'
import LoadingSpinner from './common/LoadingSpinner.vue'

const {
  zones,
  filters,
  majorAlerts,
  loading,
  error,
  getScoreColor,
  getScoreLabel,
  fetchHeatmapData
} = useExperienceHeatmap()

const showZoneModal = ref(false)
const selectedZone = ref(null)
const dismissedAlerts = ref(new Set())

// Computed properties for summary stats
const totalDevices = computed(() => {
  return zones.value.reduce((total, zone) => total + zone.devices, 0)
})

const healthyZones = computed(() => {
  return zones.value.filter(zone => zone.score >= 85).length
})

const problemZones = computed(() => {
  return zones.value.filter(zone => zone.score < 70).length
})

const avgScore = computed(() => {
  if (zones.value.length === 0) return 0
  const total = zones.value.reduce((sum, zone) => sum + zone.score, 0)
  return Math.round(total / zones.value.length)
})

// Filter out dismissed alerts
const visibleAlerts = computed(() => {
  return majorAlerts.value.filter(alert => !dismissedAlerts.value.has(alert.id))
})

// Methods
const updateFilters = (newFilters) => {
  Object.assign(filters.value, newFilters)
}

const refreshData = () => {
  fetchHeatmapData()
}

const viewZoneDetails = (zone) => {
  selectedZone.value = zone
  showZoneModal.value = true
}

const closeZoneModal = () => {
  showZoneModal.value = false
  selectedZone.value = null
}

const dismissAlert = (alertId) => {
  dismissedAlerts.value.add(alertId)
}

const applyFix = ({ zone, issue }) => {
  // Simulate applying a fix
  console.log(`Applying fix "${issue.fix}" to ${zone.name}`)
  
  // Show a success message (in a real app, this would trigger an actual fix process)
  alert(`Fix "${issue.fix}" has been queued for ${zone.name}. This will affect ${issue.count} devices.`)
}

// Lifecycle
onMounted(() => {
  fetchHeatmapData()
})

// Auto-refresh every 5 minutes
onMounted(() => {
  const interval = setInterval(() => {
    if (!loading.value) {
      fetchHeatmapData()
    }
  }, 5 * 60 * 1000) // 5 minutes

  // Cleanup interval on unmount
  return () => clearInterval(interval)
})
</script>

<style scoped>
.experience-heatmap {
  min-height: 100vh;
  background: #f9fafb;
  padding: 24px;
}

.heatmap-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 24px;
}

.header-left {
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.heatmap-title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.heatmap-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.refresh-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #d1d5db;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-button:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-icon {
  font-size: 16px;
  transition: transform 0.5s ease;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-message {
  background: #fee;
  color: #c00;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 24px;
}

.heatmap-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.summary-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  text-align: center;
}

.grid-section {
  min-height: 400px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.empty-message {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.legend-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.legend-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

@media (max-width: 768px) {
  .experience-heatmap {
    padding: 16px;
  }
  
  .heatmap-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .heatmap-title {
    font-size: 24px;
  }
  
  .summary-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .legend-items {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (prefers-color-scheme: dark) {
  .experience-heatmap {
    background: #111827;
  }
  
  .heatmap-title {
    color: #f9fafb;
  }
  
  .heatmap-subtitle {
    color: #9ca3af;
  }
  
  .refresh-button {
    background: #374151;
    border-color: #4b5563;
    color: #d1d5db;
  }
  
  .refresh-button:hover:not(:disabled) {
    background: #4b5563;
    border-color: #6b7280;
  }
  
  .error-message {
    background: #7f1d1d;
    color: #fecaca;
  }
  
  .summary-section,
  .legend-section {
    background: #1f2937;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  
  .stat-value {
    color: #f9fafb;
  }
  
  .stat-label {
    color: #9ca3af;
  }
  
  .empty-title {
    color: #d1d5db;
  }
  
  .empty-message {
    color: #9ca3af;
  }
  
  .legend-title {
    color: #f9fafb;
  }
  
  .legend-label {
    color: #d1d5db;
  }
}
</style>