"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [animating, setAnimating] = useState(true);

  return (
    <div
      key={pathname}
      className={animating ? "page-transition" : undefined}
      onAnimationEnd={() => setAnimating(false)}
    >
      {children}
    </div>
  );
}
