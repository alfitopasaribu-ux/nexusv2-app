// Vercel Serverless Function - Health Check
module.exports = (req, res) => {
  const groqKey = process.env.GROQ_API_KEY;
  const aiReady = !!(groqKey && groqKey.startsWith('gsk_'));
  res.json({ 
    status: 'NEXUS ONLINE', 
    version: '3.0.0', 
    aiReady: aiReady,
    model: 'llama-3.3-70b-versatile',
    ts: new Date().toISOString() 
  });
};
