import Image from "next/image";
import Link from "next/link";
import { Newspaper, BookOpen, Map, Smartphone, ArrowRight } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import SectionHeading from "@/components/SectionHeading";
import SakuraDecor from "@/components/SakuraDecor";
import { getPosts, getMateri, getMapPoints } from "@/lib/data";

// Selalu ambil data terbaru tiap kali halaman dibuka (bukan versi lama yang
// tersimpan), supaya berita/materi baru dari panel admin langsung muncul.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [posts, materi, mapPoints] = await Promise.all([
    getPosts(),
    getMateri(),
    getMapPoints(),
  ]);
  const latestPosts = posts.slice(0, 3);

  const stats = [
    { label: "Berita Kegiatan", value: `${posts.length}+` },
    { label: "Materi Sosialisasi", value: `${materi.length}+` },
    { label: "Titik Terpetakan", value: `${mapPoints.length}+` },
    { label: "Tahun Pengabdian", value: "2026" },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-gunung.jpg"
            alt="Pemandangan gunung di sekitar Desa Jetis, Bandungan"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-dark-green)]/90 via-[var(--color-dark-green)]/75 to-[var(--color-beige)]" />
        </div>

        <SakuraDecor className="absolute -top-4 right-6 h-24 w-24 opacity-70 sm:right-16 sm:h-32 sm:w-32" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-20 pb-28 text-center sm:px-6 sm:pt-28 sm:pb-36 lg:px-8">
          <Image
            src="/images/logo.png"
            alt="Logo KKN Merawi Pangeran 2026"
            width={96}
            height={96}
            className="h-20 w-20 sm:h-24 sm:w-24"
            priority
          />
          <span className="mt-6 text-xs font-semibold tracking-[0.3em] text-[var(--color-rosy-brown)] uppercase">
            Kuliah Kerja Nyata 2026
          </span>
          <h1 className="font-display mt-4 max-w-3xl text-4xl text-[var(--color-beige)] sm:text-6xl">
            Merawi Pangeran
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--color-beige)]/85 sm:text-lg">
            Optimisasi Sektor Pendidikan, Pertanian, Peternakan, dan UMKM
            melalui Inovasi Pengelolaan Sumber Daya Lokal dalam Upaya
            Mendorong Kemandirian Ekonomi dan Pemberdayaan Masyarakat Desa
            Sidomukti dan Desa Jetis, Kecamatan Bandungan, Kabupaten Semarang.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-rosy-brown)] px-6 py-3 text-sm font-semibold text-[var(--color-dark-green)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-beige)]"
            >
              Lihat Berita Kegiatan
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/peta"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-beige)]/40 px-6 py-3 text-sm font-semibold text-[var(--color-beige)] transition-colors duration-200 hover:bg-[var(--color-beige)]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-beige)]"
            >
              Buka Peta Interaktif
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative mx-auto -mt-16 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card grid grid-cols-2 gap-4 rounded-3xl p-6 shadow-xl sm:grid-cols-4 sm:p-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl text-[var(--color-dark-green)] sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium tracking-wide text-[var(--color-muted-foreground)] uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Layanan Utama"
          title="Semua informasi KKN dalam satu portal"
          description="Empat pilar program kerja KKN Merawi Pangeran 2026 yang dapat kamu telusuri langsung di sini."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            href="/blog"
            icon={Newspaper}
            title="Blog Kegiatan"
            description="Berita dan dokumentasi terbaru seputar program kerja tim KKN di Desa Jetis."
          />
          <FeatureCard
            href="/materi"
            icon={BookOpen}
            title="Materi Sosialisasi"
            description="Kumpulan materi sosialisasi hukum, kesehatan, ekonomi, dan teknologi yang telah dilaksanakan."
          />
          <FeatureCard
            href="/peta"
            icon={Map}
            title="Peta Interaktif"
            description="Peta sebaran kerusakan irigasi, UMKM, dan fasilitas umum di wilayah Desa Jetis."
          />
          <FeatureCard
            href="/si-bening"
            icon={Smartphone}
            title="Aplikasi SI-Bening"
            description="Sistem Informasi Bening untuk membantu perencanaan desain infrastruktur desa."
          />
        </div>
      </section>

      {/* ABOUT + MASCOT */}
      <section className="bg-[var(--color-muted)]/60 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Tentang Kami"
              title="Empat klaster, satu tujuan: desa yang lebih sejahtera"
              description="Tim KKN Merawi Pangeran 2026 hadir dari empat klaster keilmuan — Saintek, Agro, Soshum, dan Medika — untuk mendampingi Desa Jetis menuju tata kelola yang lebih baik."
            />
            <Link
              href="/tentang"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-dark-green)] px-6 py-3 text-sm font-semibold text-[var(--color-beige)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Kenali tim kami
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-96 sm:w-96">
            <div className="absolute inset-0 rounded-full bg-[var(--color-dark-green)]/5" />
            <Image
              src="/images/mascot.png"
              alt="Maskot KKN Merawi Pangeran 2026"
              width={384}
              height={384}
              className="relative h-full w-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* LATEST POSTS */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Terbaru" title="Berita kegiatan terkini" />
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-midnight-teal)]"
          >
            Semua berita
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="glass-card group flex flex-col overflow-hidden rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-xs font-semibold tracking-wide text-[var(--color-midnight-teal)] uppercase">
                  {post.category}
                </span>
                <h3 className="font-display mt-2 text-lg text-[var(--color-dark-green)]">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--color-muted-foreground)]">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SI-BENING CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[var(--color-midnight-teal)] px-6 py-14 text-center sm:px-16">
          <SakuraDecor className="absolute -left-6 -top-6 h-28 w-28 opacity-20" />
          <SakuraDecor className="absolute -bottom-8 right-0 h-32 w-32 opacity-20" />
          <p className="text-xs font-semibold tracking-[0.3em] text-[var(--color-rosy-brown)] uppercase">
            SI-Bening
          </p>
          <h2 className="font-display mx-auto mt-3 max-w-xl text-3xl text-[var(--color-beige)] sm:text-4xl">
            Rencanakan infrastruktur desa lebih mudah
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[var(--color-beige)]/85">
            Sistem Informasi Bening membantu perangkat desa mendesain dan
            merencanakan infrastruktur secara digital, cepat, dan akurat.
          </p>
          <Link
            href="/si-bening"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-rosy-brown)] px-7 py-3 text-sm font-semibold text-[var(--color-dark-green)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            <Smartphone size={16} />
            Unduh SI-Bening
          </Link>
        </div>
      </section>
    </div>
  );
}
