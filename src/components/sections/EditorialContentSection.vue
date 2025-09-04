<template>
  <div class="editorial-content-section">
    <div class="section-header">
      <h2 class="section-title">📝 Editorial Content Performance</h2>
      <p class="section-description">Track story performance, engagement, and editorial impact across all platforms</p>
    </div>

    <div class="content-grid">
      <!-- Top Performing Stories -->
      <div class="content-card large-card">
        <h3 class="card-title">🔥 Top Performing Stories</h3>
        <div class="story-list">
          <div 
            v-for="story in topStories" 
            :key="story.id"
            class="story-item"
          >
            <div class="story-main">
              <h4 class="story-headline">{{ story.headline }}</h4>
              <div class="story-meta">
                <span class="story-author">{{ story.author }}</span>
                <span class="story-desk">{{ story.desk }}</span>
                <span class="story-time">{{ story.publishTime }}</span>
              </div>
            </div>
            <div class="story-metrics">
              <div class="metric-item">
                <span class="metric-label">Views</span>
                <span class="metric-value">{{ formatNumber(story.views) }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Engagement</span>
                <span class="metric-value">{{ story.engagementRate }}%</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Shares</span>
                <span class="metric-value">{{ story.shares }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Real-Time Tracker -->
      <div class="content-card">
        <h3 class="card-title">⚡ Real-Time Story Tracker</h3>
        <div class="real-time-stats">
          <div class="rt-metric">
            <span class="rt-value">{{ realTimeData.liveViews }}</span>
            <span class="rt-label">Live Views</span>
          </div>
          <div class="rt-metric">
            <span class="rt-value">{{ realTimeData.breakingStories }}</span>
            <span class="rt-label">Breaking Stories</span>
          </div>
          <div class="rt-metric">
            <span class="rt-value">{{ realTimeData.pushNotifications }}</span>
            <span class="rt-label">Push Notifications</span>
          </div>
        </div>
        <div class="trending-topics">
          <h4 class="subsection-title">Trending Now</h4>
          <div class="topic-tags">
            <span 
              v-for="topic in realTimeData.trending" 
              :key="topic"
              class="topic-tag"
            >
              {{ topic }}
            </span>
          </div>
        </div>
      </div>

      <!-- Section Performance -->
      <div class="content-card">
        <h3 class="card-title">📊 Section/Beat Performance</h3>
        <div class="section-performance">
          <div 
            v-for="section in sectionPerformance" 
            :key="section.name"
            class="section-item"
          >
            <div class="section-info">
              <span class="section-name">{{ section.name }}</span>
              <div class="section-bar">
                <div 
                  class="section-fill"
                  :style="{ width: section.performance + '%' }"
                ></div>
              </div>
            </div>
            <div class="section-stats">
              <span class="section-views">{{ formatNumber(section.views) }}</span>
              <span class="section-change" :class="section.trend">
                {{ section.change > 0 ? '+' : '' }}{{ section.change }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Story Lifecycle -->
      <div class="content-card">
        <h3 class="card-title">🔄 Story Lifecycle</h3>
        <div class="lifecycle-overview">
          <div class="lifecycle-metric">
            <span class="lifecycle-value">{{ storyLifecycle.fresh }}</span>
            <span class="lifecycle-label">Fresh Stories</span>
            <span class="lifecycle-sublabel">&lt; 24h old</span>
          </div>
          <div class="lifecycle-metric">
            <span class="lifecycle-value">{{ storyLifecycle.active }}</span>
            <span class="lifecycle-label">Active Stories</span>
            <span class="lifecycle-sublabel">1-7 days old</span>
          </div>
          <div class="lifecycle-metric">
            <span class="lifecycle-value">{{ storyLifecycle.stale }}</span>
            <span class="lifecycle-label">Stale Stories</span>
            <span class="lifecycle-sublabel">&gt; 7 days old</span>
          </div>
        </div>
        <div class="repurposing-opportunities">
          <h4 class="subsection-title">Repurposing Opportunities</h4>
          <div class="repurpose-list">
            <div 
              v-for="opportunity in repurposingOpportunities" 
              :key="opportunity.id"
              class="repurpose-item"
            >
              <span class="repurpose-title">{{ opportunity.title }}</span>
              <span class="repurpose-type">{{ opportunity.type }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Platform Performance -->
      <div class="content-card wide-card">
        <h3 class="card-title">🌐 Cross-Platform Performance</h3>
        <div class="platform-grid">
          <div 
            v-for="platform in platformData" 
            :key="platform.name"
            class="platform-item"
          >
            <div class="platform-header">
              <span class="platform-icon">{{ platform.icon }}</span>
              <span class="platform-name">{{ platform.name }}</span>
            </div>
            <div class="platform-metrics">
              <div class="platform-metric">
                <span class="platform-metric-value">{{ formatNumber(platform.views) }}</span>
                <span class="platform-metric-label">Views</span>
              </div>
              <div class="platform-metric">
                <span class="platform-metric-value">{{ platform.engagement }}%</span>
                <span class="platform-metric-label">Engagement</span>
              </div>
              <div class="platform-metric">
                <span class="platform-metric-value">{{ formatTime(platform.dwellTime) }}</span>
                <span class="platform-metric-label">Dwell Time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  period: String,
  desk: String,
  publication: String
})

// Mock data - in real implementation, this would come from API calls
const topStories = ref([
  {
    id: 1,
    headline: "City Council Approves $2.5M Infrastructure Budget",
    author: "Sarah Johnson",
    desk: "Local",
    publishTime: "2 hours ago",
    views: 24567,
    engagementRate: 8.4,
    shares: 234
  },
  {
    id: 2,
    headline: "High School Football Championship Results",
    author: "Mike Rodriguez",
    desk: "Sports",
    publishTime: "4 hours ago",
    views: 18923,
    engagementRate: 12.1,
    shares: 456
  },
  {
    id: 3,
    headline: "Breaking: Major Tech Company Announces Local Expansion",
    author: "Jennifer Chen",
    desk: "Business",
    publishTime: "6 hours ago",
    views: 31245,
    engagementRate: 15.7,
    shares: 789
  }
])

const realTimeData = ref({
  liveViews: "2,347",
  breakingStories: 3,
  pushNotifications: 8,
  trending: ["City Budget", "Tech Jobs", "School Board", "Weather Alert", "Election Update"]
})

const sectionPerformance = ref([
  { name: "Politics", views: 125340, performance: 85, change: 12.4, trend: "positive" },
  { name: "Local News", views: 234560, performance: 92, change: 8.7, trend: "positive" },
  { name: "Sports", views: 98765, performance: 78, change: -3.2, trend: "negative" },
  { name: "Business", views: 87654, performance: 65, change: 15.8, trend: "positive" },
  { name: "Investigations", views: 56789, performance: 88, change: 22.1, trend: "positive" },
  { name: "Entertainment", views: 67890, performance: 55, change: -8.4, trend: "negative" }
])

const storyLifecycle = ref({
  fresh: 47,
  active: 156,
  stale: 289
})

const repurposingOpportunities = ref([
  { id: 1, title: "Budget Analysis Deep Dive", type: "Print → Digital Series" },
  { id: 2, title: "Sports Championship Recap", type: "Digital → Social Campaign" },
  { id: 3, title: "Tech Industry Impact", type: "Web → Newsletter Feature" }
])

const platformData = ref([
  {
    name: "Website",
    icon: "🌐",
    views: 456789,
    engagement: 6.8,
    dwellTime: 248
  },
  {
    name: "Mobile App",
    icon: "📱",
    views: 234567,
    engagement: 9.2,
    dwellTime: 312
  },
  {
    name: "Newsletter",
    icon: "📧",
    views: 89123,
    engagement: 24.5,
    dwellTime: 420
  },
  {
    name: "Social Media",
    icon: "📲",
    views: 567890,
    engagement: 4.3,
    dwellTime: 95
  }
])

// Utility functions
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

onMounted(() => {
  // Simulate real-time updates
  setInterval(() => {
    realTimeData.value.liveViews = (Math.floor(Math.random() * 1000) + 2000).toString()
  }, 5000)
})
</script>

<style scoped>
.editorial-content-section {
  padding: 0;
}

.section-header {
  margin-bottom: 32px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.section-description {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.content-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.large-card {
  grid-column: span 2;
}

.wide-card {
  grid-column: span 2;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
}

.story-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.story-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  background: #f9fafb;
  gap: 16px;
}

.story-main {
  flex: 1;
}

.story-headline {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.story-meta {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #6b7280;
}

.story-metrics {
  display: flex;
  gap: 16px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.metric-label {
  font-size: 12px;
  color: #6b7280;
}

.metric-value {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.real-time-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.rt-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px;
  background: #f3f4f6;
  border-radius: 8px;
}

.rt-value {
  font-size: 24px;
  font-weight: 700;
  color: #3b82f6;
}

.rt-label {
  font-size: 12px;
  color: #6b7280;
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
}

.topic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.topic-tag {
  padding: 4px 8px;
  background: #3b82f6;
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.section-performance {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.section-info {
  flex: 1;
}

.section-name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  display: block;
  margin-bottom: 8px;
}

.section-bar {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.section-fill {
  height: 100%;
  background: linear-gradient(to right, #3b82f6, #1d4ed8);
  transition: width 0.3s ease;
}

.section-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.section-views {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.section-change {
  font-size: 12px;
  font-weight: 500;
}

.section-change.positive {
  color: #10b981;
}

.section-change.negative {
  color: #ef4444;
}

.lifecycle-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.lifecycle-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.lifecycle-value {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
}

.lifecycle-label {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.lifecycle-sublabel {
  font-size: 12px;
  color: #6b7280;
}

.repurpose-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.repurpose-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 6px;
}

.repurpose-title {
  font-size: 14px;
  color: #111827;
  font-weight: 500;
}

.repurpose-type {
  font-size: 12px;
  color: #6b7280;
  background: #e5e7eb;
  padding: 4px 8px;
  border-radius: 4px;
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.platform-item {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.platform-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.platform-icon {
  font-size: 20px;
}

.platform-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.platform-metrics {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.platform-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.platform-metric-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.platform-metric-label {
  font-size: 12px;
  color: #6b7280;
}

@media (max-width: 1024px) {
  .large-card,
  .wide-card {
    grid-column: span 1;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .story-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .story-metrics {
    justify-content: space-around;
  }
  
  .real-time-stats {
    grid-template-columns: 1fr;
  }
  
  .lifecycle-overview {
    grid-template-columns: 1fr;
  }
  
  .platform-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-color-scheme: dark) {
  .section-title {
    color: #f9fafb;
  }
  
  .section-description {
    color: #9ca3af;
  }
  
  .content-card {
    background: #1f2937;
    border-color: #374151;
  }
  
  .card-title {
    color: #f9fafb;
  }
  
  .story-item {
    background: #111827;
  }
  
  .story-headline {
    color: #f9fafb;
  }
  
  .story-meta {
    color: #9ca3af;
  }
  
  .metric-value {
    color: #f9fafb;
  }
  
  .rt-metric {
    background: #374151;
  }
  
  .lifecycle-metric,
  .platform-item {
    background: #111827;
  }
  
  .lifecycle-value,
  .lifecycle-label {
    color: #f9fafb;
  }
  
  .repurpose-item {
    background: #374151;
  }
  
  .repurpose-title {
    color: #f9fafb;
  }
  
  .repurpose-type {
    background: #4b5563;
    color: #d1d5db;
  }
}
</style>