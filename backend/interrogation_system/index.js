// ══════════════════════════════════════════════════════════
// NEXUS v3.0 — Interrogation System
// backend/interrogation_system/index.js
// ══════════════════════════════════════════════════════════

const ai = require('../ai_engine');
const AI_CONFIG = require('../../config/ai_config');

class InterrogationSystem {
  constructor() { this.sessions = new Map(); }

  start(sessionId, caseData, suspectId) {
    const suspect = caseData.suspects.find(s => s.id === suspectId);
    if (!suspect) throw new Error('Tersangka tidak ditemukan');
    const session = { sessionId, caseId: caseData.id, suspect, messages: [], stressLevel: 0, behaviorFlags: [], questionCount: 0, startTime: Date.now() };
    this.sessions.set(sessionId, session);
    return session;
  }

  async interrogate(sessionId, playerMessage) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Sesi tidak ditemukan');
    const { suspect } = session;
    session.questionCount++;

    const personalityMap = {
      'gugup':            'Kamu sangat gugup, bicara cepat, kadang tersandung kata-kata. Berikan detail berlebihan saat panik.',
      'manipulatif':      'Kamu sangat manipulatif, selalu putar balik situasi. Charming tapi berbahaya dan kalkulatif.',
      'percaya_diri':     'Kamu sangat percaya diri, menganggap penyelidik bodoh. Kadang terlalu banyak bicara karena merasa aman.',
      'pendiam':          'Kamu minimal bicara. Maksimal 2 kalimat per jawaban. Sering jawab dengan pertanyaan balik.',
      'penuh_kebohongan': 'Kamu pembohong ulung. Setiap detail bohong dengan cara logis. Sangat konsisten dan berbahaya.',
    };

    const stressMod = session.stressLevel > 70
      ? '\nSTRES KRITIS — mulai membuat kesalahan kecil dan inkonsistensi subtle.'
      : session.stressLevel > 40
      ? '\nStres meningkat — tanda-tanda ketidaknyamanan mulai terlihat.'
      : '';

    const sys = `${AI_CONFIG.systemPrompts.interrogator}

NAMA: ${suspect.name}
JABATAN: ${suspect.occupation}
KEPRIBADIAN: ${suspect.personality}
${personalityMap[suspect.personality] || ''}
${stressMod}

MOTIF SEBENARNYA [RAHASIA MUTLAK — JANGAN UNGKAP]: ${suspect.motive}
ALIBI: ${suspect.alibi}
PROFIL PSIKOLOGI: ${suspect.psychProfile}
BERSALAH: ${suspect.isGuilty}

ATURAN:
- HANYA Bahasa Indonesia
- JANGAN akui kejahatan secara eksplisit
- Tunjukkan micro-tells psikologis yang subtle
- Maksimal 4 kalimat per respons
- Tetap dalam karakter penuh`;

    session.messages.push({ role: 'user', content: playerMessage });
    const response = await ai.call(session.messages, sys, { temperature: 0.92, maxTokens: 300 });
    session.messages.push({ role: 'assistant', content: response });

    const analysis = this._analyzeBehavior(playerMessage, response, suspect);
    session.stressLevel = Math.min(100, session.stressLevel + analysis.stressGain);
    session.behaviorFlags.push(...analysis.flags);

    return { response, stressLevel: session.stressLevel, behaviorFlags: analysis.flags, questionCount: session.questionCount };
  }

  _analyzeBehavior(q, r, suspect) {
    const rl = r.toLowerCase();
    const flags = [];
    let stressGain = Math.random() * 2;

    if (rl.includes('tidak ingat') || rl.includes('lupa') || rl.includes('kurang ingat')) {
      flags.push({ type: 'PENGHINDARAN_MEMORI', severity: 'high', color: '#ef4444' });
      stressGain += 12;
    }
    if (rl.includes('mengapa') && (rl.includes('tanya') || rl.includes('curiga'))) {
      flags.push({ type: 'DEFLEKSI', severity: 'medium', color: '#f59e0b' });
      stressGain += 8;
    }
    if (rl.includes('pengacara') || rl.includes('hak saya') || rl.includes('tidak berkewajiban')) {
      flags.push({ type: 'PERLINDUNGAN_HUKUM', severity: 'high', color: '#a855f7' });
      stressGain += 15;
    }
    if (r.split(' ').length > 90) {
      flags.push({ type: 'PENJELASAN_BERLEBIH', severity: 'medium', color: '#6366f1' });
      stressGain += 6;
    }
    if (rl.includes('percaya saya') || rl.includes('sungguh') || rl.includes('saya bersumpah')) {
      flags.push({ type: 'PROTESTASI_BERLEBIH', severity: 'high', color: '#ef4444' });
      stressGain += 10;
    }
    if (suspect.motive && q.toLowerCase().split(' ').some(w => suspect.motive.toLowerCase().includes(w) && w.length > 4)) {
      flags.push({ type: '⚡ TOPIK_SENSITIF', severity: 'critical', color: '#ff6b00' });
      stressGain += 22;
    }
    return { flags, stressGain };
  }

  summary(sessionId) {
    const s = this.sessions.get(sessionId);
    if (!s) return null;
    return { sessionId, suspect: s.suspect.name, questionCount: s.questionCount, maxStress: s.stressLevel, flags: s.behaviorFlags, duration: Math.floor((Date.now() - s.startTime) / 1000) };
  }

  end(sessionId) {
    const sum = this.summary(sessionId);
    this.sessions.delete(sessionId);
    return sum;
  }
}

module.exports = new InterrogationSystem();
