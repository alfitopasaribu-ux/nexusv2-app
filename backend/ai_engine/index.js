// ══════════════════════════════════════════════════════════
// NEXUS v3.0 — AI Engine (Groq + LLaMA 3.3 70B)
// backend/ai_engine/index.js
// ══════════════════════════════════════════════════════════

const Groq = require('groq-sdk');
const AI_CONFIG = require('../../config/ai_config');

class NexusAIEngine {
  constructor() {
    this.client = new Groq({ apiKey: AI_CONFIG.apiKey });
    this.model = AI_CONFIG.model;
    this.stats = { calls: 0, tokens: 0, errors: 0 };
  }

  async call(messages, systemPrompt, options = {}) {
    const { temperature = AI_CONFIG.temperature, maxTokens = AI_CONFIG.maxTokens } = options;
    this.stats.calls++;
    try {
      const res = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature,
        max_tokens: maxTokens,
      });
      const text = res.choices[0]?.message?.content || '';
      this.stats.tokens += res.usage?.total_tokens || 0;
      return text;
    } catch (err) {
      this.stats.errors++;
      console.error('[NEXUS AI] Error:', err.message);
      throw new Error(`AI Engine error: ${err.message}`);
    }
  }

  async callJSON(messages, systemPrompt, options = {}) {
    const raw = await this.call(messages, systemPrompt + '\n\nBalas HANYA dengan JSON valid. Tanpa markdown, tanpa penjelasan.', { ...options, temperature: 0.7 });
    try {
      return JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch {
      console.error('[NEXUS AI] JSON parse failed, raw:', raw.substring(0, 300));
      return null;
    }
  }

  getStats() { return { ...this.stats, model: this.model }; }
}

module.exports = new NexusAIEngine();
