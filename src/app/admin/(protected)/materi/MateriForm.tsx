"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Materi } from "@/lib/types";

type Props = {
  mode: "create" | "edit";
  initialData?: Materi;
};

export default function MateriForm({ mode, initialData }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    category: initialData?.category ?? "Umum",
    date: initialData?.date ?? new Date().toISOString().slice(0, 10),
    fileUrl: initialData?.fileUrl ?? "",
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
      mode === "create" ? "/api/admin/materi" : `/api/admin/materi/${initialData?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Gagal menyimpan materi.");
        setLoading(false);
        return;
      }
      router.push("/admin/materi");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <Field label="Judul Materi" htmlFor="title">
        <input
          id="title"
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
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

      <Field label="Deskripsi" htmlFor="description">
        <textarea
          id="description"
          required
          rows={4}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Tautan Berkas (opsional)" htmlFor="fileUrl">
        <input
          id="fileUrl"
          type="url"
          value={form.fileUrl}
          onChange={(e) => update("fileUrl", e.target.value)}
          placeholder="https://drive.google.com/..."
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
        {loading ? "Menyimpan..." : "Simpan Materi"}
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
