"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User, X, ListChecks } from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";
import Reveal from "@/components/Reveal";
import type { TeamMember } from "@/lib/types";

function instagramUrl(instagram: string) {
  return instagram.startsWith("http")
    ? instagram
    : `https://instagram.com/${instagram.replace(/^@/, "")}`;
}

export default function TeamGrid({ team }: { team: TeamMember[] }) {
  const [active, setActive] = useState<TeamMember | null>(null);

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
      <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {team.map((member, i) => (
          <Reveal key={member.id} delay={Math.min(i, 8) * 60}>
            <button
              type="button"
              onClick={() => setActive(member)}
              className="glass-card group flex w-full flex-col overflow-hidden rounded-3xl text-left transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
            >
              <div className="relative aspect-[4/5] w-full bg-[var(--color-muted)]">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized={member.photo.startsWith("http")}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[var(--color-muted-foreground)]">
                    <User size={32} />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4 text-center">
                <p className="font-medium text-[var(--color-dark-green)]">{member.name}</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">{member.role}</p>
                {member.prodi && (
                  <p className="text-[11px] text-[var(--color-muted-foreground)]/80">
                    {member.prodi}
                  </p>
                )}
                {!!member.programs?.length && (
                  <span className="mt-2 inline-flex items-center justify-center gap-1 self-center text-[11px] font-medium text-[var(--color-midnight-teal)]">
                    <ListChecks size={12} />
                    Lihat program kerja
                  </span>
                )}
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.name}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="glass-card relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-[var(--color-surface)] p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Tutup"
              className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--color-dark-green)] hover:bg-[var(--color-muted)]"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-[var(--color-muted)]">
                {active.photo ? (
                  <Image
                    src={active.photo}
                    alt={active.name}
                    fill
                    className="object-cover"
                    unoptimized={active.photo.startsWith("http")}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[var(--color-muted-foreground)]">
                    <User size={36} />
                  </div>
                )}
              </div>
              <h3 className="font-display mt-4 text-xl text-[var(--color-dark-green)]">
                {active.name}
              </h3>
              <span className="mt-1 inline-flex items-center rounded-full bg-[var(--color-dark-green)] px-3 py-1 text-xs font-semibold text-[var(--color-beige)]">
                {active.role}
              </span>
              {active.prodi && (
                <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                  {active.prodi}
                </p>
              )}
              {active.instagram && (
                <a
                  href={instagramUrl(active.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-midnight-teal)] hover:text-[var(--color-dark-green)]"
                >
                  <InstagramIcon size={14} />
                  Instagram
                </a>
              )}
            </div>

            {!!active.programs?.length && (
              <div className="mt-6 border-t border-[var(--color-border)] pt-5">
                <h4 className="text-xs font-semibold tracking-wide text-[var(--color-midnight-teal)] uppercase">
                  Program Kerja
                </h4>
                <ol className="mt-3 space-y-2.5">
                  {active.programs.map((program, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-[var(--color-foreground)]">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-muted)] text-[11px] font-semibold text-[var(--color-dark-green)]">
                        {i + 1}
                      </span>
                      {program}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
