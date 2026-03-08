// NEXUS v3.0 - AI Call API
// Vercel Serverless Function - Groq AI

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, systemPrompt, temperature = 0.8, max_tokens = 900, model = 'llama-3.3-70b-versatile' } = req.body;
  
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey || apiKey === 'PASTE_YOUR_GROQ_API_KEY_HERE') {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature,
        max_tokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error: `Groq API error: ${error}` });
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || 'No response';
    
    res.json({ response: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

