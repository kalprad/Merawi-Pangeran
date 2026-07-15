import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail } from "lucide-react";
import InstagramIcon from "./InstagramIcon";
import { navLinks } from "@/lib/nav-links";

export default function Footer() {
  return (
    <footer className="batik-motif batik-motif-invert relative mt-24 overflow-hidden bg-[var(--color-dark-green)] text-[var(--color-beige)]">
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="absolute -top-px left-0 h-12 w-full text-[var(--color-beige)]"
      >
        <path
          d="M0,32 C240,64 480,0 720,16 C960,32 1200,60 1440,24 L1440,0 L0,0 Z"
          fill="currentColor"
        />
      </svg>

      <div className="mx-auto max-w-7xl px-4 pt-20 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Logo KKN Merawi Pangeran 2026"
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <span className="font-display text-xl">Merawi Pangeran 2026</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-beige)]/80">
              Portal informasi Kuliah Kerja Nyata &ldquo;Merawi Pangeran&rdquo; 2026 di
              Desa Jetis, Kecamatan Bandungan, Kabupaten Semarang. Merawat desa
              lewat data, sosialisasi, dan teknologi.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-[var(--color-rosy-brown)] uppercase">
              Jelajahi
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--color-beige)]/85 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-[var(--color-rosy-brown)] uppercase">
              Kontak
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-[var(--color-beige)]/85">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-0.5 shrink-0 text-[var(--color-rosy-brown)]" />
                <span>Desa Jetis, Kecamatan Bandungan, Kabupaten Semarang, Jawa Tengah</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="shrink-0 text-[var(--color-rosy-brown)]" />
                <a href="mailto:kknmerawipangeran@gmail.com" className="hover:text-white">
                  kknmerawipangeran@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <InstagramIcon size={18} className="shrink-0 text-[var(--color-rosy-brown)]" />
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  @merawipangeran.jetis
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[var(--color-beige)]/15 pt-6 text-xs text-[var(--color-beige)]/60 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} KKN Merawi Pangeran — Desa Jetis, Bandungan.</p>
          <Link href="/admin" className="hover:text-[var(--color-beige)]">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
