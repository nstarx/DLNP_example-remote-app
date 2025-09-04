<template>
  <div class="audience-engagement-section">
    <div class="section-header">
      <h2 class="section-title">👥 Audience & Engagement</h2>
      <p class="section-description">Monitor reader behavior, traffic sources, and engagement patterns across all platforms</p>
    </div>

    <div class="content-grid">
      <!-- Key Metrics Overview -->
      <div class="content-card metrics-overview">
        <h3 class="card-title">📊 Key Engagement Metrics</h3>
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="metric-value">{{ formatNumber(audienceMetrics.pageviews) }}</span>
            <span class="metric-label">Total Pageviews</span>
            <span class="metric-change positive">+{{ audienceMetrics.pageviewsChange }}%</span>
          </div>
          <div class="metric-card">
            <span class="metric-value">{{ formatNumber(audienceMetrics.uniqueVisitors) }}</span>
            <span class="metric-label">Unique Visitors</span>
            <span class="metric-change positive">+{{ audienceMetrics.visitorsChange }}%</span>
          </div>
          <div class="metric-card">
            <span class="metric-value">{{ audienceMetrics.avgTimeSpent }}</span>
            <span class="metric-label">Avg Time on Site</span>
            <span class="metric-change positive">+{{ audienceMetrics.timeChange }}%</span>
          </div>
          <div class="metric-card">
            <span class="metric-value">{{ audienceMetrics.bounceRate }}%</span>
            <span class="metric-label">Bounce Rate</span>
            <span class="metric-change negative">{{ audienceMetrics.bounceChange }}%</span>
          </div>
        </div>
      </div>

      <!-- Story Engagement Deep Dive -->
      <div class="content-card large-card">
        <h3 class="card-title">📖 Story Engagement Analysis</h3>
        <div class="engagement-tabs">
          <button 
            v-for="tab in engagementTabs"
            :key="tab.id"
            :class="['tab-button', { active: activeEngagementTab === tab.id }]"
            @click="activeEngagementTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
        <div class="engagement-content">
          <div v-if="activeEngagementTab === 'deep'" class="deep-engagement">
            <div class="engagement-story-list">
              <div 
                v-for="story in deepEngagementStories"
                :key="story.id"
                class="engagement-story"
              >
                <div class="story-info">
                  <h4 class="story-title">{{ story.title }}</h4>
                  <div class="story-stats">
                    <span>{{ story.readTime }} avg read</span>
                    <span>{{ story.completion }}% completion</span>
                    <span>{{ story.comments }} comments</span>
                  </div>
                </div>
                <div class="engagement-bar">
                  <div 
                    class="engagement-fill"
                    :style="{ width: story.engagement + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="bounce-analysis">
            <div class="bounce-reasons">
              <h4 class="subsection-title">Top Bounce Reasons</h4>
              <div 
                v-for="reason in bounceReasons"
                :key="reason.name"
                class="bounce-item"
              >
                <span class="bounce-name">{{ reason.name }}</span>
                <div class="bounce-bar">
                  <div 
                    class="bounce-fill"
                    :style="{ width: reason.percentage + '%' }"
                  ></div>
                </div>
                <span class="bounce-percentage">{{ reason.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Traffic Sources -->
      <div class="content-card">
        <h3 class="card-title">🚀 Traffic Sources</h3>
        <div class="traffic-sources">
          <div 
            v-for="source in trafficSources"
            :key="source.name"
            class="traffic-source"
          >
            <div class="source-header">
              <span class="source-icon">{{ source.icon }}</span>
              <span class="source-name">{{ source.name }}</span>
              <span class="source-percentage">{{ source.percentage }}%</span>
            </div>
            <div class="source-details">
              <span class="source-visitors">{{ formatNumber(source.visitors) }} visitors</span>
              <span class="source-change" :class="source.trend">
                {{ source.change > 0 ? '+' : '' }}{{ source.change }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Subscriber vs Non-Subscriber -->
      <div class="content-card">
        <h3 class="card-title">🔒 Subscriber Analysis</h3>
        <div class="subscriber-overview">
          <div class="subscriber-metric">
            <span class="sub-value">{{ subscriberData.subscriberReads }}%</span>
            <span class="sub-label">Subscriber Reads</span>
          </div>
          <div class="subscriber-metric">
            <span class="sub-value">{{ subscriberData.paywallHits }}</span>
            <span class="sub-label">Paywall Hits</span>
          </div>
          <div class="subscriber-metric">
            <span class="sub-value">{{ subscriberData.conversion }}%</span>
            <span class="sub-label">Conversion Rate</span>
          </div>
        </div>
        <div class="paywall-performance">
          <h4 class="subsection-title">Paywall Performance</h4>
          <div class="paywall-stories">
            <div 
              v-for="story in paywallStories"
              :key="story.id"
              class="paywall-story"
            >
              <span class="paywall-title">{{ story.title }}</span>
              <span class="paywall-conversions">{{ story.conversions }} conversions</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Search & Keywords -->
      <div class="content-card">
        <h3 class="card-title">🔍 Search & Keywords</h3>
        <div class="search-metrics">
          <div class="search-metric">
            <span class="search-value">{{ searchData.organicTraffic }}%</span>
            <span class="search-label">Organic Traffic</span>
          </div>
          <div class="search-metric">
            <span class="search-value">{{ searchData.avgPosition }}</span>
            <span class="search-label">Avg Position</span>
          </div>
        </div>
        <div class="top-keywords">
          <h4 class="subsection-title">Top Search Keywords</h4>
          <div class="keyword-list">
            <div 
              v-for="keyword in topKeywords"
              :key="keyword.term"
              class="keyword-item"
            >
              <span class="keyword-term">{{ keyword.term }}</span>
              <span class="keyword-traffic">{{ keyword.traffic }}</span>
            </div>
          </div>
        </div>
        <div class="search-queries">
          <h4 class="subsection-title">What Readers Are Seeking</h4>
          <div class="query-tags">
            <span 
              v-for="query in readerQueries"
              :key="query"
              class="query-tag"
            >
              {{ query }}
            </span>
          </div>
        </div>
      </div>

      <!-- Social Media Performance -->
      <div class="content-card wide-card">
        <h3 class="card-title">📱 Social Media Trends</h3>
        <div class="social-platforms">
          <div 
            v-for="platform in socialPlatforms"
            :key="platform.name"
            class="social-platform"
          >
            <div class="platform-header">
              <span class="platform-icon">{{ platform.icon }}</span>
              <span class="platform-name">{{ platform.name }}</span>
            </div>
            <div class="platform-stats">
              <div class="platform-stat">
                <span class="stat-value">{{ formatNumber(platform.reach) }}</span>
                <span class="stat-label">Reach</span>
              </div>
              <div class="platform-stat">
                <span class="stat-value">{{ platform.engagement }}%</span>
                <span class="stat-label">Engagement</span>
              </div>
              <div class="platform-stat">
                <span class="stat-value">{{ platform.shares }}</span>
                <span class="stat-label">Shares</span>
              </div>
            </div>
            <div class="platform-trend">
              <span class="trend-label">7-day trend:</span>
              <span :class="['trend-value', platform.trendDirection]">
                {{ platform.trend > 0 ? '+' : '' }}{{ platform.trend }}%
              </span>
            </div>
          </div>
        </div>
        <div class="viral-content">
          <h4 class="subsection-title">🔥 Viral Content This Week</h4>
          <div class="viral-list">
            <div 
              v-for="content in viralContent"
              :key="content.id"
              class="viral-item"
            >
              <span class="viral-title">{{ content.title }}</span>
              <div class="viral-metrics">
                <span class="viral-shares">{{ formatNumber(content.shares) }} shares</span>
                <span class="viral-platform">{{ content.topPlatform }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  period: String,
  desk: String,
  publication: String
})

const activeEngagementTab = ref('deep')

const engagementTabs = [
  { id: 'deep', name: 'Deep Engagement' },
  { id: 'bounce', name: 'Bounce Analysis' }
]

// Mock data - in real implementation, this would come from API calls
const audienceMetrics = ref({
  pageviews: 2847563,
  pageviewsChange: 15.4,
  uniqueVisitors: 456789,
  visitorsChange: 8.7,
  avgTimeSpent: '4m 32s',
  timeChange: 12.3,
  bounceRate: 34.2,
  bounceChange: -6.8
})

const deepEngagementStories = ref([
  {
    id: 1,
    title: "City Budget Analysis: Where Your Tax Dollars Go",
    readTime: "6m 45s",
    completion: 78,
    comments: 24,
    engagement: 85
  },
  {
    id: 2,
    title: "Investigation: Hospital Billing Practices Under Scrutiny",
    readTime: "8m 12s",
    completion: 65,
    comments: 47,
    engagement: 92
  },
  {
    id: 3,
    title: "Local School District Faces Budget Shortfall",
    readTime: "4m 23s",
    completion: 71,
    comments: 18,
    engagement: 73
  }
])

const bounceReasons = ref([
  { name: "Page load time too slow", percentage: 35 },
  { name: "Paywall encountered", percentage: 28 },
  { name: "Poor mobile experience", percentage: 18 },
  { name: "Content not as expected", percentage: 12 },
  { name: "Too many ads", percentage: 7 }
])

const trafficSources = ref([
  {
    name: "Direct",
    icon: "🔗",
    percentage: 32,
    visitors: 145632,
    change: 8.4,
    trend: "positive"
  },
  {
    name: "Organic Search",
    icon: "🔍",
    percentage: 28,
    visitors: 127456,
    change: 15.7,
    trend: "positive"
  },
  {
    name: "Social Media",
    icon: "📱",
    percentage: 22,
    visitors: 100234,
    change: -3.2,
    trend: "negative"
  },
  {
    name: "Email/Newsletter",
    icon: "📧",
    percentage: 12,
    visitors: 54678,
    change: 22.1,
    trend: "positive"
  },
  {
    name: "Referral",
    icon: "🌐",
    percentage: 6,
    visitors: 27345,
    change: 5.6,
    trend: "positive"
  }
])

const subscriberData = ref({
  subscriberReads: 45,
  paywallHits: 12789,
  conversion: 3.2
})

const paywallStories = ref([
  { id: 1, title: "Exclusive: Mayor's Private Meetings Revealed", conversions: 89 },
  { id: 2, title: "Deep Dive: Tech Industry Impact", conversions: 67 },
  { id: 3, title: "Investigation: City Council Finances", conversions: 54 }
])

const searchData = ref({
  organicTraffic: 28,
  avgPosition: 12.3
})

const topKeywords = ref([
  { term: "city budget", traffic: "12.4K" },
  { term: "local news", traffic: "8.9K" },
  { term: "school board", traffic: "6.7K" },
  { term: "election results", traffic: "5.2K" },
  { term: "weather forecast", traffic: "4.8K" }
])

const readerQueries = ref([
  "What time do polls close?",
  "School lunch menu",
  "City council meeting schedule",
  "Local weather alert",
  "Property tax changes",
  "Road construction updates"
])

const socialPlatforms = ref([
  {
    name: "Facebook",
    icon: "📘",
    reach: 234567,
    engagement: 4.2,
    shares: 1234,
    trend: 8.7,
    trendDirection: "positive"
  },
  {
    name: "Twitter/X",
    icon: "🐦",
    reach: 156789,
    engagement: 6.8,
    shares: 2345,
    trend: 15.4,
    trendDirection: "positive"
  },
  {
    name: "Instagram",
    icon: "📷",
    reach: 89123,
    engagement: 8.9,
    shares: 567,
    trend: -2.1,
    trendDirection: "negative"
  },
  {
    name: "TikTok",
    icon: "🎵",
    reach: 45678,
    engagement: 12.3,
    shares: 890,
    trend: 34.6,
    trendDirection: "positive"
  }
])

const viralContent = ref([
  {
    id: 1,
    title: "High School Student's Science Project Goes Viral",
    shares: 45678,
    topPlatform: "TikTok"
  },
  {
    id: 2,
    title: "Local Restaurant's Unique Menu Item Trends",
    shares: 23456,
    topPlatform: "Instagram"
  },
  {
    id: 3,
    title: "City Council Meeting Moment Becomes Meme",
    shares: 34567,
    topPlatform: "Twitter"
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
</script>

<style scoped>
.audience-engagement-section {
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

.metrics-overview {
  grid-column: span 2;
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

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.metric-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  gap: 4px;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.metric-label {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
}

.metric-change {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.metric-change.positive {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.metric-change.negative {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.engagement-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.tab-button {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.engagement-story-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.engagement-story {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.story-info {
  margin-bottom: 12px;
}

.story-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.story-stats {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #6b7280;
}

.engagement-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.engagement-fill {
  height: 100%;
  background: linear-gradient(to right, #10b981, #059669);
  transition: width 0.3s ease;
}

.bounce-reasons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
}

.bounce-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bounce-name {
  flex: 1;
  font-size: 14px;
  color: #111827;
}

.bounce-bar {
  width: 100px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.bounce-fill {
  height: 100%;
  background: #ef4444;
  transition: width 0.3s ease;
}

.bounce-percentage {
  font-size: 12px;
  color: #6b7280;
  min-width: 30px;
  text-align: right;
}

.traffic-sources {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.traffic-source {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.source-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.source-icon {
  font-size: 18px;
}

.source-name {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.source-percentage {
  font-size: 18px;
  font-weight: 700;
  color: #3b82f6;
}

.source-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.source-visitors {
  color: #6b7280;
}

.source-change {
  font-weight: 600;
}

.source-change.positive {
  color: #10b981;
}

.source-change.negative {
  color: #ef4444;
}

.subscriber-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.subscriber-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  gap: 4px;
}

.sub-value {
  font-size: 24px;
  font-weight: 700;
  color: #3b82f6;
}

.sub-label {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

.paywall-stories {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.paywall-story {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 6px;
}

.paywall-title {
  font-size: 14px;
  color: #111827;
  flex: 1;
}

.paywall-conversions {
  font-size: 12px;
  color: #10b981;
  font-weight: 600;
}

.search-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.search-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  gap: 4px;
}

.search-value {
  font-size: 24px;
  font-weight: 700;
  color: #3b82f6;
}

.search-label {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

.keyword-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.keyword-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.keyword-term {
  font-size: 14px;
  color: #111827;
}

.keyword-traffic {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
}

.query-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.query-tag {
  padding: 6px 12px;
  background: #e5e7eb;
  color: #374151;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.social-platforms {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.social-platform {
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

.platform-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.platform-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.stat-label {
  font-size: 10px;
  color: #6b7280;
}

.platform-trend {
  display: flex;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
}

.trend-label {
  color: #6b7280;
}

.trend-value.positive {
  color: #10b981;
  font-weight: 600;
}

.trend-value.negative {
  color: #ef4444;
  font-weight: 600;
}

.viral-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.viral-item {
  padding: 12px;
  background: #f3f4f6;
  border-radius: 8px;
}

.viral-title {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 8px;
}

.viral-metrics {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
}

.viral-shares {
  color: #3b82f6;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .metrics-overview,
  .large-card,
  .wide-card {
    grid-column: span 1;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .subscriber-overview,
  .search-metrics {
    grid-template-columns: 1fr;
  }
  
  .social-platforms {
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
  
  .metric-card,
  .engagement-story,
  .traffic-source,
  .subscriber-metric,
  .paywall-story,
  .search-metric,
  .social-platform {
    background: #111827;
  }
  
  .metric-value,
  .story-title,
  .source-name,
  .paywall-title,
  .keyword-term {
    color: #f9fafb;
  }
  
  .tab-button {
    color: #9ca3af;
  }
  
  .tab-button.active {
    color: #3b82f6;
  }
  
  .query-tag,
  .viral-item {
    background: #374151;
    color: #d1d5db;
  }
}
</style>