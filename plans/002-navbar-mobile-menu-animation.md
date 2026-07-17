# 002 — Animate the mobile nav menu open/close

- **Status**: TODO
- **Commit**: adf0793
- **Severity**: HIGH
- **Category**: Missed opportunity (Category 8)

- **Estimated scope**: 1 file — `src/components/Navbar.tsx`

## Problem

The mobile navigation menu (the panel that drops down under the header when the hamburger button is tapped) mounts via a bare `{open && (...)}` conditional with zero animation anywhere in the block. It teleports open and closed. This is hit by every visitor on a phone or narrow viewport — the single most-used piece of navigation chrome on mobile.

```tsx
// src/components/Navbar.tsx:88-127 — current
<button
  type="button"
  aria-label={open ? "Tutup menu" : "Buka menu"}
  aria-expanded={open}
  onClick={() => setOpen((v) => !v)}
  className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-dark-green)] hover:bg-[var(--color-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] lg:hidden"
>
  {open ? <X size={24} /> : <Menu size={24} />}
</button>
</div>
</div>

{open && (
  <nav className="border-t border-[var(--color-border)] bg-[var(--color-beige)]/80 px-4 pb-4 backdrop-blur-xl lg:hidden">
    <ul className="flex flex-col gap-1 pt-2">
      {navLinks.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/"
            : pathname?.startsWith(link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-4 py-3 text-base font-medium ${
                active
                  ? "bg-[var(--color-dark-green)] text-[var(--color-beige)]"
                  : "text-[var(--color-dark-green)] hover:bg-[var(--color-muted)]"
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  </nav>
)}
```

The full component state at the top, for reference:

```tsx
// src/components/Navbar.tsx:10-20 — current
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
```

## Target

The panel expands open and collapses shut using a **height + opacity transition**, 200ms, `cubic-bezier(0.23, 1, 0.32, 1)` (AUDIT.md's strong ease-out token) — using the same "keep mounted through the exit, then unmount" pattern as plan 001, since a plain conditional mount cannot animate an exit at all. Height is used here (not `transform`) deliberately: the menu needs to push page content down as it opens/closes (it's in normal document flow, not an overlay), so animating a `grid-template-rows` trick (the standard CSS way to animate to/from `height: auto` without layout jank) is the correct tool — see Steps for the exact mechanism.

```tsx
// target
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [renderMenu, setRenderMenu] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      setRenderMenu(true);
      const raf = requestAnimationFrame(() => setMenuVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setMenuVisible(false);
    const timeout = setTimeout(() => setRenderMenu(false), 200);
    return () => clearTimeout(timeout);
  }, [open]);

  // ...unchanged JSX above the mobile menu...

  {renderMenu && (
    <div
      data-state={menuVisible ? "open" : "closed"}
      className="grid transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr] lg:hidden"
    >
      <nav className="overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-beige)]/80 backdrop-blur-xl data-[state=closed]:border-t-0">
        <ul className="flex flex-col gap-1 px-4 pt-2 pb-4">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-4 py-3 text-base font-medium ${
                    active
                      ? "bg-[var(--color-dark-green)] text-[var(--color-beige)]"
                      : "text-[var(--color-dark-green)] hover:bg-[var(--color-muted)]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  )}
```

Note the `data-[state=closed]:border-t-0` on the inner `<nav>`: without it, the 1px top border stays visible even at `grid-rows-[0fr]` (a 0fr row still renders its child's border), producing a stray hairline while closed/animating shut — this removes that seam.

## Repo conventions to follow

- Same as plan 001: hardcode `cubic-bezier(0.23, 1, 0.32, 1)` via Tailwind's arbitrary-value syntax (`ease-[cubic-bezier(0.23,1,0.32,1)]`) — no shared token file exists yet, don't create one here.
- `200ms` matches the dominant duration already used site-wide.
- The `grid-template-rows: 0fr → 1fr` technique (animating a `<div className="grid">` wrapper's row track, with `overflow-hidden` on the direct child) is the standard CSS-only way to transition an element to/from `height: auto` without hardcoding a pixel height or using JS to measure `scrollHeight` — appropriate here since the exact open height depends on how many nav links exist and font-size/viewport, none of which should be hardcoded.
- `data-[state=...]:` Tailwind variants: same syntax as introduced in plan 001 (if plan 001 hasn't been executed yet, this is still valid standalone Tailwind v4 syntax, no dependency on plan 001's code).

## Steps

1. In `src/components/Navbar.tsx`, after `const [open, setOpen] = useState(false);` (line 12), add:
   ```tsx
   const [renderMenu, setRenderMenu] = useState(false);
   const [menuVisible, setMenuVisible] = useState(false);
   ```
2. After the existing scroll-listener `useEffect` (ends around line 20), add a new effect:
   ```tsx
   useEffect(() => {
     if (open) {
       setRenderMenu(true);
       const raf = requestAnimationFrame(() => setMenuVisible(true));
       return () => cancelAnimationFrame(raf);
     }
     setMenuVisible(false);
     const timeout = setTimeout(() => setRenderMenu(false), 200);
     return () => clearTimeout(timeout);
   }, [open]);
   ```
3. Replace the block starting at `{open && (` (line 100) through its closing `)}` (line 126) with:
   ```tsx
   {renderMenu && (
     <div
       data-state={menuVisible ? "open" : "closed"}
       className="grid transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr] lg:hidden"
     >
       <nav
         data-state={menuVisible ? "open" : "closed"}
         className="overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-beige)]/80 backdrop-blur-xl data-[state=closed]:border-t-0"
       >
         <ul className="flex flex-col gap-1 px-4 pt-2 pb-4">
           {navLinks.map((link) => {
             const active =
               link.href === "/"
                 ? pathname === "/"
                 : pathname?.startsWith(link.href);
             return (
               <li key={link.href}>
                 <Link
                   href={link.href}
                   onClick={() => setOpen(false)}
                   className={`block rounded-lg px-4 py-3 text-base font-medium ${
                     active
                       ? "bg-[var(--color-dark-green)] text-[var(--color-beige)]"
                       : "text-[var(--color-dark-green)] hover:bg-[var(--color-muted)]"
                   }`}
                 >
                   {link.label}
                 </Link>
               </li>
             );
           })}
         </ul>
       </nav>
     </div>
   )}
   ```
   Note the original `<nav>` had `className="border-t ... px-4 pb-4 backdrop-blur-xl lg:hidden"` and the `<ul>` had `pt-2`; in the target the outer `<div>` now owns `lg:hidden`, the `<nav>` owns `overflow-hidden` (required for the grid-rows technique to visually clip the content while collapsed) plus the border/background/blur, and `px-4 pb-4` moved onto the `<ul>` alongside its existing `pt-2` — this keeps the exact same visual padding as before, just relocated so the outer grid wrapper has no padding of its own (padding on the animating grid track would prevent it from fully collapsing to `0fr`).

## Boundaries

- Do NOT touch the desktop `<nav>` (lines 52-72, the `hidden ... lg:flex` one) or the search/hamburger buttons themselves beyond what's shown — only the mobile dropdown panel changes.
- Do NOT change `navLinks` data, the active-link highlighting logic, or any `aria-*`/`onClick` behavior — only add animation state and restructure the wrapping markup as specified.
- Do NOT add a new dependency.
- Do NOT add new `prefers-reduced-motion` handling here — the existing sitewide blanket rule in `src/app/globals.css` already forces this new transition to be near-instant for reduced-motion users; just confirm it in Verification, don't modify that CSS block.
- If the current code has drifted from what's quoted above (commit `adf0793`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npx tsc --noEmit` and `npx eslint src/components/Navbar.tsx` — both clean.
- **Feel check**: resize the browser (or use a real phone) to below the `lg` breakpoint, load any page, tap the hamburger button:
  - Confirm the menu panel visibly grows open (height animates from 0) over ~200ms, not an instant snap — content should not overflow/clip awkwardly mid-animation.
  - Confirm there's no stray horizontal line/border visible while the panel is collapsed or mid-close.
  - Tap a nav link inside the open menu: confirm the menu closes (animates shut) as navigation happens, not before/after with a visible flash of the old page.
  - Tap the hamburger again to close without navigating: confirm it animates shut, not an instant disappearance.
  - Rapidly tap the hamburger open/closed several times in a row: confirm no visual glitching, stuck-half-open state, or console errors.
  - In DevTools, toggle `prefers-reduced-motion` (Rendering panel) and repeat: menu should still open/close correctly, just without the visible height animation.
- **Done when**: the mobile menu visibly animates open and closed at ~200ms, no stray border artifacts, `tsc`/`eslint` clean, rapid toggling doesn't break state.
