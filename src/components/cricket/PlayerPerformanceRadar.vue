<template>
  <div class="player-performance-radar">
    <div class="radar-header">
      <h3 class="radar-title">{{ players.title }}</h3>
    </div>
    
    <div class="radar-container">
      <svg width="300" height="300" class="radar-svg">
        <!-- Radar background -->
        <g class="radar-background">
          <circle
            v-for="i in 5"
            :key="i"
            cx="150"
            cy="150"
            :r="i * 25"
            fill="none"
            stroke="#374151"
            stroke-width="1"
          />
          
          <!-- Radar lines -->
          <line
            v-for="(stat, index) in statLabels"
            :key="index"
            x1="150"
            y1="150"
            :x2="150 + Math.cos((index * 72 - 90) * Math.PI / 180) * 125"
            :y2="150 + Math.sin((index * 72 - 90) * Math.PI / 180) * 125"
            stroke="#374151"
            stroke-width="1"
          />
        </g>
        
        <!-- Player 1 -->
        <path
          :d="getPlayerPath(players.players[0])"
          fill="rgba(16, 185, 129, 0.2)"
          stroke="#10b981"
          stroke-width="2"
          class="player-path"
        />
        
        <!-- Player 2 -->
        <path
          :d="getPlayerPath(players.players[1])"
          fill="rgba(239, 68, 68, 0.2)"
          stroke="#ef4444"
          stroke-width="2"
          class="player-path"
        />
        
        <!-- Stat labels -->
        <g class="stat-labels">
          <text
            v-for="(stat, index) in statLabels"
            :key="index"
            :x="150 + Math.cos((index * 72 - 90) * Math.PI / 180) * 140"
            :y="150 + Math.sin((index * 72 - 90) * Math.PI / 180) * 140 + 5"
            text-anchor="middle"
            fill="#e5e7eb"
            font-size="12"
            font-weight="600"
          >
            {{ stat }}
          </text>
        </g>
      </svg>
      
      <!-- Legend -->
      <div class="radar-legend">
        <div class="legend-item">
          <div class="legend-color" style="background: #10b981;"></div>
          <span>{{ players.players[0].name }}</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: #ef4444;"></div>
          <span>{{ players.players[1].name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  players: {
    type: Object,
    required: true
  }
})

const statLabels = ['Batting', 'Consistency', 'Strike Rate', 'Boundaries', 'Pressure']

function getPlayerPath(player) {
  const stats = Object.values(player.stats)
  const points = stats.map((stat, index) => {
    const angle = (index * 72 - 90) * Math.PI / 180
    const radius = (stat / 100) * 125
    const x = 150 + Math.cos(angle) * radius
    const y = 150 + Math.sin(angle) * radius
    return `${x},${y}`
  })
  
  return `M ${points.join(' L ')} Z`
}
</script>

<style scoped>
.player-performance-radar {
  background: #1e293b;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #374151;
}

.radar-header {
  margin-bottom: 24px;
}

.radar-title {
  font-size: 18px;
  font-weight: 700;
  color: #e5e7eb;
  margin: 0;
}

.radar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.radar-svg {
  background: #0f172a;
  border-radius: 50%;
  border: 2px solid #374151;
}

.player-path {
  transition: opacity 0.3s ease;
}

.radar-legend {
  display: flex;
  gap: 24px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e5e7eb;
  font-size: 14px;
  font-weight: 600;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

@media (max-width: 768px) {
  .radar-legend {
    flex-direction: column;
    gap: 12px;
  }
}
</style>