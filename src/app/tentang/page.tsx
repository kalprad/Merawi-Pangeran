import Image from "next/image";
import type { Metadata } from "next";
import { Stethoscope, Scale, HardHat, Landmark } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Mengenal Tim KKN Merawi Pangeran 2026 dan program kerja di Desa Jetis, Kecamatan Bandungan, Kabupaten Semarang.",
};

const divisions = [
  {
    icon: HardHat,
    title: "Infrastruktur",
    description:
      "Memetakan kondisi irigasi dan fasilitas umum, serta mengembangkan aplikasi SI-Bening untuk perencanaan pembangunan desa.",
  },
  {
    icon: Stethoscope,
    title: "Kesehatan",
    description:
      "Menyelenggarakan sosialisasi pencegahan stunting dan pola hidup sehat bagi warga.",
  },
  {
    icon: Scale,
    title: "Hukum",
    description:
      "Memberikan edukasi literasi hukum dasar dan administrasi kependudukan kepada masyarakat.",
  },
  {
    icon: Landmark,
    title: "Ekonomi",
    description:
      "Mendampingi pelaku UMKM melalui pendataan sebaran usaha dan pelatihan manajemen usaha kecil.",
  },
];

export default function TentangPage() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Tentang Kami"
              title="KKN Merawi Pangeran 2026"
              description={
                'Nama "Merawi Pangeran" merepresentasikan semangat tim untuk merawat Desa Jetis, Kecamatan Bandungan, Kabupaten Semarang, melalui pendekatan multidisiplin selama masa Kuliah Kerja Nyata 2026.'
              }
            />
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-muted-foreground)]">
              Desa Jetis terletak di kaki kawasan pegunungan Bandungan yang
              dikenal dengan potensi pertanian dan pariwisatanya. Tim kami
              hadir untuk mendampingi warga melalui empat bidang utama:
              infrastruktur, kesehatan, hukum, dan ekonomi.
            </p>
          </div>
          <div className="relative mx-auto h-64 w-64 sm:h-80 sm:w-80">
            <Image
              src="/images/mascot.png"
              alt="Maskot KKN Merawi Pangeran 2026"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-muted)]/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="Program Kerja"
            title="Empat bidang utama pendampingan"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {divisions.map((div) => (
              <div
                key={div.title}
                className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-dark-green)] text-[var(--color-beige)]">
                  <div.icon size={22} aria-hidden="true" />
                </div>
                <h3 className="font-display mt-4 text-lg text-[var(--color-dark-green)]">
                  {div.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                  {div.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Lokasi"
          title="Desa Jetis, Kecamatan Bandungan"
          description="Kabupaten Semarang, Jawa Tengah — berada di kawasan lereng Gunung Ungaran yang sejuk, dengan mayoritas warga berprofesi sebagai petani dan pelaku UMKM rumahan."
        />
      </section>
    </div>
  );
}
