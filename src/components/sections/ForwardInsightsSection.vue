<template>
  <div class="forward-insights-section">
    <div class="section-header">
      <h2 class="section-title">🔮 Forward-Looking Insights</h2>
      <p class="section-description">AI-powered predictive analytics, trend detection, and competitive intelligence for strategic newsroom planning</p>
    </div>

    <div class="content-grid">
      <!-- Content Gaps Analysis -->
      <div class="content-card gaps-analysis">
        <h3 class="card-title">🎯 Content Gaps & Missed Stories</h3>
        <div class="gaps-overview">
          <div class="gap-metric">
            <span class="gap-value">{{ contentGaps.identifiedGaps }}</span>
            <span class="gap-label">Identified Gaps</span>
          </div>
          <div class="gap-metric">
            <span class="gap-value">{{ contentGaps.competitorStories }}</span>
            <span class="gap-label">Competitor Stories</span>
          </div>
          <div class="gap-metric">
            <span class="gap-value">{{ contentGaps.trendingTopics }}</span>
            <span class="gap-label">Trending Topics</span>
          </div>
        </div>
        
        <div class="missed-opportunities">
          <h4 class="subsection-title">⚠️ Missed Opportunities</h4>
          <div class="opportunities-list">
            <div 
              v-for="opportunity in missedOpportunities"
              :key="opportunity.id"
              class="opportunity-item"
              :class="opportunity.priority"
            >
              <div class="opportunity-info">
                <h5 class="opportunity-title">{{ opportunity.title }}</h5>
                <div class="opportunity-details">
                  <span class="opportunity-source">{{ opportunity.source }}</span>
                  <span class="opportunity-timeframe">{{ opportunity.timeframe }}</span>
                </div>
                <div class="opportunity-description">{{ opportunity.description }}</div>
              </div>
              <div class="opportunity-metrics">
                <div class="opportunity-priority">
                  <span class="priority-label">Priority</span>
                  <span class="priority-badge" :class="opportunity.priority">{{ opportunity.priority }}</span>
                </div>
                <div class="opportunity-potential">
                  <span class="potential-label">Est. Reach</span>
                  <span class="potential-value">{{ opportunity.estimatedReach }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Predictive Analytics -->
      <div class="content-card large-card">
        <h3 class="card-title">📈 Predictive Analytics</h3>
        <div class="prediction-overview">
          <div class="prediction-accuracy">
            <span class="accuracy-value">{{ predictiveData.accuracy }}%</span>
            <span class="accuracy-label">Prediction Accuracy</span>
            <span class="accuracy-period">Last 30 days</span>
          </div>
        </div>
        
        <div class="trending-predictions">
          <h4 class="subsection-title">🚀 Stories Likely to Trend Tomorrow</h4>
          <div class="predictions-list">
            <div 
              v-for="prediction in trendingPredictions"
              :key="prediction.id"
              class="prediction-item"
            >
              <div class="prediction-content">
                <h5 class="prediction-title">{{ prediction.title }}</h5>
                <div class="prediction-meta">
                  <span class="prediction-category">{{ prediction.category }}</span>
                  <span class="prediction-confidence">{{ prediction.confidence }}% confidence</span>
                </div>
                <div class="prediction-reasoning">
                  <span class="reasoning-label">Why it will trend:</span>
                  <span class="reasoning-text">{{ prediction.reasoning }}</span>
                </div>
              </div>
              <div class="prediction-metrics">
                <div class="prediction-score">
                  <span class="score-value">{{ prediction.trendScore }}</span>
                  <span class="score-label">Trend Score</span>
                </div>
                <div class="prediction-timeline">
                  <span class="timeline-label">Peak Time</span>
                  <span class="timeline-value">{{ prediction.peakTime }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="historical-accuracy">
          <h4 class="subsection-title">📊 Historical Prediction Performance</h4>
          <div class="accuracy-breakdown">
            <div 
              v-for="category in predictionAccuracy"
              :key="category.type"
              class="accuracy-category"
            >
              <div class="category-header">
                <span class="category-name">{{ category.name }}</span>
                <span class="category-accuracy">{{ category.accuracy }}%</span>
              </div>
              <div class="category-bar">
                <div 
                  class="category-fill"
                  :style="{ width: category.accuracy + '%' }"
                ></div>
              </div>
              <div class="category-stats">
                <span class="category-predictions">{{ category.predictions }} predictions</span>
                <span class="category-hits">{{ category.hits }} hits</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Emerging Topics Detection -->
      <div class="content-card">
        <h3 class="card-title">🌱 Emerging Topics</h3>
        <div class="emerging-overview">
          <div class="emerging-metric">
            <span class="emerging-value">{{ emergingTopics.newTopics }}</span>
            <span class="emerging-label">New Topics</span>
            <span class="emerging-period">This week</span>
          </div>
          <div class="emerging-metric">
            <span class="emerging-value">{{ emergingTopics.growingInterest }}%</span>
            <span class="emerging-label">Growing Interest</span>
            <span class="emerging-period">Week over week</span>
          </div>
        </div>
        
        <div class="new-beats">
          <h4 class="subsection-title">🎯 AI-Detected New Beats</h4>
          <div class="beats-list">
            <div 
              v-for="beat in newBeats"
              :key="beat.id"
              class="beat-item"
            >
              <div class="beat-info">
                <span class="beat-name">{{ beat.name }}</span>
                <span class="beat-description">{{ beat.description }}</span>
              </div>
              <div class="beat-metrics">
                <div class="beat-growth">
                  <span class="growth-label">Growth</span>
                  <span class="growth-value">+{{ beat.growth }}%</span>
                </div>
                <div class="beat-potential">
                  <span class="potential-label">Coverage Potential</span>
                  <span class="potential-badge" :class="beat.potential">{{ beat.potential }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="audience-shifts">
          <h4 class="subsection-title">👥 Audience Behavior Shifts</h4>
          <div class="shifts-list">
            <div 
              v-for="shift in audienceShifts"
              :key="shift.id"
              class="shift-item"
            >
              <div class="shift-icon">{{ shift.icon }}</div>
              <div class="shift-content">
                <span class="shift-title">{{ shift.title }}</span>
                <span class="shift-description">{{ shift.description }}</span>
              </div>
              <div class="shift-impact">
                <span class="impact-label">Impact</span>
                <span class="impact-value" :class="shift.impactLevel">{{ shift.impact }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Competitor Benchmarking -->
      <div class="content-card wide-card">
        <h3 class="card-title">🏆 Competitor Benchmarking</h3>
        <div class="benchmarking-overview">
          <div class="benchmark-tabs">
            <button 
              v-for="tab in benchmarkTabs"
              :key="tab.id"
              :class="['tab-button', { active: activeBenchmarkTab === tab.id }]"
              @click="activeBenchmarkTab = tab.id"
            >
              {{ tab.name }}
            </button>
          </div>
          
          <div class="benchmark-content">
            <div v-if="activeBenchmarkTab === 'national'" class="national-competitors">
              <div class="competitors-grid">
                <div 
                  v-for="competitor in nationalCompetitors"
                  :key="competitor.name"
                  class="competitor-card"
                >
                  <div class="competitor-header">
                    <span class="competitor-name">{{ competitor.name }}</span>
                    <span class="competitor-type">{{ competitor.type }}</span>
                  </div>
                  <div class="competitor-metrics">
                    <div class="competitor-metric">
                      <span class="metric-value">{{ formatNumber(competitor.traffic) }}</span>
                      <span class="metric-label">Monthly Traffic</span>
                      <span class="metric-trend" :class="competitor.trafficTrend">
                        {{ competitor.trafficChange > 0 ? '+' : '' }}{{ competitor.trafficChange }}%
                      </span>
                    </div>
                    <div class="competitor-metric">
                      <span class="metric-value">{{ competitor.engagement }}%</span>
                      <span class="metric-label">Engagement Rate</span>
                      <span class="metric-trend" :class="competitor.engagementTrend">
                        {{ competitor.engagementChange > 0 ? '+' : '' }}{{ competitor.engagementChange }}%
                      </span>
                    </div>
                  </div>
                  <div class="competitor-strengths">
                    <span class="strengths-label">Strong in:</span>
                    <div class="strengths-tags">
                      <span 
                        v-for="strength in competitor.strengths"
                        :key="strength"
                        class="strength-tag"
                      >
                        {{ strength }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else-if="activeBenchmarkTab === 'local'" class="local-competitors">
              <div class="local-performance">
                <h4 class="performance-title">Local Market Position</h4>
                <div class="market-position">
                  <div class="position-metric">
                    <span class="position-value">#{{ marketPosition.rank }}</span>
                    <span class="position-label">Market Rank</span>
                  </div>
                  <div class="position-metric">
                    <span class="position-value">{{ marketPosition.share }}%</span>
                    <span class="position-label">Market Share</span>
                  </div>
                  <div class="position-metric">
                    <span class="position-value">{{ marketPosition.lead }}pts</span>
                    <span class="position-label">Lead over #2</span>
                  </div>
                </div>
              </div>
              
              <div class="local-rivals-list">
                <h4 class="rivals-title">Local Rivals Performance</h4>
                <div class="rivals-comparison">
                  <div 
                    v-for="rival in localRivals"
                    :key="rival.name"
                    class="rival-item"
                  >
                    <div class="rival-info">
                      <span class="rival-name">{{ rival.name }}</span>
                      <span class="rival-focus">{{ rival.focus }}</span>
                    </div>
                    <div class="rival-comparison">
                      <div class="comparison-metric">
                        <span class="comparison-label">Traffic vs Us</span>
                        <span class="comparison-value" :class="rival.trafficComparison > 0 ? 'behind' : 'ahead'">
                          {{ rival.trafficComparison > 0 ? '+' : '' }}{{ rival.trafficComparison }}%
                        </span>
                      </div>
                      <div class="comparison-metric">
                        <span class="comparison-label">Social Reach</span>
                        <span class="comparison-value" :class="rival.socialComparison > 0 ? 'behind' : 'ahead'">
                          {{ rival.socialComparison > 0 ? '+' : '' }}{{ rival.socialComparison }}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="gannett-comparison">
              <div class="gannett-overview">
                <h4 class="gannett-title">Gannett Network Comparison</h4>
                <div class="gannett-metrics">
                  <div class="gannett-metric">
                    <span class="gannett-value">{{ gannettComparison.networkRank }}</span>
                    <span class="gannett-label">Network Rank</span>
                  </div>
                  <div class="gannett-metric">
                    <span class="gannett-value">{{ gannettComparison.trafficShare }}%</span>
                    <span class="gannett-label">Traffic Share</span>
                  </div>
                  <div class="gannett-metric">
                    <span class="gannett-value">{{ gannettComparison.digitalGrowth }}%</span>
                    <span class="gannett-label">Digital Growth</span>
                  </div>
                </div>
              </div>
              
              <div class="gannett-strengths">
                <h4 class="strengths-title">Where We Lead vs Gannett</h4>
                <div class="strength-areas">
                  <div 
                    v-for="area in vsGannettStrengths"
                    :key="area.category"
                    class="strength-area"
                  >
                    <div class="area-header">
                      <span class="area-name">{{ area.category }}</span>
                      <span class="area-advantage">{{ area.advantage }}</span>
                    </div>
                    <div class="area-description">{{ area.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Strategic Recommendations -->
      <div class="content-card large-card">
        <h3 class="card-title">💡 Strategic Recommendations</h3>
        <div class="recommendations-overview">
          <div class="recommendation-priority">
            <span class="priority-count">{{ recommendations.highPriority }}</span>
            <span class="priority-label">High Priority</span>
          </div>
          <div class="recommendation-priority">
            <span class="priority-count">{{ recommendations.mediumPriority }}</span>
            <span class="priority-label">Medium Priority</span>
          </div>
          <div class="recommendation-priority">
            <span class="priority-count">{{ recommendations.implemented }}</span>
            <span class="priority-label">Implemented</span>
          </div>
        </div>
        
        <div class="recommendations-list">
          <div 
            v-for="recommendation in strategicRecommendations"
            :key="recommendation.id"
            class="recommendation-item"
            :class="recommendation.priority"
          >
            <div class="recommendation-header">
              <div class="recommendation-title-area">
                <h5 class="recommendation-title">{{ recommendation.title }}</h5>
                <span class="recommendation-category">{{ recommendation.category }}</span>
              </div>
              <div class="recommendation-priority-badge" :class="recommendation.priority">
                {{ recommendation.priority }} Priority
              </div>
            </div>
            <div class="recommendation-content">
              <div class="recommendation-description">{{ recommendation.description }}</div>
              <div class="recommendation-impact">
                <span class="impact-label">Expected Impact:</span>
                <span class="impact-description">{{ recommendation.expectedImpact }}</span>
              </div>
            </div>
            <div class="recommendation-footer">
              <div class="recommendation-timeline">
                <span class="timeline-label">Timeline:</span>
                <span class="timeline-value">{{ recommendation.timeline }}</span>
              </div>
              <div class="recommendation-resources">
                <span class="resources-label">Resources:</span>
                <span class="resources-value">{{ recommendation.resources }}</span>
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

const activeBenchmarkTab = ref('national')

const benchmarkTabs = [
  { id: 'national', name: 'National Outlets' },
  { id: 'local', name: 'Local Rivals' },
  { id: 'gannett', name: 'vs Gannett' }
]

// Mock data - in real implementation, this would come from API calls
const contentGaps = ref({
  identifiedGaps: 23,
  competitorStories: 15,
  trendingTopics: 8
})

const missedOpportunities = ref([
  {
    id: 1,
    title: "Local Climate Resilience Planning",
    source: "Competitor tracking",
    timeframe: "Last 48 hours",
    description: "Regional competitors covering city's new climate adaptation strategy while we missed the announcement.",
    priority: "high",
    estimatedReach: "45K+"
  },
  {
    id: 2,
    title: "Tech Startup Funding Round",
    source: "Social media trends",
    timeframe: "Last 24 hours",
    description: "Local startup raises $15M Series A, trending on LinkedIn and Twitter in our market.",
    priority: "medium",
    estimatedReach: "28K+"
  },
  {
    id: 3,
    title: "School District Teacher Shortage Data",
    source: "Government data release",
    timeframe: "Last 72 hours",
    description: "State education department released detailed teacher shortage data by district.",
    priority: "high",
    estimatedReach: "62K+"
  }
])

const predictiveData = ref({
  accuracy: 87.3
})

const trendingPredictions = ref([
  {
    id: 1,
    title: "City Council Budget Vote Aftermath",
    category: "Politics",
    confidence: 92,
    trendScore: 8.7,
    peakTime: "2:00 PM",
    reasoning: "High social media activity + council meeting attendance + budget season timing"
  },
  {
    id: 2,
    title: "High School Championship Game",
    category: "Sports",
    confidence: 88,
    trendScore: 7.9,
    peakTime: "8:00 PM",
    reasoning: "Rivalry matchup + playoff implications + historical engagement patterns"
  },
  {
    id: 3,
    title: "Downtown Development Announcement",
    category: "Business",
    confidence: 76,
    trendScore: 6.8,
    peakTime: "10:00 AM",
    reasoning: "Developer permits filed + city planning meeting + community interest signals"
  }
])

const predictionAccuracy = ref([
  { type: "breaking", name: "Breaking News", accuracy: 94, predictions: 156, hits: 147 },
  { type: "sports", name: "Sports", accuracy: 91, predictions: 203, hits: 185 },
  { type: "politics", name: "Politics", accuracy: 85, predictions: 178, hits: 151 },
  { type: "business", name: "Business", accuracy: 79, predictions: 134, hits: 106 },
  { type: "entertainment", name: "Entertainment", accuracy: 72, predictions: 89, hits: 64 }
])

const emergingTopics = ref({
  newTopics: 12,
  growingInterest: 34.7
})

const newBeats = ref([
  {
    id: 1,
    name: "Climate Tech",
    description: "Local clean technology startups and environmental innovation",
    growth: 156,
    potential: "high"
  },
  {
    id: 2,
    name: "Remote Work Economy",
    description: "Impact of remote work on local business districts and housing",
    growth: 89,
    potential: "medium"
  },
  {
    id: 3,
    name: "Digital Equity",
    description: "Internet access and digital literacy in underserved communities",
    growth: 203,
    potential: "high"
  }
])

const audienceShifts = ref([
  {
    id: 1,
    icon: "📱",
    title: "Mobile-First News Consumption",
    description: "62% increase in mobile newsletter opens, 34% decrease in desktop visits",
    impact: "+23% engagement",
    impactLevel: "positive"
  },
  {
    id: 2,
    icon: "🎧",
    title: "Audio Content Preference",
    description: "Growing preference for podcast-style content and audio summaries",
    impact: "+67% audio engagement",
    impactLevel: "positive"
  },
  {
    id: 3,
    icon: "⏰",
    title: "Evening News Consumption",
    description: "Peak readership shifting from morning to 6-8 PM window",
    impact: "Timing opportunity",
    impactLevel: "neutral"
  }
])

const nationalCompetitors = ref([
  {
    name: "Washington Post",
    type: "National",
    traffic: 89500000,
    trafficChange: 8.7,
    trafficTrend: "positive",
    engagement: 4.8,
    engagementChange: 2.3,
    engagementTrend: "positive",
    strengths: ["Politics", "Investigations", "Digital Innovation"]
  },
  {
    name: "New York Times",
    type: "National",
    traffic: 145600000,
    trafficChange: 12.4,
    trafficTrend: "positive",
    engagement: 6.2,
    engagementChange: 1.9,
    engagementTrend: "positive",
    strengths: ["Subscriptions", "Multimedia", "International"]
  },
  {
    name: "USA Today",
    type: "National",
    traffic: 67800000,
    trafficChange: -3.1,
    trafficTrend: "negative",
    engagement: 3.4,
    engagementChange: -1.2,
    engagementTrend: "negative",
    strengths: ["Breaking News", "Sports", "Accessibility"]
  }
])

const marketPosition = ref({
  rank: 1,
  share: 34.7,
  lead: 12.3
})

const localRivals = ref([
  {
    name: "City Tribune",
    focus: "Government & Politics",
    trafficComparison: -23.4,
    socialComparison: -15.7
  },
  {
    name: "Metro Daily",
    focus: "Business & Development",
    trafficComparison: -18.9,
    socialComparison: 8.2
  },
  {
    name: "Regional Gazette",
    focus: "Community News",
    trafficComparison: -34.6,
    socialComparison: -22.1
  }
])

const gannettComparison = ref({
  networkRank: 3,
  trafficShare: 23.8,
  digitalGrowth: 15.4
})

const vsGannettStrengths = ref([
  {
    category: "Local Engagement",
    advantage: "+34% higher",
    description: "Community event attendance and local story engagement significantly outperforms Gannett properties"
  },
  {
    category: "Investigative Reporting",
    advantage: "2x more awards",
    description: "State and regional journalism awards for investigative pieces compared to similar-sized Gannett papers"
  },
  {
    category: "Social Media Growth",
    advantage: "+67% faster",
    description: "Year-over-year social media follower growth exceeds Gannett network average"
  }
])

const recommendations = ref({
  highPriority: 5,
  mediumPriority: 8,
  implemented: 12
})

const strategicRecommendations = ref([
  {
    id: 1,
    title: "Expand Evening Newsletter",
    category: "Audience Engagement",
    priority: "high",
    description: "Launch dedicated evening newsletter to capture shifted reading patterns and compete with national evening briefings.",
    expectedImpact: "25% increase in newsletter subscribers, 15% boost in evening traffic",
    timeline: "2-3 weeks",
    resources: "1 editor, email platform upgrade"
  },
  {
    id: 2,
    title: "Climate Tech Beat Coverage",
    category: "Editorial Strategy",
    priority: "high",
    description: "Establish dedicated coverage of local clean technology sector to capture emerging high-growth topic.",
    expectedImpact: "New audience segment, potential for national syndication",
    timeline: "1 month",
    resources: "1 reporter with tech background"
  },
  {
    id: 3,
    title: "Audio Content Pilot",
    category: "Content Innovation",
    priority: "medium",
    description: "Launch daily 5-minute audio news summary to meet growing demand for audio content consumption.",
    expectedImpact: "Capture audio-first audience, 20% engagement increase",
    timeline: "6-8 weeks",
    resources: "Audio equipment, editor training"
  },
  {
    id: 4,
    title: "Competitor Alert System",
    category: "Competitive Intelligence",
    priority: "medium",
    description: "Implement automated system to track competitor story coverage and identify missed opportunities in real-time.",
    expectedImpact: "Reduce missed stories by 60%, faster response time",
    timeline: "3-4 weeks",
    resources: "Development time, monitoring tools"
  },
  {
    id: 5,
    title: "Community Partnership Program",
    category: "Local Engagement",
    priority: "high",
    description: "Formalize partnerships with local organizations for exclusive story access and community event co-hosting.",
    expectedImpact: "Exclusive content pipeline, stronger community ties",
    timeline: "2 months",
    resources: "Partnership coordinator, event budget"
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
.forward-insights-section {
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

.gaps-analysis {
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

.gaps-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.gap-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  gap: 4px;
}

.gap-value {
  font-size: 28px;
  font-weight: 700;
  color: #ef4444;
}

.gap-label {
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

.opportunities-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.opportunity-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  gap: 16px;
}

.opportunity-item.high {
  background: #fef2f2;
  border-left: 4px solid #ef4444;
}

.opportunity-item.medium {
  background: #fffbeb;
  border-left: 4px solid #f59e0b;
}

.opportunity-item.low {
  background: #f0f9ff;
  border-left: 4px solid #3b82f6;
}

.opportunity-info {
  flex: 1;
}

.opportunity-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.opportunity-details {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

.opportunity-description {
  font-size: 14px;
  color: #374151;
  line-height: 1.4;
}

.opportunity-metrics {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 120px;
}

.opportunity-priority,
.opportunity-potential {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.priority-label,
.potential-label {
  font-size: 10px;
  color: #6b7280;
  text-transform: uppercase;
}

.priority-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.priority-badge.high {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.priority-badge.medium {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.priority-badge.low {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.potential-value {
  font-size: 12px;
  font-weight: 600;
  color: #10b981;
}

.prediction-overview {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.prediction-accuracy {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: #f0f9ff;
  border-radius: 12px;
  gap: 4px;
}

.accuracy-value {
  font-size: 48px;
  font-weight: 700;
  color: #3b82f6;
}

.accuracy-label {
  font-size: 16px;
  color: #111827;
  font-weight: 600;
}

.accuracy-period {
  font-size: 12px;
  color: #6b7280;
}

.predictions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.prediction-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  gap: 16px;
}

.prediction-content {
  flex: 1;
}

.prediction-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.prediction-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

.prediction-reasoning {
  font-size: 13px;
  color: #374151;
}

.reasoning-label {
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
}

.reasoning-text {
  font-style: italic;
  line-height: 1.4;
}

.prediction-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.prediction-score,
.prediction-timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.score-value {
  font-size: 24px;
  font-weight: 700;
  color: #10b981;
}

.score-label,
.timeline-label {
  font-size: 10px;
  color: #6b7280;
  text-transform: uppercase;
}

.timeline-value {
  font-size: 14px;
  font-weight: 600;
  color: #3b82f6;
}

.accuracy-breakdown {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.accuracy-category {
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
  font-weight: 600;
  color: #111827;
}

.category-accuracy {
  font-size: 16px;
  font-weight: 700;
  color: #10b981;
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
  background: linear-gradient(to right, #10b981, #059669);
  transition: width 0.3s ease;
}

.category-stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
}

.emerging-overview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.emerging-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f0fdf4;
  border-radius: 8px;
  gap: 4px;
}

.emerging-value {
  font-size: 28px;
  font-weight: 700;
  color: #10b981;
}

.emerging-label {
  font-size: 14px;
  color: #111827;
  font-weight: 600;
}

.emerging-period {
  font-size: 12px;
  color: #6b7280;
}

.beats-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.beat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  gap: 16px;
}

.beat-info {
  flex: 1;
}

.beat-name {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.beat-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}

.beat-metrics {
  display: flex;
  gap: 16px;
}

.beat-growth,
.beat-potential {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.growth-label {
  font-size: 10px;
  color: #6b7280;
  text-transform: uppercase;
}

.growth-value {
  font-size: 16px;
  font-weight: 700;
  color: #10b981;
}

.potential-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.potential-badge.high {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.potential-badge.medium {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.shifts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.shift-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.shift-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.shift-content {
  flex: 1;
}

.shift-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.shift-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}

.shift-impact {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.impact-label {
  font-size: 10px;
  color: #6b7280;
  text-transform: uppercase;
}

.impact-value {
  font-size: 14px;
  font-weight: 600;
}

.impact-value.positive {
  color: #10b981;
}

.impact-value.negative {
  color: #ef4444;
}

.impact-value.neutral {
  color: #6b7280;
}

.benchmarking-overview {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.benchmark-tabs {
  display: flex;
  gap: 8px;
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

.competitors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.competitor-card {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.competitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.competitor-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.competitor-type {
  font-size: 12px;
  color: #6b7280;
  background: #e5e7eb;
  padding: 2px 6px;
  border-radius: 4px;
}

.competitor-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.competitor-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-value {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.metric-label {
  font-size: 12px;
  color: #6b7280;
  flex: 1;
  margin-left: 8px;
}

.metric-trend {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 4px;
  border-radius: 2px;
}

.metric-trend.positive {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.metric-trend.negative {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.competitor-strengths {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.strengths-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
}

.strengths-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.strength-tag {
  font-size: 10px;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  padding: 2px 6px;
  border-radius: 8px;
}

.local-performance {
  margin-bottom: 32px;
}

.performance-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
}

.market-position {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.position-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f0f9ff;
  border-radius: 8px;
  gap: 4px;
}

.position-value {
  font-size: 28px;
  font-weight: 700;
  color: #3b82f6;
}

.position-label {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

.rivals-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
}

.rivals-comparison {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rival-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  gap: 16px;
}

.rival-info {
  flex: 1;
}

.rival-name {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.rival-focus {
  font-size: 12px;
  color: #6b7280;
}

.rival-comparison {
  display: flex;
  gap: 16px;
}

.comparison-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.comparison-label {
  font-size: 10px;
  color: #6b7280;
  text-transform: uppercase;
}

.comparison-value {
  font-size: 14px;
  font-weight: 600;
}

.comparison-value.ahead {
  color: #10b981;
}

.comparison-value.behind {
  color: #ef4444;
}

.gannett-overview {
  margin-bottom: 32px;
}

.gannett-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
}

.gannett-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.gannett-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #fef3c7;
  border-radius: 8px;
  gap: 4px;
}

.gannett-value {
  font-size: 28px;
  font-weight: 700;
  color: #d97706;
}

.gannett-label {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

.strengths-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
}

.strength-areas {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.strength-area {
  padding: 16px;
  background: #f0fdf4;
  border-radius: 8px;
  border-left: 4px solid #10b981;
}

.area-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.area-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.area-advantage {
  font-size: 14px;
  font-weight: 700;
  color: #10b981;
}

.area-description {
  font-size: 14px;
  color: #374151;
  line-height: 1.4;
}

.recommendations-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.recommendation-priority {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  gap: 4px;
}

.priority-count {
  font-size: 28px;
  font-weight: 700;
  color: #3b82f6;
}

.priority-label {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.recommendation-item {
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #e5e7eb;
}

.recommendation-item.high {
  background: #fef2f2;
  border-left-color: #ef4444;
}

.recommendation-item.medium {
  background: #fffbeb;
  border-left-color: #f59e0b;
}

.recommendation-item.low {
  background: #f0f9ff;
  border-left-color: #3b82f6;
}

.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 16px;
}

.recommendation-title-area {
  flex: 1;
}

.recommendation-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.recommendation-category {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.recommendation-priority-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.recommendation-priority-badge.high {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.recommendation-priority-badge.medium {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.recommendation-priority-badge.low {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.recommendation-content {
  margin-bottom: 16px;
}

.recommendation-description {
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
  margin-bottom: 12px;
}

.recommendation-impact {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.impact-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
}

.impact-description {
  font-size: 14px;
  color: #10b981;
  font-weight: 500;
}

.recommendation-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.recommendation-timeline,
.recommendation-resources {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline-label,
.resources-label {
  font-size: 10px;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 600;
}

.timeline-value,
.resources-value {
  font-size: 12px;
  color: #374151;
  font-weight: 500;
}

@media (max-width: 1024px) {
  .gaps-analysis,
  .large-card,
  .wide-card {
    grid-column: span 1;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .competitors-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .gaps-overview,
  .emerging-overview,
  .market-position,
  .gannett-metrics,
  .recommendations-overview {
    grid-template-columns: 1fr;
  }
  
  .opportunity-item,
  .prediction-item,
  .beat-item,
  .rival-item,
  .recommendation-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .opportunity-metrics,
  .prediction-metrics,
  .beat-metrics,
  .rival-comparison {
    flex-direction: row;
    justify-content: space-around;
  }
  
  .recommendation-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .recommendation-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
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
  .performance-title,
  .rivals-title,
  .gannett-title,
  .strengths-title {
    color: #f9fafb;
  }
  
  .gap-metric {
    background: #7f1d1d;
    border-color: #991b1b;
  }
  
  .opportunity-item,
  .prediction-item,
  .beat-item,
  .shift-item,
  .competitor-card,
  .rival-item,
  .strength-area,
  .recommendation-item {
    background: #111827;
  }
  
  .opportunity-title,
  .prediction-title,
  .beat-name,
  .shift-title,
  .competitor-name,
  .rival-name,
  .area-name,
  .recommendation-title {
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