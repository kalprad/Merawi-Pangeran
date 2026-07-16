"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TutorialCategory, TutorialVideo } from "@/lib/types";

type Props = {
  mode: "create" | "edit";
  initialData?: TutorialVideo;
  defaultCategory?: TutorialCategory;
};

const categoryOptions: { value: TutorialCategory; label: string }[] = [
  { value: "jembatan", label: "Evaluasi & Desain Jembatan" },
  { value: "irigasi", label: "Saluran Irigasi" },
  { value: "talud", label: "Talud" },
  { value: "rab", label: "Perhitungan RAB" },
];

export default function TutorialForm({ mode, initialData, defaultCategory }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    category: initialData?.category ?? defaultCategory ?? "jembatan",
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    driveUrl: initialData?.driveUrl ?? "",
    order: initialData?.order ?? 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url =
      mode === "create" ? "/api/admin/tutorial" : `/api/admin/tutorial/${initialData?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Gagal menyimpan video.");
        setLoading(false);
        return;
      }
      router.push("/admin/tutorial");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <Field label="Modul / Kategori" htmlFor="category">
        <select
          id="category"
          required
          value={form.category}
          onChange={(e) => update("category", e.target.value as TutorialCategory)}
          className={inputClass}
        >
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Judul Video" htmlFor="title">
        <input
          id="title"
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Deskripsi (opsional)" htmlFor="description">
        <textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Tautan Google Drive" htmlFor="driveUrl">
        <input
          id="driveUrl"
          type="url"
          required
          value={form.driveUrl}
          onChange={(e) => update("driveUrl", e.target.value)}
          placeholder="https://drive.google.com/file/d/.../view"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
          Pastikan file dibagikan sebagai &ldquo;Siapa saja yang memiliki link&rdquo; agar video bisa
          diputar di halaman publik.
        </p>
      </Field>

      <Field label="Urutan Tampil" htmlFor="order">
        <input
          id="order"
          type="number"
          min={1}
          required
          value={form.order}
          onChange={(e) => update("order", Number(e.target.value))}
          className={inputClass}
        />
      </Field>

      {error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer rounded-full bg-[var(--color-dark-green)] px-6 py-3 text-sm font-semibold text-[var(--color-beige)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Menyimpan..." : "Simpan Video"}
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
