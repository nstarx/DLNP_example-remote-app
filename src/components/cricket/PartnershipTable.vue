<template>
  <div class="partnership-table">
    <div class="table-header">
      <h4 class="table-title">Partnership Details</h4>
    </div>
    
    <div class="partnerships-list">
      <table>
        <thead>
          <tr>
            <th>Wicket</th>
            <th>Partnership</th>
            <th>Runs</th>
            <th>Balls</th>
            <th>Run Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(partnership, index) in partnerships"
            :key="index"
            :class="{ 'highest-partnership': partnership.runs === maxPartnership }"
          >
            <td class="wicket-number">{{ partnership.wicket }}</td>
            <td class="partnership-players">
              <span v-for="(batsman, idx) in partnership.batsmen" :key="idx">
                {{ batsman }}
                <span v-if="idx < partnership.batsmen.length - 1"> & </span>
              </span>
            </td>
            <td class="partnership-runs">{{ partnership.runs }}</td>
            <td class="partnership-balls">{{ partnership.balls }}</td>
            <td class="partnership-rr">{{ (partnership.runs / partnership.balls * 6).toFixed(1) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="partnership-summary">
      <div class="summary-stats">
        <div class="stat-item">
          <span class="stat-label">Highest Partnership:</span>
          <span class="stat-value">{{ maxPartnership }} runs</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Average Partnership:</span>
          <span class="stat-value">{{ averagePartnership }} runs</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Partnership Rate:</span>
          <span class="stat-value">{{ averagePartnershipRate }} rpo</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  partnerships: {
    type: Array,
    required: true
  }
})

const maxPartnership = computed(() => 
  Math.max(...props.partnerships.map(p => p.runs))
)

const averagePartnership = computed(() => 
  Math.round(props.partnerships.reduce((sum, p) => sum + p.runs, 0) / props.partnerships.length)
)

const averagePartnershipRate = computed(() => {
  const totalRuns = props.partnerships.reduce((sum, p) => sum + p.runs, 0)
  const totalBalls = props.partnerships.reduce((sum, p) => sum + p.balls, 0)
  return ((totalRuns / totalBalls) * 6).toFixed(1)
})
</script>

<style scoped>
.partnership-table {
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

.partnerships-list {
  overflow-x: auto;
  margin-bottom: 20px;
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

.highest-partnership {
  background: rgba(16, 185, 129, 0.1);
}

.wicket-number {
  font-weight: 700;
  color: #94a3b8;
}

.partnership-players {
  font-weight: 600;
  color: #e5e7eb;
}

.partnership-runs {
  font-weight: 700;
  color: #10b981;
}

.partnership-balls {
  color: #94a3b8;
}

.partnership-rr {
  font-weight: 600;
  color: #f59e0b;
}

.partnership-summary {
  padding-top: 16px;
  border-top: 1px solid #4b5563;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-item {
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
  color: #10b981;
}

@media (max-width: 768px) {
  .partnership-table {
    padding: 16px;
  }
  
  table {
    font-size: 12px;
  }
  
  th,
  td {
    padding: 8px 4px;
  }
  
  .summary-stats {
    grid-template-columns: 1fr;
  }
  
  .stat-item {
    flex-direction: column;
    gap: 4px;
  }
}
</style>