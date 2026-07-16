import { NextResponse } from "next/server";
import { getTutorialVideos, saveTutorialVideos } from "@/lib/data";
import type { TutorialCategory } from "@/lib/types";

const CATEGORIES: TutorialCategory[] = ["jembatan", "irigasi", "talud", "rab"];

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { category, title, description, driveUrl, order } = body ?? {};

  if (!title || !driveUrl || !CATEGORIES.includes(category)) {
    return NextResponse.json(
      { error: "Kategori, judul, dan tautan Google Drive wajib diisi." },
      { status: 400 },
    );
  }

  const videos = await getTutorialVideos();
  const index = videos.findIndex((v) => v.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Video tidak ditemukan." }, { status: 404 });
  }

  videos[index] = {
    ...videos[index],
    category,
    title,
    description: description || undefined,
    driveUrl,
    order: typeof order === "number" ? order : videos[index].order,
  };

  await saveTutorialVideos(videos);
  return NextResponse.json(videos[index]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const videos = await getTutorialVideos();
  const filtered = videos.filter((v) => v.id !== id);
  if (filtered.length === videos.length) {
    return NextResponse.json({ error: "Video tidak ditemukan." }, { status: 404 });
  }
  await saveTutorialVideos(filtered);
  return NextResponse.json({ ok: true });
}
