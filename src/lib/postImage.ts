/**
 * Ambil URL gambar pertama dari HTML isi berita (hasil RichTextEditor),
 * dipakai sebagai gambar sampul default kalau admin tidak memilih sampul
 * sendiri.
 */
export function extractFirstImageUrl(html: string): string | undefined {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
}
