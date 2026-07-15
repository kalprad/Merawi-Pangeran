import { NextResponse } from "next/server";
import { getMateri, saveMateri } from "@/lib/data";
import type { Materi } from "@/lib/types";

export async function GET() {
  const materi = await getMateri();
  return NextResponse.json(materi);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, category, date, fileUrl } = body ?? {};

  if (!title || !description || !category || !date) {
    return NextResponse.json(
      { error: "Semua field wajib diisi." },
      { status: 400 },
    );
  }

  const materi = await getMateri();
  const newItem: Materi = {
    id: crypto.randomUUID(),
    title,
    description,
    category,
    date,
    fileUrl: fileUrl || "",
  };

  await saveMateri([newItem, ...materi]);
  return NextResponse.json(newItem, { status: 201 });
}
