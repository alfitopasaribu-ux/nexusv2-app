// ══════════════════════════════════════════════════════════
// NEXUS v3.0 — Case Generator
// backend/case_generator/index.js
// ══════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');
const ai   = require('../ai_engine');
const AI_CONFIG = require('../../config/ai_config');

class CaseGenerator {
  constructor() {
    this.casesDir  = path.join(__dirname, '../../cases');
    this.caseCache = new Map();
  }

  loadCase(id) {
    if (this.caseCache.has(id)) return this.caseCache.get(id);
    const file = path.join(this.casesDir, `case${String(id).padStart(2,'0')}.json`);
    if (!fs.existsSync(file)) return null;
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    this.caseCache.set(id, data);
    return data;
  }

  loadAllCases() {
    const list = [];
    for (let i = 1; i <= 50; i++) {
      const c = this.loadCase(i);
      if (c) list.push({ id: i, title: c.title, difficulty: c.difficulty, type: c.type, pointReward: c.pointReward, isOmega: c.isOmega || false });
    }
    return list;
  }

  /** Remove solution and culprit identification before sending to player */
  sanitize(caseData) {
    const { solution, ...rest } = caseData;
    // Also remove isGuilty from suspects to prevent cheating
    if (rest.suspects) {
      rest.suspects = rest.suspects.map(({ isGuilty, ...suspect }) => suspect);
    }
    return rest;
  }

  validateSolution(caseData, suspectId) {
    const correct = caseData.solution.culpritId === suspectId;
    const culprit = caseData.suspects.find(s => s.id === caseData.solution.culpritId);
    return {
      correct,
      culpritId:   caseData.solution.culpritId,
      culpritName: culprit?.name || '???',
      explanation: caseData.solution.explanation,
      method:      caseData.solution.method,
      keyEvidence: caseData.solution.keyEvidence,
      pointReward: correct ? (caseData.pointReward || 300) : 0,
    };
  }

  /** Dynamic case for OMEGA mode */
  async generateDynamic(playerProfile) {
    const diff   = this._nextDiff(playerProfile);
    const cfg    = AI_CONFIG.difficultyConfig[diff];
    const prompt = `Generate kasus investigasi NEXUS OMEGA kompleks untuk pemain dengan profil:
Skor Kognitif: ${playerProfile.cognitiveScore || 70}
Kasus Selesai: ${playerProfile.solved || 50}
Kelemahan: ${(playerProfile.weaknesses || []).join(', ') || 'pola menyesatkan'}
Tingkat Kesulitan: ${diff}
Rasio Noise: ${cfg.noiseRatio * 100}%
Bukti Palsu: ${cfg.falseEvidence}
Kolusi Tersangka: ${cfg.collusionChance > 0 ? 'YA' : 'TIDAK'}

JSON format wajib:
{
  "id": "omega_${Date.now()}",
  "title": "...",
  "type": "pembunuhan|spionase|kejahatan_finansial|konspirasi|pembunuhan_berantai|kejahatan_siber",
  "difficulty": "${diff}",
  "location": "...",
  "description": "2-3 kalimat ringkasan",
  "victim": { "name":"","age":0,"occupation":"" },
  "timeline": ["..."],
  "suspects": [{ "id":"s1","name":"","age":0,"occupation":"","motive":"","alibi":"","personality":"gugup|manipulatif|percaya_diri|pendiam|penuh_kebohongan","psychProfile":"","isGuilty":false }],
  "evidence": [{ "id":"e1","name":"","description":"","forensicAnalysis":"","isKeyEvidence":true,"isFake":false,"category":"fisik|digital|forensik|testimoni" }],
  "witnesses": [{ "name":"","statement":"" }],
  "hiddenContradictions": ["..."],
  "cognitiveTraps": ["..."],
  "solution": { "culpritId":"s1","method":"","explanation":"","keyEvidence":["e1"] },
  "pointReward": ${1000 + playerProfile.solved * 50},
  "isOmega": true
}`;

    const c = await ai.callJSON([{ role:'user', content: prompt }], AI_CONFIG.systemPrompts.omegaEngine, { temperature: cfg.temperature, maxTokens: 2000 });
    return c;
  }

  _nextDiff(p) {
    const s = p.cognitiveScore || 0;
    if (s < 40) return 'PEMULA';
    if (s < 65) return 'MAHIR';
    if (s < 85) return 'AHLI';
    return 'OMEGA';
  }
}

module.exports = new CaseGenerator();
