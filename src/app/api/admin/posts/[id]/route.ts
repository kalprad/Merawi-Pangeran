import { NextResponse } from "next/server";
import { getPosts, savePosts } from "@/lib/data";
import { uniqueSlug } from "@/lib/slug";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const {
    title,
    excerpt,
    content,
    coverImage,
    date,
    author,
    category,
    slug,
    relatedMateriId,
  } = body ?? {};

  if (!title || !excerpt || !content || !date || !author || !category) {
    return NextResponse.json(
      { error: "Semua field wajib diisi." },
      { status: 400 },
    );
  }

  const posts = await getPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Berita tidak ditemukan." }, { status: 404 });
  }

  const otherSlugs = posts.filter((p) => p.id !== id).map((p) => p.slug);
  const current = posts[index];
  const finalSlug =
    slug && slug !== current.slug
      ? uniqueSlug(slug, otherSlugs)
      : otherSlugs.includes(current.slug)
        ? uniqueSlug(title, otherSlugs)
        : current.slug;

  posts[index] = {
    ...current,
    title,
    excerpt,
    content,
    coverImage: coverImage || current.coverImage,
    date,
    author,
    category,
    slug: finalSlug,
    relatedMateriId: relatedMateriId || undefined,
  };

  await savePosts(posts);
  return NextResponse.json(posts[index]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const posts = await getPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) {
    return NextResponse.json({ error: "Berita tidak ditemukan." }, { status: 404 });
  }
  await savePosts(filtered);
  return NextResponse.json({ ok: true });
}
