import type { Metadata } from "next";
import { getMapPoints } from "@/lib/data";
import SectionHeading from "@/components/SectionHeading";
import MapLoader from "@/components/MapLoader";

export const metadata: Metadata = {
  title: "Peta Interaktif",
  description:
    "Peta interaktif sebaran kerusakan irigasi, UMKM, dan fasilitas umum di Desa Jetis, Kecamatan Bandungan.",
};

export const dynamic = "force-dynamic";

export default async function PetaPage() {
  const points = await getMapPoints();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Peta Interaktif"
        title="Sebaran data Desa Jetis"
        description="Jelajahi titik kerusakan irigasi, sebaran UMKM, dan fasilitas umum. Aktifkan/nonaktifkan kategori lewat tombol di atas peta."
      />
      <p className="mt-3 max-w-2xl rounded-2xl bg-[var(--color-muted)] px-4 py-3 text-xs text-[var(--color-muted-foreground)]">
        Catatan: titik pada peta ini masih berupa data contoh dan akan
        diperbarui bertahap seiring hasil survei lapangan tim KKN.
      </p>
      <div className="mt-8">
        <MapLoader points={points} />
      </div>
    </div>
  );
}
