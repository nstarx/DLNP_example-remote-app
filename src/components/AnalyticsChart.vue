<script setup>
import { onMounted, watch, nextTick } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: true
    },
    type: {
        type: String,
        default: 'line'
    }
});

// Generate unique ID for this chart instance
const chartId = `analytics-chart-${Math.random().toString(36).substr(2, 9)}`;

const renderChart = async () => {
    await nextTick();
    const canvas = document.getElementById(chartId);
    if (!canvas) {
        console.log('Canvas not found:', chartId);
        return;
    }
    
    if (!props.data || !props.data.values || props.data.values.length === 0) {
        console.log('No data to render:', props.title, props.data);
        return;
    }
    
    // Simple chart rendering (in production, use Chart.js or similar)
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    console.log('Rendering chart:', props.title, 'with', props.data.values.length, 'data points');
    
    ctx.clearRect(0, 0, width, height);
    
    // Simple visualization
    if (props.type === 'line') {
        renderLineChart(ctx, width, height);
    } else if (props.type === 'bar') {
        renderBarChart(ctx, width, height);
    }
};

const renderLineChart = (ctx, width, height) => {
    const data = props.data.values || [];
    if (data.length === 0) {
        console.log('No data values for line chart');
        return;
    }
    const maxValue = Math.max(...data);
    const padding = 40;
    
    ctx.strokeStyle = '#4299e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
        const y = height - padding - (value / maxValue) * (height - 2 * padding);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
};

const renderBarChart = (ctx, width, height) => {
    const data = props.data.values || [];
    if (data.length === 0) {
        console.log('No data values for bar chart');
        return;
    }
    const maxValue = Math.max(...data);
    const padding = 40;
    const barWidth = (width - 2 * padding) / data.length * 0.8;
    const barSpacing = (width - 2 * padding) / data.length * 0.2;
    
    ctx.fillStyle = '#4299e1';
    
    data.forEach((value, index) => {
        const x = padding + index * (barWidth + barSpacing);
        const barHeight = (value / maxValue) * (height - 2 * padding);
        const y = height - padding - barHeight;
        
        ctx.fillRect(x, y, barWidth, barHeight);
    });
};

onMounted(() => {
    renderChart();
});

watch(() => props.data, (newData) => {
    console.log('Chart data updated for', props.title, ':', newData);
    renderChart();
}, { deep: true, immediate: true });
</script>

<template>
    <div class="remote-chart-container">
        <h3 class="remote-chart-title">{{ title }}</h3>
        <canvas :id="chartId" width="400" height="250"></canvas>
    </div>
</template>

<style>
.remote-chart-container {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.remote-chart-title {
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 600;
    color: #1a202c;
}

canvas {
    width: 100%;
    height: auto;
    max-height: 250px;
}
</style>