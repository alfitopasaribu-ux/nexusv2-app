// NEXUS v3.0 - Interrogation Start API
// Vercel Serverless Function

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { caseId, suspectId, playerId } = req.body;
  
  // Generate session ID
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  res.json({
    success: true,
    sessionId,
    suspect: {
      name: "Tersangka",
      personality: "Defensif"
    }
  });
}

