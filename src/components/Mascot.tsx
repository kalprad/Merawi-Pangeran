"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Posisi & ukuran mata (persen dari kotak gambar 1:1) diukur langsung dari
// piksel /public/images/mascot.png supaya overlay pas menutup kilau mata asli
// dan menggambar kilau baru yang bisa bergerak mengikuti kursor.
const EYES = [
  { xPct: 48.97, yPct: 41.49 }, // mata kiri (dari sudut pandang pengunjung)
  { xPct: 65.39, yPct: 40.89 }, // mata kanan
] as const;

// % dari lebar kontainer (bukan dari elemen kilau/maskot itu sendiri, makanya
// dihitung ke piksel dulu di bawah — translate() memakai ukuran elemen
// itu sendiri sebagai acuan persen, bukan ukuran parent).
const MAX_GAZE_OFFSET_PCT = 1.1;
const MAX_PARALLAX_OFFSET_PCT = 4;

export default function Mascot({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gazePx, setGazePx] = useState({ x: 0, y: 0 });
  const [parallaxPx, setParallaxPx] = useState({ x: 0, y: 0 });
  const [reacting, setReacting] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    function onPointerMove(e: PointerEvent) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy) || 1;
        // Jarak dijinakkan (softened) supaya gerakannya tetap halus walau kursor jauh sekali.
        const softened = Math.min(dist / 500, 1);
        const nx = dx / dist;
        const ny = dy / dist;
        const gazeMaxPx = (rect.width * MAX_GAZE_OFFSET_PCT) / 100;
        const parallaxMaxPx = (rect.width * MAX_PARALLAX_OFFSET_PCT) / 100;
        setGazePx({ x: nx * softened * gazeMaxPx, y: ny * softened * gazeMaxPx });
        setParallaxPx({ x: nx * softened * parallaxMaxPx, y: ny * softened * parallaxMaxPx });
      });
    }

    window.addEventListener("pointermove", onPointerMove);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Lapisan parallax — mengikuti arah kursor, terpisah dari animasi float/wiggle
          di bawah supaya transform-nya tidak saling menimpa (satu elemen hanya bisa
          punya satu nilai transform yang "menang"). */}
      <div
        className="relative h-full w-full transition-transform duration-200 ease-out"
        style={{ transform: `translate(${parallaxPx.x}px, ${parallaxPx.y}px)` }}
      >
        {/* Lapisan floating — animasi naik-turun terus-menerus */}
        <div className="mascot-float relative h-full w-full">
          <div
            onClick={() => setReacting(true)}
            onAnimationEnd={() => setReacting(false)}
            className={`relative h-full w-full cursor-pointer ${reacting ? "mascot-wiggle" : ""}`}
          >
            <Image
              src="/images/mascot.png"
              alt="Maskot KKN Merawi Pangeran 2026"
              fill
              sizes="(min-width: 640px) 384px, 288px"
              draggable={false}
              className={`pointer-events-none object-contain select-none transition-opacity duration-150 ${
                reacting ? "opacity-0" : "opacity-100"
              }`}
            />
            <Image
              src="/images/mascot-ticklish.png"
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 640px) 384px, 288px"
              draggable={false}
              className={`pointer-events-none object-contain select-none transition-opacity duration-150 ${
                reacting ? "opacity-100" : "opacity-0"
              }`}
            />
            {!reacting &&
              EYES.map((eye, i) => (
                <div key={i}>
                  {/* Menutup kilau mata asli yang statis di gambar */}
                  <div
                    className="pointer-events-none absolute rounded-full"
                    style={{
                      left: `${eye.xPct}%`,
                      top: `${eye.yPct}%`,
                      width: "2.6%",
                      height: "2.6%",
                      transform: "translate(-50%, -50%)",
                      background: "#14261f",
                      filter: "blur(1px)",
                    }}
                  />
                  {/* Kilau baru yang bergerak mengikuti arah kursor */}
                  <div
                    className="pointer-events-none absolute rounded-full"
                    style={{
                      left: `${eye.xPct}%`,
                      top: `${eye.yPct}%`,
                      width: "1.8%",
                      height: "1.8%",
                      transform: `translate(-50%, -50%) translate(${gazePx.x}px, ${gazePx.y}px)`,
                      transition: "transform 90ms linear",
                      background:
                        "radial-gradient(circle at 35% 30%, #ffffff, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0) 80%)",
                    }}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
