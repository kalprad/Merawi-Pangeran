import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/data";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { siBeningUrl, galleryFolderUrl } = body ?? {};

  if (typeof siBeningUrl !== "string" || typeof galleryFolderUrl !== "string") {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const settings = { siBeningUrl, galleryFolderUrl };
  await saveSettings(settings);
  return NextResponse.json(settings);
}
