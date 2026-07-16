import { notFound } from "next/navigation";
import { getTutorialVideoById } from "@/lib/data";
import TutorialForm from "../../TutorialForm";

export default async function EditTutorialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await getTutorialVideoById(id);
  if (!video) notFound();

  return (
    <div>
      <h2 className="font-display text-xl text-[var(--color-dark-green)]">
        Sunting Video Tutorial
      </h2>
      <div className="mt-6">
        <TutorialForm mode="edit" initialData={video} />
      </div>
    </div>
  );
}
