"use client";

import { useMemo, useState } from "react";
import { Download, FileText } from "lucide-react";
import type { Materi } from "@/lib/types";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MateriList({ materi }: { materi: Materi[] }) {
  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(materi.map((m) => m.category)))],
    [materi],
  );
  const [active, setActive] = useState("Semua");

  const filtered =
    active === "Semua" ? materi : materi.filter((m) => m.category === active);

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

      {filtered.length === 0 ? (
        <p className="mt-10 text-sm text-[var(--color-muted-foreground)]">
          Belum ada materi pada kategori ini.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {filtered.map((item) => (
            <li
              key={item.id}
              className="glass-card flex flex-col rounded-3xl p-6"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-muted)] text-[var(--color-dark-green)]">
                  <FileText size={20} aria-hidden="true" />
                </div>
                <div>
                  <span className="text-xs font-semibold tracking-wide text-[var(--color-midnight-teal)] uppercase">
                    {item.category}
                  </span>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
