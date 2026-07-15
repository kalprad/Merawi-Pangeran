import TeamForm from "../TeamForm";

export default function NewTeamMemberPage() {
  return (
    <div>
      <h2 className="font-display text-xl text-[var(--color-dark-green)]">
        Tambah Anggota Tim
      </h2>
      <div className="mt-6">
        <TeamForm mode="create" />
      </div>
    </div>
  );
}
