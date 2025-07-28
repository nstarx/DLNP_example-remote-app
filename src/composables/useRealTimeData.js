import { ref, reactive, onUnmounted } from 'vue'

// Mock WebSocket connection for real-time data
class MockWebSocket {
  constructor(url) {
    this.url = url
    this.readyState = WebSocket.CONNECTING
    this.onopen = null
    this.onmessage = null
    this.onerror = null
    this.onclose = null
    
    // Simulate connection
    setTimeout(() => {
      this.readyState = WebSocket.OPEN
      if (this.onopen) this.onopen({ type: 'open' })
      this.startDataStream()
    }, 1000)
  }
  
  startDataStream() {
    // Simulate real-time data updates
    this.dataInterval = setInterval(() => {
      if (this.readyState === WebSocket.OPEN && this.onmessage) {
        const mockData = this.generateMockData()
        this.onmessage({
          type: 'message',
          data: JSON.stringify(mockData)
        })
      }
    }, 5000) // Send data every 5 seconds
  }
  
  generateMockData() {
    const dataTypes = [
      'kpi_update',
      'new_alert',
      'system_status',
      'forecast_update',
      'performance_metric'
    ]
    
    const type = dataTypes[Math.floor(Math.random() * dataTypes.length)]
    
    switch (type) {
      case 'kpi_update':
        return {
          type: 'kpi_update',
          kpiId: ['claims-processing-time', 'first-call-resolution', 'customer-satisfaction'][Math.floor(Math.random() * 3)],
          value: Math.random() * 100,
          change: (Math.random() * 10 - 5).toFixed(1),
          timestamp: new Date().toISOString()
        }
        
      case 'new_alert':
        return {
          type: 'new_alert',
          alert: {
            id: `rt-alert-${Date.now()}`,
            title: [
              'Processing Queue Backlog Detected',
              'Customer Wait Time Exceeded',
              'System Response Time Degraded',
              'Unusual Claim Pattern Identified'
            ][Math.floor(Math.random() * 4)],
            severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
            timestamp: new Date().toISOString(),
            source: 'Real-time Monitoring'
          }
        }
        
      case 'system_status':
        return {
          type: 'system_status',
          status: Math.random() > 0.1 ? 'operational' : (Math.random() > 0.5 ? 'warning' : 'critical'),
          message: [
            'All systems operational',
            'Minor performance degradation detected',
            'System maintenance in progress',
            'High load detected - scaling resources'
          ][Math.floor(Math.random() * 4)],
          timestamp: new Date().toISOString()
        }
        
      case 'forecast_update':
        return {
          type: 'forecast_update',
          forecast: 'claims',
          newValue: Math.floor(2800 + Math.random() * 400),
          confidence: 0.8 + Math.random() * 0.15,
          timestamp: new Date().toISOString()
        }
        
      case 'performance_metric':
        return {
          type: 'performance_metric',
          metric: 'claims_processed_today',
          value: Math.floor(2800 + Math.random() * 200),
          target: 3000,
          timestamp: new Date().toISOString()
        }
        
      default:
        return {
          type: 'heartbeat',
          timestamp: new Date().toISOString()
        }
    }
  }
  
  send(data) {
    console.log('WebSocket send:', data)
  }
  
  close() {
    this.readyState = WebSocket.CLOSED
    if (this.dataInterval) {
      clearInterval(this.dataInterval)
    }
    if (this.onclose) this.onclose({ type: 'close' })
  }
}

export function useRealTimeData() {
  // State
  const isConnected = ref(false)
  const connectionStatus = ref('disconnected') // disconnected, connecting, connected, error
  const lastUpdate = ref(null)
  const realTimeMetrics = reactive({
    claimsProcessedToday: 2847,
    currentProcessingTime: 4.2,
    activeUsers: 127,
    systemLoad: 0.68,
    errorRate: 0.02
  })
  
  // Connection management
  let websocket = null
  let reconnectInterval = null
  let reconnectAttempts = 0
  const maxReconnectAttempts = 5
  const reconnectDelay = 5000
  
  // Event listeners
  const eventListeners = reactive({
    kpiUpdate: [],
    newAlert: [],
    systemStatus: [],
    forecastUpdate: [],
    performanceMetric: []
  })
  
  // Methods
  const connect = async () => {
    if (isConnected.value) return
    
    connectionStatus.value = 'connecting'
    
    try {
      // In production, this would be a real WebSocket URL
      websocket = new MockWebSocket('wss://api.kemper.com/realtime')
      
      websocket.onopen = (event) => {
        console.log('Real-time connection established')
        isConnected.value = true
        connectionStatus.value = 'connected'
        reconnectAttempts = 0
        lastUpdate.value = new Date()
        
        // Send authentication and subscription messages
        websocket.send(JSON.stringify({
          type: 'authenticate',
          token: 'dashboard-token'
        }))
        
        websocket.send(JSON.stringify({
          type: 'subscribe',
          channels: [
            'kpi-updates',
            'alerts',
            'system-status',
            'forecasts',
            'performance-metrics'
          ]
        }))
      }
      
      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          handleRealTimeData(data)
          lastUpdate.value = new Date()
        } catch (error) {
          console.error('Error parsing real-time data:', error)
        }
      }
      
      websocket.onerror = (error) => {
        console.error('WebSocket error:', error)
        connectionStatus.value = 'error'
        scheduleReconnect()
      }
      
      websocket.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason)
        isConnected.value = false
        connectionStatus.value = 'disconnected'
        
        if (reconnectAttempts < maxReconnectAttempts) {
          scheduleReconnect()
        }
      }
      
    } catch (error) {
      console.error('Failed to establish real-time connection:', error)
      connectionStatus.value = 'error'
      scheduleReconnect()
    }
  }
  
  const disconnect = () => {
    if (websocket) {
      websocket.close()
      websocket = null
    }
    
    if (reconnectInterval) {
      clearInterval(reconnectInterval)
      reconnectInterval = null
    }
    
    isConnected.value = false
    connectionStatus.value = 'disconnected'
    reconnectAttempts = 0
  }
  
  const scheduleReconnect = () => {
    if (reconnectInterval) return
    
    reconnectAttempts++
    
    if (reconnectAttempts <= maxReconnectAttempts) {
      const delay = reconnectDelay * Math.pow(2, reconnectAttempts - 1) // Exponential backoff
      
      console.log(`Scheduling reconnect attempt ${reconnectAttempts} in ${delay}ms`)
      
      reconnectInterval = setTimeout(() => {
        reconnectInterval = null
        connect()
      }, delay)
    } else {
      console.error('Max reconnection attempts reached')
      connectionStatus.value = 'error'
    }
  }
  
  const handleRealTimeData = (data) => {
    switch (data.type) {
      case 'kpi_update':
        handleKPIUpdate(data)
        break
        
      case 'new_alert':
        handleNewAlert(data.alert)
        break
        
      case 'system_status':
        handleSystemStatusUpdate(data)
        break
        
      case 'forecast_update':
        handleForecastUpdate(data)
        break
        
      case 'performance_metric':
        handlePerformanceMetricUpdate(data)
        break
        
      case 'heartbeat':
        // Update last ping time
        lastUpdate.value = new Date()
        break
        
      default:
        console.log('Unknown real-time data type:', data.type)
    }
  }
  
  const handleKPIUpdate = (data) => {
    // Emit event for KPI updates
    eventListeners.kpiUpdate.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error('Error in KPI update callback:', error)
      }
    })
  }
  
  const handleNewAlert = (alert) => {
    // Emit event for new alerts
    eventListeners.newAlert.forEach(callback => {
      try {
        callback(alert)
      } catch (error) {
        console.error('Error in new alert callback:', error)
      }
    })
  }
  
  const handleSystemStatusUpdate = (data) => {
    // Update system status
    eventListeners.systemStatus.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error('Error in system status callback:', error)
      }
    })
  }
  
  const handleForecastUpdate = (data) => {
    // Update forecast data
    eventListeners.forecastUpdate.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error('Error in forecast update callback:', error)
      }
    })
  }
  
  const handlePerformanceMetricUpdate = (data) => {
    // Update performance metrics
    switch (data.metric) {
      case 'claims_processed_today':
        realTimeMetrics.claimsProcessedToday = data.value
        break
      case 'processing_time':
        realTimeMetrics.currentProcessingTime = data.value
        break
      case 'active_users':
        realTimeMetrics.activeUsers = data.value
        break
      case 'system_load':
        realTimeMetrics.systemLoad = data.value
        break
      case 'error_rate':
        realTimeMetrics.errorRate = data.value
        break
    }
    
    eventListeners.performanceMetric.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error('Error in performance metric callback:', error)
      }
    })
  }
  
  // Event subscription methods
  const onKPIUpdate = (callback) => {
    eventListeners.kpiUpdate.push(callback)
    
    // Return unsubscribe function
    return () => {
      const index = eventListeners.kpiUpdate.indexOf(callback)
      if (index > -1) {
        eventListeners.kpiUpdate.splice(index, 1)
      }
    }
  }
  
  const onNewAlert = (callback) => {
    eventListeners.newAlert.push(callback)
    
    return () => {
      const index = eventListeners.newAlert.indexOf(callback)
      if (index > -1) {
        eventListeners.newAlert.splice(index, 1)
      }
    }
  }
  
  const onSystemStatus = (callback) => {
    eventListeners.systemStatus.push(callback)
    
    return () => {
      const index = eventListeners.systemStatus.indexOf(callback)
      if (index > -1) {
        eventListeners.systemStatus.splice(index, 1)
      }
    }
  }
  
  const onForecastUpdate = (callback) => {
    eventListeners.forecastUpdate.push(callback)
    
    return () => {
      const index = eventListeners.forecastUpdate.indexOf(callback)
      if (index > -1) {
        eventListeners.forecastUpdate.splice(index, 1)
      }
    }
  }
  
  const onPerformanceMetric = (callback) => {
    eventListeners.performanceMetric.push(callback)
    
    return () => {
      const index = eventListeners.performanceMetric.indexOf(callback)
      if (index > -1) {
        eventListeners.performanceMetric.splice(index, 1)
      }
    }
  }
  
  // Send real-time commands
  const sendCommand = (command, data = {}) => {
    if (isConnected.value && websocket) {
      websocket.send(JSON.stringify({
        type: 'command',
        command,
        data,
        timestamp: new Date().toISOString()
      }))
    } else {
      console.warn('Cannot send command: not connected to real-time service')
    }
  }
  
  // Utility methods
  const getConnectionHealth = () => {
    const now = new Date()
    const timeSinceLastUpdate = lastUpdate.value ? now - lastUpdate.value : Infinity
    
    return {
      status: connectionStatus.value,
      connected: isConnected.value,
      lastUpdate: lastUpdate.value,
      timeSinceLastUpdate,
      reconnectAttempts,
      health: timeSinceLastUpdate < 30000 ? 'good' : (timeSinceLastUpdate < 60000 ? 'warning' : 'poor')
    }
  }
  
  const getRealtimeMetrics = () => {
    return { ...realTimeMetrics }
  }
  
  // Cleanup on unmount
  onUnmounted(() => {
    disconnect()
  })
  
  return {
    // State
    isConnected,
    connectionStatus,
    lastUpdate,
    realTimeMetrics,
    
    // Connection methods
    connect,
    disconnect,
    
    // Event subscription methods
    onKPIUpdate,
    onNewAlert,
    onSystemStatus,
    onForecastUpdate,
    onPerformanceMetric,
    
    // Utility methods
    sendCommand,
    getConnectionHealth,
    getRealtimeMetrics
  }
}