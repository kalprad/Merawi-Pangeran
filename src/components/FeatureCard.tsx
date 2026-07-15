import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

export default function FeatureCard({
  href,
  icon: Icon,
  title,
  description,
  external = false,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="glass-card group relative flex flex-col rounded-3xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-dark-green)] text-[var(--color-beige)]">
        <Icon size={22} aria-hidden="true" />
      </div>
      <h3 className="font-display mt-5 text-xl text-[var(--color-dark-green)]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
        {description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-midnight-teal)]">
        Lihat selengkapnya
        <ArrowUpRight
          size={16}
          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
    </Link>
  );
}
