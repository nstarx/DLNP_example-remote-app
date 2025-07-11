<template>
  <div class="wagon-wheel">
    <div class="wheel-header">
      <h3 class="wheel-title">{{ shots.title }}</h3>
      <div class="wheel-controls">
        <select v-model="selectedPlayer" class="player-select">
          <option value="R. Sharma">R. Sharma</option>
          <option value="R. Jadeja">R. Jadeja</option>
          <option value="V. Kohli">V. Kohli</option>
        </select>
      </div>
    </div>
    
    <div class="wheel-container">
      <svg :width="wheelSize" :height="wheelSize" class="wheel-svg">
        <!-- Background circle -->
        <circle
          :cx="center"
          :cy="center"
          :r="radius"
          fill="none"
          stroke="#374151"
          stroke-width="2"
        />
        
        <!-- Inner circles -->
        <circle
          v-for="i in 3"
          :key="i"
          :cx="center"
          :cy="center"
          :r="radius * i / 3"
          fill="none"
          stroke="#374151"
          stroke-width="1"
          stroke-dasharray="5,5"
        />
        
        <!-- Field position lines -->
        <g class="field-lines">
          <line
            v-for="angle in fieldAngles"
            :key="angle"
            :x1="center"
            :y1="center"
            :x2="center + Math.cos(angle * Math.PI / 180) * radius"
            :y2="center + Math.sin(angle * Math.PI / 180) * radius"
            stroke="#374151"
            stroke-width="1"
            stroke-dasharray="3,3"
          />
        </g>
        
        <!-- Shot markers -->
        <g class="shot-markers">
          <g
            v-for="(shot, index) in shots.shots"
            :key="index"
            class="shot-group"
          >
            <!-- Shot line -->
            <line
              :x1="center"
              :y1="center"
              :x2="center + Math.cos((shot.angle - 90) * Math.PI / 180) * (radius * shot.distance / 6)"
              :y2="center + Math.sin((shot.angle - 90) * Math.PI / 180) * (radius * shot.distance / 6)"
              :stroke="getShotColor(shot.runs)"
              :stroke-width="getShotWidth(shot.runs)"
              stroke-linecap="round"
              class="shot-line"
            />
            
            <!-- Shot dot -->
            <circle
              :cx="center + Math.cos((shot.angle - 90) * Math.PI / 180) * (radius * shot.distance / 6)"
              :cy="center + Math.sin((shot.angle - 90) * Math.PI / 180) * (radius * shot.distance / 6)"
              :r="getShotRadius(shot.runs)"
              :fill="getShotColor(shot.runs)"
              class="shot-dot"
              @mouseover="showShotTooltip($event, shot)"
              @mouseout="hideShotTooltip"
            />
            
            <!-- Shot label -->
            <text
              :x="center + Math.cos((shot.angle - 90) * Math.PI / 180) * (radius * shot.distance / 6)"
              :y="center + Math.sin((shot.angle - 90) * Math.PI / 180) * (radius * shot.distance / 6) + 5"
              text-anchor="middle"
              :fill="getShotColor(shot.runs)"
              font-size="10"
              font-weight="bold"
              class="shot-label"
            >
              {{ shot.runs }}
            </text>
          </g>
        </g>
        
        <!-- Field position labels -->
        <g class="field-labels">
          <text
            v-for="(label, index) in fieldLabels"
            :key="index"
            :x="center + Math.cos((label.angle - 90) * Math.PI / 180) * (radius + 30)"
            :y="center + Math.sin((label.angle - 90) * Math.PI / 180) * (radius + 30) + 5"
            text-anchor="middle"
            fill="#94a3b8"
            font-size="12"
            font-weight="600"
            class="field-label"
          >
            {{ label.name }}
          </text>
        </g>
        
        <!-- Batsman position -->
        <circle
          :cx="center"
          :cy="center"
          r="8"
          fill="#10b981"
          stroke="#fff"
          stroke-width="2"
          class="batsman-position"
        />
        
        <!-- Wickets -->
        <g class="wickets">
          <rect
            :x="center - 15"
            :y="center - 3"
            width="30"
            height="6"
            fill="#f59e0b"
            rx="3"
          />
          <line
            v-for="i in 3"
            :key="i"
            :x1="center - 15 + (i - 1) * 15"
            :y1="center - 10"
            :x2="center - 15 + (i - 1) * 15"
            :y2="center + 10"
            stroke="#f59e0b"
            stroke-width="3"
          />
        </g>
      </svg>
      
      <!-- Legend -->
      <div class="wheel-legend">
        <div class="legend-item">
          <div class="legend-color" style="background: #10b981;"></div>
          <span>Singles (1-2)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: #f59e0b;"></div>
          <span>Boundaries (4)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: #ef4444;"></div>
          <span>Sixes (6)</span>
        </div>
      </div>
    </div>
    
    <!-- Shot Statistics -->
    <div class="shot-stats">
      <div class="stat-item">
        <div class="stat-value">{{ totalShots }}</div>
        <div class="stat-label">Total Shots</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ boundaryPercentage }}%</div>
        <div class="stat-label">Boundary %</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ favoriteZone }}</div>
        <div class="stat-label">Favorite Zone</div>
      </div>
    </div>
    
    <!-- Tooltip -->
    <div
      v-if="tooltip.show"
      class="tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <div class="tooltip-content">
        <div class="tooltip-runs">{{ tooltip.runs }} runs</div>
        <div class="tooltip-shot">{{ tooltip.shotType }}</div>
        <div class="tooltip-angle">{{ tooltip.angle }}°</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  shots: {
    type: Object,
    required: true
  }
})

const selectedPlayer = ref('R. Sharma')
const tooltip = ref({ show: false, x: 0, y: 0, runs: 0, shotType: '', angle: 0 })

const wheelSize = 400
const center = wheelSize / 2
const radius = 150

const fieldAngles = [0, 45, 90, 135, 180, 225, 270, 315]
const fieldLabels = [
  { name: 'Long On', angle: 0 },
  { name: 'Mid Wicket', angle: 45 },
  { name: 'Square Leg', angle: 90 },
  { name: 'Fine Leg', angle: 135 },
  { name: 'Long Off', angle: 180 },
  { name: 'Point', angle: 225 },
  { name: 'Cover', angle: 270 },
  { name: 'Mid Off', angle: 315 }
]

const totalShots = computed(() => props.shots.shots.length)

const boundaryPercentage = computed(() => {
  const boundaries = props.shots.shots.filter(shot => shot.runs >= 4).length
  return Math.round((boundaries / totalShots.value) * 100)
})

const favoriteZone = computed(() => {
  const zones = {}
  props.shots.shots.forEach(shot => {
    const zone = Math.floor(shot.angle / 45) * 45
    zones[zone] = (zones[zone] || 0) + 1
  })
  
  const maxZone = Object.keys(zones).reduce((a, b) => zones[a] > zones[b] ? a : b)
  const zoneNames = {
    0: 'Long On',
    45: 'Mid Wicket',
    90: 'Square Leg',
    135: 'Fine Leg',
    180: 'Long Off',
    225: 'Point',
    270: 'Cover',
    315: 'Mid Off'
  }
  
  return zoneNames[maxZone] || 'Unknown'
})

function getShotColor(runs) {
  if (runs >= 6) return '#ef4444'
  if (runs >= 4) return '#f59e0b'
  return '#10b981'
}

function getShotWidth(runs) {
  if (runs >= 6) return 4
  if (runs >= 4) return 3
  return 2
}

function getShotRadius(runs) {
  if (runs >= 6) return 8
  if (runs >= 4) return 6
  return 4
}

function showShotTooltip(event, shot) {
  tooltip.value = {
    show: true,
    x: event.pageX + 10,
    y: event.pageY - 10,
    runs: shot.runs,
    shotType: shot.shotType,
    angle: shot.angle
  }
}

function hideShotTooltip() {
  tooltip.value.show = false
}
</script>

<style scoped>
.wagon-wheel {
  background: #1e293b;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #374151;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.wheel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.wheel-title {
  font-size: 18px;
  font-weight: 700;
  color: #e5e7eb;
  margin: 0;
}

.player-select {
  padding: 8px 12px;
  background: #374151;
  border: 1px solid #4b5563;
  border-radius: 8px;
  color: #e5e7eb;
  font-weight: 600;
  cursor: pointer;
}

.wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.wheel-svg {
  background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(30, 41, 59, 0.8) 100%);
  border-radius: 50%;
  border: 2px solid #374151;
}

.shot-line {
  transition: stroke-width 0.3s ease;
}

.shot-dot {
  cursor: pointer;
  transition: r 0.3s ease;
}

.shot-dot:hover {
  r: 10;
}

.shot-label {
  pointer-events: none;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
}

.field-label {
  font-family: 'Arial', sans-serif;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
}

.batsman-position {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.wheel-legend {
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

.shot-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #10b981;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  font-weight: 600;
  color: #e5e7eb;
}

.tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  pointer-events: none;
  z-index: 1000;
  border: 1px solid #374151;
}

.tooltip-runs {
  font-weight: 700;
  font-size: 16px;
  color: #10b981;
  margin-bottom: 4px;
}

.tooltip-shot {
  font-size: 14px;
  margin-bottom: 4px;
  text-transform: capitalize;
}

.tooltip-angle {
  font-size: 12px;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .wheel-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .wheel-legend {
    flex-direction: column;
    gap: 12px;
  }
  
  .shot-stats {
    grid-template-columns: 1fr;
  }
}
</style>