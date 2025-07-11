<template>
  <div class="pitch-map">
    <div class="map-header">
      <h3 class="map-title">{{ deliveries.title }}</h3>
    </div>
    
    <div class="pitch-container">
      <svg width="300" height="200" class="pitch-svg">
        <!-- Pitch outline -->
        <rect x="50" y="20" width="200" height="160" fill="#059669" stroke="#10b981" stroke-width="2" rx="4"/>
        
        <!-- Pitch markings -->
        <line x1="50" y1="100" x2="250" y2="100" stroke="#10b981" stroke-width="1" stroke-dasharray="5,5"/>
        <line x1="150" y1="20" x2="150" y2="180" stroke="#10b981" stroke-width="1" stroke-dasharray="5,5"/>
        
        <!-- Delivery points -->
        <circle
          v-for="(delivery, index) in deliveries.deliveries"
          :key="index"
          :cx="50 + (delivery.x / 100) * 200"
          :cy="20 + (delivery.y / 100) * 160"
          :r="getDeliveryRadius(delivery.outcome)"
          :fill="getDeliveryColor(delivery.outcome)"
          class="delivery-point"
          @mouseover="showDeliveryTooltip($event, delivery)"
          @mouseout="hideDeliveryTooltip"
        />
        
        <!-- Stumps -->
        <g class="stumps">
          <rect x="147" y="15" width="6" height="10" fill="#f59e0b"/>
          <rect x="147" y="175" width="6" height="10" fill="#f59e0b"/>
        </g>
      </svg>
      
      <!-- Legend -->
      <div class="pitch-legend">
        <div class="legend-item">
          <div class="legend-dot dot"></div>
          <span>Dot Ball</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot single"></div>
          <span>Single</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot boundary"></div>
          <span>Boundary</span>
        </div>
      </div>
    </div>
    
    <!-- Tooltip -->
    <div
      v-if="tooltip.show"
      class="tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <div class="tooltip-content">
        <div class="tooltip-bowler">{{ tooltip.bowler }}</div>
        <div class="tooltip-outcome">{{ tooltip.outcome }}</div>
        <div class="tooltip-ball">Ball {{ tooltip.ball }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  deliveries: {
    type: Object,
    required: true
  }
})

const tooltip = ref({ show: false, x: 0, y: 0, bowler: '', outcome: '', ball: 0 })

function getDeliveryColor(outcome) {
  switch (outcome) {
    case 'boundary': return '#ef4444'
    case 'single': return '#10b981'
    default: return '#6b7280'
  }
}

function getDeliveryRadius(outcome) {
  switch (outcome) {
    case 'boundary': return 6
    case 'single': return 4
    default: return 3
  }
}

function showDeliveryTooltip(event, delivery) {
  tooltip.value = {
    show: true,
    x: event.pageX + 10,
    y: event.pageY - 10,
    bowler: delivery.bowler,
    outcome: delivery.outcome,
    ball: delivery.ball
  }
}

function hideDeliveryTooltip() {
  tooltip.value.show = false
}
</script>

<style scoped>
.pitch-map {
  background: #1e293b;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #374151;
}

.map-header {
  margin-bottom: 24px;
}

.map-title {
  font-size: 18px;
  font-weight: 700;
  color: #e5e7eb;
  margin: 0;
}

.pitch-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.pitch-svg {
  background: #0f172a;
  border-radius: 8px;
  border: 2px solid #374151;
}

.delivery-point {
  cursor: pointer;
  transition: r 0.2s ease;
}

.delivery-point:hover {
  r: 8;
}

.pitch-legend {
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

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.dot {
  background: #6b7280;
}

.legend-dot.single {
  background: #10b981;
}

.legend-dot.boundary {
  background: #ef4444;
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

.tooltip-bowler {
  font-weight: 700;
  margin-bottom: 4px;
}

.tooltip-outcome {
  font-size: 14px;
  margin-bottom: 4px;
  text-transform: capitalize;
}

.tooltip-ball {
  font-size: 12px;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .pitch-legend {
    flex-direction: column;
    gap: 12px;
  }
}
</style>