import { parseCategories } from "@/lib/categories";

export default function CategoryTags({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const categories = parseCategories(value);
  if (categories.length === 0) return null;

  return (
    <span className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>
      {categories.map((cat) => (
        <span
          key={cat}
          className="rounded-full bg-[var(--color-midnight-teal)]/10 px-2.5 py-0.5 text-xs font-semibold tracking-wide text-[var(--color-midnight-teal)] uppercase"
        >
          {cat}
        </span>
      ))}
    </span>
  );
}
