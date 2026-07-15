import { NextResponse } from "next/server";
import { uploadImage, type UploadFolder } from "@/lib/upload";

const ALLOWED_FOLDERS: UploadFolder[] = ["Blog", "Tentang Kami"];
// Vercel menolak body request di atas ~4.5MB di level platform (di luar
// kendali kode ini), jadi batas di sini dijaga di bawah itu. Foto sudah
// dikecilkan otomatis di browser sebelum sampai sini (lihat
// src/lib/compressImage.ts), jadi batas ini jarang kena kecuali untuk
// file yang bukan foto biasa.
const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4MB

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
  }
  if (typeof folder !== "string" || !ALLOWED_FOLDERS.includes(folder as UploadFolder)) {
    return NextResponse.json({ error: "Folder tujuan tidak valid." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File harus berupa gambar." }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Ukuran gambar maksimal 4MB, coba pakai foto lain atau kecilkan dulu." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const url = await uploadImage(buffer, file.name, folder as UploadFolder);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal mengunggah foto." },
      { status: 500 },
    );
  }
}
