import type { TutorialCategory } from "@/lib/types";
import TutorialForm from "../TutorialForm";

const VALID_CATEGORIES: TutorialCategory[] = ["jembatan", "irigasi", "talud", "rab"];

export default async function NewTutorialPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const defaultCategory = VALID_CATEGORIES.includes(category as TutorialCategory)
    ? (category as TutorialCategory)
    : undefined;

  return (
    <div>
      <h2 className="font-display text-xl text-[var(--color-dark-green)]">
        Tambah Video Tutorial
      </h2>
      <div className="mt-6">
        <TutorialForm mode="create" defaultCategory={defaultCategory} />
      </div>
    </div>
  );
}
