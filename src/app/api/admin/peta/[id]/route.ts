import { NextResponse } from "next/server";
import { getMapLayers, saveMapLayers } from "@/lib/data";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { title, geojsonUrls, fields, categories, photo, downloadUrl, order } =
    body ?? {};

  if (!title || !Array.isArray(geojsonUrls) || geojsonUrls.length === 0 || !fields?.name) {
    return NextResponse.json(
      { error: "Judul, minimal satu GeoJSON, dan properti nama fitur wajib diisi." },
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
    geojsonUrls,
    fields,
    categories: Array.isArray(categories) ? categories : [],
    photo: photo ?? { mode: "none" },
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
