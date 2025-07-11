<template>
  <div class="match-momentum">
    <div class="momentum-header">
      <h3 class="momentum-title">{{ momentum.title }}</h3>
      <div class="current-momentum">
        <span class="momentum-indicator" :class="momentum.currentMomentum.toLowerCase()">
          {{ momentum.currentMomentum }}
        </span>
      </div>
    </div>
    
    <div class="momentum-timeline">
      <div
        v-for="(event, index) in momentum.timeline"
        :key="index"
        class="timeline-event"
        :class="event.momentum.toLowerCase()"
      >
        <div class="event-over">{{ event.over }}</div>
        <div class="event-dot"></div>
        <div class="event-details">
          <div class="event-momentum">{{ event.momentum }}</div>
          <div class="event-description">{{ event.event }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  momentum: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.match-momentum {
  background: #1e293b;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #374151;
}

.momentum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.momentum-title {
  font-size: 18px;
  font-weight: 700;
  color: #e5e7eb;
  margin: 0;
}

.current-momentum {
  display: flex;
  align-items: center;
}

.momentum-indicator {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 14px;
}

.momentum-indicator.india {
  background: #10b981;
  color: white;
}

.momentum-indicator.england {
  background: #ef4444;
  color: white;
}

.momentum-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline-event {
  display: grid;
  grid-template-columns: 40px 20px 1fr;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.timeline-event:hover {
  background: rgba(55, 65, 81, 0.5);
}

.timeline-event.india {
  border-left: 4px solid #10b981;
}

.timeline-event.england {
  border-left: 4px solid #ef4444;
}

.event-over {
  font-size: 14px;
  font-weight: 700;
  color: #94a3b8;
  text-align: center;
}

.event-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #6b7280;
}

.timeline-event.india .event-dot {
  background: #10b981;
}

.timeline-event.england .event-dot {
  background: #ef4444;
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.event-momentum {
  font-size: 14px;
  font-weight: 700;
  color: #e5e7eb;
}

.event-description {
  font-size: 12px;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .momentum-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .timeline-event {
    grid-template-columns: 1fr;
    gap: 8px;
    text-align: center;
  }
}
</style>