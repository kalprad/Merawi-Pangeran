import { NextResponse } from "next/server";
import { getTeam, saveTeam } from "@/lib/data";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { name, role, photo } = body ?? {};

  if (!name || !role) {
    return NextResponse.json(
      { error: "Nama dan jabatan wajib diisi." },
      { status: 400 },
    );
  }

  const team = await getTeam();
  const index = team.findIndex((m) => m.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Anggota tidak ditemukan." }, { status: 404 });
  }

  team[index] = {
    ...team[index],
    name,
    role,
    photo: photo || team[index].photo,
  };

  await saveTeam(team);
  return NextResponse.json(team[index]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const team = await getTeam();
  const filtered = team.filter((m) => m.id !== id);
  if (filtered.length === team.length) {
    return NextResponse.json({ error: "Anggota tidak ditemukan." }, { status: 404 });
  }
  await saveTeam(filtered);
  return NextResponse.json({ ok: true });
}
