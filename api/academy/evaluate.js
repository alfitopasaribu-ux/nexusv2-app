// NEXUS v3.0 - Academy Evaluate API
// Vercel Serverless Function

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { moduleId, question, answer } = req.body;
  const apiKey = process.env.GROQ_API_KEY || process.env.GROQ_APIKEY || '';

  // Demo evaluation (tanpa AI)
  if (!apiKey || !apiKey.startsWith('gsk_')) {
    const isCorrect = Math.random() > 0.3;
    return res.json({
      success: true,
      evaluation: {
        isCorrect,
        score: isCorrect ? Math.floor(70 + Math.random() * 30) : Math.floor(30 + Math.random() * 30),
        feedback: isCorrect 
          ? "Bagus! Jawaban Anda menunjukkan pemahaman yang baik tentang konsep observasi. Pertahankan!"
          : "Jawaban Anda kurang tepat. Coba pelajari kembali materi tentang pentingnya detail dalam investigasi.",
        improvement: isCorrect ? null : "Fokus pada detail yang terlewat - kadang bukti terkecil adalah yang paling penting.",
        xpEarned: isCorrect ? 50 : 10
      }
    });
  }

  // AI-powered evaluation
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
            content: 'Anda adalah AI Evaluator untuk kursus detektif.'
          },
          { role: 'user', content: `Pertanyaan: ${question}\n\nJawaban student: ${answer}\n\nEvaluasi!` }
        ],
        temperature: 0.5,
        max_tokens: 300,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      try {
        const evaluation = JSON.parse(data.choices?.[0]?.message?.content || '{}');
        if (evaluation.score) {
          return res.json({ success: true, evaluation });
        }
      } catch (e) {}
    }
  } catch (e) {
    console.error('Evaluate error:', e);
  }

  // Fallback
  res.json({
    success: true,
    evaluation: { isCorrect: true, score: 75, feedback: "Terima kasih!", xpEarned: 50 }
  });
}
