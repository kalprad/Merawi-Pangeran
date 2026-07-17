# 003 — Fix Mascot getting stuck in "ticklish" state under reduced motion

- **Status**: TODO
- **Commit**: adf0793
- **Severity**: HIGH
- **Category**: Accessibility (Category 6)
- **Estimated scope**: 1 file — `src/components/Mascot.tsx`

## Problem

`Mascot.tsx` toggles a `reacting` boolean on click, applying the `.mascot-wiggle` CSS animation class and swapping to a "ticklish" image while `reacting` is `true`. It relies entirely on the DOM `animationend` event (via React's `onAnimationEnd`) to flip `reacting` back to `false`:

```tsx
// src/components/Mascot.tsx:70-73 — current
<div
  onClick={() => setReacting(true)}
  onAnimationEnd={() => setReacting(false)}
  className={`relative h-full w-full cursor-pointer ${reacting ? "mascot-wiggle" : ""}`}
>
```

```css
/* src/app/globals.css:433-435 — current, unaffected by this plan */
.mascot-wiggle {
  animation: mascot-wiggle 700ms ease-in-out;
}
```

```css
/* src/app/globals.css:486-503 — current, unaffected by this plan */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  .page-transition,
  .aurora-blob,
  .sakura-spin,
  .sakura-spin-boost,
  .mascot-float,
  .mascot-wiggle,
  /* ...more classes... */ {
    animation: none !important;
  }
  * {
    transition-duration: 0.001ms !important;
  }
}
```

Under `prefers-reduced-motion: reduce`, the global stylesheet sets `animation: none !important` on `.mascot-wiggle`. That's correct on its own — but it means the CSS animation never actually plays, so the native `animationend` DOM event never fires, so `onAnimationEnd` is never called, so `setReacting(false)` never runs. The mascot gets permanently stuck showing the ticklish pose after the very first click, for any visitor with reduced motion enabled — and since `{!reacting && EYES.map(...)}` (line 96) also gates the interactive eye-tracking overlay, that feature is permanently gone too, for the rest of the page's lifetime, with no way to recover short of a reload. This is a real functional break, not just missing polish, and it's silent — nothing in the console signals it.

## Target

Drive the reset with a `setTimeout` matching the animation's own duration (700ms — the exact value already declared in `.mascot-wiggle`'s `animation: mascot-wiggle 700ms ease-in-out;`) instead of relying solely on the DOM event. This way the reset happens on the same schedule whether or not the animation actually visually plays — correct for both normal and reduced-motion users — and it's re-armed safely on rapid re-clicks.

```tsx
// target
export default function Mascot({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gazePx, setGazePx] = useState({ x: 0, y: 0 });
  const [parallaxPx, setParallaxPx] = useState({ x: 0, y: 0 });
  const [reacting, setReacting] = useState(false);
  const reactTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleReact() {
    setReacting(true);
    if (reactTimeoutRef.current) clearTimeout(reactTimeoutRef.current);
    reactTimeoutRef.current = setTimeout(() => setReacting(false), 700);
  }

  useEffect(() => {
    return () => {
      if (reactTimeoutRef.current) clearTimeout(reactTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    // ...existing pointermove effect, unchanged...
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div /* ...unchanged parallax layer... */ >
        <div className="mascot-float relative h-full w-full">
          <div
            onClick={handleReact}
            className={`relative h-full w-full cursor-pointer ${reacting ? "mascot-wiggle" : ""}`}
          >
            {/* ...everything below unchanged... */}
```

Note `onAnimationEnd` is removed entirely — the `setTimeout` is now the single source of truth for when the reaction ends, so there is no longer a second, competing mechanism that can silently fail to fire.

## Repo conventions to follow

- `700ms` is not a new value — it's copied verbatim from the existing `.mascot-wiggle` animation duration in `src/app/globals.css:434`, so the reset timing stays perceptually identical to today's behavior for users who *do* see the animation.
- The `useRef` + `clearTimeout`-on-cleanup pattern for a timer tied to component lifetime already appears elsewhere in this codebase, e.g. `src/components/MascotIntro.tsx` uses a `timerRef` with the same clear-before-reschedule discipline for its bubble auto-advance — follow that same shape here.
- Do not touch `.mascot-wiggle`, `.mascot-float`, or any other CSS in `globals.css` — this plan is a pure JS/React fix; the CSS-level reduced-motion behavior (killing the animation) stays exactly as-is and is correct.

## Steps

1. In `src/components/Mascot.tsx`, after `const [reacting, setReacting] = useState(false);` (line 24), add:
   ```tsx
   const reactTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
   ```
2. Immediately after that (still before the existing `useEffect` on line 26), add a new handler function and a cleanup effect:
   ```tsx
   function handleReact() {
     setReacting(true);
     if (reactTimeoutRef.current) clearTimeout(reactTimeoutRef.current);
     reactTimeoutRef.current = setTimeout(() => setReacting(false), 700);
   }

   useEffect(() => {
     return () => {
       if (reactTimeoutRef.current) clearTimeout(reactTimeoutRef.current);
     };
   }, []);
   ```
3. Leave the existing pointermove `useEffect` (lines 26-57) completely untouched.
4. On the div at lines 70-74, change `onClick={() => setReacting(true)}` to `onClick={handleReact}`, and delete the `onAnimationEnd={() => setReacting(false)}` prop entirely. The `className` line (`` `relative h-full w-full cursor-pointer ${reacting ? "mascot-wiggle" : ""}` ``) stays exactly as-is.
5. Nothing else in the file changes — the two `<Image>` opacity swaps (lines 75-95) and the `{!reacting && EYES.map(...)}` eye overlay (lines 96-127) all keep reading `reacting` exactly as before; they're correct once `reacting` reliably flips back to `false`.

## Boundaries

- Do NOT touch `src/app/globals.css` — the `.mascot-wiggle` class, its animation, and the reduced-motion block all stay exactly as they are.
- Do NOT touch the pointermove/parallax/gaze-tracking logic (lines 26-57) — this plan only touches the click-reaction state machine.
- Do NOT touch `src/components/MascotIntro.tsx` even though it renders a `<Mascot>` — it doesn't pass any reaction-related props today and doesn't need to.
- Do NOT add a new dependency.
- If the current code has drifted from what's quoted above (commit `adf0793`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npx eslint src/components/Mascot.tsx` — both clean.
- **Feel check** (normal motion): go to `/` or `/tentang` (wherever `<Mascot>` renders), click the mascot. Confirm it still wiggles and shows the ticklish pose exactly as before, and returns to normal after roughly 700ms — behavior should look and time identically to before this change.
- **Feel check** (reduced motion — this is the actual bug fix, verify carefully): in DevTools, open the Rendering panel, set "Emulate CSS media feature `prefers-reduced-motion`" to `reduce`. Reload the page. Click the mascot:
  - Confirm the mascot swaps to the ticklish pose (even without the wiggle motion, since `.mascot-wiggle`'s animation is disabled) and — this is the fix — **confirm it swaps back to normal after ~700ms**, not stuck forever.
  - Confirm the eye-tracking sparkle overlay (the two small moving highlights in the mascot's eyes) reappears once it resets — move the mouse near the mascot afterward and confirm the eyes still track the cursor.
  - Click the mascot rapidly several times in a row (under reduced motion): confirm it doesn't get stuck, and the reset always happens ~700ms after the *last* click (not stacking up multiple pending resets).
- **Done when**: under `prefers-reduced-motion: reduce`, clicking the mascot no longer leaves it permanently in the ticklish state — it always recovers after ~700ms, matching normal-motion timing, and `tsc`/`eslint` are clean.
