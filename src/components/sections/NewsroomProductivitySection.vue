<template>
  <div class="newsroom-productivity-section">
    <div class="section-header">
      <h2 class="section-title">⚡ Newsroom Productivity</h2>
      <p class="section-description">Monitor publishing efficiency, staff productivity, and newsroom operations across all outlets</p>
    </div>

    <div class="content-grid">
      <!-- Publishing Volume Overview -->
      <div class="content-card publishing-overview">
        <h3 class="card-title">📊 Publishing Volume</h3>
        <div class="volume-metrics">
          <div class="volume-metric primary">
            <span class="volume-value">{{ publishingData.totalArticles }}</span>
            <span class="volume-label">Articles Published</span>
            <span class="volume-period">This {{ period }}</span>
          </div>
          <div class="volume-grid">
            <div class="volume-metric">
              <span class="volume-value">{{ publishingData.dailyAverage }}</span>
              <span class="volume-label">Daily Average</span>
            </div>
            <div class="volume-metric">
              <span class="volume-value">{{ publishingData.weekendPublishing }}%</span>
              <span class="volume-label">Weekend Publishing</span>
            </div>
            <div class="volume-metric">
              <span class="volume-value">{{ publishingData.breakingNews }}</span>
              <span class="volume-label">Breaking News</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Desk Performance -->
      <div class="content-card large-card">
        <h3 class="card-title">🏢 Publishing by Desk</h3>
        <div class="desk-performance">
          <div 
            v-for="desk in deskPerformance"
            :key="desk.name"
            class="desk-item"
          >
            <div class="desk-header">
              <div class="desk-info">
                <span class="desk-name">{{ desk.name }}</span>
                <span class="desk-staff">{{ desk.staffCount }} writers</span>
              </div>
              <div class="desk-metrics">
                <span class="desk-articles">{{ desk.articles }} articles</span>
                <span class="desk-avg">{{ desk.avgPerWriter }} avg/writer</span>
              </div>
            </div>
            <div class="desk-breakdown">
              <div class="breakdown-item">
                <span class="breakdown-label">Original Reporting</span>
                <div class="breakdown-bar">
                  <div 
                    class="breakdown-fill original"
                    :style="{ width: desk.original + '%' }"
                  ></div>
                </div>
                <span class="breakdown-percentage">{{ desk.original }}%</span>
              </div>
              <div class="breakdown-item">
                <span class="breakdown-label">Wire/AP</span>
                <div class="breakdown-bar">
                  <div 
                    class="breakdown-fill wire"
                    :style="{ width: desk.wire + '%' }"
                  ></div>
                </div>
                <span class="breakdown-percentage">{{ desk.wire }}%</span>
              </div>
              <div class="breakdown-item">
                <span class="breakdown-label">Opinion/Editorial</span>
                <div class="breakdown-bar">
                  <div 
                    class="breakdown-fill opinion"
                    :style="{ width: desk.opinion + '%' }"
                  ></div>
                </div>
                <span class="breakdown-percentage">{{ desk.opinion }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Turnaround Time Analysis -->
      <div class="content-card">
        <h3 class="card-title">⏱️ Turnaround Time</h3>
        <div class="turnaround-overview">
          <div class="turnaround-metric">
            <span class="turnaround-value">{{ turnaroundData.breakingNews }}</span>
            <span class="turnaround-label">Breaking News</span>
            <span class="turnaround-sublabel">Story to publish</span>
          </div>
          <div class="turnaround-metric">
            <span class="turnaround-value">{{ turnaroundData.regularNews }}</span>
            <span class="turnaround-label">Regular News</span>
            <span class="turnaround-sublabel">Assignment to publish</span>
          </div>
          <div class="turnaround-metric">
            <span class="turnaround-value">{{ turnaroundData.investigations }}</span>
            <span class="turnaround-label">Investigations</span>
            <span class="turnaround-sublabel">Start to finish</span>
          </div>
        </div>
        
        <div class="fastest-stories">
          <h4 class="subsection-title">⚡ Fastest Published (Breaking)</h4>
          <div class="fastest-list">
            <div 
              v-for="story in fastestStories"
              :key="story.id"
              class="fastest-item"
            >
              <div class="story-info">
                <span class="story-title">{{ story.title }}</span>
                <span class="story-writer">{{ story.writer }}</span>
              </div>
              <span class="story-time">{{ story.turnaroundTime }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- AI/Automation Usage -->
      <div class="content-card">
        <h3 class="card-title">🤖 AI & Automation</h3>
        <div class="ai-metrics">
          <div class="ai-metric">
            <span class="ai-value">{{ aiData.automatedAlerts }}</span>
            <span class="ai-label">Automated Alerts</span>
            <span class="ai-change positive">+{{ aiData.alertsGrowth }}%</span>
          </div>
          <div class="ai-metric">
            <span class="ai-value">{{ aiData.aiSummaries }}</span>
            <span class="ai-label">AI News Summaries</span>
            <span class="ai-change positive">+{{ aiData.summariesGrowth }}%</span>
          </div>
          <div class="ai-metric">
            <span class="ai-value">{{ aiData.factChecks }}</span>
            <span class="ai-label">AI Fact Checks</span>
            <span class="ai-change positive">+{{ aiData.factCheckGrowth }}%</span>
          </div>
        </div>
        
        <div class="ai-usage">
          <h4 class="subsection-title">AI Tool Usage by Desk</h4>
          <div class="ai-usage-list">
            <div 
              v-for="usage in aiUsage"
              :key="usage.desk"
              class="ai-usage-item"
            >
              <span class="usage-desk">{{ usage.desk }}</span>
              <div class="usage-bar">
                <div 
                  class="usage-fill"
                  :style="{ width: usage.usage + '%' }"
                ></div>
              </div>
              <span class="usage-percentage">{{ usage.usage }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Editing Queue -->
      <div class="content-card">
        <h3 class="card-title">✏️ Editing Queue</h3>
        <div class="queue-overview">
          <div class="queue-metric urgent">
            <span class="queue-value">{{ editingQueue.pending }}</span>
            <span class="queue-label">Pending Edits</span>
          </div>
          <div class="queue-metric">
            <span class="queue-value">{{ editingQueue.avgWaitTime }}</span>
            <span class="queue-label">Avg Wait Time</span>
          </div>
          <div class="queue-metric">
            <span class="queue-value">{{ editingQueue.cleared }}</span>
            <span class="queue-label">Cleared Today</span>
          </div>
        </div>
        
        <div class="queue-breakdown">
          <h4 class="subsection-title">Queue Breakdown</h4>
          <div class="queue-categories">
            <div 
              v-for="category in queueCategories"
              :key="category.type"
              class="queue-category"
            >
              <div class="category-header">
                <span class="category-name">{{ category.name }}</span>
                <span class="category-count">{{ category.count }}</span>
              </div>
              <div class="category-bar">
                <div 
                  class="category-fill"
                  :style="{ width: category.percentage + '%', backgroundColor: category.color }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cross-Publication Sharing -->
      <div class="content-card wide-card">
        <h3 class="card-title">🔄 Cross-Publication Sharing</h3>
        <div class="sharing-overview">
          <div class="sharing-metrics">
            <div class="sharing-metric">
              <span class="sharing-value">{{ sharingData.storiesShared }}</span>
              <span class="sharing-label">Stories Shared</span>
            </div>
            <div class="sharing-metric">
              <span class="sharing-value">{{ sharingData.publications }}</span>
              <span class="sharing-label">Publications</span>
            </div>
            <div class="sharing-metric">
              <span class="sharing-value">{{ sharingData.avgReach }}</span>
              <span class="sharing-label">Avg Reach Increase</span>
            </div>
          </div>
          
          <div class="sharing-network">
            <h4 class="subsection-title">Publication Network Activity</h4>
            <div class="network-grid">
              <div 
                v-for="publication in publicationNetwork"
                :key="publication.name"
                class="network-item"
              >
                <div class="pub-header">
                  <span class="pub-name">{{ publication.name }}</span>
                  <span class="pub-role">{{ publication.role }}</span>
                </div>
                <div class="pub-stats">
                  <div class="pub-stat">
                    <span class="pub-stat-value">{{ publication.shared }}</span>
                    <span class="pub-stat-label">Shared</span>
                  </div>
                  <div class="pub-stat">
                    <span class="pub-stat-value">{{ publication.received }}</span>
                    <span class="pub-stat-label">Received</span>
                  </div>
                </div>
                <div class="pub-trending">
                  <span class="trending-label">Top shared:</span>
                  <span class="trending-topic">{{ publication.topTopic }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="syndication-success">
          <h4 class="subsection-title">🏆 Most Successful Syndications</h4>
          <div class="success-list">
            <div 
              v-for="success in syndicationSuccess"
              :key="success.id"
              class="success-item"
            >
              <div class="success-info">
                <h5 class="success-title">{{ success.title }}</h5>
                <div class="success-meta">
                  <span>{{ success.originalPub }}</span>
                  <span>{{ success.author }}</span>
                  <span>{{ success.publishDate }}</span>
                </div>
              </div>
              <div class="success-metrics">
                <div class="success-metric">
                  <span class="success-metric-value">{{ success.publications }}</span>
                  <span class="success-metric-label">Publications</span>
                </div>
                <div class="success-metric">
                  <span class="success-metric-value">{{ formatNumber(success.totalReach) }}</span>
                  <span class="success-metric-label">Total Reach</span>
                </div>
                <div class="success-metric">
                  <span class="success-metric-value">{{ success.engagement }}%</span>
                  <span class="success-metric-label">Engagement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Staff Productivity Insights -->
      <div class="content-card large-card">
        <h3 class="card-title">👥 Staff Productivity Insights</h3>
        <div class="productivity-tabs">
          <button 
            v-for="tab in productivityTabs"
            :key="tab.id"
            :class="['tab-button', { active: activeProductivityTab === tab.id }]"
            @click="activeProductivityTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
        
        <div class="productivity-content">
          <div v-if="activeProductivityTab === 'top'" class="top-performers">
            <div class="performers-grid">
              <div 
                v-for="performer in topPerformers"
                :key="performer.name"
                class="performer-item"
              >
                <div class="performer-info">
                  <span class="performer-name">{{ performer.name }}</span>
                  <span class="performer-desk">{{ performer.desk }}</span>
                </div>
                <div class="performer-stats">
                  <div class="performer-stat">
                    <span class="stat-value">{{ performer.articles }}</span>
                    <span class="stat-label">Articles</span>
                  </div>
                  <div class="performer-stat">
                    <span class="stat-value">{{ performer.avgViews }}</span>
                    <span class="stat-label">Avg Views</span>
                  </div>
                  <div class="performer-stat">
                    <span class="stat-value">{{ performer.efficiency }}%</span>
                    <span class="stat-label">Efficiency</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="workload-analysis">
            <div class="workload-overview">
              <div class="workload-metric">
                <span class="workload-value">{{ workloadData.avgArticlesPerWriter }}</span>
                <span class="workload-label">Avg Articles/Writer</span>
              </div>
              <div class="workload-metric">
                <span class="workload-value">{{ workloadData.overloadedWriters }}</span>
                <span class="workload-label">Overloaded Writers</span>
              </div>
              <div class="workload-metric">
                <span class="workload-value">{{ workloadData.underutilizedWriters }}</span>
                <span class="workload-label">Underutilized Writers</span>
              </div>
            </div>
            
            <div class="workload-distribution">
              <h5 class="distribution-title">Workload Distribution</h5>
              <div class="distribution-chart">
                <div 
                  v-for="range in workloadDistribution"
                  :key="range.range"
                  class="distribution-item"
                >
                  <span class="range-label">{{ range.range }} articles</span>
                  <div class="range-bar">
                    <div 
                      class="range-fill"
                      :style="{ width: range.percentage + '%' }"
                    ></div>
                  </div>
                  <span class="range-count">{{ range.count }} writers</span>
                </div>
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

const activeProductivityTab = ref('top')

const productivityTabs = [
  { id: 'top', name: 'Top Performers' },
  { id: 'workload', name: 'Workload Analysis' }
]

// Mock data - in real implementation, this would come from API calls
const publishingData = ref({
  totalArticles: 1247,
  dailyAverage: 89,
  weekendPublishing: 23,
  breakingNews: 34
})

const deskPerformance = ref([
  {
    name: "Local News",
    staffCount: 12,
    articles: 456,
    avgPerWriter: 38,
    original: 75,
    wire: 15,
    opinion: 10
  },
  {
    name: "Sports",
    staffCount: 8,
    articles: 234,
    avgPerWriter: 29,
    original: 65,
    wire: 25,
    opinion: 10
  },
  {
    name: "Politics",
    staffCount: 6,
    articles: 189,
    avgPerWriter: 32,
    original: 85,
    wire: 10,
    opinion: 5
  },
  {
    name: "Business",
    staffCount: 5,
    articles: 167,
    avgPerWriter: 33,
    original: 70,
    wire: 20,
    opinion: 10
  },
  {
    name: "Investigations",
    staffCount: 4,
    articles: 78,
    avgPerWriter: 20,
    original: 95,
    wire: 0,
    opinion: 5
  },
  {
    name: "Entertainment",
    staffCount: 3,
    articles: 123,
    avgPerWriter: 41,
    original: 60,
    wire: 30,
    opinion: 10
  }
])

const turnaroundData = ref({
  breakingNews: "14m",
  regularNews: "4h 23m",
  investigations: "12.5 days"
})

const fastestStories = ref([
  {
    id: 1,
    title: "City Council Emergency Meeting Called",
    writer: "Sarah Johnson",
    turnaroundTime: "8m"
  },
  {
    id: 2,
    title: "Traffic Accident Blocks Highway 101",
    writer: "Mike Rodriguez",
    turnaroundTime: "12m"
  },
  {
    id: 3,
    title: "School Closure Announcement",
    writer: "Emily Chen",
    turnaroundTime: "15m"
  }
])

const aiData = ref({
  automatedAlerts: 247,
  alertsGrowth: 34.2,
  aiSummaries: 89,
  summariesGrowth: 67.8,
  factChecks: 156,
  factCheckGrowth: 23.1
})

const aiUsage = ref([
  { desk: "Breaking News", usage: 85 },
  { desk: "Sports", usage: 72 },
  { desk: "Local News", usage: 68 },
  { desk: "Politics", usage: 45 },
  { desk: "Business", usage: 38 },
  { desk: "Investigations", usage: 15 }
])

const editingQueue = ref({
  pending: 23,
  avgWaitTime: "2h 15m",
  cleared: 67
})

const queueCategories = ref([
  { name: "Breaking News", count: 5, percentage: 22, color: "#ef4444", type: "breaking" },
  { name: "Regular Articles", count: 12, percentage: 52, color: "#3b82f6", type: "regular" },
  { name: "Features", count: 4, percentage: 17, color: "#10b981", type: "features" },
  { name: "Opinion", count: 2, percentage: 9, color: "#f59e0b", type: "opinion" }
])

const sharingData = ref({
  storiesShared: 145,
  publications: 8,
  avgReach: "34%"
})

const publicationNetwork = ref([
  {
    name: "Miami Herald",
    role: "Hub",
    shared: 45,
    received: 23,
    topTopic: "Hurricane Coverage"
  },
  {
    name: "Charlotte Observer",
    role: "Major",
    shared: 34,
    received: 28,
    topTopic: "Election Analysis"
  },
  {
    name: "Kansas City Star",
    role: "Regional",
    shared: 28,
    received: 31,
    topTopic: "Sports Coverage"
  },
  {
    name: "Sacramento Bee",
    role: "Regional",
    shared: 23,
    received: 27,
    topTopic: "Tech Industry"
  },
  {
    name: "Fort Worth Star-Telegram",
    role: "Regional",
    shared: 19,
    received: 24,
    topTopic: "Energy News"
  },
  {
    name: "Fresno Bee",
    role: "Local",
    shared: 15,
    received: 18,
    topTopic: "Agriculture"
  }
])

const syndicationSuccess = ref([
  {
    id: 1,
    title: "Investigation: Hospital Chain's Hidden Fees",
    originalPub: "Miami Herald",
    author: "Jennifer Martinez",
    publishDate: "3 days ago",
    publications: 7,
    totalReach: 234567,
    engagement: 12.4
  },
  {
    id: 2,
    title: "Climate Change Impact on Local Agriculture",
    originalPub: "Sacramento Bee",
    author: "David Thompson",
    publishDate: "1 week ago",
    publications: 5,
    totalReach: 189234,
    engagement: 8.7
  },
  {
    id: 3,
    title: "Election Security Measures Across States",
    originalPub: "Charlotte Observer",
    author: "Lisa Wang",
    publishDate: "2 weeks ago",
    publications: 6,
    totalReach: 156789,
    engagement: 15.2
  }
])

const topPerformers = ref([
  {
    name: "Sarah Johnson",
    desk: "Local News",
    articles: 23,
    avgViews: "12.4K",
    efficiency: 94
  },
  {
    name: "Mike Rodriguez",
    desk: "Sports",
    articles: 19,
    avgViews: "15.7K",
    efficiency: 91
  },
  {
    name: "Jennifer Martinez",
    desk: "Investigations",
    articles: 8,
    avgViews: "28.9K",
    efficiency: 89
  },
  {
    name: "David Thompson",
    desk: "Business",
    articles: 15,
    avgViews: "9.2K",
    efficiency: 87
  },
  {
    name: "Emily Chen",
    desk: "Politics",
    articles: 17,
    avgViews: "18.3K",
    efficiency: 85
  },
  {
    name: "Lisa Wang",
    desk: "Entertainment",
    articles: 21,
    avgViews: "7.8K",
    efficiency: 83
  }
])

const workloadData = ref({
  avgArticlesPerWriter: 28,
  overloadedWriters: 5,
  underutilizedWriters: 3
})

const workloadDistribution = ref([
  { range: "0-10", percentage: 15, count: 4 },
  { range: "11-20", percentage: 25, count: 7 },
  { range: "21-30", percentage: 35, count: 10 },
  { range: "31-40", percentage: 20, count: 6 },
  { range: "40+", percentage: 5, count: 2 }
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
.newsroom-productivity-section {
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

.publishing-overview {
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

.volume-metrics {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.volume-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
  gap: 4px;
}

.volume-metric.primary {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.volume-value {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
}

.volume-metric.primary .volume-value,
.volume-metric.primary .volume-label,
.volume-metric.primary .volume-period {
  color: white;
}

.volume-label {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  font-weight: 600;
}

.volume-period {
  font-size: 12px;
  color: #9ca3af;
}

.volume-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.desk-performance {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.desk-item {
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
}

.desk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.desk-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.desk-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.desk-staff {
  font-size: 12px;
  color: #6b7280;
}

.desk-metrics {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.desk-articles {
  font-size: 18px;
  font-weight: 700;
  color: #3b82f6;
}

.desk-avg {
  font-size: 12px;
  color: #6b7280;
}

.desk-breakdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.breakdown-label {
  font-size: 12px;
  color: #6b7280;
  min-width: 120px;
}

.breakdown-bar {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.breakdown-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.breakdown-fill.original {
  background: #10b981;
}

.breakdown-fill.wire {
  background: #f59e0b;
}

.breakdown-fill.opinion {
  background: #8b5cf6;
}

.breakdown-percentage {
  font-size: 12px;
  color: #6b7280;
  min-width: 30px;
  text-align: right;
}

.turnaround-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.turnaround-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  gap: 4px;
}

.turnaround-value {
  font-size: 20px;
  font-weight: 700;
  color: #3b82f6;
}

.turnaround-label {
  font-size: 14px;
  color: #111827;
  font-weight: 600;
}

.turnaround-sublabel {
  font-size: 12px;
  color: #6b7280;
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
}

.fastest-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fastest-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 6px;
}

.story-info {
  flex: 1;
}

.story-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.story-writer {
  font-size: 12px;
  color: #6b7280;
}

.story-time {
  font-size: 16px;
  font-weight: 700;
  color: #10b981;
}

.ai-metrics {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.ai-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.ai-value {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.ai-label {
  font-size: 14px;
  color: #6b7280;
  flex: 1;
  margin-left: 12px;
}

.ai-change {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.ai-change.positive {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.ai-usage-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-usage-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.usage-desk {
  font-size: 14px;
  color: #111827;
  min-width: 100px;
}

.usage-bar {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.usage-fill {
  height: 100%;
  background: linear-gradient(to right, #3b82f6, #1d4ed8);
  transition: width 0.3s ease;
}

.usage-percentage {
  font-size: 12px;
  color: #6b7280;
  min-width: 30px;
  text-align: right;
}

.queue-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.queue-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  gap: 4px;
}

.queue-metric.urgent {
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.queue-value {
  font-size: 24px;
  font-weight: 700;
  color: #3b82f6;
}

.queue-metric.urgent .queue-value {
  color: #ef4444;
}

.queue-label {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

.queue-categories {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.queue-category {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-name {
  font-size: 14px;
  color: #111827;
}

.category-count {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
}

.category-bar {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.category-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.sharing-overview {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.sharing-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.sharing-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  gap: 4px;
}

.sharing-value {
  font-size: 28px;
  font-weight: 700;
  color: #3b82f6;
}

.sharing-label {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
}

.network-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.network-item {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.pub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.pub-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.pub-role {
  font-size: 10px;
  color: #6b7280;
  background: #e5e7eb;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.pub-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 12px;
}

.pub-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.pub-stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #3b82f6;
}

.pub-stat-label {
  font-size: 10px;
  color: #6b7280;
}

.pub-trending {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.trending-label {
  font-size: 10px;
  color: #6b7280;
}

.trending-topic {
  font-size: 12px;
  color: #111827;
  font-weight: 500;
}

.success-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.success-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  background: #f3f4f6;
  border-radius: 8px;
  gap: 16px;
}

.success-info {
  flex: 1;
}

.success-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.success-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
}

.success-metrics {
  display: flex;
  gap: 12px;
}

.success-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.success-metric-value {
  font-size: 16px;
  font-weight: 700;
  color: #3b82f6;
}

.success-metric-label {
  font-size: 10px;
  color: #6b7280;
}

.productivity-tabs {
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

.performers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.performer-item {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.performer-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.performer-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.performer-desk {
  font-size: 12px;
  color: #6b7280;
}

.performer-stats {
  display: flex;
  justify-content: space-between;
}

.performer-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #3b82f6;
}

.stat-label {
  font-size: 10px;
  color: #6b7280;
}

.workload-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.workload-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  gap: 4px;
}

.workload-value {
  font-size: 24px;
  font-weight: 700;
  color: #3b82f6;
}

.workload-label {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

.distribution-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
}

.distribution-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.distribution-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.range-label {
  font-size: 12px;
  color: #6b7280;
  min-width: 80px;
}

.range-bar {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.range-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.range-count {
  font-size: 12px;
  color: #6b7280;
  min-width: 70px;
  text-align: right;
}

@media (max-width: 1024px) {
  .publishing-overview,
  .large-card,
  .wide-card {
    grid-column: span 1;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .network-grid {
    grid-template-columns: 1fr;
  }
  
  .performers-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .volume-grid,
  .turnaround-overview,
  .queue-overview,
  .sharing-metrics,
  .workload-overview {
    grid-template-columns: 1fr;
  }
  
  .success-item,
  .converting-story {
    flex-direction: column;
    align-items: stretch;
  }
  
  .success-metrics,
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
  .distribution-title {
    color: #f9fafb;
  }
  
  .volume-metric,
  .desk-item,
  .turnaround-metric,
  .fastest-item,
  .queue-metric,
  .sharing-metric,
  .network-item,
  .success-item,
  .performer-item,
  .workload-metric {
    background: #111827;
  }
  
  .volume-value,
  .desk-name,
  .story-title,
  .ai-value,
  .usage-desk,
  .category-name,
  .pub-name,
  .success-title,
  .performer-name {
    color: #f9fafb;
  }
  
  .tab-button {
    color: #9ca3af;
  }
  
  .tab-button.active {
    color: #3b82f6;
  }
}
</style>