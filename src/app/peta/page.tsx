import type { Metadata } from "next";
import { getMapPoints } from "@/lib/data";
import SectionHeading from "@/components/SectionHeading";
import MapLoader from "@/components/MapLoader";
import Reveal from "@/components/Reveal";
import PageOrnaments from "@/components/PageOrnaments";

export const metadata: Metadata = {
  title: "Peta Interaktif",
  description:
    "Peta interaktif sebaran kerusakan irigasi, UMKM, dan fasilitas umum di Desa Jetis, Kecamatan Bandungan.",
};

export const dynamic = "force-dynamic";

export default async function PetaPage() {
  const points = await getMapPoints();

  return (
    <div className="relative overflow-hidden">
      <PageOrnaments />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Peta Interaktif"
            title="Sebaran data Desa Jetis"
            description="Jelajahi titik kerusakan irigasi, sebaran UMKM, dan fasilitas umum. Aktifkan/nonaktifkan kategori lewat tombol di atas peta."
          />
          <p className="glass-card mt-3 max-w-2xl rounded-2xl px-4 py-3 text-xs text-[var(--color-muted-foreground)]">
            Catatan: titik pada peta ini masih berupa data contoh dan akan
            diperbarui bertahap seiring hasil survei lapangan tim KKN.
          </p>
        </Reveal>
        <Reveal delay={100} className="mt-8">
          <MapLoader points={points} />
        </Reveal>
      </div>
    </div>
  );
}
