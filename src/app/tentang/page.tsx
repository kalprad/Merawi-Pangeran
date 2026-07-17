import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import MascotIntro from "@/components/MascotIntro";
import TeamGrid from "@/components/TeamGrid";
import DivisionGrid from "@/components/DivisionGrid";
import PageOrnaments from "@/components/PageOrnaments";
import { getTeam } from "@/lib/data";
import { divisions } from "@/lib/divisions";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Mengenal Tim KKN Merawi Pangeran 2026 dan program kerja di Desa Jetis, Kecamatan Bandungan, Kabupaten Semarang.",
};

export const dynamic = "force-dynamic";

export default async function TentangPage() {
  const team = await getTeam();

  const photoByName = new Map(team.map((member) => [member.name, member.photo]));
  const divisionsWithPhotos = divisions.map((div) => ({
    ...div,
    members: div.members.map((member) => ({
      ...member,
      photo: photoByName.get(member.name),
    })),
  }));

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
            <MascotIntro className="mx-auto" />
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
          <DivisionGrid divisions={divisionsWithPhotos} />
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
