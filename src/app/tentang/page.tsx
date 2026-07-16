import type { Metadata } from "next";
import { Stethoscope, Scale, Cpu, Sprout } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Mascot from "@/components/Mascot";
import TeamGrid from "@/components/TeamGrid";
import PageOrnaments from "@/components/PageOrnaments";
import { getTeam } from "@/lib/data";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Mengenal Tim KKN Merawi Pangeran 2026 dan program kerja di Desa Jetis, Kecamatan Bandungan, Kabupaten Semarang.",
};

export const dynamic = "force-dynamic";

const divisions = [
  {
    icon: Cpu,
    title: "Saintek",
    description:
      "Memetakan kondisi irigasi dan fasilitas umum, serta mengembangkan aplikasi SI-Bening untuk perencanaan infrastruktur desa.",
  },
  {
    icon: Sprout,
    title: "Agro",
    description:
      "Mendampingi petani dan pelaku UMKM berbasis hasil bumi melalui pendataan sebaran usaha dan pelatihan manajemen usaha kecil.",
  },
  {
    icon: Scale,
    title: "Soshum",
    description:
      "Memberikan edukasi literasi hukum dasar dan administrasi kependudukan kepada masyarakat.",
  },
  {
    icon: Stethoscope,
    title: "Medika",
    description:
      "Menyelenggarakan sosialisasi pencegahan stunting dan pola hidup sehat bagi warga.",
  },
];

export default async function TentangPage() {
  const team = await getTeam();

  return (
    <div>
      <section className="relative overflow-hidden">
        <PageOrnaments />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <Reveal>
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
              hadir dari empat klaster keilmuan yang berbeda — Saintek, Agro,
              Soshum, dan Medika — untuk mendampingi warga secara
              multidisiplin.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <Mascot className="mx-auto h-64 w-64 sm:h-80 sm:w-80" />
          </Reveal>
        </div>
      </section>


      <section className="batik-motif bg-[var(--color-muted)]/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Klaster Keilmuan"
              title="Empat klaster mahasiswa KKN"
            />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {divisions.map((div, i) => (
              <Reveal key={div.title} delay={i * 90} className="glass-card rounded-3xl p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-dark-green)] text-[var(--color-beige)]">
                  <div.icon size={22} aria-hidden="true" />
                </div>
                <h3 className="font-display mt-4 text-lg text-[var(--color-dark-green)]">
                  {div.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                  {div.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading align="center" eyebrow="Tim Kami" title="Anggota KKN Merawi Pangeran 2026 Sub Unit Jetis" />
          </Reveal>
          <TeamGrid team={team} />
        </section>
      )}

      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Lokasi"
            title="Desa Jetis, Kecamatan Bandungan"
            description="Kabupaten Semarang, Jawa Tengah — berada di kawasan lereng Gunung Ungaran yang sejuk, dengan mayoritas warga berprofesi sebagai petani dan pelaku UMKM rumahan."
          />
        </Reveal>
      </section>
    </div>
  );
}
