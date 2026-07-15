import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { getDriveGallery } from "@/lib/google-drive";
import SectionHeading from "@/components/SectionHeading";
import GalleryCarousel from "@/components/GalleryCarousel";

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "Galeri foto dokumentasi kegiatan KKN Merawi Pangeran 2026 di Desa Jetis, Kecamatan Bandungan.",
};

export const dynamic = "force-dynamic";

export default async function GaleriPage() {
  const settings = await getSettings();
  const gallery = await getDriveGallery(settings.galleryFolderUrl);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Galeri"
        title="Dokumentasi Foto Kegiatan"
        description="Kumpulan foto selama masa Kuliah Kerja Nyata di Desa Jetis, diambil langsung dari folder Google Drive tim KKN."
      />

      <div className="mt-10">
        {gallery.status === "empty" && (
          <p className="rounded-2xl bg-[var(--color-muted)] px-4 py-3 text-sm text-[var(--color-muted-foreground)]">
            Galeri belum diatur. Admin bisa menambahkan link folder Google
            Drive lewat Panel Admin &rarr; Pengaturan.
          </p>
        )}

        {gallery.status === "error" && (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {gallery.message}
          </p>
        )}

        {gallery.status === "ok" && gallery.photos.length === 0 && (
          <p className="rounded-2xl bg-[var(--color-muted)] px-4 py-3 text-sm text-[var(--color-muted-foreground)]">
            Belum ada foto di folder Google Drive ini.
          </p>
        )}

        {gallery.status === "ok" && gallery.photos.length > 0 && (
          <GalleryCarousel photos={gallery.photos} />
        )}
      </div>
    </div>
  );
}
