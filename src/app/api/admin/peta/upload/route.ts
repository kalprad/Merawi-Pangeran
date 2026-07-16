import { NextResponse } from "next/server";
import { uploadPetaFile } from "@/lib/upload";

const MAX_GEOJSON_BYTES = 8 * 1024 * 1024; // 8MB
const MAX_PHOTO_BYTES = 4 * 1024 * 1024; // 4MB

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const kind = formData.get("kind");
  const slug = formData.get("slug");
  const name = formData.get("name");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
  }
  if (typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Slug jenis peta tidak valid." }, { status: 400 });
  }
  if (kind !== "geojson" && kind !== "photo") {
    return NextResponse.json({ error: "Jenis unggahan tidak valid." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    if (kind === "geojson") {
      if (buffer.byteLength > MAX_GEOJSON_BYTES) {
        return NextResponse.json(
          { error: "Ukuran GeoJSON maksimal 8MB." },
          { status: 400 },
        );
      }
      let parsed: unknown;
      try {
        parsed = JSON.parse(buffer.toString("utf-8"));
      } catch {
        return NextResponse.json(
          { error: "File bukan GeoJSON yang valid (gagal dibaca sebagai JSON)." },
          { status: 400 },
        );
      }
      const featureCollection = parsed as { type?: string; features?: unknown };
      if (
        featureCollection.type !== "FeatureCollection" ||
        !Array.isArray(featureCollection.features)
      ) {
        return NextResponse.json(
          { error: "File harus berupa GeoJSON FeatureCollection." },
          { status: 400 },
        );
      }

      const url = await uploadPetaFile(buffer, "data.geojson", `Peta Interaktif/${slug}`);
      return NextResponse.json({ url });
    }

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Nama fitur untuk foto ini wajib diisi." },
        { status: 400 },
      );
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File harus berupa gambar." }, { status: 400 });
    }
    if (buffer.byteLength > MAX_PHOTO_BYTES) {
      return NextResponse.json(
        { error: "Ukuran foto maksimal 4MB." },
        { status: 400 },
      );
    }
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const url = await uploadPetaFile(
      buffer,
      `${name.trim()}.${ext}`,
      `Peta Interaktif/${slug}/photos`,
    );
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal mengunggah file." },
      { status: 500 },
    );
  }
}
