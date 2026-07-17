"use client";

import { LayoutGrid, List as ListIcon } from "lucide-react";
import { SORT_OPTIONS, type SortKey } from "@/lib/sort";

export type ViewMode = "grid" | "list";

export default function ListToolbar({
  view,
  onViewChange,
  sort,
  onSortChange,
  resultCount,
  resultLabel,
}: {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  resultCount: number;
  resultLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-[var(--color-muted-foreground)]">
        {resultCount} {resultLabel}
      </p>
      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor="list-sort">
          Urutkan
        </label>
        <select
          id="list-sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="cursor-pointer rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-dark-green)] focus:border-[var(--color-midnight-teal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div
          role="group"
          aria-label="Mode tampilan"
          className="flex items-center gap-1 rounded-full bg-[var(--color-muted)] p-1"
        >
          <button
            type="button"
            aria-label="Tampilan kartu"
            aria-pressed={view === "grid"}
            onClick={() => onViewChange("grid")}
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ${
              view === "grid"
                ? "bg-[var(--color-dark-green)] text-[var(--color-beige)]"
                : "text-[var(--color-dark-green)] hover:bg-[var(--color-border)]"
            }`}
          >
            <LayoutGrid size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Tampilan daftar"
            aria-pressed={view === "list"}
            onClick={() => onViewChange("list")}
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ${
              view === "list"
                ? "bg-[var(--color-dark-green)] text-[var(--color-beige)]"
                : "text-[var(--color-dark-green)] hover:bg-[var(--color-border)]"
            }`}
          >
            <ListIcon size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
