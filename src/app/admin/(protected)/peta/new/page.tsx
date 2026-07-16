import { getMapLayers } from "@/lib/data";
import PetaForm from "../PetaForm";

export default async function NewPetaPage() {
  const layers = await getMapLayers();

  return (
    <div>
      <h2 className="font-display text-xl text-[var(--color-dark-green)]">
        Tambah Jenis Peta
      </h2>
      <div className="mt-6">
        <PetaForm mode="create" defaultOrder={layers.length + 1} />
      </div>
    </div>
  );
}
