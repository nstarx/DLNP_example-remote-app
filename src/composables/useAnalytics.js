import { ref, computed } from 'vue'
import { analyticsService } from '@/services/analyticsService'

export function useAnalytics() {
  const metrics = ref([])
  const chartData = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const hasData = computed(() => metrics.value.length > 0)

  async function fetchAnalytics(period) {
    loading.value = true
    error.value = null
    
    try {
      const [metricsData, chartDataResult] = await Promise.all([
        analyticsService.getMetrics(period),
        analyticsService.getChartData(period)
      ])
      
      metrics.value = metricsData
      chartData.value = chartDataResult
    } catch (err) {
      error.value = err.message || 'Failed to fetch analytics data'
      metrics.value = []
      chartData.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    metrics,
    chartData,
    loading,
    error,
    hasData,
    fetchAnalytics
  }
}