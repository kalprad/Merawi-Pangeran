# Merawi Pangeran 2026 — Portal KKN Desa Jetis

Situs resmi KKN "Merawi Pangeran" 2026 di Desa Jetis, Kecamatan Bandungan,
Kabupaten Semarang. Dibangun dengan Next.js (App Router), TypeScript, dan
Tailwind CSS v4.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Konfigurasi environment

Salin `.env.example` menjadi `.env.local` lalu sesuaikan:

```
ADMIN_PASSWORD=kata-sandi-panel-admin
SESSION_SECRET=string-acak-yang-panjang-dan-rahasia
```

Kata sandi admin default saat ini: lihat `.env.local` (`merawipangeran2026`).
**Ganti sebelum situs dipakai secara publik.**

## Struktur konten

Data situs disimpan sebagai file JSON di folder `data/`:

- `data/posts.json` — berita kegiatan (Blog)
- `data/materi.json` — materi sosialisasi
- `data/map-points.json` — titik peta interaktif (irigasi, UMKM, fasilitas umum)

Konten ini bisa diedit langsung lewat file, atau melalui **Panel Admin** di
`/admin` (login dengan `ADMIN_PASSWORD`). Panel admin saat ini mendukung
kelola Berita dan Materi Sosialisasi (create/edit/delete). Data peta masih
berupa contoh dan perlu diperbarui manual di `data/map-points.json` sampai
hasil survei lapangan tersedia.

> Catatan: kalau dijalankan di komputer sendiri, data disimpan sebagai file
> biasa di folder `data/`. Kalau di-deploy ke Vercel, sistem otomatis
> berpindah menyimpan data ke **repo GitHub** (lihat bagian "Deploy ke
> Vercel" di bawah) — supaya data yang diinput lewat panel admin tidak
> hilang.

## Deploy ke Vercel (gratis)

Vercel itu gratis, tapi dia tidak "menyimpan" perubahan file secara permanen
setiap kali situs dibuka (situsnya di-generate ulang dari repo GitHub tiap
kali ada perubahan). Supaya berita/materi yang diinput lewat panel admin
tidak hilang, situs ini sudah diatur supaya **datanya disimpan langsung ke
file di repo GitHub**, bukan ke Vercel.

Langkah setup:

1. **Push project ini ke GitHub** (buat repo baru di GitHub, lalu upload/push
   folder project ini ke sana).
2. **Hubungkan repo itu ke Vercel** (Import Project di dashboard Vercel, pilih
   repo GitHub kamu).
3. **Buat "kunci akses" GitHub** supaya website boleh menyimpan perubahan ke
   repo-mu:
   - Buka GitHub → foto profil (kanan atas) → **Settings**
   - Scroll ke bawah → **Developer settings**
   - **Personal access tokens** → **Fine-grained tokens** → **Generate new token**
   - Pilih repository ini di bagian "Repository access"
   - Di bagian "Permissions", cari **Contents** → set ke **Read and write**
   - Klik **Generate token**, lalu salin tokennya (hanya muncul sekali!)
4. **Masukkan 3 env var ini di Vercel** (Project Settings → Environment
   Variables), selain `ADMIN_PASSWORD` dan `SESSION_SECRET`:
   - `GITHUB_TOKEN` — token yang tadi kamu salin
   - `GITHUB_REPO` — contoh: `namaakun/nama-repo`
   - `GITHUB_BRANCH` — biasanya `main`
5. Deploy. Setelah itu, setiap kali ada berita/materi baru diinput lewat
   `/admin`, perubahannya otomatis tersimpan sebagai commit baru di repo
   GitHub kamu, dan langsung tampil di situs (tidak perlu deploy ulang
   manual).

## Aset brand

Font (`Milk and Honey`, `Neue Montreal`) dan palet warna resmi mengikuti
`Master Design.png`. Warna:

| Token | Hex |
|---|---|
| Dark Green | `#0A3323` |
| Moss Green | `#839958` |
| Beige | `#F7F4D5` |
| Rosy Brown | `#D3968C` |
| Midnight Teal | `#105666` |

## Build produksi

```bash
npm run build
npm start
```
