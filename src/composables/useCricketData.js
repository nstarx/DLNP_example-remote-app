import { ref, computed } from 'vue'

export function useCricketData() {
  // Mock data for India vs England test match
  const matchData = ref({
    teams: {
      india: {
        name: 'India',
        innings: [
          { runs: 445, wickets: 7, overs: 120.4, declared: false }
        ]
      },
      england: {
        name: 'England', 
        innings: [
          { runs: 218, wickets: 10, overs: 57.4, declared: false }
        ]
      }
    },
    currentInnings: 'india',
    currentBatsmen: [
      { name: 'R. Sharma', runs: 89, balls: 142, fours: 8, sixes: 2, notOut: true },
      { name: 'R. Jadeja', runs: 34, balls: 67, fours: 3, sixes: 0, notOut: true }
    ],
    currentBowler: { name: 'J. Root', overs: 12.4, runs: 34, wickets: 1 },
    partnership: { runs: 67, balls: 98 }
  })

  // Match progression data for charts
  const matchProgressionData = computed(() => ({
    labels: Array.from({ length: 121 }, (_, i) => i + 1),
    datasets: [
      {
        label: 'India Run Rate',
        data: generateRunProgressionData(445, 120.4),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'England Run Rate', 
        data: generateRunProgressionData(218, 57.4),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }))

  // Batting statistics
  const battingStats = computed(() => ({
    title: 'Batting Performance',
    metrics: [
      { label: 'Highest Score', value: '89*', player: 'R. Sharma' },
      { label: 'Best Partnership', value: '123', players: 'Kohli & Sharma' },
      { label: 'Strike Rate', value: '58.2', description: 'Current innings' },
      { label: 'Boundaries', value: '47', description: '4s: 35, 6s: 12' }
    ]
  }))

  // Bowling statistics
  const bowlingStats = computed(() => ({
    title: 'Bowling Performance',
    metrics: [
      { label: 'Best Figures', value: '4/67', player: 'J. Anderson' },
      { label: 'Economy Rate', value: '3.8', description: 'Last 10 overs' },
      { label: 'Wickets', value: '7', description: 'Total wickets' },
      { label: 'Extras', value: '23', description: 'Byes: 8, LBs: 12, Wides: 3' }
    ]
  }))

  // Partnership analysis
  const partnerships = computed(() => ({
    title: 'Partnership Analysis',
    current: { runs: 67, balls: 98, runRate: 4.1 },
    history: [
      { wicket: 1, runs: 45, batsmen: ['Rohit', 'Gill'], balls: 78 },
      { wicket: 2, runs: 89, batsmen: ['Rohit', 'Pujara'], balls: 134 },
      { wicket: 3, runs: 123, batsmen: ['Rohit', 'Kohli'], balls: 178 },
      { wicket: 4, runs: 34, batsmen: ['Rohit', 'Rahul'], balls: 67 },
      { wicket: 5, runs: 78, batsmen: ['Rohit', 'Pant'], balls: 89 },
      { wicket: 6, runs: 23, batsmen: ['Rohit', 'Ashwin'], balls: 45 }
    ]
  }))

  // Run rate analysis
  const runRateData = computed(() => ({
    title: 'Run Rate Analysis',
    currentRR: 3.69,
    requiredRR: null,
    overAnalysis: [
      { over: '1-15', runs: 67, rr: 4.47 },
      { over: '16-30', runs: 89, rr: 5.93 },
      { over: '31-60', runs: 134, rr: 4.47 },
      { over: '61-90', runs: 98, rr: 3.27 },
      { over: '91-120', runs: 57, rr: 1.90 }
    ]
  }))

  // Wagon wheel data for shot analysis
  const wagonWheelData = computed(() => ({
    title: 'Shot Analysis - R. Sharma',
    shots: [
      { angle: 45, distance: 4, runs: 4, shotType: 'cover drive' },
      { angle: 90, distance: 6, runs: 6, shotType: 'pull shot' },
      { angle: 135, distance: 4, runs: 4, shotType: 'square drive' },
      { angle: 180, distance: 2, runs: 2, shotType: 'glance' },
      { angle: 225, distance: 4, runs: 4, shotType: 'sweep' },
      { angle: 270, distance: 6, runs: 6, shotType: 'slog sweep' },
      { angle: 315, distance: 4, runs: 4, shotType: 'cut shot' },
      { angle: 0, distance: 4, runs: 4, shotType: 'straight drive' }
    ]
  }))

  // Pitch map data
  const pitchMapData = computed(() => ({
    title: 'Pitch Map - Last 10 Overs',
    deliveries: generatePitchMapData(60)
  }))

  // Player performance radar
  const playerPerformanceData = computed(() => ({
    title: 'Player Performance Comparison',
    players: [
      {
        name: 'R. Sharma',
        stats: {
          batting: 85,
          consistency: 78,
          strikeRate: 62,
          boundaries: 80,
          pressure: 88
        }
      },
      {
        name: 'J. Root',
        stats: {
          batting: 75,
          consistency: 82,
          strikeRate: 58,
          boundaries: 65,
          pressure: 85
        }
      }
    ]
  }))

  // Match momentum
  const momentumData = computed(() => ({
    title: 'Match Momentum',
    timeline: generateMomentumData(),
    currentMomentum: 'India'
  }))

  // Scorecard data
  const scorecardData = computed(() => ({
    india: {
      innings1: {
        batsmen: [
          { name: 'R. Sharma', runs: 89, balls: 142, fours: 8, sixes: 2, notOut: true, dismissal: null },
          { name: 'S. Gill', runs: 34, balls: 67, fours: 4, sixes: 0, notOut: false, dismissal: 'c Root b Anderson' },
          { name: 'C. Pujara', runs: 67, balls: 123, fours: 6, sixes: 0, notOut: false, dismissal: 'lbw b Stokes' },
          { name: 'V. Kohli', runs: 78, balls: 134, fours: 8, sixes: 1, notOut: false, dismissal: 'b Broad' },
          { name: 'K. Rahul', runs: 23, balls: 45, fours: 2, sixes: 0, notOut: false, dismissal: 'c Bairstow b Root' },
          { name: 'R. Pant', runs: 45, balls: 67, fours: 4, sixes: 2, notOut: false, dismissal: 'c Stokes b Anderson' },
          { name: 'R. Ashwin', runs: 12, balls: 23, fours: 1, sixes: 0, notOut: false, dismissal: 'c Pope b Broad' },
          { name: 'R. Jadeja', runs: 34, balls: 67, fours: 3, sixes: 0, notOut: true, dismissal: null }
        ],
        total: 445,
        wickets: 7,
        overs: 120.4,
        extras: { byes: 8, legByes: 12, wides: 3, noBalls: 0 }
      }
    },
    england: {
      innings1: {
        batsmen: [
          { name: 'Z. Crawley', runs: 23, balls: 34, fours: 3, sixes: 0, notOut: false, dismissal: 'c Pant b Bumrah' },
          { name: 'B. Duckett', runs: 45, balls: 67, fours: 6, sixes: 0, notOut: false, dismissal: 'lbw b Ashwin' },
          { name: 'O. Pope', runs: 12, balls: 23, fours: 1, sixes: 0, notOut: false, dismissal: 'c Gill b Jadeja' },
          { name: 'J. Root', runs: 56, balls: 89, fours: 5, sixes: 0, notOut: false, dismissal: 'c Sharma b Ashwin' },
          { name: 'H. Brook', runs: 34, balls: 45, fours: 4, sixes: 0, notOut: false, dismissal: 'b Bumrah' },
          { name: 'B. Stokes', runs: 28, balls: 56, fours: 2, sixes: 1, notOut: false, dismissal: 'c Kohli b Jadeja' },
          { name: 'J. Bairstow', runs: 8, balls: 12, fours: 1, sixes: 0, notOut: false, dismissal: 'c Pant b Ashwin' },
          { name: 'S. Broad', runs: 5, balls: 8, fours: 0, sixes: 0, notOut: false, dismissal: 'not out' },
          { name: 'J. Anderson', runs: 2, balls: 6, fours: 0, sixes: 0, notOut: false, dismissal: 'b Bumrah' },
          { name: 'M. Wood', runs: 1, balls: 3, fours: 0, sixes: 0, notOut: false, dismissal: 'c Jadeja b Ashwin' },
          { name: 'T. Hartley', runs: 4, balls: 7, fours: 0, sixes: 0, notOut: false, dismissal: 'lbw b Bumrah' }
        ],
        total: 218,
        wickets: 10,
        overs: 57.4,
        extras: { byes: 4, legByes: 8, wides: 2, noBalls: 1 }
      }
    }
  }))

  // Bowling data
  const bowlingData = computed(() => ({
    india: [
      { name: 'J. Bumrah', overs: 15.4, runs: 67, wickets: 4, economy: 4.27, maidens: 2 },
      { name: 'M. Siraj', overs: 12, runs: 45, wickets: 0, economy: 3.75, maidens: 1 },
      { name: 'R. Ashwin', overs: 18, runs: 78, wickets: 4, economy: 4.33, maidens: 3 },
      { name: 'R. Jadeja', overs: 12, runs: 28, wickets: 2, economy: 2.33, maidens: 4 }
    ],
    england: [
      { name: 'J. Anderson', overs: 28, runs: 89, wickets: 2, economy: 3.18, maidens: 8 },
      { name: 'S. Broad', overs: 24, runs: 76, wickets: 2, economy: 3.17, maidens: 6 },
      { name: 'B. Stokes', overs: 15, runs: 67, wickets: 1, economy: 4.47, maidens: 2 },
      { name: 'J. Root', overs: 18, runs: 45, wickets: 1, economy: 2.50, maidens: 5 },
      { name: 'T. Hartley', overs: 35.4, runs: 145, wickets: 1, economy: 4.06, maidens: 7 }
    ]
  }))

  // Partnership data
  const partnershipData = computed(() => partnerships.value.history)

  // Fall of wickets data
  const fallOfWicketsData = computed(() => ([
    { wicket: 1, runs: 45, batsman: 'S. Gill', bowler: 'J. Anderson', over: 12.3 },
    { wicket: 2, runs: 134, batsman: 'C. Pujara', bowler: 'B. Stokes', over: 28.5 },
    { wicket: 3, runs: 257, batsman: 'V. Kohli', bowler: 'S. Broad', over: 67.2 },
    { wicket: 4, runs: 291, batsman: 'K. Rahul', bowler: 'J. Root', over: 78.4 },
    { wicket: 5, runs: 369, batsman: 'R. Pant', bowler: 'J. Anderson', over: 98.1 },
    { wicket: 6, runs: 392, batsman: 'R. Ashwin', bowler: 'S. Broad', over: 108.3 },
    { wicket: 7, runs: 445, batsman: 'Current', bowler: 'In progress', over: 120.4 }
  ]))

  // Helper functions
  function generateRunProgressionData(totalRuns, totalOvers) {
    const data = []
    const oversInt = Math.floor(totalOvers)
    
    for (let i = 0; i <= oversInt; i++) {
      // Generate realistic run progression with some variation
      const baseRuns = (totalRuns / totalOvers) * i
      const variation = Math.random() * 20 - 10
      data.push(Math.max(0, Math.round(baseRuns + variation)))
    }
    
    return data
  }

  function generatePitchMapData(deliveries) {
    const pitchData = []
    
    for (let i = 0; i < deliveries; i++) {
      pitchData.push({
        x: Math.random() * 100, // Length percentage
        y: Math.random() * 100, // Width percentage
        outcome: Math.random() > 0.7 ? 'boundary' : Math.random() > 0.5 ? 'single' : 'dot',
        bowler: Math.random() > 0.5 ? 'Anderson' : 'Broad',
        ball: i + 1
      })
    }
    
    return pitchData
  }

  function generateMomentumData() {
    const timeline = []
    const events = [
      { over: 5, momentum: 'India', event: 'Rohit boundaries' },
      { over: 15, momentum: 'England', event: 'Gill wicket' },
      { over: 25, momentum: 'India', event: 'Pujara-Kohli partnership' },
      { over: 45, momentum: 'India', event: 'Kohli fifty' },
      { over: 65, momentum: 'England', event: 'Kohli wicket' },
      { over: 85, momentum: 'India', event: 'Pant counterattack' },
      { over: 95, momentum: 'England', event: 'Quick wickets' },
      { over: 115, momentum: 'India', event: 'Sharma-Jadeja partnership' }
    ]
    
    return events
  }

  function refreshData() {
    // In a real application, this would fetch live data from an API
    console.log('Refreshing cricket data...')
    // Mock data refresh - in real app would update with live scores
  }

  return {
    matchProgressionData,
    battingStats,
    bowlingStats,
    partnerships,
    runRateData,
    wagonWheelData,
    pitchMapData,
    playerPerformanceData,
    momentumData,
    scorecardData,
    bowlingData,
    partnershipData,
    fallOfWicketsData,
    refreshData
  }
}