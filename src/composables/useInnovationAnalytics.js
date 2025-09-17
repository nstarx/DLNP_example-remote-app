import { ref, computed } from 'vue'
import { innovationService } from '@/services/innovationService'

export function useInnovationAnalytics() {
  // Core Data
  const keyKPIs = ref([])
  const pipelineMetrics = ref([])
  const revenueMetrics = ref([])
  const customerMetrics = ref([])
  const partnerMetrics = ref([])
  const operationalMetrics = ref([])
  const strategicMetrics = ref([])
  const cultureMetrics = ref([])
  
  // Chart Data
  const innovationFunnelData = ref(null)
  const portfolioMixData = ref(null)
  const revenueChartData = ref(null)
  const recurringRevenueData = ref(null)
  const attachRateData = ref(null)
  const npsComparisonData = ref(null)
  const roiTrendData = ref(null)
  const engagementData = ref(null)
  
  // State Management
  const loading = ref(false)
  const error = ref(null)
  const lastUpdated = ref(null)

  // Computed Properties
  const hasData = computed(() => keyKPIs.value.length > 0)
  const totalInnovationROI = computed(() => {
    const roiMetric = operationalMetrics.value.find(m => m.key === 'innovation_roi')
    return roiMetric ? roiMetric.value : 0
  })

  async function fetchInnovationData(period) {
    loading.value = true
    error.value = null
    
    try {
      // Fetch all innovation data in parallel
      const [
        kpiData,
        pipelineData,
        revenueData,
        customerData,
        partnerData,
        operationalData,
        strategicData,
        cultureData,
        chartData
      ] = await Promise.all([
        innovationService.getKeyKPIs(period),
        innovationService.getPipelineMetrics(period),
        innovationService.getRevenueMetrics(period),
        innovationService.getCustomerMetrics(period),
        innovationService.getPartnerMetrics(period),
        innovationService.getOperationalMetrics(period),
        innovationService.getStrategicMetrics(period),
        innovationService.getCultureMetrics(period),
        innovationService.getChartData(period)
      ])
      
      // Set metrics data
      keyKPIs.value = kpiData
      pipelineMetrics.value = pipelineData
      revenueMetrics.value = revenueData
      customerMetrics.value = customerData
      partnerMetrics.value = partnerData
      operationalMetrics.value = operationalData
      strategicMetrics.value = strategicData
      cultureMetrics.value = cultureData
      
      // Set chart data
      innovationFunnelData.value = chartData.funnel
      portfolioMixData.value = chartData.portfolioMix
      revenueChartData.value = chartData.revenueChart
      recurringRevenueData.value = chartData.recurringRevenue
      attachRateData.value = chartData.attachRate
      npsComparisonData.value = chartData.npsComparison
      roiTrendData.value = chartData.roiTrend
      engagementData.value = chartData.engagement
      
      lastUpdated.value = new Date()
      
    } catch (err) {
      error.value = err.message || 'Failed to fetch innovation analytics data'
      console.error('Innovation Analytics Error:', err)
      
      // Reset all data on error
      resetData()
    } finally {
      loading.value = false
    }
  }

  function resetData() {
    keyKPIs.value = []
    pipelineMetrics.value = []
    revenueMetrics.value = []
    customerMetrics.value = []
    partnerMetrics.value = []
    operationalMetrics.value = []
    strategicMetrics.value = []
    cultureMetrics.value = []
    
    innovationFunnelData.value = null
    portfolioMixData.value = null
    revenueChartData.value = null
    recurringRevenueData.value = null
    attachRateData.value = null
    npsComparisonData.value = null
    roiTrendData.value = null
    engagementData.value = null
  }

  // Export data for reporting or analysis
  function exportData() {
    return {
      kpis: keyKPIs.value,
      pipeline: pipelineMetrics.value,
      revenue: revenueMetrics.value,
      customer: customerMetrics.value,
      partner: partnerMetrics.value,
      operational: operationalMetrics.value,
      strategic: strategicMetrics.value,
      culture: cultureMetrics.value,
      charts: {
        funnel: innovationFunnelData.value,
        portfolioMix: portfolioMixData.value,
        revenue: revenueChartData.value,
        recurringRevenue: recurringRevenueData.value,
        attachRate: attachRateData.value,
        npsComparison: npsComparisonData.value,
        roiTrend: roiTrendData.value,
        engagement: engagementData.value
      },
      meta: {
        lastUpdated: lastUpdated.value,
        totalROI: totalInnovationROI.value
      }
    }
  }

  return {
    // Data
    keyKPIs,
    pipelineMetrics,
    revenueMetrics,
    customerMetrics,
    partnerMetrics,
    operationalMetrics,
    strategicMetrics,
    cultureMetrics,
    
    // Charts
    innovationFunnelData,
    portfolioMixData,
    revenueChartData,
    recurringRevenueData,
    attachRateData,
    npsComparisonData,
    roiTrendData,
    engagementData,
    
    // State
    loading,
    error,
    hasData,
    lastUpdated,
    
    // Computed
    totalInnovationROI,
    
    // Methods
    fetchInnovationData,
    resetData,
    exportData
  }
}