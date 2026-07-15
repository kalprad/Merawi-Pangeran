"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { compressImage } from "@/lib/compressImage";
import type { TeamMember } from "@/lib/types";

type Props = {
  mode: "create" | "edit";
  initialData?: TeamMember;
};

export default function TeamForm({ mode, initialData }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
  const [role, setRole] = useState(initialData?.role ?? "");
  const [prodi, setProdi] = useState(initialData?.prodi ?? "");
  const [instagram, setInstagram] = useState(initialData?.instagram ?? "");
  const [programs, setPrograms] = useState<string[]>(() => {
    const initial = initialData?.programs ?? [];
    return Array.from({ length: 5 }, (_, i) => initial[i] ?? "");
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.photo ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhotoFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    let photo = initialData?.photo ?? "";

    if (photoFile) {
      setUploading(true);
      try {
        const compressed = await compressImage(photoFile);
        const uploadForm = new FormData();
        uploadForm.append("file", compressed);
        uploadForm.append("folder", "Tentang Kami");
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
        photo = uploadData.url;
      } catch {
        setError("Terjadi kesalahan jaringan saat mengunggah foto.");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    setLoading(true);
    const url =
      mode === "create" ? "/api/admin/team" : `/api/admin/team/${initialData?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          prodi,
          photo,
          instagram,
          programs: programs.map((p) => p.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Gagal menyimpan anggota.");
        setLoading(false);
        return;
      }
      router.push("/admin/tim");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[var(--color-dark-green)]">
          Nama
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-[var(--color-dark-green)]">
          Jabatan / Divisi
        </label>
        <input
          id="role"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="contoh: Koordinator Divisi Infrastruktur"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="prodi" className="block text-sm font-medium text-[var(--color-dark-green)]">
          Jurusan / Program Studi (opsional)
        </label>
        <input
          id="prodi"
          value={prodi}
          onChange={(e) => setProdi(e.target.value)}
          placeholder="contoh: Teknik Sipil"
          className={inputClass}
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-[var(--color-dark-green)]">
          Program Kerja (opsional, tampil saat anggota diklik di halaman Tentang Kami)
        </span>
        <div className="mt-1 space-y-2">
          {programs.map((program, i) => (
            <input
              key={i}
              value={program}
              onChange={(e) => {
                const next = [...programs];
                next[i] = e.target.value;
                setPrograms(next);
              }}
              placeholder={`Program kerja ${i + 1}`}
              className={inputClass}
            />
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="instagram" className="block text-sm font-medium text-[var(--color-dark-green)]">
          Instagram (opsional)
        </label>
        <input
          id="instagram"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          placeholder="https://instagram.com/username atau @username"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="photo" className="block text-sm font-medium text-[var(--color-dark-green)]">
          Foto (sebaiknya persegi panjang/potret, foto besar otomatis dikecilkan)
        </label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={`${inputClass} mt-1 cursor-pointer file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-[var(--color-dark-green)] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[var(--color-beige)]`}
        />
        {previewUrl && (
          <div className="relative mt-3 h-40 w-32 overflow-hidden rounded-2xl border border-[var(--color-border)]">
            <Image src={previewUrl} alt="Pratinjau foto" fill className="object-cover" unoptimized />
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || uploading}
        className="cursor-pointer rounded-full bg-[var(--color-dark-green)] px-6 py-3 text-sm font-semibold text-[var(--color-beige)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uploading ? "Mengunggah foto..." : loading ? "Menyimpan..." : "Simpan Anggota"}
      </button>
    </form>
  );
}

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:border-[var(--color-midnight-teal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]";
