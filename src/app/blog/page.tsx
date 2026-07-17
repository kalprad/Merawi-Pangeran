import type { Metadata } from "next";
import { getPosts } from "@/lib/data";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import PageOrnaments from "@/components/PageOrnaments";
import BlogList from "@/components/BlogList";

export const metadata: Metadata = {
  title: "Blog Kegiatan",
  description:
    "Berita dan dokumentasi kegiatan KKN Merawi Pangeran 2026 di Desa Jetis, Kecamatan Bandungan.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="relative overflow-hidden">
      <PageOrnaments />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Blog"
            title="Berita Kegiatan KKN"
            description="Dokumentasi dan cerita seputar program kerja Tim KKN Merawi Pangeran 2026 di Desa Jetis."
          />
        </Reveal>

        <div className="mt-10">
          <BlogList posts={posts} />
        </div>
      </div>
    </div>
  );
}
