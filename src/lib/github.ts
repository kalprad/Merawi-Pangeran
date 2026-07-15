const TOKEN = process.env.GITHUB_TOKEN;
const OWNER_REPO = process.env.GITHUB_REPO; // format: "namaakun/nama-repo"
const BRANCH = process.env.GITHUB_BRANCH || "main";

export function githubRawUrl(filePath: string): string {
  const encodedPath = filePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `https://raw.githubusercontent.com/${OWNER_REPO}/${BRANCH}/${encodedPath}`;
}

/**
 * Kalau env var GitHub belum diisi (misalnya saat dijalankan di komputer
 * sendiri), sistem otomatis pakai file biasa di folder data/ (lihat data.ts).
 * GitHub API hanya dipakai kalau situs berjalan di server (misalnya Vercel).
 */
export function isGithubEnabled(): boolean {
  return Boolean(TOKEN && OWNER_REPO);
}

function apiUrl(filePath: string): string {
  return `https://api.github.com/repos/${OWNER_REPO}/contents/${filePath}?ref=${BRANCH}`;
}

function headers() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/vnd.github+json",
  };
}

export async function readJsonFromGithub<T>(filePath: string): Promise<T> {
  const res = await fetch(apiUrl(filePath), {
    headers: headers(),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Gagal membaca ${filePath} dari GitHub (status ${res.status})`);
  }
  const json = await res.json();
  const content = Buffer.from(json.content, "base64").toString("utf-8");
  return JSON.parse(content) as T;
}

export async function writeJsonToGithub<T>(
  filePath: string,
  value: T,
  message: string,
): Promise<void> {
  // GitHub mewajibkan kita menyertakan "sha" file versi terakhir supaya
  // tidak menimpa perubahan orang lain secara tidak sengaja.
  const current = await fetch(apiUrl(filePath), {
    headers: headers(),
    cache: "no-store",
  });
  if (!current.ok) {
    throw new Error(`Gagal membaca ${filePath} dari GitHub (status ${current.status})`);
  }
  const currentData = await current.json();

  const content = Buffer.from(
    JSON.stringify(value, null, 2) + "\n",
    "utf-8",
  ).toString("base64");

  const res = await fetch(
    `https://api.github.com/repos/${OWNER_REPO}/contents/${filePath}`,
    {
      method: "PUT",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        content,
        sha: currentData.sha,
        branch: BRANCH,
      }),
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal menyimpan ${filePath} ke GitHub: ${errorText}`);
  }
}

/**
 * Upload file baru (misalnya foto) ke GitHub. Dipakai untuk file yang selalu
 * baru (nama file dibuat unik), jadi tidak perlu cek "sha" versi lama seperti
 * writeJsonToGithub di atas.
 */
export async function uploadBinaryToGithub(
  filePath: string,
  base64Content: string,
  message: string,
): Promise<string> {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER_REPO}/contents/${filePath}`,
    {
      method: "PUT",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        content: base64Content,
        branch: BRANCH,
      }),
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal mengunggah ${filePath} ke GitHub: ${errorText}`);
  }

  return githubRawUrl(filePath);
}
