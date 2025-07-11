<template>
  <div class="cricket-dashboard">
    <!-- Match Header -->
    <header class="match-header">
      <div class="match-series">
        <span class="series-badge">TEST SERIES</span>
        <h2 class="series-title">ENGLAND IN INDIA 2024-25</h2>
      </div>
      <div class="match-status">
        <div class="live-indicator">
          <span class="live-dot"></span>
          <span>LIVE</span>
        </div>
        <div class="match-day">Day 3</div>
      </div>
    </header>

    <!-- Team Scores -->
    <section class="team-scores">
      <div class="team-score india">
        <div class="team-info">
          <div class="team-flag india-flag">🇮🇳</div>
          <div class="team-details">
            <h3 class="team-name">INDIA</h3>
            <div class="innings-label">1st Innings</div>
          </div>
        </div>
        <div class="score-display">
          <div class="main-score">445/7</div>
          <div class="overs">(120.4 overs)</div>
        </div>
      </div>
      <div class="vs-divider">vs</div>
      <div class="team-score england">
        <div class="team-info">
          <div class="team-flag england-flag">🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
          <div class="team-details">
            <h3 class="team-name">ENGLAND</h3>
            <div class="innings-label">1st Innings</div>
          </div>
        </div>
        <div class="score-display">
          <div class="main-score">218</div>
          <div class="overs">(57.4 overs)</div>
        </div>
      </div>
    </section>

    <!-- Current Partnership -->
    <section class="current-partnership">
      <div class="partnership-header">
        <h3>Current Partnership</h3>
        <div class="partnership-runs">67 runs (98 balls)</div>
      </div>
      <div class="batsmen">
        <div class="batsman">
          <div class="player-name">R. Sharma*</div>
          <div class="player-score">89* (142)</div>
          <div class="player-details">4s: 8, 6s: 2, SR: 62.68</div>
        </div>
        <div class="batsman">
          <div class="player-name">R. Jadeja</div>
          <div class="player-score">34* (67)</div>
          <div class="player-details">4s: 3, 6s: 0, SR: 50.75</div>
        </div>
      </div>
    </section>

    <!-- Analytics Dashboard -->
    <div class="analytics-content">
      <!-- Match Progression Chart -->
      <section class="chart-section">
        <MatchProgressionChart :data="matchProgressionData" />
      </section>

      <!-- Statistics Grid -->
      <section class="stats-grid">
        <BattingStatsCard :stats="battingStats" />
        <BowlingStatsCard :stats="bowlingStats" />
        <PartnershipAnalysis :partnerships="partnerships" />
        <RunRateAnalysis :runRates="runRateData" />
      </section>

      <!-- Advanced Analytics -->
      <section class="advanced-analytics">
        <div class="analytics-grid">
          <WagonWheel :shots="wagonWheelData" />
          <PitchMap :deliveries="pitchMapData" />
          <PlayerPerformanceRadar :players="playerPerformanceData" />
          <MatchMomentum :momentum="momentumData" />
        </div>
      </section>

      <!-- Detailed Statistics -->
      <section class="detailed-stats">
        <div class="tabs">
          <button 
            v-for="tab in ['Scorecard', 'Bowling', 'Partnerships', 'Fall of Wickets']"
            :key="tab"
            :class="{ active: activeTab === tab }"
            @click="activeTab = tab"
            class="tab-button"
          >
            {{ tab }}
          </button>
        </div>
        
        <div class="tab-content">
          <ScorecardTable v-if="activeTab === 'Scorecard'" :scorecard="scorecardData" />
          <BowlingTable v-if="activeTab === 'Bowling'" :bowling="bowlingData" />
          <PartnershipTable v-if="activeTab === 'Partnerships'" :partnerships="partnershipData" />
          <FallOfWicketsTable v-if="activeTab === 'Fall of Wickets'" :wickets="fallOfWicketsData" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCricketData } from '@/composables/useCricketData'

// Cricket Dashboard Components
import MatchProgressionChart from '@/components/cricket/MatchProgressionChart.vue'
import BattingStatsCard from '@/components/cricket/BattingStatsCard.vue'
import BowlingStatsCard from '@/components/cricket/BowlingStatsCard.vue'
import PartnershipAnalysis from '@/components/cricket/PartnershipAnalysis.vue'
import RunRateAnalysis from '@/components/cricket/RunRateAnalysis.vue'
import WagonWheel from '@/components/cricket/WagonWheel.vue'
import PitchMap from '@/components/cricket/PitchMap.vue'
import PlayerPerformanceRadar from '@/components/cricket/PlayerPerformanceRadar.vue'
import MatchMomentum from '@/components/cricket/MatchMomentum.vue'
import ScorecardTable from '@/components/cricket/ScorecardTable.vue'
import BowlingTable from '@/components/cricket/BowlingTable.vue'
import PartnershipTable from '@/components/cricket/PartnershipTable.vue'
import FallOfWicketsTable from '@/components/cricket/FallOfWicketsTable.vue'

// State
const activeTab = ref('Scorecard')
const { 
  matchProgressionData, 
  battingStats, 
  bowlingStats, 
  partnerships, 
  runRateData,
  wagonWheelData,
  pitchMapData,
  playerPerformanceData,
  momentumData,
  scorecardData,
  bowlingData,
  partnershipData,
  fallOfWicketsData,
  refreshData 
} = useCricketData()

// Auto-refresh data every 30 seconds
onMounted(() => {
  refreshData()
  setInterval(() => {
    refreshData()
  }, 30000)
})
</script>

<style scoped>
.cricket-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Match Header */
.match-header {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #10b981;
}

.match-series {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.series-badge {
  background: #dc2626;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  width: fit-content;
}

.series-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.match-status {
  display: flex;
  align-items: center;
  gap: 24px;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #dc2626;
  padding: 8px 16px;
  border-radius: 25px;
  font-weight: 700;
  font-size: 14px;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.match-day {
  background: #374151;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
}

/* Team Scores */
.team-scores {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 24px;
  background: #1e293b;
  border-bottom: 1px solid #374151;
}

.team-score {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
}

.team-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.team-flag {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: #1e293b;
}

.team-name {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.innings-label {
  font-size: 14px;
  color: #94a3b8;
  margin-top: 4px;
}

.score-display {
  text-align: right;
}

.main-score {
  font-size: 36px;
  font-weight: 800;
  color: #10b981;
  line-height: 1;
}

.overs {
  font-size: 14px;
  color: #94a3b8;
  margin-top: 4px;
}

.vs-divider {
  font-size: 18px;
  font-weight: 700;
  color: #94a3b8;
  margin: 0 24px;
}

.england {
  flex-direction: row-reverse;
}

.england .score-display {
  text-align: left;
}

/* Current Partnership */
.current-partnership {
  background: #374151;
  padding: 24px;
  border-bottom: 1px solid #4b5563;
}

.partnership-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.partnership-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #e5e7eb;
}

.partnership-runs {
  background: #10b981;
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-weight: 600;
  font-size: 14px;
}

.batsmen {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.batsman {
  text-align: center;
}

.player-name {
  font-size: 18px;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 8px;
}

.player-score {
  font-size: 24px;
  font-weight: 800;
  color: white;
  margin-bottom: 4px;
}

.player-details {
  font-size: 14px;
  color: #94a3b8;
}

/* Analytics Content */
.analytics-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.chart-section {
  background: #1e293b;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #374151;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.advanced-analytics {
  background: #1e293b;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #374151;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

/* Detailed Statistics */
.detailed-stats {
  background: #1e293b;
  border-radius: 12px;
  border: 1px solid #374151;
  overflow: hidden;
}

.tabs {
  display: flex;
  background: #374151;
  border-bottom: 1px solid #4b5563;
}

.tab-button {
  flex: 1;
  padding: 16px 24px;
  background: none;
  border: none;
  color: #94a3b8;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-button:hover {
  background: #4b5563;
  color: white;
}

.tab-button.active {
  background: #1e293b;
  color: #10b981;
  border-bottom-color: #10b981;
}

.tab-content {
  padding: 24px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .match-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .team-scores {
    flex-direction: column;
    gap: 24px;
  }
  
  .vs-divider {
    transform: rotate(90deg);
  }
  
  .england {
    flex-direction: row;
  }
  
  .england .score-display {
    text-align: right;
  }
  
  .batsmen {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .analytics-content {
    padding: 16px;
  }
  
  .stats-grid,
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs {
    flex-wrap: wrap;
  }
  
  .tab-button {
    min-width: 120px;
  }
}

@media (max-width: 480px) {
  .series-title {
    font-size: 18px;
  }
  
  .main-score {
    font-size: 28px;
  }
  
  .team-name {
    font-size: 16px;
  }
}
</style>