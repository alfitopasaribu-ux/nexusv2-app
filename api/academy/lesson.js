// NEXUS v3.0 - Academy Lesson API
// Vercel Serverless Function

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { moduleId, lessonNumber = 1, playerId } = req.body;
  const apiKey = process.env.GROQ_API_KEY || process.env.GROQ_APIKEY || '';

  // Demo lesson
  const demoLesson = {
    lessonTitle: 'Dasar-dasar Observasi',
    objective: 'Memahami pentingnya detail dalam investigasi',
    theory: `Observasi adalah keterampilan fundamental bagi setiap detektif. 
Detail kecil yang terlewat oleh orang biasa sering kali menjadi kunci pemecahan kasus.

Tips Observasi:
1. Perhatikan lingkungan sekitar secara sistematis
2. Catat perubahan sekecil apapun dari kondisi normal
3. Gunakan semua indra - penglihatan, pendengaran, penciuman
4. Verifikasi pengamatan dengan bukti objektif
5. Jangan terburu-buru menarik kesimpulan`,

    keyPoints: [
      'Detail kecil sering menjadi kunci kasus',
      'Observasi harus objektif tanpa bias',
      'Dokumentasikan semua temuan',
      'Verifikasi dengan bukti forensik'
    ],

    caseExample: {
      scenario: 'Di TKP ditemukan cangkir kopi dengan sidik jari yang tidak terdaftar di database polisi.',
      question: 'Apa langkah selanjutnya yang harus dilakukan detektif?',
      options: [
        'A. Mengabaikan karena tidak ada di database',
        'B. Mencari pemilik cangkir melalui catatan pembelian',
        'C. Membuang bukti karena tidak berguna',
        'D. Menunggu sampai ada korban lain'
      ]
    }
  };

  // AI-powered lesson generation
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
              content: `Buatkan lesson konten untuk modul pelatihan detektif dalam format JSON:
{
  "lessonTitle": "string",
  "objective": "string", 
  "theory": "string (panjang)",
  "keyPoints": ["array string"],
  "caseExample": {
    "scenario": "string",
    "question": "string",
    "options": ["array string"]
  }
}
Bahasa Indonesia.` 
            }
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        try {
          const lesson = JSON.parse(data.choices?.[0]?.message?.content || '{}');
          if (lesson.lessonTitle) {
            return res.json({ success: true, lesson });
          }
        } catch (e) {}
      }
    } catch (e) {
      console.error('Lesson error:', e);
    }
  }

  res.json({ success: true, lesson: demoLesson });
}
