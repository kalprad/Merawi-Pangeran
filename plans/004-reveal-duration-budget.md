# 004 — Bring Reveal's entrance duration under the UI budget

- **Status**: TODO
- **Commit**: adf0793
- **Severity**: HIGH
- **Category**: Easing & duration (Category 2) / Purpose & frequency (Category 1)
- **Estimated scope**: 1 file — `src/components/Reveal.tsx`

## Problem

`Reveal.tsx` is a scroll-triggered fade+translateY-in wrapper (IntersectionObserver-based) used at **41 call sites** across nearly every page and every grid item on the site (home, blog, si-bening, peta, tentang, team roster, materi, search results, gallery). AUDIT.md's duration budget table caps "UI animations" at under 300ms, and its frequency table (Category 1) is explicit: an animation hit "tens of times/day" should be "removed or drastically reduced." A component that fires on every section of every page as a visitor scrolls sits squarely in that "tens of times" bucket, not the "marketing/explanatory — can be longer" exemption (that exemption is for rare, deliberate hero moments, not the default wrapper for all content).

```tsx
// src/components/Reveal.tsx:51-59 — current
const style = {
  transitionProperty: "opacity, transform",
  transitionDuration: "700ms",
  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  transitionDelay: `${delay}ms`,
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : `translateY(${y}px)`,
  willChange: "opacity, transform",
};
```

Full component for reference:

```tsx
// src/components/Reveal.tsx:16-49 — current
export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 24,
  as = "div",
  id,
}: RevealProps) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.style.transition = "none";
      node.style.opacity = "1";
      node.style.transform = "none";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
```

Representative call sites showing the existing stagger convention (unaffected by this plan — see Boundaries):

```tsx
// src/app/tentang/page.tsx — example
<Reveal delay={120}>
  <MascotIntro className="mx-auto" />
</Reveal>

// src/components/DivisionGrid.tsx — example
<Reveal key={div.title} delay={i * 90}>
```

## Target

Cut `transitionDuration` from `700ms` to **`300ms`** — the ceiling of AUDIT.md's "UI animations stay under 300ms" budget. Keep the easing curve, the IntersectionObserver logic, the reduced-motion branch, and every prop's default value (`delay = 0`, `y = 24`) exactly as-is — this is a single-value change.

```tsx
// target — src/components/Reveal.tsx:51-59
const style = {
  transitionProperty: "opacity, transform",
  transitionDuration: "300ms",
  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  transitionDelay: `${delay}ms`,
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : `translateY(${y}px)`,
  willChange: "opacity, transform",
};
```

## Repo conventions to follow

- The easing curve `cubic-bezier(0.16, 1, 0.3, 1)` is correct as-is (AUDIT.md §2: entering content should use `ease-out`; this is already a strong ease-out curve) — do not change it, only the duration.
- This exact curve is reused elsewhere in the codebase (`src/app/globals.css`'s `.page-transition`, `.sakura-rotate-boost`, `.countdown-message-in`) — leave those untouched, this plan only touches `Reveal.tsx`.
- No shared `--duration-*` token exists yet; keep hardcoding the literal string `"300ms"` inline, matching how the current `"700ms"` is already hardcoded inline (both are JS inline-style values, not Tailwind classes, since `Reveal` drives its animation via `style={}` rather than a CSS class).

## Steps

1. In `src/components/Reveal.tsx`, on the `style` object (around line 51-59), change the `transitionDuration` value from `"700ms"` to `"300ms"`. That is the only line that changes in this file.

## Boundaries

- Do NOT change `transitionTimingFunction`, `y` (the default translateY offset, currently `24`), `threshold`/`rootMargin` on the `IntersectionObserver`, or the reduced-motion branch.
- Do NOT touch any of the 41 call sites' `delay={...}` props (e.g. `i * 60`, `i * 80`, `i * 90`, `Math.min(i, 6) * 60`, etc.) — retuning per-grid stagger caps across 15+ files is a separate, much larger effort and is explicitly out of scope for this plan. If you notice a specific grid where the shortened 300ms duration plus its existing stagger cap now feels off, note it in your final report — do not fix it here.
- Do NOT touch `src/app/globals.css` or any other file — this is a one-line, one-file change.
- Do NOT add a new dependency.
- If the current code has drifted from what's quoted above (commit `adf0793`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npx eslint src/components/Reveal.tsx` — both clean.
- **Feel check**: load the homepage (`/`) and scroll down slowly through every section. Confirm content still visibly fades and slides up into place as it enters the viewport (the effect should not feel like it vanished or become imperceptible), but each individual element should finish settling noticeably faster than before — snappier, not sluggish. Repeat on `/tentang` (which has staggered grids via `DivisionGrid` and `TeamGrid`) and `/blog` (via `BlogList`) — confirm staggered grid entrances still read as a coherent group animation, not simultaneous popping.
- Scroll quickly (fast scroll or PageDown repeatedly) through a long page (e.g. `/blog` with many posts, or `/materi`): confirm content is fully visible/settled much sooner after entering view than before, reducing the "still fading in" window during fast scrolling.
- In DevTools, toggle `prefers-reduced-motion` (Rendering panel) and reload: confirm content still appears instantly with no transition at all (the reduced-motion branch is untouched by this plan and should behave exactly as before).
- **Done when**: `Reveal`'s transition duration is 300ms, scroll entrances across at least 3 different pages still look and feel coherent (not abrupt/jarring), and `tsc`/`eslint` are clean.
