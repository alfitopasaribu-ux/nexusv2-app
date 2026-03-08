// NEXUS_v3 Groq AI Client
// Satu tempat untuk API key - dipakai di semua fitur AI

import Groq from 'groq-sdk'

// =====================================================
// API KEY - Langsung taruh di sini untuk sementara
// Nanti kalau sudah jalan, pake Environment Variable
// =====================================================
const HARDCODED_API_KEY = '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'

// Get API key - cek environment variable dulu
const getApiKey = () => {
  // Coba dari environment variable (Vite/Vercel)
  const envKey = import.meta.env.VITE_GROQ_API_KEY
  
  // Validasi: harus mulai dengan "gsk_" dan panjang > 20
  if (envKey && typeof envKey === 'string' && envKey.startsWith('gsk_') && envKey.length > 20) {
    console.log('[Groq] Using ENV API Key')
    return envKey
  }
  
  // Fallback: pake hardcoded key
  console.log('[Groq] Using HARDCODED API Key')
  return HARDCODED_API_KEY
}

// Initialize Groq client - singleton
let groqClient = null

function initGroq() {
  if (groqClient) return groqClient
  
  const apiKey = getApiKey()
  if (!apiKey) {
    console.error('[Groq] No API key available!')
    return null
  }
  
  try {
    groqClient = new Groq({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    })
    console.log('[Groq] Client initialized successfully')
  } catch (error) {
    console.error('[Groq] Initialization error:', error)
    return null
  }
  
  return groqClient
}

// Main function to call Groq AI
export async function callGroq(prompt, systemPrompt = 'You are NEXUS AI detective. Respond in Indonesian.') {
  console.log('[Groq] Calling AI with prompt:', prompt.substring(0, 50) + '...')
  
  const client = initGroq()
  
  if (!client) {
    const errorMsg = 'Error: Gagal inisialisasi Groq client'
    console.error('[Groq]', errorMsg)
    return errorMsg
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
    
    const response = chat.choices[0]?.message?.content
    console.log('[Groq] Response received:', response?.substring(0, 50) + '...')
    
    if (!response) {
      return 'Error: Tidak ada response dari AI. Coba lagi.'
    }
    
    return response
    
  } catch (error) {
    console.error('[Groq] API Error:', error.message)
    return 'Error: ' + error.message
  }
}

// Check if AI is ready
export function isAiReady() {
  return getApiKey() !== null
}
