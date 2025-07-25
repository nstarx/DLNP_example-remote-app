import { ref, computed } from 'vue'

export function useExperienceHeatmap() {
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    location: 'all',
    department: 'all',
    osVersion: 'all',
    deviceType: 'all',
    showProblemsOnly: false
  })

  // Mock data for heatmap zones
  const zones = ref([
    {
      id: 'floor1-east',
      name: 'Floor 1 East',
      type: 'location',
      score: 95,
      devices: 42,
      issues: [
        { type: 'Network', severity: 'low', count: 2 },
        { type: 'Storage Space', severity: 'medium', count: 1 }
      ],
      metrics: {
        avgLoginTime: 2.1,
        deviceHealth: 95,
        automationFailures: 1,
        topIssues: [
          { issue: 'Slow network on some devices', count: 2, fix: 'Update network drivers' },
          { issue: 'Low disk space warnings', count: 1, fix: 'Run disk cleanup' }
        ]
      }
    },
    {
      id: 'floor1-west',
      name: 'Floor 1 West',
      type: 'location',
      score: 72,
      devices: 38,
      issues: [
        { type: 'Wi-Fi', severity: 'high', count: 8 },
        { type: 'Performance', severity: 'medium', count: 4 }
      ],
      metrics: {
        avgLoginTime: 5.8,
        deviceHealth: 72,
        automationFailures: 12,
        topIssues: [
          { issue: 'Wi-Fi connection drops', count: 8, fix: 'Replace access point in zone A3' },
          { issue: 'Slow boot times', count: 4, fix: 'Update BIOS and drivers' },
          { issue: 'Application crashes', count: 3, fix: 'Restart Windows Update service' }
        ]
      }
    },
    {
      id: 'floor2-north',
      name: 'Floor 2 North',
      type: 'location',
      score: 88,
      devices: 31,
      issues: [
        { type: 'Updates', severity: 'medium', count: 3 }
      ],
      metrics: {
        avgLoginTime: 3.2,
        deviceHealth: 88,
        automationFailures: 3,
        topIssues: [
          { issue: 'Pending security updates', count: 3, fix: 'Schedule update deployment' }
        ]
      }
    },
    {
      id: 'sales-team',
      name: 'Sales Team',
      type: 'department',
      score: 45,
      devices: 23,
      issues: [
        { type: 'VPN', severity: 'high', count: 15 },
        { type: 'Application', severity: 'high', count: 8 },
        { type: 'Hardware', severity: 'medium', count: 5 }
      ],
      metrics: {
        avgLoginTime: 12.4,
        deviceHealth: 45,
        automationFailures: 28,
        topIssues: [
          { issue: 'VPN connection failures', count: 15, fix: 'Update VPN client and certificates' },
          { issue: 'CRM application crashes', count: 8, fix: 'Reinstall CRM with latest patch' },
          { issue: 'Overheating laptops', count: 5, fix: 'Clean vents and replace thermal paste' }
        ]
      }
    },
    {
      id: 'engineering-team',
      name: 'Engineering',
      type: 'department',
      score: 91,
      devices: 45,
      issues: [
        { type: 'Performance', severity: 'low', count: 2 }
      ],
      metrics: {
        avgLoginTime: 2.8,
        deviceHealth: 91,
        automationFailures: 2,
        topIssues: [
          { issue: 'IDE memory usage warnings', count: 2, fix: 'Increase JVM heap size' }
        ]
      }
    },
    {
      id: 'marketing-team',
      name: 'Marketing',
      type: 'department',
      score: 76,
      devices: 18,
      issues: [
        { type: 'Software', severity: 'medium', count: 4 },
        { type: 'Storage', severity: 'low', count: 2 }
      ],
      metrics: {
        avgLoginTime: 4.5,
        deviceHealth: 76,
        automationFailures: 6,
        topIssues: [
          { issue: 'Adobe Creative Suite performance', count: 4, fix: 'Upgrade RAM to 32GB' },
          { issue: 'Cloud storage sync issues', count: 2, fix: 'Reset OneDrive sync' }
        ]
      }
    }
  ])

  const filteredZones = computed(() => {
    let filtered = zones.value

    if (filters.value.location !== 'all') {
      filtered = filtered.filter(zone => zone.type === 'location' && zone.id.includes(filters.value.location))
    }

    if (filters.value.department !== 'all') {
      filtered = filtered.filter(zone => zone.type === 'department' && zone.id.includes(filters.value.department))
    }

    if (filters.value.showProblemsOnly) {
      filtered = filtered.filter(zone => zone.score < 80)
    }

    return filtered
  })

  // Detect major trends/issues
  const majorAlerts = computed(() => {
    const alerts = []
    
    // Check for VPN issues in Sales team
    const salesZone = zones.value.find(z => z.id === 'sales-team')
    if (salesZone && salesZone.score < 50) {
      const vpnIssues = salesZone.issues.find(i => i.type === 'VPN')
      if (vpnIssues) {
        alerts.push({
          id: 'vpn-sales',
          type: 'critical',
          message: `VPN instability in Sales team – ${salesZone.devices} devices impacted`,
          zone: salesZone
        })
      }
    }

    // Check for Wi-Fi issues
    zones.value.forEach(zone => {
      const wifiIssue = zone.issues.find(i => i.type === 'Wi-Fi' && i.severity === 'high')
      if (wifiIssue) {
        alerts.push({
          id: `wifi-${zone.id}`,
          type: 'warning',
          message: `Wi-Fi connectivity issues in ${zone.name} – ${zone.devices} devices affected`,
          zone
        })
      }
    })

    return alerts
  })

  const getScoreColor = (score) => {
    if (score >= 85) return '#10b981' // Green
    if (score >= 70) return '#f59e0b' // Yellow/Amber
    if (score >= 50) return '#ef4444' // Red
    return '#dc2626' // Dark red
  }

  const getScoreLabel = (score) => {
    if (score >= 85) return 'Healthy'
    if (score >= 70) return 'Warning'
    if (score >= 50) return 'Critical'
    return 'Severe'
  }

  const fetchHeatmapData = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      // Data is already loaded in zones.value
    } catch (err) {
      error.value = 'Failed to load heatmap data'
    } finally {
      loading.value = false
    }
  }

  return {
    zones: filteredZones,
    filters,
    majorAlerts,
    loading,
    error,
    getScoreColor,
    getScoreLabel,
    fetchHeatmapData
  }
}