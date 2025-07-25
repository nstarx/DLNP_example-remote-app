<template>
  <div class="kpi-card" :class="kpi.status">
    <div class="kpi-header">
      <div class="kpi-icon">
        <span>{{ kpi.icon }}</span>
      </div>
      <div class="kpi-trend" v-if="kpi.trend">
        <span class="trend-icon" :class="kpi.trend.direction">
          {{ kpi.trend.direction === 'up' ? '↗' : kpi.trend.direction === 'down' ? '↘' : '→' }}
        </span>
        <span class="trend-value">{{ kpi.trend.value }}</span>
      </div>
    </div>
    
    <div class="kpi-content">
      <div class="kpi-value">{{ kpi.value }}</div>
      <div class="kpi-label">{{ kpi.label }}</div>
      <div class="kpi-description" v-if="kpi.description">
        {{ kpi.description }}
      </div>
    </div>
    
    <div class="kpi-footer" v-if="kpi.details">
      <div class="kpi-details">
        <span class="detail-item" v-for="detail in kpi.details" :key="detail.label">
          <span class="detail-label">{{ detail.label }}:</span>
          <span class="detail-value">{{ detail.value }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  kpi: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.kpi-card {
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--border-radius, 4px);
  padding: 20px;
  box-shadow: var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.kpi-card:hover {
  box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
  border-color: var(--color-primary, #0078d4);
}

.kpi-card.success {
  border-left: 4px solid var(--color-success, #107c10);
}

.kpi-card.warning {
  border-left: 4px solid var(--color-warning, #ff8c00);
}

.kpi-card.critical {
  border-left: 4px solid var(--color-danger, #d13438);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.kpi-icon {
  width: 40px;
  height: 40px;
  background: var(--color-surface-2, #f8f9fa);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.kpi-card.success .kpi-icon {
  background: #f0f9f0;
  color: var(--color-success, #107c10);
}

.kpi-card.warning .kpi-icon {
  background: #fef8f0;
  color: var(--color-warning, #ff8c00);
}

.kpi-card.critical .kpi-icon {
  background: #fef2f2;
  color: var(--color-danger, #d13438);
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
}

.trend-icon.up {
  color: var(--color-success, #107c10);
}

.trend-icon.down {
  color: var(--color-danger, #d13438);
}

.trend-icon.neutral {
  color: var(--color-secondary, #6b7280);
}

.trend-value {
  color: inherit;
}

.kpi-content {
  margin-bottom: 16px;
}

.kpi-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-text, #323130);
  line-height: 1;
  margin-bottom: 8px;
}

.kpi-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #323130);
  margin-bottom: 4px;
  line-height: 1.2;
}

.kpi-description {
  font-size: 14px;
  color: var(--color-text-secondary, #605e5c);
  line-height: 1.3;
}

.kpi-footer {
  border-top: 1px solid var(--color-surface-3, #e5e7eb);
  padding-top: 12px;
  margin-top: 16px;
}

.kpi-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.detail-label {
  color: var(--color-text-secondary, #605e5c);
  font-weight: 500;
}

.detail-value {
  color: var(--color-text, #323130);
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .kpi-card {
    padding: 16px;
  }
  
  .kpi-value {
    font-size: 28px;
  }
  
  .kpi-label {
    font-size: 14px;
  }
}
</style>