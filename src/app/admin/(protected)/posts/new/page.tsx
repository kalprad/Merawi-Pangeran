import PostForm from "../PostForm";

export default function NewPostPage() {
  return (
    <div>
      <h2 className="font-display text-xl text-[var(--color-dark-green)]">
        Tulis Berita Baru
      </h2>
      <div className="mt-6">
        <PostForm mode="create" />
      </div>
    </div>
  );
}
