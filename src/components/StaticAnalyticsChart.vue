<script setup>
import { computed } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'line'
    }
});

// Static data for demonstration
const barData = [
    { label: '18-24', value: 45, height: 60 },
    { label: '25-34', value: 60, height: 80 },
    { label: '35-44', value: 35, height: 47 },
    { label: '45-54', value: 75, height: 100 },
    { label: '55-64', value: 55, height: 73 },
    { label: '65+', value: 40, height: 53 }
];

const lineData = [
    { x: 0, y: 75 },
    { x: 30, y: 65 },
    { x: 60, y: 80 },
    { x: 90, y: 70 },
    { x: 120, y: 85 },
    { x: 150, y: 90 },
    { x: 180, y: 82 },
    { x: 210, y: 88 },
    { x: 240, y: 92 },
    { x: 270, y: 87 },
    { x: 300, y: 91 },
    { x: 330, y: 95 }
];

const svgPath = computed(() => {
    return lineData
        .map((point, index) => {
            const command = index === 0 ? 'M' : 'L';
            return `${command} ${point.x} ${120 - point.y}`;
        })
        .join(' ');
});
</script>

<template>
    <div class="remote-chart-container">
        <h3 class="remote-chart-title">{{ title }}</h3>
        
        <!-- Bar Chart -->
        <div v-if="type === 'bar'" class="bar-chart">
            <div class="bars-container">
                <div 
                    v-for="bar in barData" 
                    :key="bar.label" 
                    class="bar-wrapper"
                >
                    <div 
                        class="bar" 
                        :style="{ height: bar.height + '%' }"
                    >
                        <span class="bar-value">{{ bar.value }}%</span>
                    </div>
                    <span class="bar-label">{{ bar.label }}</span>
                </div>
            </div>
        </div>
        
        <!-- Line Chart -->
        <div v-else-if="type === 'line'" class="line-chart">
            <svg viewBox="0 0 360 140" class="line-svg">
                <!-- Grid lines -->
                <g class="grid">
                    <line v-for="i in 5" :key="i" 
                        :x1="0" 
                        :y1="i * 28" 
                        :x2="360" 
                        :y2="i * 28" 
                        stroke="#e0e0e0" 
                        stroke-width="1"
                    />
                </g>
                
                <!-- Line -->
                <path :d="svgPath" 
                    fill="none" 
                    stroke="#4299e1" 
                    stroke-width="3"
                />
                
                <!-- Dots -->
                <circle 
                    v-for="point in lineData" 
                    :key="point.x"
                    :cx="point.x" 
                    :cy="120 - point.y" 
                    r="4" 
                    fill="#4299e1"
                />
            </svg>
            <div class="line-labels">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
            </div>
        </div>
    </div>
</template>

<style>
.remote-chart-container {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    /* Prevent resize observer issues */
    contain: layout style;
    will-change: auto;
}

.remote-chart-title {
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 600;
    color: #1a202c;
}

/* Bar Chart Styles */
.bar-chart {
    height: 250px;
    position: relative;
}

.bars-container {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 200px;
    padding: 0 10px;
}

.bar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    max-width: 60px;
}

.bar {
    width: 40px;
    background: linear-gradient(to top, #3182ce, #4299e1);
    border-radius: 4px 4px 0 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 8px;
    transition: all 0.3s ease;
    position: relative;
}

.bar:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(66, 153, 225, 0.3);
}

.bar-value {
    color: white;
    font-size: 12px;
    font-weight: 600;
}

.bar-label {
    margin-top: 8px;
    font-size: 12px;
    color: #4a5568;
    font-weight: 500;
}

/* Line Chart Styles */
.line-chart {
    position: relative;
}

.line-svg {
    width: 100%;
    height: 200px;
}

.line-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    padding: 0 10px;
}

.line-labels span {
    font-size: 11px;
    color: #4a5568;
}

.grid line {
    stroke-dasharray: 2, 2;
}
</style>