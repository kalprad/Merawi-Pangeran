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
