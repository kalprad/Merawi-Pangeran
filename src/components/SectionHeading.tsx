export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <span className="text-xs font-semibold tracking-[0.2em] text-[var(--color-midnight-teal)] uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display mt-2 text-3xl text-[var(--color-dark-green)] sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-[var(--color-muted-foreground)]">
          {description}
        </p>
      )}
    </div>
  );
}
