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

const emptyReleaseCountdown = { enabled: false, releaseAt: "", title: "", message: "" };

export default function PengaturanPage() {
  const [siBeningUrl, setSiBeningUrl] = useState("");
  const [galleryFolderUrl, setGalleryFolderUrl] = useState("");
  const [featureGuideUrls, setFeatureGuideUrls] =
    useState<Record<TutorialCategory, string>>(emptyGuideUrls);
  const [releaseCountdown, setReleaseCountdown] = useState(emptyReleaseCountdown);
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
        setReleaseCountdown({ ...emptyReleaseCountdown, ...data.releaseCountdown });
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
        body: JSON.stringify({
          siBeningUrl,
          galleryFolderUrl,
          featureGuideUrls,
          releaseCountdown,
        }),
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

          <div className="pt-4">
            <p className="text-sm font-medium text-[var(--color-dark-green)]">
              Countdown Persiapan Rilis
            </p>
            <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
              Saat diaktifkan, seluruh pengunjung situs (kecuali panel admin
              ini) hanya akan melihat layar hitung mundur sampai waktu rilis
              tercapai — cocok ditampilkan langsung saat prosesi penyerahan
              ke perangkat desa. Situs akan otomatis terbuka begitu waktunya
              tiba.
            </p>
          </div>

          <label className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              checked={releaseCountdown.enabled}
              onChange={(e) =>
                setReleaseCountdown((prev) => ({ ...prev, enabled: e.target.checked }))
              }
              className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-dark-green)]"
            />
            <span className="text-sm font-medium text-[var(--color-dark-green)]">
              Aktifkan layar countdown
            </span>
          </label>

          <label
            htmlFor="releaseAt"
            className="block pt-2 text-sm font-medium text-[var(--color-dark-green)]"
          >
            Waktu Rilis
          </label>
          <input
            id="releaseAt"
            type="datetime-local"
            value={releaseCountdown.releaseAt}
            onChange={(e) =>
              setReleaseCountdown((prev) => ({ ...prev, releaseAt: e.target.value }))
            }
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:border-[var(--color-midnight-teal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          />
          <p className="text-xs text-[var(--color-muted-foreground)]">
            Selalu dianggap sebagai waktu Indonesia bagian barat (WIB,
            UTC+7), apa pun zona waktu perangkat ini. Wajib diisi kalau
            countdown diaktifkan.
          </p>

          <label
            htmlFor="countdownTitle"
            className="block pt-2 text-sm font-medium text-[var(--color-dark-green)]"
          >
            Judul di Layar Countdown (opsional)
          </label>
          <input
            id="countdownTitle"
            type="text"
            value={releaseCountdown.title}
            onChange={(e) =>
              setReleaseCountdown((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Website Merawi Pangeran akan segera rilis"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:border-[var(--color-midnight-teal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          />

          <label
            htmlFor="countdownMessage"
            className="block pt-2 text-sm font-medium text-[var(--color-dark-green)]"
          >
            Pesan di Layar Countdown (opsional)
          </label>
          <textarea
            id="countdownMessage"
            value={releaseCountdown.message}
            onChange={(e) =>
              setReleaseCountdown((prev) => ({ ...prev, message: e.target.value }))
            }
            placeholder="Nantikan peluncuran resmi situs ini pada prosesi penyerahan program kerja kepada perangkat desa."
            rows={2}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:border-[var(--color-midnight-teal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          />

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
