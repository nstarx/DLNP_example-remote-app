<template>
  <div class="fall-of-wickets-table">
    <div class="table-header">
      <h4 class="table-title">Fall of Wickets</h4>
    </div>
    
    <div class="wickets-list">
      <table>
        <thead>
          <tr>
            <th>Wicket</th>
            <th>Score</th>
            <th>Batsman</th>
            <th>Bowler</th>
            <th>Over</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(wicket, index) in wickets"
            :key="index"
            :class="{ 'current-wicket': wicket.batsman === 'Current' }"
          >
            <td class="wicket-number">{{ wicket.wicket }}</td>
            <td class="wicket-score">{{ wicket.runs }}</td>
            <td class="wicket-batsman">{{ wicket.batsman }}</td>
            <td class="wicket-bowler">{{ wicket.bowler }}</td>
            <td class="wicket-over">{{ wicket.over }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="wickets-analysis">
      <div class="analysis-chart">
        <h5>Wickets Distribution</h5>
        <div class="chart-container">
          <div
            v-for="(wicket, index) in wickets.slice(0, -1)"
            :key="index"
            class="wicket-bar"
            :style="{ height: (wicket.runs / maxScore) * 100 + '%' }"
          >
            <div class="bar-label">{{ wicket.wicket }}</div>
            <div class="bar-value">{{ wicket.runs }}</div>
          </div>
        </div>
      </div>
      
      <div class="wickets-summary">
        <div class="summary-stat">
          <span class="stat-label">Average Wicket Score:</span>
          <span class="stat-value">{{ averageWicketScore }}</span>
        </div>
        <div class="summary-stat">
          <span class="stat-label">Wickets Lost:</span>
          <span class="stat-value">{{ wickets.length - 1 }}</span>
        </div>
        <div class="summary-stat">
          <span class="stat-label">Last Wicket:</span>
          <span class="stat-value">{{ lastWicket.runs }} runs</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  wickets: {
    type: Array,
    required: true
  }
})

const maxScore = computed(() => 
  Math.max(...props.wickets.map(w => w.runs))
)

const averageWicketScore = computed(() => {
  const completedWickets = props.wickets.filter(w => w.batsman !== 'Current')
  return Math.round(completedWickets.reduce((sum, w) => sum + w.runs, 0) / completedWickets.length)
})

const lastWicket = computed(() => {
  const completedWickets = props.wickets.filter(w => w.batsman !== 'Current')
  return completedWickets[completedWickets.length - 1] || { runs: 0 }
})
</script>

<style scoped>
.fall-of-wickets-table {
  background: rgba(55, 65, 81, 0.3);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #4b5563;
}

.table-header {
  margin-bottom: 16px;
}

.table-title {
  font-size: 18px;
  font-weight: 700;
  color: #e5e7eb;
  margin: 0;
}

.wickets-list {
  overflow-x: auto;
  margin-bottom: 24px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th {
  background: #374151;
  color: #e5e7eb;
  font-weight: 600;
  padding: 12px 8px;
  text-align: left;
  border-bottom: 2px solid #4b5563;
}

td {
  padding: 12px 8px;
  border-bottom: 1px solid #4b5563;
  color: #e5e7eb;
}

tr:hover {
  background: rgba(55, 65, 81, 0.3);
}

.current-wicket {
  background: rgba(59, 130, 246, 0.1);
}

.wicket-number {
  font-weight: 700;
  color: #94a3b8;
}

.wicket-score {
  font-weight: 700;
  color: #10b981;
}

.wicket-batsman {
  font-weight: 600;
  color: #e5e7eb;
}

.wicket-bowler {
  color: #ef4444;
  font-weight: 600;
}

.wicket-over {
  color: #94a3b8;
}

.wickets-analysis {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.analysis-chart h5 {
  font-size: 16px;
  font-weight: 600;
  color: #e5e7eb;
  margin: 0 0 16px 0;
}

.chart-container {
  display: flex;
  align-items: end;
  gap: 8px;
  height: 120px;
}

.wicket-bar {
  flex: 1;
  background: linear-gradient(to top, #ef4444, #dc2626);
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
}

.bar-label {
  font-size: 10px;
  color: white;
  font-weight: 700;
  margin-top: auto;
}

.bar-value {
  font-size: 10px;
  font-weight: 700;
  color: white;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

.wickets-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.stat-label {
  font-weight: 600;
  color: #94a3b8;
}

.stat-value {
  font-weight: 700;
  color: #ef4444;
}

@media (max-width: 768px) {
  .fall-of-wickets-table {
    padding: 16px;
  }
  
  table {
    font-size: 12px;
  }
  
  th,
  td {
    padding: 8px 4px;
  }
  
  .wickets-analysis {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .summary-stat {
    flex-direction: column;
    gap: 4px;
  }
}
</style>