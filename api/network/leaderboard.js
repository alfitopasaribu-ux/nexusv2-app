// NEXUS v3.0 - Network Leaderboard API
// Vercel Serverless Function

export default function handler(req, res) {
  const { type = 'points', limit = 50 } = req.query;
  
  // Mock leaderboard data (dalam production, gunakan database)
  const leaderboard = [
    { id: 1, name: "Detective Alpha", points: 15000, rank: "NEXUS ORACLE", solved: 45 },
    { id: 2, name: "Detective Beta", points: 12000, rank: "PIKIRAN SHERLOCK", solved: 38 },
    { id: 3, name: "Detective Gamma", points: 8500, rank: "DETEKTIF UTAMA", solved: 28 },
    { id: 4, name: "Detective Delta", points: 6200, rank: "ANALIS KRIMINAL", solved: 22 },
    { id: 5, name: "Detective Epsilon", points: 4100, rank: "INVESTIGATOR", solved: 15 },
    { id: 6, name: "Detective Zeta", points: 2800, rank: "DETEKTIF JUNIOR", solved: 10 },
    { id: 7, name: "Detective Eta", points: 1500, rank: "DETEKTIF JUNIOR", solved: 6 },
    { id: 8, name: "Detective Theta", points: 800, rank: "KADET", solved: 3 },
  ];
  
  // Sort by type
  const sorted = [...leaderboard].sort((a, b) => {
    if (type === 'solved') return b.solved - a.solved;
    return b.points - a.points;
  }).slice(0, parseInt(limit));
  
  res.json({
    success: true,
    leaderboard: sorted,
    stats: {
      totalPlayers: leaderboard.length,
      activeLast24h: Math.floor(leaderboard.length * 0.7)
    }
  });
}

