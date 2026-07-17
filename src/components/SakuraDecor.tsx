"use client";

import { useState } from "react";

export default function SakuraDecor({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const [boosting, setBoosting] = useState(false);

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      fill="none"
      onClick={() => setBoosting(true)}
      onAnimationEnd={() => setBoosting(false)}
      style={style}
      className={`cursor-pointer transition-transform duration-300 hover:scale-110 ${
        boosting ? "sakura-spin-boost" : "sakura-spin"
      } ${className}`}
    >
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="50"
          cy="30"
          rx="10"
          ry="16"
          fill="var(--color-rosy-brown)"
          opacity="0.85"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="7" fill="var(--color-beige)" />
    </svg>
  );
}
