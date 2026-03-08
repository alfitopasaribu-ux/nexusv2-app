# TODO: Perbaiki NEXUS_v3 untuk Vercel Deployment

## Masalah
- Vercel Hobby plan max 12 Serverless Functions
- NEXUS_v3 punya 14 API routes di folder api/
- Error: "No more than 12 Serverless Functions can be added"

## Solusi
Ubah jadi client-side AI (seperti nexus-app) - ga perlu serverless functions Kerja

###

## Rencana Step 1: Hapus folder api/ (14 file)
- [x] Hapus NEXUS_v3/api/ folder

### Step 2: Update package.json
- [x] Tambah groq-sdk dependency

### Step 3 API baru
- [x] Buat file NEXUS_v3/frontend/src/api/groq.js
- [x] Update NEXUS_v3/frontend/src/api.js

### Step 4: Environment Variable
- [x] Buat NEXUS_v3/frontend/.env

### Step 5: Test Build
- [x] npm install
- [x] npm run build

### Step 6: Deploy
- [ ] Git commit & push
- [ ] Deploy ke Vercel
- [ ] Set VITE_GROQ_API_KEY di Vercel

## Status: SIAP DEPLOY ✅

