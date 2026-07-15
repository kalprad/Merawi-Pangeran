"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@/lib/types";

const IMAGE_OPTIONS = [
  { value: "/images/hero-sawah.jpg", label: "Sawah Desa Jetis" },
  { value: "/images/hero-gunung.jpg", label: "Gunung Bandungan" },
  { value: "/images/si-bening-banner.png", label: "Banner SI-Bening" },
  { value: "/images/mascot.png", label: "Maskot" },
];

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
    category: initialData?.category ?? "Kegiatan",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url =
      mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${initialData?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Kategori" htmlFor="category">
          <input
            id="category"
            required
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className={inputClass}
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
      </div>

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
          className={inputClass}
        >
          {IMAGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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

      <Field
        label="Isi Berita (pisahkan paragraf dengan baris kosong)"
        htmlFor="content"
      >
        <textarea
          id="content"
          required
          rows={10}
          value={form.content}
          onChange={(e) => update("content", e.target.value)}
          className={inputClass}
        />
      </Field>

      {error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer rounded-full bg-[var(--color-dark-green)] px-6 py-3 text-sm font-semibold text-[var(--color-beige)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Menyimpan..." : "Simpan Berita"}
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
