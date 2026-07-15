"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Gagal masuk. Silakan coba lagi.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-16">
      <Image
        src="/images/logo.png"
        alt="Logo KKN Merawi Pangeran 2026"
        width={64}
        height={64}
        className="h-16 w-16"
      />
      <h1 className="font-display mt-4 text-2xl text-[var(--color-dark-green)]">
        Masuk Admin
      </h1>
      <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
        Khusus tim pengelola konten KKN Merawi Pangeran.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 w-full space-y-4">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[var(--color-dark-green)]"
          >
            Kata Sandi
          </label>
          <div className="relative mt-1">
            <Lock
              size={18}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--color-muted-foreground)]"
            />
            <input
              id="password"
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pr-4 pl-10 text-sm focus:border-[var(--color-midnight-teal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
              placeholder="Masukkan kata sandi"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-full bg-[var(--color-dark-green)] py-3 text-sm font-semibold text-[var(--color-beige)] transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}
