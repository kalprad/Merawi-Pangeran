import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug, getPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-midnight-teal)]"
      >
        <ArrowLeft size={16} />
        Kembali ke Blog
      </Link>

      <div className="mt-6 flex items-center gap-2 text-xs font-semibold tracking-wide text-[var(--color-midnight-teal)] uppercase">
        <span>{post.category}</span>
        <span aria-hidden="true">&middot;</span>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </div>
      <h1 className="font-display mt-3 text-3xl text-[var(--color-dark-green)] sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
        Ditulis oleh {post.author}
      </p>

      <div className="relative mt-8 h-64 w-full overflow-hidden rounded-3xl sm:h-96">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 768px) 768px, 100vw"
        />
      </div>

      <div className="prose-content mt-10 space-y-5 text-base leading-relaxed text-[var(--color-foreground)]">
        {post.content.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
