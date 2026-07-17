"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CirclePlay, FileText, Search } from "lucide-react";
import Reveal from "@/components/Reveal";
import CategoryTags from "@/components/CategoryTags";
import { TUTORIAL_CATEGORY_LABELS } from "@/lib/categories";
import type { Materi, Post, TutorialVideo } from "@/lib/types";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function matches(query: string, ...fields: (string | undefined)[]) {
  return fields.some((field) => field?.toLowerCase().includes(query));
}

export default function SearchBox({
  posts,
  materi,
  tutorialVideos,
  initialQuery = "",
}: {
  posts: Post[];
  materi: Materi[];
  tutorialVideos: TutorialVideo[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const q = query.trim().toLowerCase();

  const matchedPosts = useMemo(
    () => (q ? posts.filter((p) => matches(q, p.title, p.excerpt, p.category)) : []),
    [q, posts],
  );
  const matchedMateri = useMemo(
    () => (q ? materi.filter((m) => matches(q, m.title, m.description, m.category)) : []),
    [q, materi],
  );
  const matchedVideos = useMemo(
    () =>
      q
        ? tutorialVideos.filter((v) =>
            matches(q, v.title, v.description, TUTORIAL_CATEGORY_LABELS[v.category]),
          )
        : [],
    [q, tutorialVideos],
  );

  const totalResults = matchedPosts.length + matchedMateri.length + matchedVideos.length;

  return (
    <div>
      <div className="relative mx-auto max-w-xl">
        <Search
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--color-muted-foreground)]"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari berita, materi, atau video tutorial..."
          aria-label="Cari di seluruh situs"
          autoFocus
          className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] py-3.5 pr-4 pl-11 text-sm focus:border-[var(--color-midnight-teal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
        />
      </div>

      {!q ? (
        <p className="mt-10 text-center text-sm text-[var(--color-muted-foreground)]">
          Ketik kata kunci untuk mencari di seluruh berita, materi sosialisasi, dan video tutorial.
        </p>
      ) : totalResults === 0 ? (
        <p className="mt-10 text-center text-sm text-[var(--color-muted-foreground)]">
          Tidak ada hasil untuk &ldquo;{query.trim()}&rdquo;. Coba kata kunci lain.
        </p>
      ) : (
        <div className="mt-10 space-y-12">
          {matchedPosts.length > 0 && (
            <section>
              <h2 className="font-display text-xl text-[var(--color-dark-green)]">
                Berita{" "}
                <span className="font-sans text-sm font-normal text-[var(--color-muted-foreground)]">
                  ({matchedPosts.length})
                </span>
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {matchedPosts.map((post, i) => (
                  <Reveal key={post.id} delay={Math.min(i, 6) * 60}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="glass-card group flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative h-32 w-full overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <CategoryTags value={post.category} />
                          <time
                            dateTime={post.date}
                            className="text-xs font-medium text-[var(--color-muted-foreground)]"
                          >
                            {formatDate(post.date)}
                          </time>
                        </div>
                        <h3 className="font-display mt-1.5 text-base text-[var(--color-dark-green)]">
                          {post.title}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-xs text-[var(--color-muted-foreground)]">
                          {post.excerpt}
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {matchedMateri.length > 0 && (
            <section>
              <h2 className="font-display text-xl text-[var(--color-dark-green)]">
                Materi Sosialisasi{" "}
                <span className="font-sans text-sm font-normal text-[var(--color-muted-foreground)]">
                  ({matchedMateri.length})
                </span>
              </h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {matchedMateri.map((item, i) => (
                  <Reveal key={item.id} as="li" delay={Math.min(i, 6) * 60}>
                    <Link
                      href={`/materi#${item.id}`}
                      className="glass-card group flex h-full items-start gap-3 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-muted)] text-[var(--color-dark-green)]">
                        <FileText size={18} aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <CategoryTags value={item.category} />
                        <h3 className="font-display mt-1.5 text-base text-[var(--color-dark-green)]">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-xs text-[var(--color-muted-foreground)]">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </section>
          )}

          {matchedVideos.length > 0 && (
            <section>
              <h2 className="font-display text-xl text-[var(--color-dark-green)]">
                Video Tutorial{" "}
                <span className="font-sans text-sm font-normal text-[var(--color-muted-foreground)]">
                  ({matchedVideos.length})
                </span>
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {matchedVideos.map((video, i) => (
                  <Reveal key={video.id} as="li" delay={Math.min(i, 6) * 60}>
                    <Link
                      href={`/si-bening?modul=${video.category}&video=${video.id}#tutorial`}
                      className="glass-card flex items-start gap-3 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <CirclePlay
                        size={18}
                        className="mt-0.5 shrink-0 text-[var(--color-midnight-teal)]"
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-[var(--color-dark-green)]">
                          {video.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-[var(--color-muted-foreground)]">
                          {TUTORIAL_CATEGORY_LABELS[video.category]}
                        </span>
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
