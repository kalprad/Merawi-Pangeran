"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import type { MapLayer } from "@/lib/types";

export default function AdminPetaPage() {
  const [layers, setLayers] = useState<MapLayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  async function loadLayers() {
    setLoading(true);
    const res = await fetch("/api/admin/peta");
    const data = await res.json();
    setLayers(data);
    setLoading(false);
  }

  useEffect(() => {
    loadLayers();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Hapus jenis peta "${title}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    setDeletingId(id);
    await fetch(`/api/admin/peta/${id}`, { method: "DELETE" });
    setLayers((prev) => prev.filter((l) => l.id !== id));
    setDeletingId(null);
  }

  async function persistOrder(ordered: MapLayer[]) {
    setSavingOrder(true);
    await fetch("/api/admin/peta/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: ordered.map((l) => l.id) }),
    });
    setSavingOrder(false);
  }

  function handleDragStart(id: string) {
    setDragId(id);
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    if (id !== dragOverId) setDragOverId(id);
  }

  function handleDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    setDragOverId(null);
    if (!dragId || dragId === targetId) {
      setDragId(null);
      return;
    }
    const fromIndex = layers.findIndex((l) => l.id === dragId);
    const toIndex = layers.findIndex((l) => l.id === targetId);
    setDragId(null);
    if (fromIndex === -1 || toIndex === -1) return;

    const next = [...layers];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setLayers(next);
    persistOrder(next);
  }

  function handleDragEnd() {
    setDragId(null);
    setDragOverId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-[var(--color-dark-green)]">
          Peta Interaktif
        </h2>
        <Link
          href="/admin/peta/new"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-dark-green)] px-4 py-2 text-sm font-semibold text-[var(--color-beige)]"
        >
          <Plus size={16} />
          Tambah Jenis Peta
        </Link>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-[var(--color-muted-foreground)]">Memuat...</p>
      ) : layers.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--color-muted-foreground)]">
          Belum ada jenis peta. Klik &ldquo;Tambah Jenis Peta&rdquo; untuk membuat yang pertama.
        </p>
      ) : (
        <>
          <p className="mt-6 text-xs text-[var(--color-muted-foreground)]">
            Seret ikon <GripVertical size={12} className="inline" /> untuk mengatur urutan tampil
            di menu peta.
            {savingOrder && " Menyimpan urutan..."}
          </p>
          <ul className="mt-2 divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            {layers.map((layer) => (
              <li
                key={layer.id}
                draggable
                onDragStart={() => handleDragStart(layer.id)}
                onDragOver={(e) => handleDragOver(e, layer.id)}
                onDrop={(e) => handleDrop(e, layer.id)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-4 transition-colors duration-150 ${
                  dragId === layer.id ? "opacity-40" : ""
                } ${
                  dragOverId === layer.id && dragId !== layer.id
                    ? "bg-[var(--color-muted)]"
                    : ""
                }`}
              >
                <GripVertical
                  size={18}
                  className="shrink-0 cursor-grab text-[var(--color-muted-foreground)] active:cursor-grabbing"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold tracking-wide text-[var(--color-midnight-teal)] uppercase">
                    {layer.categories.length} kategori
                  </p>
                  <p className="truncate font-medium text-[var(--color-dark-green)]">
                    {layer.title}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/admin/peta/${layer.id}/edit`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-dark-green)] hover:bg-[var(--color-muted)]"
                    aria-label={`Sunting ${layer.title}`}
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(layer.id, layer.title)}
                    disabled={deletingId === layer.id}
                    className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-red-600 hover:bg-red-50 disabled:opacity-50"
                    aria-label={`Hapus ${layer.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
