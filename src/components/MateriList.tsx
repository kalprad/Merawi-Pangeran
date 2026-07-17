"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, FileText } from "lucide-react";
import { parseCategories } from "@/lib/categories";
import { sortByDateOrTitle, type SortKey } from "@/lib/sort";
import CategoryTags from "@/components/CategoryTags";
import ListToolbar, { type ViewMode } from "@/components/ListToolbar";
import Reveal from "@/components/Reveal";
import type { Materi } from "@/lib/types";

const VIEW_STORAGE_KEY = "merawi-materi-view";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MateriList({ materi }: { materi: Materi[] }) {
  const categories = useMemo(
    () => [
      "Semua",
      ...Array.from(new Set(materi.flatMap((m) => parseCategories(m.category)))),
    ],
    [materi],
  );
  const [active, setActive] = useState("Semua");
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

  const filtered =
    active === "Semua"
      ? materi
      : materi.filter((m) => parseCategories(m.category).includes(active));
  const sorted = useMemo(() => sortByDateOrTitle(filtered, sort), [filtered, sort]);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter kategori materi">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={active === cat}
            onClick={() => setActive(cat)}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] ${
              active === cat
                ? "bg-[var(--color-dark-green)] text-[var(--color-beige)]"
                : "bg-[var(--color-muted)] text-[var(--color-dark-green)] hover:bg-[var(--color-border)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <ListToolbar
          view={view}
          onViewChange={setView}
          sort={sort}
          onSortChange={setSort}
          resultCount={sorted.length}
          resultLabel="materi"
        />
      </div>

      {sorted.length === 0 ? (
        <p className="mt-10 text-sm text-[var(--color-muted-foreground)]">
          Belum ada materi pada kategori ini.
        </p>
      ) : view === "grid" ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {sorted.map((item, i) => (
            <Reveal
              key={item.id}
              as="li"
              delay={Math.min(i, 6) * 80}
              className="glass-card scroll-mt-24 flex flex-col rounded-3xl p-6"
              id={item.id}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-muted)] text-[var(--color-dark-green)]">
                  <FileText size={20} aria-hidden="true" />
                </div>
                <div>
                  <CategoryTags value={item.category} />
                  <h3 className="font-display mt-1 text-lg text-[var(--color-dark-green)]">
                    {item.title}
                  </h3>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                {item.description}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                <time dateTime={item.date} className="text-xs text-[var(--color-muted-foreground)]">
                  {formatDate(item.date)}
                </time>
                {item.fileUrl ? (
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-dark-green)] px-4 py-2 text-xs font-semibold text-[var(--color-beige)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <Download size={14} />
                    Unduh
                  </a>
                ) : (
                  <span className="rounded-full bg-[var(--color-muted)] px-4 py-2 text-xs font-medium text-[var(--color-muted-foreground)]">
                    Segera tersedia
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </ul>
      ) : (
        <ul className="mt-6 space-y-3">
          {sorted.map((item, i) => (
            <Reveal
              key={item.id}
              as="li"
              delay={Math.min(i, 6) * 60}
              className="glass-card scroll-mt-24 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center"
              id={item.id}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-muted)] text-[var(--color-dark-green)]">
                <FileText size={20} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <CategoryTags value={item.category} />
                  <time dateTime={item.date} className="text-xs text-[var(--color-muted-foreground)]">
                    {formatDate(item.date)}
                  </time>
                </div>
                <h3 className="font-display mt-1 text-base text-[var(--color-dark-green)]">
                  {item.title}
                </h3>
                <p className="mt-1 line-clamp-1 text-sm text-[var(--color-muted-foreground)]">
                  {item.description}
                </p>
              </div>
              {item.fileUrl ? (
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-[var(--color-dark-green)] px-4 py-2 text-xs font-semibold text-[var(--color-beige)] transition-transform duration-200 hover:-translate-y-0.5 sm:self-center"
                >
                  <Download size={14} />
                  Unduh
                </a>
              ) : (
                <span className="inline-flex shrink-0 items-center self-start rounded-full bg-[var(--color-muted)] px-4 py-2 text-xs font-medium text-[var(--color-muted-foreground)] sm:self-center">
                  Segera tersedia
                </span>
              )}
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  );
}
