// NEXUS v3.0 - Network Register API
// Vercel Serverless Function

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { playerId, name } = req.body;
  
  // Simple in-memory storage (reset on cold start)
  // In production, use a database like Vercel KV or Redis
  
  res.json({
    success: true,
    player: {
      id: playerId,
      name: name || `Detektif ${playerId.slice(-4)}`,
      points: 0,
      rank: 'KADET',
      solved: 0,
      joinedAt: new Date().toISOString()
    },
    stats: {
      totalPlayers: 1,
      activeLast24h: 1
    }
  });
}

