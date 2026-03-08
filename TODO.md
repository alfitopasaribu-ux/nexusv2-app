# NEXUS v3.0 - Perbaikan Build Vercel

## TODO List:

- [x] 1. Analisis struktur proyek dan masalah build
- [x] 2. Update vercel.json dengan konfigurasi yang benar
- [x] 3. Update vite.config.js untuk Vercel (dengan plugin copy cases)
- [x] 4. Update frontend/src/api.js untuk bekerja dengan Vercel API
- [x] 5. Buat Vercel API Routes (serverless functions)
- [ ] 6. Deploy ke Vercel dan test

## Perubahan yang sudah dilakukan:

### 1. vercel.json
- Build command: `cd frontend && npm install && npm run build`
- Output directory: `frontend/dist`
- Rewrites untuk /api dan /cases routes

### 2. vite.config.js
- Menambahkan plugin untuk menyalin folder cases ke public/cases saat build
- Konfigurasi build yang dioptimalkan

### 3. frontend/src/api.js
- Diubah untuk menggunakan API routes `/api/*`
- Support untuk Vercel environment detection
- Semua endpoint menunjuk ke API routes

### 4. Vercel API Routes (Serverless Functions)
- `/api/health.js` - Health check
- `/api/ai/call.js` - Groq AI call
- `/api/interrogation/start.js` - Start interrogation session
- `/api/interrogation/message.js` - AI interrogation responses
- `/api/mindreader.js` - Mind reader analysis
- `/api/academy/modules.js` - Academy modules list
- `/api/academy/lesson.js` - Generate lesson with AI
- `/api/academy/evaluate.js` - Evaluate answers
- `/api/cognitive/[pid]/report.js` - Cognitive report
- `/api/network/register.js` - Register player
- `/api/network/leaderboard.js` - Leaderboard
- `/api/network/daily.js` - Daily case
- `/api/omega/next.js` - Omega case generation
- `/api/cases/[id]/solve.js` - Case solution validation

## Langkah Selanjutnya:
1. Push perubahan ke GitHub
2. Vercel akan auto-deploy
3. Pastikan GROQ_API_KEY sudah di-set di Vercel Environment Variables

