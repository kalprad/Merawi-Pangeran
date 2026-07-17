import Image from "next/image";
import type { Metadata } from "next";
import {
  Ruler,
  FolderInput,
  ShieldCheck,
  Download,
  Droplets,
  Construction,
  Mountain,
  Calculator,
  Eye,
  Zap,
  MapPin,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import PageOrnaments from "@/components/PageOrnaments";
import TutorialCourse from "@/components/TutorialCourse";
import { getSettings, getTutorialVideos } from "@/lib/data";
import type { TutorialCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "SI-Bening",
  description:
    "SI-Bening (Sistem Informasi Bening) — aplikasi untuk membantu desain dan perencanaan infrastruktur desa.",
};

export const dynamic = "force-dynamic";

const highlights = [
  {
    icon: Ruler,
    title: "Desain Infrastruktur Digital",
    description:
      "Membantu perangkat desa merancang dan merencanakan bangunan infrastruktur seperti saluran irigasi, jalan, dan fasilitas umum secara digital.",
  },
  {
    icon: FolderInput,
    title: "Data Tersimpan Rapi",
    description:
      "Setiap rancangan dan data pendukung tersimpan terstruktur sehingga mudah ditelusuri dan diperbarui kembali di kemudian hari.",
  },
  {
    icon: ShieldCheck,
    title: "Mendukung Pengambilan Keputusan",
    description:
      "Dirancang agar perangkat desa memiliki dasar data yang lebih akurat saat mengusulkan atau memprioritaskan perbaikan infrastruktur.",
  },
];

const philosophyPoints = [
  {
    icon: Eye,
    title: "Bening = Transparan",
    description:
      "Setiap data dan proses perencanaan infrastruktur dapat dilihat dan ditelusuri dengan jelas oleh perangkat desa.",
  },
  {
    icon: Zap,
    title: "Bening = Mengalir Cepat",
    description:
      "Seperti air yang tak terhambat, mencerminkan proses kerja SI-Bening yang gesit dan efisien di setiap tahap desain dan evaluasi.",
  },
  {
    icon: MapPin,
    title: "Daerah Irigasi Sibening",
    description:
      "Nama SI-Bening terinspirasi dari Daerah Irigasi Sibening, simbol semangat untuk terus mengalirkan manfaat bagi Desa Jetis.",
  },
];

const features: {
  category: TutorialCategory;
  icon: typeof Construction;
  title: string;
  description: string;
}[] = [
  {
    category: "jembatan",
    icon: Construction,
    title: "Evaluasi & Desain Jembatan",
    description:
      "Mengevaluasi kondisi jembatan yang ada dan membantu merancang desain jembatan baru sesuai kebutuhan desa, lengkap dengan pertimbangan teknis dasar.",
  },
  {
    category: "irigasi",
    icon: Droplets,
    title: "Saluran Irigasi",
    description:
      "Membantu perencanaan dan desain saluran irigasi agar aliran air ke lahan pertanian warga lebih terarah, efisien, dan mudah dipantau.",
  },
  {
    category: "talud",
    icon: Mountain,
    title: "Talud",
    description:
      "Mendukung evaluasi dan desain talud/penahan tanah untuk mencegah longsor dan menjaga kestabilan lereng di area rawan.",
  },
  {
    category: "rab",
    icon: Calculator,
    title: "Perhitungan RAB",
    description:
      "Menghitung Rencana Anggaran Biaya (RAB) pembangunan infrastruktur secara digital, sehingga perencanaan biaya lebih rapi dan transparan.",
  },
];

const TUTORIAL_CATEGORIES = new Set<TutorialCategory>(["jembatan", "irigasi", "talud", "rab"]);

export default async function SiBeningPage({
  searchParams,
}: {
  searchParams: Promise<{ modul?: string; video?: string }>;
}) {
  const settings = await getSettings();
  const tutorialVideos = await getTutorialVideos();
  const hasDownloadLink = Boolean(settings.siBeningUrl);
  const { modul, video } = await searchParams;
  const initialModule = TUTORIAL_CATEGORIES.has(modul as TutorialCategory)
    ? (modul as TutorialCategory)
    : "jembatan";

  return (
    <div>
      <section className="relative overflow-hidden">
        <PageOrnaments />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Aplikasi Resmi"
              title="SI-Bening — Sistem Informasi Bening"
              description="Aplikasi yang dikembangkan Tim KKN Merawi Pangeran 2026 untuk membantu Desa Jetis merencanakan dan mendesain infrastruktur secara digital."
            />

            {hasDownloadLink ? (
              <a
                href={settings.siBeningUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-rosy-brown)] px-7 py-3 text-sm font-semibold text-[var(--color-dark-green)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <Download size={16} />
                Unduh SI-Bening
              </a>
            ) : (
              <button
                type="button"
                disabled
                title="Tautan unduhan akan segera tersedia"
                className="mt-7 inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full bg-[var(--color-muted)] px-7 py-3 text-sm font-semibold text-[var(--color-muted-foreground)]"
              >
                <Download size={16} />
                Segera Hadir
              </button>
            )}
            <p className="mt-3 text-xs text-[var(--color-muted-foreground)]">
              {hasDownloadLink
                ? "Tautan unduhan membuka halaman eksternal (Google Drive/lainnya)."
                : "Tautan unduhan resmi akan diperbarui di halaman ini begitu aplikasi rilis."}
            </p>
          </Reveal>

          <Reveal delay={120} className="glass-card relative overflow-hidden rounded-3xl">
            <Image
              src="/images/si-bening-banner.png"
              alt="SI-Bening — Sistem Informasi Infrastruktur"
              width={840}
              height={472}
              className="h-full w-full object-cover"
              priority
            />
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Filosofi"
              title="Kenapa disebut SI-Bening?"
            />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {philosophyPoints.map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 100}
                className="glass-card rounded-3xl p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-dark-green)] text-[var(--color-beige)]">
                  <item.icon size={22} aria-hidden="true" />
                </div>
                <h3 className="font-display mt-4 text-lg text-[var(--color-dark-green)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="batik-motif bg-[var(--color-muted)]/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Fitur SI-Bening"
              title="Empat fitur utama untuk desa"
            />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((item, i) => {
              const guideUrl = settings.featureGuideUrls?.[item.category];
              return (
                <Reveal
                  key={item.title}
                  delay={i * 100}
                  className="glass-card flex h-full flex-col rounded-3xl p-6 text-center"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-dark-green)] text-[var(--color-beige)]">
                    <item.icon size={22} aria-hidden="true" />
                  </div>
                  <h3 className="font-display mt-4 text-lg text-[var(--color-dark-green)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                    {item.description}
                  </p>
                  {guideUrl ? (
                    <a
                      href={guideUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-dark-green)]/10 px-4 py-2 text-xs font-semibold text-[var(--color-dark-green)] transition-colors duration-200 hover:bg-[var(--color-dark-green)]/20"
                    >
                      <Download size={14} />
                      Unduh Cara Penggunaan
                    </a>
                  ) : (
                    <span className="mt-4 inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full bg-[var(--color-muted)] px-4 py-2 text-xs font-semibold text-[var(--color-muted-foreground)]">
                      <Download size={14} />
                      Panduan Segera Hadir
                    </span>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="tutorial" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Belajar SI-Bening"
              title="Video tutorial penggunaan aplikasi"
              description="Pelajari cara menggunakan setiap fitur SI-Bening lewat video tutorial, disusun per modul seperti kelas daring."
            />
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <TutorialCourse
              videos={tutorialVideos}
              initialModule={initialModule}
              initialVideoId={video ?? null}
            />
          </Reveal>
        </div>
      </section>

      <section className="batik-motif bg-[var(--color-muted)]/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Kenapa SI-Bening?"
              title="Dibangun untuk mendukung desa"
            />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {highlights.map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 100}
                className="glass-card rounded-3xl p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-dark-green)] text-[var(--color-beige)]">
                  <item.icon size={22} aria-hidden="true" />
                </div>
                <h3 className="font-display mt-4 text-lg text-[var(--color-dark-green)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
