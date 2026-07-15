import { NextResponse } from "next/server";
import { getMateri, saveMateri } from "@/lib/data";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { title, description, category, date, fileUrl } = body ?? {};

  if (!title || !description || !category || !date) {
    return NextResponse.json(
      { error: "Semua field wajib diisi." },
      { status: 400 },
    );
  }

  const materi = await getMateri();
  const index = materi.findIndex((m) => m.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Materi tidak ditemukan." }, { status: 404 });
  }

  materi[index] = {
    ...materi[index],
    title,
    description,
    category,
    date,
    fileUrl: fileUrl || "",
  };

  await saveMateri(materi);
  return NextResponse.json(materi[index]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const materi = await getMateri();
  const filtered = materi.filter((m) => m.id !== id);
  if (filtered.length === materi.length) {
    return NextResponse.json({ error: "Materi tidak ditemukan." }, { status: 404 });
  }
  await saveMateri(filtered);
  return NextResponse.json({ ok: true });
}
