// NEXUS v3.0 - AI Call API
// Vercel Serverless Function - Groq AI

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, systemPrompt, temperature = 0.8, max_tokens = 900, model = 'llama-3.3-70b-versatile' } = req.body;
  
  // Support multiple env var names
  const apiKey = process.env.GROQ_API_KEY || process.env.GROQ_APIKEY || '';
  
  console.log('API Key available:', !!apiKey);
  console.log('API Key length:', apiKey?.length);
  
  if (!apiKey || !apiKey.startsWith('gsk_') || apiKey.length < 20) {
    return res.status(500).json({ 
      error: 'GROQ_API_KEY not configured',
      hint: 'Please set GROQ_API_KEY in Vercel Environment Variables'
    });
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
      console.error('Groq API error:', error);
      return res.status(response.status).json({ error: `Groq API error: ${error}` });
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || 'No response';
    
    res.json({ response: result });
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: error.message });
  }
}

