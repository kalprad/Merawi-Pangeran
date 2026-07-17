import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import PageOrnaments from "@/components/PageOrnaments";
import SearchBox from "@/components/SearchBox";
import { getMateri, getPosts, getTutorialVideos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Cari",
  description:
    "Cari berita kegiatan, materi sosialisasi, dan video tutorial KKN Merawi Pangeran 2026 dalam satu pencarian.",
};

export const dynamic = "force-dynamic";

export default async function CariPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [posts, materi, tutorialVideos] = await Promise.all([
    getPosts(),
    getMateri(),
    getTutorialVideos(),
  ]);
  const { q } = await searchParams;

  return (
    <div className="relative overflow-hidden">
      <PageOrnaments />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Pencarian"
            title="Cari di seluruh situs"
            description="Temukan berita kegiatan, materi sosialisasi, dan video tutorial dalam satu pencarian."
          />
        </Reveal>
        <div className="mt-10">
          <SearchBox posts={posts} materi={materi} tutorialVideos={tutorialVideos} initialQuery={q ?? ""} />
        </div>
      </div>
    </div>
  );
}
