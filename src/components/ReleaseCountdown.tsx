"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SakuraDecor from "@/components/SakuraDecor";
import type { ReleaseCountdownSettings } from "@/lib/types";

type Props = {
  settings?: ReleaseCountdownSettings;
  serverTime: number;
  children: React.ReactNode;
};

type Phase = "locked" | "revealing" | "open";

const UNITS = [
  { key: "days", label: "Hari" },
  { key: "hours", label: "Jam" },
  { key: "minutes", label: "Menit" },
  { key: "seconds", label: "Detik" },
] as const;

const POSES = [
  "/images/maskot/gaya-1.png",
  "/images/maskot/gaya-2.png",
  "/images/maskot/gaya-3.png",
  "/images/maskot/gaya-4.png",
  "/images/maskot/gaya-5.png",
  "/images/maskot/gaya-6.png",
];

const POSE_INTERVAL_MS = 2800;
// Perayaan (maskot melompat, sunburst ganda, kilauan, confetti) ditahan
// penuh dulu selama CELEBRATE_MS, baru tirai mulai dibuka selama WIPE_MS --
// dipisah jadi dua tahap supaya intensitasnya terasa lebih lama dan megah,
// bukan numpuk semua animasi dalam satu momen singkat.
const CELEBRATE_MS = 3000;
const WIPE_MS = 1600;
const REVEAL_DURATION_MS = CELEBRATE_MS + WIPE_MS;
// Pose yang "menyambut" (melambai) -- dipakai saat tirai terbuka, alih-alih
// pose apa pun yang sedang tampil ketika waktu rilis tercapai.
const HERO_POSE_INDEX = 0;

// Maskot berayun sampai sekitar tanda 48% pada keyframe mascot-hero-pop
// (lihat globals.css), lalu di titik itu "berubah" jadi roket yang melayang
// diam berkilau sampai ~80% -- baru sesudahnya benar-benar lepas landas.
// Ditukar saat wrapper sedang tenang (bukan di tengah lonjakan) dan dikasih
// jeda tahan yang panjang, supaya perubahannya benar-benar sempat terlihat.
const ROCKET_SRC = "/images/maskot/roket.png";
const LIFTOFF_SWAP_MS = Math.round(CELEBRATE_MS * 0.5);

const SPARKLE_COUNT = 14;
const SPARKLE_RADIUS_PX = 150;
const SPARKLES = Array.from({ length: SPARKLE_COUNT }, (_, i) => {
  const angle = (i / SPARKLE_COUNT) * Math.PI * 2;
  const radius = SPARKLE_RADIUS_PX * (i % 2 === 0 ? 1 : 0.7);
  return {
    sx: Math.round(Math.cos(angle) * radius),
    sy: Math.round(Math.sin(angle) * radius),
    delay: (i % 5) * 90,
    size: i % 3 === 0 ? "h-3 w-3" : "h-2 w-2",
    color: i % 2 === 0 ? "var(--color-beige)" : "var(--color-rosy-brown)",
  };
});

const CONFETTI = [
  { left: "6%", size: 20, delay: 0, duration: 2800, rotate: "220deg" },
  { left: "16%", size: 15, delay: 260, duration: 2400, rotate: "-160deg" },
  { left: "28%", size: 24, delay: 90, duration: 3000, rotate: "180deg" },
  { left: "40%", size: 14, delay: 420, duration: 2500, rotate: "-200deg" },
  { left: "54%", size: 22, delay: 150, duration: 2900, rotate: "150deg" },
  { left: "66%", size: 16, delay: 320, duration: 2600, rotate: "-190deg" },
  { left: "78%", size: 24, delay: 60, duration: 3100, rotate: "170deg" },
  { left: "90%", size: 15, delay: 380, duration: 2500, rotate: "-150deg" },
  { left: "48%", size: 18, delay: 500, duration: 2700, rotate: "200deg" },
];

function getRemaining(targetMs: number, nowMs: number) {
  const totalSeconds = Math.floor(Math.max(0, targetMs - nowMs) / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/**
 * Gerbang seluruh situs: dipasang di root layout, membungkus Navbar/main/Footer.
 * Selama waktu rilis (diatur admin di Pengaturan) belum tercapai, pengunjung
 * hanya melihat layar countdown ini menutupi situs asli -- cocok ditampilkan
 * langsung saat prosesi penyerahan ke perangkat desa. Situs asli tetap
 * dirender di baliknya (bukan baru dipasang belakangan) supaya begitu waktu
 * rilis tercapai, tirai countdown bisa "dibuka" dengan animasi alih-alih
 * berpindah mendadak. Rute /admin selalu dilewatkan supaya panel admin tetap
 * bisa diakses untuk mengatur/menonaktifkan countdown ini.
 */
export default function ReleaseCountdown({ settings, serverTime, children }: Props) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  const targetMs =
    settings?.enabled && settings.releaseAt ? new Date(settings.releaseAt).getTime() : NaN;
  const hasValidTarget = !Number.isNaN(targetMs);
  const startsLocked = hasValidTarget && serverTime < targetMs;

  const [now, setNow] = useState(serverTime);
  // Tetap true dari saat terkunci sampai animasi pembukaan tirai selesai;
  // "revealing" di bawah ini murni diturunkan dari nilai ini + waktu, bukan
  // disimpan sebagai state terpisah, supaya tidak perlu setState di dalam
  // effect hanya untuk menandai momen waktu terlampaui.
  const [awaitingReveal, setAwaitingReveal] = useState(startsLocked);
  const [poseIndex, setPoseIndex] = useState(0);
  const [showRocket, setShowRocket] = useState(false);

  const isRevealing = awaitingReveal && hasValidTarget && now >= targetMs;
  const isLocked = awaitingReveal && !isRevealing;
  const phase: Phase = isLocked ? "locked" : isRevealing ? "revealing" : "open";

  useEffect(() => {
    if (!isLocked) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [isLocked]);

  useEffect(() => {
    if (!isRevealing) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = setTimeout(() => setAwaitingReveal(false), reduceMotion ? 0 : REVEAL_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [isRevealing]);

  useEffect(() => {
    // isRevealing hanya beralih locked -> revealing sekali per pemuatan
    // halaman (tidak pernah kembali lagi), jadi showRocket tidak perlu
    // direset -- nilai awal false sudah benar untuk kondisi terkunci.
    if (!isRevealing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timeout = setTimeout(() => setShowRocket(true), LIFTOFF_SWAP_MS);
    return () => clearTimeout(timeout);
  }, [isRevealing]);

  useEffect(() => {
    if (phase === "open" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setPoseIndex((i) => (i + 1) % POSES.length), POSE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [phase]);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  const remaining = hasValidTarget
    ? getRemaining(targetMs, now)
    : { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return (
    <>
      {children}
      {phase !== "open" && (
        <div
          className={`fixed inset-0 z-[100] ${isRevealing ? "countdown-iris-out" : ""}`}
          style={isRevealing ? ({ "--wipe-delay": `${CELEBRATE_MS}ms` } as React.CSSProperties) : undefined}
        >
          <div className="batik-motif batik-motif-invert relative flex h-full flex-col items-center justify-center overflow-hidden bg-[var(--color-dark-green)] px-4 py-16 text-center">
            <div
              className="aurora-blob aurora-rosy h-80 w-80 sm:h-[30rem] sm:w-[30rem]"
              style={{ top: "-6rem", left: "-8rem" }}
            />
            <div
              className="aurora-blob aurora-teal h-80 w-80 sm:h-[30rem] sm:w-[30rem]"
              style={{ bottom: "-8rem", right: "-8rem", animationDelay: "-8s" }}
            />

            {isRevealing && (
              <>
                <div
                  aria-hidden="true"
                  className="countdown-flash pointer-events-none absolute h-52 w-52 rounded-full bg-[var(--color-rosy-brown)] blur-3xl"
                  style={{ top: "50%", left: "50%", marginTop: "-6.5rem", marginLeft: "-6.5rem" }}
                />
                {CONFETTI.map((c, i) => (
                  <SakuraDecor
                    key={i}
                    className="confetti-fall pointer-events-none absolute -top-[10%]"
                    style={
                      {
                        left: c.left,
                        width: `${c.size}px`,
                        height: `${c.size}px`,
                        "--cr": c.rotate,
                        "--cdur": `${c.duration}ms`,
                        "--cdelay": `${c.delay}ms`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </>
            )}

            <div className="relative">
              <div
                className={`relative mx-auto transition-[height,width] duration-300 ${
                  isRevealing ? "h-48 w-48 sm:h-64 sm:w-64" : "h-40 w-40 sm:h-52 sm:w-52"
                }`}
              >
                {isRevealing && (
                  <>
                    <div aria-hidden="true" className="hero-sunburst absolute inset-[-45%]" />
                    <div aria-hidden="true" className="hero-sunburst-secondary absolute inset-[-60%]" />
                    {SPARKLES.map((s, i) => (
                      <div
                        key={i}
                        aria-hidden="true"
                        className={`sparkle-burst absolute top-1/2 left-1/2 -mt-1.5 -ml-1.5 ${s.size}`}
                        style={
                          {
                            background: s.color,
                            "--sx": `${s.sx}px`,
                            "--sy": `${s.sy}px`,
                            "--sd": `${s.delay}ms`,
                          } as React.CSSProperties
                        }
                      />
                    ))}
                  </>
                )}

                <div
                  className={`relative h-full w-full ${isRevealing ? "mascot-hero-pop" : "mascot-float"}`}
                  style={
                    isRevealing ? ({ "--hero-pop-duration": `${CELEBRATE_MS}ms` } as React.CSSProperties) : undefined
                  }
                >
                  {POSES.map((src, i) => {
                    const active = !showRocket && i === (isRevealing ? HERO_POSE_INDEX : poseIndex);
                    return (
                      <div
                        key={src}
                        aria-hidden={!active}
                        className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                        style={{ opacity: active ? 1 : 0 }}
                      >
                        <Image
                          src={src}
                          alt={i === 0 ? "Maskot KKN Merawi Pangeran 2026" : ""}
                          fill
                          sizes="256px"
                          priority={i === 0}
                          className="object-contain drop-shadow-[0_16px_24px_rgba(10,51,35,0.5)]"
                        />
                      </div>
                    );
                  })}
                  {isRevealing && (
                    <div
                      aria-hidden={!showRocket}
                      className="absolute inset-0 transition-opacity duration-500 ease-in-out"
                      style={{ opacity: showRocket ? 1 : 0 }}
                    >
                      <Image
                        src={ROCKET_SRC}
                        alt=""
                        fill
                        sizes="256px"
                        className="object-contain drop-shadow-[0_16px_24px_rgba(10,51,35,0.5)]"
                      />
                    </div>
                  )}
                </div>
              </div>

              <span className="mt-6 block text-xs font-semibold tracking-[0.3em] text-[var(--color-rosy-brown)] uppercase">
                Segera Hadir
              </span>

              {isRevealing ? (
                <h1 className="countdown-message-in text-shimmer font-display mx-auto mt-4 max-w-xl text-3xl sm:text-5xl">
                  Website Resmi Rilis!
                </h1>
              ) : (
                <>
                  <h1 className="font-display mx-auto mt-4 max-w-2xl text-3xl text-[var(--color-beige)] sm:text-5xl">
                    {settings?.title || "Website Merawi Pangeran akan segera rilis"}
                  </h1>
                  <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-beige)]/80 sm:text-base">
                    {settings?.message ||
                      "Nantikan peluncuran resmi situs ini pada prosesi penyerahan program kerja kepada perangkat desa."}
                  </p>

                  <div className="mt-10 grid grid-cols-4 gap-3 sm:gap-6">
                    {UNITS.map((unit) => (
                      <div
                        key={unit.key}
                        className="glass-card-dark flex flex-col items-center justify-center rounded-2xl px-3 py-4 sm:px-6 sm:py-6"
                      >
                        <span
                          className="font-display text-3xl text-[var(--color-beige)] tabular-nums sm:text-5xl"
                          suppressHydrationWarning
                        >
                          {String(remaining[unit.key]).padStart(2, "0")}
                        </span>
                        <span className="mt-1 text-[10px] font-medium tracking-[0.2em] text-[var(--color-beige)]/70 uppercase sm:text-xs">
                          {unit.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
