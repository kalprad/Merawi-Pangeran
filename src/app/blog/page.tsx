import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getPosts } from "@/lib/data";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Blog Kegiatan",
  description:
    "Berita dan dokumentasi kegiatan KKN Merawi Pangeran 2026 di Desa Jetis, Kecamatan Bandungan.",
};

export const dynamic = "force-dynamic";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Blog"
        title="Berita Kegiatan KKN"
        description="Dokumentasi dan cerita seputar program kerja Tim KKN Merawi Pangeran 2026 di Desa Jetis."
      />

      {posts.length === 0 ? (
        <p className="mt-10 text-sm text-[var(--color-muted-foreground)]">
          Belum ada berita yang dipublikasikan.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="glass-card group flex flex-col overflow-hidden rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[var(--color-midnight-teal)] uppercase">
                  <span>{post.category}</span>
                  <span aria-hidden="true">&middot;</span>
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>
                <h2 className="font-display mt-2 text-xl text-[var(--color-dark-green)]">
                  {post.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                  {post.excerpt}
                </p>
                <span className="mt-auto pt-4 text-sm font-semibold text-[var(--color-midnight-teal)]">
                  Baca selengkapnya &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
