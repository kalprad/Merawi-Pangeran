import { notFound } from "next/navigation";
import { getMateriById } from "@/lib/data";
import MateriForm from "../../MateriForm";

export default async function EditMateriPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const materi = await getMateriById(id);
  if (!materi) notFound();

  return (
    <div>
      <h2 className="font-display text-xl text-[var(--color-dark-green)]">
        Sunting Materi
      </h2>
      <div className="mt-6">
        <MateriForm mode="edit" initialData={materi} />
      </div>
    </div>
  );
}
