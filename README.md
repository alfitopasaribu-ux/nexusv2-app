# NEXUS v3.0 — Platform Investigasi Kejahatan Kognitif AI
### AI Cognitive Crime Investigation Platform
**Built by Ell — Visionary Engineer 2046**

```
╔═══════════════════════════════════════════════════════════╗
║  NEXUS v3.0 — Neural Exploration & Deduction System      ║
║  AI-Powered Cognitive Crime Investigation Platform        ║
║  "Bukan sekadar game — ini adalah pelatihan pikiran."     ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 🚀 SETUP — 5 MENIT

### Langkah 1: Dapatkan GROQ API Key (GRATIS)
1. Buka → **https://console.groq.com**
2. Sign up / Login
3. Menu **API Keys** → **Create API Key**
4. Copy key dimulai `gsk_...`

### Langkah 2: Konfigurasi `.env`
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
```

### Langkah 3: Install
```bash
npm run install:all
```

### Langkah 4: Jalankan
```bash
# Terminal 1 — Backend (port 3001)
npm start

# Terminal 2 — Frontend (port 5173)
npm run frontend
```

### Langkah 5: Buka Browser
```
http://localhost:5173
```

---

## 📁 STRUKTUR LENGKAP

```
NEXUS/
├── backend/
│   ├── ai_engine/           ← Groq + LLaMA 3.3 70B
│   ├── case_generator/      ← Load & validasi 50 kasus
│   ├── interrogation_system/← Simulasi tersangka AI
│   ├── cognitive_analysis/  ← Tracking perkembangan pemain
│   ├── academy_system/      ← 5 modul akademi detektif
│   └── omega_engine/        ← Generator kasus tak terbatas
│
├── frontend/
│   ├── dashboard/           ← Komponen Dashboard
│   ├── investigation_board/ ← Papan Bukti
│   ├── interrogation_room/  ← Ruang Interogasi
│   ├── evidence_panel/      ← Panel Bukti
│   ├── cognitive_report/    ← Laporan Kognitif
│   ├── academy_interface/   ← Interface Akademi
│   └── src/
│       ├── App.jsx          ← Aplikasi React utama
│       ├── api.js           ← API client
│       ├── main.jsx         ← Entry point
│       └── styles/nexus.css ← Design system futuristik
│
├── voice_system/            ← Speech-to-text
├── cases/
│   ├── case01.json — case10.json   ← PEMULA
│   ├── case11.json — case25.json   ← MAHIR
│   ├── case26.json — case40.json   ← AHLI
│   └── case41.json — case50.json   ← OMEGA
│
├── global_network/          ← Leaderboard & kasus harian
├── config/ai_config.js      ← Konfigurasi AI
├── server.js                ← Express server
├── .env                     ← ⚠ API KEY (jangan share)
└── README.md
```

---

## 🎮 FITUR NEXUS v3.0

| Fitur | Deskripsi |
|-------|-----------|
| 📂 **50 Kasus** | Pemula → Ahli → NEXUS OMEGA |
| 💬 **Interogasi AI** | Tersangka dinamis bertenaga LLaMA |
| 🎙️ **Suara** | Interogasi via Web Speech API |
| 🔬 **Papan Bukti** | Investigasi visual + koneksi antar elemen |
| 🧠 **Mind Reader** | Analisis kelemahan teori |
| 🎓 **Akademi Detektif** | 5 modul pelatihan kognitif |
| 📊 **Peta Kognitif** | Tracking kecerdasan analitis |
| 🌍 **Jaringan Global** | Leaderboard + kasus harian |
| ♾️ **Mode Omega** | Kasus tak terbatas post-game |

---

## 🔌 API ENDPOINTS

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/health` | Status server + AI |
| GET | `/api/cases` | 50 kasus (tanpa solusi) |
| GET | `/api/cases/:id` | Detail kasus |
| POST | `/api/cases/:id/solve` | Submit solusi |
| POST | `/api/interrogation/start` | Mulai interogasi |
| POST | `/api/interrogation/message` | Kirim pertanyaan |
| GET | `/api/cognitive/:id` | Profil kognitif |
| GET | `/api/cognitive/:id/report` | Laporan AI |
| GET | `/api/academy/modules` | Modul akademi |
| POST | `/api/academy/lesson` | Generate pelajaran |
| POST | `/api/omega/next` | Kasus OMEGA baru |
| GET | `/api/network/leaderboard` | Peringkat global |
| GET | `/api/network/daily` | Kasus harian |
| POST | `/api/mindreader` | Analisis teori |
| POST | `/api/challenger` | Cognitive challenger |

---

## 🏆 SISTEM RANK

| Rank | XP |
|------|-----|
| KADET | 0 |
| DETEKTIF JUNIOR | 600 |
| INVESTIGATOR | 1.800 |
| ANALIS KRIMINAL | 4.000 |
| DETEKTIF UTAMA | 8.000 |
| PIKIRAN SHERLOCK | 15.000 |
| **NEXUS ORACLE** | 30.000 |

---

## ⚠️ KEAMANAN

- File `.env` ada di `.gitignore` — tidak akan ter-commit
- API Key hanya diakses via `process.env.GROQ_API_KEY` di backend
- Frontend tidak pernah melihat API key
- Rate limiting: 150 request / 15 menit / IP

---

*"Kebenaran tersembunyi bukan karena tidak ada — tapi karena kita belum cukup jeli."*
**— Ell, Visionary Engineer 2046**
