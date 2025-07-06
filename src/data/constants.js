export const PERIODS = [
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' }
]

export const CHART_COLORS = {
  primary: '#4f46e5',
  secondary: '#10b981',
  accent: '#f59e0b',
  danger: '#ef4444',
  neutral: '#6b7280'
}

export const CHART_CONFIG = {
  lineChart: {
    strokeWidth: 2,
    dotRadius: 4,
    animationDuration: 300
  },
  barChart: {
    barWidth: 40,
    gap: 10,
    animationDuration: 300
  }
}