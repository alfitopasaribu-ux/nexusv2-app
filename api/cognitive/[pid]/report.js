// NEXUS v3.0 - Cognitive Report API
// Vercel Serverless Function

export default async function handler(req, res) {
  const { pid } = req.query;
  const apiKey = process.env.GROQ_API_KEY || process.env.GROQ_APIKEY || '';
  
  // Default profile data
  const defaultReport = {
    narrative: `Profil kognitif Detektif menunjukkan perkembangan yang signifikan dalam kemampuan investigasi.
    
Kemampuan Observasi: 65%
- Mampu mengidentifikasi detail penting dalam crime scene
- Perlu lebih fokus pada bukti-bukti subtle

Deduksi Logis: 58%
- Menggunakan penalaran yang baik
- Perlu latihan lebih dalam mengidentifikasi logical fallacies

Ketahanan terhadap Bias: 72%
- Cukup objektif dalam menganalisis bukti
- Perlu警惕 confirmation bias

Pengenalan Pola: 61%
- Mulai mampu mengidentifikasi pola perilaku
- Perlu lebih banyak eksposur ke berbagai kasus`
  };
  
  if (!apiKey || apiKey === 'PASTE_YOUR_GROQ_API_KEY_HERE') {
    return res.json({ success: true, report: defaultReport });
  }
  
  // AI-powered report generation
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
          { role: 'system', content: 'Buat laporan profil kognitif detektif dalam Bahasa Indonesia. Sertakan analisis kemampuan observasi, deduksi logis, ketahanan bias, dan pengenalan pola.' },
          { role: 'user', content: `Buat laporan kognitif untuk player ID: ${pid}` }
        ],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const narrative = data.choices?.[0]?.message?.content;
      
      if (narrative) {
        return res.json({ 
          success: true, 
          report: { narrative }
        });
      }
    }
  } catch (e) {
    console.error('AI report failed:', e);
  }

  res.json({ success: true, report: defaultReport });
}

