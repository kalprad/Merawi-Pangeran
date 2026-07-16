import { NextResponse } from "next/server";
import { getTutorialVideos, saveTutorialVideos } from "@/lib/data";
import type { TutorialCategory, TutorialVideo } from "@/lib/types";

const CATEGORIES: TutorialCategory[] = ["jembatan", "irigasi", "talud", "rab"];

export async function GET() {
  const videos = await getTutorialVideos();
  return NextResponse.json(videos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { category, title, description, driveUrl, order } = body ?? {};

  if (!title || !driveUrl || !CATEGORIES.includes(category)) {
    return NextResponse.json(
      { error: "Kategori, judul, dan tautan Google Drive wajib diisi." },
      { status: 400 },
    );
  }

  const videos = await getTutorialVideos();
  const sameCategoryCount = videos.filter((v) => v.category === category).length;
  const newVideo: TutorialVideo = {
    id: crypto.randomUUID(),
    category,
    title,
    description: description || undefined,
    driveUrl,
    order: typeof order === "number" ? order : sameCategoryCount + 1,
  };

  await saveTutorialVideos([...videos, newVideo]);
  return NextResponse.json(newVideo, { status: 201 });
}
