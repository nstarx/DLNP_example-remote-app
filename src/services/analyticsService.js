import { mockMetrics, mockChartData } from '@/data/mockData'

export class AnalyticsService {
  async getMetrics(period, filters = {}) {
    await this.simulateDelay()
    
    let baseMetrics = mockMetrics[period] || []
    
    // Apply filters to modify metrics based on desk and publication
    if (filters.desk && filters.desk !== 'all') {
      baseMetrics = this.applyDeskFilter(baseMetrics, filters.desk)
    }
    
    if (filters.publication && filters.publication !== 'all') {
      baseMetrics = this.applyPublicationFilter(baseMetrics, filters.publication)
    }
    
    return baseMetrics
  }

  async getChartData(period, filters = {}) {
    await this.simulateDelay()
    
    let baseChartData = mockChartData[period] || { labels: [], pageViews: [], visitors: [] }
    
    // Apply filters to modify chart data
    if (filters.desk && filters.desk !== 'all') {
      baseChartData = this.applyDeskFilterToChart(baseChartData, filters.desk)
    }
    
    if (filters.publication && filters.publication !== 'all') {
      baseChartData = this.applyPublicationFilterToChart(baseChartData, filters.publication)
    }
    
    return baseChartData
  }

  applyDeskFilter(metrics, desk) {
    // Simulate desk-specific adjustments to metrics
    const deskMultipliers = {
      'politics': 0.85,
      'sports': 1.2,
      'local': 0.95,
      'investigations': 0.6,
      'entertainment': 1.1,
      'business': 0.8,
      'opinion': 0.7,
      'breaking': 1.4
    }
    
    const multiplier = deskMultipliers[desk] || 1.0
    
    return metrics.map(metric => ({
      ...metric,
      value: typeof metric.value === 'number' 
        ? Math.round(metric.value * multiplier)
        : metric.value
    }))
  }

  applyPublicationFilter(metrics, publication) {
    // Simulate publication-specific adjustments to metrics
    const publicationMultipliers = {
      'miami-herald': 1.3,
      'charlotte-observer': 1.1,
      'kansas-city-star': 0.9,
      'sacramento-bee': 0.8,
      'fort-worth-star-telegram': 0.85,
      'fresno-bee': 0.7,
      'modesto-bee': 0.6,
      'bellingham-herald': 0.5,
      'bradenton-herald': 0.6,
      'lexington-herald-leader': 0.8
    }
    
    const multiplier = publicationMultipliers[publication] || 1.0
    
    return metrics.map(metric => ({
      ...metric,
      value: typeof metric.value === 'number' 
        ? Math.round(metric.value * multiplier)
        : metric.value
    }))
  }

  applyDeskFilterToChart(chartData, desk) {
    const deskMultipliers = {
      'politics': 0.85,
      'sports': 1.2,
      'local': 0.95,
      'investigations': 0.6,
      'entertainment': 1.1,
      'business': 0.8,
      'opinion': 0.7,
      'breaking': 1.4
    }
    
    const multiplier = deskMultipliers[desk] || 1.0
    
    return {
      ...chartData,
      pageViews: chartData.pageViews.map(value => Math.round(value * multiplier)),
      visitors: chartData.visitors.map(value => Math.round(value * multiplier))
    }
  }

  applyPublicationFilterToChart(chartData, publication) {
    const publicationMultipliers = {
      'miami-herald': 1.3,
      'charlotte-observer': 1.1,
      'kansas-city-star': 0.9,
      'sacramento-bee': 0.8,
      'fort-worth-star-telegram': 0.85,
      'fresno-bee': 0.7,
      'modesto-bee': 0.6,
      'bellingham-herald': 0.5,
      'bradenton-herald': 0.6,
      'lexington-herald-leader': 0.8
    }
    
    const multiplier = publicationMultipliers[publication] || 1.0
    
    return {
      ...chartData,
      pageViews: chartData.pageViews.map(value => Math.round(value * multiplier)),
      visitors: chartData.visitors.map(value => Math.round(value * multiplier))
    }
  }

  async simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 500))
  }
}

export const analyticsService = new AnalyticsService()