import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/data";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { siBeningUrl } = body ?? {};

  if (typeof siBeningUrl !== "string") {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const settings = { siBeningUrl };
  await saveSettings(settings);
  return NextResponse.json(settings);
}
