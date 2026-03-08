// NEXUS v3.0 - Academy Modules API
// Vercel Serverless Function

export default function handler(req, res) {
  const modules = [
    { id: 1, title: "Dasar Investigasi", desc: "Pelajari metodologi investigasi kriminal", icon: "🔍", level: 1 },
    { id: 2, title: "Analisis Bukti", desc: "Teknik forensik dan pengumpulan bukti", icon: "🧪", level: 2 },
    { id: 3, title: "Psikologi Kriminal", desc: "Memahami perilaku dan motif pelaku", icon: "🧠", level: 3 },
    { id: 4, title: "Teknik Interogasi", desc: "Metode questioning efektif", icon: "💬", level: 4 },
    { id: 5, title: "Deduksi Lanjutan", desc: "Logika dan penalaran investigasi", icon: "🎯", level: 5 },
  ];
  
  res.json({ success: true, modules });
}

