"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, GripVertical, UploadCloud } from "lucide-react";
import type { MapLayer } from "@/lib/types";
import { slugify } from "@/lib/slugify";

const NAME_PROPERTY_HINTS = ["nama", "name", "namobj", "judul", "title", "label"];

function guessNameProperty(properties: Record<string, unknown>): string {
  const keys = Object.keys(properties);
  const hinted = keys.find((k) => NAME_PROPERTY_HINTS.includes(k.toLowerCase()));
  if (hinted) return hinted;
  const firstString = keys.find((k) => typeof properties[k] === "string");
  return firstString ?? keys[0] ?? "";
}

function stripExtension(fileName: string): string {
  return fileName.replace(/\.[^./\\]+$/, "").trim();
}

type ImportResult = { ok: true; title: string } | { ok: false; name: string; error: string };

async function importGeojsonFile(file: File): Promise<ImportResult> {
  try {
    const text = await file.text();
    const json = JSON.parse(text);
    if (json?.type !== "FeatureCollection" || !Array.isArray(json.features)) {
      throw new Error("Bukan GeoJSON FeatureCollection yang valid.");
    }

    const title = stripExtension(file.name) || "Peta Baru";
    const slug = slugify(title);
    const nameProperty = guessNameProperty(
      (json.features[0]?.properties ?? {}) as Record<string, unknown>,
    );

    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("kind", "geojson");
    uploadForm.append("slug", slug);
    const uploadRes = await fetch("/api/admin/peta/upload", {
      method: "POST",
      body: uploadForm,
    });
    const uploadData = await uploadRes.json().catch(() => ({}));
    if (!uploadRes.ok) {
      throw new Error(uploadData.error ?? "Gagal mengunggah GeoJSON.");
    }

    const createRes = await fetch("/api/admin/peta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        geojsonUrls: [uploadData.url],
        fields: { name: nameProperty },
        categories: [],
        photo: { mode: "none" },
      }),
    });
    const createData = await createRes.json().catch(() => ({}));
    if (!createRes.ok) {
      throw new Error(createData.error ?? "Gagal menyimpan jenis peta.");
    }

    return { ok: true, title };
  } catch (err) {
    return {
      ok: false,
      name: file.name,
      error: err instanceof Error ? err.message : "Terjadi kesalahan.",
    };
  }
}

export default function AdminPetaPage() {
  const [layers, setLayers] = useState<MapLayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  const [isDraggingImport, setIsDraggingImport] = useState(false);
  const [bulkImporting, setBulkImporting] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number } | null>(null);
  const [bulkSummary, setBulkSummary] = useState<{
    created: string[];
    failed: { name: string; error: string }[];
  } | null>(null);

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

  async function handleBulkImportFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).filter((f) => /\.(geojson|json)$/i.test(f.name));
    if (files.length === 0) return;

    setBulkSummary(null);
    setBulkImporting(true);
    setBulkProgress({ done: 0, total: files.length });

    const created: string[] = [];
    const failed: { name: string; error: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const result = await importGeojsonFile(files[i]);
      if (result.ok) created.push(result.title);
      else failed.push({ name: result.name, error: result.error });
      setBulkProgress({ done: i + 1, total: files.length });
    }

    setBulkImporting(false);
    setBulkProgress(null);
    setBulkSummary({ created, failed });
    if (created.length > 0) loadLayers();
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

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingImport(true);
        }}
        onDragLeave={() => setIsDraggingImport(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingImport(false);
          handleBulkImportFiles(e.dataTransfer.files);
        }}
        className={`mt-6 rounded-2xl border-2 border-dashed p-4 text-center transition-colors duration-150 ${
          isDraggingImport
            ? "border-[var(--color-midnight-teal)] bg-[var(--color-muted)]"
            : "border-[var(--color-border)] bg-[var(--color-surface)]"
        }`}
      >
        <UploadCloud
          size={22}
          className="mx-auto text-[var(--color-midnight-teal)]"
          aria-hidden="true"
        />
        <label
          htmlFor="bulkGeojsonImport"
          className="mt-1 block cursor-pointer text-sm font-medium text-[var(--color-dark-green)]"
        >
          Seret banyak file GeoJSON ke sini, atau{" "}
          <span className="underline">pilih beberapa file</span>
        </label>
        <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
          Tiap file jadi satu jenis peta baru (judul dari nama file). Sunting satu per satu
          setelahnya untuk atur kategori, legenda, dan foto.
        </p>
        <input
          id="bulkGeojsonImport"
          type="file"
          accept=".geojson,.json,application/geo+json,application/json"
          multiple
          disabled={bulkImporting}
          onChange={(e) => {
            handleBulkImportFiles(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />
        {bulkProgress && (
          <p className="mt-2 text-xs font-medium text-[var(--color-midnight-teal)]">
            Mengimpor {bulkProgress.done}/{bulkProgress.total}...
          </p>
        )}
        {bulkSummary && (
          <div className="mt-2 text-xs">
            {bulkSummary.created.length > 0 && (
              <p className="font-medium text-[var(--color-dark-green)]">
                Berhasil dibuat: {bulkSummary.created.join(", ")}
              </p>
            )}
            {bulkSummary.failed.length > 0 && (
              <p className="mt-0.5 text-red-600">
                Gagal: {bulkSummary.failed.map((f) => `${f.name} (${f.error})`).join("; ")}
              </p>
            )}
          </div>
        )}
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
