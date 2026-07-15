"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Post } from "@/lib/types";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadPosts() {
    setLoading(true);
    const res = await fetch("/api/admin/posts");
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Hapus berita "${title}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    setDeletingId(id);
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-[var(--color-dark-green)]">
          Berita Kegiatan
        </h2>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-dark-green)] px-4 py-2 text-sm font-semibold text-[var(--color-beige)]"
        >
          <Plus size={16} />
          Tulis Berita
        </Link>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-[var(--color-muted-foreground)]">Memuat...</p>
      ) : posts.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--color-muted-foreground)]">
          Belum ada berita. Klik &ldquo;Tulis Berita&rdquo; untuk membuat yang pertama.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wide text-[var(--color-midnight-teal)] uppercase">
                  {post.category} &middot; {post.date}
                </p>
                <p className="truncate font-medium text-[var(--color-dark-green)]">
                  {post.title}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-dark-green)] hover:bg-[var(--color-muted)]"
                  aria-label={`Sunting ${post.title}`}
                >
                  <Pencil size={16} />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(post.id, post.title)}
                  disabled={deletingId === post.id}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-red-600 hover:bg-red-50 disabled:opacity-50"
                  aria-label={`Hapus ${post.title}`}
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
