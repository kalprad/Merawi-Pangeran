"use client";

import { useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { MapPoint, MapPointCategory } from "@/lib/types";

const CATEGORY_META: Record<
  MapPointCategory,
  { label: string; color: string }
> = {
  irigasi: { label: "Kerusakan Irigasi", color: "#D3968C" },
  umkm: { label: "Sebaran UMKM", color: "#105666" },
  fasilitas: { label: "Fasilitas Umum", color: "#839958" },
};

const DEFAULT_CENTER: [number, number] = [-7.2178, 110.3266];

export default function InteractiveMap({ points }: { points: MapPoint[] }) {
  const [activeCategories, setActiveCategories] = useState<
    Set<MapPointCategory>
  >(new Set(Object.keys(CATEGORY_META) as MapPointCategory[]));

  const visiblePoints = useMemo(
    () => points.filter((p) => activeCategories.has(p.category)),
    [points, activeCategories],
  );

  function toggleCategory(cat: MapPointCategory) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(CATEGORY_META) as MapPointCategory[]).map((cat) => {
          const meta = CATEGORY_META[cat];
          const active = activeCategories.has(cat);
          return (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              aria-pressed={active}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] ${
                active
                  ? "border-transparent bg-[var(--color-dark-green)] text-[var(--color-beige)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-foreground)]"
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: active ? meta.color : "#999" }}
                aria-hidden="true"
              />
              {meta.label}
            </button>
          );
        })}
      </div>

      <div className="h-[480px] w-full overflow-hidden rounded-3xl border border-[var(--color-border)] sm:h-[560px]">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={14}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {visiblePoints.map((point) => (
            <CircleMarker
              key={point.id}
              center={[point.lat, point.lng]}
              radius={9}
              pathOptions={{
                color: CATEGORY_META[point.category].color,
                fillColor: CATEGORY_META[point.category].color,
                fillOpacity: 0.85,
                weight: 2,
              }}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <span
                    className="text-xs font-semibold uppercase"
                    style={{ color: CATEGORY_META[point.category].color }}
                  >
                    {CATEGORY_META[point.category].label}
                  </span>
                  <p className="mt-1 font-semibold text-[var(--color-dark-green)]">
                    {point.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">{point.description}</p>
                  <p className="mt-2 text-xs font-medium text-gray-500">
                    Status: {point.status}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
