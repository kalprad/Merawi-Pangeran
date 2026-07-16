import { promises as fs } from "fs";
import path from "path";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";
import type {
  Post,
  Materi,
  MapLayer,
  ResolvedMapLayer,
  Settings,
  TeamMember,
  TutorialVideo,
} from "./types";
import { githubRawUrl, isGithubEnabled, readJsonFromGithub, writeJsonToGithub } from "./github";

const dataDir = path.join(process.cwd(), "data");

/**
 * Baca file GeoJSON yang ikut di-commit di repo (data bawaan/seed).
 * Di server (Vercel), path dinamis seperti ini tidak ikut ter-bundle oleh
 * Next.js file tracing, jadi HARUS diambil lewat raw.githubusercontent.com,
 * bukan fs.readFile -- fs hanya dipakai sebagai fallback saat development
 * lokal (tanpa GITHUB_TOKEN), di mana seluruh repo memang ada di disk.
 */
async function readGeoJsonFile<T>(repoRelativePath: string): Promise<T> {
  if (isGithubEnabled()) {
    const res = await fetch(githubRawUrl(repoRelativePath), { cache: "no-store" });
    if (!res.ok) {
      throw new Error(
        `Gagal membaca ${repoRelativePath} dari GitHub (status ${res.status})`,
      );
    }
    return res.json() as Promise<T>;
  }
  const raw = await fs.readFile(
    path.join(process.cwd(), repoRelativePath),
    "utf-8",
  );
  return JSON.parse(raw) as T;
}

/**
 * Baca GeoJSON dari tiga kemungkinan sumber:
 * - URL https (data yang diunggah admin ke GitHub, mode produksi).
 * - Path "/uploads/..." (fallback unggahan admin saat dijalankan lokal
 *   tanpa GITHUB_TOKEN, disimpan di folder public/).
 * - Path relatif repo biasa (data bawaan yang ikut di-commit).
 */
async function readGeoJsonSource<T>(source: string): Promise<T> {
  if (/^https?:\/\//i.test(source)) {
    const res = await fetch(source, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Gagal membaca ${source} (status ${res.status})`);
    }
    return res.json() as Promise<T>;
  }
  if (source.startsWith("/")) {
    return readGeoJsonFile<T>(path.join("public", source));
  }
  return readGeoJsonFile<T>(source);
}

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

export async function getTutorialVideos(): Promise<TutorialVideo[]> {
  const videos = await readJson<TutorialVideo[]>("tutorial-videos.json");
  return videos.slice().sort((a, b) => a.order - b.order);
}

export async function getTutorialVideoById(id: string): Promise<TutorialVideo | undefined> {
  const videos = await getTutorialVideos();
  return videos.find((v) => v.id === id);
}

export async function saveTutorialVideos(videos: TutorialVideo[]): Promise<void> {
  await writeJson("tutorial-videos.json", videos);
}

export async function getSettings(): Promise<Settings> {
  return readJson<Settings>("settings.json");
}

export async function saveSettings(settings: Settings): Promise<void> {
  await writeJson("settings.json", settings);
}

export async function getTeam(): Promise<TeamMember[]> {
  return readJson<TeamMember[]>("team.json");
}

export async function getTeamMemberById(id: string): Promise<TeamMember | undefined> {
  const team = await getTeam();
  return team.find((m) => m.id === id);
}

export async function saveTeam(team: TeamMember[]): Promise<void> {
  await writeJson("team.json", team);
}

export async function getMapLayers(): Promise<MapLayer[]> {
  const layers = await readJson<MapLayer[]>("map-layers.json");
  return layers.slice().sort((a, b) => a.order - b.order);
}

export async function getMapLayerById(id: string): Promise<MapLayer | undefined> {
  const layers = await getMapLayers();
  return layers.find((l) => l.id === id);
}

export async function saveMapLayers(layers: MapLayer[]): Promise<void> {
  await writeJson("map-layers.json", layers);
}

/**
 * Ambil semua jenis peta lengkap dengan isi GeoJSON-nya, siap dirender.
 * Kalau GeoJSON satu layer gagal dibaca (misalnya file yang dirujuk sudah
 * terhapus/tidak bisa diakses), layer itu dilewati saja supaya satu data
 * yang rusak tidak membuat seluruh halaman peta error.
 */
export async function getResolvedMapLayers(): Promise<ResolvedMapLayer[]> {
  const layers = await getMapLayers();
  const settled = await Promise.allSettled(
    layers.map(async (layer): Promise<ResolvedMapLayer> => ({
      ...layer,
      geojson: await readGeoJsonSource<FeatureCollection>(layer.geojsonUrl),
    })),
  );

  return settled.flatMap((result) => {
    if (result.status === "fulfilled") return [result.value];
    console.error("Gagal memuat GeoJSON untuk salah satu jenis peta:", result.reason);
    return [];
  });
}

export async function getDesaBoundary(): Promise<
  FeatureCollection<Polygon | MultiPolygon>
> {
  return readGeoJsonFile<FeatureCollection<Polygon | MultiPolygon>>(
    "Peta Interaktif/DesaJetis.geojson",
  );
}
