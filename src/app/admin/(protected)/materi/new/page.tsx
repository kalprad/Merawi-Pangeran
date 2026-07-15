import MateriForm from "../MateriForm";

export default function NewMateriPage() {
  return (
    <div>
      <h2 className="font-display text-xl text-[var(--color-dark-green)]">
        Tambah Materi Sosialisasi
      </h2>
      <div className="mt-6">
        <MateriForm mode="create" />
      </div>
    </div>
  );
}
