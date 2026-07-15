import type { Metadata } from "next";
import { getMateri } from "@/lib/data";
import SectionHeading from "@/components/SectionHeading";
import MateriList from "@/components/MateriList";

export const metadata: Metadata = {
  title: "Materi Sosialisasi",
  description:
    "Kumpulan materi sosialisasi hukum, kesehatan, ekonomi, dan teknologi yang telah dilaksanakan oleh KKN Merawi Pangeran 2026.",
};

export const dynamic = "force-dynamic";

export default async function MateriPage() {
  const materi = await getMateri();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Materi Sosialisasi"
        title="Materi yang telah disosialisasikan"
        description="Unduh dan pelajari kembali materi sosialisasi yang sudah disampaikan tim KKN kepada warga Desa Jetis."
      />
      <div className="mt-10">
        <MateriList materi={materi} />
      </div>
    </div>
  );
}
