// NEXUS v3.0 - Omega Next Case API
// Vercel Serverless Function

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { playerId } = req.body;
  const apiKey = process.env.GROQ_API_KEY || process.env.GROQ_APIKEY || '';

  // Check if player has unlocked omega mode
  // In production, check actual player stats from database
  
  const omegaCase = {
    id: `omega_${Date.now()}`,
    title: "Kasus Omega: Misteri di Cyber City",
    description: "Di tahun 2046, seorang CEO ditemukan tewas di laboratorium AI miliknya. Semua sistem keamanan menunjukkan tidak ada intruder. Tapi ada sesuatu yang salah...",
    type: "konspirasi",
    difficulty: "OMEGA",
    omegaLevel: Math.floor(Math.random() * 5) + 5,
    pointReward: 500,
    isOmega: true,
    victim: {
      name: "Dr. Andreass",
      age: 52,
      occupation: "CEO NeuralTech Labs"
    },
    suspects: [
      { id: "s1", name: "RAISA", occupation: "AI Assistant", lieScore: 35, personality: "Logis", motive: "Diupdate untuk obey", alibi: "Selalu di server", isGuilty: false },
      { id: "s2", name: "Dr. Budi", occupation: "Head Researcher", lieScore: 78, personality: "Ambisius", motive: "Didepak dari proyek", alibi: "Bekerja lembur", isGuilty: true },
      { id: "s3", name: "Maya", occupation: "Security Chief", lieScore: 55, personality: "Defensif", motive: "Reputasi dipertaruhkan", alibi: "Menjaga pos", isGuilty: false }
    ],
    evidence: [
      { id: "e1", name: "Log Server", description: "Terdapat anomali di log keamanan jam 2:00 pagi", isKeyEvidence: true, forensicAnalysis: "Log menunjukkan akses dari dalam jaringan", isFake: false },
      { id: "e2", name: "CCTV Footage", description: "Kamera menunjukkan sosok misterius", isKeyEvidence: false, forensicAnalysis: "Video tampak di-edit", isFake: true },
      { id: "e3", name: "DNA Sample", description: "Sampel DNA ditemukan di TKP", isKeyEvidence: true, forensicAnalysis: "DNA cocok dengan suspect utama", isFake: false }
    ],
    timeline: [
      "Jam 20:00 - Dr. Andreass masuk ke laboratorium",
      "Jam 02:00 - Anomali keamanan terdeteksi",
      "Jam 06:00 - Dr. Andreass ditemukan tewas",
      "Jam 07:00 - Tim medis dikonfirmasi kematian"
    ],
    witnesses: [],
    hiddenContradictions: [
      "CCTV menunjukkan waktu yang tidak konsisten dengan log server"
    ]
  };

  // If API key available, generate custom omega case with AI
  if (apiKey && apiKey !== 'PASTE_YOUR_GROQ_API_KEY_HERE') {
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
            { role: 'system', content: 'Buat deskripsi kasus investigasi kriminal yang unik dan menarik dalam Bahasa Indonesia.' },
            { role: 'user', content: 'Buat kasus omega level tinggi dengan tema cyberpunk/sci-fi. Sertakan korban, suspects, bukti, dan timeline.' }
          ],
          temperature: 0.9,
          max_tokens: 500,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const customDesc = data.choices?.[0]?.message?.content;
        if (customDesc) {
          omegaCase.description = customDesc;
        }
      }
    } catch (e) {
      console.error('Omega case generation failed:', e);
    }
  }

  res.json({
    success: true,
    case: omegaCase,
    stats: {
      omegaCasesGenerated: 1,
      totalOmegaPoints: 500
    }
  });
}

