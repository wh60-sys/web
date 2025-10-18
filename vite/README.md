# PANDUAN DEPLOY PROYEK VITE KE GITHUB PAGES (DARI AWAL)

=======================================================
PROSES 1: PEMBUATAN DAN KONFIGURASI PROYEK DI CODE SPACE
=======================================================

## LANGKAH 1: BUAT PROYEK VITE BARU
1. Di Terminal Code Space, jalankan:
   npm create vite@latest
2. Ikuti prompt, catat nama proyek/repositori Anda (misalnya: 'my-app-gh').
3. Masuk ke direktori proyek:
   cd <nama-proyek-kamu>
4. Instal dependensi:
   npm install

## LANGKAH 2: KONFIGURASI PROPERTI 'BASE' VITE
Properti 'base' harus diisi dengan NAMA REPOSITORI Anda.
1. Buka file 'vite.config.js' (atau .ts).
2. Tambahkan atau ubah properti 'base' di 'defineConfig()':

   // Contoh vite.config.js
   import { defineConfig } from 'vite'
   // ... plugin lainnya

   export default defineConfig({
     base: '/<NAMA-REPO-KAMU>/', // GANTI dengan nama repositori Anda
     // ... plugin lainnya
   })

## LANGKAH 3: INSTALASI PACKAGE 'gh-pages'
Kita akan menggunakan package ini untuk otomatisasi deployment.
1. Di Terminal Code Space, instal sebagai dev dependency:
   npm install gh-pages --save-dev

## LANGKAH 4: KONFIGURASI SCRIPT DEPLOY
1. Buka file 'package.json'.
2. Tambahkan skrip 'predeploy' dan 'deploy' di bagian "scripts":

   "scripts": {
     "dev": "vite",
     "build": "vite build",
     "preview": "vite preview",
     "predeploy": "npm run build", 
     "deploy": "gh-pages -d dist" // Perintah utama
   },

=======================================================
PROSES 2: COMMIT, BUILD, DAN DEPLOY
=======================================================

## LANGKAH 5: COMMIT DAN PUSH PERUBAHAN
Pastikan semua konfigurasi (vite.config.js dan package.json) sudah disimpan ke repositori.
1. Jalankan perintah Git di Terminal Code Space:
   git add .
   git commit -m "feat: setup vite config and gh-pages"
   git push

## LANGKAH 6: JALANKAN PROSES DEPLOY
Perintah ini akan membuat folder 'dist' dan mengirimkannya ke branch 'gh-pages'.
1. Di Terminal Code Space, jalankan:
   npm run deploy

   (Proses akan otomatis: build -> buat branch 'gh-pages' -> push ke GitHub)

=======================================================
PROSES 3: AKTIVASI GITHUB PAGES (KELUAR DARI CODE SPACE)
=======================================================

## LANGKAH 7: AKTIVASI DI PENGATURAN REPOSITORI
1. Buka repositori Anda di web browser (GitHub.com).
2. Pergi ke tab **Settings (Pengaturan)**.
3. Klik **Pages** di menu samping.
4. Di bagian **Branch**:
   - Pilih branch **'gh-pages'**.
   - Pilih folder **'/(root)'**.
5. Klik **Save (Simpan)**.

## LANGKAH 8: VERIFIKASI LINK
Tunggu 1-5 menit hingga GitHub selesai memproses deployment.
1. Akses link yang muncul di bagian Pages, formatnya:
   https://<USERNAME>.github.io/<NAMA-REPO-KAMU>/
2. Proyek Vite Anda seharusnya sudah dapat diakses.

# SELESAI