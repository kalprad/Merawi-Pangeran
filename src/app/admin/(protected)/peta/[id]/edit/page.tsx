import { notFound } from "next/navigation";
import { getMapLayerById } from "@/lib/data";
import PetaForm from "../../PetaForm";

export default async function EditPetaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const layer = await getMapLayerById(id);
  if (!layer) notFound();

  return (
    <div>
      <h2 className="font-display text-xl text-[var(--color-dark-green)]">
        Sunting Jenis Peta
      </h2>
      <div className="mt-6">
        <PetaForm mode="edit" initialData={layer} defaultOrder={layer.order} />
      </div>
    </div>
  );
}
