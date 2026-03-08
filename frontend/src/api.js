// ============================================================
// NEXUS v3.0 — GROQ AI Client (Vercel Compatible)
// ============================================================

export const GROQ_CONFIG = {
  API_KEY: import.meta.env.VITE_GROQ_API_KEY || "",
  MODEL: "llama-3.3-70b-versatile",
  BASE_URL: "https://api.groq.com/openai/v1/chat/completions",
}

function generateFallback(messages, sp) {
  if (sp.includes("tersangka") || sp.includes("karakter")) {
    const r = [
      "Saya tidak ada hubungannya dengan ini. Anda membuang waktu.",
      "Pertanyaan menarik... tapi saya tidak perlu menjawab.",
      "Coba buktikan dulu sebelum menuduh saya.",
      "Saya sudah bilang — saya tidak di sana malam itu.",
      "Hubungi pengacara saya jika ingin bicara lebih lanjut.",
    ]
    return r[Math.floor(Math.random() * r.length)]
  }
  if (sp.includes("psikolog") || sp.includes("profil"))
    return "Subjek menunjukkan pola perilaku defensive yang kuat. Terdapat inkonsistensi antara narasi verbal dan indikator stres. Kemungkinan menyembunyikan informasi: 73%. Rekomendasikan tekanan pada titik temporal kejadian."
  if (sp.includes("mind") || sp.includes("teori"))
    return "Teori Anda memiliki 3 celah kritis: (1) Anda mengabaikan window waktu 15 menit yang tidak bisa dijelaskan, (2) Motif yang Anda bangun bergantung pada asumsi yang belum terverifikasi, (3) Ada satu bukti yang secara aktif bertentangan dengan kesimpulan Anda. Kembali ke kronologi."
  if (sp.includes("forensik") || sp.includes("lab"))
    return "ANALISIS FORENSIK: Pola luka menunjukkan serangan dari belakang. Sudut serangan 23 derajat ke kanan — pelaku kemungkinan kidal atau menyerang dari posisi tidak nyaman. Jejak kimia: tidak natural, kemungkinan rekayasa. Waktu kematian: 2-4 jam sebelum ditemukan."
  return "NEXUS membutuhkan koneksi API aktif untuk analisis penuh. Masukkan GROQ API Key di Settings."
}

export async function callGroqAI(messages, systemPrompt, temperature = 0.8, maxTokens = 900) {
  if (!GROQ_CONFIG.API_KEY) {
    await new Promise((r) => setTimeout(r, 1800))
    return generateFallback(messages, systemPrompt)
  }
  try {
    const res = await fetch(GROQ_CONFIG.BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_CONFIG.API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_CONFIG.MODEL,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature,
        max_tokens: maxTokens,
      }),
    })
    const data = await res.json()
    return data.choices?.[0]?.message?.content || "Neural link terputus."
  } catch {
    return generateFallback(messages, systemPrompt)
  }
}

export function setApiKey(key) {
  GROQ_CONFIG.API_KEY = key
}
