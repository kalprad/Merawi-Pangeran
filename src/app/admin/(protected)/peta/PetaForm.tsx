"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Utensils,
  Wrench,
  ShoppingBag,
  Droplet,
  AlertTriangle,
  Home,
  HeartPulse,
  Landmark,
  GraduationCap,
  Sprout,
  Trees,
  Factory,
  Building,
  Waves,
  Zap,
  Store,
  Fish,
  PawPrint,
  Construction,
  Trash2,
  Mountain,
  BookOpen,
  Camera,
  type LucideIcon,
} from "lucide-react";
import type {
  MapIconKey,
  MapLayer,
  MapLayerCategory,
  MapLayerPhotoConfig,
} from "@/lib/types";

type Props = {
  mode: "create" | "edit";
  initialData?: MapLayer;
  defaultOrder: number;
};

type RawFeature = { properties?: Record<string, unknown> };

const ICON_OPTIONS: { value: MapIconKey; label: string; Icon: LucideIcon }[] = [
  { value: "map-pin", label: "Penanda Umum", Icon: MapPin },
  { value: "utensils", label: "Makanan", Icon: Utensils },
  { value: "wrench", label: "Jasa / Perbaikan", Icon: Wrench },
  { value: "shopping-bag", label: "Barang / Toko", Icon: ShoppingBag },
  { value: "droplet", label: "Air / Irigasi", Icon: Droplet },
  { value: "alert-triangle", label: "Peringatan / Rusak", Icon: AlertTriangle },
  { value: "home", label: "Pemerintahan", Icon: Home },
  { value: "heart-pulse", label: "Kesehatan", Icon: HeartPulse },
  { value: "landmark", label: "Bangunan Umum", Icon: Landmark },
  { value: "graduation-cap", label: "Pendidikan", Icon: GraduationCap },
  { value: "sprout", label: "Pertanian", Icon: Sprout },
  { value: "trees", label: "Perkebunan / Hutan", Icon: Trees },
  { value: "factory", label: "Industri", Icon: Factory },
  { value: "building", label: "Tempat Ibadah", Icon: Building },
  { value: "waves", label: "Sumber Air", Icon: Waves },
  { value: "zap", label: "Listrik", Icon: Zap },
  { value: "store", label: "Pasar", Icon: Store },
  { value: "fish", label: "Perikanan", Icon: Fish },
  { value: "paw-print", label: "Peternakan", Icon: PawPrint },
  { value: "construction", label: "Infrastruktur", Icon: Construction },
  { value: "trash-2", label: "Kebersihan / Sampah", Icon: Trash2 },
  { value: "mountain", label: "Wisata Alam", Icon: Mountain },
  { value: "book-open", label: "Perpustakaan", Icon: BookOpen },
  { value: "camera", label: "Wisata / Dokumentasi", Icon: Camera },
];

function IconPicker({
  value,
  onChange,
}: {
  value: MapIconKey;
  onChange: (icon: MapIconKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const selected = ICON_OPTIONS.find((o) => o.value === value) ?? ICON_OPTIONS[0];
  const SelectedIcon = selected.Icon;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${inputClass} flex w-44 cursor-pointer items-center gap-2`}
      >
        <SelectedIcon size={16} className="shrink-0 text-[var(--color-midnight-teal)]" />
        <span className="truncate">{selected.label}</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute top-full left-0 z-50 mt-1 grid w-60 grid-cols-5 gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-lg"
        >
          {ICON_OPTIONS.map((opt) => {
            const Icon = opt.Icon;
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                title={opt.label}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition-colors duration-150 ${
                  isSelected
                    ? "border-[var(--color-dark-green)] bg-[var(--color-dark-green)] text-[var(--color-beige)]"
                    : "border-transparent text-[var(--color-dark-green)] hover:bg-[var(--color-muted)]"
                }`}
              >
                <Icon size={17} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const DEFAULT_COLORS = [
  "#C9793A",
  "#105666",
  "#6C5B9E",
  "#839958",
  "#D3968C",
  "#B3423A",
  "#4a5a3f",
  "#0a3323",
];

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "peta"
  );
}

function detectProperties(features: RawFeature[]): string[] {
  const keys = new Set<string>();
  for (const f of features.slice(0, 300)) {
    for (const k of Object.keys(f?.properties ?? {})) keys.add(k);
  }
  return Array.from(keys);
}

function detectValues(features: RawFeature[], property: string): string[] {
  if (!property) return [];
  const values = new Set<string>();
  for (const f of features) {
    const raw = f?.properties?.[property];
    if (raw != null && String(raw).trim() !== "") values.add(String(raw).trim());
  }
  return Array.from(values).slice(0, 20);
}

function computeCategories(
  values: string[],
  previous: MapLayerCategory[],
): MapLayerCategory[] {
  return values.map((value, i) => {
    const existing = previous.find((c) => c.value === value);
    return (
      existing ?? {
        value,
        label: value,
        color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        icon: "map-pin",
      }
    );
  });
}

export default function PetaForm({ mode, initialData, defaultOrder }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const slug = mode === "edit" ? (initialData?.slug ?? "") : slugify(title);

  const [features, setFeatures] = useState<RawFeature[]>([]);
  const [detectedProperties, setDetectedProperties] = useState<string[]>([]);
  const [geojsonFile, setGeojsonFile] = useState<File | null>(null);
  const [geojsonUrl, setGeojsonUrl] = useState(initialData?.geojsonUrl ?? "");
  const [geojsonReady, setGeojsonReady] = useState(mode === "edit");

  const [nameProperty, setNameProperty] = useState(initialData?.fields.name ?? "");
  const [categoryProperty, setCategoryProperty] = useState(
    initialData?.fields.category ?? "",
  );
  const [googleMapsProperty, setGoogleMapsProperty] = useState(
    initialData?.fields.googleMaps ?? "",
  );
  const [infoFields, setInfoFields] = useState<{ label: string; property: string }[]>(
    initialData?.fields.info ?? [],
  );
  const [categories, setCategories] = useState<MapLayerCategory[]>(
    initialData?.categories ?? [],
  );

  const [photoMode, setPhotoMode] = useState<MapLayerPhotoConfig["mode"]>(
    initialData?.photo.mode ?? "none",
  );
  const [photoMap, setPhotoMap] = useState<Record<string, string>>(
    initialData?.photo.mode === "map" ? initialData.photo.photoMap : {},
  );
  const [photoProperty, setPhotoProperty] = useState(
    initialData?.photo.mode === "property" ? initialData.photo.property : "",
  );
  const [uploadingPhotoFor, setUploadingPhotoFor] = useState<string | null>(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number } | null>(null);
  const [bulkSummary, setBulkSummary] = useState<{
    matched: number;
    failed: string[];
    unmatched: string[];
  } | null>(null);

  const [downloadUrl, setDownloadUrl] = useState(initialData?.downloadUrl ?? "");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingGeojson, setUploadingGeojson] = useState(false);

  // Mode sunting: ambil isi GeoJSON yang sudah ada supaya daftar properti
  // dan nama fitur untuk pemetaan foto ikut terisi otomatis.
  useEffect(() => {
    if (mode !== "edit" || !initialData?.geojsonUrl) return;
    fetch(initialData.geojsonUrl)
      .then((res) => res.json())
      .then((json) => {
        const feats = Array.isArray(json?.features) ? json.features : [];
        setFeatures(feats);
        setDetectedProperties(detectProperties(feats));
      })
      .catch(() => {
        setError("Gagal memuat isi GeoJSON yang sudah ada. Unggah ulang jika perlu.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  function handleGeojsonFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setGeojsonFile(file);
    setGeojsonReady(false);
    setError(null);
    if (!file) return;

    file
      .text()
      .then((text) => {
        const json = JSON.parse(text);
        if (json?.type !== "FeatureCollection" || !Array.isArray(json.features)) {
          setError("File harus berupa GeoJSON FeatureCollection.");
          return;
        }
        const feats: RawFeature[] = json.features;
        setFeatures(feats);
        setDetectedProperties(detectProperties(feats));
        setGeojsonReady(true);
        // Reset pemetaan properti karena file baru bisa punya struktur berbeda.
        setNameProperty("");
        setCategoryProperty("");
        setGoogleMapsProperty("");
        setInfoFields([]);
        setCategories([]);
        setPhotoMap({});
        setPhotoProperty("");
      })
      .catch(() => {
        setError("Gagal membaca file sebagai GeoJSON (bukan JSON valid).");
      });
  }

  function handleCategoryPropertyChange(value: string) {
    setCategoryProperty(value);
    const values = detectValues(features, value);
    setCategories(computeCategories(values, categories));
  }

  function updateCategory(index: number, patch: Partial<MapLayerCategory>) {
    setCategories((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }

  function addInfoField() {
    setInfoFields((prev) => [...prev, { label: "", property: "" }]);
  }

  function updateInfoField(index: number, patch: Partial<{ label: string; property: string }>) {
    setInfoFields((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  function removeInfoField(index: number) {
    setInfoFields((prev) => prev.filter((_, i) => i !== index));
  }

  const featureNames =
    photoMode === "map" && nameProperty ? detectValues(features, nameProperty) : [];

  async function uploadPhotoFile(name: string, file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    form.append("kind", "photo");
    form.append("slug", slug);
    form.append("name", name);
    const res = await fetch("/api/admin/peta/upload", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error ?? `Gagal mengunggah foto untuk "${name}".`);
    }
    return data.url as string;
  }

  async function handlePhotoFileChange(name: string, file: File | null) {
    if (!file || !slug) return;
    setUploadingPhotoFor(name);
    setError(null);
    try {
      const url = await uploadPhotoFile(name, file);
      setPhotoMap((prev) => ({ ...prev, [name]: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan jaringan saat mengunggah foto.");
    } finally {
      setUploadingPhotoFor(null);
    }
  }

  function stripExtension(fileName: string): string {
    return fileName.replace(/\.[^./\\]+$/, "").trim();
  }

  async function handleBulkPhotoFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    if (!slug) {
      setError("Isi judul peta dahulu sebelum unggah foto.");
      return;
    }

    const files = Array.from(fileList);
    const toUpload: { name: string; file: File }[] = [];
    const unmatched: string[] = [];

    for (const file of files) {
      const base = stripExtension(file.name);
      const match =
        featureNames.find((n) => n === base) ??
        featureNames.find((n) => n.toLowerCase() === base.toLowerCase());
      if (match) {
        toUpload.push({ name: match, file });
      } else {
        unmatched.push(file.name);
      }
    }

    setError(null);
    setBulkSummary(null);
    setBulkUploading(true);
    setBulkProgress({ done: 0, total: toUpload.length });

    const failed: string[] = [];
    for (let i = 0; i < toUpload.length; i++) {
      const { name, file } = toUpload[i];
      try {
        const url = await uploadPhotoFile(name, file);
        setPhotoMap((prev) => ({ ...prev, [name]: url }));
      } catch {
        failed.push(file.name);
      }
      setBulkProgress({ done: i + 1, total: toUpload.length });
    }

    setBulkUploading(false);
    setBulkProgress(null);
    setBulkSummary({ matched: toUpload.length - failed.length, failed, unmatched });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Judul peta wajib diisi.");
      return;
    }
    if (!nameProperty) {
      setError("Pilih properti yang menjadi nama fitur.");
      return;
    }

    let finalGeojsonUrl = geojsonUrl;

    if (geojsonFile) {
      setUploadingGeojson(true);
      try {
        const form = new FormData();
        form.append("file", geojsonFile);
        form.append("kind", "geojson");
        form.append("slug", slug);
        const res = await fetch("/api/admin/peta/upload", { method: "POST", body: form });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error ?? "Gagal mengunggah GeoJSON.");
          setUploadingGeojson(false);
          return;
        }
        finalGeojsonUrl = data.url;
        setGeojsonUrl(data.url);
      } catch {
        setError("Terjadi kesalahan jaringan saat mengunggah GeoJSON.");
        setUploadingGeojson(false);
        return;
      }
      setUploadingGeojson(false);
    }

    if (!finalGeojsonUrl) {
      setError("Unggah file GeoJSON terlebih dahulu.");
      return;
    }

    const photo: MapLayerPhotoConfig =
      photoMode === "map"
        ? { mode: "map", photoMap }
        : photoMode === "property"
          ? { mode: "property", property: photoProperty }
          : { mode: "none" };

    setLoading(true);
    const url = mode === "create" ? "/api/admin/peta" : `/api/admin/peta/${initialData?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          geojsonUrl: finalGeojsonUrl,
          fields: {
            name: nameProperty,
            category: categoryProperty || undefined,
            googleMaps: googleMapsProperty || undefined,
            info: infoFields.filter((f) => f.label && f.property),
          },
          categories: categoryProperty ? categories : [],
          photo,
          downloadUrl: downloadUrl || undefined,
          order: defaultOrder,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Gagal menyimpan jenis peta.");
        setLoading(false);
        return;
      }
      router.push("/admin/peta");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan.");
      setLoading(false);
    }
  }

  const propertyOptions = ["", ...detectedProperties];

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <Field label="Judul Peta" htmlFor="title">
        <input
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="contoh: Peta Lahan Permaculture"
          className={inputClass}
        />
        {slug && (
          <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">Slug: {slug}</p>
        )}
      </Field>

      <Field label="Unggah GeoJSON" htmlFor="geojson">
        <input
          id="geojson"
          type="file"
          accept=".geojson,.json,application/geo+json,application/json"
          onChange={handleGeojsonFileChange}
          className={`${inputClass} cursor-pointer file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-[var(--color-dark-green)] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[var(--color-beige)]`}
        />
        {mode === "edit" && !geojsonFile && geojsonUrl && (
          <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
            Memakai GeoJSON yang sudah ada. Pilih file untuk menggantinya.
          </p>
        )}
        {geojsonReady && (
          <p className="mt-1 text-xs font-medium text-[var(--color-midnight-teal)]">
            {features.length} fitur terbaca, {detectedProperties.length} properti terdeteksi.
          </p>
        )}
      </Field>

      {detectedProperties.length > 0 && (
        <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-4">
          <p className="text-sm font-semibold text-[var(--color-dark-green)]">
            Pemetaan Properti
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Properti Nama Fitur" htmlFor="nameProperty">
              <select
                id="nameProperty"
                required
                value={nameProperty}
                onChange={(e) => setNameProperty(e.target.value)}
                className={inputClass}
              >
                <option value="" disabled>
                  Pilih properti...
                </option>
                {detectedProperties.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Properti Kategori (opsional)" htmlFor="categoryProperty">
              <select
                id="categoryProperty"
                value={categoryProperty}
                onChange={(e) => handleCategoryPropertyChange(e.target.value)}
                className={inputClass}
              >
                {propertyOptions.map((p) => (
                  <option key={p || "none"} value={p}>
                    {p || "(Tidak ada)"}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Properti Link Google Maps (opsional)" htmlFor="googleMapsProperty">
              <select
                id="googleMapsProperty"
                value={googleMapsProperty}
                onChange={(e) => setGoogleMapsProperty(e.target.value)}
                className={inputClass}
              >
                {propertyOptions.map((p) => (
                  <option key={p || "none"} value={p}>
                    {p || "(Tidak ada)"}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="block text-sm font-medium text-[var(--color-dark-green)]">
                Info Tambahan pada Popup (opsional)
              </span>
              <button
                type="button"
                onClick={addInfoField}
                className="cursor-pointer text-xs font-semibold text-[var(--color-midnight-teal)]"
              >
                + Tambah baris
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {infoFields.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={f.label}
                    onChange={(e) => updateInfoField(i, { label: e.target.value })}
                    placeholder="Label, contoh: Dusun"
                    className={inputClass}
                  />
                  <select
                    value={f.property}
                    onChange={(e) => updateInfoField(i, { property: e.target.value })}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Pilih properti...
                    </option>
                    {detectedProperties.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeInfoField(i)}
                    className="cursor-pointer rounded-full px-3 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {categoryProperty && categories.length > 0 && (
        <div className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-4">
          <p className="text-sm font-semibold text-[var(--color-dark-green)]">
            Setting Tampilan Legenda
          </p>
          {categories.map((cat, i) => (
            <div key={cat.value} className="flex flex-wrap items-center gap-2">
              <span className="w-32 shrink-0 truncate text-xs text-[var(--color-muted-foreground)]">
                {cat.value}
              </span>
              <input
                value={cat.label}
                onChange={(e) => updateCategory(i, { label: e.target.value })}
                placeholder="Label legenda"
                className={`${inputClass} w-40`}
              />
              <input
                type="color"
                value={cat.color}
                onChange={(e) => updateCategory(i, { color: e.target.value })}
                className="h-10 w-12 cursor-pointer rounded-lg border border-[var(--color-border)]"
              />
              <IconPicker
                value={cat.icon}
                onChange={(icon) => updateCategory(i, { icon })}
              />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-4">
        <p className="text-sm font-semibold text-[var(--color-dark-green)]">Foto</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="photoMode"
              checked={photoMode === "none"}
              onChange={() => setPhotoMode("none")}
            />
            Tidak ada
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="photoMode"
              checked={photoMode === "map"}
              onChange={() => setPhotoMode("map")}
              disabled={!nameProperty}
            />
            Isi manual per fitur (upload atau tempel link, termasuk Google Drive)
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="photoMode"
              checked={photoMode === "property"}
              onChange={() => setPhotoMode("property")}
            />
            Sudah ada di properti GeoJSON
          </label>
        </div>

        {photoMode === "property" && (
          <Field label="Properti Link Foto" htmlFor="photoProperty">
            <select
              id="photoProperty"
              value={photoProperty}
              onChange={(e) => setPhotoProperty(e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>
                Pilih properti...
              </option>
              {detectedProperties.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
        )}

        {photoMode === "map" && (
          <div>
            {!slug && (
              <p className="text-xs text-red-600">Isi judul peta dahulu sebelum unggah foto.</p>
            )}

            <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-white/40 p-3">
              <label
                htmlFor="bulkPhotos"
                className="block text-xs font-medium text-[var(--color-dark-green)]"
              >
                Unggah banyak foto sekaligus
              </label>
              <p className="mt-0.5 text-[11px] text-[var(--color-muted-foreground)]">
                Nama file (tanpa ekstensi) akan dicocokkan otomatis dengan nilai properti{" "}
                <span className="font-semibold">{nameProperty || "nama fitur"}</span>, contoh:
                &ldquo;Warung Kopi Bu Sri.jpg&rdquo; akan terpasang untuk fitur bernama &ldquo;Warung
                Kopi Bu Sri&rdquo;.
              </p>
              <input
                id="bulkPhotos"
                type="file"
                accept="image/*"
                multiple
                disabled={!slug || bulkUploading}
                onChange={(e) => {
                  handleBulkPhotoFiles(e.target.files);
                  e.target.value = "";
                }}
                className={`${inputClass} mt-2 cursor-pointer file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-[var(--color-dark-green)] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[var(--color-beige)] disabled:cursor-not-allowed disabled:opacity-60`}
              />
              {bulkProgress && (
                <p className="mt-1.5 text-xs font-medium text-[var(--color-midnight-teal)]">
                  Mengunggah {bulkProgress.done}/{bulkProgress.total}...
                </p>
              )}
              {bulkSummary && (
                <div className="mt-1.5 text-xs">
                  <p className="font-medium text-[var(--color-dark-green)]">
                    {bulkSummary.matched} foto berhasil diunggah dan dicocokkan.
                  </p>
                  {bulkSummary.failed.length > 0 && (
                    <p className="mt-0.5 text-red-600">
                      Gagal diunggah: {bulkSummary.failed.join(", ")}
                    </p>
                  )}
                  {bulkSummary.unmatched.length > 0 && (
                    <p className="mt-0.5 text-amber-700">
                      Tidak ada fitur yang cocok untuk: {bulkSummary.unmatched.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-3 max-h-96 space-y-2 overflow-y-auto pr-1">
              {featureNames.map((name) => (
                <div key={name} className="flex items-center gap-2">
                  {photoMap[name] ? (
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[var(--color-border)]">
                      <Image src={photoMap[name]} alt={name} fill unoptimized className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 shrink-0 rounded-lg border border-dashed border-[var(--color-border)]" />
                  )}
                  <span className="w-40 shrink-0 truncate text-xs text-[var(--color-dark-green)]">
                    {name}
                  </span>
                  <input
                    value={photoMap[name] ?? ""}
                    onChange={(e) =>
                      setPhotoMap((prev) => ({ ...prev, [name]: e.target.value }))
                    }
                    placeholder="Tempel link foto (Google Drive dll.)"
                    className={`${inputClass} flex-1`}
                  />
                  <label className="cursor-pointer rounded-full bg-[var(--color-dark-green)] px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-[var(--color-beige)]">
                    {uploadingPhotoFor === name ? "Mengunggah..." : "Unggah"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={!slug || uploadingPhotoFor === name}
                      onChange={(e) => handlePhotoFileChange(name, e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Field label="Link File Peta Hasil Layout GIS (opsional)" htmlFor="downloadUrl">
        <input
          id="downloadUrl"
          type="url"
          value={downloadUrl}
          onChange={(e) => setDownloadUrl(e.target.value)}
          placeholder="https://drive.google.com/..."
          className={inputClass}
        />
      </Field>
      <p className="text-xs text-[var(--color-muted-foreground)]">
        Urutan tampil peta bisa diatur dengan seret-dan-lepas di halaman daftar Peta Interaktif.
      </p>

      {error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || uploadingGeojson}
        className="cursor-pointer rounded-full bg-[var(--color-dark-green)] px-6 py-3 text-sm font-semibold text-[var(--color-beige)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uploadingGeojson ? "Mengunggah GeoJSON..." : loading ? "Menyimpan..." : "Simpan Jenis Peta"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:border-[var(--color-midnight-teal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-[var(--color-dark-green)]">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
