// NEXUS_v3 Groq AI Client
// Satu tempat untuk API key - dipakai di semua fitur AI

import Groq from 'groq-sdk'

// Get API key dari environment variable
const getApiKey = () => {
  const key = import.meta.env.VITE_GROQ_API_KEY
  if (!key || key === 'gsk_your_key_here' || key.includes('your_key')) {
    return null
  }
  return key
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

