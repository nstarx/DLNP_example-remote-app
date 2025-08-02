<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';

const stats = ref([
    {
        title: "Total Sales",
        icon: "pi-shopping-cart",
        value: "Loading...",
        subtitle: "Last 7 days",
    },
    {
        title: "Active Users",
        icon: "pi-users",
        value: "Loading...",
        subtitle: "Last 7 days",
    },
    {
        title: "New Orders",
        icon: "pi-box",
        value: "Loading...",
        subtitle: "Last 7 days",
    },
    {
        title: "Revenue Growth",
        icon: "pi-chart-line",
        value: "Loading...",
        subtitle: "Last 7 days",
    },
]);

const loading = ref(true);
const error = ref(null);

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(value);
};

const loadStats = async () => {
    try {
        loading.value = true;
        error.value = null;
        const data = await api.getStats();
        
        // Update stats with real data
        stats.value[0].value = formatCurrency(data.total_sales);
        stats.value[1].value = data.active_users.toLocaleString();
        stats.value[2].value = data.new_orders.toLocaleString();
        stats.value[3].value = `${data.revenue_growth}%`;
    } catch (err) {
        error.value = 'Failed to load statistics';
        console.error('Error loading stats:', err);
        // Set fallback values
        stats.value.forEach(stat => {
            stat.value = 'N/A';
        });
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadStats();
});
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
            v-for="(stat, index) in stats"
            :key="index"
            class="bg-surface-0 dark:bg-surface-900 p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col gap-2"
        >
            <div class="flex items-start gap-2 justify-between">
                <span class="text-xl font-light leading-tight">{{ stat.title }}</span>
                <span
                    class="shrink-0 bg-primary-100 dark:bg-primary-400/20 text-primary rounded-lg w-8 h-8 flex items-center justify-center border border-primary-200 dark:border-primary-400/40"
                >
                    <i :class="['pi', stat.icon, 'text-xl!', 'leading-none!']"></i>
                </span>
            </div>
            <div class="flex flex-col gap-1 w-full">
                <div class="text-3xl font-medium leading-tight">{{ stat.value }}</div>
                <div class="text-surface-600 dark:text-surface-400 text-sm leading-tight">{{ stat.subtitle }}</div>
            </div>
        </div>
    </div>
</template>
