import { NextResponse } from "next/server";
import { getMapLayers, saveMapLayers } from "@/lib/data";

export async function POST(request: Request) {
  const body = await request.json();
  const ids = body?.ids;

  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "Urutan tidak valid." }, { status: 400 });
  }

  const layers = await getMapLayers();
  if (ids.length !== layers.length || !ids.every((id) => layers.some((l) => l.id === id))) {
    return NextResponse.json(
      { error: "Daftar urutan tidak cocok dengan jenis peta yang ada." },
      { status: 400 },
    );
  }

  const byId = new Map(layers.map((l) => [l.id, l]));
  const reordered = ids.map((id: string, index: number) => ({
    ...byId.get(id)!,
    order: index + 1,
  }));

  await saveMapLayers(reordered);
  return NextResponse.json(reordered);
}
