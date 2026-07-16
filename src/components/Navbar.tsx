"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/nav-links";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-beige)]/95 backdrop-blur transition-shadow duration-300 supports-[backdrop-filter]:bg-[var(--color-beige)]/80 ${
        scrolled ? "nav-scrolled" : ""
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/logo.png"
            alt="Logo KKN Merawi Pangeran 2026"
            width={48}
            height={48}
            className="h-11 w-11 shrink-0 sm:h-12 sm:w-12"
            priority
          />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg text-[var(--color-dark-green)] sm:text-xl">
              Merawi Pangeran
            </span>
            <span className="text-[11px] font-medium tracking-wide text-[var(--color-midnight-teal)] uppercase">
              KKN-PPM UGM Periode II 2026
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] ${
                  active
                    ? "bg-[var(--color-dark-green)] text-[var(--color-beige)]"
                    : "text-[var(--color-dark-green)] hover:bg-[var(--color-muted)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-dark-green)] hover:bg-[var(--color-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] lg:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-[var(--color-border)] bg-[var(--color-beige)]/80 px-4 pb-4 backdrop-blur-xl lg:hidden">
          <ul className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-4 py-3 text-base font-medium ${
                      active
                        ? "bg-[var(--color-dark-green)] text-[var(--color-beige)]"
                        : "text-[var(--color-dark-green)] hover:bg-[var(--color-muted)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
