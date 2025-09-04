import { ref, computed } from 'vue'
import { analyticsService } from '@/services/analyticsService'

export function useAnalytics() {
  const metrics = ref([])
  const chartData = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const lastRefresh = ref(new Date())

  const hasData = computed(() => metrics.value.length > 0)

  async function fetchAnalytics(period, filters = {}) {
    loading.value = true
    error.value = null
    
    try {
      const [metricsData, chartDataResult] = await Promise.all([
        analyticsService.getMetrics(period, filters),
        analyticsService.getChartData(period, filters)
      ])
      
      metrics.value = metricsData
      chartData.value = chartDataResult
      lastRefresh.value = new Date()
    } catch (err) {
      error.value = err.message || 'Failed to fetch analytics data'
      metrics.value = []
      chartData.value = null
    } finally {
      loading.value = false
    }
  }

  async function refreshData(period, filters = {}) {
    return fetchAnalytics(period, filters)
  }

  return {
    metrics,
    chartData,
    loading,
    error,
    hasData,
    lastRefresh,
    fetchAnalytics,
    refreshData
  }
}