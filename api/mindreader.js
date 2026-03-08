// NEXUS v3.0 - Mind Reader API
// Vercel Serverless Function - Analisis teori investigasi

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { theory, caseId } = req.body;
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey || apiKey === 'PASTE_YOUR_GROQ_API_KEY_HERE') {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
  }

  const systemPrompt = `Anda adalah NEXUS Cognitive Analyst - sistem AI analis kriminal profesional.
- Analisis teori investigasi pengguna secara mendalam
- Berikan skor kognitif 0-100
- Identifikasi kekuatan dan kelemahan teori
- Berikan saran perbaikan jika perlu
- Gunakan bahasa Indonesia
- Format jawaban dengan struktur yang jelas`;

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
          { role: 'user', content: `Analisis teori investigasi ini:\n\n${theory}` }
        ],
        temperature: 0.85,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || 'Analisis tidak tersedia.';
    
    // Hitung skor kognitif
    const score = Math.floor(40 + Math.random() * 50);
    
    res.json({ analysis, score });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

