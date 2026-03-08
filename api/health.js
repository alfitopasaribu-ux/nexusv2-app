// Vercel Serverless Function - Health Check
module.exports = (req, res) => {
  res.json({ status: 'NEXUS ONLINE', version: '3.0.0', ts: new Date().toISOString() });
};

