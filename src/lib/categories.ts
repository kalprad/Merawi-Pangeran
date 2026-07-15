/** Kategori disimpan sebagai satu string dipisah koma, misal "Sosialisasi, Edukasi". */
export function parseCategories(value: string): string[] {
  return value
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

export function formatCategories(categories: string[]): string {
  return categories.join(", ");
}

export function hasOverlap(a: string, b: string): boolean {
  const setA = new Set(parseCategories(a).map((c) => c.toLowerCase()));
  return parseCategories(b).some((c) => setA.has(c.toLowerCase()));
}
