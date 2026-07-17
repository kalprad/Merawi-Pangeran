"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CategoryTags from "@/components/CategoryTags";
import ListToolbar, { type ViewMode } from "@/components/ListToolbar";
import Reveal from "@/components/Reveal";
import { sortByDateOrTitle, type SortKey } from "@/lib/sort";
import type { Post } from "@/lib/types";

const VIEW_STORAGE_KEY = "merawi-blog-view";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogList({ posts }: { posts: Post[] }) {
  const [view, setView] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<SortKey>("newest");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const saved = localStorage.getItem(VIEW_STORAGE_KEY);
      if (saved === "grid" || saved === "list") setView(saved);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    localStorage.setItem(VIEW_STORAGE_KEY, view);
  }, [view]);

  const sorted = useMemo(() => sortByDateOrTitle(posts, sort), [posts, sort]);

  if (posts.length === 0) {
    return (
      <p className="mt-10 text-sm text-[var(--color-muted-foreground)]">
        Belum ada berita yang dipublikasikan.
      </p>
    );
  }

  return (
    <div>
      <ListToolbar
        view={view}
        onViewChange={setView}
        sort={sort}
        onSortChange={setSort}
        resultCount={sorted.length}
        resultLabel="berita"
      />

      {view === "grid" ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((post, i) => (
            <Reveal key={post.id} delay={Math.min(i, 6) * 80}>
              <Link
                href={`/blog/${post.slug}`}
                className="glass-card group flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
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
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryTags value={post.category} />
                    <time
                      dateTime={post.date}
                      className="text-xs font-medium text-[var(--color-muted-foreground)]"
                    >
                      {formatDate(post.date)}
                    </time>
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
            </Reveal>
          ))}
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {sorted.map((post, i) => (
            <Reveal key={post.id} as="li" delay={Math.min(i, 6) * 60}>
              <Link
                href={`/blog/${post.slug}`}
                className="glass-card group flex items-center gap-4 rounded-2xl p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-4"
              >
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-32">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryTags value={post.category} />
                    <time
                      dateTime={post.date}
                      className="text-xs font-medium text-[var(--color-muted-foreground)]"
                    >
                      {formatDate(post.date)}
                    </time>
                  </div>
                  <h2 className="font-display mt-1 truncate text-lg text-[var(--color-dark-green)]">
                    {post.title}
                  </h2>
                  <p className="mt-1 line-clamp-1 text-sm text-[var(--color-muted-foreground)] sm:line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="hidden shrink-0 text-[var(--color-midnight-teal)] transition-transform duration-200 group-hover:translate-x-1 sm:block"
                />
              </Link>
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  );
}
