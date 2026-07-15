"use client";

import { useCallback, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { compressImage } from "@/lib/compressImage";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  ListOrdered,
  ImagePlus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  uploadFolder: "Blog" | "Tentang Kami";
  placeholder?: string;
};

export default function RichTextEditor({
  value,
  onChange,
  uploadFolder,
  placeholder,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadAndInsert = useCallback(
    async (file: File, editorInstance: Editor) => {
      setUploading(true);
      try {
        const compressed = await compressImage(file);
        const formData = new FormData();
        formData.append("file", compressed);
        formData.append("folder", uploadFolder);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.url) {
          // Sisipkan gambar lalu paragraf kosong sesudahnya, supaya kursor
          // pindah ke luar gambar (bukan "menempel"/memilih gambar itu).
          // Kalau tidak begini, sisip gambar berikutnya akan MENGGANTIKAN
          // gambar yang baru saja disisipkan, bukan menambah gambar baru.
          editorInstance
            .chain()
            .focus()
            .insertContent([
              { type: "image", attrs: { src: data.url } },
              { type: "paragraph" },
            ])
            .run();
        }
      } finally {
        setUploading(false);
      }
    },
    [uploadFolder],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TiptapImage.configure({
        HTMLAttributes: { class: "rounded-2xl" },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Tulis isi berita di sini...",
      }),
      TextAlign.configure({
        types: ["paragraph", "heading"],
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose-content min-h-[220px] focus:outline-none",
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items ?? []);
        const imageItem = items.find((item) => item.type.startsWith("image/"));
        if (imageItem) {
          const file = imageItem.getAsFile();
          if (file && editor) {
            event.preventDefault();
            uploadAndInsert(file, editor);
            return true;
          }
        }
        return false;
      },
      handleDrop: (view, event) => {
        const files = Array.from(event.dataTransfer?.files ?? []);
        const imageFile = files.find((f) => f.type.startsWith("image/"));
        if (imageFile && editor) {
          event.preventDefault();
          uploadAndInsert(imageFile, editor);
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
  });

  function handleFileButtonChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file && editor) uploadAndInsert(file, editor);
  }

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex flex-wrap items-center gap-1 border-b border-[var(--color-border)] bg-[var(--color-muted)]/40 p-2">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="Tebal"
        >
          <BoldIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="Miring"
        >
          <ItalicIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          label="Garis bawah"
        >
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          label="Penomoran"
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-[var(--color-border)]" aria-hidden="true" />

        <ToolbarButton
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          label="Rata kiri"
        >
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          label="Rata tengah"
        >
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          label="Rata kanan"
        >
          <AlignRight size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          label="Rata kiri-kanan (justify)"
        >
          <AlignJustify size={16} />
        </ToolbarButton>

        <div className="mx-1 h-5 w-px bg-[var(--color-border)]" aria-hidden="true" />

        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          label="Sisipkan gambar"
          disabled={uploading}
        >
          <ImagePlus size={16} />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileButtonChange}
          className="hidden"
        />
        {uploading && (
          <span className="ml-1 text-xs text-[var(--color-muted-foreground)]">
            Mengunggah gambar...
          </span>
        )}
      </div>
      <EditorContent editor={editor} className="px-4 py-3" />
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active = false,
  disabled = false,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
        active
          ? "bg-[var(--color-dark-green)] text-[var(--color-beige)]"
          : "text-[var(--color-dark-green)] hover:bg-[var(--color-border)]/60"
      }`}
    >
      {children}
    </button>
  );
}
