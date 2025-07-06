<script setup>
import { ref, onMounted } from 'vue';
import StaticAnalyticsChart from './components/StaticAnalyticsChart.vue';
import MetricsCard from './components/MetricsCard.vue';
import { useAnalytics } from './composables/useAnalytics';
import './utils/resizeObserverFix';

const { metrics, loading, fetchAnalytics } = useAnalytics();

const selectedPeriod = ref('7d');

const periods = [
    { label: 'Last 24 Hours', value: '1d' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' }
];

const changePeriod = (period) => {
    console.log('Button clicked! Period:', period);
    console.log('Before change, selectedPeriod:', selectedPeriod.value);
    selectedPeriod.value = period;
    console.log('After change, selectedPeriod:', selectedPeriod.value);
    fetchAnalytics(period);
};

const refreshData = () => {
    console.log('Refresh button clicked!');
    fetchAnalytics(selectedPeriod.value);
};

const handleRoundButtonClick = () => {
    console.log('Round button clicked!');
    // Add your custom functionality here
};

onMounted(() => {
    fetchAnalytics(selectedPeriod.value);
});
</script>

<template>
    <div class="remote-analytics-dashboard">
        <div class="remote-dashboard-header">
            <h1>Analytics Dashboard ({{ selectedPeriod }})</h1>
            <div class="remote-header-controls">
                <div class="remote-period-selector">
                    <button 
                        v-for="period in periods" 
                        :key="period.value"
                        :class="['remote-period-btn', { active: selectedPeriod === period.value }]"
                        @click="changePeriod(period.value)"
                    >
                        {{ period.label }}
                    </button>
                </div>
                <button 
                    class="remote-refresh-btn"
                    @click="refreshData"
                    :disabled="loading"
                >
                    {{ loading ? 'Loading...' : 'Refresh Data' }}
                </button>
            </div>
        </div>

        <div v-if="loading" class="remote-loading-container">
            <div class="remote-spinner"></div>
            <p>Loading analytics data...</p>
        </div>

        <div v-else class="remote-dashboard-content">
            <div class="remote-metrics-grid">
                <MetricsCard
                    v-for="metric in metrics"
                    :key="metric.id"
                    :metric="metric"
                />
            </div>

            <div class="remote-charts-section">
                <StaticAnalyticsChart
                    title="Traffic Overview"
                    type="line"
                />
                <StaticAnalyticsChart
                    title="User Demographics"
                    type="bar"
                />
            </div>
        </div>
    </div>
</template>

<style>
.remote-analytics-dashboard {
    padding: 20px;
    background-color: #000000;
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.remote-dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding: 20px;
    background: #1a1a1a;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
}

.remote-dashboard-header h1 {
    margin: 0;
    color: #ffffff;
    font-size: 28px;
}

.remote-header-controls {
    display: flex;
    gap: 20px;
    align-items: center;
}

.remote-period-selector {
    display: flex;
    gap: 10px;
}

.remote-period-btn {
    padding: 8px 16px;
    border: 1px solid #333333;
    background: #1a1a1a;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
    color: #ffffff;
}

.remote-period-btn:hover {
    background: #2a2a2a;
    border-color: #4299e1;
}

.remote-period-btn.active {
    background: #4299e1;
    color: white;
    border-color: #4299e1;
}

.remote-refresh-btn {
    padding: 8px 16px;
    border: 1px solid #333333;
    background: #1a1a1a;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
    color: #ffffff;
}

.remote-refresh-btn:hover {
    background: #2a2a2a;
    border-color: #4299e1;
}

.remote-refresh-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.remote-loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
    color: #ffffff;
}

.remote-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid #333333;
    border-top-color: #4299e1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.remote-metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.remote-charts-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
}
</style>