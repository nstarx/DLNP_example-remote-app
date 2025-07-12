<template>
  <div class="fifa-metric-card">
    <div class="metric-header">
      <div class="metric-icon">
        <component :is="iconComponent" />
      </div>
      <div class="metric-label">{{ metric.label }}</div>
    </div>
    <div class="metric-value">
      {{ formatValue(metric.value) }}
    </div>
    <div class="metric-subtext" v-if="metric.subtext">
      {{ metric.subtext }}
    </div>
    <div class="metric-trend" v-if="metric.change !== undefined">
      <div class="trend-indicator" :class="metric.trend">
        <TrendUpIcon v-if="metric.trend === 'up'" />
        <TrendDownIcon v-if="metric.trend === 'down'" />
      </div>
      <span class="trend-value">{{ Math.abs(metric.change) }}%</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  metric: {
    type: Object,
    required: true
  }
})

const iconComponent = computed(() => {
  const icons = {
    'trophy': TrophyIcon,
    'team': TeamIcon,
    'stadium': StadiumIcon,
    'ball': BallIcon,
    'target': TargetIcon,
    'users': UsersIcon,
    'globe': GlobeIcon,
    'star': StarIcon
  }
  return icons[props.metric.icon] || TrophyIcon
})

const formatValue = (value) => {
  if (typeof value === 'number') {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M'
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K'
    }
    return value.toString()
  }
  return value
}

// Icon components (simple SVG icons)
const TrophyIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor" class="icon">
      <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V7C19 10.31 16.31 13 13 13H11C7.69 13 5 10.31 5 7V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7M9 3V4H15V3H9M17 6H7V7C7 9.21 8.79 11 11 11H13C15.21 11 17 9.21 17 7V6M12 15L13.5 20H16L14 15H12M12 15L10.5 20H8L10 15H12Z"/>
    </svg>
  `
}

const TeamIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor" class="icon">
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 1H9L3 7V9H21M16 12C16 10.9 15.1 10 14 10S12 10.9 12 12V17H16V12M12 17V12C12 10.9 10.9 10 10 10S8 10.9 8 12V17H12Z"/>
    </svg>
  `
}

const StadiumIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor" class="icon">
      <path d="M12 2C8.7 2 6 4.7 6 8C6 11.3 8.7 14 12 14S18 11.3 18 8C18 4.7 15.3 2 12 2M12 4C14.2 4 16 5.8 16 8S14.2 12 12 12S8 10.2 8 8S9.8 4 12 4M3 16C3 15.4 3.4 15 4 15H20C20.6 15 21 15.4 21 16V20C21 20.6 20.6 21 20 21H4C3.4 21 3 20.6 3 20V16Z"/>
    </svg>
  `
}

const BallIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor" class="icon">
      <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22S22 17.52 22 12S17.52 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4S20 7.59 20 12S16.41 20 12 20M12 6L13.5 9H17L14.5 11L15.5 14L12 12L8.5 14L9.5 11L7 9H10.5L12 6Z"/>
    </svg>
  `
}

const TargetIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor" class="icon">
      <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22S22 17.5 22 12S17.5 2 12 2M12 20C7.6 20 4 16.4 4 12S7.6 4 12 4S20 7.6 20 12S16.4 20 12 20M12 6C8.7 6 6 8.7 6 12S8.7 18 12 18S18 15.3 18 12S15.3 6 12 6M12 16C9.8 16 8 14.2 8 12S9.8 8 12 8S16 9.8 16 12S14.2 16 12 16M12 10C10.9 10 10 10.9 10 12S10.9 14 12 14S14 13.1 14 12S13.1 10 12 10Z"/>
    </svg>
  `
}

const UsersIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor" class="icon">
      <path d="M16 4C18.2 4 20 5.8 20 8S18.2 12 16 12S12 10.2 12 8S13.8 4 16 4M16 14C18.7 14 24 15.3 24 18V20H8V18C8 15.3 13.3 14 16 14M8 4C10.2 4 12 5.8 12 8S10.2 12 8 12S4 10.2 4 8S5.8 4 8 4M8 14C10.7 14 16 15.3 16 18V20H0V18C0 15.3 5.3 14 8 14Z"/>
    </svg>
  `
}

const GlobeIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor" class="icon">
      <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22S22 17.52 22 12S17.52 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4S20 7.59 20 12S16.41 20 12 20M9.5 14C8.67 14 8 13.33 8 12.5S8.67 11 9.5 11S11 11.67 11 12.5S10.33 14 9.5 14M14.5 14C13.67 14 13 13.33 13 12.5S13.67 11 14.5 11S16 11.67 16 12.5S15.33 14 14.5 14Z"/>
    </svg>
  `
}

const StarIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor" class="icon">
      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
    </svg>
  `
}

const TrendUpIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor" class="trend-icon">
      <path d="M7 14L12 9L17 14H7Z"/>
    </svg>
  `
}

const TrendDownIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor" class="trend-icon">
      <path d="M7 10L12 15L17 10H7Z"/>
    </svg>
  `
}
</script>

<style scoped>
.fifa-metric-card {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.fifa-metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px -3px rgba(0, 0, 0, 0.15);
}

.fifa-metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/><circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/><circle cx="50" cy="50" r="20" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></svg>') no-repeat center right;
  background-size: 80px 80px;
  opacity: 0.3;
  pointer-events: none;
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.metric-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon {
  width: 20px;
  height: 20px;
}

.metric-label {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}

.metric-subtext {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 12px;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
}

.trend-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trend-indicator.up {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.trend-indicator.down {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.trend-icon {
  width: 12px;
  height: 12px;
}

.trend-value {
  opacity: 0.9;
}

/* Different card themes */
.fifa-metric-card:nth-child(odd) {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
}

.fifa-metric-card:nth-child(3n) {
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
}

.fifa-metric-card:nth-child(4n) {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
}

.fifa-metric-card:nth-child(5n) {
  background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
}

@media (max-width: 768px) {
  .fifa-metric-card {
    padding: 20px;
  }
  
  .metric-value {
    font-size: 28px;
  }
}
</style>