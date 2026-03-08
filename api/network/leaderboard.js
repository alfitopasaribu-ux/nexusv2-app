// NEXUS v3.0 - Leaderboard API
// Vercel Serverless Function

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sort = 'points', limit = 20 } = req.query;

  // Demo leaderboard
  const demoLeaderboard = [
    { id: '1', name: 'Detektif Alpha', rank: 'NEXUS ORACLE', points: 45200, solved: 89 },
    { id: '2', name: 'Detektif Beta', rank: 'PIKIRAN SHERLOCK', points: 32100, solved: 67 },
    { id: '3', name: 'Detektif Gamma', rank: 'DETEKTIF UTAMA', points: 28400, solved: 54 },
    { id: '4', name: 'Detektif Delta', rank: 'ANALIS KRIMINAL', points: 18900, solved: 42 },
    { id: '5', name: 'Detektif Epsilon', rank: 'INVESTIGATOR', points: 12400, solved: 31 },
  ];

  res.json({
    success: true,
    leaderboard: demoLeaderboard.slice(0, parseInt(limit)),
    stats: {
      totalPlayers: 127,
      activeLast24h: 23
    }
  });
}

