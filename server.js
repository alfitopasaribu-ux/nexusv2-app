// ══════════════════════════════════════════════════════════
// NEXUS v3.0 — Main Server
// server.js
// ══════════════════════════════════════════════════════════

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const { v4: uuid } = require('uuid');
const path       = require('path');

const caseGen    = require('./backend/case_generator');
const interro    = require('./backend/interrogation_system');
const cognitive  = require('./backend/cognitive_analysis');
const academy    = require('./backend/academy_system');
const omega      = require('./backend/omega_engine');
const network    = require('./global_network');
const voice      = require('./voice_system');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Security ────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: ['http://localhost:5173','http://localhost:3000','http://localhost:3001'] }));
app.use(express.json({ limit: '10mb' }));
app.use(rateLimit({ windowMs: 15*60*1000, max: 150, message: { error: 'Terlalu banyak request. Coba lagi nanti.' } }));

// ── Health ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const ok = !!(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'PASTE_YOUR_GROQ_API_KEY_HERE');
  res.json({ status: 'NEXUS ONLINE', version: '3.0.0', aiReady: ok, model: 'llama-3.3-70b-versatile', ts: new Date().toISOString() });
});

// ── CASES ────────────────────────────────────────────────
app.get('/api/cases', (req, res) => {
  res.json({ success: true, cases: caseGen.loadAllCases(), total: 50 });
});
app.get('/api/cases/:id', (req, res) => {
  const c = caseGen.loadCase(parseInt(req.params.id));
  if (!c) return res.status(404).json({ error: 'Kasus tidak ditemukan' });
  res.json({ success: true, case: caseGen.sanitize(c) });
});
app.post('/api/cases/:id/solve', (req, res) => {
  const { suspectId, playerId } = req.body;
  const c = caseGen.loadCase(parseInt(req.params.id));
  if (!c) return res.status(404).json({ error: 'Kasus tidak ditemukan' });
  const result = caseGen.validateSolution(c, suspectId);
  if (playerId && result.correct) network.updateScore(playerId, result.pointReward, 1);
  res.json({ success: true, result });
});

// ── INTERROGATION ────────────────────────────────────────
app.post('/api/interrogation/start', (req, res) => {
  const { caseId, suspectId, playerId } = req.body;
  const c = caseGen.loadCase(parseInt(caseId));
  if (!c) return res.status(404).json({ error: 'Kasus tidak ditemukan' });
  const sid = uuid();
  const session = interro.start(sid, c, suspectId);
  res.json({ success: true, sessionId: sid, suspect: { name: session.suspect.name, personality: session.suspect.personality } });
});
app.post('/api/interrogation/message', async (req, res) => {
  const { sessionId, message } = req.body;
  try {
    const r = await interro.interrogate(sessionId, message);
    res.json({ success: true, ...r });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/interrogation/end', (req, res) => {
  const sum = interro.end(req.body.sessionId);
  res.json({ success: true, summary: sum });
});

// ── COGNITIVE ────────────────────────────────────────────
app.get('/api/cognitive/:pid', (req, res) => {
  res.json({ success: true, profile: cognitive.getProfile(req.params.pid) });
});
app.post('/api/cognitive/analyze', async (req, res) => {
  const { playerId, caseId, actions } = req.body;
  const c = caseGen.loadCase(parseInt(caseId));
  if (!c) return res.status(404).json({ error: 'Kasus tidak ditemukan' });
  try {
    const r = await cognitive.analyzeCase(playerId, c, actions);
    res.json({ success: true, ...r });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/cognitive/:pid/report', async (req, res) => {
  try {
    const r = await cognitive.generateReport(req.params.pid);
    res.json({ success: true, report: r });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── ACADEMY ──────────────────────────────────────────────
app.get('/api/academy/modules', (req, res) => {
  res.json({ success: true, modules: academy.getModules() });
});
app.post('/api/academy/lesson', async (req, res) => {
  const { moduleId, lessonNumber, playerId } = req.body;
  const profile = playerId ? cognitive.getProfile(playerId) : {};
  try {
    const lesson = await academy.generateLesson(moduleId, lessonNumber || 1, profile);
    res.json({ success: true, lesson });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/academy/evaluate', async (req, res) => {
  const { moduleId, question, answer } = req.body;
  try {
    const r = await academy.evaluateAnswer(moduleId, question, answer);
    res.json({ success: true, evaluation: r });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── OMEGA ────────────────────────────────────────────────
app.post('/api/omega/next', async (req, res) => {
  const { playerId } = req.body;
  const profile = cognitive.getProfile(playerId);
  if (!omega.isUnlocked(profile)) return res.status(403).json({ error: 'NEXUS OMEGA belum terbuka. Selesaikan 50 kasus atau capai 30.000 XP.' });
  try {
    const c = await omega.next(profile);
    res.json({ success: true, case: c, stats: omega.stats() });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── GLOBAL NETWORK ───────────────────────────────────────
app.post('/api/network/register', (req, res) => {
  const { playerId, name } = req.body;
  const player = network.registerPlayer(playerId, name);
  res.json({ success: true, player, stats: network.getStats() });
});
app.get('/api/network/leaderboard', (req, res) => {
  const { type = 'points', limit = 50 } = req.query;
  res.json({ success: true, leaderboard: network.getLeaderboard(type, parseInt(limit)), stats: network.getStats() });
});
app.get('/api/network/daily', async (req, res) => {
  try {
    const c = await network.getDailyCase();
    if (!c) return res.status(503).json({ error: 'Kasus harian belum tersedia' });
    res.json({ success: true, case: c });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/network/daily/submit', (req, res) => {
  const { playerId, solved, timeSec } = req.body;
  res.json({ success: true, ...network.submitDailyResult(playerId, solved, timeSec) });
});

// ── MIND READER ──────────────────────────────────────────
app.post('/api/mindreader', async (req, res) => {
  const { theory, caseId } = req.body;
  const c = caseId ? caseGen.loadCase(parseInt(caseId)) : null;
  const ai = require('./backend/ai_engine');
  const AI_CONFIG = require('./config/ai_config');
  try {
    const r = await ai.call([{ role:'user', content:`Analisis teori investigasi ini secara mendalam:\n\n${theory}` }],
      `${AI_CONFIG.systemPrompts.cognitiveAnalyst}\n${c ? `Konteks: ${c.title} — ${c.description}` : ''}`,
      { temperature: 0.85, maxTokens: 600 });
    res.json({ success: true, analysis: r });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── CHALLENGER ───────────────────────────────────────────
app.post('/api/challenger', async (req, res) => {
  const { theory, history = [], attackLevel = 1 } = req.body;
  const ai = require('./backend/ai_engine');
  const lvl = Math.min(5, Math.max(1, attackLevel));
  try {
    const r = await ai.call([...history, { role:'user', content: theory }],
      `NEXUS Cognitive Challenger Level ${lvl}/5. ${lvl >= 4 ? 'Brutal dan tanpa ampun.' : 'Kritis dan tajam.'} Serang kelemahan logis teori. JANGAN beri jawaban. Bahasa Indonesia. Maksimal 120 kata.`,
      { temperature: 0.95, maxTokens: 250 });
    res.json({ success: true, response: r });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── VOICE CONFIG ─────────────────────────────────────────
app.get('/api/voice/config', (req, res) => { res.json({ success: true, config: voice.clientConfig() }); });

// ── SERVE FRONTEND (production) ──────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/dist')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'frontend/dist/index.html')));
}

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  NEXUS v3.0 — AI Cognitive Crime Platform  ║
║  Server aktif di port ${PORT}                 ║
║  Built by Ell — Visionary Engineer 2046    ║
╚════════════════════════════════════════════╝`);
  const ok = !!(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'PASTE_YOUR_GROQ_API_KEY_HERE');
  console.log(`  AI Status: ${ok ? '✅ GROQ API KEY AKTIF' : '⚠️  GROQ_API_KEY belum diset di .env'}`);
});

module.exports = app;
