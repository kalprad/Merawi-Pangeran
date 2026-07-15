export default function SakuraDecor({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={className}
      fill="none"
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
