"use client";

import { useEffect, useState } from "react";
import type { TutorialCategory } from "@/lib/types";

const featureGuideFields: { value: TutorialCategory; label: string }[] = [
  { value: "jembatan", label: "Evaluasi & Desain Jembatan" },
  { value: "irigasi", label: "Saluran Irigasi" },
  { value: "talud", label: "Talud" },
  { value: "rab", label: "Perhitungan RAB" },
];

const emptyGuideUrls: Record<TutorialCategory, string> = {
  jembatan: "",
  irigasi: "",
  talud: "",
  rab: "",
};

export default function PengaturanPage() {
  const [siBeningUrl, setSiBeningUrl] = useState("");
  const [galleryFolderUrl, setGalleryFolderUrl] = useState("");
  const [featureGuideUrls, setFeatureGuideUrls] =
    useState<Record<TutorialCategory, string>>(emptyGuideUrls);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setSiBeningUrl(data.siBeningUrl ?? "");
        setGalleryFolderUrl(data.galleryFolderUrl ?? "");
        setFeatureGuideUrls({ ...emptyGuideUrls, ...data.featureGuideUrls });
        setLoading(false);
      });
  }, []);

  function updateGuideUrl(category: TutorialCategory, value: string) {
    setFeatureGuideUrls((prev) => ({ ...prev, [category]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siBeningUrl, galleryFolderUrl, featureGuideUrls }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Gagal menyimpan pengaturan.");
        setSaving(false);
        return;
      }
      setSaved(true);
      setSaving(false);
    } catch {
      setError("Terjadi kesalahan jaringan.");
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 className="font-display text-xl text-[var(--color-dark-green)]">
        Pengaturan Situs
      </h2>

      {loading ? (
        <p className="mt-6 text-sm text-[var(--color-muted-foreground)]">Memuat...</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-2">
          <label
            htmlFor="siBeningUrl"
            className="block text-sm font-medium text-[var(--color-dark-green)]"
          >
            Link Download SI-Bening (Google Drive, dsb.)
          </label>
          <input
            id="siBeningUrl"
            type="url"
            value={siBeningUrl}
            onChange={(e) => setSiBeningUrl(e.target.value)}
            placeholder="https://drive.google.com/..."
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:border-[var(--color-midnight-teal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          />
          <p className="text-xs text-[var(--color-muted-foreground)]">
            Kosongkan kalau belum ada link — halaman SI-Bening akan menampilkan
            tombol &ldquo;Segera Hadir&rdquo;.
          </p>

          <label
            htmlFor="galleryFolderUrl"
            className="block pt-4 text-sm font-medium text-[var(--color-dark-green)]"
          >
            Link Folder Google Drive untuk Galeri
          </label>
          <input
            id="galleryFolderUrl"
            type="url"
            value={galleryFolderUrl}
            onChange={(e) => setGalleryFolderUrl(e.target.value)}
            placeholder="https://drive.google.com/drive/folders/..."
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:border-[var(--color-midnight-teal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          />
          <p className="text-xs text-[var(--color-muted-foreground)]">
            Folder harus dibagikan sebagai &ldquo;Siapa saja yang memiliki
            link&rdquo; (Anyone with the link). Halaman Galeri akan menarik
            foto dari folder ini secara otomatis — tidak perlu unggah ulang ke
            situs. Perlu env var <code>GOOGLE_DRIVE_API_KEY</code> di server
            (lihat README).
          </p>

          <div className="pt-4">
            <p className="text-sm font-medium text-[var(--color-dark-green)]">
              Link Dokumen Cara Penggunaan Fitur
            </p>
            <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
              Tautan dokumen (PDF/Word di Google Drive, dsb.) untuk tombol
              &ldquo;Unduh Cara Penggunaan&rdquo; di tiap fitur pada halaman
              SI-Bening. Kosongkan kalau dokumennya belum tersedia.
            </p>
          </div>

          {featureGuideFields.map((field) => (
            <div key={field.value} className="pt-2">
              <label
                htmlFor={`guide-${field.value}`}
                className="block text-sm font-medium text-[var(--color-dark-green)]"
              >
                {field.label}
              </label>
              <input
                id={`guide-${field.value}`}
                type="url"
                value={featureGuideUrls[field.value]}
                onChange={(e) => updateGuideUrl(field.value, e.target.value)}
                placeholder="https://drive.google.com/file/d/.../view"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:border-[var(--color-midnight-teal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
              />
            </div>
          ))}

          {error && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {error}
            </p>
          )}
          {saved && !error && (
            <p className="text-sm font-medium text-[var(--color-midnight-teal)]">
              Tersimpan.
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-2 cursor-pointer rounded-full bg-[var(--color-dark-green)] px-6 py-3 text-sm font-semibold text-[var(--color-beige)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </form>
      )}
    </div>
  );
}
