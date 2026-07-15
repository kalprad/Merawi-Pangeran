import { notFound } from "next/navigation";
import { getTeamMemberById } from "@/lib/data";
import TeamForm from "../../TeamForm";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getTeamMemberById(id);
  if (!member) notFound();

  return (
    <div>
      <h2 className="font-display text-xl text-[var(--color-dark-green)]">
        Sunting Anggota Tim
      </h2>
      <div className="mt-6">
        <TeamForm mode="edit" initialData={member} />
      </div>
    </div>
  );
}
