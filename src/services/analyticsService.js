import { mockMetrics, mockChartData } from '@/data/mockData'

export class AnalyticsService {
  async getMetrics(period) {
    await this.simulateDelay()
    return mockMetrics[period] || []
  }

  async getChartData(period) {
    await this.simulateDelay()
    return mockChartData[period] || { labels: [], pageViews: [], visitors: [] }
  }

  async simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 500))
  }
}

export const analyticsService = new AnalyticsService()