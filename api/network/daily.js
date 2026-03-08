// NEXUS v3.0 - Network Daily Case API
// Vercel Serverless Function

export default function handler(req, res) {
  // Daily challenge case
  const dailyCase = {
    id: "daily_001",
    title: "Kasus Harian: Pencurian Berlian",
    description: "Sebuah perhiasan bernilai milyaran dicuri dari brankas hotel. Hanya tiga orang yang memiliki akses: manajer hotel, security, dan cleaning service. Siapa pelakunya?",
    type: "kejahatan_finansial",
    difficulty: "MAHIR",
    pointReward: 150,
    victim: {
      name: "Hotel Luxury Palace",
      age: 0,
      occupation: "Perusahaan Perhiasan"
    },
    suspects: [
      { id: "s1", name: "Pak Hadi", occupation: "Manajer Hotel", lieScore: 45, personality: "Waspada", motive: "Mengalami masalah keuangan", alibi: "Di ruang kerja", isGuilty: false },
      { id: "s2", name: "Bu Siti", occupation: "Cleaning Service", lieScore: 65, personality: "Gugup", motive: "Gaji kecil", alibi: "Membersihkan lorong", isGuilty: true },
      { id: "s3", name: "Pak Budi", occupation: "Security", lieScore: 30, personality: "Tenang", motive: "Loyal ke perusahaan", alibi: "Mengawasi monitor", isGuilty: false }
    ],
    evidence: [
      { id: "e1", name: "CCTV Footage", description: "Recording menunjukkan gerakan mencurigakan", isKeyEvidence: true, forensicAnalysis: "Footage menunjukkan sosok dengan seragam cleaning", isFake: false },
      { id: "e2", name: "Jejak Kaki", description: "Jejak sepatu ditemukan di TKP", isKeyEvidence: false, forensicAnalysis: "Ukuran sepatu Cleaning Service", isFake: false },
      { id: "e3", name: "Sarung Tangan", description: "Sarung tangan ditemukan di brankas", isKeyEvidence: true, forensicAnalysis: "DNA milik Cleaning Service", isFake: false }
    ],
    timeline: [
      "Jam 22:00 - Perhiasan disimpan di brankas",
      "Jam 02:00 - Alarm brankas berbunyi",
      "Jam 06:00 - Perhiasan ditemukan hilang",
      "Jam 08:00 - Pelaporan ke polisi"
    ],
    witnesses: [],
    hiddenContradictions: []
  };

  res.json({
    success: true,
    case: dailyCase,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  });
}

