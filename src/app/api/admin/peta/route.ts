import { NextResponse } from "next/server";
import { getMapLayers, saveMapLayers } from "@/lib/data";
import { normalizeSublayers } from "@/lib/mapValidation";
import type { MapLayer } from "@/lib/types";

function uniqueSlug(desired: string, existing: MapLayer[]): string {
  const taken = new Set(existing.map((l) => l.slug));
  if (!taken.has(desired)) return desired;
  let i = 2;
  while (taken.has(`${desired}-${i}`)) i++;
  return `${desired}-${i}`;
}

export async function GET() {
  const layers = await getMapLayers();
  return NextResponse.json(layers);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, slug, sublayers: rawSublayers, downloadUrl, order } = body ?? {};

  const sublayers = normalizeSublayers(rawSublayers);
  if (!title || !sublayers) {
    return NextResponse.json(
      {
        error:
          "Judul, minimal satu sub-layer GeoJSON, dan properti nama fitur tiap sub-layer wajib diisi.",
      },
      { status: 400 },
    );
  }

  const layers = await getMapLayers();
  const newLayer: MapLayer = {
    id: crypto.randomUUID(),
    slug: uniqueSlug(String(slug || title), layers),
    title,
    sublayers,
    downloadUrl: downloadUrl || undefined,
    order: typeof order === "number" ? order : layers.length + 1,
  };

  await saveMapLayers([...layers, newLayer]);
  return NextResponse.json(newLayer, { status: 201 });
}
