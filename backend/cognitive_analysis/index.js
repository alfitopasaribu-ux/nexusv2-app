// ══════════════════════════════════════════════════════════
// NEXUS v3.0 — Cognitive Analysis System
// backend/cognitive_analysis/index.js
// ══════════════════════════════════════════════════════════

const ai = require('../ai_engine');
const AI_CONFIG = require('../../config/ai_config');

class CognitiveAnalysis {
  constructor() { this.profiles = new Map(); }

  getProfile(playerId) {
    if (!this.profiles.has(playerId)) {
      this.profiles.set(playerId, {
        playerId,
        totalCases: 0, solved: 0, totalPoints: 0,
        cognitiveMap: { observasi: 50, deduksiLogis: 50, ketahananBias: 50, pengenalanPola: 50, interogasi: 50, analisisForensik: 50 },
        detectedBiases: [],
        caseHistory: [],
        rank: 'KADET',
        streak: 0,
        cognitiveScore: 50,
        createdAt: Date.now(),
      });
    }
    return this.profiles.get(playerId);
  }

  getRank(points) {
    const ranks = AI_CONFIG.rankSystem;
    for (let i = ranks.length - 1; i >= 0; i--) {
      if (points >= ranks[i].min) return ranks[i];
    }
    return ranks[0];
  }

  async analyzeCase(playerId, caseData, actions) {
    const profile = this.getProfile(playerId);
    const sessionData = {
      kasusId: caseData.id, kesulitan: caseData.difficulty,
      terpecahkan: actions.solved, percobaan: actions.attempts || 1,
      sesiInterogasi: actions.interrogations || 0,
      buktiDiperiksa: actions.evidenceCount || 0,
      waktuPengerjaan: actions.timeTaken || 0,
      buktiPalsuTerdeteksi: actions.falseDetected || 0,
      tersangkaPertama: actions.firstSuspect,
      tersangkaBenar: caseData.solution?.culpritId,
    };

    // AI analysis
    const prompt = `Analisis performa detektif berdasarkan data sesi ini:\n${JSON.stringify(sessionData, null, 2)}\n\nHasilkan laporan kognitif JSON:\n{"observasi":0,"deduksiLogis":0,"ketahananBias":0,"pengenalanPola":0,"biasYangTerdeteksi":[],"kekuatan":[],"kelemahan":[],"rekomendasi":""}`;
    const report = await ai.callJSON([{ role: 'user', content: prompt }], AI_CONFIG.systemPrompts.cognitiveAnalyst);

    if (report) {
      const w = 0.3;
      const cm = profile.cognitiveMap;
      const apply = (key, apiKey) => { if (report[apiKey]) cm[key] = Math.round(cm[key] * (1-w) + report[apiKey] * w); };
      apply('observasi', 'observasi'); apply('deduksiLogis', 'deduksiLogis');
      apply('ketahananBias', 'ketahananBias'); apply('pengenalanPola', 'pengenalanPola');
      if (report.biasYangTerdeteksi) report.biasYangTerdeteksi.forEach(b => { if (!profile.detectedBiases.includes(b)) profile.detectedBiases.push(b); });
    }

    profile.totalCases++;
    if (actions.solved) { profile.solved++; profile.totalPoints += actions.points || 0; profile.streak++; }
    else { profile.streak = 0; }

    const rankInfo = this.getRank(profile.totalPoints);
    profile.rank = rankInfo.name;
    profile.caseHistory.push({ caseId: caseData.id, solved: actions.solved, points: actions.points || 0, ts: Date.now() });

    const cm = profile.cognitiveMap;
    profile.cognitiveScore = Math.round((cm.observasi + cm.deduksiLogis + cm.ketahananBias + cm.pengenalanPola + cm.interogasi + cm.analisisForensik) / 6);

    return { profile, report, cognitiveScore: profile.cognitiveScore };
  }

  async generateReport(playerId) {
    const profile = this.getProfile(playerId);
    const prompt = `Buat laporan kognitif komprehensif untuk detektif berdasarkan profil ini:\n${JSON.stringify(profile, null, 2)}\n\nLaporan harus mencakup: kekuatan utama, area perbaikan, bias yang perlu diatasi, rekomendasi latihan spesifik, dan perkiraan potensi maksimal sebagai detektif. Maksimal 300 kata. Bahasa Indonesia.`;
    const narrative = await ai.call([{ role: 'user', content: prompt }], AI_CONFIG.systemPrompts.cognitiveAnalyst, { temperature: 0.7, maxTokens: 500 });
    return { narrative, cognitiveMap: profile.cognitiveMap, rank: profile.rank, totalPoints: profile.totalPoints, cognitiveScore: profile.cognitiveScore };
  }
}

module.exports = new CognitiveAnalysis();
