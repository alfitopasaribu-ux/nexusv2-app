// ══════════════════════════════════════════════════════════
// NEXUS v3.0 — Omega Engine
// backend/omega_engine/index.js
// ══════════════════════════════════════════════════════════

const ai = require('../ai_engine');
const caseGen = require('../case_generator');
const AI_CONFIG = require('../../config/ai_config');

class OmegaEngine {
  constructor() { this.level = 1; this.generated = 0; }

  isUnlocked(profile) { return profile.solved >= 50 || profile.totalPoints >= 30000; }

  async next(profile) {
    this.generated++;
    this.level = Math.min(10, 1 + Math.floor(this.generated / 3));
    const c = await caseGen.generateDynamic({ ...profile, omegaLevel: this.level });
    if (c) { c.isOmega = true; c.omegaLevel = this.level; c.pointReward = 1000 * this.level; }
    return c;
  }

  async psychChallenge(profile) {
    const prompt = `Buat "Tantangan Psikologis" untuk NEXUS OMEGA MODE.
Target kelemahan: ${profile.detectedBiases?.join(', ') || 'confirmation bias'}
JSON: {"type":"...","scenario":"...","pertanyaan":"...","jebakan":["..."],"pendekatanBenar":"...","petunjuk":"..."}`;
    return await ai.callJSON([{ role:'user', content: prompt }], AI_CONFIG.systemPrompts.omegaEngine, { temperature: 0.92 });
  }

  stats() { return { generated: this.generated, level: this.level }; }
}

module.exports = new OmegaEngine();
