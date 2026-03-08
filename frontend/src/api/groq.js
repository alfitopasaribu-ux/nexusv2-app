// NEXUS_v3 Groq AI Client
// Satu tempat untuk API key - dipakai di semua fitur AI

import Groq from 'groq-sdk'

// Get API key dari environment variable
const getApiKey = () => {
  // Dari environment variable (Vercel) atau .env.local
  const envKey = import.meta.env.VITE_GROQ_API_KEY
  if (envKey && envKey.startsWith('gsk_') && envKey.length > 20) {
    return envKey
  }
  // Return null kalau belum diset - user harus set di Vercel
  return null
}

// Initialize Groq client
let groq = null

function initGroq() {
  const apiKey = getApiKey()
  if (apiKey) {
    groq = new Groq({ apiKey })
  }
  return groq
}

export async function callGroq(prompt, systemPrompt = 'You are NEXUS AI detective.') {
  const client = initGroq()
  
  if (!client) {
    return 'Error: VITE_GROQ_API_KEY belum diset. Buka file .env dan paste API key Groq kamu.'
  }
  
  try {
    const chat = await client.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024
    })
    return chat.choices[0]?.message?.content || ''
  } catch (e) {
    return 'Error: ' + e.message
  }
}

export function isAiReady() {
  return getApiKey() !== null
}

