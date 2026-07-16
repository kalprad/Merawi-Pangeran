// .trim() jaga-jaga kalau ada spasi/tab nyempil waktu isi Environment
// Variables di Vercel (copy-paste dari tempat lain sering kebawa spasi).
const API_KEY = process.env.GOOGLE_DRIVE_API_KEY?.trim();

export type DrivePhoto = {
  id: string;
  name: string;
  imageUrl: string;
  viewUrl: string;
};

export type DriveGalleryResult =
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "ok"; photos: DrivePhoto[] };

/**
 * Ambil ID folder dari berbagai bentuk link Google Drive yang mungkin
 * ditempel admin, misalnya:
 * - https://drive.google.com/drive/folders/ABC123?usp=sharing
 * - https://drive.google.com/open?id=ABC123
 * - atau ID folder polos: ABC123
 */
export function extractDriveFolderId(input?: string | null): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) return folderMatch[1];

  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch) return idParamMatch[1];

  if (/^[a-zA-Z0-9_-]{15,}$/.test(trimmed)) return trimmed;

  return null;
}

/**
 * Ambil ID file dari berbagai bentuk link Google Drive yang mungkin
 * ditempel admin untuk video tutorial, misalnya:
 * - https://drive.google.com/file/d/ABC123/view?usp=sharing
 * - https://drive.google.com/open?id=ABC123
 * - atau ID file polos: ABC123
 */
export function extractDriveFileId(input?: string | null): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];

  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch) return idParamMatch[1];

  if (/^[a-zA-Z0-9_-]{15,}$/.test(trimmed)) return trimmed;

  return null;
}

export function driveEmbedUrl(driveUrl: string): string | null {
  const id = extractDriveFileId(driveUrl);
  return id ? `https://drive.google.com/file/d/${id}/preview` : null;
}

export async function getDriveGallery(
  folderUrl?: string | null,
): Promise<DriveGalleryResult> {
  const folderId = extractDriveFolderId(folderUrl);
  if (!folderId) {
    return { status: "empty" };
  }

  if (!API_KEY) {
    return {
      status: "error",
      message:
        "GOOGLE_DRIVE_API_KEY belum diatur di server. Tambahkan env var ini agar galeri bisa mengambil foto dari Google Drive.",
    };
  }

  const params = new URLSearchParams({
    q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
    fields: "files(id,name)",
    orderBy: "createdTime desc",
    pageSize: "1000",
    key: API_KEY,
  });

  try {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        status: "error",
        message:
          body?.error?.message ??
          `Gagal mengambil foto dari Google Drive (status ${res.status}). Pastikan folder dibagikan sebagai "Siapa saja yang memiliki link".`,
      };
    }

    const data = await res.json();
    const files: { id: string; name: string }[] = data.files ?? [];

    const photos: DrivePhoto[] = files.map((file) => ({
      id: file.id,
      name: file.name,
      imageUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1600`,
      viewUrl: `https://drive.google.com/file/d/${file.id}/view`,
    }));

    return { status: "ok", photos };
  } catch {
    return {
      status: "error",
      message: "Gagal terhubung ke Google Drive. Coba lagi beberapa saat lagi.",
    };
  }
}
