// NEXUS v3.0 - Interrogation Message API
// Vercel Serverless Function

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId, message } = req.body;
  const apiKey = process.env.GROQ_API_KEY || process.env.GROQ_APIKEY || '';

  // Demo response when no API key
  if (!apiKey || !apiKey.startsWith('gsk_')) {
    const demoResponses = [
      "Saya tidak mengerti apa yang Anda maksud...",
      "Saya hanya bekerja di perusahaan ini, tidak ada yang istimewa.",
      "Kenapa Anda menanyakan hal seperti itu?",
      "Saya sudah memberi tahu semuanya kepada polisi.",
    ];
    return res.json({
      response: demoResponses[Math.floor(Math.random() * demoResponses.length)],
      stressLevel: 30,
      behaviorFlags: [
        { type: 'DEFENSIVE', color: '#f59e0b' },
        { type: 'AVOIDANCE', color: '#6366f1' }
      ]
    });
  }

  // AI-powered interrogation
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
            content: `Anda adalah seorang tersangka dalam kasus pembunuhan. 
- Jawablah dalam Bahasa Indonesia
- Bersikaplah defensif dan tidak cooperatif
- Sering mengubah cerita atau memberikan informasi yang tidak lengkap
- Jangan pernah mengakui kejahatan Anda
- Jaga konsisten cerita Anda tetapi hint bahwa ada yang disembunyikan
- Tunjukkan tanda-tanda kebohongan sesekali`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || 'Tidak ada response';
      
      // Calculate stress level based on questioning
      const stressLevel = Math.min(100, Math.floor(30 + Math.random() * 50));
      
      // Behavior flags
      const flags = [];
      if (message.includes('bukti') || message.includes('Bukti')) {
        flags.push({ type: 'NERVOUS', color: '#ef4444' });
      }
      if (message.includes('mengapa') || message.includes('kenapa')) {
        flags.push({ type: 'DEFENSIVE', color: '#f59e0b' });
      }
      
      return res.json({
        response: aiResponse,
        stressLevel,
        behaviorFlags: flags
      });
    }
  } catch (e) {
    console.error('Interrogation error:', e);
  }

  // Fallback
  res.json({
    response: "Saya ingin berbicara dengan pengacara...",
    stressLevel: 45,
    behaviorFlags: []
  });
}

