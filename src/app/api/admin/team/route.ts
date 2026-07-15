import { NextResponse } from "next/server";
import { getTeam, saveTeam } from "@/lib/data";
import type { TeamMember } from "@/lib/types";

export async function GET() {
  const team = await getTeam();
  return NextResponse.json(team);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, role, photo } = body ?? {};

  if (!name || !role) {
    return NextResponse.json(
      { error: "Nama dan jabatan wajib diisi." },
      { status: 400 },
    );
  }

  const team = await getTeam();
  const newMember: TeamMember = {
    id: crypto.randomUUID(),
    name,
    role,
    photo: photo || "",
  };

  await saveTeam([...team, newMember]);
  return NextResponse.json(newMember, { status: 201 });
}
