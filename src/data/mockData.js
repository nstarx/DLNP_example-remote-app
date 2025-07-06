export const mockMetrics = {
  '24h': [
    { label: 'Page Views', value: 45231, change: 12.5, trend: 'up' },
    { label: 'Unique Visitors', value: 8942, change: -3.2, trend: 'down' },
    { label: 'Avg Session', value: '3m 24s', change: 8.7, trend: 'up' },
    { label: 'Bounce Rate', value: '42.3%', change: -5.1, trend: 'down' }
  ],
  '7d': [
    { label: 'Page Views', value: 312543, change: 8.3, trend: 'up' },
    { label: 'Unique Visitors', value: 52341, change: 15.7, trend: 'up' },
    { label: 'Avg Session', value: '4m 12s', change: 12.3, trend: 'up' },
    { label: 'Bounce Rate', value: '38.7%', change: -8.4, trend: 'down' }
  ],
  '30d': [
    { label: 'Page Views', value: 1243521, change: 23.1, trend: 'up' },
    { label: 'Unique Visitors', value: 189234, change: 18.9, trend: 'up' },
    { label: 'Avg Session', value: '4m 45s', change: 15.2, trend: 'up' },
    { label: 'Bounce Rate', value: '36.2%', change: -12.1, trend: 'down' }
  ],
  '90d': [
    { label: 'Page Views', value: 3521456, change: 45.2, trend: 'up' },
    { label: 'Unique Visitors', value: 523412, change: 38.7, trend: 'up' },
    { label: 'Avg Session', value: '5m 02s', change: 22.4, trend: 'up' },
    { label: 'Bounce Rate', value: '34.5%', change: -15.3, trend: 'down' }
  ]
}

export const mockChartData = {
  '24h': {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    pageViews: [1200, 890, 2100, 3400, 2800, 2300],
    visitors: [450, 320, 780, 1200, 980, 850]
  },
  '7d': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    pageViews: [42000, 48000, 51000, 47000, 52000, 38000, 35000],
    visitors: [7200, 8100, 8500, 7900, 8700, 6500, 6100]
  },
  '30d': {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    pageViews: Array.from({ length: 30 }, () => Math.floor(Math.random() * 50000 + 30000)),
    visitors: Array.from({ length: 30 }, () => Math.floor(Math.random() * 8000 + 5000))
  },
  '90d': {
    labels: Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`),
    pageViews: Array.from({ length: 12 }, () => Math.floor(Math.random() * 350000 + 250000)),
    visitors: Array.from({ length: 12 }, () => Math.floor(Math.random() * 50000 + 35000))
  }
}

export const barChartData = {
  labels: ['Direct', 'Social', 'Email', 'Organic', 'Referral'],
  values: [4321, 3212, 2341, 5432, 1234]
}

export const lineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  values: [65, 78, 90, 85, 92, 88]
}