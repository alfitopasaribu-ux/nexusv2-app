// ══════════════════════════════════════════════════════════
// NEXUS v3.0 — Voice Interrogation System
// voice_system/index.js
// ══════════════════════════════════════════════════════════

const Groq = require('groq-sdk');
const fs   = require('fs');
require('dotenv').config();

class VoiceSystem {
  constructor() {
    this.client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  /** Server-side: transcribe audio file via Groq Whisper */
  async transcribeFile(audioPath) {
    try {
      const t = await this.client.audio.transcriptions.create({
        file: fs.createReadStream(audioPath),
        model: 'whisper-large-v3',
        language: 'id',
        response_format: 'json',
      });
      return { text: t.text, success: true };
    } catch (err) {
      return { text: '', success: false, error: err.message };
    }
  }

  /** Client-side config sent to frontend */
  clientConfig() {
    return {
      language: 'id-ID',
      continuous: false,
      interimResults: true,
      maxAlternatives: 1,
    };
  }
}

module.exports = new VoiceSystem();
