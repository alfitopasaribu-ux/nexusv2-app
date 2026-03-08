// NEXUS v3.0 - Health Check API
// Vercel Serverless Function

export default function handler(req, res) {
  const apiKey = process.env.GROQ_API_KEY;
  const isReady = !!(apiKey && apiKey !== 'PASTE_YOUR_GROQ_API_KEY_HERE');
  
  res.json({
    status: isReady ? 'NEXUS ONLINE' : 'NEXUS OFFLINE',
    version: '3.0.0',
    aiReady: isReady,
    model: 'llama-3.3-70b-versatile',
    ts: new Date().toISOString()
  });
}

