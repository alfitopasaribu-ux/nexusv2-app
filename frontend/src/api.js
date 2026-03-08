
// NEXUS_v3 API - Client-side with local data & Groq AI
import { callGroq, isAiReady } from './api/groq.js'

// Local case data - load from public/cases
const CASES = []

// Initialize cases from public/cases
async function loadCases() {
  if (CASES.length > 0) return CASES
  
  const caseIds = Array.from({length: 50}, (_, i) => String(i + 1).padStart(2, '0'))
  const loaded = []
  
  for (const id of caseIds) {
    try {
      const resp = await fetch(`/cases/case${id}.json`)
      if (resp.ok) {
        const data = await resp.json()
        loaded.push(data)
      }
    } catch (e) {
      // Case file not found, skip
    }
  }
  
  // If no cases loaded, use fallback
  if (loaded.length === 0) {
    loaded.push(...getFallbackCases())
  }
  
  CASES.push(...loaded)
  return CASES
}

function getFallbackCases() {
  return [
    {id: '01', title: 'Pembunuhan di Mansion', type: 'pembunuhan', difficulty: 'PEMULA', pointReward: 100, description: 'Tuan besar ditemukan tewas di ruang kerjanya...', suspects: [], evidence: []},
    {id: '02', title: 'Kehilangan Berlian', type: 'orang_hilang', difficulty: 'PEMULA', pointReward: 100, description: 'Berlian langka lenyap dari brankas...', suspects: [], evidence: []},
    {id: '03', title: 'Konspirasi Corp', type: 'konspirasi', difficulty: 'MAHIR', pointReward: 200, description: 'Terdapat konspirasi di perusahaan besar...', suspects: [], evidence: []},
    {id: '04', title: 'Serangan Siber', type: 'kejahatan_siber', difficulty: 'MAHIR', pointReward: 250, description: 'Sistem keamanan dibobol hacker...', suspects: [], evidence: []},
    {id: '05', title: 'Pembunuhan Berantai', type: 'pembunuh_berantai', difficulty: 'AHLI', pointReward: 500, description: 'Serangan beruntun menewaskan korban...', suspects: [], evidence: []},
  ]
}

// Mock data for modules - each with unique study cases
const MODULES = [
  { 
    id: 'obs', 
    icon: '🔍', 
    title: 'Observasi Forensic', 
    desc: 'Latih kemampuan mengamati detail yang sering terlewat', 
    level: 1,
    topic: 'forensik'
  },
  { 
    id: 'ded', 
    icon: '🧠', 
    title: 'Deduksi Logis', 
    desc: 'Belajar berpikir sistematis dan menemukan kebenaran', 
    level: 2,
    topic: 'deduksi'
  },
  { 
    id: 'bias', 
    icon: '⚖️', 
    title: 'Anti-Bias Kognitif', 
    desc: 'Kurangi kesalahan berpikir yang tidak sadar', 
    level: 3,
    topic: 'psikologi'
  },
  { 
    id: 'pola', 
    icon: '📊', 
    title: 'Pengenalan Pola', 
    desc: 'Identifikasi pola tersembunyi dalam kejahatan', 
    level: 4,
    topic: 'analisis'
  },
  { 
    id: 'inter', 
    icon: '💬', 
    title: 'Teknik Interogasi', 
    desc: 'Strategi mendapatkan informasi dari saksi', 
    level: 5,
    topic: 'interogasi'
  },
  { 
    id: 'strat', 
    icon: '♟️', 
    title: 'Strategi Investigasi', 
    desc: 'Rencanakan investigasi seperti grandmaster catur', 
    level: 6,
    topic: 'strategi'
  },
]

// Mock leaderboard
const MOCK_LEADERBOARD = [
  { id: 'user1', name: 'Detektif_01', rank: 'DETEKTIF JUNIOR', points: 2500, solved: 12 },
  { id: 'user2', name: 'Detektif_02', rank: 'INVESTIGATOR', points: 4200, solved: 25 },
  { id: 'user3', name: 'Detektif_03', rank: 'ANALIS KRIMINAL', points: 8500, solved: 48 },
]

// Interrogation sessions (in-memory)
const interroSessions = new Map()

export const api = {
  // Health check - always return AI ready if Groq key exists
  health: async () => {
    const hasKey = isAiReady()
    return { 
      status: 'ok', 
      aiReady: hasKey,
      message: hasKey ? 'Groq API connected' : 'Add VITE_GROQ_API_KEY in Vercel'
    }
  },

  // Get all cases
  getCases: async () => {
    const cases = await loadCases()
    return { cases }
  },

  // Get single case
  getCase: async (id) => {
    const cases = await loadCases()
    const found = cases.find(c => c.id === id || c.id === String(id).padStart(2, '0'))
    if (!found) {
      // Return a default case structure
      return { 
        case: {
          id,
          title: `Kasus #${id}`,
          type: 'pembunuhan',
          difficulty: 'MAHIR',
          description: 'Kasus investigasi sedang berlangsung...',
          suspects: [
            { id: 's1', name: 'Tersangka A', occupation: 'Pegawai', lieScore: 45, personality: 'Introvert', motive: 'Tidak ada', alibi: 'Di rumah', psychProfile: 'Normal' },
            { id: 's2', name: 'Tersangka B', occupation: 'Manajer', lieScore: 65, personality: 'Ekstrovert', motive: 'Uang', alibi: 'Di kantor', psychProfile: 'Ambisius' },
          ],
          evidence: [
            { id: 'e1', name: 'Bukti DNA', description: 'Sampel darah di TKP', isKeyEvidence: true, forensicAnalysis: 'DNA cocok dengan Tersangka A' },
            { id: 'e2', name: 'CCTV', description: 'Rekaman kamera keamanan', isKeyEvidence: false, forensicAnalysis: 'Terlihat sosok memasuki gedung jam 10 malam' },
          ],
          timeline: ['Jam 08:00 - Korban terakhir terlihat hidup', 'Jam 22:00 - Terjadi sesuatu', 'Jam 06:00 - Tubuh ditemukan'],
          victim: { name: 'John Doe', age: 45, occupation: 'Wiraswasta' }
        }
      }
    }
    return { case: found }
  },

  // Solve case - use Groq AI
  solveCase: async (caseId, data) => {
    const cases = await loadCases()
    const caseData = cases.find(c => c.id === caseId || c.id === String(caseId).padStart(2, '0'))
    
    const prompt = `Kasus: ${caseData?.title || caseId}
Theori: ${data.theory}
Tersangka yang dipilih: ${data.suspectId}

Analisis apakah teorie ini benar atau salah. Jelaskan mengapa.`
    
    const result = await callGroq(prompt, 'You are NEXUS AI detective. Analyze the solution and determine if it is correct. Return JSON with: correct (boolean), culpritName (string), explanation (string), pointReward (number).')
    
    // Parse the result - try to extract correct answer
    const isCorrect = result.toLowerCase().includes('"correct":true') || 
                      result.toLowerCase().includes('benar') ||
                      result.toLowerCase().includes('correct')
    
    return {
      result: {
        correct: isCorrect,
        culpritName: caseData?.suspects?.[0]?.name || 'Tersangka A',
        explanation: result,
        pointReward: isCorrect ? (caseData?.pointReward || 100) : 0
      }
    }
  },

  // Interrogation - start session
  startInterro: async (data) => {
    const sessionId = 'session_' + Date.now()
    const cases = await loadCases()
    const caseData = cases.find(c => c.id === data.caseId)
    const suspect = caseData?.suspects?.find(s => s.id === data.suspectId)
    
    interroSessions.set(sessionId, {
      caseId: data.caseId,
      suspect,
      messages: [],
      stressLevel: 10
    })
    
    return {
      sessionId,
      initialMessage: suspect ? 
        ` "${suspect.name} duduk di hadapan Anda dengan tenang. "Ada apa? Saya tidak ada hubungannya dengan kasus ini."` :
        ' Tersangka duduk di hadapan Anda.'
    }
  },

  // Interrogation - send message
  sendMsg: async (data) => {
    const session = interroSessions.get(data.sessionId)
    if (!session) {
      return { response: 'Session not found', stressLevel: 0, behaviorFlags: [] }
    }
    
    const prompt = `Kasus: ${session.caseId}
Tersangka: ${session.suspect?.name || 'Unknown'}
Profil: ${session.suspect?.personality || 'Normal'}
Motif: ${session.suspect?.motive || 'Tidak ada'}
Tanya: ${data.message}

Anda adalah tersangka yang diinterogasi. Jawab secara natural, kadang defensif, kadang jujur. Tingkat stress: ${session.stressLevel}%`
    
    const response = await callGroq(prompt, 'You are a suspect being interrogated. Respond naturally in Indonesian.')
    
    // Update stress level
    session.stressLevel = Math.min(100, session.stressLevel + Math.random() * 15)
    session.messages.push({ role: 'user', content: data.message })
    session.messages.push({ role: 'assistant', content: response })
    
    // Detect behavior flags
    const flags = []
    if (response.includes('?') || response.includes('mengapa')) flags.push({ type: 'DEFENSIVE', color: '#f59e0b' })
    if (response.length > 200) flags.push({ type: 'TALKATIVE', color: '#3b82f6' })
    if (response.includes('tidak tahu') || response.includes('不清楚')) flags.push({ type: 'EVASIVE', color: '#ef4444' })
    
    return {
      response,
      stressLevel: Math.round(session.stressLevel),
      behaviorFlags: flags
    }
  },

  // Mind Reader - analyze theory
  mindReader: async (data) => {
    const prompt = `Analisis teori investigasi ini:
${data.theory}

Berikan analisis mendalam tentang kekuatan dan kelemahan teori ini dalam Bahasa Indonesia yang NATURAL dan MUDAH DIMENGERTI. Jangan gunakan format JSON atau kode apapun.Tulis seperti seorang detektif senior yang memberi nasihat.

Poin-poin yang harus dibahas:
1. Kelemahan logis dalam teori ini
2. Bukti yang mendukung teori
3. Bias yang mungkin terjadi pada pengamat
4. Saran investigasi lanjutan

Tulis dengan gaya bahasa yang menarik, seperti cerita detektif.`
    
    const result = await callGroq(prompt, 'You are a senior detective mentor. Give advice in natural Indonesian prose, no JSON or code.')
    
    // Clean up any remaining code blocks
    const cleanResult = result
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/"([^"]+)":/g, '$1:')
    
    // Generate a reasonable score based on theory length and keywords
    const theoryLength = data.theory?.length || 0
    const hasKeywords = /bukti|motif|alibi|tersangka|pelaku/i.test(data.theory || '')
    let score = Math.min(95, Math.max(30, Math.floor(theoryLength / 10) + (hasKeywords ? 20 : 0)))
    
    return {
      analysis: cleanResult,
      score: score
    }
  },

  // Academy - get modules
  getModules: async () => {
    return { modules: MODULES }
  },

  // Academy - get lesson
  getLesson: async (data) => {
    const mod = MODULES.find(m => m.id === data.moduleId)
    const lessonNum = data.lessonNumber || 1
    
    // Different study case topics for each module
    const studyCaseTopics = {
      obs: 'seorang pembersih jendela yang menemukan barang bukti tersembunyi di tempat tinggi',
      ded: 'pembunuhan di perpustakaan dengan buku yang hilang',
      bias: 'saksi yang yakin100% tapi ternyata salah identifikasi',
      pola: 'pola kejadian aneh di sebuah kompleks perumahan',
      inter: 'saksi yang sangat pendiam dan ketakutan',
      strat: 'kompleks percetakan uang palsu dengan banyak pintu'
    }
    
    const topic = studyCaseTopics[mod?.id] || 'kasus detektif umum'
    const difficultyLevel = mod?.level || 1
    
    const prompt = `Buat materi pembelajaran DETAIL untuk modul: "${mod?.title || 'Detective'}"
Topik studi kasus: ${topic}
Level kesulitan: ${difficultyLevel}

Kamu adalah guru detektif berpengalaman. Buat materi dalam Bahasa Indonesia yang menarik dan NATURAL. 

Materi harus berisi:
1. lessonTitle: Judul pelajaran yang menarik (max 50 karakter)
2. objective: Tujuan pembelajaran (max 100 karakter)
3. theory: Teori panjang tentang topik ini (3-4 paragraf, sangat detail)
4. keyPoints: 4-5 poin penting yang harus diingat
5. caseExample: Contoh studi kasus nyata dengan:
   - scenario: Cerita situasi kejadian (paragraf panjang)
   - question: Pertanyaan untuk user
   - options: 4 pilihan jawaban

PENTING: Respons harus dalam JSON valid. Hapus semua backtick dan format kode.`
    
    const result = await callGroq(prompt, 'You are NEXUS educational AI. Create detailed lesson content in Indonesian. Always respond in valid JSON format.')
    
    // Parse or use detailed fallback
    let lesson
    try {
      // Try to extract JSON from response
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        lesson = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found')
      }
    } catch {
      // Use detailed fallback based on module
      const fallbacks = {
        obs: {
          lessonTitle: 'Seni Mengamati Jejak',
          objective: 'Meningkatkan kemampuan observasi detail yang sering terlewat',
          theory: 'Dalam investigasi forensic, kemampuan observasi adalah fondasi dari semua pekerjaan detektif. Seringkali, bukti paling penting tersembunyi di tempat yang paling tidak terduga. Seorang detektif harus melatih matanya untuk melihat apa yang orang lain lewatkan.\n\nDetail seperti bekas sepatu yang tidak rapih, noda cairan yang hampir tidak terlihat, atau tekstur lantai yang berbeda bisa menjadi kunci pengungkapan kasus. Teknik observation meliputi: systematic scanning, comparative analysis, dan contextual awareness.\n\nLatihlah diri untuk selalu bertanya: "Apa yang aneh di sini?" dan "Apa yang seharusnya ada tapi tidak ada?"',
          keyPoints: ['Selalu lihat ke atas dan ke bawah', 'Perhatikan perubahan kecil', 'Gunakan semua indra', 'Dokumentasikan sebelum menyentuh', 'Pikir seperti pelaku'],
          caseExample: {
            scenario: 'Di sebuah rumah tua, polisi menemukan tubuh Mr. Black di ruang kerja. Meja kerja berantakan, laci terbuka, dan ada pecahan kaca di lantai. Di sudut ruangan, ada jejak kaki basah yang keluar dari jendela. Namun, CCTV menunjukkan tidak ada yang masuk atau keluar. Di meja, ada secangkir kopi masih hangat.',
            question: 'Apa detail yang paling mencurigakan dari TKP ini?',
            options: ['Jejak kaki basah yang tidak masuk akal', 'Kopi masih hangat', 'CCTV yang tidak merekam', 'Meja yang berantakan', 'Pecahan kaca']
          }
        },
        ded: {
          lessonTitle: 'Menalar Seperti Sherlock',
          objective: 'Mengembangkan kemampuan deduksi logis dari fakta',
          theory: 'Deduksi adalah proses menarik kesimpulan dari premis-premis yang diketahui. Dalam investigasi, kita mengumpulkan fakta, menganalisis hubungan antar fakta, dan menarik kesimpulan yang logis.\n\nMetode deduksi meliputi: elimination (meng排除 kemungkinan), abduction (penalaran ke penjelasan terbaik), dan induction (dari khusus ke umum). Seorang detektif harus menghindari confirmation bias dan selalu terbuka pada kemungkinan lain.\n\nLatih logika dengan banyak membaca, menyelesaikan puzzle, dan selalu mempertanyakan asumsi.',
          keyPoints: ['Kumpulkan fakta dulu', 'Hindari asumsi', 'Gunakan metode eliminasi', 'Pikir di luar kotak', 'Verifikasi kesimpulan'],
          caseExample: {
            scenario: 'Diamond senilai jutaan rupiah dicuri dari brankas hotel. Hanya 3 orang punya akses: manajer, security, dan tamu di kamar 501. Manajer punya alibi: meeting penuh dari jam 2-4. Security mengaku standby di lobi. Tamu kamar 501 check-out jam 3:30 dengan koper besar. CCTV lobby menunjukkan manajer dan security tidak bergerak dari posisi. Kamar 501 memiliki balkon yang terhubung ke kamar lain.',
            question: 'Siapa pelaku paling mungkin berdasarkan deduksi?',
            options: ['Manajer dengan dalih meeting', 'Security yang berbohong', 'Tamu kamar 501 via balkon', 'Orang dalam yang tidak terduga', 'Tim profesional outsider']
          }
        },
        bias: {
          lessonTitle: 'Mengalahkan Pikiran Kita',
          objective: 'Mengenali dan mengatasi bias kognitif dalam investigasi',
          theory: 'Otak manusia tidak sempurna. Kita punya banyak bias yang bisa menyesatkan investigasi. Confirmation bias membuat kita hanya melihat bukti yang mendukung teori kita. Anchor bias membuat kita terpaku pada informasi pertama.\n\nOther biases include: availability heuristic (mengangga based on easy recall), dan fundamental attribution error (menilai别人 berdasarkan disposisi, bukan situasi).\n\nUntuk menjadi detektif yang baik, kita harus sadar akan bias ini dan secara aktif melawannya. Selalu minta second opinion dan uji假设 dengan bukti.',
          keyPoints: ['Sadari bahwa kamu bisa salah', 'Cari bukti yang membantah teori', 'Minta pendapat orang lain', 'Tidak terpaku pada first impression', 'Gunakan metode ilmiah'],
          caseExample: {
            scenario: 'Saksi A bilang melihat pria berkemeja biru di TKP jam 10 malam. Saksi B mendukung dengan bilang pria berkemeja biru memang sering lewat. Polisi langsung fokus pada pria berkemeja biru. Namun, setelah ditelusuri, tidak ada pria berkemeja biru yang terkait. Kasus mandek karena terlalu fokus pada deskripsi yang salah.',
            question: 'Apa bias utama yang terjadi dalam kasus ini?',
            options: ['Confirmation bias', 'Availability heuristic', 'Anchoring bias', 'Dunning-Kruger effect', 'Hindsight bias']
          }
        },
        pola: {
          lessonTitle: 'Melihat Pola di Balik Kekacauan',
          objective: 'Mengidentifikasi pola tersembunyi dalam kejahatan',
          theory: 'Kejahatan sering meninggalkan pola. Pembunuh berantai memiliki signature berupa metode yang konsisten. Penipu menggunakan teknik yang sama berulang kali. Dengan mengidentifikasi pola, kita bisa memprediksi langkah selanjutnya.\n\nTeknik pengenalan pola: timeline analysis (lihat urutan kejadian), geographic profiling (peta lokasi), behavioral analysis (pola perilaku), dan network mapping (jaringan kontak).\n\nGunakan spreadsheet atau tools untuk visualisasi pola. Seringkali, pola terlihat jelas saat divisualisasikan.',
          keyPoints: ['Buat timeline kejadian', 'Petakan lokasi', 'Analisis perilaku pelaku', 'Bandingkan dengan kasus serupa', 'Gunakan teknologi visualisasi'],
          caseExample: {
            scenario: 'Dalam 3 bulan, terjadi 5 perampokan di mall berbeda. Semuanya di hari weekend, jam 8 malam, pelaku masuk melalui pintu darurat yang sama teknikbuka, selalu membawa tas ransel hitam, dan mengambil barang elektronik. Semua korban adalah wanita yang sendirian. Police menemukan DNA berbeda di TKP, menunjukkan pelaku adalah geng dengan 3-4 orang.',
            question: 'Apa pola paling mencolok dari kasus ini?',
            options: ['Waktu kejadian yang sama', 'Metode masuk yang identik', 'Target korban yang sama', 'Barang yang diambil sama', 'Semua jawaban benar']
          }
        },
        inter: {
          lessonTitle: 'Seni Berbicara',
          objective: 'Menguasai teknik mendapatkan informasi dari saksi',
          theory: 'Interogasi adalah seni, bukan science. Tujuan utama adalah membuat субъект nyaman untuk berbicara. Techniques: building rapport, menggunakan silence, open-ended questions, dan strategic confrontation.\n\nHindari: leading questions, intimidation yang berlebihan, dan creating adversarial dynamic. Bicaralah dengan bahasa korban/saksi untuk build trust.\n\nSelalu observe body language. Postur tertutup = tidak nyaman. Micro-expressions bisa menunjukkan kebohongan.',
          keyPoints: ['Bangun rapport dulu', 'Gunakan pertanyaan terbuka', 'Manfaatkan diam', 'Observe body language', 'Tidak memaksa'],
          caseExample: {
            scenario: 'Saksi Mrs. Chen sangat ketakutan dan hanya menjawab dengan satu kata. Dia terus melihat ke pintu. Detektif mulai dengan topik netral: cuaca, anak-anak sekolah. Mrs. Chen perlahan relax. Detektif lalu bertanya tentang malam itu, tapi Mrs. Chen kembali tegang dan bilang "saya tidak tahu apapun" dengan suara bergetar.',
            question: 'Apa strategi yang tepat untuk melanjutkan interogasi?',
            options: ['Langsung tuduh dia menyembunyikan sesuatu', 'Tunda interogasi, pastikan keamanan dia dulu', 'Paksa dengan ancaman penjara', 'Tanya tentang apa yang dia lihat di pintu', 'Bilang kalau pelaku sudah diketahui']
          }
        },
        strat: {
          lessonTitle: 'Strategi Catur Investigasi',
          objective: 'Merencanakan investigasi seperti permainan catur',
          theory: 'Investigation adalah seperti bermain catur. Setiap langkah harus diperhitungkan - bagaimana akan affect langkah selanjutnya. Strategi yang baik membutuhkan: information gathering (mengumpulkan semua fakta), resource allocation (menggunakan tim dengan efisien), dan contingency planning (rencana cadangan).\n\nPrioritas: amankan TKP dulu, interview witnesses sebelum mereka lupa, dan cepat identifikasi suspects utama. Setiap keputusan harus based on evidence, bukan emosi.\n\nAlways think 3 steps ahead. Jika kita interview witness A, apa yang akan dilakukan suspect?',
          keyPoints: ['Rencanakan sebelum bertindak', 'Prioritas keamanan TKP', 'Alokasikan sumber daya dengan bijaksana', 'Selalu punya rencana cadangan', 'Think ahead 3 langkah'],
          caseExample: {
            scenario: 'Kasus pembunuhan dengan 4 tersangka dan 10 saksi. Police punya hanya 2 detective dan budget terbatas untuk 1 minggu. Semua saksi akan pergi kota dalam 5 hari. Tersangka utama memiliki alibi yang harus diverifikasi.',
            question: 'Apa langkah strategis pertama yang harus diambil?',
            options: ['Interview semua saksi secepatnya', 'Fokus verifikasi alibi tersangka utama', 'Surveillance semua tersangka', 'Minta backup ke pimpinan', 'Analisis forensik dulu']
          }
        }
      }
      
      lesson = fallbacks[mod?.id] || fallbacks.ded
    }
    
    return { lesson }
  },

  // Academy - evaluate answer
  evalAnswer: async (data) => {
    const prompt = `Soal: ${data.question}
Jawaban user: ${data.answer}

Evaluasi jawaban ini dan berikan feedback. 
Format JSON: isCorrect (boolean), score (0-100), feedback (string), improvement (string), xpEarned (number)`
    
    const result = await callGroq(prompt, 'You are NEXUS educational AI.')
    
    let evalResult
    try {
      evalResult = JSON.parse(result)
    } catch {
      evalResult = {
        isCorrect: true,
        score: 75,
        feedback: 'Jawaban cukup baik!',
        improvement: 'Perhatikan detail lebih lanjut',
        xpEarned: 50
      }
    }
    
    return { evaluation: evalResult }
  },

  // Cognitive report
  getCogReport: async (playerId) => {
    const prompt = `Buat laporan kognitif untuk detektif berdasarkan profil:
- Observasi: 50%
- Deduksi Logis: 50%
- Ketahanan Bias: 50%
- Pengenalan Pola: 50%

Berikan narasi analisis dalam Bahasa Indonesia yang menarik.`
    
    const result = await callGroq(prompt, 'You are NEXUS cognitive analysis AI.')
    
    return {
      report: {
        narrative: result,
        observasi: 50,
        deduksiLogis: 50,
        ketahananBias: 50,
        pengenalanPola: 50
      }
    }
  },

  // Omega - generate new case
  omegaNext: async (data) => {
    const prompt = `Buat kasus investigasi acak dengan format JSON:
{
  "id": "omega_1",
  "title": "string",
  "type": "pembglobals|kejahatan_finansial|orang_hilang|konspirasi",
  "difficulty": "OMEGA",
  "description": "string",
  "victim": {"name": "string", "age": number, "occupation": "string"},
  "suspects": [{"id": "s1", "name": "string", "occupation": "string", "lieScore": number, "personality": "string", "motive": "string", "alibi": "string", "psychProfile": "string", "isGuilty": boolean}],
  "evidence": [{"id": "e1", "name": "string", "description": "string", "isKeyEvidence": boolean, "isFake": boolean, "forensicAnalysis": "string"}],
  "timeline": ["string"],
  "pointReward": number,
  "omegaLevel": number
}`
    
    const result = await callGroq(prompt, 'You are NEXUS Omega case generator.')
    
    let caseData
    try {
      caseData = JSON.parse(result)
    } catch {
      caseData = {
        id: 'omega_1',
        title: 'Kasus Omega: Misteri Mansion',
        type: 'pembunuhan',
        difficulty: 'OMEGA',
        description: 'Sebuah mansion tua menjadi tempat kejadian misterius...',
        victim: { name: 'Lord Sterling', age: 65, occupation: 'CEO' },
        suspects: [
          { id: 's1', name: 'Pembantu', occupation: 'Pegawai', lieScore: 55, personality: 'Humble', motive: 'Uang', alibi: 'Di dapur', psychProfile: 'Loyal', isGuilty: false },
          { id: 's2', name: 'Pewaris', occupation: 'Wiraswasta', lieScore: 80, personality: 'Ambitious', motive: 'Warisan', alibi: 'Di kamar', psychProfile: 'Narcissistic', isGuilty: true },
        ],
        evidence: [
          { id: 'e1', name: 'Surat Wasiat', description: 'Dokumen warisan', isKeyEvidence: true, isFake: false, forensicAnalysis: 'Surat asli dengan tanda tangan valid' },
          { id: 'e2', name: 'Racun', description: 'Sisa cairan mencurigakan', isKeyEvidence: true, isFake: false, forensicAnalysis: 'Mengandung sianida' },
        ],
        timeline: ['Jam 18:00 - Makan malam', 'Jam 20:00 - Lord Sterling merasa sakit', 'Jam 22:00 - Ditemukan tewas'],
        pointReward: 1000,
        omegaLevel: 1
      }
    }
    
    return { case: caseData }
  },

  // Network - register
  registerNet: async (data) => {
    return { success: true, message: 'Registered' }
  },

  // Network - leaderboard
  getLeaderboard: async (sort = 'points', limit = 50) => {
    return {
      leaderboard: MOCK_LEADERBOARD.slice(0, limit),
      stats: {
        totalPlayers: MOCK_LEADERBOARD.length,
        activeLast24h: Math.floor(Math.random() * 10) + 1
      }
    }
  },

  // Network - daily case
  getDailyCase: async () => {
    const cases = await loadCases()
    const daily = cases[Math.floor(Math.random() * cases.length)] || cases[0]
    return { case: daily }
  },
}

