import type { Division } from "@/lib/types";

// Sumber: "Nama anggota dan proker.xlsx" (nama, klaster, dan program kerja
// tiap anggota). Setiap anggota jadi satu halaman program kerja di modal
// klaster (lihat DivisionGrid.tsx), diurutkan sesuai urutan di spreadsheet.
export const divisions: Division[] = [
  {
    title: "Saintek",
    description:
      "Memetakan kondisi irigasi dan fasilitas umum, serta mengembangkan aplikasi SI-Bening untuk perencanaan infrastruktur desa.",
    image: "/images/maskot/gaya-4.png",
    imageAlt: "Lumi bergaya klaster Saintek, memegang laptop dan tumpukan buku",
    members: [
      {
        name: "Rizki Haikal Pradana",
        programs: [
          "Sosialisasi Mitigasi Kebencanaan Melalui Demonstrasi Struktur Resilien",
          "Pembuatan Aplikasi Otomatisasi Desain Talud untuk Proteksi Lahan Pertanian dan Akses Distribusi Ekonomi Desa",
          "Pembuatan Aplikasi Perhitungan Rancangan Anggaran Biaya (RAB) Proyek Otomatis",
          "Pembuatan Aplikasi Perancangan dan Evaluasi Struktur Jembatan Beton Bentang Pendek Eksisting untuk Irigasi Menurut SE Binamarga 2021",
          "Pembuatan Aplikasi Perhitungan, Evaluasi, dan Rekomendasi Perbaikan Jaringan Irigasi Pertanian",
        ],
      },
      {
        name: "Salma Salsabila Zahra",
        programs: [
          "PANTAU TUMBUH (Alat Deteksi Tinggi Badan Cerdas Berbasis Sensor)",
          "ZEROWASTE MACHINE (Pencacah Limbah Organik dari Material Daur Ulang)",
          "GREENKITCH (Pengolahan Limbah Dapur Menjadi Eco Enzyme Bernilai Guna)",
          "THERMACOOP (Optimasi Termal Kandang Ternak Berbasis Analisis Fisika Bangunan)",
          "CERDAS LISTRIK (Edukasi Elektronika dan Keselamatan Penggunaan Listrik)",
        ],
      },
      {
        name: "Reza Aulia Fazrin",
        programs: [
          "Peremajaan Batas Patok Dusun di Desa Jetis",
          "Pemetaan Partisipatif Klaim Sengketa Tanah Berbasis Sistem Informasi Geografis dan Integrasi Drone 360° di Desa Jetis",
          "Peta Administrasi & Fasilitas Desa",
          "Peta Lahan Permaculture pada Dusun di Jetis",
          "Pemetaan dan Inventarisasi Spasial Jaringan Irigasi Eksisting Berbasis Sistem Informasi Geografis di Desa Jetis",
        ],
      },
      {
        name: "Hafilah Mahardika Pratiwi",
        programs: [
          "Peta Kemiringan Lahan untuk Mendukung Optimalisasi Pertanian",
          "Peta Persebaran dan Analisis Aksesibilitas Sekolah",
          "Peta Persebaran dan Potensi Komoditas Alpukat",
          "Peta Tematik Persebaran UMKM Berbasis SIG",
          "Edukasi Pembacaan Peta untuk Meningkatkan Literasi Spasial Siswa Sekolah Dasar",
        ],
      },
    ],
  },
  {
    title: "Agro",
    description:
      "Mendampingi petani dan pelaku UMKM berbasis hasil bumi melalui pendataan sebaran usaha dan pelatihan manajemen usaha kecil.",
    image: "/images/maskot/gaya-3.png",
    imageAlt: "Lumi bergaya klaster Agro, memegang tabung erlenmeyer dan seekor kelinci",
    members: [
      {
        name: "M Nafil Haikal",
        programs: [
          "Rimbawan Kecil",
          "Sosialisasi Minat dan Bakat Gen Z",
          "Pemeliharaan Tanaman (Mendangir dan Penyiraman)",
          "Pembuatan Rorak di Lahan Pertanian untuk Mencegah Luapan Air",
          "Pengembangan Budidaya Bunga Berkualitas untuk Meningkatkan Kesejahteraan Petani",
        ],
      },
      {
        name: "Anggi Grishella Putri Aurelia",
        programs: [
          "Sosialisasi Zero Waste Farming Class (ZEFARM Class)",
          "Festival Menyongsong Kemerdekaan Pemuda Desa",
          "Pembuatan Pengharum Ruangan Difuser Berbasis Bahan Alami (ECOFRAGRANT)",
          "Sosialisasi Pemilihan dan Perancangan Kemasan Tepat Guna (SMARTPACK)",
          "Sahabat Buah",
        ],
      },
      {
        name: "Rakka Adhi Pratama",
        programs: [
          "Sosialisasi Program Pertanian Permaculture",
          "AgroTech Kids: Pengenalan Teknologi Pangan dan Pertanian",
          "Optimalisasi Budidaya Alpukat untuk Meningkatkan Produktivitas dan Pendapatan Masyarakat",
          "Edukasi Ketahanan Pangan Keluarga",
          "Pembuatan Video Profil Desa sebagai Media Informasi dan Promosi Potensi Desa",
        ],
      },
      {
        name: "Fauzan Rasyid Yulianto",
        programs: [
          "Mineral Mandiri: Sosialisasi dan Praktik Pembuatan Mineral Block",
          "Sosialisasi Perencanaan Pengembangan Kandang Domba untuk Mendukung Produktivitas Peternakan Rakyat di Desa Jetis",
          "Sehat Mulai dari Kandang: Edukasi Biosecurity dan Sanitasi Kandang",
          "Sarapan Sehat, Seni Hebat: Sarapan Telur & Mozaik Cangkang Telur",
          "Hewan adalah Teman: Pengenalan Konsep Animal Welfare",
        ],
      },
    ],
  },
  {
    title: "Soshum",
    description:
      "Memberikan edukasi literasi hukum dasar dan administrasi kependudukan kepada masyarakat.",
    image: "/images/maskot/gaya-5.png",
    imageAlt: "Lumi bergaya klaster Soshum, membawa buku hukum dan pajak",
    members: [
      {
        name: "Irene Paskhalita Diandra",
        programs: [
          "Edukasi Literasi Keuangan Digital dan Pencegahan Pinjaman Online Ilegal bagi Warga Desa sebagai Upaya Penguatan Kemandirian Ekonomi Masyarakat (PKK)",
          "Penguatan Kesadaran Anti-Bullying dan Pencegahan Kekerasan pada Siswa Sekolah Dasar",
          "Optimalisasi Media Sosial sebagai Sarana Promosi Digital untuk Meningkatkan Daya Saing UMKM Desa (Perangkat Desa)",
          "Workshop “Kenali Uang dan Usaha Sederhana” bagi Anak Sekolah Dasar",
          "Edukasi Perlindungan Diri dan Pencegahan Kekerasan Seksual pada Anak Usia Sekolah Dasar (Interdisipliner)",
        ],
      },
      {
        name: "Anika Minerva Pramono",
        programs: [
          "PAJAK BIJAK (Sosialisasi Pentingnya Membayar Pajak)",
          "KREASI DIGITAL (Konten Kreatif Solusi Promosi Digital)",
          "SI-HKI (Sosialisasi & Pendampingan Merek UMKM)",
          "LENTERA MUDA (Literasi Etika & Aturan Hukum Remaja Cerdas)",
          "KAPE-DESA (Kapasitas & Evaluasi Perangkat Desa)",
        ],
      },
      {
        name: "Sheila Pratisya Salsabila",
        programs: [
          "Sosialisasi “Pangan Lokal Sehat & Bergizi” untuk Anak Sekolah",
          "SCAN & CARE: Penerapan Barcode Edukasi untuk Panduan Perawatan Bunga bagi Pengusaha Bunga",
          "Pelatihan “Digital Hospitality” (Review Management) untuk UMKM",
          "Sosialisasi Sadar Wisata dan Sapta Pesona untuk Karang Taruna",
          "Ekspresi Jiwa Cilik (Psikoedukasi Regulasi Emosi melalui Art Therapy)",
        ],
      },
    ],
  },
  {
    title: "Medika",
    description:
      "Menyelenggarakan sosialisasi pencegahan stunting dan pola hidup sehat bagi warga.",
    image: "/images/maskot/gaya-6.png",
    imageAlt: "Lumi bergaya klaster Medika, mengenakan jas dokter dan membawa kotak P3K",
    members: [
      {
        name: "Isna Maratul Azizah",
        programs: [
          "Keluarga Sadar DAGUSIBU (Dapatkan, Gunakan, Simpan, dan Buang Obat)",
          "Edukasi Cerdas Memilih Makanan Kemasan bagi Anak",
          "Pendidikan Kesehatan Anak Dasar",
          "SWARA (Swamedikasi Aman dan Rasional)",
          "Kenali Obatmu",
        ],
      },
      {
        name: "Felicia Averine",
        programs: [
          "Ibu Siap, Anak Sehat (ISAS)",
          "GLOW UP: Gerakan Literasi Online Waspada untuk Produk Skincare",
          "CERIA: Cegah Cedera Rumah pada Anak",
          "CEMARA: Cegah Campak, Lengkapi MR Anak",
          "SAPA SEHAT: Skrining, Arahan Pertolongan Awal, dan Senam Sehat Dewasa",
        ],
      },
      {
        name: "Farras Ulinnuha",
        programs: [
          "PIRING KANCIL (Pilar Gizi Seimbang & Cuci Tangan Pakai Sabun Anak Kecil)",
          "Aku Dokter Kecil: Pelatihan Keterampilan Dasar Pertolongan Pertama pada Kecelakaan (P3K)",
          "PETA MATA (Pemeriksaan Ketajaman dan Edukasi Kesehatan Mata Anak)",
          "Tumbuh Sehat, Remaja Hebat: Edukasi Menstruasi dan Anemia untuk Perempuan Karang Taruna",
          "Pelatihan Basic Life Support (BLS) Mandiri Desa",
        ],
      },
      {
        name: "Yassinta Nurlaily Ramadhani",
        programs: [
          "TOOTHVENTURE: Petualangan Gigi Sehat",
          "NutriPlate: Gizi Seimbang Cegah Stunting",
          "SIAGA GIGI: Siap Jaga Gigi Sejak Dini",
          "Pojok Obat Keluarga",
          "KREATIF: Kreasi Edukatif Anak Aktif dan Inovatif",
        ],
      },
    ],
  },
];
