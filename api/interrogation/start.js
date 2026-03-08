// NEXUS v3.0 - Interrogation Start API
// Vercel Serverless Function

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { caseId, suspectId, playerId } = req.body;
  const apiKey = process.env.GROQ_API_KEY || process.env.GROQ_APIKEY || '';

  // Generate session ID
  const sessionId = `interro_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Demo response when no API key
  if (!apiKey || !apiKey.startsWith('gsk_')) {
    return res.json({
      success: true,
      sessionId,
      suspect: {
        id: suspectId,
        name: "Tersangka",
        personality: "Defensif",
        mood: "Nervous"
      },
      initialMessage: "Apa yang Anda inginkan? Saya tidak tahu apapun tentang kasus ini..."
    });
  }

  // AI-powered start
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
- Jawab dalam Bahasa Indonesia
- Bersikap defensif tapi tidak terlalu agresif
- Memberikan jawaban singkat yang tidak helpful
- Tunjukkan nervositas tapi coba tenang`
          },
          { role: 'user', content: "Kenapa Anda ada di TKP malam itu?" }
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return res.json({
        success: true,
        sessionId,
        suspect: {
          id: suspectId,
          name: "Tersangka AI",
          personality: "Complex",
          mood: "Guarded"
        },
        initialMessage: data.choices?.[0]?.message?.content || "Saya tidak ada di tempat kejadian..."
      });
    }
  } catch (e) {
    console.error('Start interrogation error:', e);
  }

  // Fallback
  res.json({
    success: true,
    sessionId,
    suspect: {
      id: suspectId,
      name: "Tersangka",
      personality: "Unknown",
      mood: "Cautious"
    },
    initialMessage: "Saya ingin berbicara dengan pengacara..."
  });
}

