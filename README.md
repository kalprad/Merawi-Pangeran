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
`/admin` (login dengan `ADMIN_PASSWORD`). Panel admin mendukung kelola
Berita, Materi Sosialisasi, Tim, dan Pengaturan (link download SI-Bening,
link folder Google Drive untuk Galeri). Data peta masih berupa contoh dan
perlu diperbarui manual di `data/map-points.json` sampai hasil survei
lapangan tersedia.

## Struktur folder di GitHub

Selain folder kode (`src/`, `public/`, `data/`), ada folder-folder berikut
di root repo untuk memudahkan tim (termasuk yang tidak coding) mengelola
file:

| Folder | Isinya | Cara update |
|---|---|---|
| `General/` | Logo, font, foto lokasi, file desain brand | Diedit manual lewat GitHub jika perlu ganti branding |
| `Blog/` | Foto-foto berita | **Otomatis** terisi saat upload foto lewat form Tulis Berita di `/admin` |
| `Tentang Kami/` | Foto anggota tim | **Otomatis** terisi saat upload foto lewat `/admin/tim` |
| `Materi Sosialisasi/` | (sengaja kosong) | File materi disimpan di Google Drive, tinggal tempel link-nya di `/admin/materi` |
| `SI-Bening/` | (sengaja kosong) | File aplikasi disimpan di Google Drive, tinggal tempel link-nya di `/admin/pengaturan` |

Folder `Blog/` dan `Tentang Kami/` hanya benar-benar terisi kalau
`GITHUB_TOKEN`/`GITHUB_REPO` sudah diatur (lihat "Deploy ke Vercel") —
di komputer sendiri, foto yang diunggah disimpan sementara di
`public/images/uploads/` (tidak ikut ke GitHub).

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

## Galeri Foto (Google Drive)

Halaman `/galeri` menampilkan foto-foto kegiatan KKN langsung dari sebuah
folder Google Drive — tidak perlu unggah ulang foto ke situs. Langkah
setup:

1. **Buat folder di Google Drive**, isi dengan foto-foto kegiatan, lalu
   klik kanan folder → **Share** → ubah ke **Anyone with the link**
   (Siapa saja yang memiliki link) dengan akses **Viewer**.
2. **Buat API key Google Drive**:
   - Buka [Google Cloud Console](https://console.cloud.google.com/) →
     buat project baru (atau pakai yang sudah ada)
   - Buka **APIs & Services** → **Library** → cari **Google Drive API** →
     klik **Enable**
   - Buka **APIs & Services** → **Credentials** → **Create Credentials** →
     **API key** → salin key yang muncul
   - (Opsional tapi disarankan) Batasi key tersebut supaya hanya bisa
     dipakai untuk **Google Drive API** di bagian "API restrictions"
3. **Masukkan env var ini di Vercel** (Project Settings → Environment
   Variables): `GOOGLE_DRIVE_API_KEY` — API key yang tadi dibuat.
4. **Tempel link folder Google Drive** lewat Panel Admin →
   `/admin/pengaturan` → "Link Folder Google Drive untuk Galeri".
5. Selesai — halaman `/galeri` otomatis menampilkan semua foto di folder
   itu, dan akan ikut ter-update setiap kali ada foto baru ditambahkan ke
   folder (tanpa perlu deploy ulang).

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
