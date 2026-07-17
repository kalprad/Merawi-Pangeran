"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { DrivePhoto } from "@/lib/google-drive";

const MAX_DOTS = 10;

export default function GalleryCarousel({ photos }: { photos: DrivePhoto[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ dragging: false, startX: 0, startScroll: 0, moved: false });
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [renderedPhoto, setRenderedPhoto] = useState<DrivePhoto | null>(null);
  const [visible, setVisible] = useState(false);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);
  const showNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, close, showPrev, showNext]);

  const active = activeIndex !== null ? photos[activeIndex] : null;

  useEffect(() => {
    if (active) {
      // Mounts the lightbox immediately so the next frame's opacity/scale
      // flip has something to animate; this is a rare, user-triggered
      // toggle.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRenderedPhoto(active);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const timeout = setTimeout(() => setRenderedPhoto(null), 200);
    return () => clearTimeout(timeout);
  }, [active]);

  // Lebar 1 slide + gap dipakai untuk hitung jarak geser tombol panah & posisi dot aktif.
  const getStep = useCallback(() => {
    const track = trackRef.current;
    const slide = track?.querySelector<HTMLElement>("[data-slide-index]");
    if (!track || !slide) return track?.clientWidth ?? 0;
    return slide.getBoundingClientRect().width + 16;
  }, []);

  const scrollToSlide = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      track.scrollTo({ left: index * getStep(), behavior: "smooth" });
    },
    [getStep],
  );

  const scrollByDirection = useCallback(
    (dir: 1 | -1) => {
      trackRef.current?.scrollBy({ left: dir * getStep(), behavior: "smooth" });
    },
    [getStep],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;

    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const t = trackRef.current;
        if (!t) return;
        const step = getStep();
        if (step > 0) setActiveSlide(Math.round(t.scrollLeft / step));
      });
    }

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [getStep]);

  // Drag-to-scroll ala carousel untuk mouse (touch sudah bisa swipe natif lewat overflow-x + snap).
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = { dragging: true, startX: e.clientX, startScroll: track.scrollLeft, moved: false };
    track.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track || !dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 4) dragRef.current.moved = true;
    track.scrollLeft = dragRef.current.startScroll - dx;
  }
  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    dragRef.current.dragging = false;
    trackRef.current?.releasePointerCapture(e.pointerId);
  }

  function handleSlideClick(i: number) {
    if (dragRef.current.moved) {
      dragRef.current.moved = false;
      return;
    }
    setActiveIndex(i);
  }

  const showDots = photos.length <= MAX_DOTS;

  return (
    <>
      <Reveal>
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 select-none active:cursor-grabbing"
        >
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              data-slide-index={i}
              aria-label={photo.name || `Foto ${i + 1}`}
              onClick={() => handleSlideClick(i)}
              className="group relative block aspect-[4/3] w-[75%] shrink-0 snap-start overflow-hidden rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] sm:w-[45%] lg:w-[30%]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.imageUrl}
                alt={photo.name}
                loading="lazy"
                draggable={false}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          {showDots ? (
            <div className="flex gap-1.5">
              {photos.map((photo, i) => (
                <button
                  key={photo.id}
                  type="button"
                  aria-label={`Ke foto ${i + 1}`}
                  onClick={() => scrollToSlide(i)}
                  className={`h-1.5 cursor-pointer rounded-full transition-all duration-200 ${
                    i === activeSlide
                      ? "w-6 bg-[var(--color-dark-green)]"
                      : "w-1.5 bg-[var(--color-border)] hover:bg-[var(--color-muted-foreground)]/40"
                  }`}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm font-medium text-[var(--color-muted-foreground)]">
              {activeSlide + 1} / {photos.length}
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollByDirection(-1)}
              aria-label="Geser ke kiri"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-dark-green)] hover:bg-[var(--color-muted)]"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollByDirection(1)}
              aria-label="Geser ke kanan"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-dark-green)] hover:bg-[var(--color-muted)]"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </Reveal>

      {renderedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={renderedPhoto.name}
          data-state={visible ? "open" : "closed"}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=closed]:opacity-0 data-[state=open]:opacity-100"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Tutup"
            className="absolute top-4 right-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X size={22} />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                aria-label="Foto sebelumnya"
                className="absolute top-1/2 left-2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                aria-label="Foto berikutnya"
                className="absolute top-1/2 right-2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div
            data-state={visible ? "open" : "closed"}
            className="relative flex max-h-[85vh] max-w-4xl flex-col items-center transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={renderedPhoto.imageUrl}
              alt={renderedPhoto.name}
              referrerPolicy="no-referrer"
              className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
            <a
              href={renderedPhoto.viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white"
            >
              Buka di Google Drive
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
