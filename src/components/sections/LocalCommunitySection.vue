<template>
  <div class="local-community-section">
    <div class="section-header">
      <h2 class="section-title">🏘️ Local Impact & Community Reach</h2>
      <p class="section-description">Monitor community engagement, coverage diversity, and representation across all local markets</p>
    </div>

    <div class="content-grid">
      <!-- Coverage Diversity Overview -->
      <div class="content-card coverage-overview">
        <h3 class="card-title">🌈 Coverage Diversity</h3>
        <div class="diversity-metrics">
          <div class="diversity-metric">
            <span class="diversity-value">{{ coverageData.communities }}</span>
            <span class="diversity-label">Communities Covered</span>
          </div>
          <div class="diversity-metric">
            <span class="diversity-value">{{ coverageData.geographies }}</span>
            <span class="diversity-label">Geographic Areas</span>
          </div>
          <div class="diversity-metric">
            <span class="diversity-value">{{ coverageData.voices }}%</span>
            <span class="diversity-label">Diverse Voices</span>
          </div>
        </div>
        
        <div class="geographic-breakdown">
          <h4 class="subsection-title">Geographic Coverage Distribution</h4>
          <div class="geography-list">
            <div 
              v-for="area in geographicAreas"
              :key="area.name"
              class="geography-item"
            >
              <div class="geography-info">
                <span class="geography-name">{{ area.name }}</span>
                <span class="geography-type">{{ area.type }}</span>
              </div>
              <div class="geography-stats">
                <div class="geography-bar">
                  <div 
                    class="geography-fill"
                    :style="{ width: area.coverage + '%' }"
                  ></div>
                </div>
                <span class="geography-percentage">{{ area.coverage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Community Engagement Events -->
      <div class="content-card large-card">
        <h3 class="card-title">🎪 Community Engagement Events</h3>
        <div class="engagement-overview">
          <div class="engagement-stats">
            <div class="engagement-stat">
              <span class="engagement-value">{{ communityEvents.liveChats }}</span>
              <span class="engagement-label">Live Chats</span>
              <span class="engagement-period">This month</span>
            </div>
            <div class="engagement-stat">
              <span class="engagement-value">{{ communityEvents.townHalls }}</span>
              <span class="engagement-label">Town Halls</span>
              <span class="engagement-period">This month</span>
            </div>
            <div class="engagement-stat">
              <span class="engagement-value">{{ communityEvents.qaSessions }}</span>
              <span class="engagement-label">Q&A Sessions</span>
              <span class="engagement-period">This month</span>
            </div>
            <div class="engagement-stat">
              <span class="engagement-value">{{ communityEvents.totalParticipants }}</span>
              <span class="engagement-label">Total Participants</span>
              <span class="engagement-period">This month</span>
            </div>
          </div>
        </div>
        
        <div class="upcoming-events">
          <h4 class="subsection-title">📅 Upcoming Events</h4>
          <div class="events-list">
            <div 
              v-for="event in upcomingEvents"
              :key="event.id"
              class="event-item"
            >
              <div class="event-date">
                <span class="event-day">{{ event.day }}</span>
                <span class="event-month">{{ event.month }}</span>
              </div>
              <div class="event-info">
                <h5 class="event-title">{{ event.title }}</h5>
                <div class="event-details">
                  <span class="event-type">{{ event.type }}</span>
                  <span class="event-time">{{ event.time }}</span>
                  <span class="event-location">{{ event.location }}</span>
                </div>
                <div class="event-description">{{ event.description }}</div>
              </div>
              <div class="event-stats">
                <span class="event-registered">{{ event.registered }} registered</span>
                <span class="event-capacity">/ {{ event.capacity }} capacity</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="past-events-success">
          <h4 class="subsection-title">🏆 Recent Successful Events</h4>
          <div class="success-events">
            <div 
              v-for="event in recentSuccessfulEvents"
              :key="event.id"
              class="success-event"
            >
              <div class="success-info">
                <span class="success-title">{{ event.title }}</span>
                <span class="success-date">{{ event.date }}</span>
              </div>
              <div class="success-metrics">
                <span class="success-attendance">{{ event.attendance }} attendees</span>
                <span class="success-rating">{{ event.rating }}/5 rating</span>
                <span class="success-engagement">{{ event.engagement }}% engagement</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reader Comments & Feedback -->
      <div class="content-card">
        <h3 class="card-title">💬 Reader Comments & Feedback</h3>
        <div class="comments-overview">
          <div class="comments-metric">
            <span class="comments-value">{{ feedbackData.totalComments }}</span>
            <span class="comments-label">Total Comments</span>
            <span class="comments-change positive">+{{ feedbackData.commentsGrowth }}%</span>
          </div>
          <div class="comments-metric">
            <span class="comments-value">{{ feedbackData.avgSentiment }}%</span>
            <span class="comments-label">Positive Sentiment</span>
            <span class="comments-change positive">+{{ feedbackData.sentimentChange }}%</span>
          </div>
          <div class="comments-metric">
            <span class="comments-value">{{ feedbackData.responseRate }}%</span>
            <span class="comments-label">Response Rate</span>
            <span class="comments-change positive">+{{ feedbackData.responseChange }}%</span>
          </div>
        </div>
        
        <div class="feedback-trends">
          <h4 class="subsection-title">Trending Topics in Feedback</h4>
          <div class="trending-topics">
            <div 
              v-for="topic in trendingFeedbackTopics"
              :key="topic.name"
              class="trending-topic"
            >
              <span class="topic-name">{{ topic.name }}</span>
              <div class="topic-sentiment">
                <div class="sentiment-bar">
                  <div 
                    class="sentiment-positive"
                    :style="{ width: topic.positive + '%' }"
                  ></div>
                  <div 
                    class="sentiment-negative"
                    :style="{ width: topic.negative + '%' }"
                  ></div>
                </div>
                <span class="sentiment-score">{{ topic.positive }}% positive</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Equity & Representation Metrics -->
      <div class="content-card">
        <h3 class="card-title">⚖️ Equity & Representation</h3>
        <div class="equity-overview">
          <div class="equity-score">
            <span class="score-value">{{ equityData.overallScore }}</span>
            <span class="score-label">Equity Score</span>
            <div class="score-breakdown">
              <span class="score-target">Target: {{ equityData.target }}</span>
            </div>
          </div>
        </div>
        
        <div class="representation-metrics">
          <h4 class="subsection-title">Representation Analysis</h4>
          <div class="representation-categories">
            <div 
              v-for="category in representationData"
              :key="category.type"
              class="representation-item"
            >
              <div class="representation-header">
                <span class="representation-type">{{ category.type }}</span>
                <span class="representation-score" :class="category.status">
                  {{ category.coverage }}%
                </span>
              </div>
              <div class="representation-details">
                <div class="rep-detail">
                  <span class="rep-label">Coverage vs Community</span>
                  <div class="rep-comparison">
                    <div class="rep-bar coverage">
                      <div 
                        class="rep-fill"
                        :style="{ width: category.coverage + '%' }"
                      ></div>
                    </div>
                    <div class="rep-bar community">
                      <div 
                        class="rep-fill"
                        :style="{ width: category.community + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Community Impact Stories -->
      <div class="content-card wide-card">
        <h3 class="card-title">📰 Community Impact Stories</h3>
        <div class="impact-overview">
          <div class="impact-metrics">
            <div class="impact-metric">
              <span class="impact-value">{{ impactStories.totalStories }}</span>
              <span class="impact-label">Impact Stories</span>
            </div>
            <div class="impact-metric">
              <span class="impact-value">{{ impactStories.avgReach }}</span>
              <span class="impact-label">Avg Community Reach</span>
            </div>
            <div class="impact-metric">
              <span class="impact-value">{{ impactStories.changesMade }}</span>
              <span class="impact-label">Policy Changes</span>
            </div>
            <div class="impact-metric">
              <span class="impact-value">{{ impactStories.followUps }}</span>
              <span class="impact-label">Follow-up Stories</span>
            </div>
          </div>
        </div>
        
        <div class="featured-impact-stories">
          <h4 class="subsection-title">🌟 Featured Impact Stories</h4>
          <div class="featured-stories-list">
            <div 
              v-for="story in featuredImpactStories"
              :key="story.id"
              class="featured-story"
            >
              <div class="story-header">
                <h5 class="story-title">{{ story.title }}</h5>
                <span class="story-impact-badge" :class="story.impactLevel">
                  {{ story.impactLevel }} Impact
                </span>
              </div>
              <div class="story-details">
                <div class="story-meta">
                  <span class="story-author">{{ story.author }}</span>
                  <span class="story-date">{{ story.publishDate }}</span>
                  <span class="story-category">{{ story.category }}</span>
                </div>
                <div class="story-description">{{ story.description }}</div>
              </div>
              <div class="story-metrics">
                <div class="story-metric">
                  <span class="story-metric-value">{{ formatNumber(story.views) }}</span>
                  <span class="story-metric-label">Views</span>
                </div>
                <div class="story-metric">
                  <span class="story-metric-value">{{ story.shares }}</span>
                  <span class="story-metric-label">Shares</span>
                </div>
                <div class="story-metric">
                  <span class="story-metric-value">{{ story.comments }}</span>
                  <span class="story-metric-label">Comments</span>
                </div>
              </div>
              <div class="story-outcome">
                <span class="outcome-label">Community Outcome:</span>
                <span class="outcome-text">{{ story.outcome }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Community Partnerships -->
      <div class="content-card large-card">
        <h3 class="card-title">🤝 Community Partnerships</h3>
        <div class="partnerships-overview">
          <div class="partnership-stats">
            <div class="partnership-stat">
              <span class="partnership-value">{{ partnerships.activePartners }}</span>
              <span class="partnership-label">Active Partners</span>
            </div>
            <div class="partnership-stat">
              <span class="partnership-value">{{ partnerships.collaborativeStories }}</span>
              <span class="partnership-label">Collaborative Stories</span>
            </div>
            <div class="partnership-stat">
              <span class="partnership-value">{{ partnerships.communityEvents }}</span>
              <span class="partnership-label">Joint Events</span>
            </div>
          </div>
        </div>
        
        <div class="partner-categories">
          <h4 class="subsection-title">Partnership Categories</h4>
          <div class="partner-types">
            <div 
              v-for="type in partnerTypes"
              :key="type.category"
              class="partner-type"
            >
              <div class="partner-type-header">
                <span class="partner-type-icon">{{ type.icon }}</span>
                <span class="partner-type-name">{{ type.category }}</span>
                <span class="partner-type-count">{{ type.count }} partners</span>
              </div>
              <div class="partner-examples">
                <span 
                  v-for="example in type.examples"
                  :key="example"
                  class="partner-example"
                >
                  {{ example }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="partnership-success">
          <h4 class="subsection-title">Recent Partnership Successes</h4>
          <div class="success-partnerships">
            <div 
              v-for="success in partnershipSuccesses"
              :key="success.id"
              class="success-partnership"
            >
              <div class="success-partnership-info">
                <span class="success-partnership-title">{{ success.title }}</span>
                <span class="success-partnership-partner">with {{ success.partner }}</span>
              </div>
              <div class="success-partnership-result">{{ success.result }}</div>
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

// Mock data - in real implementation, this would come from API calls
const coverageData = ref({
  communities: 47,
  geographies: 12,
  voices: 68
})

const geographicAreas = ref([
  { name: "Downtown Core", type: "Urban", coverage: 85 },
  { name: "Suburban Districts", type: "Suburban", coverage: 72 },
  { name: "Rural Communities", type: "Rural", coverage: 45 },
  { name: "Industrial Areas", type: "Industrial", coverage: 38 },
  { name: "Waterfront", type: "Recreational", coverage: 62 },
  { name: "University District", type: "Educational", coverage: 78 }
])

const communityEvents = ref({
  liveChats: 8,
  townHalls: 3,
  qaSessions: 12,
  totalParticipants: 2847
})

const upcomingEvents = ref([
  {
    id: 1,
    title: "City Budget Town Hall",
    type: "Town Hall",
    day: "15",
    month: "Dec",
    time: "7:00 PM",
    location: "City Hall",
    description: "Community discussion on the proposed 2024 budget and infrastructure spending.",
    registered: 124,
    capacity: 200
  },
  {
    id: 2,
    title: "Education Policy Q&A",
    type: "Q&A Session",
    day: "18",
    month: "Dec",
    time: "6:30 PM",
    location: "Online",
    description: "Live Q&A with school board members about new policies and programs.",
    registered: 89,
    capacity: 150
  },
  {
    id: 3,
    title: "Climate Action Live Chat",
    type: "Live Chat",
    day: "22",
    month: "Dec",
    time: "12:00 PM",
    location: "Facebook Live",
    description: "Discussion with environmental experts about local climate initiatives.",
    registered: 67,
    capacity: 100
  }
])

const recentSuccessfulEvents = ref([
  {
    id: 1,
    title: "Healthcare Access Forum",
    date: "Nov 28, 2024",
    attendance: 156,
    rating: 4.7,
    engagement: 89
  },
  {
    id: 2,
    title: "Small Business Support Panel",
    date: "Nov 20, 2024",
    attendance: 203,
    rating: 4.5,
    engagement: 82
  },
  {
    id: 3,
    title: "Housing Crisis Discussion",
    date: "Nov 15, 2024",
    attendance: 278,
    rating: 4.8,
    engagement: 94
  }
])

const feedbackData = ref({
  totalComments: 3489,
  commentsGrowth: 18.7,
  avgSentiment: 72,
  sentimentChange: 5.2,
  responseRate: 34,
  responseChange: 12.3
})

const trendingFeedbackTopics = ref([
  { name: "City Budget", positive: 65, negative: 35 },
  { name: "School Policies", positive: 78, negative: 22 },
  { name: "Traffic Issues", positive: 42, negative: 58 },
  { name: "Local Development", positive: 71, negative: 29 },
  { name: "Public Safety", positive: 58, negative: 42 }
])

const equityData = ref({
  overallScore: 74,
  target: 85
})

const representationData = ref([
  {
    type: "Age Demographics",
    coverage: 68,
    community: 72,
    status: "good"
  },
  {
    type: "Racial Diversity",
    coverage: 71,
    community: 76,
    status: "good"
  },
  {
    type: "Economic Background",
    coverage: 59,
    community: 65,
    status: "needs-improvement"
  },
  {
    type: "Geographic Distribution",
    coverage: 82,
    community: 80,
    status: "excellent"
  },
  {
    type: "Gender Representation",
    coverage: 78,
    community: 79,
    status: "good"
  }
])

const impactStories = ref({
  totalStories: 34,
  avgReach: "15.2K",
  changesMade: 7,
  followUps: 18
})

const featuredImpactStories = ref([
  {
    id: 1,
    title: "Investigation Exposes City Contract Irregularities",
    author: "Sarah Johnson",
    publishDate: "Dec 5, 2024",
    category: "Government",
    impactLevel: "high",
    description: "Investigation into city contracting practices leads to policy reforms and increased transparency.",
    views: 45678,
    shares: 892,
    comments: 234,
    outcome: "City implements new transparency measures and contract review process"
  },
  {
    id: 2,
    title: "School Lunch Program Coverage Sparks Policy Change",
    author: "Mike Rodriguez",
    publishDate: "Nov 28, 2024",
    category: "Education",
    impactLevel: "medium",
    description: "Series on school nutrition leads to expanded free lunch programs across the district.",
    views: 28934,
    shares: 567,
    comments: 156,
    outcome: "District expands free lunch eligibility to 40% more students"
  },
  {
    id: 3,
    title: "Housing Crisis Series Prompts Emergency Funding",
    author: "Jennifer Martinez",
    publishDate: "Nov 15, 2024",
    category: "Housing",
    impactLevel: "high",
    description: "Multi-part series on affordable housing shortage leads to emergency city council action.",
    views: 62341,
    shares: 1234,
    comments: 389,
    outcome: "$5M emergency fund allocated for affordable housing initiatives"
  }
])

const partnerships = ref({
  activePartners: 23,
  collaborativeStories: 45,
  communityEvents: 12
})

const partnerTypes = ref([
  {
    category: "Nonprofit Organizations",
    icon: "🏛️",
    count: 8,
    examples: ["Community Foundation", "Food Bank", "Literacy Council"]
  },
  {
    category: "Educational Institutions",
    icon: "🎓",
    count: 5,
    examples: ["University", "Community College", "High School District"]
  },
  {
    category: "Government Agencies",
    icon: "🏛️",
    count: 6,
    examples: ["City Planning", "Public Health", "Parks Department"]
  },
  {
    category: "Business Organizations",
    icon: "🏢",
    count: 4,
    examples: ["Chamber of Commerce", "Downtown Association", "Industry Council"]
  }
])

const partnershipSuccesses = ref([
  {
    id: 1,
    title: "Election Coverage Partnership",
    partner: "League of Women Voters",
    result: "Increased voter turnout by 15% through comprehensive candidate guides"
  },
  {
    id: 2,
    title: "Health Data Collaboration",
    partner: "County Health Department",
    result: "Award-winning series on public health trends and disparities"
  },
  {
    id: 3,
    title: "Climate Reporting Initiative",
    partner: "Environmental Science Department",
    result: "Monthly climate impact reports with scientific backing"
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
.local-community-section {
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

.coverage-overview {
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

.diversity-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.diversity-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  gap: 4px;
}

.diversity-value {
  font-size: 28px;
  font-weight: 700;
  color: #10b981;
}

.diversity-label {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
}

.geography-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.geography-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 8px;
  gap: 16px;
}

.geography-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.geography-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.geography-type {
  font-size: 12px;
  color: #6b7280;
}

.geography-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 120px;
}

.geography-bar {
  width: 80px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.geography-fill {
  height: 100%;
  background: linear-gradient(to right, #10b981, #059669);
  transition: width 0.3s ease;
}

.geography-percentage {
  font-size: 12px;
  color: #6b7280;
  min-width: 30px;
  text-align: right;
}

.engagement-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.engagement-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  gap: 4px;
}

.engagement-value {
  font-size: 24px;
  font-weight: 700;
  color: #3b82f6;
}

.engagement-label {
  font-size: 14px;
  color: #111827;
  font-weight: 600;
}

.engagement-period {
  font-size: 12px;
  color: #6b7280;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.event-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  min-width: 60px;
}

.event-day {
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}

.event-month {
  font-size: 12px;
  text-transform: uppercase;
}

.event-info {
  flex: 1;
}

.event-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.event-details {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

.event-description {
  font-size: 14px;
  color: #374151;
  line-height: 1.4;
}

.event-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  text-align: right;
}

.event-registered {
  font-size: 14px;
  font-weight: 600;
  color: #10b981;
}

.event-capacity {
  font-size: 12px;
  color: #6b7280;
}

.success-events {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.success-event {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 6px;
}

.success-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.success-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.success-date {
  font-size: 12px;
  color: #6b7280;
}

.success-metrics {
  display: flex;
  gap: 16px;
  font-size: 12px;
}

.success-attendance {
  color: #3b82f6;
  font-weight: 600;
}

.success-rating {
  color: #f59e0b;
  font-weight: 600;
}

.success-engagement {
  color: #10b981;
  font-weight: 600;
}

.comments-overview {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.comments-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.comments-value {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.comments-label {
  font-size: 14px;
  color: #6b7280;
  flex: 1;
  margin-left: 12px;
}

.comments-change {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.comments-change.positive {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.trending-topics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trending-topic {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 6px;
  gap: 16px;
}

.topic-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  min-width: 120px;
}

.topic-sentiment {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.sentiment-bar {
  width: 100px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  display: flex;
}

.sentiment-positive {
  background: #10b981;
  height: 100%;
}

.sentiment-negative {
  background: #ef4444;
  height: 100%;
}

.sentiment-score {
  font-size: 12px;
  color: #6b7280;
  min-width: 80px;
  text-align: right;
}

.equity-overview {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.equity-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
  gap: 8px;
}

.score-value {
  font-size: 48px;
  font-weight: 700;
  color: #3b82f6;
}

.score-label {
  font-size: 16px;
  color: #111827;
  font-weight: 600;
}

.score-breakdown {
  margin-top: 8px;
}

.score-target {
  font-size: 12px;
  color: #6b7280;
}

.representation-categories {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.representation-item {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.representation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.representation-type {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.representation-score {
  font-size: 16px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
}

.representation-score.excellent {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.representation-score.good {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.representation-score.needs-improvement {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.rep-detail {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rep-label {
  font-size: 12px;
  color: #6b7280;
}

.rep-comparison {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rep-bar {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
}

.rep-bar.coverage {
  background: #e0e7ff;
}

.rep-bar.community {
  background: #dcfce7;
}

.rep-bar.coverage .rep-fill {
  background: #3b82f6;
  height: 100%;
  transition: width 0.3s ease;
}

.rep-bar.community .rep-fill {
  background: #10b981;
  height: 100%;
  transition: width 0.3s ease;
}

.impact-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.impact-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  gap: 4px;
}

.impact-value {
  font-size: 28px;
  font-weight: 700;
  color: #3b82f6;
}

.impact-label {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
}

.featured-stories-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.featured-story {
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
}

.story-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 16px;
}

.story-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
  line-height: 1.4;
}

.story-impact-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.story-impact-badge.high {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.story-impact-badge.medium {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.story-impact-badge.low {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.story-details {
  margin-bottom: 16px;
}

.story-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

.story-description {
  font-size: 14px;
  color: #374151;
  line-height: 1.4;
  margin-bottom: 16px;
}

.story-metrics {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.story-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.story-metric-value {
  font-size: 16px;
  font-weight: 700;
  color: #3b82f6;
}

.story-metric-label {
  font-size: 10px;
  color: #6b7280;
}

.story-outcome {
  padding: 12px;
  background: #f0f9ff;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
}

.outcome-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
}

.outcome-text {
  font-size: 14px;
  color: #1e40af;
  font-weight: 500;
}

.partnership-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.partnership-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  gap: 4px;
}

.partnership-value {
  font-size: 28px;
  font-weight: 700;
  color: #3b82f6;
}

.partnership-label {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
}

.partner-types {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.partner-type {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.partner-type-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.partner-type-icon {
  font-size: 20px;
}

.partner-type-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  flex: 1;
}

.partner-type-count {
  font-size: 12px;
  color: #6b7280;
  background: #e5e7eb;
  padding: 2px 6px;
  border-radius: 4px;
}

.partner-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.partner-example {
  font-size: 12px;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
}

.success-partnerships {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.success-partnership {
  padding: 12px;
  background: #f3f4f6;
  border-radius: 6px;
}

.success-partnership-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.success-partnership-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.success-partnership-partner {
  font-size: 12px;
  color: #6b7280;
}

.success-partnership-result {
  font-size: 13px;
  color: #374151;
  line-height: 1.4;
}

@media (max-width: 1024px) {
  .coverage-overview,
  .large-card,
  .wide-card {
    grid-column: span 1;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .diversity-metrics,
  .engagement-stats,
  .impact-metrics,
  .partnership-stats {
    grid-template-columns: 1fr;
  }
  
  .event-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .story-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .story-metrics {
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
  .subsection-title {
    color: #f9fafb;
  }
  
  .diversity-metric,
  .geography-item,
  .engagement-stat,
  .event-item,
  .success-event,
  .trending-topic,
  .equity-score,
  .representation-item,
  .impact-metric,
  .featured-story,
  .partnership-stat,
  .partner-type,
  .success-partnership {
    background: #111827;
  }
  
  .geography-name,
  .event-title,
  .success-title,
  .topic-name,
  .representation-type,
  .story-title,
  .partnership-type-name,
  .success-partnership-title {
    color: #f9fafb;
  }
}
</style>