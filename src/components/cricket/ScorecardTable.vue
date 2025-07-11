<template>
  <div class="scorecard-table">
    <div class="team-innings">
      <h4 class="team-title">India - 1st Innings</h4>
      <div class="batting-table">
        <table>
          <thead>
            <tr>
              <th>Batsman</th>
              <th>R</th>
              <th>B</th>
              <th>4s</th>
              <th>6s</th>
              <th>SR</th>
              <th>Dismissal</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(batsman, index) in scorecard.india.innings1.batsmen"
              :key="index"
              :class="{ 'not-out': batsman.notOut }"
            >
              <td class="batsman-name">
                {{ batsman.name }}
                <span v-if="batsman.notOut" class="not-out-indicator">*</span>
              </td>
              <td class="runs">{{ batsman.runs }}</td>
              <td class="balls">{{ batsman.balls }}</td>
              <td class="fours">{{ batsman.fours }}</td>
              <td class="sixes">{{ batsman.sixes }}</td>
              <td class="strike-rate">{{ ((batsman.runs / batsman.balls) * 100).toFixed(1) }}</td>
              <td class="dismissal">{{ batsman.dismissal || 'batting' }}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="innings-summary">
          <div class="extras">
            <span>Extras:</span>
            <span>{{ scorecard.india.innings1.extras.byes }}b, {{ scorecard.india.innings1.extras.legByes }}lb, {{ scorecard.india.innings1.extras.wides }}w, {{ scorecard.india.innings1.extras.noBalls }}nb</span>
          </div>
          <div class="total">
            <span>Total:</span>
            <span>{{ scorecard.india.innings1.total }}/{{ scorecard.india.innings1.wickets }} ({{ scorecard.india.innings1.overs }} overs)</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="team-innings">
      <h4 class="team-title">England - 1st Innings</h4>
      <div class="batting-table">
        <table>
          <thead>
            <tr>
              <th>Batsman</th>
              <th>R</th>
              <th>B</th>
              <th>4s</th>
              <th>6s</th>
              <th>SR</th>
              <th>Dismissal</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(batsman, index) in scorecard.england.innings1.batsmen"
              :key="index"
              :class="{ 'not-out': batsman.notOut }"
            >
              <td class="batsman-name">
                {{ batsman.name }}
                <span v-if="batsman.notOut" class="not-out-indicator">*</span>
              </td>
              <td class="runs">{{ batsman.runs }}</td>
              <td class="balls">{{ batsman.balls }}</td>
              <td class="fours">{{ batsman.fours }}</td>
              <td class="sixes">{{ batsman.sixes }}</td>
              <td class="strike-rate">{{ ((batsman.runs / batsman.balls) * 100).toFixed(1) }}</td>
              <td class="dismissal">{{ batsman.dismissal || 'not out' }}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="innings-summary">
          <div class="extras">
            <span>Extras:</span>
            <span>{{ scorecard.england.innings1.extras.byes }}b, {{ scorecard.england.innings1.extras.legByes }}lb, {{ scorecard.england.innings1.extras.wides }}w, {{ scorecard.england.innings1.extras.noBalls }}nb</span>
          </div>
          <div class="total">
            <span>Total:</span>
            <span>{{ scorecard.england.innings1.total }}/{{ scorecard.england.innings1.wickets }} ({{ scorecard.england.innings1.overs }} overs)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  scorecard: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.scorecard-table {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.team-innings {
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

.batting-table {
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

.not-out {
  background: rgba(16, 185, 129, 0.1);
}

.batsman-name {
  font-weight: 600;
}

.not-out-indicator {
  color: #10b981;
  font-weight: 700;
}

.runs {
  font-weight: 700;
  color: #10b981;
}

.innings-summary {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #4b5563;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.extras,
.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.extras span:first-child,
.total span:first-child {
  font-weight: 600;
  color: #94a3b8;
}

.extras span:last-child,
.total span:last-child {
  font-weight: 700;
  color: #e5e7eb;
}

@media (max-width: 768px) {
  .scorecard-table {
    gap: 24px;
  }
  
  .team-innings {
    padding: 16px;
  }
  
  table {
    font-size: 12px;
  }
  
  th,
  td {
    padding: 8px 4px;
  }
  
  .dismissal {
    display: none;
  }
}
</style>