"use client";

import { useEffect, useRef, useState } from "react";
import Mascot from "@/components/Mascot";

const BUBBLES = [
  "Halo! Kenalkan, aku Lumi, maskot resmi KKN Merawi Pangeran Bandungan! 👋✨",
  "Namaku diambil dari kata lumen yang artinya cahaya. Aku hadir di sini untuk membawa harapan, ilmu, dan semangat pengabdian buat desa kita. 🌲☀️",
  "Layaknya fajar pertama di lereng Gunung Ungaran, aku ingin membawa energi baru, menerangi lewat edukasi, dan menemani perjalanan pembangunan desa dalam kebersamaan.",
  "Dengan karakterku yang hijau, ramah, dan mencintai budaya Gedong Songo, aku siap jadi sahabat warga Bandungan untuk belajar dan bertumbuh bareng. 💚",
  "Di setiap langkah, aku punya 4 misi utama:\nLestari menjaga alam,\nUnggul memberi manfaat,\nMengabdi untuk masyarakat, dan\nInspiratif menjadi sumber semangat! 🎯",
  'Yuk, bareng-bareng kita wujudkan slogan kita: "Lumi: Cahaya Kecil, Dampak Besar!" Sampai ketemu di program-program seru nanti, ya! 🚀',
];

// Kira-kira waktu baca: dasar + per karakter, dibatasi min/maks supaya
// gelembung pendek tidak berkedip terlalu cepat dan yang panjang tidak
// menahan pengunjung terlalu lama kalau mereka tidak menekan apa pun.
const BASE_MS = 1800;
const MS_PER_CHAR = 45;
const MAX_MS = 9000;

function readDuration(text: string) {
  return Math.min(MAX_MS, BASE_MS + text.length * MS_PER_CHAR);
}

export default function MascotIntro({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    if (reducedMotionRef.current) return;
    timerRef.current = setTimeout(advance, readDuration(BUBBLES[index]));
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index]);

  // Maju ke gelembung berikutnya, lalu kembali lagi ke gelembung pertama
  // setelah yang terakhir — perkenalan ini mengulang terus, bukan berhenti.
  function advance() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIndex((i) => (i + 1) % BUBBLES.length);
  }

  function skipToEnd() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIndex(BUBBLES.length - 1);
  }

  const isLast = index === BUBBLES.length - 1;
  const bubbleBg =
    "linear-gradient(160deg, rgba(255,255,255,0.75), rgba(131,153,88,0.22))";

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className="relative z-0 -mb-5 w-full max-w-xs sm:max-w-sm"
        role="group"
        aria-label="Perkenalan maskot Lumi"
      >
        {/* Region tersembunyi khusus pembaca layar — teks gelembung yang
            aktif diumumkan di sini, terpisah dari tumpukan visual di bawah
            (yang memakai trik grid-overlap supaya kotaknya tidak berubah
            ukuran setiap gelembung berganti). */}
        <span aria-live="polite" className="sr-only">
          {BUBBLES[index]}
        </span>

        <div
          className="relative rounded-[2rem] border border-white/55 shadow-[0_8px_32px_rgba(10,51,35,0.14),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl backdrop-saturate-150"
          style={{ background: bubbleBg }}
        >
          <button
            type="button"
            onClick={advance}
            aria-label={isLast ? "Ketuk untuk mulai lagi dari awal" : "Ketuk untuk lanjut ke pesan berikutnya dari Lumi"}
            className="grid w-full cursor-pointer place-items-stretch rounded-[2rem] px-5 pt-4 pb-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
          >
            {/* Tumpukan semua gelembung di sel grid yang sama — ukuran kotak
                otomatis mengikuti konten terbesar (teks misi di gelembung 5),
                jadi tidak "meloncat" tiap kali pesan berganti. Disembunyikan
                dari pembaca layar karena isinya sudah diumumkan lewat region
                sr-only di atas, supaya tidak dibaca dua kali. */}
            <span aria-hidden="true" className="col-start-1 row-start-1 grid">
              {BUBBLES.map((text, i) => (
                <span
                  key={i}
                  className={`col-start-1 row-start-1 flex items-center justify-center py-1 text-center text-sm leading-relaxed whitespace-pre-line text-[var(--color-dark-green)] transition-opacity duration-300 ${
                    i === index ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                >
                  {text}
                </span>
              ))}
            </span>
            <span aria-hidden="true" className="col-start-1 row-start-2 mt-2 flex items-center justify-between gap-3">
              <span className="flex gap-1.5">
                {BUBBLES.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === index
                        ? "w-4 bg-[var(--color-midnight-teal)]"
                        : i < index
                          ? "w-1.5 bg-[var(--color-midnight-teal)]/50"
                          : "w-1.5 bg-white/60"
                    }`}
                  />
                ))}
              </span>
              <span className="text-[11px] font-medium whitespace-nowrap text-[var(--color-muted-foreground)]">
                {isLast ? "Ketuk untuk mulai lagi" : "Ketuk untuk lanjut"}
              </span>
            </span>
          </button>
          {!isLast && (
            <button
              type="button"
              onClick={skipToEnd}
              className="absolute top-2 right-2 rounded-full px-2 py-1 text-[11px] font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-dark-green)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
            >
              Lewati
            </button>
          )}
          {/* Ekor gelembung — menyatu langsung ke ujung daun di puncak
              kepala Lumi, bukan melayang terpisah dengan jarak. */}
          <span
            aria-hidden="true"
            className="absolute -bottom-2 left-1/2 h-5 w-5 -translate-x-1/2 rotate-45 rounded-br-md border-r border-b border-white/55"
            style={{ background: bubbleBg }}
          />
        </div>
      </div>
      <Mascot className="relative z-10 h-64 w-64 sm:h-80 sm:w-80" />
    </div>
  );
}
