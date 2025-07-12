// FIFA Club World Cup USA 2025 Data
export const fifaClubWorldCup2025 = {
  tournament: {
    name: "FIFA Club World Cup USA 2025",
    dates: "June 15 - July 13, 2025",
    format: "32 teams, 8 groups of 4 teams each",
    totalMatches: 63,
    venues: 12,
    prizePool: "$100 million"
  },
  
  venues: [
    { name: "MetLife Stadium", city: "New York", capacity: 82500, matches: 6 },
    { name: "Rose Bowl", city: "Los Angeles", capacity: 88565, matches: 5 },
    { name: "AT&T Stadium", city: "Dallas", capacity: 80000, matches: 5 },
    { name: "Mercedes-Benz Stadium", city: "Atlanta", capacity: 75000, matches: 4 },
    { name: "Hard Rock Stadium", city: "Miami", capacity: 67518, matches: 4 },
    { name: "Soldier Field", city: "Chicago", capacity: 61500, matches: 4 },
    { name: "CenturyLink Field", city: "Seattle", capacity: 69000, matches: 4 },
    { name: "Gillette Stadium", city: "Boston", capacity: 66829, matches: 4 },
    { name: "Lincoln Financial Field", city: "Philadelphia", capacity: 69596, matches: 4 },
    { name: "NRG Stadium", city: "Houston", capacity: 71995, matches: 4 },
    { name: "State Farm Stadium", city: "Phoenix", capacity: 63400, matches: 4 },
    { name: "Allegiant Stadium", city: "Las Vegas", capacity: 65000, matches: 4 }
  ],

  teams: [
    // Europe (12 teams)
    { name: "Manchester City", country: "England", continent: "Europe", ranking: 1, titles: 0, marketValue: 1200, players: 28 },
    { name: "Real Madrid", country: "Spain", continent: "Europe", ranking: 2, titles: 5, marketValue: 1100, players: 27 },
    { name: "Bayern Munich", country: "Germany", continent: "Europe", ranking: 3, titles: 2, marketValue: 1050, players: 26 },
    { name: "Paris Saint-Germain", country: "France", continent: "Europe", ranking: 4, titles: 0, marketValue: 900, players: 25 },
    { name: "Arsenal", country: "England", continent: "Europe", ranking: 5, titles: 0, marketValue: 800, players: 24 },
    { name: "Barcelona", country: "Spain", continent: "Europe", ranking: 6, titles: 3, marketValue: 850, players: 26 },
    { name: "Liverpool", country: "England", continent: "Europe", ranking: 7, titles: 1, marketValue: 780, players: 25 },
    { name: "Chelsea", country: "England", continent: "Europe", ranking: 8, titles: 1, marketValue: 750, players: 24 },
    { name: "Juventus", country: "Italy", continent: "Europe", ranking: 9, titles: 2, marketValue: 650, players: 25 },
    { name: "Inter Milan", country: "Italy", continent: "Europe", ranking: 10, titles: 3, marketValue: 600, players: 24 },
    { name: "Borussia Dortmund", country: "Germany", continent: "Europe", ranking: 11, titles: 1, marketValue: 500, players: 23 },
    { name: "Atletico Madrid", country: "Spain", continent: "Europe", ranking: 12, titles: 0, marketValue: 450, players: 22 },
    
    // South America (6 teams)
    { name: "Flamengo", country: "Brazil", continent: "South America", ranking: 13, titles: 1, marketValue: 200, players: 22 },
    { name: "Palmeiras", country: "Brazil", continent: "South America", ranking: 14, titles: 2, marketValue: 180, players: 21 },
    { name: "River Plate", country: "Argentina", continent: "South America", ranking: 15, titles: 1, marketValue: 150, players: 20 },
    { name: "Boca Juniors", country: "Argentina", continent: "South America", ranking: 16, titles: 3, marketValue: 140, players: 19 },
    { name: "Sao Paulo", country: "Brazil", continent: "South America", ranking: 17, titles: 3, marketValue: 130, players: 20 },
    { name: "Estudiantes", country: "Argentina", continent: "South America", ranking: 18, titles: 1, marketValue: 120, players: 19 },
    
    // North America (4 teams)
    { name: "Seattle Sounders", country: "USA", continent: "North America", ranking: 19, titles: 0, marketValue: 80, players: 18 },
    { name: "Monterrey", country: "Mexico", continent: "North America", ranking: 20, titles: 1, marketValue: 75, players: 17 },
    { name: "LAFC", country: "USA", continent: "North America", ranking: 21, titles: 0, marketValue: 70, players: 16 },
    { name: "Club America", country: "Mexico", continent: "North America", ranking: 22, titles: 1, marketValue: 65, players: 15 },
    
    // Asia (4 teams)
    { name: "Al-Hilal", country: "Saudi Arabia", continent: "Asia", ranking: 23, titles: 0, marketValue: 60, players: 14 },
    { name: "Urawa Red Diamonds", country: "Japan", continent: "Asia", ranking: 24, titles: 1, marketValue: 55, players: 13 },
    { name: "Jeonbuk Hyundai", country: "South Korea", continent: "Asia", ranking: 25, titles: 0, marketValue: 50, players: 12 },
    { name: "Guangzhou FC", country: "China", continent: "Asia", ranking: 26, titles: 0, marketValue: 45, players: 11 },
    
    // Africa (4 teams)
    { name: "Wydad Casablanca", country: "Morocco", continent: "Africa", ranking: 27, titles: 1, marketValue: 40, players: 10 },
    { name: "Al Ahly", country: "Egypt", continent: "Africa", ranking: 28, titles: 2, marketValue: 35, players: 9 },
    { name: "Mamelodi Sundowns", country: "South Africa", continent: "Africa", ranking: 29, titles: 0, marketValue: 30, players: 8 },
    { name: "Esperance Tunis", country: "Tunisia", continent: "Africa", ranking: 30, titles: 1, marketValue: 25, players: 7 },
    
    // Oceania (2 teams)
    { name: "Auckland City", country: "New Zealand", continent: "Oceania", ranking: 31, titles: 0, marketValue: 20, players: 6 },
    { name: "Sydney FC", country: "Australia", continent: "Oceania", ranking: 32, titles: 0, marketValue: 18, players: 5 }
  ],

  groups: {
    "Group A": ["Manchester City", "Flamengo", "Seattle Sounders", "Al-Hilal"],
    "Group B": ["Real Madrid", "Palmeiras", "Monterrey", "Urawa Red Diamonds"],
    "Group C": ["Bayern Munich", "River Plate", "LAFC", "Jeonbuk Hyundai"],
    "Group D": ["Paris Saint-Germain", "Boca Juniors", "Club America", "Guangzhou FC"],
    "Group E": ["Arsenal", "Sao Paulo", "Wydad Casablanca", "Auckland City"],
    "Group F": ["Barcelona", "Estudiantes", "Al Ahly", "Sydney FC"],
    "Group G": ["Liverpool", "Chelsea", "Mamelodi Sundowns", "Esperance Tunis"],
    "Group H": ["Juventus", "Inter Milan", "Borussia Dortmund", "Atletico Madrid"]
  },

  // Mock match results and statistics
  matchResults: [
    { team1: "Manchester City", team2: "Flamengo", score: "3-1", goals: [4], assists: [2], yellowCards: 3, redCards: 0, possession: [65, 35] },
    { team1: "Real Madrid", team2: "Palmeiras", score: "2-0", goals: [2], assists: [1], yellowCards: 2, redCards: 0, possession: [58, 42] },
    { team1: "Bayern Munich", team2: "River Plate", score: "4-2", goals: [6], assists: [3], yellowCards: 4, redCards: 1, possession: [72, 28] },
    { team1: "Paris Saint-Germain", team2: "Boca Juniors", score: "1-1", goals: [2], assists: [2], yellowCards: 5, redCards: 0, possession: [55, 45] },
    { team1: "Arsenal", team2: "Sao Paulo", score: "3-0", goals: [3], assists: [2], yellowCards: 1, redCards: 0, possession: [63, 37] },
    { team1: "Barcelona", team2: "Estudiantes", score: "2-1", goals: [3], assists: [1], yellowCards: 3, redCards: 0, possession: [69, 31] },
    { team1: "Liverpool", team2: "Chelsea", score: "1-2", goals: [3], assists: [2], yellowCards: 4, redCards: 0, possession: [48, 52] },
    { team1: "Juventus", team2: "Inter Milan", score: "0-0", goals: [0], assists: [0], yellowCards: 6, redCards: 2, possession: [50, 50] }
  ],

  // Performance metrics for EDA
  performanceMetrics: {
    goalsScoredAvg: [2.1, 1.8, 2.5, 1.9, 2.3, 2.0, 1.7, 1.5, 1.9, 2.2, 1.6, 1.8, 3.1, 2.8, 2.7, 2.9, 2.6, 2.4, 1.2, 1.4, 1.3, 1.1, 0.9, 1.0, 1.1, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2],
    goalsConcededAvg: [0.8, 0.9, 1.1, 1.2, 1.0, 1.3, 1.4, 1.1, 1.6, 1.3, 1.8, 1.9, 1.2, 1.1, 1.4, 1.3, 1.5, 1.6, 2.1, 1.9, 2.0, 2.2, 2.5, 2.3, 2.4, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2],
    possessionAvg: [68, 65, 72, 61, 63, 69, 58, 56, 54, 59, 52, 55, 48, 51, 49, 47, 46, 45, 42, 44, 43, 41, 38, 40, 39, 37, 36, 35, 34, 33, 32, 31],
    passingAccuracy: [89, 87, 91, 85, 86, 88, 84, 82, 80, 83, 78, 81, 75, 77, 76, 74, 73, 72, 69, 71, 70, 68, 65, 67, 66, 64, 63, 62, 61, 60, 59, 58]
  },

  // Historical data for trend analysis
  historicalData: {
    years: [2000, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2021, 2022, 2023, 2024],
    totalGoals: [17, 19, 23, 25, 22, 24, 26, 28, 31, 29, 33, 35, 32, 34, 36, 38, 40, 42, 44, 46],
    avgAttendance: [45000, 52000, 48000, 51000, 49000, 53000, 55000, 57000, 59000, 61000, 63000, 65000, 67000, 69000, 71000, 73000, 45000, 48000, 52000, 55000]
  },

  // EDA insights
  insights: {
    continentStrength: {
      Europe: { avgRanking: 7.5, titles: 18, marketValue: 750 },
      "South America": { avgRanking: 15.5, titles: 11, marketValue: 153 },
      "North America": { avgRanking: 20.5, titles: 2, marketValue: 73 },
      Asia: { avgRanking: 24.5, titles: 1, marketValue: 53 },
      Africa: { avgRanking: 28.5, titles: 4, marketValue: 33 },
      Oceania: { avgRanking: 31.5, titles: 0, marketValue: 19 }
    },
    topScorers: [
      { name: "Kylian Mbappé", team: "Paris Saint-Germain", goals: 8, assists: 4 },
      { name: "Erling Haaland", team: "Manchester City", goals: 7, assists: 2 },
      { name: "Karim Benzema", team: "Real Madrid", goals: 6, assists: 3 },
      { name: "Robert Lewandowski", team: "Barcelona", goals: 5, assists: 1 },
      { name: "Harry Kane", team: "Bayern Munich", goals: 5, assists: 3 }
    ],
    attendance: {
      totalAttendance: 1850000,
      averageAttendance: 58730,
      highestAttendance: 88565,
      lowestAttendance: 45000
    }
  }
};

// Export functions for data analysis
export const getTeamsByContinent = (continent) => {
  return fifaClubWorldCup2025.teams.filter(team => team.continent === continent);
};

export const getTopTeamsByMarketValue = (limit = 10) => {
  return fifaClubWorldCup2025.teams
    .sort((a, b) => b.marketValue - a.marketValue)
    .slice(0, limit);
};

export const getTeamsByTitles = () => {
  return fifaClubWorldCup2025.teams
    .filter(team => team.titles > 0)
    .sort((a, b) => b.titles - a.titles);
};

export const getContinentStats = () => {
  const continents = {};
  fifaClubWorldCup2025.teams.forEach(team => {
    if (!continents[team.continent]) {
      continents[team.continent] = {
        teams: 0,
        totalMarketValue: 0,
        totalTitles: 0,
        avgRanking: 0
      };
    }
    continents[team.continent].teams += 1;
    continents[team.continent].totalMarketValue += team.marketValue;
    continents[team.continent].totalTitles += team.titles;
    continents[team.continent].avgRanking += team.ranking;
  });
  
  Object.keys(continents).forEach(continent => {
    continents[continent].avgRanking = continents[continent].avgRanking / continents[continent].teams;
    continents[continent].avgMarketValue = continents[continent].totalMarketValue / continents[continent].teams;
  });
  
  return continents;
};