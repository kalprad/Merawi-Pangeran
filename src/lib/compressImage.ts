/**
 * Kecilkan ukuran foto di browser sebelum diunggah. Foto dari HP biasanya
 * berukuran besar (5-10MB), sementara server (Vercel) menolak upload di
 * atas ~4.5MB. Fungsi ini mengecilkan dimensi + kompres jadi JPEG supaya
 * hampir semua foto aman diunggah tanpa perlu dikecilkan manual dulu.
 */
export async function compressImage(
  file: File,
  maxDimension = 1920,
  quality = 0.82,
): Promise<File> {
  // GIF dilewati (supaya animasi tidak rusak jadi 1 frame)
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }

  const imageBitmap = await createImageBitmap(file).catch(() => null);
  if (!imageBitmap) return file;

  let { width, height } = imageBitmap;
  if (width > maxDimension || height > maxDimension) {
    if (width >= height) {
      height = Math.round((height / width) * maxDimension);
      width = maxDimension;
    } else {
      width = Math.round((width / height) * maxDimension);
      height = maxDimension;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(imageBitmap, 0, 0, width, height);

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
  if (!blob || blob.size >= file.size) return file;

  const newName = file.name.replace(/\.[^./]+$/, "") + ".jpg";
  return new File([blob], newName, { type: "image/jpeg" });
}
