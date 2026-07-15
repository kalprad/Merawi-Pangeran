import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, FileText, ArrowUpRight } from "lucide-react";
import { getPostBySlug, getPosts, getMateriById } from "@/lib/data";
import { hasOverlap } from "@/lib/categories";
import CategoryTags from "@/components/CategoryTags";
import Reveal from "@/components/Reveal";
import type { Post } from "@/lib/types";

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

  const [relatedMateri, allPosts] = await Promise.all([
    post.relatedMateriId ? getMateriById(post.relatedMateriId) : Promise.resolve(undefined),
    getPosts(),
  ]);

  const otherPosts = allPosts.filter((p) => p.id !== post.id);
  const sameCategory = otherPosts.filter((p) => hasOverlap(p.category, post.category));
  const rest = otherPosts.filter((p) => !hasOverlap(p.category, post.category));
  const recommended = [...sameCategory, ...rest].slice(0, 3);

  return (
    <>
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-midnight-teal)]"
      >
        <ArrowLeft size={16} />
        Kembali ke Blog
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <CategoryTags value={post.category} />
        <time
          dateTime={post.date}
          className="text-xs font-medium text-[var(--color-muted-foreground)]"
        >
          {formatDate(post.date)}
        </time>
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

      <div className="glass-card mt-8 rounded-3xl p-6 sm:p-10">
        {isHtmlContent(post.content) ? (
          <div
            className="prose-content text-base leading-relaxed text-[var(--color-foreground)]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <div className="prose-content space-y-5 text-base leading-relaxed text-[var(--color-foreground)]">
            {post.content
              .split("\n\n")
              .map((block) => block.trim())
              .filter(Boolean)
              .map((block, i) => {
                const imageMatch = block.match(/^!\[(.*?)\]\((\S+)\)$/);
                if (imageMatch) {
                  const [, alt, src] = imageMatch;
                  return (
                    <div
                      key={i}
                      className="relative h-64 w-full overflow-hidden rounded-2xl sm:h-96"
                    >
                      <Image
                        src={src}
                        alt={alt || post.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 768px, 100vw"
                        unoptimized={src.startsWith("http")}
                      />
                    </div>
                  );
                }
                return <p key={i}>{block}</p>;
              })}
          </div>
        )}
      </div>

      {relatedMateri && (
        <Reveal>
          <Link
            href="/materi"
            className="glass-card mt-6 flex items-center gap-4 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-dark-green)] text-[var(--color-beige)]">
              <FileText size={20} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-wide text-[var(--color-midnight-teal)] uppercase">
                Materi Sosialisasi Terkait
              </p>
              <p className="truncate font-medium text-[var(--color-dark-green)]">
                {relatedMateri.title}
              </p>
            </div>
            <ArrowUpRight size={18} className="shrink-0 text-[var(--color-midnight-teal)]" />
          </Link>
        </Reveal>
      )}
    </article>
    <RecommendedPosts posts={recommended} />
    </>
  );
}

function RecommendedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
      <h2 className="font-display text-2xl text-[var(--color-dark-green)]">
        Berita Lainnya
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.id} delay={i * 90}>
            <Link
              href={`/blog/${post.slug}`}
              className="glass-card group flex flex-col overflow-hidden rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-36 w-full overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <CategoryTags value={post.category} />
                <h3 className="font-display mt-1 text-base text-[var(--color-dark-green)]">
                  {post.title}
                </h3>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function isHtmlContent(content: string): boolean {
  return /^\s*<[a-z][\s\S]*>/i.test(content);
}
