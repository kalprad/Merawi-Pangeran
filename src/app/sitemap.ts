import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/data";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://merawi-pangeran.vercel.app";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/blog", changeFrequency: "daily", priority: 0.8 },
  { path: "/materi", changeFrequency: "weekly", priority: 0.6 },
  { path: "/galeri", changeFrequency: "weekly", priority: 0.6 },
  { path: "/peta", changeFrequency: "monthly", priority: 0.6 },
  { path: "/si-bening", changeFrequency: "monthly", priority: 0.6 },
  { path: "/tentang", changeFrequency: "monthly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries];
}
