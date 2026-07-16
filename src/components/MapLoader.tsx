"use client";

import dynamic from "next/dynamic";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";
import type { ResolvedMapLayer } from "@/lib/types";

const InteractiveMap = dynamic(() => import("./InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] w-full animate-pulse rounded-3xl border border-[var(--color-border)] bg-[var(--color-muted)] sm:h-[560px]" />
  ),
});

export default function MapLoader({
  layers,
  boundary,
}: {
  layers: ResolvedMapLayer[];
  boundary: FeatureCollection<Polygon | MultiPolygon>;
}) {
  return <InteractiveMap layers={layers} boundary={boundary} />;
}
