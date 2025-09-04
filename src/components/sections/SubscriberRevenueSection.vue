<template>
  <div class="subscriber-revenue-section">
    <div class="section-header">
      <h2 class="section-title">💰 Subscriber & Revenue Signals</h2>
      <p class="section-description">Monitor subscription performance, revenue drivers, and monetization effectiveness</p>
    </div>

    <div class="content-grid">
      <!-- Revenue Overview -->
      <div class="content-card revenue-overview">
        <h3 class="card-title">📈 Revenue Dashboard</h3>
        <div class="revenue-metrics">
          <div class="revenue-metric primary">
            <span class="revenue-value">${{ formatNumber(revenueData.totalRevenue) }}</span>
            <span class="revenue-label">Total Revenue</span>
            <span class="revenue-change positive">+{{ revenueData.revenueGrowth }}%</span>
          </div>
          <div class="revenue-grid">
            <div class="revenue-metric">
              <span class="revenue-value">${{ formatNumber(revenueData.subscriptions) }}</span>
              <span class="revenue-label">Subscriptions</span>
            </div>
            <div class="revenue-metric">
              <span class="revenue-value">${{ formatNumber(revenueData.advertising) }}</span>
              <span class="revenue-label">Advertising</span>
            </div>
            <div class="revenue-metric">
              <span class="revenue-value">${{ formatNumber(revenueData.events) }}</span>
              <span class="revenue-label">Events</span>
            </div>
            <div class="revenue-metric">
              <span class="revenue-value">${{ formatNumber(revenueData.other) }}</span>
              <span class="revenue-label">Other</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Digital Subscriptions -->
      <div class="content-card large-card">
        <h3 class="card-title">🔔 Digital Subscriptions</h3>
        <div class="subscription-overview">
          <div class="sub-stats-grid">
            <div class="sub-stat">
              <span class="sub-stat-value">{{ subscriptionData.newSignups }}</span>
              <span class="sub-stat-label">New Sign-ups</span>
              <span class="sub-stat-period">This {{ period }}</span>
            </div>
            <div class="sub-stat">
              <span class="sub-stat-value">{{ subscriptionData.totalSubscribers }}</span>
              <span class="sub-stat-label">Total Subscribers</span>
              <span class="sub-stat-period">Active</span>
            </div>
            <div class="sub-stat">
              <span class="sub-stat-value">{{ subscriptionData.churnRate }}%</span>
              <span class="sub-stat-label">Churn Rate</span>
              <span class="sub-stat-period">Monthly</span>
            </div>
            <div class="sub-stat">
              <span class="sub-stat-value">${{ subscriptionData.avgRevenuePer }}</span>
              <span class="sub-stat-label">ARPU</span>
              <span class="sub-stat-period">Monthly</span>
            </div>
          </div>
        </div>
        
        <div class="conversion-stories">
          <h4 class="subsection-title">🎯 Top Converting Stories</h4>
          <div class="converting-stories-list">
            <div 
              v-for="story in convertingStories"
              :key="story.id"
              class="converting-story"
            >
              <div class="story-info">
                <h5 class="story-title">{{ story.title }}</h5>
                <div class="story-meta">
                  <span>{{ story.desk }}</span>
                  <span>{{ story.publishTime }}</span>
                </div>
              </div>
              <div class="conversion-metrics">
                <div class="conversion-metric">
                  <span class="conversion-value">{{ story.conversions }}</span>
                  <span class="conversion-label">Conversions</span>
                </div>
                <div class="conversion-metric">
                  <span class="conversion-value">{{ story.conversionRate }}%</span>
                  <span class="conversion-label">Rate</span>
                </div>
                <div class="conversion-metric">
                  <span class="conversion-value">${{ story.revenue }}</span>
                  <span class="conversion-label">Revenue</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Paywall Performance -->
      <div class="content-card">
        <h3 class="card-title">🚧 Paywall Analytics</h3>
        <div class="paywall-metrics">
          <div class="paywall-metric">
            <span class="paywall-value">{{ paywallData.totalHits }}</span>
            <span class="paywall-label">Total Hits</span>
          </div>
          <div class="paywall-metric">
            <span class="paywall-value">{{ paywallData.conversionRate }}%</span>
            <span class="paywall-label">Conversion Rate</span>
          </div>
          <div class="paywall-metric">
            <span class="paywall-value">{{ paywallData.avgArticlesBeforeHit }}</span>
            <span class="paywall-label">Avg Articles Before Hit</span>
          </div>
        </div>
        
        <div class="paywall-triggers">
          <h4 class="subsection-title">Paywall Triggers</h4>
          <div class="trigger-list">
            <div 
              v-for="trigger in paywallTriggers"
              :key="trigger.type"
              class="trigger-item"
            >
              <span class="trigger-name">{{ trigger.name }}</span>
              <div class="trigger-bar">
                <div 
                  class="trigger-fill"
                  :style="{ width: trigger.percentage + '%' }"
                ></div>
              </div>
              <span class="trigger-percentage">{{ trigger.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Advertising Performance -->
      <div class="content-card">
        <h3 class="card-title">📺 Advertising Performance</h3>
        <div class="ad-metrics">
          <div class="ad-metric">
            <span class="ad-value">{{ formatNumber(advertisingData.impressions) }}</span>
            <span class="ad-label">Impressions</span>
            <span class="ad-change positive">+{{ advertisingData.impressionsChange }}%</span>
          </div>
          <div class="ad-metric">
            <span class="ad-value">${{ advertisingData.cpm }}</span>
            <span class="ad-label">Average CPM</span>
            <span class="ad-change positive">+{{ advertisingData.cpmChange }}%</span>
          </div>
          <div class="ad-metric">
            <span class="ad-value">{{ advertisingData.ctr }}%</span>
            <span class="ad-label">Click-through Rate</span>
            <span class="ad-change negative">{{ advertisingData.ctrChange }}%</span>
          </div>
        </div>
        
        <div class="branded-content">
          <h4 class="subsection-title">Branded Content Success</h4>
          <div class="branded-list">
            <div 
              v-for="content in brandedContent"
              :key="content.id"
              class="branded-item"
            >
              <span class="branded-title">{{ content.title }}</span>
              <span class="branded-performance">{{ content.engagement }}% engagement</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Newsletter & Podcast Growth -->
      <div class="content-card wide-card">
        <h3 class="card-title">📧 Newsletter & Podcast Performance</h3>
        <div class="newsletter-podcast-grid">
          <!-- Newsletter Section -->
          <div class="newsletter-section">
            <h4 class="section-subtitle">📬 Newsletters</h4>
            <div class="newsletter-metrics">
              <div class="nl-metric">
                <span class="nl-value">{{ newsletterData.subscribers }}</span>
                <span class="nl-label">Subscribers</span>
                <span class="nl-change positive">+{{ newsletterData.growth }}%</span>
              </div>
              <div class="nl-metric">
                <span class="nl-value">{{ newsletterData.openRate }}%</span>
                <span class="nl-label">Open Rate</span>
                <span class="nl-change positive">+{{ newsletterData.openRateChange }}%</span>
              </div>
              <div class="nl-metric">
                <span class="nl-value">{{ newsletterData.ctr }}%</span>
                <span class="nl-label">Click-through Rate</span>
                <span class="nl-change positive">+{{ newsletterData.ctrChange }}%</span>
              </div>
            </div>
            
            <div class="newsletter-performance">
              <h5 class="performance-title">Newsletter Performance</h5>
              <div class="newsletter-list">
                <div 
                  v-for="newsletter in newsletters"
                  :key="newsletter.id"
                  class="newsletter-item"
                >
                  <div class="newsletter-info">
                    <span class="newsletter-name">{{ newsletter.name }}</span>
                    <span class="newsletter-frequency">{{ newsletter.frequency }}</span>
                  </div>
                  <div class="newsletter-stats">
                    <span class="newsletter-subs">{{ formatNumber(newsletter.subscribers) }} subs</span>
                    <span class="newsletter-open">{{ newsletter.openRate }}% open</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Podcast Section -->
          <div class="podcast-section">
            <h4 class="section-subtitle">🎧 Podcasts</h4>
            <div class="podcast-metrics">
              <div class="pc-metric">
                <span class="pc-value">{{ podcastData.totalDownloads }}</span>
                <span class="pc-label">Total Downloads</span>
                <span class="pc-change positive">+{{ podcastData.growth }}%</span>
              </div>
              <div class="pc-metric">
                <span class="pc-value">{{ podcastData.avgListenTime }}</span>
                <span class="pc-label">Avg Listen Time</span>
                <span class="pc-change positive">+{{ podcastData.listenTimeChange }}%</span>
              </div>
              <div class="pc-metric">
                <span class="pc-value">{{ podcastData.subscribers }}</span>
                <span class="pc-label">Subscribers</span>
                <span class="pc-change positive">+{{ podcastData.subGrowth }}%</span>
              </div>
            </div>
            
            <div class="podcast-performance">
              <h5 class="performance-title">Podcast Shows</h5>
              <div class="podcast-list">
                <div 
                  v-for="podcast in podcasts"
                  :key="podcast.id"
                  class="podcast-item"
                >
                  <div class="podcast-info">
                    <span class="podcast-name">{{ podcast.name }}</span>
                    <span class="podcast-episodes">{{ podcast.episodes }} episodes</span>
                  </div>
                  <div class="podcast-stats">
                    <span class="podcast-downloads">{{ formatNumber(podcast.downloads) }}</span>
                    <span class="podcast-rating">⭐ {{ podcast.rating }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenue Attribution -->
      <div class="content-card large-card">
        <h3 class="card-title">🎯 Revenue Attribution</h3>
        <div class="attribution-overview">
          <div class="attribution-chart">
            <h4 class="subsection-title">Revenue by Source</h4>
            <div class="revenue-sources">
              <div 
                v-for="source in revenueSources"
                :key="source.name"
                class="revenue-source"
              >
                <div class="source-info">
                  <span class="source-name">{{ source.name }}</span>
                  <span class="source-amount">${{ formatNumber(source.amount) }}</span>
                </div>
                <div class="source-bar">
                  <div 
                    class="source-fill"
                    :style="{ width: source.percentage + '%', backgroundColor: source.color }"
                  ></div>
                </div>
                <span class="source-percentage">{{ source.percentage }}%</span>
              </div>
            </div>
          </div>
          
          <div class="attribution-insights">
            <h4 class="subsection-title">Key Insights</h4>
            <div class="insights-list">
              <div 
                v-for="insight in revenueInsights"
                :key="insight.id"
                class="insight-item"
              >
                <span class="insight-icon">{{ insight.icon }}</span>
                <span class="insight-text">{{ insight.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  period: String,
  desk: String,
  publication: String
})

// Mock data - in real implementation, this would come from API calls
const revenueData = ref({
  totalRevenue: 2845678,
  revenueGrowth: 18.4,
  subscriptions: 1892340,
  advertising: 687234,
  events: 156890,
  other: 109214
})

const subscriptionData = ref({
  newSignups: 1247,
  totalSubscribers: 89456,
  churnRate: 2.3,
  avgRevenuePer: 12.99
})

const convertingStories = ref([
  {
    id: 1,
    title: "Exclusive: City's Hidden Debt Crisis",
    desk: "Investigations",
    publishTime: "2 days ago",
    conversions: 89,
    conversionRate: 12.4,
    revenue: 1156
  },
  {
    id: 2,
    title: "Behind the Scenes: Hospital Merger Impact",
    desk: "Business",
    publishTime: "1 day ago",
    conversions: 67,
    conversionRate: 9.8,
    revenue: 870
  },
  {
    id: 3,
    title: "School Board's Secret Meetings Exposed",
    desk: "Local",
    publishTime: "4 hours ago",
    conversions: 54,
    conversionRate: 8.2,
    revenue: 701
  }
])

const paywallData = ref({
  totalHits: 34567,
  conversionRate: 3.7,
  avgArticlesBeforeHit: 4.2
})

const paywallTriggers = ref([
  { name: "Article limit reached", percentage: 45, type: "limit" },
  { name: "Premium content access", percentage: 32, type: "premium" },
  { name: "Newsletter signup", percentage: 15, type: "newsletter" },
  { name: "Video content", percentage: 8, type: "video" }
])

const advertisingData = ref({
  impressions: 5678923,
  impressionsChange: 12.7,
  cpm: 4.23,
  cpmChange: 8.9,
  ctr: 1.8,
  ctrChange: -2.1
})

const brandedContent = ref([
  { id: 1, title: "Local Business Spotlight Series", engagement: 8.4 },
  { id: 2, title: "Real Estate Market Analysis", engagement: 6.7 },
  { id: 3, title: "Healthcare Innovation Feature", engagement: 9.2 }
])

const newsletterData = ref({
  subscribers: 45678,
  growth: 15.2,
  openRate: 28.4,
  openRateChange: 3.7,
  ctr: 4.2,
  ctrChange: 1.8
})

const newsletters = ref([
  {
    id: 1,
    name: "Morning Briefing",
    frequency: "Daily",
    subscribers: 23456,
    openRate: 32.1
  },
  {
    id: 2,
    name: "Weekend Wrap",
    frequency: "Weekly",
    subscribers: 18790,
    openRate: 24.7
  },
  {
    id: 3,
    name: "Local Business Update",
    frequency: "Bi-weekly",
    subscribers: 12345,
    openRate: 18.9
  }
])

const podcastData = ref({
  totalDownloads: 234567,
  growth: 22.4,
  avgListenTime: "18m 32s",
  listenTimeChange: 8.7,
  subscribers: 12890,
  subGrowth: 19.6
})

const podcasts = ref([
  {
    id: 1,
    name: "City Hall Conversations",
    episodes: 24,
    downloads: 145678,
    rating: 4.7
  },
  {
    id: 2,
    name: "Sports Talk Local",
    episodes: 18,
    downloads: 89012,
    rating: 4.4
  },
  {
    id: 3,
    name: "Business Beat",
    episodes: 12,
    downloads: 56789,
    rating: 4.2
  }
])

const revenueSources = ref([
  { name: "Digital Subscriptions", amount: 1892340, percentage: 66.5, color: "#3b82f6" },
  { name: "Display Advertising", amount: 467234, percentage: 16.4, color: "#10b981" },
  { name: "Branded Content", percentage: 7.7, amount: 220000, color: "#f59e0b" },
  { name: "Events & Webinars", percentage: 5.5, amount: 156890, color: "#ef4444" },
  { name: "Newsletter Sponsorship", percentage: 2.4, amount: 68234, color: "#8b5cf6" },
  { name: "Other", percentage: 1.5, amount: 40980, color: "#6b7280" }
])

const revenueInsights = ref([
  {
    id: 1,
    icon: "📈",
    text: "Subscription revenue up 18.4% driven by investigative content"
  },
  {
    id: 2,
    icon: "🎯",
    text: "Premium articles show 3x higher conversion rates"
  },
  {
    id: 3,
    icon: "📧",
    text: "Newsletter subscribers convert 40% more often"
  },
  {
    id: 4,
    icon: "📱",
    text: "Mobile paywall conversions increased 25%"
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
.subscriber-revenue-section {
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

.revenue-overview {
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

.revenue-metrics {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.revenue-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
  gap: 4px;
}

.revenue-metric.primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.revenue-value {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
}

.revenue-metric.primary .revenue-value,
.revenue-metric.primary .revenue-label {
  color: white;
}

.revenue-label {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
}

.revenue-change {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.revenue-change.positive {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.revenue-metric.primary .revenue-change {
  color: #a7f3d0;
  background: rgba(167, 243, 208, 0.2);
}

.revenue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.sub-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.sub-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  gap: 4px;
}

.sub-stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #3b82f6;
}

.sub-stat-label {
  font-size: 14px;
  color: #111827;
  font-weight: 600;
}

.sub-stat-period {
  font-size: 12px;
  color: #6b7280;
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
}

.converting-stories-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.converting-story {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  background: #f3f4f6;
  border-radius: 8px;
  gap: 16px;
}

.story-info {
  flex: 1;
}

.story-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.story-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
}

.conversion-metrics {
  display: flex;
  gap: 12px;
}

.conversion-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.conversion-value {
  font-size: 16px;
  font-weight: 700;
  color: #3b82f6;
}

.conversion-label {
  font-size: 10px;
  color: #6b7280;
}

.paywall-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.paywall-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  gap: 4px;
}

.paywall-value {
  font-size: 20px;
  font-weight: 700;
  color: #3b82f6;
}

.paywall-label {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

.trigger-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trigger-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.trigger-name {
  flex: 1;
  font-size: 14px;
  color: #111827;
}

.trigger-bar {
  width: 80px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.trigger-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.trigger-percentage {
  font-size: 12px;
  color: #6b7280;
  min-width: 30px;
  text-align: right;
}

.ad-metrics {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.ad-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.ad-value {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.ad-label {
  font-size: 14px;
  color: #6b7280;
  flex: 1;
  margin-left: 12px;
}

.ad-change {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.ad-change.positive {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.ad-change.negative {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.branded-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.branded-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.branded-title {
  font-size: 14px;
  color: #111827;
}

.branded-performance {
  font-size: 12px;
  color: #10b981;
  font-weight: 600;
}

.newsletter-podcast-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.section-subtitle {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.newsletter-metrics,
.podcast-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.nl-metric,
.pc-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
}

.nl-value,
.pc-value {
  font-size: 18px;
  font-weight: 700;
  color: #3b82f6;
}

.nl-label,
.pc-label {
  font-size: 14px;
  color: #111827;
  flex: 1;
  margin-left: 12px;
}

.nl-change,
.pc-change {
  font-size: 12px;
  font-weight: 600;
  color: #10b981;
}

.performance-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
}

.newsletter-list,
.podcast-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.newsletter-item,
.podcast-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 6px;
}

.newsletter-info,
.podcast-info {
  flex: 1;
}

.newsletter-name,
.podcast-name {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.newsletter-frequency,
.podcast-episodes {
  font-size: 12px;
  color: #6b7280;
}

.newsletter-stats,
.podcast-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.newsletter-subs,
.podcast-downloads {
  font-size: 12px;
  color: #3b82f6;
  font-weight: 600;
}

.newsletter-open {
  font-size: 12px;
  color: #10b981;
  font-weight: 600;
}

.podcast-rating {
  font-size: 12px;
  color: #f59e0b;
  font-weight: 600;
}

.attribution-overview {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
}

.revenue-sources {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.revenue-source {
  display: flex;
  align-items: center;
  gap: 12px;
}

.source-info {
  display: flex;
  flex-direction: column;
  min-width: 200px;
}

.source-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.source-amount {
  font-size: 12px;
  color: #6b7280;
}

.source-bar {
  flex: 1;
  height: 12px;
  background: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.source-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.source-percentage {
  font-size: 12px;
  color: #6b7280;
  min-width: 35px;
  text-align: right;
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.insight-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.insight-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.4;
}

@media (max-width: 1024px) {
  .revenue-overview,
  .large-card,
  .wide-card {
    grid-column: span 1;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .newsletter-podcast-grid {
    grid-template-columns: 1fr;
  }
  
  .attribution-overview {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .revenue-grid,
  .sub-stats-grid,
  .paywall-metrics {
    grid-template-columns: 1fr;
  }
  
  .converting-story {
    flex-direction: column;
    align-items: stretch;
  }
  
  .conversion-metrics {
    justify-content: space-around;
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
  
  .card-title,
  .subsection-title,
  .section-subtitle,
  .performance-title {
    color: #f9fafb;
  }
  
  .revenue-metric,
  .sub-stat,
  .paywall-metric,
  .nl-metric,
  .pc-metric {
    background: #111827;
  }
  
  .revenue-value,
  .story-title,
  .trigger-name,
  .ad-value,
  .branded-title,
  .newsletter-name,
  .podcast-name,
  .source-name {
    color: #f9fafb;
  }
  
  .converting-story,
  .newsletter-item,
  .podcast-item,
  .insight-item {
    background: #374151;
  }
}
</style>