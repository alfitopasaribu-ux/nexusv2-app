# NEXUS v3.0 - Cara Deploy ke Vercel

## Link yang Sudah Ada
Dari deploy sebelumnya: **https://nexus-1fhrxokei-alfitopasaribu-uxs-projects.vercel.app**

## Cara Deploy Ulang dengan Nama Baru (nexus-fito)

### Langkah 1: Import ke Vercel
1. Buka https://vercel.com/dashboard
2. Klik **Add New** → **Project**
3. Klik **Import Git Repository**
4. Pilih: **alfitopasaribu-ux/nexusv2-app**
5. Di **Project Name**, isi: **nexus-fito**
6. Klik **Deploy**

### Langkah 2: Set API Key (PENTING!)
1. Setelah deploy selesai, klik project **nexus-fito**
2. Klik tab **Settings**
3. Scroll ke **Environment Variables**
4. Klik **Add**
5. Isi:
   - **Name**: `GROQ_API_KEY`
   - **Value**: `isi dengan API key GROQ Anda` (contoh: gsk_xxxxxx)
6. Klik **Save**

### Langkah 3: Rebuild
1. Klik tab **Deployments**
2. Klik tombol **...** di deployment terbaru
3. Klik **Rebuild**

### Link Final Anda
**https://nexus-fito.vercel.app**

## Catatan Penting
- ✅ API key Anda AMAN - tidak di-hardcode di kode
- ✅ API key hanya ada di Environment Variables Vercel Anda
- ✅ Project sudah ada di GitHub: https://github.com/alfitopasaribu-ux/nexusv2-app

## Jika Ingin Ubah Nama Project
1. Buka https://vercel.com/dashboard
2. Klik project Anda
3. Klik **Settings**
4. Di **Project Name**, klik **Edit**
5. Ganti nama → **Save**

---

**NEXUS v3.0 - AI-Powered Criminal Investigation Simulator**
*Created by Fito*
