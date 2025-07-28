/**
 * Performance Optimization and Cost Management Utilities
 * Provides intelligent caching, lazy loading, and cost-effective data management
 */

export class PerformanceOptimizer {
  constructor() {
    this.cache = new Map()
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      apiCalls: 0,
      avgResponseTime: 0,
      dataTransfer: 0
    }
    this.settings = {
      maxCacheSize: 1000,
      defaultTTL: 300000, // 5 minutes
      compressionEnabled: true,
      batchingEnabled: true,
      lazyLoadingEnabled: true
    }
    this.costTracking = {
      aiApiCalls: 0,
      dataStorage: 0,
      bandwidth: 0,
      compute: 0
    }
    this.initializeOptimizer()
  }

  initializeOptimizer() {
    // Setup cache cleanup
    this.setupCacheCleanup()
    
    // Initialize compression
    if (this.settings.compressionEnabled) {
      this.initializeCompression()
    }
    
    // Setup performance monitoring
    this.setupPerformanceMonitoring()
    
    console.log('⚡ Performance Optimizer initialized')
  }

  // Intelligent Caching System
  async get(key, fetcher, options = {}) {
    const cacheKey = this.generateCacheKey(key, options)
    const cached = this.cache.get(cacheKey)
    
    if (cached && !this.isExpired(cached)) {
      this.metrics.cacheHits++
      console.log(`🎯 Cache hit for ${key}`)
      return this.decompress(cached.data)
    }
    
    this.metrics.cacheMisses++
    console.log(`⏳ Cache miss for ${key}, fetching...`)
    
    const startTime = Date.now()
    
    try {
      const data = await fetcher()
      const responseTime = Date.now() - startTime
      
      // Update metrics
      this.updateMetrics(responseTime, JSON.stringify(data).length)
      
      // Cache the result
      this.set(cacheKey, data, options.ttl)
      
      return data
    } catch (error) {
      console.error(`❌ Failed to fetch ${key}:`, error)
      throw error
    }
  }

  set(key, data, ttl = null) {
    const actualTTL = ttl || this.settings.defaultTTL
    const compressedData = this.compress(data)
    
    const cacheEntry = {
      data: compressedData,
      timestamp: Date.now(),
      ttl: actualTTL,
      size: JSON.stringify(data).length,
      compressed: this.settings.compressionEnabled
    }
    
    // Check cache size limit
    if (this.cache.size >= this.settings.maxCacheSize) {
      this.evictOldestEntries(Math.floor(this.settings.maxCacheSize * 0.1))
    }
    
    this.cache.set(key, cacheEntry)
    console.log(`💾 Cached ${key} (${cacheEntry.size} bytes, TTL: ${actualTTL}ms)`)
  }

  invalidate(pattern) {
    let count = 0
    
    if (typeof pattern === 'string') {
      // Exact match
      if (this.cache.delete(pattern)) {
        count = 1
      }
    } else if (pattern instanceof RegExp) {
      // Pattern match
      for (const key of this.cache.keys()) {
        if (pattern.test(key)) {
          this.cache.delete(key)
          count++
        }
      }
    }
    
    console.log(`🗑️ Invalidated ${count} cache entries`)
    return count
  }

  // Compression utilities
  compress(data) {
    if (!this.settings.compressionEnabled) return data
    
    try {
      // Simple mock compression (in production, use actual compression libraries)
      const jsonString = JSON.stringify(data)
      const compressed = {
        compressed: true,
        data: jsonString,
        originalSize: jsonString.length,
        compressedSize: Math.floor(jsonString.length * 0.7) // Mock 30% compression
      }
      return compressed
    } catch (error) {
      console.warn('Compression failed, storing uncompressed:', error)
      return data
    }
  }

  decompress(data) {
    if (!data || !data.compressed) return data
    
    try {
      return JSON.parse(data.data)
    } catch (error) {
      console.warn('Decompression failed:', error)
      return data
    }
  }

  // Batch Processing for Cost Efficiency
  createBatchProcessor(processorFn, options = {}) {
    const batchSize = options.batchSize || 10
    const maxWaitTime = options.maxWaitTime || 1000
    const maxRetries = options.maxRetries || 3
    
    let batch = []
    let timer = null
    
    return {
      add: (item) => {
        return new Promise((resolve, reject) => {
          batch.push({ item, resolve, reject, retries: 0 })
          
          if (batch.length >= batchSize) {
            this.processBatch(batch, processorFn, maxRetries)
            batch = []
            if (timer) {
              clearTimeout(timer)
              timer = null
            }
          } else if (!timer) {
            timer = setTimeout(() => {
              if (batch.length > 0) {
                this.processBatch(batch, processorFn, maxRetries)
                batch = []
              }
              timer = null
            }, maxWaitTime)
          }
        })
      },
      flush: () => {
        if (batch.length > 0) {
          this.processBatch(batch, processorFn, maxRetries)
          batch = []
          if (timer) {
            clearTimeout(timer)
            timer = null
          }
        }
      }
    }
  }

  async processBatch(batch, processorFn, maxRetries) {
    const startTime = Date.now()
    console.log(`🔄 Processing batch of ${batch.length} items`)
    
    try {
      const items = batch.map(b => b.item)
      const results = await processorFn(items)
      
      // Resolve all promises
      batch.forEach((batchItem, index) => {
        batchItem.resolve(results[index])
      })
      
      // Track cost savings
      this.trackBatchSavings(batch.length, Date.now() - startTime)
      
    } catch (error) {
      console.error('Batch processing failed:', error)
      
      // Retry logic
      const retryableBatch = batch.filter(b => b.retries < maxRetries)
      const failedBatch = batch.filter(b => b.retries >= maxRetries)
      
      // Increment retries and reprocess
      retryableBatch.forEach(b => b.retries++)
      if (retryableBatch.length > 0) {
        setTimeout(() => {
          this.processBatch(retryableBatch, processorFn, maxRetries)
        }, 1000 * Math.pow(2, retryableBatch[0].retries)) // Exponential backoff
      }
      
      // Reject failed items
      failedBatch.forEach(b => b.reject(error))
    }
  }

  // Lazy Loading Utilities
  createLazyLoader(dataFetcher, options = {}) {
    const pageSize = options.pageSize || 20
    const preloadPages = options.preloadPages || 1
    
    let currentPage = 0
    let totalPages = null
    let loading = false
    let cache = new Map()
    
    return {
      async loadPage(page = 0) {
        if (cache.has(page)) {
          return cache.get(page)
        }
        
        if (loading) {
          // Wait for current load to complete
          await new Promise(resolve => {
            const checkLoading = () => {
              if (!loading) {
                resolve()
              } else {
                setTimeout(checkLoading, 100)
              }
            }
            checkLoading()
          })
          
          if (cache.has(page)) {
            return cache.get(page)
          }
        }
        
        loading = true
        
        try {
          const result = await dataFetcher({
            page,
            pageSize,
            offset: page * pageSize
          })
          
          cache.set(page, result)
          
          if (totalPages === null && result.total) {
            totalPages = Math.ceil(result.total / pageSize)
          }
          
          // Preload next pages
          if (preloadPages > 0) {
            this.preloadPages(page, preloadPages, dataFetcher, pageSize, cache)
          }
          
          return result
          
        } finally {
          loading = false
        }
      },
      
      async loadNext() {
        currentPage++
        return await this.loadPage(currentPage)
      },
      
      hasMore() {
        return totalPages === null || currentPage < totalPages - 1
      },
      
      reset() {
        currentPage = 0
        totalPages = null
        cache.clear()
      }
    }
  }

  async preloadPages(currentPage, preloadPages, dataFetcher, pageSize, cache) {
    const preloadPromises = []
    
    for (let i = 1; i <= preloadPages; i++) {
      const nextPage = currentPage + i
      if (!cache.has(nextPage)) {
        preloadPromises.push(
          dataFetcher({
            page: nextPage,
            pageSize,
            offset: nextPage * pageSize
          }).then(result => {
            cache.set(nextPage, result)
            console.log(`📦 Preloaded page ${nextPage}`)
          }).catch(error => {
            console.warn(`Failed to preload page ${nextPage}:`, error)
          })
        )
      }
    }
    
    if (preloadPromises.length > 0) {
      await Promise.allSettled(preloadPromises)
    }
  }

  // Cost Tracking and Optimization
  trackCost(service, operation, cost, metadata = {}) {
    const costEntry = {
      service,
      operation,
      cost,
      metadata,
      timestamp: Date.now()
    }
    
    // Update cost tracking
    if (service === 'ai') {
      this.costTracking.aiApiCalls += cost
    } else if (service === 'storage') {
      this.costTracking.dataStorage += cost
    } else if (service === 'bandwidth') {
      this.costTracking.bandwidth += cost
    } else if (service === 'compute') {
      this.costTracking.compute += cost
    }
    
    console.log(`💰 Cost tracked: ${service}.${operation} = $${cost}`)
    
    // Alert if costs exceed thresholds
    this.checkCostThresholds()
  }

  getCostAnalysis(timeframe = '24h') {
    const total = Object.values(this.costTracking).reduce((sum, cost) => sum + cost, 0)
    
    return {
      timeframe,
      totalCost: total,
      breakdown: { ...this.costTracking },
      projectedMonthlyCost: total * 30, // Simple projection
      recommendations: this.generateCostRecommendations(),
      savings: this.calculateSavings()
    }
  }

  generateCostRecommendations() {
    const recommendations = []
    
    if (this.costTracking.aiApiCalls > 100) {
      recommendations.push({
        type: 'ai_optimization',
        message: 'Consider batching AI API calls to reduce costs',
        potentialSavings: this.costTracking.aiApiCalls * 0.3
      })
    }
    
    if (this.costTracking.dataStorage > 50) {
      recommendations.push({
        type: 'storage_optimization',
        message: 'Archive old data to cheaper storage tiers',
        potentialSavings: this.costTracking.dataStorage * 0.4
      })
    }
    
    if (this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) < 0.5) {
      recommendations.push({
        type: 'cache_optimization',
        message: 'Improve cache hit rate to reduce API calls',
        potentialSavings: this.costTracking.aiApiCalls * 0.5
      })
    }
    
    if (this.costTracking.bandwidth > 25) {
      recommendations.push({
        type: 'compression',
        message: 'Enable compression to reduce bandwidth costs',
        potentialSavings: this.costTracking.bandwidth * 0.3
      })
    }
    
    return recommendations
  }

  // Performance Monitoring
  setupPerformanceMonitoring() {
    // Monitor performance every minute
    setInterval(() => {
      this.collectPerformanceMetrics()
    }, 60000)
  }

  collectPerformanceMetrics() {
    const cacheHitRate = this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) || 0
    const cacheSize = this.cache.size
    const memoryUsage = this.estimateMemoryUsage()
    
    const metrics = {
      cacheHitRate: Math.round(cacheHitRate * 100),
      cacheSize,
      memoryUsage,
      avgResponseTime: this.metrics.avgResponseTime,
      totalApiCalls: this.metrics.apiCalls,
      dataTransfer: this.metrics.dataTransfer
    }
    
    console.log('📊 Performance metrics:', metrics)
    
    // Auto-optimize based on metrics
    this.autoOptimize(metrics)
    
    return metrics
  }

  autoOptimize(metrics) {
    // Auto-clear cache if memory usage is high
    if (metrics.memoryUsage > 100 * 1024 * 1024) { // 100MB
      console.log('🧹 Auto-clearing cache due to high memory usage')
      this.clearOldCache(0.5) // Clear 50% of cache
    }
    
    // Adjust cache TTL based on hit rate
    if (metrics.cacheHitRate < 30) {
      this.settings.defaultTTL = Math.min(this.settings.defaultTTL * 1.2, 600000) // Max 10 minutes
      console.log(`⏰ Increased cache TTL to ${this.settings.defaultTTL}ms`)
    } else if (metrics.cacheHitRate > 80) {
      this.settings.defaultTTL = Math.max(this.settings.defaultTTL * 0.9, 60000) // Min 1 minute
      console.log(`⏰ Decreased cache TTL to ${this.settings.defaultTTL}ms`)
    }
  }

  // Utility Methods
  generateCacheKey(key, options) {
    const keyParts = [key]
    
    if (options.userId) keyParts.push(`user:${options.userId}`)
    if (options.role) keyParts.push(`role:${options.role}`)
    if (options.timeframe) keyParts.push(`time:${options.timeframe}`)
    if (options.filters) keyParts.push(`filters:${JSON.stringify(options.filters)}`)
    
    return keyParts.join('|')
  }

  isExpired(cacheEntry) {
    return Date.now() - cacheEntry.timestamp > cacheEntry.ttl
  }

  evictOldestEntries(count) {
    const entries = Array.from(this.cache.entries())
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
    
    for (let i = 0; i < count && i < entries.length; i++) {
      this.cache.delete(entries[i][0])
    }
    
    console.log(`🗑️ Evicted ${count} oldest cache entries`)
  }

  clearOldCache(percentage) {
    const totalSize = this.cache.size
    const clearCount = Math.floor(totalSize * percentage)
    this.evictOldestEntries(clearCount)
  }

  setupCacheCleanup() {
    // Clean expired entries every 5 minutes
    setInterval(() => {
      let cleaned = 0
      for (const [key, entry] of this.cache.entries()) {
        if (this.isExpired(entry)) {
          this.cache.delete(key)
          cleaned++
        }
      }
      if (cleaned > 0) {
        console.log(`🧹 Cleaned ${cleaned} expired cache entries`)
      }
    }, 300000) // 5 minutes
  }

  updateMetrics(responseTime, dataSize) {
    this.metrics.apiCalls++
    this.metrics.dataTransfer += dataSize
    
    // Calculate running average response time
    this.metrics.avgResponseTime = 
      (this.metrics.avgResponseTime * (this.metrics.apiCalls - 1) + responseTime) / this.metrics.apiCalls
  }

  estimateMemoryUsage() {
    let totalSize = 0
    for (const entry of this.cache.values()) {
      totalSize += entry.size
    }
    return totalSize
  }

  trackBatchSavings(batchSize, processingTime) {
    const estimatedIndividualTime = processingTime * batchSize
    const timeSaved = estimatedIndividualTime - processingTime
    const costSaved = (timeSaved / 1000) * 0.001 // Mock cost calculation
    
    console.log(`💰 Batch processing saved ${timeSaved}ms and $${costSaved.toFixed(4)}`)
  }

  calculateSavings() {
    const cacheHitRate = this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) || 0
    const apiCallsSaved = this.metrics.cacheHits
    const estimatedCostPerCall = 0.001
    const cacheSavings = apiCallsSaved * estimatedCostPerCall
    
    return {
      apiCallsSaved,
      cacheSavings,
      cacheHitRate: Math.round(cacheHitRate * 100),
      totalSavings: cacheSavings
    }
  }

  checkCostThresholds() {
    const total = Object.values(this.costTracking).reduce((sum, cost) => sum + cost, 0)
    const dailyThreshold = 100 // $100 per day
    
    if (total > dailyThreshold) {
      console.warn(`⚠️ Daily cost threshold exceeded: $${total} > $${dailyThreshold}`)
      // In production, this would trigger alerts
    }
  }

  initializeCompression() {
    console.log('🗜️ Compression enabled for data optimization')
  }

  // Public API
  getMetrics() {
    return {
      ...this.metrics,
      cacheSize: this.cache.size,
      cacheHitRate: Math.round((this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) || 0) * 100),
      memoryUsage: this.estimateMemoryUsage()
    }
  }

  getSettings() {
    return { ...this.settings }
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings }
    console.log('⚙️ Performance settings updated:', this.settings)
  }
}

// Singleton instance
export const performanceOptimizer = new PerformanceOptimizer()

// Decorator for automatic caching
export function cached(ttl = 300000) {
  return function(target, propertyName, descriptor) {
    const method = descriptor.value
    
    descriptor.value = async function(...args) {
      const cacheKey = `${target.constructor.name}.${propertyName}:${JSON.stringify(args)}`
      
      return performanceOptimizer.get(
        cacheKey,
        () => method.apply(this, args),
        { ttl }
      )
    }
    
    return descriptor
  }
}

// Utility functions
export const memoize = (fn, ttl = 300000) => {
  const cache = new Map()
  
  return (...args) => {
    const key = JSON.stringify(args)
    const cached = cache.get(key)
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.value
    }
    
    const result = fn(...args)
    cache.set(key, { value: result, timestamp: Date.now() })
    
    return result
  }
}

export const debounce = (fn, delay) => {
  let timeoutId
  
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export const throttle = (fn, limit) => {
  let inThrottle
  
  return (...args) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}