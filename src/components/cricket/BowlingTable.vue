<template>
  <div class="bowling-table">
    <div class="team-bowling">
      <h4 class="team-title">India Bowling vs England</h4>
      <div class="bowling-stats">
        <table>
          <thead>
            <tr>
              <th>Bowler</th>
              <th>O</th>
              <th>M</th>
              <th>R</th>
              <th>W</th>
              <th>Econ</th>
              <th>Avg</th>
              <th>SR</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(bowler, index) in bowling.india"
              :key="index"
              :class="{ 'best-figures': bowler.wickets >= 3 }"
            >
              <td class="bowler-name">{{ bowler.name }}</td>
              <td class="overs">{{ bowler.overs }}</td>
              <td class="maidens">{{ bowler.maidens }}</td>
              <td class="runs">{{ bowler.runs }}</td>
              <td class="wickets">{{ bowler.wickets }}</td>
              <td class="economy">{{ bowler.economy.toFixed(2) }}</td>
              <td class="average">{{ bowler.wickets > 0 ? (bowler.runs / bowler.wickets).toFixed(1) : '-' }}</td>
              <td class="strike-rate">{{ bowler.wickets > 0 ? ((bowler.overs * 6) / bowler.wickets).toFixed(1) : '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="team-bowling">
      <h4 class="team-title">England Bowling vs India</h4>
      <div class="bowling-stats">
        <table>
          <thead>
            <tr>
              <th>Bowler</th>
              <th>O</th>
              <th>M</th>
              <th>R</th>
              <th>W</th>
              <th>Econ</th>
              <th>Avg</th>
              <th>SR</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(bowler, index) in bowling.england"
              :key="index"
              :class="{ 'best-figures': bowler.wickets >= 3 }"
            >
              <td class="bowler-name">{{ bowler.name }}</td>
              <td class="overs">{{ bowler.overs }}</td>
              <td class="maidens">{{ bowler.maidens }}</td>
              <td class="runs">{{ bowler.runs }}</td>
              <td class="wickets">{{ bowler.wickets }}</td>
              <td class="economy">{{ bowler.economy.toFixed(2) }}</td>
              <td class="average">{{ bowler.wickets > 0 ? (bowler.runs / bowler.wickets).toFixed(1) : '-' }}</td>
              <td class="strike-rate">{{ bowler.wickets > 0 ? ((bowler.overs * 6) / bowler.wickets).toFixed(1) : '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  bowling: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.bowling-table {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.team-bowling {
  background: rgba(55, 65, 81, 0.3);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #4b5563;
}

.team-title {
  font-size: 18px;
  font-weight: 700;
  color: #e5e7eb;
  margin: 0 0 16px 0;
}

.bowling-stats {
  overflow-x: auto;
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

.best-figures {
  background: rgba(16, 185, 129, 0.1);
}

.bowler-name {
  font-weight: 600;
}

.wickets {
  font-weight: 700;
  color: #ef4444;
}

.economy {
  font-weight: 600;
  color: #f59e0b;
}

.runs {
  color: #94a3b8;
}

.maidens {
  color: #10b981;
}

@media (max-width: 768px) {
  .bowling-table {
    gap: 24px;
  }
  
  .team-bowling {
    padding: 16px;
  }
  
  table {
    font-size: 12px;
  }
  
  th,
  td {
    padding: 8px 4px;
  }
  
  .average,
  .strike-rate {
    display: none;
  }
}
</style>