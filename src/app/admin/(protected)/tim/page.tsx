"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, User } from "lucide-react";
import type { TeamMember } from "@/lib/types";

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadTeam() {
    setLoading(true);
    const res = await fetch("/api/admin/team");
    const data = await res.json();
    setTeam(data);
    setLoading(false);
  }

  useEffect(() => {
    loadTeam();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Hapus anggota "${name}"?`)) return;
    setDeletingId(id);
    await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
    setTeam((prev) => prev.filter((m) => m.id !== id));
    setDeletingId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-[var(--color-dark-green)]">
          Anggota Tim
        </h2>
        <Link
          href="/admin/tim/new"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-dark-green)] px-4 py-2 text-sm font-semibold text-[var(--color-beige)]"
        >
          <Plus size={16} />
          Tambah Anggota
        </Link>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-[var(--color-muted-foreground)]">Memuat...</p>
      ) : team.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--color-muted-foreground)]">
          Belum ada anggota. Klik &ldquo;Tambah Anggota&rdquo; untuk menambahkan.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {team.map((member) => (
            <li
              key={member.id}
              className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-[var(--color-muted)]">
                {member.photo ? (
                  <Image src={member.photo} alt={member.name} fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[var(--color-muted-foreground)]">
                    <User size={22} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-[var(--color-dark-green)]">
                  {member.name}
                </p>
                <p className="truncate text-xs text-[var(--color-muted-foreground)]">
                  {member.role}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/admin/tim/${member.id}/edit`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-dark-green)] hover:bg-[var(--color-muted)]"
                  aria-label={`Sunting ${member.name}`}
                >
                  <Pencil size={16} />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(member.id, member.name)}
                  disabled={deletingId === member.id}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-red-600 hover:bg-red-50 disabled:opacity-50"
                  aria-label={`Hapus ${member.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
