// NEXUS v3.0 - Daily Case API
// Vercel Serverless Function

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY || process.env.GROQ_APIKEY || '';

  // Demo daily case
  const demoCase = {
    id: 'daily_001',
    title: 'Kasus Harian: Pembunuhan di Museum',
    description: 'Sebuah pembunuhan terjadi di museum seni modern pada jam penutupan. Ada 3 tersangka yang memiliki akses ke ruangan tersebut.',
    type: 'pembunuhan',
    difficulty: 'MAHIR',
    pointReward: 200,
    evidence: [
      { id: 'e1', name: ' Pisau di TKP', description: 'Pisau dengan sidik jari', isKeyEvidence: true },
      { id: 'e2', name: ' Rekaman CCTV', description: 'Video berkualitas rendah', isKeyEvidence: false }
    ],
    suspects: [
      { id: 's1', name: 'Staff Museum', occupation: 'Cleaning Service', lieScore: 45 },
      { id: 's2', name: 'Pengunjung', occupation: 'Kolektor Seni', lieScore: 72 },
      { id: 's3', name: 'Keamanan', occupation: 'Security', lieScore: 30 }
    ]
  };

  // AI-powered daily case generation
  if (apiKey && apiKey.startsWith('gsk_')) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { 
              role: 'system', 
              content: 'Buatkan kasus pembunuhan singkat dalam Bahasa Indonesia untuk game investigasi. Format JSON dengan: title, description, type, difficulty, pointReward, evidence array, suspects array.' 
            }
          ],
          temperature: 0.8,
          max_tokens: 500,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Try to parse JSON from response
        try {
          const aiCase = JSON.parse(data.choices?.[0]?.message?.content || '{}');
          return res.json({ success: true, case: { ...demoCase, ...aiCase } });
        } catch (e) {
          // If JSON parse fails, use demo
        }
      }
    } catch (e) {
      console.error('Daily case error:', e);
    }
  }

  res.json({
    success: true,
    case: demoCase
  });
}

