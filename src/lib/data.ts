import { promises as fs } from "fs";
import path from "path";
import type { Post, Materi, MapPoint } from "./types";
import { isGithubEnabled, readJsonFromGithub, writeJsonToGithub } from "./github";

const dataDir = path.join(process.cwd(), "data");

async function readJson<T>(file: string): Promise<T> {
  if (isGithubEnabled()) {
    return readJsonFromGithub<T>(`data/${file}`);
  }
  const raw = await fs.readFile(path.join(dataDir, file), "utf-8");
  return JSON.parse(raw) as T;
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  if (isGithubEnabled()) {
    await writeJsonToGithub(`data/${file}`, data, `Perbarui ${file} lewat panel admin`);
    return;
  }
  await fs.writeFile(
    path.join(dataDir, file),
    JSON.stringify(data, null, 2) + "\n",
    "utf-8",
  );
}

export async function getPosts(): Promise<Post[]> {
  const posts = await readJson<Post[]>("posts.json");
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((p) => p.id === id);
}

export async function savePosts(posts: Post[]): Promise<void> {
  await writeJson("posts.json", posts);
}

export async function getMateriById(id: string): Promise<Materi | undefined> {
  const materi = await getMateri();
  return materi.find((m) => m.id === id);
}

export async function getMateri(): Promise<Materi[]> {
  const materi = await readJson<Materi[]>("materi.json");
  return materi.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function saveMateri(materi: Materi[]): Promise<void> {
  await writeJson("materi.json", materi);
}

export async function getMapPoints(): Promise<MapPoint[]> {
  return readJson<MapPoint[]>("map-points.json");
}

export async function saveMapPoints(points: MapPoint[]): Promise<void> {
  await writeJson("map-points.json", points);
}
