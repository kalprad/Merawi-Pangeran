"use client";

import { CalendarDays, Flag } from "lucide-react";
import { useEffect, useState } from "react";
import SakuraDecor from "@/components/SakuraDecor";

const START_AT = "2026-06-20T00:00";
const END_AT = "2026-08-08T00:00";
const START_LABEL = "20 Juni 2026";
const END_LABEL = "8 Agustus 2026";

const UNITS = [
  { key: "days", label: "Hari" },
  { key: "hours", label: "Jam" },
  { key: "minutes", label: "Menit" },
  { key: "seconds", label: "Detik" },
] as const;

// Tanggal diisi tanpa info zona waktu, jadi offset WIB (UTC+7) disematkan
// eksplisit supaya hasilnya sama persis saat dirender di server maupun
// browser pengunjung -- lihat penjelasan serupa di ReleaseCountdown.tsx.
function parseWibDatetime(value: string): number {
  return new Date(`${value}:00+07:00`).getTime();
}

function getRemaining(targetMs: number, nowMs: number) {
  const totalSeconds = Math.floor(Math.max(0, targetMs - nowMs) / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const START_MS = parseWibDatetime(START_AT);
const END_MS = parseWibDatetime(END_AT);

export default function PengabdianCountdown({ serverTime }: { serverTime: number }) {
  const [now, setNow] = useState(serverTime);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const phase = now < START_MS ? "before" : now < END_MS ? "during" : "after";
  const targetMs = phase === "before" ? START_MS : END_MS;
  const remaining = getRemaining(targetMs, now);
  const progressPercent =
    phase === "after" ? 100 : Math.min(100, Math.max(0, ((now - START_MS) / (END_MS - START_MS)) * 100));

  return (
    <>
      {/* Dibungkus div supaya jadi cucu, bukan anak langsung, dari .batik-motif --
          selektor ".batik-motif > *" memaksa position:relative pada anak langsung
          dan akan menimpa "absolute" di sini kalau SVG-nya dipasang langsung. */}
      <div>
        <SakuraDecor className="absolute -top-4 -left-4 h-16 w-16 opacity-15 sm:h-20 sm:w-20" />
        <SakuraDecor className="absolute -right-4 -bottom-4 h-20 w-20 opacity-15 sm:h-24 sm:w-24" />
      </div>

      <p className="text-xs font-semibold tracking-[0.3em] text-[var(--color-rosy-brown)] uppercase">
        Masa Pengabdian
      </p>
      <h2 className="font-display mx-auto mt-3 max-w-2xl text-3xl text-[var(--color-beige)] sm:text-4xl">
        KKN Merawi Pangeran 2026
      </h2>

      <div className="mx-auto mt-6 flex max-w-md flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[var(--color-beige)]/85">
        <span className="flex items-center gap-2">
          <CalendarDays size={16} className="shrink-0 text-[var(--color-rosy-brown)]" aria-hidden="true" />
          Mulai:{" "}
          <span className="font-semibold text-[var(--color-beige)]">{START_LABEL}</span>
        </span>
        <span className="flex items-center gap-2">
          <Flag size={16} className="shrink-0 text-[var(--color-rosy-brown)]" aria-hidden="true" />
          Penarikan:{" "}
          <span className="font-semibold text-[var(--color-beige)]">{END_LABEL}</span>
        </span>
      </div>

      <div className="mx-auto mt-6 max-w-md">
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-beige)]/15"
          role="progressbar"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progres masa pengabdian"
        >
          <div
            className="h-full rounded-full bg-[var(--color-rosy-brown)] transition-[width] duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <p className="mt-6 text-xs font-medium tracking-[0.15em] text-[var(--color-beige)]/70 uppercase">
        {phase === "before" && "Menuju mulai pengabdian"}
        {phase === "during" && "Menuju hari penarikan"}
        {phase === "after" && "Pengabdian telah usai — terima kasih, Desa Jetis!"}
      </p>

      {phase !== "after" && (
        <div className="mx-auto mt-4 grid max-w-md grid-cols-4 gap-3">
          {UNITS.map((unit) => (
            <div
              key={unit.key}
              className="glass-card-dark flex flex-col items-center justify-center rounded-2xl px-2 py-4"
            >
              <span
                className="font-display text-2xl text-[var(--color-beige)] tabular-nums sm:text-3xl"
                suppressHydrationWarning
              >
                {String(remaining[unit.key]).padStart(2, "0")}
              </span>
              <span className="mt-1 text-[9px] font-medium tracking-[0.15em] text-[var(--color-beige)]/70 uppercase sm:text-[10px]">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
