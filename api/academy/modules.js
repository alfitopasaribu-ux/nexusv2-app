// NEXUS v3.0 - Academy Modules API
// Vercel Serverless Function

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY || process.env.GROQ_APIKEY || '';

  // Demo modules
  const modules = [
    {
      id: 'mod_observasi',
      title: 'Kemampuan Observasi',
      desc: 'Latih mata detektif untuk melihat detail yang terlewat',
      icon: '🔍',
      level: 1,
      lessons: 5
    },
    {
      id: 'mod_deduksi',
      title: 'Deduksi Logis',
      desc: 'Belajar menarik kesimpulan dari fakta-fakta',
      icon: '🧠',
      level: 2,
      lessons: 5
    },
    {
      id: 'mod_bias',
      title: 'Menghindari Bias',
      desc: 'Kenali dan atasi bias kognitif dalam investigasi',
      icon: '⚖️',
      level: 3,
      lessons: 5
    },
    {
      id: 'mod_pola',
      title: 'Pengenalan Pola',
      desc: 'Identifikasi pola tersembunyi dalam kasus',
      icon: '🔮',
      level: 4,
      lessons: 5
    },
    {
      id: 'mod_interogasi',
      title: 'Teknik Interogasi',
      desc: 'Mengungkap kebenaran melalui pertanyaan strategis',
      icon: '💬',
      level: 5,
      lessons: 5
    }
  ];

  // AI-powered module generation
  if (apiKey && apiKey.startsWith('gsk_')) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { 
              role: 'system', 
              content: 'Buatkan 5 modul pelatihan detektif dalam format JSON array. Setiap modul: id, title, desc, icon (emoji), level, lessons (number). Bahasa Indonesia.' 
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        try {
          const aiModules = JSON.parse(data.choices?.[0]?.message?.content || '[]');
          if (aiModules.length > 0) {
            return res.json({ success: true, modules: aiModules });
          }
        } catch (e) {}
      }
    } catch (e) {
      console.error('Modules error:', e);
    }
  }

  res.json({ success: true, modules });
}
