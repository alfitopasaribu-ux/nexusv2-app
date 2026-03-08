// NEXUS v3.0 - Solve Case API
// Vercus Serverless Function

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { caseId } = req.params;
  const { suspectId, theory, playerId } = req.body;
  const apiKey = process.env.GROQ_API_KEY || process.env.GROQ_APIKEY || '';

  // Demo solution check (tanpa AI)
  if (!apiKey || !apiKey.startsWith('gsk_')) {
    // Random untuk demo - 50% chance benar
    const isCorrect = Math.random() > 0.5;
    
    const demoResult = isCorrect ? {
      correct: true,
      culpritName: "Benar! Pelaku adalah",
      explanation: "Selamat! Analisis Anda tepat. Bukti forensik dan kesaksian mengarah ke pelaku yang benar. Kasus ini berhasil dipecahkan!",
      pointReward: 150
    } : {
      correct: false,
      culpritName: "Tersangka Lain",
      explanation: "Sayang sekali! Pelaku sebenarnya adalah orang lain. Periksa kembali bukti dan kesaksian dengan lebih teliti.",
      pointReward: 0
    };

    return res.json({
      success: true,
      result: demoResult
    });
  }

  // AI-powered case solving
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
            content: `Anda adalah Sistem Verifikasi Kasus NEXUS.
- Evaluasi solusi kasus pembunuhan dalam Bahasa Indonesia
- Tentukan apakah jawaban player benar atau salah
- Berikan penjelasan detail
- Tentukan point reward (0-200)`
          },
          { role: 'user', content: `Kasus ID: ${caseId}\nTersangka dipilih: ${suspectId}\nTeori player: ${theory}\n\nEvaluasi apakah ini solusi yang benar!` }
        ],
        temperature: 0.5,
        max_tokens: 300,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const evaluation = data.choices?.[0]?.message?.content;
      
      return res.json({
        success: true,
        result: {
          correct: evaluation?.toLowerCase().includes('benar') || Math.random() > 0.3,
          culpritName: "Tersangka",
          explanation: evaluation || "Terima kasih atas solusi Anda.",
          pointReward: Math.floor(Math.random() * 150) + 50
        }
      });
    }
  } catch (e) {
    console.error('Solve case error:', e);
  }

  res.json({
    success: true,
    result: {
      correct: false,
      culpritName: "?",
      explanation: "Terjadi kesalahan dalam verifikasi.",
      pointReward: 0
    }
  });
}

