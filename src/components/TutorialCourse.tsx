"use client";

import { useState } from "react";
import { Construction, Droplets, Mountain, Calculator, CirclePlay, type LucideIcon } from "lucide-react";
import { driveEmbedUrl } from "@/lib/google-drive";
import type { TutorialCategory, TutorialVideo } from "@/lib/types";

const modules: { value: TutorialCategory; label: string; icon: LucideIcon }[] = [
  { value: "jembatan", label: "Evaluasi & Desain Jembatan", icon: Construction },
  { value: "irigasi", label: "Saluran Irigasi", icon: Droplets },
  { value: "talud", label: "Talud", icon: Mountain },
  { value: "rab", label: "Perhitungan RAB", icon: Calculator },
];

export default function TutorialCourse({ videos }: { videos: TutorialVideo[] }) {
  const [activeModule, setActiveModule] = useState<TutorialCategory>("jembatan");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const activeVideos = videos
    .filter((v) => v.category === activeModule)
    .sort((a, b) => a.order - b.order);
  const activeVideo = activeVideos.find((v) => v.id === activeVideoId) ?? activeVideos[0];
  const embedUrl = activeVideo ? driveEmbedUrl(activeVideo.driveUrl) : null;

  function selectModule(value: TutorialCategory) {
    setActiveModule(value);
    setActiveVideoId(null);
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((mod) => {
          const count = videos.filter((v) => v.category === mod.value).length;
          const isActive = mod.value === activeModule;
          return (
            <button
              key={mod.value}
              type="button"
              onClick={() => selectModule(mod.value)}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors duration-200 ${
                isActive
                  ? "border-[var(--color-dark-green)] bg-[var(--color-dark-green)] text-[var(--color-beige)]"
                  : "glass-card border-transparent hover:-translate-y-0.5"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  isActive
                    ? "bg-[var(--color-beige)]/15 text-[var(--color-beige)]"
                    : "bg-[var(--color-dark-green)] text-[var(--color-beige)]"
                }`}
              >
                <mod.icon size={18} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{mod.label}</span>
                <span
                  className={`block text-xs ${
                    isActive ? "text-[var(--color-beige)]/80" : "text-[var(--color-muted-foreground)]"
                  }`}
                >
                  {count} video
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="glass-card overflow-hidden rounded-3xl">
          {activeVideo && embedUrl ? (
            <iframe
              key={activeVideo.id}
              src={embedUrl}
              className="aspect-video w-full"
              allow="autoplay"
              allowFullScreen
              title={activeVideo.title}
            />
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 p-6 text-center text-[var(--color-muted-foreground)]">
              <CirclePlay size={32} aria-hidden="true" />
              <p className="text-sm">Belum ada video untuk modul ini.</p>
            </div>
          )}
        </div>

        <ul className="space-y-2">
          {activeVideos.length === 0 ? (
            <li className="rounded-2xl border border-dashed border-[var(--color-border)] p-4 text-sm text-[var(--color-muted-foreground)]">
              Video tutorial akan segera ditambahkan di sini.
            </li>
          ) : (
            activeVideos.map((video) => {
              const isPlaying = video.id === activeVideo?.id;
              return (
                <li key={video.id}>
                  <button
                    type="button"
                    onClick={() => setActiveVideoId(video.id)}
                    className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-colors duration-200 ${
                      isPlaying
                        ? "border-[var(--color-dark-green)] bg-[var(--color-muted)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface)]/70 hover:bg-[var(--color-muted)]/60"
                    }`}
                  >
                    <CirclePlay
                      size={18}
                      className="mt-0.5 shrink-0 text-[var(--color-midnight-teal)]"
                      aria-hidden="true"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-[var(--color-dark-green)]">
                        {video.title}
                      </span>
                      {video.description && (
                        <span className="mt-0.5 block text-xs text-[var(--color-muted-foreground)]">
                          {video.description}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
