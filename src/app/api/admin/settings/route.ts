import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/data";
import type { TutorialCategory } from "@/lib/types";

const CATEGORIES: TutorialCategory[] = ["jembatan", "irigasi", "talud", "rab"];

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { siBeningUrl, galleryFolderUrl, featureGuideUrls } = body ?? {};

  if (typeof siBeningUrl !== "string" || typeof galleryFolderUrl !== "string") {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const normalizedGuideUrls = CATEGORIES.reduce(
    (acc, category) => {
      acc[category] =
        typeof featureGuideUrls?.[category] === "string" ? featureGuideUrls[category] : "";
      return acc;
    },
    {} as Record<TutorialCategory, string>,
  );

  const settings = { siBeningUrl, galleryFolderUrl, featureGuideUrls: normalizedGuideUrls };
  await saveSettings(settings);
  return NextResponse.json(settings);
}
