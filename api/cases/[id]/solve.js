// NEXUS v3.0 - Solve Case API
// Vercel Serverless Function

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const { suspectId, playerId } = req.body;
  
  // Load case from static file
  // In production, use fs to read from cases folder
  
  // Simple validation - random result for demo
  // In production, check actual culprit from case data
  const isCorrect = Math.random() > 0.5;
  
  const result = isCorrect ? {
    correct: true,
    culpritName: "Tersangka yang benar",
    explanation: "Selamat! Anda telah memecahkan kasus dengan analisis yang tepat. Bukti-bukti mengarah ke pelaku yang benar.",
    pointReward: 100
  } : {
    correct: false,
    culpritName: "Tersangka lain",
    explanation: "Kasus ini membutuhkan analisis lebih lanjut. Periksa kembali bukti-bukti dan alibi para tersangka.",
    pointReward: 0
  };

  res.json({
    success: true,
    result
  });
}

