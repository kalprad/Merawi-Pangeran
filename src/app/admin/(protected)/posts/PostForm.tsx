"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { compressImage } from "@/lib/compressImage";
import { parseCategories, formatCategories } from "@/lib/categories";
import type { Post, Materi } from "@/lib/types";

const IMAGE_OPTIONS = [
  { value: "/images/hero-sawah.jpg", label: "Sawah Desa Jetis" },
  { value: "/images/hero-gunung.jpg", label: "Gunung Bandungan" },
  { value: "/images/si-bening-banner.png", label: "Banner SI-Bening" },
  { value: "/images/mascot.png", label: "Maskot" },
];

const PRESET_CATEGORIES = ["Sosialisasi", "Edukasi", "Survey"];

function splitInitialCategories(category: string | undefined) {
  const parsed = parseCategories(category ?? "");
  const presets = new Set(
    parsed.filter((c) =>
      PRESET_CATEGORIES.some((p) => p.toLowerCase() === c.toLowerCase()),
    ),
  );
  const custom = parsed.filter(
    (c) => !PRESET_CATEGORIES.some((p) => p.toLowerCase() === c.toLowerCase()),
  );
  return { presets, custom: custom.join(", ") };
}

type Props = {
  mode: "create" | "edit";
  initialData?: Post;
};

export default function PostForm({ mode, initialData }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    excerpt: initialData?.excerpt ?? "",
    content: initialData?.content ?? "",
    coverImage: initialData?.coverImage ?? IMAGE_OPTIONS[0].value,
    date: initialData?.date ?? new Date().toISOString().slice(0, 10),
    author: initialData?.author ?? "Tim KKN Merawi Pangeran",
    relatedMateriId: initialData?.relatedMateriId ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [materiList, setMateriList] = useState<Materi[]>([]);

  const initialCategories = splitInitialCategories(initialData?.category);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    initialCategories.presets,
  );
  const [customCategories, setCustomCategories] = useState(initialCategories.custom);

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  useEffect(() => {
    fetch("/api/admin/materi")
      .then((res) => res.json())
      .then((data) => setMateriList(Array.isArray(data) ? data : []))
      .catch(() => setMateriList([]));
  }, []);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setCustomFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const category = formatCategories([
      ...selectedCategories,
      ...parseCategories(customCategories),
    ]);
    if (!category) {
      setError("Pilih atau isi minimal satu kategori.");
      return;
    }

    let coverImage = form.coverImage;

    if (customFile) {
      setUploading(true);
      try {
        const compressed = await compressImage(customFile);
        const uploadForm = new FormData();
        uploadForm.append("file", compressed);
        uploadForm.append("folder", "Blog");
        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadForm,
        });
        const uploadData = await uploadRes.json().catch(() => ({}));
        if (!uploadRes.ok) {
          setError(uploadData.error ?? "Gagal mengunggah foto.");
          setUploading(false);
          return;
        }
        coverImage = uploadData.url;
      } catch {
        setError("Terjadi kesalahan jaringan saat mengunggah foto.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    setLoading(true);

    const url =
      mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${initialData?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, category, coverImage }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Gagal menyimpan berita.");
        setLoading(false);
        return;
      }
      router.push("/admin/posts");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <Field label="Judul" htmlFor="title">
        <input
          id="title"
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field
        label="Slug URL (opsional, otomatis dari judul jika kosong)"
        htmlFor="slug"
      >
        <input
          id="slug"
          value={form.slug}
          onChange={(e) => update("slug", e.target.value)}
          placeholder="contoh-slug-url"
          className={inputClass}
        />
      </Field>

      <Field label="Kategori (bisa pilih lebih dari satu)" htmlFor="customCategories">
        <div className="flex flex-wrap gap-3">
          {PRESET_CATEGORIES.map((cat) => (
            <label
              key={cat}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-dark-green)] has-[:checked]:border-transparent has-[:checked]:bg-[var(--color-dark-green)] has-[:checked]:text-[var(--color-beige)]"
            >
              <input
                type="checkbox"
                checked={selectedCategories.has(cat)}
                onChange={() => toggleCategory(cat)}
                className="sr-only"
              />
              {cat}
            </label>
          ))}
        </div>
        <input
          id="customCategories"
          value={customCategories}
          onChange={(e) => setCustomCategories(e.target.value)}
          placeholder="Kategori lainnya, pisahkan dengan koma (opsional)"
          className={`${inputClass} mt-2`}
        />
      </Field>

      <Field label="Tanggal" htmlFor="date">
        <input
          id="date"
          type="date"
          required
          value={form.date}
          onChange={(e) => update("date", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Penulis" htmlFor="author">
        <input
          id="author"
          required
          value={form.author}
          onChange={(e) => update("author", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Gambar Sampul" htmlFor="coverImage">
        <select
          id="coverImage"
          value={form.coverImage}
          onChange={(e) => update("coverImage", e.target.value)}
          disabled={Boolean(customFile)}
          className={`${inputClass} disabled:opacity-50`}
        >
          {IMAGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Atau unggah foto sendiri (opsional, foto besar otomatis dikecilkan)" htmlFor="customFile">
        <input
          id="customFile"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={`${inputClass} cursor-pointer file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-[var(--color-dark-green)] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[var(--color-beige)]`}
        />
        {previewUrl && (
          <div className="relative mt-3 h-32 w-full max-w-xs overflow-hidden rounded-xl border border-[var(--color-border)]">
            <Image src={previewUrl} alt="Pratinjau foto" fill className="object-cover" unoptimized />
          </div>
        )}
        {customFile && (
          <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
            Foto ini akan dipakai, bukan pilihan di atas.
          </p>
        )}
      </Field>

      <Field label="Ringkasan Singkat" htmlFor="excerpt">
        <textarea
          id="excerpt"
          required
          rows={2}
          value={form.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Isi Berita" htmlFor="content">
        <RichTextEditor
          value={form.content}
          onChange={(html) => update("content", html)}
          uploadFolder="Blog"
          placeholder="Tulis isi berita di sini... bisa tebal, miring, garis bawah, penomoran, dan sisip gambar (tempel langsung atau tombol gambar)."
        />
      </Field>

      <Field
        label="Materi Sosialisasi Terkait (opsional)"
        htmlFor="relatedMateriId"
      >
        <select
          id="relatedMateriId"
          value={form.relatedMateriId}
          onChange={(e) => update("relatedMateriId", e.target.value)}
          className={inputClass}
        >
          <option value="">Tidak ada</option>
          {materiList.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
          Kalau dipilih, tautan materi ini akan tampil di halaman berita.
        </p>
      </Field>

      {error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || uploading}
          className="cursor-pointer rounded-full bg-[var(--color-dark-green)] px-6 py-3 text-sm font-semibold text-[var(--color-beige)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? "Mengunggah foto..." : loading ? "Menyimpan..." : "Simpan Berita"}
        </button>
      </div>
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
