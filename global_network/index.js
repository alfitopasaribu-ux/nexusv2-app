// ══════════════════════════════════════════════════════════
// NEXUS v3.0 — Global Crime Network
// global_network/index.js
// ══════════════════════════════════════════════════════════

const ai = require('../backend/ai_engine');
const AI_CONFIG = require('../config/ai_config');

class GlobalNetwork {
  constructor() {
    this.leaderboard = [];
    this.dailyCase = null;
    this.dailyCaseDate = null;
    this.activePlayers = new Map();
  }

  registerPlayer(playerId, name) {
    if (!this.leaderboard.find(p => p.id === playerId)) {
      this.leaderboard.push({ id: playerId, name, points: 0, solved: 0, rank: 'KADET', country: 'ID', lastActive: Date.now() });
    }
    this.activePlayers.set(playerId, Date.now());
    return this.leaderboard.find(p => p.id === playerId);
  }

  updateScore(playerId, points, solved) {
    const player = this.leaderboard.find(p => p.id === playerId);
    if (!player) return;
    player.points += points;
    player.solved += solved;
    player.lastActive = Date.now();
    const rank = AI_CONFIG.rankSystem.slice().reverse().find(r => player.points >= r.min);
    if (rank) player.rank = rank.name;
    this.leaderboard.sort((a, b) => b.points - a.points);
  }

  getLeaderboard(type = 'points', limit = 50) {
    const sorted = [...this.leaderboard].sort((a, b) => {
      if (type === 'solved') return b.solved - a.solved;
      return b.points - a.points;
    });
    return sorted.slice(0, limit).map((p, i) => ({ ...p, position: i + 1 }));
  }

  async getDailyCase() {
    const today = new Date().toDateString();
    if (this.dailyCaseDate === today && this.dailyCase) return this.dailyCase;

    const prompt = `Generate kasus tantangan harian NEXUS Global Network.
Kasus harus bisa diselesaikan dalam 30-60 menit.
Terinspirasi dari kejahatan internasional yang diadaptasi.
Tingkat kesulitan: MAHIR. Bahasa Indonesia.
Format JSON standar kasus NEXUS.`;

    const c = await ai.callJSON([{ role: 'user', content: prompt }], AI_CONFIG.systemPrompts.globalNetwork, { temperature: 0.85, maxTokens: 2000 });
    if (c) { this.dailyCase = { ...c, id: `daily_${today.replace(/ /g,'_')}`, isDaily: true, resetTime: this._nextMidnight() }; this.dailyCaseDate = today; }
    return this.dailyCase;
  }

  submitDailyResult(playerId, solved, timeSec) {
    this.updateScore(playerId, solved ? 500 : 0, solved ? 1 : 0);
    return { submitted: true, bonusXP: solved ? Math.max(0, 500 - Math.floor(timeSec / 60) * 10) : 0 };
  }

  _nextMidnight() {
    const d = new Date(); d.setHours(24, 0, 0, 0); return d.getTime();
  }

  getStats() {
    return { totalPlayers: this.leaderboard.length, activeLast24h: this.leaderboard.filter(p => Date.now() - p.lastActive < 86400000).length, topDetective: this.leaderboard[0] || null };
  }
}

module.exports = new GlobalNetwork();
