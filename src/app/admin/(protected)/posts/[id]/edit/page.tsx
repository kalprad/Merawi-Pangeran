import { notFound } from "next/navigation";
import { getPostById } from "@/lib/data";
import PostForm from "../../PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div>
      <h2 className="font-display text-xl text-[var(--color-dark-green)]">
        Sunting Berita
      </h2>
      <div className="mt-6">
        <PostForm mode="edit" initialData={post} />
      </div>
    </div>
  );
}
