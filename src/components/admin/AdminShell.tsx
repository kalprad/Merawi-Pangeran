"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Newspaper, BookOpen } from "lucide-react";

const tabs = [
  { href: "/admin/posts", label: "Berita", icon: Newspaper },
  { href: "/admin/materi", label: "Materi Sosialisasi", icon: BookOpen },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-midnight-teal)] uppercase">
            Panel Admin
          </p>
          <h1 className="font-display mt-1 text-2xl text-[var(--color-dark-green)]">
            Kelola Konten Situs
          </h1>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-dark-green)] hover:bg-[var(--color-muted)]"
        >
          <LogOut size={16} />
          Keluar
        </button>
      </div>

      <nav className="mt-6 flex gap-2">
        {tabs.map((tab) => {
          const active = pathname?.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                active
                  ? "bg-[var(--color-dark-green)] text-[var(--color-beige)]"
                  : "bg-[var(--color-muted)] text-[var(--color-dark-green)] hover:bg-[var(--color-border)]"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8">{children}</div>
    </div>
  );
}
