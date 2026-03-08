// NEXUS v3.0 - Health Check API
// Vercel Serverless Function

export default function handler(req, res) {
  // Support multiple env var names for compatibility
  const apiKey = process.env.GROQ_API_KEY || process.env.GROQ_APIKEY || '';
  
  // Debug logging
  console.log('=== HEALTH CHECK DEBUG ===');
  console.log('GROQ_API_KEY exists:', !!apiKey);
  console.log('GROQ_API_KEY length:', apiKey?.length || 0);
  console.log('GROQ_API_KEY first 10 chars:', apiKey?.substring(0, 10) || 'EMPTY');
  console.log('Starts with gsk_:', apiKey?.startsWith('gsk_') || false);
  console.log('============================');
  
  // Validasi API key - harus mulai dengan gsk_ dan panjang > 20
  const isReady = !!(apiKey && apiKey.startsWith('gsk_') && apiKey.length > 20);
  
  res.json({
    status: isReady ? 'NEXUS ONLINE' : 'NEXUS OFFLINE',
    version: '3.0.0',
    aiReady: isReady,
    model: 'llama-3.3-70b-versatile',
    ts: new Date().toISOString(),
    debug: {
      hasKey: !!apiKey,
      keyLength: apiKey?.length || 0,
      startsWithGsk: apiKey?.startsWith('gsk_') || false,
      hint: !apiKey ? 'GROQ_API_KEY tidak ditemukan di Environment Variables Vercel' : 
             !apiKey.startsWith('gsk_') ? 'API key format salah - harus mulai dengan gsk_' :
             apiKey.length < 20 ? 'API key terlalu pendek' : 'OK'
    }
  });
}

