// NEXUS v3.0 - Network Register API
// Vercel Serverless Function

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { playerId, name } = req.body;

  // Demo registration (tanpa database)
  res.json({
    success: true,
    player: {
      id: playerId,
      name: name || 'Detektif',
      rank: 'KADET',
      points: 0,
      solvedCases: 0,
      joinedAt: new Date().toISOString()
    }
  });
}

