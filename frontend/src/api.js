// NEXUS v3.0 - Frontend API Configuration
// Menggunakan Groq API untuk AI features

// Deteksi environment
const isVercel = import.meta.env.VERCEL === '1';
const API_BASE = isVercel 
  ? "/api"  // Vercel serverless
  : "";     // Local development

// Helper untuk memanggil Groq API
async function callGroq(messages, systemPrompt, options = {}) {
  const defaultOptions = {
    temperature: 0.8,
    max_tokens: 900,
    model: "llama-3.3-70b-versatile"
  };
  
  const config = { ...defaultOptions, ...options };
  
  const res = await fetch(`${API_BASE}/ai/call`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      ...config
    }),
  });
  
  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }
  
  const data = await res.json();
  return data.response;
}

export const api = {
  // Health check
  health: async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (e) {
      return { status: "NEXUS OFFLINE", aiReady: false, error: e.message };
    }
  },
  
  // Load semua kasus
  getCases: async () => {
    const cases = [];
    for (let i = 1; i <= 50; i++) {
      try {
        const res = await fetch(`/cases/case${String(i).padStart(2,'0')}.json`);
        if (res.ok) cases.push(await res.json());
      } catch (e) {}
    }
    return { cases };
  },
  
  // Load satu kasus
  getCase: async (id) => {
    const res = await fetch(`/cases/case${String(id).padStart(2,'0')}.json`);
    return { case: await res.json() };
  },
  
  // Interogasi - gunakan AI
  startInterro: async ({ caseId, suspectId, playerId }) => {
    const res = await fetch(`${API_BASE}/interrogation/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caseId, suspectId, playerId })
    });
    return await res.json();
  },
  
  sendMsg: async ({ sessionId, message }) => {
    const res = await fetch(`${API_BASE}/interrogation/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message })
    });
    return await res.json();
  },
  
  // Mind Reader - analisis teori dengan AI
  mindReader: async ({ theory, caseId }) => {
    const res = await fetch(`${API_BASE}/mindreader`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theory, caseId })
    });
    return await res.json();
  },
  
  // Cognitive Report
  getCogReport: async (playerId) => {
    const res = await fetch(`${API_BASE}/cognitive/${playerId}/report`);
    return await res.json();
  },
  
  // Academy
  getModules: async () => {
    const res = await fetch(`${API_BASE}/academy/modules`);
    return await res.json();
  },
  
  getLesson: async ({ moduleId, lessonNumber, playerId }) => {
    const res = await fetch(`${API_BASE}/academy/lesson`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId, lessonNumber, playerId })
    });
    return await res.json();
  },
  
  evalAnswer: async ({ moduleId, question, answer }) => {
    const res = await fetch(`${API_BASE}/academy/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId, question, answer })
    });
    return await res.json();
  },
  
  // Solve case
  solveCase: async (caseId, { suspectId, theory, playerId }) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/solve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suspectId, theory, playerId })
    });
    return await res.json();
  },
  
  // Network
  registerNet: async ({ playerId, name }) => {
    const res = await fetch(`${API_BASE}/network/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, name })
    });
    return await res.json();
  },
  
  getLeaderboard: async (type = 'points', limit = 50) => {
    const res = await fetch(`${API_BASE}/network/leaderboard?type=${type}&limit=${limit}`);
    return await res.json();
  },
  
  getDailyCase: async () => {
    const res = await fetch(`${API_BASE}/network/daily`);
    return await res.json();
  },
  
  omegaNext: async ({ playerId }) => {
    const res = await fetch(`${API_BASE}/omega/next`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId })
    });
    return await res.json();
  },
};
