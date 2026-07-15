import { NextResponse } from "next/server";
import { getPosts, savePosts } from "@/lib/data";
import { uniqueSlug } from "@/lib/slug";
import type { Post } from "@/lib/types";

export async function GET() {
  const posts = await getPosts();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, excerpt, content, coverImage, date, author, category, slug } =
    body ?? {};

  if (!title || !excerpt || !content || !date || !author || !category) {
    return NextResponse.json(
      { error: "Semua field wajib diisi." },
      { status: 400 },
    );
  }

  const posts = await getPosts();
  const finalSlug = uniqueSlug(
    slug || title,
    posts.map((p) => p.slug),
  );

  const newPost: Post = {
    id: crypto.randomUUID(),
    slug: finalSlug,
    title,
    excerpt,
    content,
    coverImage: coverImage || "/images/hero-sawah.jpg",
    date,
    author,
    category,
  };

  await savePosts([newPost, ...posts]);
  return NextResponse.json(newPost, { status: 201 });
}
