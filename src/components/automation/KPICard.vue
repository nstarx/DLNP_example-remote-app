<template>
  <div class="kpi-card">
    <div class="kpi-header">
      <div class="kpi-icon">{{ kpi.icon }}</div>
      <div class="kpi-trend" :class="{ 'trend-up': kpi.trendUp, 'trend-down': !kpi.trendUp }">
        {{ kpi.trend }}
      </div>
    </div>
    
    <div class="kpi-main">
      <div class="kpi-value">
        {{ kpi.value }}<span v-if="kpi.unit" class="kpi-unit">{{ kpi.unit }}</span>
      </div>
      <div class="kpi-label">{{ kpi.label }}</div>
    </div>
    
    <div class="kpi-footer">
      <span class="kpi-subtext">{{ kpi.subtext }}</span>
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
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
}

.kpi-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.kpi-icon {
  font-size: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 8px;
}

.kpi-trend {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.trend-up {
  background: #dcfce7;
  color: #166534;
}

.trend-down {
  background: #fee2e2;
  color: #991b1b;
}

.kpi-main {
  margin-bottom: 12px;
}

.kpi-value {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
  margin-bottom: 4px;
}

.kpi-unit {
  font-size: 18px;
  font-weight: 500;
  color: #64748b;
  margin-left: 2px;
}

.kpi-label {
  font-size: 16px;
  font-weight: 500;
  color: #475569;
}

.kpi-footer {
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.kpi-subtext {
  font-size: 13px;
  color: #64748b;
}

@media (max-width: 768px) {
  .kpi-card {
    padding: 20px;
  }
  
  .kpi-value {
    font-size: 28px;
  }
  
  .kpi-unit {
    font-size: 16px;
  }
}
</style>