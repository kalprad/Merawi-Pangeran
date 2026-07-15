export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function uniqueSlug(base: string, existing: string[]): string {
  let slug = slugify(base) || "tanpa-judul";
  let counter = 2;
  while (existing.includes(slug)) {
    slug = `${slugify(base) || "tanpa-judul"}-${counter}`;
    counter += 1;
  }
  return slug;
}
