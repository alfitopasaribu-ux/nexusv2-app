// NEXUS v3.0 - Interrogation Message API
// Vercel Serverless Function

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId, message } = req.body;
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey || apiKey === 'PASTE_YOUR_GROQ_API_KEY_HERE') {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
  }

  // System prompt untuk interogasi
  const systemPrompt = `Anda adalah seorang tersangka dalam kasus kejahatan. 
- Anda adalah karakter yang bermain peran, BUKAN AI.
- Jawab dalam Bahasa Indonesia yang natural.
- Jangan pernah mengakui kejahatan secara langsung.
- Buat cerita yang konsisten tapi bisa ada celah jika ditekan.
- Tunjukkan emosi yang sesuai (defensif, gugup, marah).
- Jika ditanya tentang alibi, berikan jawaban yang bisa diperdebatkan.
- Usahakan jawaban tidak terlalu panjang (50-100 kata).`;

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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.85,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'Maaf, ada masalah dengan sistem.';
    
    // Calculate stress level (simulasi)
    const stressLevel = Math.floor(30 + Math.random() * 50);
    
    // Detect behavior flags
    const behaviorFlags = [];
    if (stressLevel > 60) {
      behaviorFlags.push({ type: 'STRESS TINGGI', color: '#ef4444' });
    }
    if (aiResponse.includes('tidak') || aiResponse.includes('bukan')) {
      behaviorFlags.push({ type: 'DEFENSIF', color: '#f59e0b' });
    }
    
    res.json({
      response: aiResponse,
      stressLevel,
      behaviorFlags
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

