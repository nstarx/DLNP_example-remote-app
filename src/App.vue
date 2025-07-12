<template>
  <div class="fifa-dashboard">
    <header class="dashboard-header">
      <div class="header-content">
        <div class="header-left">
          <div class="fifa-logo">
            <div class="logo-circle">
              <svg viewBox="0 0 24 24" fill="currentColor" class="logo-icon">
                <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22S22 17.52 22 12S17.52 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4S20 7.59 20 12S16.41 20 12 20M12 6L13.5 9H17L14.5 11L15.5 14L12 12L8.5 14L9.5 11L7 9H10.5L12 6Z"/>
              </svg>
            </div>
            <div class="logo-text">FIFA</div>
          </div>
          <div class="tournament-info">
            <h1 class="dashboard-title">Club World Cup USA 2025</h1>
            <p class="tournament-subtitle">{{ tournamentData.tournament.dates }} • {{ tournamentData.tournament.format }}</p>
          </div>
        </div>
        <div class="header-right">
          <div class="view-selector">
            <button
              v-for="view in views"
              :key="view.id"
              :class="['view-btn', { active: selectedView === view.id }]"
              @click="selectedView = view.id"
            >
              {{ view.name }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <LoadingSpinner v-if="loading" />
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="dashboard-content">
      <!-- Key Metrics Section -->
      <section class="metrics-section">
        <div class="section-header">
          <h2>Tournament Overview</h2>
          <p>Key statistics and metrics for the FIFA Club World Cup USA 2025</p>
        </div>
        <div class="metrics-grid">
          <FifaMetricCard
            v-for="metric in tournamentMetrics"
            :key="metric.label"
            :metric="metric"
          />
        </div>
      </section>

      <!-- Charts Section -->
      <section class="charts-section">
        <div class="charts-grid">
          <!-- Team Rankings Scatter Plot -->
          <ScatterPlot
            title="Team Market Value vs FIFA Ranking"
            :data="scatterData"
            x-label="FIFA Ranking"
            y-label="Market Value (€M)"
          />
          
          <!-- Continental Strength Radar -->
          <RadarChart
            title="Continental Strength Analysis"
            :labels="['Market Value', 'Titles Won', 'Avg Ranking', 'Team Count', 'Experience']"
            :datasets="continentRadarData"
          />
          
          <!-- Goals by Team Line Chart -->
          <LineChart
            title="Goals Scored by Top Teams"
            :data="topTeamsGoals"
            :labels="topTeamsLabels"
          />
          
          <!-- Venue Capacity Bar Chart -->
          <BarChart
            title="Stadium Capacities"
            :data="venueCapacities"
            :labels="venueNames"
          />
        </div>
      </section>

      <!-- EDA Section -->
      <section class="eda-section">
        <div class="section-header">
          <h2>Exploratory Data Analysis</h2>
          <p>Deep dive into tournament patterns and insights</p>
        </div>
        <div class="eda-grid">
          <!-- Performance Correlation Heatmap -->
          <HeatmapChart
            title="Team Performance Correlation Matrix"
            :data="correlationMatrix"
            :row-labels="performanceLabels"
            :column-labels="performanceLabels"
            :show-values="true"
            legend-title="Correlation"
            color-scheme="blue"
          />
          
          <!-- Historical Trends -->
          <div class="historical-trends">
            <BaseCard>
              <div class="trend-container">
                <h3>Historical Tournament Trends</h3>
                <div class="trend-charts">
                  <LineChart
                    title="Goals Per Tournament"
                    :data="tournamentData.historicalData.totalGoals"
                    :labels="tournamentData.historicalData.years.map(y => y.toString())"
                  />
                  <LineChart
                    title="Average Attendance"
                    :data="tournamentData.historicalData.avgAttendance"
                    :labels="tournamentData.historicalData.years.map(y => y.toString())"
                  />
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
      </section>

      <!-- Insights Section -->
      <section class="insights-section">
        <div class="section-header">
          <h2>Key Insights</h2>
          <p>Data-driven insights from the tournament analysis</p>
        </div>
        <div class="insights-grid">
          <div class="insight-card" v-for="insight in keyInsights" :key="insight.title">
            <div class="insight-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" class="insight-icon-svg">
                <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22S22 17.52 22 12S17.52 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4S20 7.59 20 12S16.41 20 12 20M12 6L13.5 9H17L14.5 11L15.5 14L12 12L8.5 14L9.5 11L7 9H10.5L12 6Z"/>
              </svg>
            </div>
            <div class="insight-content">
              <h3>{{ insight.title }}</h3>
              <p>{{ insight.description }}</p>
              <div class="insight-value">{{ insight.value }}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { fifaClubWorldCup2025, getContinentStats, getTopTeamsByMarketValue } from '@/data/fifaData'
import FifaMetricCard from '@/components/fifa/FifaMetricCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import ScatterPlot from '@/components/charts/ScatterPlot.vue'
import RadarChart from '@/components/charts/RadarChart.vue'
import HeatmapChart from '@/components/charts/HeatmapChart.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import BaseCard from '@/components/common/BaseCard.vue'

const analyticsConfig = inject('analyticsConfig', {})
const selectedView = ref('overview')
const loading = ref(false)
const error = ref(null)

const views = [
  { id: 'overview', name: 'Overview' },
  { id: 'teams', name: 'Teams' },
  { id: 'venues', name: 'Venues' },
  { id: 'analytics', name: 'Analytics' }
]

const tournamentData = fifaClubWorldCup2025

const tournamentMetrics = computed(() => [
  {
    label: 'Total Teams',
    value: tournamentData.teams.length,
    icon: 'team',
    subtext: 'From 6 confederations',
    change: 8.3,
    trend: 'up'
  },
  {
    label: 'Total Venues',
    value: tournamentData.venues.length,
    icon: 'stadium',
    subtext: 'Across the USA',
    change: 12.5,
    trend: 'up'
  },
  {
    label: 'Total Matches',
    value: tournamentData.tournament.totalMatches,
    icon: 'ball',
    subtext: 'Including final',
    change: 15.2,
    trend: 'up'
  },
  {
    label: 'Prize Pool',
    value: '$100M',
    icon: 'trophy',
    subtext: 'Biggest ever',
    change: 25.0,
    trend: 'up'
  },
  {
    label: 'Expected Attendance',
    value: '1.85M',
    icon: 'users',
    subtext: 'Total spectators',
    change: 18.7,
    trend: 'up'
  },
  {
    label: 'Global Reach',
    value: '2.5B',
    icon: 'globe',
    subtext: 'TV viewers expected',
    change: 22.1,
    trend: 'up'
  }
])

const scatterData = computed(() => {
  return tournamentData.teams.map(team => ({
    x: team.ranking,
    y: team.marketValue,
    label: team.name,
    extra: `${team.continent} | ${team.titles} titles`,
    color: getTeamColor(team.continent),
    size: Math.max(4, team.titles + 4)
  }))
})

const continentRadarData = computed(() => {
  return [
    {
      name: 'Europe',
      color: '#3b82f6',
      data: [85, 90, 25, 80, 95]
    },
    {
      name: 'South America',
      color: '#ef4444',
      data: [65, 85, 40, 60, 90]
    },
    {
      name: 'North America',
      color: '#10b981',
      data: [45, 40, 60, 40, 50]
    }
  ]
})

const topTeamsGoals = computed(() => {
  return tournamentData.performanceMetrics.goalsScoredAvg.slice(0, 12)
})

const topTeamsLabels = computed(() => {
  return getTopTeamsByMarketValue(12).map(team => team.name)
})

const venueCapacities = computed(() => {
  return tournamentData.venues.map(venue => venue.capacity)
})

const venueNames = computed(() => {
  return tournamentData.venues.map(venue => venue.name.split(' ')[0])
})

const correlationMatrix = computed(() => {
  // Generate correlation matrix for team performance metrics
  const size = 6
  const matrix = []
  for (let i = 0; i < size; i++) {
    const row = []
    for (let j = 0; j < size; j++) {
      if (i === j) {
        row.push(1)
      } else {
        // Generate realistic correlation values
        row.push(Math.random() * 0.8 + 0.1)
      }
    }
    matrix.push(row)
  }
  return matrix
})

const performanceLabels = ['Goals', 'Assists', 'Possession', 'Passing', 'Defense', 'Market Value']

const keyInsights = computed(() => [
  {
    title: 'European Dominance',
    description: 'European teams have the highest average market value and represent 37.5% of all teams',
    value: '€750M avg'
  },
  {
    title: 'Venue Distribution',
    description: 'Matches are distributed across 12 major US cities with an average capacity of 70,000',
    value: '70K avg'
  },
  {
    title: 'Historical Growth',
    description: 'Tournament has grown significantly with 63% more goals scored compared to 2000',
    value: '+63%'
  },
  {
    title: 'Global Impact',
    description: 'Expected to be the most watched club tournament in history',
    value: '2.5B viewers'
  }
])

const getTeamColor = (continent) => {
  const colors = {
    'Europe': '#3b82f6',
    'South America': '#ef4444',
    'North America': '#10b981',
    'Asia': '#f59e0b',
    'Africa': '#8b5cf6',
    'Oceania': '#06b6d4'
  }
  return colors[continent] || '#6b7280'
}

onMounted(() => {
  // Simulate loading
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.fifa-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
}

.dashboard-header {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  border-bottom: 4px solid #fbbf24;
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.fifa-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-circle {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
}

.logo-icon {
  width: 24px;
  height: 24px;
  color: white;
}

.logo-text {
  font-size: 24px;
  font-weight: 900;
  color: #fbbf24;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.tournament-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dashboard-title {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.tournament-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 500;
}

.view-selector {
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.view-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.view-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.view-btn.active {
  background: rgba(255, 255, 255, 0.9);
  color: #1e40af;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.section-header {
  text-align: center;
  margin-bottom: 32px;
}

.section-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.section-header p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.error-message {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  margin: 20px;
  box-shadow: 0 10px 25px -3px rgba(220, 38, 38, 0.3);
}

.metrics-section {
  width: 100%;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.charts-section {
  width: 100%;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 32px;
}

.eda-section {
  width: 100%;
}

.eda-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.historical-trends .trend-container {
  padding: 24px;
}

.historical-trends h3 {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px 0;
  text-align: center;
}

.trend-charts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.insights-section {
  width: 100%;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.insight-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.insight-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.insight-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 16px;
}

.insight-icon-svg {
  width: 24px;
  height: 24px;
}

.insight-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0 0 8px 0;
}

.insight-content p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.insight-value {
  font-size: 24px;
  font-weight: 700;
  color: #fbbf24;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

@media (max-width: 1200px) {
  .eda-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 20px 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
    padding: 0 16px;
  }
  
  .header-left {
    justify-content: center;
    text-align: center;
  }
  
  .header-right {
    justify-content: center;
  }
  
  .dashboard-title {
    font-size: 24px;
  }
  
  .tournament-subtitle {
    font-size: 12px;
  }
  
  .view-selector {
    width: 100%;
    justify-content: center;
  }
  
  .view-btn {
    flex: 1;
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .section-header h2 {
    font-size: 24px;
  }
  
  .metrics-grid,
  .charts-grid,
  .insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>