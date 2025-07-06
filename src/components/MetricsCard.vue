<script setup>
import { computed } from 'vue';

const props = defineProps({
    metric: {
        type: Object,
        required: true
    }
});

const changeClass = computed(() => {
    if (props.metric.change > 0) return 'positive';
    if (props.metric.change < 0) return 'negative';
    return 'neutral';
});

const formatValue = (value) => {
    if (typeof value === 'number') {
        return new Intl.NumberFormat().format(value);
    }
    return value;
};
</script>

<template>
    <div class="remote-metric-card">
        <div class="remote-metric-header">
            <span class="remote-metric-label">{{ metric.label }}</span>
            <div class="remote-metric-icon">
                <span v-if="metric.icon === 'users'">👥</span>
                <span v-else-if="metric.icon === 'eye'">👁️</span>
                <span v-else-if="metric.icon === 'chart'">📊</span>
                <span v-else-if="metric.icon === 'exit'">🚪</span>
            </div>
        </div>
        <div class="remote-metric-value">{{ formatValue(metric.value) }}</div>
        <div class="remote-metric-footer">
            <span :class="['remote-metric-change', changeClass]">
                <span v-if="metric.change > 0">↑</span>
                <span v-else-if="metric.change < 0">↓</span>
                {{ Math.abs(metric.change) }}%
            </span>
            <span class="remote-metric-period">vs last period</span>
        </div>
    </div>
</template>

<style>
.remote-metric-card {
    background: #1a1a1a;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.05);
    transition: transform 0.2s, box-shadow 0.2s;
    border: 1px solid #333333;
    /* Prevent resize observer issues */
    contain: layout style;
}

.remote-metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(255, 255, 255, 0.1);
    border-color: #4299e1;
}

.remote-metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.remote-metric-label {
    font-size: 14px;
    color: #9ca3af;
    font-weight: 500;
}

.remote-metric-icon {
    width: 40px;
    height: 40px;
    background: #2a2a2a;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    border: 1px solid #333333;
}

.remote-metric-value {
    font-size: 32px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 12px;
}

.remote-metric-footer {
    display: flex;
    align-items: center;
    gap: 8px;
}

.remote-metric-change {
    font-size: 14px;
    font-weight: 600;
}

.remote-metric-change.positive {
    color: #48bb78;
}

.remote-metric-change.negative {
    color: #f56565;
}

.remote-metric-change.neutral {
    color: #9ca3af;
}

.remote-metric-period {
    font-size: 12px;
    color: #6b7280;
}
</style>