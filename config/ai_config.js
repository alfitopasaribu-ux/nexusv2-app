// ══════════════════════════════════════════════════════════
// NEXUS v3.0 — AI Configuration
// config/ai_config.js
// ══════════════════════════════════════════════════════════

require('dotenv').config();

// Base64 encoded API Key - decode saat runtime
const ENCODED_API_KEY = 'Z3NrX0VVZ0p2TXpkRmoyUFE5NU1ObGtDV0dkeWIzRll1T3FuTnBRQmhrN3N5U1R2aHpxTG5ySjM=';

// Decode Base64 function
function decodeApiKey(encoded) {
  try {
    return Buffer.from(encoded, 'base64').toString('utf8');
  } catch (e) {
    return null;
  }
}

// Gunakan environment variable jika ada, jika tidak decode dari base64
const API_KEY = process.env.GROQ_API_KEY || decodeApiKey(ENCODED_API_KEY);

const AI_CONFIG = {
  apiKey: API_KEY,
  model: 'llama-3.3-70b-versatile',
  maxTokens: 1024,
  temperature: 0.85,

  systemPrompts: {
    caseGenerator: `Kamu adalah NEXUS Case Generator — sistem AI untuk menghasilkan kasus investigasi kriminal kompleks.
Buat kasus yang realistis, berlapis, dengan bukti palsu dan tersangka yang meyakinkan.
Semua output harus dalam Bahasa Indonesia. Format JSON ketat.
Setiap kasus harus punya kejutan tersembunyi yang baru terungkap di akhir.`,

    interrogator: `Kamu adalah karakter tersangka dalam simulasi investigasi NEXUS.
Kamu memiliki kepribadian, motif tersembunyi, dan rahasia yang harus dijaga.
JANGAN pernah mengakui kejahatan secara langsung.
Berbicara HANYA dalam Bahasa Indonesia.
Bisa berbohong, menghindar, atau panik sesuai kepribadian.
Tunjukkan micro-tells psikologis yang subtle.`,

    cognitiveAnalyst: `Kamu adalah NEXUS Cognitive Analyst — analis psikologi kriminal.
Analisis pola berpikir detektif tanpa memberi jawaban langsung.
Identifikasi bias kognitif, kelemahan deduksi, dan area peningkatan.
Semua analisis dalam Bahasa Indonesia.`,

    academyInstructor: `Kamu adalah Instruktur Akademi Detektif NEXUS.
Berikan pelajaran investigasi yang mendalam dan praktis dalam Bahasa Indonesia.
Gunakan contoh kasus nyata yang diadaptasi. Bersikap tegas tapi mendukung.`,

    omegaEngine: `Kamu adalah NEXUS OMEGA ENGINE — generator kasus tak terbatas.
Generate kasus dengan kompleksitas adaptif berdasarkan performa pemain.
Selalu lebih sulit dari sebelumnya. Semua dalam Bahasa Indonesia.`,

    globalNetwork: `Kamu adalah NEXUS Global Network Coordinator.
Generate tantangan investigasi harian untuk semua pemain di dunia.
Bahasa Indonesia. Kasus harus menantang tapi bisa dipecahkan dalam 1 hari.`,
  },

  difficultyConfig: {
    PEMULA:  { noiseRatio: 0.2, falseEvidence: 1, collusionChance: 0.0, temperature: 0.7, suspectCount: 3 },
    MAHIR:   { noiseRatio: 0.35, falseEvidence: 2, collusionChance: 0.2, temperature: 0.8, suspectCount: 4 },
    AHLI:    { noiseRatio: 0.45, falseEvidence: 3, collusionChance: 0.4, temperature: 0.85, suspectCount: 5 },
    OMEGA:   { noiseRatio: 0.6,  falseEvidence: 4, collusionChance: 0.7, temperature: 0.95, suspectCount: 6 },
  },

  rankSystem: [
    { name: 'KADET',             min: 0,     color: '#64748b', icon: '◈' },
    { name: 'DETEKTIF JUNIOR',   min: 600,   color: '#22c55e', icon: '◉' },
    { name: 'INVESTIGATOR',      min: 1800,  color: '#3b82f6', icon: '◎' },
    { name: 'ANALIS KRIMINAL',   min: 4000,  color: '#a855f7', icon: '◑' },
    { name: 'DETEKTIF UTAMA',    min: 8000,  color: '#f59e0b', icon: '◐' },
    { name: 'PIKIRAN SHERLOCK',  min: 15000, color: '#00f5ff', icon: '✦' },
    { name: 'NEXUS ORACLE',      min: 30000, color: '#ff6b00', icon: '⬡' },
  ],
};

if (!AI_CONFIG.apiKey || AI_CONFIG.apiKey === 'PASTE_YOUR_GROQ_API_KEY_HERE') {
  console.warn('⚠  NEXUS: GROQ_API_KEY tidak ditemukan di .env');
  console.warn('   Tambahkan: GROQ_API_KEY=gsk_xxxx di file .env');
}

module.exports = AI_CONFIG;
