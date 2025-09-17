import { ref, computed } from 'vue'
import { innovationService } from '@/services/innovationService'

export function useInnovation() {
  const metrics = ref([])
  const categoryMetrics = ref([])
  const chartData = ref(null)
  const categories = ref([])
  const selectedCategory = ref('all')
  const loading = ref(false)
  const error = ref(null)

  const hasData = computed(() => metrics.value.length > 0)
  const currentCategoryName = computed(() => {
    if (selectedCategory.value === 'all') return 'Executive Summary'
    const category = categories.value.find(cat => cat.id === selectedCategory.value)
    return category?.name || 'Unknown Category'
  })

  async function fetchCategories() {
    try {
      categories.value = await innovationService.getCategories()
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  async function fetchMetrics(period, category = 'all') {
    loading.value = true
    error.value = null
    
    try {
      if (category === 'all') {
        // Executive summary metrics
        metrics.value = await innovationService.getExecutiveSummary(period)
      } else {
        // Category-specific metrics
        metrics.value = await innovationService.getCategoryMetrics(category, period)
      }
      
      selectedCategory.value = category
    } catch (err) {
      error.value = err.message || 'Failed to fetch innovation metrics'
      metrics.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchChartData(chartType, period) {
    loading.value = true
    error.value = null
    
    try {
      chartData.value = await innovationService.getChartData(chartType, period)
    } catch (err) {
      error.value = err.message || 'Failed to fetch chart data'
      chartData.value = null
    } finally {
      loading.value = false
    }
  }

  async function fetchCategoryMetrics(categoryId, period) {
    loading.value = true
    error.value = null
    
    try {
      categoryMetrics.value = await innovationService.getCategoryMetrics(categoryId, period)
    } catch (err) {
      error.value = err.message || 'Failed to fetch category metrics'
      categoryMetrics.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    metrics,
    categoryMetrics,
    chartData,
    categories,
    selectedCategory,
    currentCategoryName,
    loading,
    error,
    hasData,
    fetchCategories,
    fetchMetrics,
    fetchChartData,
    fetchCategoryMetrics
  }
}