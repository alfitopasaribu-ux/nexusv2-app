import { callGroq } from './api/groq.js'

// Local data - load from public/cases/
const loadCases = async () => {
  const cases = []
  for (let i = 1; i <= 50; i++) {
    try {
      const res = await fetch(`/cases/case${String(i).padStart(2, '0')}.json`)
      if (res.ok) {
        const data = await res.json()
        cases.push(data)
      }
    } catch (e) {
      // skip
    }
  }
  return { cases }
}

const loadCase = async (id) => {
  try {
    const res = await fetch(`/cases/case${String(id).padStart(2, '0')}.json`)
    if (res.ok) {
      return { case: await res.json() }
    }
  } catch (e) {
    // skip
  }
  return { case: null }
}

// Academy modules - static data
const modules = [
  { id: 'obs', title: 'Observasi Forensik', desc: 'Pelajari teknik mengamati bukti fisik', icon: '🔍', level: 1 },
  { id: 'ded', title: 'Deduksi Logis', desc: 'Menghubungkan fakta secara logis', icon: '🧩', level: 2 },
  { id: 'bias', title: 'Anti Bias Kognitif', desc: 'Menghindari kesalahan berpikir', icon: '🛡️', level: 3 },
  { id: 'pola', title: 'Pengenalan Pola', desc: 'Mengidentifikasi pola kejahatan', icon: '📊', level: 4 },
  { id: 'inter', title: 'Interogasi Lanjutan', desc: 'Teknik mendapatkan kebenaran', icon: '💬', level: 5 },
]

const lessons = {
  obs: {
    title: 'Dasar Observasi Forensik',
    objective: 'Pelajari cara mengidentifikasi dan menganalisis bukti fisik',
    theory: 'Observasi forensik adalah keterampilan fundamental dalam investigasi kriminal. Seorang detektif harus mampu:\n\n1. Mengamati detail kecil yang sering terlewat\n2. Mencatat posisi dan kondisi bukti\n3. Mengidentifikasi bukti yang tidak konsisten\n4. Melindungi bukti dari kontaminasi',
    keyPoints: [
      'Perhatikan anomali dalam scene',
      'Dokumentasikan sebelum menyentuh',
      'Gunakan multiple sense observations',
      'Cross-verify dengan testimony'
    ],
    caseExample: {
      scenario: 'Di sebuah kantor, ditemukan jenazah. Meja kerja berantakan, tapi laci terkunci. Laptop ada di meja tapi dalam kondisi sleep.',
      question: 'Apa yang aneh dari scene ini?',
      options: [
        'Laci terkunci menandakan ada yang disembunyikan',
        'Laptop sleep menandakan pengguna baru saja pergi',
        'Meja berantakan adalah pura-pura',
        'Semua benar'
      ]
    }
  },
  ded: {
    title: 'Deduksi Logis',
    objective: 'Belajar menarik kesimpulan dari fakta',
    theory: 'Deduksi adalah proses menarik kesimpulan logis dari premis-premis yang diketahui. Dalam investigasi:\n\n1. Kumpulkan semua fakta\n2. Identifikasi hubungan antar fakta\n3. Cari kontradiksi atau kejanggalan\n4. Bangun teori yang解释semu',
    keyPoints: [
      'Fakta > Interpretasi',
      'Korrelation bukan kausalitas',
      'Occam\'s razor - solusi sederhana lebih mungkin',
      'Test teori dengan bukti'
    ],
    caseExample: {
      scenario: 'Tersangka A memiliki kunci ruangan. Tersangka B ditemukan di dalam ruangan terkunci. Tidak ada tanda paksaan.',
      question: 'Si lebih mungkinapa yang melakukan ini?',
      options: [
        'Tersangka A - ada kunci',
        'Tersangka B - ada di TKP',
        'Perlu info lebih lanjut',
        'Tidak bisa disimpulkan'
      ]
    }
  },
  bias: {
    title: 'Menghindari Bias Kognitif',
    objective: 'Mengenali dan mengatasi bias dalam berpikir',
    theory: 'Otak manusia rentan terhadap berbagai bias kognitif:\n\n1. Confirmation Bias - mencari yang sesuai pendapat\n2. Anchoring - terlalu bergantung pada info pertama\n3. Availability Heuristic - menilai dari yang mudah diingat\n4. Sunk Cost Fallacy - terus wegen karena sudah terlanjur',
    keyPoints: [
      'Selalu cari bukti yang melawan teori',
      'Hindari jump to conclusion',
      'Pikirkan alternative explanations',
      'Minta second opinion'
    ],
    caseExample: {
      scenario: 'Detektif yakin pelaku adalah X karena profilnya cocok. Semua bukti diinterpretasikan untuk mendukung teori ini.',
      question: 'Apa yang salah dalam pendekatan ini?',
      options: [
        'Harus percaya first impression',
        'Mengabaikan bukti yang tidak sesuai',
        'Profiling selalu akurat',
        'Tidak ada yang salah'
      ]
    }
  },
  pola: {
    title: 'Pengenalan Pola Kejahatan',
    objective: 'Mengidentifikasi pola dalam perilaku kriminal',
    theory: 'Banyak kejahatan menunjukkan pola tertentu:\n\n1. M.O. (Modus Operandi) - cara kejahatan dilakukan\n2. Signature - karakteristik unik pelaku\n3. Geographic profiling - area beroperasi\n4. Temporal patterns - waktu kejadian',
    keyPoints: [
      'Catat semua detail M.O.',
      'Bandingkan dengan database kasus',
      'Perhatikan signature behaviors',
      'Map lokasi kejadian'
    ],
    caseExample: {
      scenario: 'Semua perampokan terjadi malam hari, di toko emas, dengan pelaku menyandera anak sebagai tameng.',
      question: 'Apa pola yang bisa diidentifikasi?',
      options: [
        'Target acak',
        'Sensitivitas terhadap keamanan',
        'Penggunaan sandera',
        'Semua di atas'
      ]
    }
  },
  inter: {
    title: 'Teknik Interogasi',
    objective: 'Menguasai teknik mendapatkan kebenaran',
    theory: 'Interogasi efektif membutuhkan:\n\n1. Membangun rapport\n2. Menggunakan silence strategis\n3. Observation bahasa tubuh\n4. Creating inconsistencies\n5. Psychology pressures',
    keyPoints: [
      'Dengarkan lebih dari berbicara',
      'Perhatikan nonverbal cues',
      'Gunakan silence sebagai weapons',
      'Ciptakan tekanan psikologis'
    ],
    caseExample: {
      scenario: 'Ters alibi bahwaangka memberikan ia di rumah sendirian menonton TV. Remote TV ditemukan di dapur, bukan di ruang tamu.',
      question: 'Apa yang harus dilakukan?',
      options: [
        'Accept alibi',
        'Konfrontasi dengan inconsistency',
        'Tanya tentang program TV',
        'Biarkan saja'
      ]
    }
  }
}

// Simulated leaderboard data
const leaderboard = [
  { id: 'p1', name: 'Detektif Akbar', rank: 'DETEKTIF UTAMA', points: 15420, solved: 48 },
  { id: 'p2', name: 'Detektif Salsa', rank: 'ANALIS KRIMINAL', points: 8920, solved: 31 },
  { id: 'p3', name: 'Detektif Reza', rank: 'INVESTIGATOR', points: 5400, solved: 22 },
  { id: 'p4', name: 'Detektif Maya', rank: 'INVESTIGATOR', points: 3800, solved: 18 },
  { id: 'p5', name: 'Detektif Budi', rank: 'DETEKTIF JUNIOR', points: 2100, solved: 12 },
]

// AI-powered functions
export const api = {
  // Health check - simulate
  health: () => Promise.resolve({ 
    aiReady: true, 
    model: 'llama-3.3-70b-versatile',
    provider: 'groq'
  }),

  // Get all cases
  getCases: () => loadCases(),

  // Get single case
  getCase: (id) => loadCase(id),

  // Solve case - AI powered
  solveCase: async (caseId, data) => {
    const caseData = await loadCase(caseId)
    const caseInfo = caseData.case
    
    const prompt = `Anda adalah sistem verifikasi kasus kriminal. 

Kasus: ${caseInfo?.title}
Deskripsi: ${caseInfo?.description}

Tersangka yang dipilih: ${data.suspectId}
Teori pengguna: ${data.theory}

Pelaku sebenarnya: ${caseInfo?.solution?.culpritId}
Penjelasan: ${caseInfo?.solution?.explanation}

Evaluasi apakah teori pengguna benar. Berikan response dalam format JSON:
{
  "correct": boolean,
  "explanation": "penjelasan detail",
  "pointReward": number,
  "culpritName": "nama pelaku"
}`

    const result = await callGroq(prompt, 'Anda adalah AI verification system untuk game investigasi. Selalu respond dalam format JSON.')
    
    try {
      const parsed = JSON.parse(result)
      return { result: parsed }
    } catch {
      // Fallback - auto verify based on suspect ID
      const isCorrect = data.suspectId === caseInfo?.solution?.culpritId
      return {
        result: {
          correct: isCorrect,
          explanation: isCorrect ? 'Selamat! Teori Anda benar!' : `Pelaku sebenarnya adalah ${caseInfo?.solution?.culpritId}`,
          pointReward: isCorrect ? caseInfo?.pointReward || 300 : 0,
          culpritName: caseInfo?.solution?.culpritId || 'Tidak diketahui'
        }
      }
    }
  },

  // Interrogation - start
  startInterro: async (data) => {
    const caseData = await loadCase(data.caseId)
    const suspect = caseData.case?.suspects?.find(s => s.id === data.suspectId)
    
    const prompt = `Anda adalah ${suspect?.name}, seorang ${suspect?.occupation} dengan profil psikologi: ${suspect?.psychProfile}

Anda adalah tersangka dalam kasus: ${caseData.case?.title}
Motif: ${suspect?.motive}
Alibi: ${suspect?.alibi}

Saat diinterogasi, Anda harus:
- Menjawab sesuai personality Anda
- Bisa berbohong untuk melindungi diri
- Jangan langsung jujur tentang peran Anda
- Tunjukkan tanda-tanda nervous jika ditekan

Mulai interogasi dengan memperkenalkan diri dan keadaan Anda.`

    const intro = await callGroq(`Jawab dalam 1-2 kalimat. Perkenalkan diri Anda sebagai ${suspect?.name}.`, prompt)
    
    return {
      sessionId: `session_${Date.now()}`,
      response: intro,
      stressLevel: 10
    }
  },

  // Interrogation - send message
  sendMsg: async ({ sessionId, message }) => {
    const prompt = `Jawab pertanyaan polisi ini dengan natural. Kalau ditekan tentang crimes, tetap tenang tapi menunjukkan kegelisahan ringan.`
    
    const response = await callGroq(message, prompt)
    
    return {
      response,
      stressLevel: Math.floor(Math.random() * 40) + 20,
      behaviorFlags: [
        { type: 'EYE_CONTACT', color: '#f59e0b' },
        { type: 'HESITATION', color: '#ef4444' }
      ]
    }
  },

  // Mind Reader - AI analysis
  mindReader: async ({ theory, caseId }) => {
    const caseData = await loadCase(caseId)
    const caseInfo = caseData.case
    
    const prompt = `Analisis teori investigasi ini untuk kasus "${caseInfo?.title}":

Teori: ${theory}

Berikan analisis dalam format JSON:
{
  "analysis": "analisis detail tentang kekuatan/kelemahan teori",
  "strengths": ["poin kuat teori"],
  "weaknesses": ["kelemahan teori"],
  "recommendations": ["saran investigasi lanjutan"]
}`

    const result = await callGroq(prompt, 'Anda adalah AI cognitive analysis system.')
    
    try {
      const parsed = JSON.parse(result)
      return { analysis: parsed.analysis || result }
    } catch {
      return { analysis: result }
    }
  },

  // Academy - get modules
  getModules: () => Promise.resolve({ modules }),

  // Academy - get lesson
  getLesson: async ({ moduleId }) => {
    const lessonData = lessons[moduleId] || lessons.obs
    return { lesson: lessonData }
  },

  // Academy - evaluate answer
  evalAnswer: async ({ moduleId, answer }) => {
    const lessonData = lessons[moduleId] || lessons.obs
    const question = lessonData.caseExample?.question || ''
    
    const prompt = `Evaluasi jawaban student untuk pertanyaan: "${question}"
    
Jawaban student: ${answer}
    
Beri evaluasi dalam format JSON:
{
  "isCorrect": boolean,
  "score": number (0-100),
  "feedback": "feedback untuk student",
  "improvement": "saran perbaikan jika perlu",
  "xpEarned": number
}`

    const result = await callGroq(prompt, 'Anda adalah AI tutor untuk training detektif.')
    
    try {
      const parsed = JSON.parse(result)
      return { evaluation: parsed }
    } catch {
      return {
        evaluation: {
          isCorrect: answer.length > 50,
          score: Math.min(100, answer.length * 2),
          feedback: 'Terima kasih atas jawaban Anda. Terus belajar!',
          xpEarned: 50
        }
      }
    }
  },

  // Cognitive report
  getCogReport: async (playerId) => {
    const prompt = `Buat laporan kognitif untuk detektif dengan profil:
- Observasi: 65%
- Deduksi Logis: 70%
- Ketahanan Bias: 55%
- Pengenalan Pola: 60%

Buat laporan menarik dalam format naratif tentang kekuatan dan weakness cognitive mereka.`

    const narrative = await callGroq(prompt, 'Anda adalah AI cognitive analyst.')
    
    return {
      report: {
        narrative,
        scores: {
          observasi: 65,
          deduksiLogis: 70,
          ketahananBias: 55,
          pengenalanPola: 60
        }
      }
    }
  },

  // Omega mode - generate case
  omegaNext: async ({ playerId }) => {
    const prompt = `Buat deskripsi kasus kriminal acak yang menarik dalam format JSON:

{
  "title": "judul kasus",
  "description": "deskripsi 2-3 kalimat",
  "difficulty": "MAHIR",
  "omegaLevel": 5,
  "pointReward": 500
}`

    const result = await callGroq(prompt, 'Anda adalah AI case generator.')
    
    try {
      const parsed = JSON.parse(result)
      return { case: parsed }
    } catch {
      return {
        case: {
          title: 'Kasus Omega Baru',
          description: 'Sebuah kasus kompleks menunggu investigasi Anda...',
          difficulty: 'OMEGA',
          omegaLevel: Math.floor(Math.random() * 5) + 5,
          pointReward: 500
        }
      }
    }
  },

  // Network - register (local storage simulation)
  registerNet: (data) => Promise.resolve({ success: true }),

  // Network - leaderboard
  getLeaderboard: (sort = 'points', limit = 50) => Promise.resolve({ 
    leaderboard: leaderboard.slice(0, limit),
    stats: { totalPlayers: 156, activeLast24h: 42 }
  }),

  // Network - daily case
  getDailyCase: () => {
    const daily = {
      id: 'daily',
      title: 'Tantangan Harian: Ketek Sang Ahli',
      description: 'Setiap hari, pecahkan kasus khusus untuk bonus XP!',
      difficulty: 'MAHIR',
      pointReward: 200
    }
    return Promise.resolve({ case: daily })
  }
}

