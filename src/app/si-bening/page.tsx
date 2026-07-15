import Image from "next/image";
import type { Metadata } from "next";
import { Ruler, FolderInput, ShieldCheck, Download } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { getSettings } from "@/lib/data";

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

export default async function SiBeningPage() {
  const settings = await getSettings();
  const hasDownloadLink = Boolean(settings.siBeningUrl);

  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
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
          </div>

          <div className="glass-card relative overflow-hidden rounded-3xl">
            <Image
              src="/images/si-bening-banner.png"
              alt="SI-Bening — Sistem Informasi Infrastruktur"
              width={840}
              height={472}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-muted)]/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="Kenapa SI-Bening?"
            title="Dibangun untuk mendukung desa"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
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
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
