import { ref } from 'vue';

export const useAnalytics = () => {
    const metrics = ref([]);
    const chartData = ref({
        traffic: { values: [] },
        demographics: { values: [] }
    });
    const loading = ref(false);

    const generateMockData = (period) => {
        const days = {
            '1d': 24,
            '7d': 7,
            '30d': 30,
            '90d': 90
        }[period] || 7;

        // Generate static metrics for demo
        metrics.value = [
            {
                id: 'visitors',
                label: 'Total Visitors',
                value: 14523,
                change: 12,
                icon: 'users'
            },
            {
                id: 'pageviews',
                label: 'Page Views',
                value: 32847,
                change: -5,
                icon: 'eye'
            },
            {
                id: 'conversion',
                label: 'Conversion Rate',
                value: '4.2%',
                change: 8,
                icon: 'chart'
            },
            {
                id: 'bounce',
                label: 'Bounce Rate',
                value: '42.3%',
                change: -3,
                icon: 'exit'
            }
        ];

        // Generate chart data
        const trafficData = [];
        const demographicsData = [];

        for (let i = 0; i < Math.min(days, 30); i++) {
            trafficData.push(Math.floor(Math.random() * 5000 + 8000));
            demographicsData.push(Math.floor(Math.random() * 3000 + 2000));
        }

        chartData.value = {
            traffic: { values: trafficData },
            demographics: { values: demographicsData }
        };
    };

    const fetchAnalytics = async (period) => {
        loading.value = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        generateMockData(period);
        loading.value = false;
    };

    return {
        metrics,
        chartData,
        loading,
        fetchAnalytics
    };
};