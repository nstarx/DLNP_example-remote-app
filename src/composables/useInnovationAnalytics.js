import { ref, computed } from 'vue'
import { innovationService } from '@/services/innovationService'

export function useInnovationAnalytics() {
  const metrics = ref([])
  const chartData = ref(null)
  const portfolioMix = ref(null)
  const strategicMetrics = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const hasData = computed(() => metrics.value.length > 0)
  
  // Organize metrics by category
  const metricsByCategory = computed(() => {
    return metrics.value.reduce((acc, metric) => {
      if (!acc[metric.category]) {
        acc[metric.category] = []
      }
      acc[metric.category].push(metric)
      return acc
    }, {})
  })

  // Category labels for display
  const categoryLabels = {
    pipeline: 'Innovation Pipeline & Portfolio',
    portfolio: 'Portfolio Mix',
    revenue: 'Revenue & EBITDA Impact',
    customer: 'Customer Value & Differentiation',
    ecosystem: 'Partner & Ecosystem',
    operational: 'Operational Efficiency',
    strategic: 'Strategic Foresight',
    culture: 'Culture & Talent'
  }

  async function fetchInnovationAnalytics(period) {
    loading.value = true
    error.value = null
    
    try {
      const [
        metricsData, 
        chartDataResult, 
        portfolioMixData, 
        strategicMetricsData
      ] = await Promise.all([
        innovationService.getMetrics(period),
        innovationService.getChartData(period),
        innovationService.getPortfolioMix(period),
        innovationService.getStrategicMetrics()
      ])
      
      metrics.value = metricsData
      chartData.value = chartDataResult
      portfolioMix.value = portfolioMixData
      strategicMetrics.value = strategicMetricsData
    } catch (err) {
      error.value = err.message || 'Failed to fetch innovation analytics data'
      metrics.value = []
      chartData.value = null
      portfolioMix.value = null
      strategicMetrics.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    metrics,
    chartData,
    portfolioMix,
    strategicMetrics,
    metricsByCategory,
    categoryLabels,
    loading,
    error,
    hasData,
    fetchInnovationAnalytics
  }
}