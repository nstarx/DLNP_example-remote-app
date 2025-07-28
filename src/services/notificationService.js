/**
 * Real-time Notification Service
 * Handles proactive alerts, push notifications, and real-time updates
 */

export class NotificationService {
  constructor() {
    this.subscribers = new Map()
    this.notificationQueue = []
    this.isProcessing = false
    this.settings = {
      maxQueueSize: 1000,
      batchSize: 10,
      processingInterval: 2000,
      retryAttempts: 3
    }
    this.initializeService()
  }

  initializeService() {
    // Start background processing
    this.startProcessing()
    
    // Setup WebSocket-like connection simulation
    this.setupRealTimeConnection()
    
    console.log('🔔 Notification Service initialized')
  }

  // Subscription Management
  subscribe(userId, callback, options = {}) {
    if (!this.subscribers.has(userId)) {
      this.subscribers.set(userId, [])
    }
    
    const subscription = {
      id: this.generateId(),
      callback,
      options: {
        roles: options.roles || ['all'],
        types: options.types || ['all'],
        priority: options.priority || ['low', 'medium', 'high'],
        realTime: options.realTime !== false
      },
      createdAt: new Date()
    }
    
    this.subscribers.get(userId).push(subscription)
    
    console.log(`✅ User ${userId} subscribed to notifications`)
    return subscription.id
  }

  unsubscribe(userId, subscriptionId = null) {
    if (!this.subscribers.has(userId)) return false
    
    if (subscriptionId) {
      const subscriptions = this.subscribers.get(userId)
      const index = subscriptions.findIndex(sub => sub.id === subscriptionId)
      if (index > -1) {
        subscriptions.splice(index, 1)
        return true
      }
    } else {
      this.subscribers.delete(userId)
      return true
    }
    
    return false
  }

  // Notification Creation
  createNotification(notification) {
    const fullNotification = {
      id: this.generateId(),
      timestamp: new Date(),
      read: false,
      delivered: false,
      retryCount: 0,
      ...notification,
      // Required fields validation
      userId: notification.userId || 'system',
      type: notification.type || 'info',
      priority: notification.priority || 'medium',
      title: notification.title || 'Notification',
      message: notification.message || ''
    }
    
    // Add to queue
    this.notificationQueue.push(fullNotification)
    
    // Immediate delivery for high priority
    if (fullNotification.priority === 'high' || fullNotification.realTime) {
      this.deliverImmediately(fullNotification)
    }
    
    return fullNotification.id
  }

  // AI-Generated Notifications
  async generateAINotifications(context) {
    const notifications = []
    
    // Fraud Detection Notifications
    if (context.fraudScore > 70) {
      notifications.push({
        type: 'alert',
        priority: 'high',
        category: 'fraud',
        title: 'High Fraud Risk Detected',
        message: `Suspicious activity detected with ${context.fraudScore}% confidence`,
        actionRequired: true,
        actions: [
          { id: 'review', label: 'Review Case', type: 'primary' },
          { id: 'block', label: 'Block Transaction', type: 'danger' }
        ],
        metadata: {
          caseId: context.caseId,
          amount: context.amount,
          location: context.location
        }
      })
    }
    
    // Customer Churn Notifications
    if (context.churnProbability > 0.7) {
      notifications.push({
        type: 'warning',  
        priority: 'high',
        category: 'churn',
        title: 'Customer Churn Risk',
        message: `Customer ${context.customerName} has ${Math.round(context.churnProbability * 100)}% churn probability`,
        actionRequired: true,
        actions: [
          { id: 'contact', label: 'Contact Customer', type: 'primary' },
          { id: 'offer', label: 'Send Retention Offer', type: 'secondary' }
        ],
        metadata: {
          customerId: context.customerId,
          riskFactors: context.riskFactors
        }
      })
    }
    
    // Claims Surge Notifications
    if (context.claimsSurge > 20) {
      notifications.push({
        type: 'info',
        priority: 'medium',
        category: 'operational',
        title: 'Claims Surge Predicted',
        message: `${context.claimsSurge}% increase in claims expected in ${context.region}`,
        actionRequired: true,
        actions: [
          { id: 'prepare', label: 'Prepare Resources', type: 'primary' },
          { id: 'notify_team', label: 'Notify Team', type: 'secondary' }
        ],
        metadata: {
          region: context.region,
          timeframe: context.timeframe,
          predictedIncrease: context.claimsSurge
        }
      })
    }
    
    // Compliance Notifications
    if (context.complianceGaps && context.complianceGaps.length > 0) {
      notifications.push({
        type: 'warning',
        priority: 'high',
        category: 'compliance',
        title: 'Compliance Gaps Detected',
        message: `${context.complianceGaps.length} compliance issues require attention`,
        actionRequired: true,
        actions: [
          { id: 'review_gaps', label: 'Review Gaps', type: 'primary' },
          { id: 'generate_report', label: 'Generate Report', type: 'secondary' }
        ],
        metadata: {
          gaps: context.complianceGaps,
          severity: context.complianceGaps.some(gap => gap.severity === 'HIGH') ? 'high' : 'medium'
        }
      })
    }
    
    // Revenue Opportunity Notifications
    if (context.revenueOpportunity > 1000) {
      notifications.push({
        type: 'success',
        priority: 'medium',
        category: 'opportunity',
        title: 'Revenue Opportunity Identified', 
        message: `Potential revenue of $${context.revenueOpportunity.toLocaleString()} identified`,
        actionRequired: false,
        actions: [
          { id: 'explore', label: 'Explore Opportunity', type: 'primary' }
        ],
        metadata: {
          amount: context.revenueOpportunity,
          source: context.opportunitySource
        }
      })
    }
    
    return notifications
  }

  // Role-Based Notification Routing
  routeNotificationByRole(notification) {
    const roleRouting = {
      fraud: ['executive', 'underwriter', 'agent'],
      churn: ['executive', 'agent'],
      operational: ['executive', 'agent', 'underwriter'],
      compliance: ['executive', 'underwriter'],
      opportunity: ['executive', 'agent'],
      customer: ['customer']
    }
    
    const targetRoles = roleRouting[notification.category] || ['all']
    
    // Create role-specific notifications
    return targetRoles.map(role => ({
      ...notification,
      targetRole: role,
      userId: notification.userId || `role_${role}`,
      priority: this.adjustPriorityByRole(notification.priority, role, notification.category)
    }))
  }

  adjustPriorityByRole(basePriority, role, category) {
    const adjustments = {
      executive: {
        fraud: 'high',
        compliance: 'high',
        operational: 'high'
      },
      underwriter: {
        fraud: 'high',
        compliance: 'high'
      },
      agent: {
        churn: 'high',
        opportunity: 'medium'
      },
      customer: {
        customer: 'medium'
      }
    }
    
    return adjustments[role]?.[category] || basePriority
  }

  // Delivery Methods
  async deliverImmediately(notification) {
    const targetSubscribers = this.getTargetSubscribers(notification)
    
    for (const subscriber of targetSubscribers) {
      try {
        await subscriber.callback(notification)
        notification.delivered = true
        this.trackDelivery(notification, subscriber, 'success')
      } catch (error) {
        this.trackDelivery(notification, subscriber, 'error', error.message)
        console.error(`Failed to deliver notification to ${subscriber.id}:`, error)
      }
    }
  }

  getTargetSubscribers(notification) {
    const subscribers = []
    
    for (const [userId, userSubscriptions] of this.subscribers.entries()) {
      // Check if notification targets this user or role
      if (notification.userId !== userId && 
          notification.targetRole && 
          !this.userHasRole(userId, notification.targetRole)) {
        continue
      }
      
      for (const subscription of userSubscriptions) {
        if (this.matchesSubscription(notification, subscription)) {
          subscribers.push({ ...subscription, userId })
        }
      }
    }
    
    return subscribers
  }

  matchesSubscription(notification, subscription) {
    const { options } = subscription
    
    // Check role filter
    if (!options.roles.includes('all') && 
        !options.roles.includes(notification.targetRole)) {
      return false
    }
    
    // Check type filter
    if (!options.types.includes('all') && 
        !options.types.includes(notification.type)) {
      return false
    }
    
    // Check priority filter
    if (!options.priority.includes(notification.priority)) {
      return false
    }
    
    return true
  }

  userHasRole(userId, targetRole) {
    // In a real application, this would check user roles from auth service
    return true // Mock implementation
  }

  // Background Processing
  startProcessing() {
    setInterval(() => {
      if (!this.isProcessing && this.notificationQueue.length > 0) {
        this.processQueue()
      }
    }, this.settings.processingInterval)
  }

  async processQueue() {
    if (this.isProcessing) return
    
    this.isProcessing = true
    
    try {
      const batch = this.notificationQueue.splice(0, this.settings.batchSize)
      
      for (const notification of batch) {
        if (!notification.delivered && notification.retryCount < this.settings.retryAttempts) {
          await this.deliverImmediately(notification)
          
          if (!notification.delivered) {
            notification.retryCount++
            if (notification.retryCount < this.settings.retryAttempts) {
              this.notificationQueue.push(notification) // Retry later
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing notification queue:', error)
    } finally {
      this.isProcessing = false
    }
  }

  // Real-time Connection Simulation
  setupRealTimeConnection() {
    // Simulate real-time events
    setInterval(() => {
      this.simulateRealTimeEvents()
    }, 5000) // Every 5 seconds
  }

  simulateRealTimeEvents() {
    const events = [
      {
        type: 'info',
        category: 'system',
        title: 'System Health Check',
        message: 'All systems operating normally',
        priority: 'low'
      },
      {
        type: 'warning',
        category: 'fraud',
        title: 'Elevated Fraud Activity',
        message: 'Fraud detection algorithms show increased activity',
        priority: 'medium'
      },
      {
        type: 'success',
        category: 'opportunity',
        title: 'New Cross-sell Opportunity',
        message: 'AI identified potential for policy upsell',
        priority: 'medium'
      }
    ]
    
    if (Math.random() > 0.7) { // 30% chance
      const randomEvent = events[Math.floor(Math.random() * events.length)]
      this.createNotification({
        ...randomEvent,
        userId: 'system',
        realTime: true
      })
    }
  }

  // Analytics and Tracking
  trackDelivery(notification, subscriber, status, error = null) {
    const tracking = {
      notificationId: notification.id,
      subscriberId: subscriber.id,
      userId: subscriber.userId,
      status,
      error,
      timestamp: new Date(),
      deliveryTime: Date.now() - notification.timestamp.getTime()
    }
    
    // In production, this would be sent to analytics service
    console.log('📊 Notification tracking:', tracking)
  }

  getAnalytics(timeframe = '24h') {
    // Mock analytics data
    return {
      timeframe,
      totalNotifications: Math.floor(Math.random() * 500) + 100,
      deliveryRate: 95 + Math.random() * 5,
      avgDeliveryTime: Math.floor(Math.random() * 1000) + 200,
      notificationsByType: {
        alert: Math.floor(Math.random() * 50) + 10,
        warning: Math.floor(Math.random() * 80) + 20,
        info: Math.floor(Math.random() * 200) + 50,
        success: Math.floor(Math.random() * 30) + 5
      },
      notificationsByPriority: {
        high: Math.floor(Math.random() * 40) + 10,
        medium: Math.floor(Math.random() * 150) + 50,
        low: Math.floor(Math.random() * 100) + 30
      }
    }
  }

  // Utility Methods
  generateId() {
    return 'notif_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
  }

  // Notification Templates
  getTemplate(type, data) {
    const templates = {
      fraud_alert: {
        title: 'Fraud Alert',
        message: `High-risk transaction detected: $${data.amount}`,
        type: 'alert',
        priority: 'high',
        actions: [
          { id: 'review', label: 'Review', type: 'primary' },
          { id: 'block', label: 'Block', type: 'danger' }
        ]
      },
      churn_warning: {
        title: 'Customer Churn Risk',
        message: `Customer ${data.customerName} at risk of churning`,
        type: 'warning',
        priority: 'high',
        actions: [
          { id: 'contact', label: 'Contact', type: 'primary' }
        ]
      },
      opportunity_identified: {
        title: 'Opportunity Identified',
        message: `Revenue opportunity: $${data.amount}`,
        type: 'success',
        priority: 'medium',
        actions: [
          { id: 'explore', label: 'Explore', type: 'primary' }
        ]
      }
    }
    
    return templates[type] || templates.default
  }

  // Batch Operations
  createBulkNotifications(notifications) {
    return notifications.map(notification => this.createNotification(notification))
  }

  // Settings Management
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings }
    console.log('⚙️ Notification settings updated:', this.settings)
  }

  getSettings() {
    return { ...this.settings }
  }
}

// Singleton instance
export const notificationService = new NotificationService()

// Notification Types enum
export const NotificationTypes = {
  ALERT: 'alert',
  WARNING: 'warning', 
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error'
}

// Priority levels
export const NotificationPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

// Categories
export const NotificationCategories = {
  FRAUD: 'fraud',
  CHURN: 'churn',
  OPERATIONAL: 'operational',
  COMPLIANCE: 'compliance',
  OPPORTUNITY: 'opportunity',
  CUSTOMER: 'customer',
  SYSTEM: 'system'
}