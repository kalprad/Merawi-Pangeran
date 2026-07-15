import Image from "next/image";
import type { Metadata } from "next";
import { Stethoscope, Scale, Cpu, Sprout, User } from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";
import SectionHeading from "@/components/SectionHeading";
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
              hadir dari empat klaster keilmuan yang berbeda — Saintek, Agro,
              Soshum, dan Medika — untuk mendampingi warga secara
              multidisiplin.
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
            eyebrow="Klaster Keilmuan"
            title="Empat klaster mahasiswa KKN"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {divisions.map((div) => (
              <div key={div.title} className="glass-card rounded-3xl p-6">
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

      {team.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading align="center" eyebrow="Tim Kami" title="Anggota KKN Merawi Pangeran 2026" />
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {team.map((member) => (
              <div
                key={member.id}
                className="glass-card flex flex-col overflow-hidden rounded-3xl"
              >
                <div className="relative aspect-[4/5] w-full bg-[var(--color-muted)]">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover"
                      unoptimized={member.photo.startsWith("http")}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[var(--color-muted-foreground)]">
                      <User size={32} />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4 text-center">
                  <p className="font-medium text-[var(--color-dark-green)]">{member.name}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">{member.role}</p>
                  {member.prodi && (
                    <p className="text-[11px] text-[var(--color-muted-foreground)]/80">
                      {member.prodi}
                    </p>
                  )}
                  {member.instagram && (
                    <a
                      href={
                        member.instagram.startsWith("http")
                          ? member.instagram
                          : `https://instagram.com/${member.instagram.replace(/^@/, "")}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Instagram ${member.name}`}
                      className="mt-2 inline-flex items-center justify-center gap-1 self-center text-xs font-medium text-[var(--color-midnight-teal)] hover:text-[var(--color-dark-green)]"
                    >
                      <InstagramIcon size={14} />
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
