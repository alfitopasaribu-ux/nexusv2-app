// NEXUS v3.0 - Academy Evaluate API
// Vercel Serverless Function

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { moduleId, question, answer } = req.body;
  const apiKey = process.env.GROQ_API_KEY;

  // Basic evaluation (tanpa AI)
  const isCorrect = answer.length > 50;
  const score = Math.floor(60 + Math.random() * 40);
  
  if (!apiKey || apiKey === 'PASTE_YOUR_GROQ_API_KEY_HERE') {
    return res.json({
      success: true,
      evaluation: {
        isCorrect,
        score,
        feedback: isCorrect ? "Jawaban yang baik! Pertahankan!" : "Perlu belajar lebih lagi.",
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
          { role: 'system', content: 'Anda adalah guru investigasi. Evaluasi jawaban siswa dan berikan feedback dalam Bahasa Indonesia.' },
          { role: 'user', content: `Soal: ${question}\nJawaban siswa: ${answer}\n\nBeri evaluasi: apakah jawaban benar, skor 0-100, dan feedback.` }
        ],
        temperature: 0.5,
        max_tokens: 300,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const feedback = data.choices?.[0]?.message?.content || "Evaluasi selesai.";
      
      return res.json({
        success: true,
        evaluation: {
          isCorrect: score > 70,
          score,
          feedback,
          xpEarned: score > 70 ? 50 : 20
        }
      });
    }
  } catch (e) {
    console.error('AI evaluation failed:', e);
  }

  // Fallback
  res.json({
    success: true,
    evaluation: {
      isCorrect,
      score,
      feedback: "Terima kasih atas jawaban Anda. Tetap belajar!",
      xpEarned: isCorrect ? 30 : 10
    }
  });
}

