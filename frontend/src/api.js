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

// Mock data for modules
const MODULES = [
  { id: 'obs', icon: '🔍', title: 'Observasi Forensic', desc: 'Latih kemampuan mengamati detail', level: 1 },
  { id: 'ded', icon: '🧠', title: 'Deduksi Logis', desc: 'Belajar berpikir sistematis', level: 2 },
  { id: 'bias', icon: '⚖️', title: 'Anti-Bias', desc: 'Kurangi kesalahan kognitif', level: 3 },
  { id: 'pola', icon: '📊', title: 'Pengenalan Pola', desc: 'Identifikasi pola tersembunyi', level: 4 },
  { id: 'inter', icon: '💬', title: 'Interogasi', desc: 'Teknik mendapatkan informasi', level: 5 },
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

Berikan analisis mendalam tentang kekuatan dan kelemahan teori ini. Identifikasi:
1. Kelemahan logis
2. Bukti yang mendukung
3. Bias yang mungkin terjadi
4. Saran investigasi lanjutan

Respons dalam format JSON dengan: analysis (string), score (number 0-100)`
    
    const result = await callGroq(prompt, 'You are NEXUS cognitive analysis AI.')
    
    return {
      analysis: result,
      score: Math.floor(Math.random() * 40) + 60 // Mock score
    }
  },

  // Academy - get modules
  getModules: async () => {
    return { modules: MODULES }
  },

  // Academy - get lesson
  getLesson: async (data) => {
    const mod = MODULES.find(m => m.id === data.moduleId)
    
    const prompt = `Buat materi pembelajaran untuk modul: ${mod?.title || 'Detective'}
Level: ${mod?.level || 1}

Buat dalam format JSON dengan:
- lessonTitle: string
- objective: string  
- theory: string (materi teori)
- keyPoints: array of strings
- caseExample: object dengan scenario, question, options`
    
    const result = await callGroq(prompt, 'You are NEXUS educational AI. Create lesson content in Indonesian.')
    
    // Parse or use default
    let lesson
    try {
      lesson = JSON.parse(result)
    } catch {
      lesson = {
        lessonTitle: mod?.title || 'Pelajaran Detektif',
        objective: 'Memahami dasar investigasi',
        theory: 'Investigasi crime memerlukan analisis sistematis...',
        keyPoints: ['Amati bukti dengan teliti', 'Catat semua detail', 'Verifikasi informasi'],
        caseExample: {
          scenario: 'Di TKP ditemukan pisau dengan sidik jari',
          question: 'Apa langkah pertama yang harus dilakukan?',
          options: ['Mengambil pisau langsung', 'Mendokumentasikan TKP dulu', 'Menyisir area sekitar', 'Manggil forensik']
        }
      }
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
  "type": "pembLOBALS|kejahatan_finansial|orang_hilang|konspirasi",
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

