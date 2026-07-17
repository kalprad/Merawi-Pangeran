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
  const { siBeningUrl, galleryFolderUrl, featureGuideUrls, releaseCountdown } = body ?? {};

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

  const normalizedReleaseCountdown = {
    enabled: Boolean(releaseCountdown?.enabled),
    releaseAt: typeof releaseCountdown?.releaseAt === "string" ? releaseCountdown.releaseAt : "",
    title: typeof releaseCountdown?.title === "string" ? releaseCountdown.title : "",
    message: typeof releaseCountdown?.message === "string" ? releaseCountdown.message : "",
  };

  if (normalizedReleaseCountdown.enabled && !normalizedReleaseCountdown.releaseAt) {
    return NextResponse.json(
      { error: "Tentukan waktu rilis sebelum mengaktifkan countdown." },
      { status: 400 },
    );
  }

  const settings = {
    siBeningUrl,
    galleryFolderUrl,
    featureGuideUrls: normalizedGuideUrls,
    releaseCountdown: normalizedReleaseCountdown,
  };
  await saveSettings(settings);
  return NextResponse.json(settings);
}
