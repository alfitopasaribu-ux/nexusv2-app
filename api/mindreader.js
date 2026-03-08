// NEXUS v3.0 - Mind Reader API
// Vercel Serverless Function - AI Theory Analysis

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { theory, caseId } = req.body;
  const apiKey = process.env.GROQ_API_KEY || process.env.GROQ_APIKEY || '';

  // Demo response when no API key
  if (!apiKey || !apiKey.startsWith('gsk_')) {
    const demoAnalyses = [
      "Teori Anda menunjukkan pola berpikir yang baik. Namun, ada beberapa titik buta yang perlu dieksplorasi. Periksa kembali bukti #3 dan hubungannya dengan waktu kejadian.",
      "Analisis Anda cukup kuat! Beberapa kelemahan: kurangnya bukti forensik yang menghubungkan pelaku dengan TKP. Perhatikan kesaksian saksi yang terlewat.",
      "Teori ini memiliki dasar yang benar tetapi perlu penguat. Pertimbangkan motif finansial sebagai faktor pemicu. Siapa yang diuntungkan?",
    ];
    return res.json({
      success: true,
      analysis: demoAnalyses[Math.floor(Math.random() * demoAnalyses.length)],
      score: Math.floor(50 + Math.random() * 30)
    });
  }

  // AI-powered mind reader
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
            content: `Anda adalah NEXUS Mind Reader - AI Analis Investigasi Tingkat Tinggi.
- Analisis teori investigasi dalam Bahasa Indonesia
- Berikan feedback tentang kekuatan dan kelemahan teori
- Sertakan bukti yang mendukung dan bertentangan
- Gunakan bahasa yang dramatis dan misterius
- Skor 0-100 untuk kualitas teori`
          },
          { role: 'user', content: `Analisis teori investigasi ini:\n\n${theory}\n\nBeri analisis lengkap dengan skor kognitif.` }
        ],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const analysis = data.choices?.[0]?.message?.content || 'Analisis gagal';
      
      return res.json({
        success: true,
        analysis,
        score: Math.floor(60 + Math.random() * 40)
      });
    }
  } catch (e) {
    console.error('Mind reader error:', e);
  }

  res.json({
    success: true,
    analysis: "Analisis tidak tersedia saat ini.",
    score: 50
  });
}

