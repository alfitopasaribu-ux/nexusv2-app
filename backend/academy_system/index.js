// ══════════════════════════════════════════════════════════
// NEXUS v3.0 — Detective Academy System
// backend/academy_system/index.js
// ══════════════════════════════════════════════════════════

const ai = require('../ai_engine');
const AI_CONFIG = require('../../config/ai_config');

class AcademySystem {
  constructor() {
    this.modules = [
      { id: 'dasar',    title: 'Dasar Investigasi',         icon: '🔍', level: 1, desc: 'Fondasi metodologi investigasi kriminal profesional' },
      { id: 'bukti',    title: 'Analisis Bukti',            icon: '🔬', level: 2, desc: 'Teknik analisis forensik dan deteksi bukti palsu' },
      { id: 'interogasi', title: 'Strategi Interogasi',    icon: '💬', level: 3, desc: 'Psikologi tersangka dan teknik pertanyaan efektif' },
      { id: 'profiling',  title: 'Profil Psikologis',      icon: '🧠', level: 4, desc: 'Membaca kepribadian dan motif tersembunyi pelaku' },
      { id: 'kompleks',   title: 'Analisis Kejahatan Kompleks', icon: '🕸', level: 5, desc: 'Kasus berlapis, konspirasi, dan kejahatan multi-motif' },
    ];
    this.progress = new Map();
  }

  getModules() { return this.modules; }

  getProgress(playerId) {
    if (!this.progress.has(playerId)) this.progress.set(playerId, {});
    return this.progress.get(playerId);
  }

  async generateLesson(moduleId, lessonNumber, playerProfile) {
    const mod = this.modules.find(m => m.id === moduleId);
    if (!mod) throw new Error('Modul tidak ditemukan');

    const prompt = `Buat pelajaran ${lessonNumber} untuk modul "${mod.title}" di Akademi Detektif NEXUS.

Profil pemain: Skor Kognitif ${playerProfile?.cognitiveScore || 50}/100

Format JSON wajib:
{
  "lessonTitle": "...",
  "objective": "...",
  "theory": "...(3-4 paragraf mendalam)...",
  "keyPoints": ["...","...","..."],
  "caseExample": {
    "scenario": "...(skenario kasus singkat)...",
    "question": "...",
    "options": ["A: ...","B: ...","C: ...","D: ..."],
    "correctAnswer": "A",
    "explanation": "..."
  },
  "practiceExercise": "...(deskripsi latihan praktis)...",
  "xpReward": 150
}`;

    return await ai.callJSON([{ role: 'user', content: prompt }], AI_CONFIG.systemPrompts.academyInstructor, { temperature: 0.75, maxTokens: 1200 });
  }

  async generateModuleCase(moduleId) {
    const mod = this.modules.find(m => m.id === moduleId);
    const prompt = `Generate kasus investigasi khusus untuk akhir modul "${mod.title}" Akademi Detektif NEXUS.
Kasus harus berfokus pada keterampilan modul ini.
Format JSON sama dengan kasus NEXUS standar. Bahasa Indonesia. Tingkat kesulitan: MAHIR.`;
    return await ai.callJSON([{ role: 'user', content: prompt }], AI_CONFIG.systemPrompts.caseGenerator, { temperature: 0.8, maxTokens: 2000 });
  }

  async evaluateAnswer(moduleId, question, playerAnswer) {
    const prompt = `Evaluasi jawaban pemain untuk pelajaran modul "${moduleId}":

Pertanyaan: ${question}
Jawaban Pemain: ${playerAnswer}

Beri evaluasi dalam JSON:
{
  "isCorrect": true/false,
  "score": 0-100,
  "feedback": "...(evaluasi spesifik dan konstruktif)...",
  "improvement": "...(area yang perlu diperbaiki)...",
  "xpEarned": 0-200
}`;
    return await ai.callJSON([{ role: 'user', content: prompt }], AI_CONFIG.systemPrompts.academyInstructor, { temperature: 0.6 });
  }
}

module.exports = new AcademySystem();
