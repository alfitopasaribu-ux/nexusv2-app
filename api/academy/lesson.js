// NEXUS v3.0 - Academy Lesson API
// Vercel Serverless Function

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { moduleId, lessonNumber = 1, playerId } = req.body;
  const apiKey = process.env.GROQ_API_KEY;
  
  const lessonContent = {
    1: {
      title: "Dasar-Dasar Investigasi",
      objective: "Memahami metodologi investigasi kriminal",
      theory: `Investigasi adalah proses sistematis untuk mengungkap fakta suatu kasus.
      
Tahapan Investigasi:
1. Pengumpulan Informasi - Kumpulkan semua bukti dan saksi
2. Analisis - Periksa setiap bukti untuk mencari hubungan
3. Hipotesis - Buat teori tentang apa yang terjadi
4. Verifikasi - Uji teori dengan bukti tambahan
5. Kesimpulan - Buat keputusan berdasarkan bukti

Prinsip Penting:
- Jangan pernah mengasumsikan sesuatu tanpa bukti
- Setiap bukti harus diverifikasi
- Perhatikan detail sekecil apa pun
- Catat semuanya untuk dokumentasi`,
      keyPoints: [
        "Kumpulkan bukti secara sistematis",
        "Verifikasi setiap kesaksian",
        "Buat hipotesis berdasarkan fakta",
        "Jangan terburu-buru menyimpulkan"
      ]
    },
    2: {
      title: "Analisis Bukti Forensik",
      objective: "Teknik menganalisis dan menginterpretasi bukti",
      theory: `Bukti forensik adalah inti dari setiap investigasi.
      
Jenis Bukti:
1. Bukti Fisik - Jejak, fingerprints, DNA
2. Bukti Digital - Email, log, metadata
3. Bukti Dokumenter - Surat, catatan
4. Bukti Testimoni - Kesaksian saksi

Teknik Analisis:
- Periksa konteks penemuan bukti
- Cari hubungan antar bukti
- Identifikasi bukti palsu/manipulasi
- Prioritaskan bukti kunci (key evidence)`,
      keyPoints: [
        "Semua bukti harus dianalisis",
        "Bukti palsu sering ada di crime scene",
        "Hubungan antar bukti penting",
        "Dokumentasikan setiap temuan"
      ]
    },
    3: {
      title: "Psikologi Kriminal",
      objective: "Memahami perilaku dan motif pelaku kejahatan",
      theory: `Memahami psikologi pelaku adalah keahlian penting detektif.
      
Tipe Pelaku:
1. Premeditated - Merencanakan dengan matang
2. Crime of Passion - Tindakan emosional
3. Serial Offender - Pola perilaku berulang
4. Organized vs Disorganized

Motif Umum:
- Keuntungan finansial
- Balas dendam
- Kebutuhan psikologis
- Tekanan sosial

Indikator Perilaku:
- Bahasa tubuh yang mencurigakan
- Kontradiksi dalam pernyataan
- Detail yang terlalu sempurna`,
      keyPoints: [
        "Motif tidak selalu jelas",
        "Perhatikan perubahan perilaku",
        "Konsistensi cerita penting",
        "Periksa alibi dengan teliti"
      ]
    }
  };

  const lessonId = moduleId || 1;
  const content = lessonContent[lessonId] || lessonContent[1];

  // Jika ada API key, generate lesson dengan AI
  if (apiKey && apiKey !== 'PASTE_YOUR_GROQ_API_KEY_HERE') {
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
            { role: 'system', content: 'Buat pelajaran investigasi kriminal dalam Bahasa Indonesia. Sertakan teori, objektif, dan poin penting.' },
            { role: 'user', content: `Buat pelajaran untuk modul ${content.title}` }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiContent = data.choices?.[0]?.message?.content;
        if (aiContent) {
          return res.json({ 
            success: true, 
            lesson: { ...content, theory: aiContent }
          });
        }
      }
    } catch (e) {
      console.error('AI lesson generation failed:', e);
    }
  }

  res.json({ 
    success: true, 
    lesson: {
      lessonTitle: `Pelajaran ${lessonNumber}: ${content.title}`,
      objective: content.objective,
      theory: content.theory,
      keyPoints: content.keyPoints
    }
  });
}

