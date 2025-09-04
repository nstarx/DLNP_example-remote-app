<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-left">
        <h1 class="dashboard-title">McClatchy Editorial Dashboard</h1>
        <div class="header-subtitle">Chief Editor Analytics & Insights</div>
      </div>
      <div class="header-right">
        <DashboardFilters
          v-model:period="selectedPeriod"
          v-model:desk="selectedDesk"
          v-model:publication="selectedPublication"
          @refresh="handleRefresh"
        />
        <DocumentationButton @click="showDocs = true" />
      </div>
    </header>

    <nav class="dashboard-nav">
      <button
        v-for="section in dashboardSections"
        :key="section.id"
        :class="['nav-button', { active: activeSection === section.id }]"
        @click="activeSection = section.id"
      >
        <span class="nav-icon">{{ section.icon }}</span>
        {{ section.name }}
      </button>
    </nav>

    <LoadingSpinner v-if="loading" />
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="dashboard-content">
      <!-- Editorial Content Performance -->
      <EditorialContentSection
        v-show="activeSection === 'editorial'"
        :period="selectedPeriod"
        :desk="selectedDesk"
        :publication="selectedPublication"
      />

      <!-- Audience & Engagement -->
      <AudienceEngagementSection
        v-show="activeSection === 'audience'"
        :period="selectedPeriod"
        :desk="selectedDesk"
        :publication="selectedPublication"
      />

      <!-- Subscriber & Revenue -->
      <SubscriberRevenueSection
        v-show="activeSection === 'revenue'"
        :period="selectedPeriod"
        :desk="selectedDesk"
        :publication="selectedPublication"
      />

      <!-- Newsroom Productivity -->
      <NewsroomProductivitySection
        v-show="activeSection === 'productivity'"
        :period="selectedPeriod"
        :desk="selectedDesk"
        :publication="selectedPublication"
      />

      <!-- Local Impact & Community -->
      <LocalCommunitySection
        v-show="activeSection === 'community'"
        :period="selectedPeriod"
        :desk="selectedDesk"
        :publication="selectedPublication"
      />

      <!-- Forward-Looking Insights -->
      <ForwardInsightsSection
        v-show="activeSection === 'insights'"
        :period="selectedPeriod"
        :desk="selectedDesk"
        :publication="selectedPublication"
      />
    </div>

    <DocumentationModal v-model="showDocs" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, inject } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import DocumentationButton from '@/components/common/DocumentationButton.vue'
import DocumentationModal from '@/components/common/DocumentationModal.vue'
import DashboardFilters from '@/components/dashboard/DashboardFilters.vue'
import EditorialContentSection from '@/components/sections/EditorialContentSection.vue'
import AudienceEngagementSection from '@/components/sections/AudienceEngagementSection.vue'
import SubscriberRevenueSection from '@/components/sections/SubscriberRevenueSection.vue'
import NewsroomProductivitySection from '@/components/sections/NewsroomProductivitySection.vue'
import LocalCommunitySection from '@/components/sections/LocalCommunitySection.vue'
import ForwardInsightsSection from '@/components/sections/ForwardInsightsSection.vue'

const analyticsConfig = inject('analyticsConfig', {})
const selectedPeriod = ref(analyticsConfig.defaultPeriod || '7d')
const selectedDesk = ref('all')
const selectedPublication = ref('all')
const activeSection = ref('editorial')
const showDocs = ref(false)

const dashboardSections = ref([
  { id: 'editorial', name: 'Editorial Content', icon: '📝' },
  { id: 'audience', name: 'Audience & Engagement', icon: '👥' },
  { id: 'revenue', name: 'Subscriber & Revenue', icon: '💰' },
  { id: 'productivity', name: 'Newsroom Productivity', icon: '⚡' },
  { id: 'community', name: 'Local Impact', icon: '🏘️' },
  { id: 'insights', name: 'Forward Insights', icon: '🔮' }
])

const { metrics, chartData, loading, error, fetchAnalytics } = useAnalytics()

const handleRefresh = () => {
  fetchAnalytics(selectedPeriod.value, { 
    desk: selectedDesk.value, 
    publication: selectedPublication.value 
  })
}

watch([selectedPeriod, selectedDesk, selectedPublication], ([newPeriod, newDesk, newPublication]) => {
  fetchAnalytics(newPeriod, { desk: newDesk, publication: newPublication })
})

onMounted(() => {
  fetchAnalytics(selectedPeriod.value, { 
    desk: selectedDesk.value, 
    publication: selectedPublication.value 
  })
  
  if (analyticsConfig.refreshInterval) {
    setInterval(() => {
      fetchAnalytics(selectedPeriod.value, { 
        desk: selectedDesk.value, 
        publication: selectedPublication.value 
      })
    }, analyticsConfig.refreshInterval)
  }
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f9fafb;
  padding: 24px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 24px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dashboard-title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.header-subtitle {
  font-size: 16px;
  color: #6b7280;
  font-weight: 500;
}

.dashboard-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  padding: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: fit-content;
}

.nav-button:hover {
  background: #f3f4f6;
  color: #374151;
}

.nav-button.active {
  background: #3b82f6;
  color: white;
}

.nav-icon {
  font-size: 16px;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.error-message {
  background: #fee;
  color: #c00;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .header-left,
  .header-right {
    width: 100%;
  }
  
  .header-right {
    flex-wrap: wrap;
  }
  
  .dashboard-title {
    font-size: 24px;
  }
  
  .header-subtitle {
    font-size: 14px;
  }
  
  .dashboard-nav {
    padding: 4px;
    gap: 4px;
  }
  
  .nav-button {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .nav-icon {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .nav-button {
    flex-direction: column;
    gap: 4px;
    padding: 8px 6px;
    font-size: 10px;
  }
  
  .nav-button span {
    display: none;
  }
}

@media (prefers-color-scheme: dark) {
  .dashboard {
    background: #111827;
  }
  
  .dashboard-title {
    color: #f9fafb;
  }
  
  .header-subtitle {
    color: #9ca3af;
  }
  
  .dashboard-nav {
    background: #1f2937;
  }
  
  .nav-button {
    color: #9ca3af;
  }
  
  .nav-button:hover {
    background: #374151;
    color: #d1d5db;
  }
  
  .nav-button.active {
    background: #3b82f6;
    color: white;
  }
  
  .error-message {
    background: #7f1d1d;
    color: #fecaca;
  }
}
</style>