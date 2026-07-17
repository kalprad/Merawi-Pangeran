"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ListChecks, ChevronLeft, ChevronRight, Users, User } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { Division } from "@/lib/types";

// Gradien kaca berwarna untuk tiap kartu anggota, bergantian per posisi
// supaya daftar anggota terasa lebih hidup (bukan cuma satu warna flat).
const MEMBER_CARD_GRADIENTS = [
  "linear-gradient(160deg, rgba(255,255,255,0.72), rgba(131,153,88,0.24))",
  "linear-gradient(160deg, rgba(255,255,255,0.72), rgba(211,150,140,0.24))",
  "linear-gradient(160deg, rgba(255,255,255,0.72), rgba(16,86,102,0.2))",
];

export default function DivisionGrid({ divisions }: { divisions: Division[] }) {
  const [active, setActive] = useState<Division | null>(null);

  useEffect(() => {
    if (!active) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  return (
    <>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {divisions.map((div, i) => {
          const totalPrograms = div.members.reduce((n, m) => n + m.programs.length, 0);
          return (
            <Reveal key={div.title} delay={i * 90}>
              <button
                type="button"
                onClick={() => setActive(div)}
                className="glass-card group flex w-full flex-col items-center rounded-3xl p-6 text-center transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
              >
                <div className="relative h-28 w-28 sm:h-32 sm:w-32">
                  <Image
                    src={div.image}
                    alt={div.imageAlt}
                    fill
                    sizes="128px"
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-display mt-3 text-lg text-[var(--color-dark-green)]">
                  {div.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                  {div.description}
                </p>
                <span className="mt-3 text-[11px] text-[var(--color-muted-foreground)]">
                  {div.members.length} anggota &middot; {totalPrograms} program kerja
                </span>
                <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-[var(--color-midnight-teal)]">
                  <ListChecks size={12} />
                  Lihat program kerja
                </span>
              </button>
            </Reveal>
          );
        })}
      </div>

      {active &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            {/* Key di judul klaster supaya state halaman (page) mulai dari 0
                lagi setiap kali klaster yang dibuka berganti. */}
            <DivisionModal
              key={active.title}
              division={active}
              onClose={() => setActive(null)}
            />
          </div>,
          document.body,
        )}
    </>
  );
}

function DivisionModal({
  division,
  onClose,
}: {
  division: Division;
  onClose: () => void;
}) {
  const [page, setPage] = useState(0);

  // Halaman pertama berisi daftar seluruh anggota klaster ini, lalu satu
  // halaman per anggota untuk menampilkan program kerja mereka.
  const memberCount = division.members.length;
  const totalPages = memberCount + 1;
  const isRosterPage = page === 0;
  const activeMember = !isRosterPage ? division.members[page - 1] : null;

  function goTo(next: number) {
    setPage(Math.min(Math.max(next, 0), totalPages - 1));
  }

  return (
    <div
      className="glass-card relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-[var(--color-surface)] p-6 sm:p-8"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup"
        className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--color-dark-green)] hover:bg-[var(--color-muted)]"
      >
        <X size={20} />
      </button>

      <div className="flex flex-col items-center text-center">
        <div className="relative h-28 w-28 shrink-0">
          <Image
            src={division.image}
            alt={division.imageAlt}
            fill
            sizes="112px"
            className="object-contain"
          />
        </div>
        <h3 className="font-display mt-3 text-xl text-[var(--color-dark-green)]">
          {division.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
          {division.description}
        </p>
      </div>

      <div className="mt-5 flex-1 overflow-y-auto border-t border-[var(--color-border)] pt-5">
        {!isRosterPage && activeMember ? (
          <>
            <h4 className="text-xs font-semibold tracking-wide text-[var(--color-midnight-teal)] uppercase">
              Program Kerja &mdash; {activeMember.name}
            </h4>
            <ol className="mt-3 space-y-2.5">
              {activeMember.programs.map((program, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm leading-relaxed text-[var(--color-foreground)]"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-muted)] text-[11px] font-semibold text-[var(--color-dark-green)]">
                    {i + 1}
                  </span>
                  {program}
                </li>
              ))}
            </ol>
          </>
        ) : (
          <>
            <h4 className="text-xs font-semibold tracking-wide text-[var(--color-midnight-teal)] uppercase">
              Anggota Klaster {division.title}
            </h4>
            <ul className="mt-3 grid grid-cols-2 gap-3">
              {division.members.map((member, i) => (
                <li key={member.name} className="flex">
                  <button
                    type="button"
                    onClick={() => goTo(i + 1)}
                    style={{
                      background: MEMBER_CARD_GRADIENTS[i % MEMBER_CARD_GRADIENTS.length],
                    }}
                    className="flex w-full flex-col items-center gap-1.5 rounded-2xl border border-white/55 px-3 py-4 text-center text-sm shadow-[0_4px_18px_rgba(10,51,35,0.10),inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(10,51,35,0.16),inset_0_1px_0_rgba(255,255,255,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[var(--color-surface)] ring-2 ring-white/70">
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                          unoptimized={member.photo.startsWith("http")}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[var(--color-muted-foreground)]">
                          <User size={20} />
                        </div>
                      )}
                    </div>
                    <p className="line-clamp-2 font-medium text-[var(--color-dark-green)]">
                      {member.name}
                    </p>
                    <p className="text-xs whitespace-nowrap text-[var(--color-muted-foreground)]">
                      {member.programs.length} program kerja
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="mt-5 border-t border-[var(--color-border)] pt-4">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            aria-label="Halaman sebelumnya"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--color-dark-green)] hover:bg-[var(--color-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex min-w-0 flex-col items-center gap-0.5 px-2">
            <span className="max-w-full truncate text-xs font-semibold text-[var(--color-dark-green)]">
              {isRosterPage ? "Daftar Anggota" : activeMember?.name}
            </span>
            <span className="text-[11px] text-[var(--color-muted-foreground)]">
              Halaman {page + 1} dari {totalPages}
            </span>
          </div>

          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages - 1}
            aria-label="Halaman berikutnya"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--color-dark-green)] hover:bg-[var(--color-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {!isRosterPage && (
          <button
            type="button"
            onClick={() => goTo(0)}
            className="mx-auto mt-3 flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-full bg-[var(--color-muted)] px-4 py-2 text-xs font-medium text-[var(--color-midnight-teal)] transition-colors duration-200 hover:bg-[var(--color-border)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
          >
            <Users size={14} />
            Lihat semua anggota
          </button>
        )}
      </div>
    </div>
  );
}
