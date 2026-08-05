import type { Metadata } from "next";
import { getDesaBoundary, getResolvedMapLayers } from "@/lib/data";
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
  const [layers, boundary] = await Promise.all([
    getResolvedMapLayers(),
    getDesaBoundary(),
  ]);

  return (
    <div className="relative overflow-hidden">
      <PageOrnaments />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Peta Interaktif"
            title="Sebaran data Desa Jetis"
            description="Pilih jenis peta lewat menu di atas peta untuk menjelajahi titik kerusakan irigasi, sebaran UMKM, dan fasilitas umum."
          />
        </Reveal>
        <Reveal delay={100} className="mt-8">
          <MapLoader layers={layers} boundary={boundary} />
        </Reveal>
      </div>
    </div>
  );
}
