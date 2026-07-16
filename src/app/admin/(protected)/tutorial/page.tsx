"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { TutorialCategory, TutorialVideo } from "@/lib/types";

const categoryGroups: { value: TutorialCategory; label: string }[] = [
  { value: "jembatan", label: "Evaluasi & Desain Jembatan" },
  { value: "irigasi", label: "Saluran Irigasi" },
  { value: "talud", label: "Talud" },
  { value: "rab", label: "Perhitungan RAB" },
];

export default function AdminTutorialPage() {
  const [videos, setVideos] = useState<TutorialVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadVideos() {
    setLoading(true);
    const res = await fetch("/api/admin/tutorial");
    const data = await res.json();
    setVideos(data);
    setLoading(false);
  }

  useEffect(() => {
    loadVideos();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Hapus video "${title}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    setDeletingId(id);
    await fetch(`/api/admin/tutorial/${id}`, { method: "DELETE" });
    setVideos((prev) => prev.filter((v) => v.id !== id));
    setDeletingId(null);
  }

  return (
    <div>
      <div>
        <h2 className="font-display text-xl text-[var(--color-dark-green)]">
          Video Tutorial SI-Bening
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          Kelola video tutorial per modul, ditampilkan di halaman publik SI-Bening ala E-Course.
        </p>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-[var(--color-muted-foreground)]">Memuat...</p>
      ) : (
        <div className="mt-6 space-y-8">
          {categoryGroups.map((group) => {
            const items = videos.filter((v) => v.category === group.value);
            return (
              <div key={group.value}>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-display text-lg text-[var(--color-dark-green)]">
                    {group.label}
                  </h3>
                  <Link
                    href={`/admin/tutorial/new?category=${group.value}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--color-dark-green)] px-4 py-2 text-sm font-semibold text-[var(--color-beige)]"
                  >
                    <Plus size={16} />
                    Tambah Video
                  </Link>
                </div>

                {items.length === 0 ? (
                  <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
                    Belum ada video untuk modul ini.
                  </p>
                ) : (
                  <ul className="mt-3 divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                    {items.map((item) => (
                      <li key={item.id} className="flex items-center justify-between gap-4 p-4">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold tracking-wide text-[var(--color-midnight-teal)] uppercase">
                            Urutan {item.order}
                          </p>
                          <p className="truncate font-medium text-[var(--color-dark-green)]">
                            {item.title}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <Link
                            href={`/admin/tutorial/${item.id}/edit`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-dark-green)] hover:bg-[var(--color-muted)]"
                            aria-label={`Sunting ${item.title}`}
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.title)}
                            disabled={deletingId === item.id}
                            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-red-600 hover:bg-red-50 disabled:opacity-50"
                            aria-label={`Hapus ${item.title}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
