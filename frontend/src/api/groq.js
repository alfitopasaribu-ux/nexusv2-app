import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || 'gsk_your_key_here'
})

export async function callGroq(prompt, systemPrompt = 'You are NEXUS AI detective.') {
  try {
    const chat = await groq.chat.completions.create({
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

