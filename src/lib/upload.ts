import { promises as fs } from "fs";
import path from "path";
import { isGithubEnabled, uploadBinaryToGithub } from "./github";

export type UploadFolder = "Blog" | "Tentang Kami";

const LOCAL_UPLOAD_DIR: Record<UploadFolder, string> = {
  Blog: "blog",
  "Tentang Kami": "tim",
};

function safeFileName(originalName: string): string {
  const ext = path.extname(originalName) || ".jpg";
  const base = path
    .basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${Date.now()}-${base || "foto"}${ext}`;
}

/**
 * Simpan foto yang diunggah lewat panel admin.
 * - Kalau situs berjalan di server dengan GITHUB_TOKEN diset (Vercel):
 *   foto disimpan sebagai file baru di folder GitHub ("Blog" atau
 *   "Tentang Kami"), dan mengembalikan URL foto tersebut.
 * - Kalau di komputer sendiri (tidak ada GITHUB_TOKEN): foto disimpan di
 *   public/images/uploads/ dan mengembalikan path lokalnya.
 */
export async function uploadImage(
  buffer: Buffer,
  originalName: string,
  folder: UploadFolder,
): Promise<string> {
  const fileName = safeFileName(originalName);

  if (isGithubEnabled()) {
    const base64Content = buffer.toString("base64");
    return uploadBinaryToGithub(
      `${folder}/${fileName}`,
      base64Content,
      `Unggah foto ke ${folder} lewat panel admin`,
    );
  }

  const localDir = path.join(
    process.cwd(),
    "public",
    "images",
    "uploads",
    LOCAL_UPLOAD_DIR[folder],
  );
  await fs.mkdir(localDir, { recursive: true });
  await fs.writeFile(path.join(localDir, fileName), buffer);
  return `/images/uploads/${LOCAL_UPLOAD_DIR[folder]}/${fileName}`;
}
