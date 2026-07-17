export type SortKey = "newest" | "oldest" | "title-asc" | "title-desc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "title-asc", label: "Nama A-Z" },
  { value: "title-desc", label: "Nama Z-A" },
];

export function sortByDateOrTitle<T extends { title: string; date: string }>(
  items: T[],
  sort: SortKey,
): T[] {
  const sorted = [...items];
  sorted.sort((a, b) => {
    switch (sort) {
      case "newest":
        return b.date.localeCompare(a.date);
      case "oldest":
        return a.date.localeCompare(b.date);
      case "title-asc":
        return a.title.localeCompare(b.title, "id");
      case "title-desc":
        return b.title.localeCompare(a.title, "id");
    }
  });
  return sorted;
}
