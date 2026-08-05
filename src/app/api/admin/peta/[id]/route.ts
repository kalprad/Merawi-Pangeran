import { NextResponse } from "next/server";
import { getMapLayers, saveMapLayers } from "@/lib/data";
import { normalizeSublayers } from "@/lib/mapValidation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { title, sublayers: rawSublayers, downloadUrl, order } = body ?? {};

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
  const index = layers.findIndex((l) => l.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Jenis peta tidak ditemukan." }, { status: 404 });
  }

  layers[index] = {
    ...layers[index],
    title,
    sublayers,
    downloadUrl: downloadUrl || undefined,
    order: typeof order === "number" ? order : layers[index].order,
  };

  await saveMapLayers(layers);
  return NextResponse.json(layers[index]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const layers = await getMapLayers();
  const filtered = layers.filter((l) => l.id !== id);
  if (filtered.length === layers.length) {
    return NextResponse.json({ error: "Jenis peta tidak ditemukan." }, { status: 404 });
  }
  await saveMapLayers(filtered);
  return NextResponse.json({ ok: true });
}
