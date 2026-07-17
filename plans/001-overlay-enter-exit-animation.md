# 001 — Add enter/exit animation to modals, lightbox, and map dropdown

- **Status**: TODO
- **Commit**: adf0793
- **Severity**: HIGH
- **Category**: Missed opportunity (Category 8) / Interruptibility (Category 4)
- **Estimated scope**: 4 files — `src/components/TeamGrid.tsx`, `src/components/DivisionGrid.tsx`, `src/components/GalleryCarousel.tsx`, `src/components/InteractiveMap.tsx`

## Problem

Four different overlay elements across the site mount via a bare `{condition && (<div>...)}` React conditional, with zero CSS transition anywhere in the block. They pop into existence and disappear instantly — no fade, no scale, no sense of where they came from. This is the single most visible "unfinished" feel on the site, hit by anyone who opens a team-member card, a cluster card, a gallery photo, or the map's layer switcher.

```tsx
// src/components/TeamGrid.tsx:73-92 — current
{active && (
  <div
    role="dialog"
    aria-modal="true"
    aria-label={active.name}
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    onClick={() => setActive(null)}
  >
    <div
      className="glass-card relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-[var(--color-surface)] p-6 sm:p-8"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setActive(null)}
        aria-label="Tutup"
        className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--color-dark-green)] hover:bg-[var(--color-muted)]"
      >
        <X size={20} />
      </button>
      {/* ...active.photo, active.name, active.role, etc. below... */}
```

```tsx
// src/components/DivisionGrid.tsx:70-88 — current
{active &&
  createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={active.title}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={() => setActive(null)}
    >
      {/* Key di judul klaster supaya state halaman (page) mulai dari 0
          lagi setiap kali klaster yang dibuka berganti. */}
      <DivisionModal
        key={active.title}
        division={active}
        onClose={() => setActive(null)}
      />
    </div>,
    document.body,
  )}
```

```tsx
// src/components/DivisionGrid.tsx:113-117 — current (the panel root, inside DivisionModal)
return (
  <div
    className="glass-card relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-[var(--color-surface)] p-6 sm:p-8"
    onClick={(e) => e.stopPropagation()}
  >
```

```tsx
// src/components/GalleryCarousel.tsx:192-239 — current
{active && (
  <div
    role="dialog"
    aria-modal="true"
    aria-label={active.name}
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
    onClick={close}
  >
    <button /* close button */ >...</button>
    {photos.length > 1 && ( <> {/* prev/next buttons */} </> )}
    <div
      className="relative flex max-h-[85vh] max-w-4xl flex-col items-center"
      onClick={(e) => e.stopPropagation()}
    >
      {/* img + "Buka di Google Drive" link */}
    </div>
  </div>
)}
```

```tsx
// src/components/InteractiveMap.tsx:307-311 — current (inside LayerDropdown)
{open && (
  <ul
    role="listbox"
    className="glass-card absolute top-full left-0 z-[3000] mt-2 w-64 overflow-hidden rounded-2xl p-1.5"
  >
    {/* layer options */}
```

`active` in `GalleryCarousel.tsx` is a *derived* value, not stored state directly:

```tsx
// src/components/GalleryCarousel.tsx:14, 36 — current
const [activeIndex, setActiveIndex] = useState<number | null>(null);
...
const active = activeIndex !== null ? photos[activeIndex] : null;
```

This matters because a hard `{active && ...}` conditional also means there is **no way to animate the exit** at all today — the moment the trigger sets the underlying state back to `null`/`false`, React removes the DOM node in the same commit, before any CSS transition has a chance to run.

## Target

Every one of the four overlays gets the same two-part treatment:

1. **Entrance**: fade in (`opacity 0→1`) + scale in (`scale(0.95)→scale(1)`) over **200ms**, `cubic-bezier(0.23, 1, 0.32, 1)` (AUDIT.md's strong ease-out token). The two full-screen modals (TeamGrid, DivisionGrid) and the lightbox (GalleryCarousel) are **exempt from trigger-origin** — center scale is correct for them (AUDIT.md §3: "Modals are exempt — they appear centered"). The `InteractiveMap` layer dropdown is **not** a modal — it must scale from its trigger corner: `transform-origin: top left` (it renders `absolute top-full left-0` of its button).
2. **Exit**: the same fade+scale reversed, also 200ms, before the DOM node is actually removed — achieved by keeping the element mounted for 200ms after its trigger goes false, driven by a `data-state="open" | "closed"` attribute and Tailwind's `data-[state=...]:` variant.

Target code for `TeamGrid.tsx` (the other three files get the equivalent treatment, spelled out per-file in Steps below):

```tsx
// target
const [active, setActive] = useState<TeamMember | null>(null);
const [renderedMember, setRenderedMember] = useState<TeamMember | null>(null);
const [visible, setVisible] = useState(false);

useEffect(() => {
  if (active) {
    setRenderedMember(active);
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }
  setVisible(false);
  const timeout = setTimeout(() => setRenderedMember(null), 200);
  return () => clearTimeout(timeout);
}, [active]);

// ...unchanged Escape-key effect stays keyed off `active`, not `renderedMember`...

{renderedMember && (
  <div
    role="dialog"
    aria-modal="true"
    aria-label={renderedMember.name}
    data-state={visible ? "open" : "closed"}
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=closed]:opacity-0 data-[state=open]:opacity-100"
    onClick={() => setActive(null)}
  >
    <div
      className="glass-card relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-[var(--color-surface)] p-6 sm:p-8 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100"
      data-state={visible ? "open" : "closed"}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={() => setActive(null)}
        aria-label="Tutup"
        className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--color-dark-green)] hover:bg-[var(--color-muted)]"
      >
        <X size={20} />
      </button>
      {/* everywhere below that referenced `active.photo`, `active.name`, `active.role`,
          `active.prodi`, `active.instagram`, `active.programs` now reads from
          `renderedMember` instead — same properties, new variable name only. */}
```

## Repo conventions to follow

- No shared `--ease-*`/`--duration-*` tokens exist yet (confirmed absent site-wide) — do not invent one for this plan. Hardcode `cubic-bezier(0.23, 1, 0.32, 1)` inline via Tailwind's arbitrary-value syntax (`ease-[cubic-bezier(0.23,1,0.32,1)]`), matching how `src/components/ReleaseCountdown.tsx` and `src/app/globals.css`'s `@keyframes` already hardcode their own curves inline rather than referencing a token.
- `200ms` matches the dominant duration already used site-wide (`duration-200` appears ~40 times across the codebase) — reuse it rather than picking a new value.
- `data-[state=...]:` Tailwind variants are not used anywhere yet in this codebase, but this is standard Tailwind v4 syntax (arbitrary data-attribute variant) and is the cleanest way to drive a two-state transition without a new dependency.
- Keep every existing `aria-*`, `role`, `onClick`, and Escape-key-listener behavior byte-for-byte identical — only add the mount/visibility state, the `data-state` attribute, and the transition classes.

## Steps

### 1. `src/components/TeamGrid.tsx`

1. In the component (around line 16, right after `const [active, setActive] = useState<TeamMember | null>(null);`), add:
   ```tsx
   const [renderedMember, setRenderedMember] = useState<TeamMember | null>(null);
   const [visible, setVisible] = useState(false);

   useEffect(() => {
     if (active) {
       setRenderedMember(active);
       const raf = requestAnimationFrame(() => setVisible(true));
       return () => cancelAnimationFrame(raf);
     }
     setVisible(false);
     const timeout = setTimeout(() => setRenderedMember(null), 200);
     return () => clearTimeout(timeout);
   }, [active]);
   ```
2. Leave the existing `useEffect` that adds the `Escape`-key listener (around line 19-26) untouched — it stays keyed off `active`, not `renderedMember` (so Escape still works immediately, not delayed).
3. Change the render guard on line 73 from `{active && (` to `{renderedMember && (`.
4. On the outer dialog `<div>` (lines 74-80): add `data-state={visible ? "open" : "closed"}` and append to its `className`: `transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=closed]:opacity-0 data-[state=open]:opacity-100`. Change `aria-label={active.name}` to `aria-label={renderedMember.name}`.
5. On the inner panel `<div>` (lines 81-84): add `data-state={visible ? "open" : "closed"}` and append to its `className`: `transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100`.
6. Everywhere below (lines ~94-150) that reads `active.photo`, `active.name`, `active.role`, `active.prodi`, `active.instagram`, `active.programs` — replace `active.` with `renderedMember.`. Do NOT touch the `onClick={() => setActive(null)}` calls — those stay calling `setActive`, not `setRenderedMember` (closing still means "set the source of truth to null"; the delayed-unmount effect handles the rest).

### 2. `src/components/DivisionGrid.tsx`

1. In the top-level `DivisionGrid` component (around line 12, after `const [active, setActive] = useState<Division | null>(null);`), add the identical pattern as step 1.1 above, but typed `Division | null` and named `renderedDivision`/`visible`.
2. Change line 70 from `{active &&` to `{renderedDivision &&`, and update `aria-label={active.title}` (line 75) to `aria-label={renderedDivision.title}`.
3. On the backdrop `<div>` (lines 72-77): add `data-state={visible ? "open" : "closed"}` and the same backdrop transition classes as TeamGrid step 4.
4. `<DivisionModal key={active.title} division={active} onClose={...} />` (lines 81-85) becomes `<DivisionModal key={renderedDivision.title} division={renderedDivision} onClose={() => setActive(null)} />`. Also pass the new `visible` flag down: add a `visible: boolean` prop to `DivisionModal`'s prop type and pass `visible={visible}`.
5. Inside `DivisionModal` (the panel root, lines 113-117): add `data-state={visible ? "open" : "closed"}` and append to its `className` the same panel transition classes as TeamGrid step 5.
6. `DivisionModal`'s own `page`/`isRosterPage`/`activeMember` logic is unaffected — it already receives `division` as a prop and doesn't reference the parent's `active` directly, so no other renames are needed inside it.

### 3. `src/components/GalleryCarousel.tsx`

1. After line 14 (`const [activeIndex, setActiveIndex] = useState<number | null>(null);`), add:
   ```tsx
   const [renderedPhoto, setRenderedPhoto] = useState<DrivePhoto | null>(null);
   const [visible, setVisible] = useState(false);
   ```
2. Change line 36 from `const active = activeIndex !== null ? photos[activeIndex] : null;` to keep `active` as-is (still needed for prev/next/keyboard logic elsewhere), then add right after it:
   ```tsx
   useEffect(() => {
     if (active) {
       setRenderedPhoto(active);
       const raf = requestAnimationFrame(() => setVisible(true));
       return () => cancelAnimationFrame(raf);
     }
     setVisible(false);
     const timeout = setTimeout(() => setRenderedPhoto(null), 200);
     return () => clearTimeout(timeout);
   }, [active]);
   ```
3. Change line 192 from `{active && (` to `{renderedPhoto && (`, and `aria-label={active.name}` (line 196) to `aria-label={renderedPhoto.name}`.
4. On the outer dialog `<div>` (lines 193-199): add `data-state={visible ? "open" : "closed"}` and the same backdrop transition classes as TeamGrid step 4 (note this modal uses `bg-black/85` not `bg-black/70` — keep that, just append the transition/data-variant classes).
5. On the inner content wrapper `<div>` (lines 236-239, `className="relative flex max-h-[85vh] max-w-4xl flex-col items-center"`): add `data-state={visible ? "open" : "closed"}` and append the same panel transition classes as TeamGrid step 5.
6. Lines 242-243, 248 reference `active.imageUrl`, `active.name`, `active.viewUrl` — change all three to `renderedPhoto.imageUrl`, `renderedPhoto.name`, `renderedPhoto.viewUrl`. The prev/next/close buttons (lines 200-233) keep calling `close`/`showPrev`/`showNext` unchanged — those already operate on `activeIndex`, not the rendered snapshot.

### 4. `src/components/InteractiveMap.tsx` (the `LayerDropdown` function, ~line 261 onward)

This one has no payload to snapshot (`open` is a plain boolean, the `layers`/`activeLayer` list doesn't change based on `open`), so it's simpler — no "rendered" object needed, just a delayed-unmount boolean.

1. After `const [open, setOpen] = useState(false);` (line 270), add:
   ```tsx
   const [renderDropdown, setRenderDropdown] = useState(false);
   const [dropdownVisible, setDropdownVisible] = useState(false);

   useEffect(() => {
     if (open) {
       setRenderDropdown(true);
       const raf = requestAnimationFrame(() => setDropdownVisible(true));
       return () => cancelAnimationFrame(raf);
     }
     setDropdownVisible(false);
     const timeout = setTimeout(() => setRenderDropdown(false), 200);
     return () => clearTimeout(timeout);
   }, [open]);
   ```
2. Change line 307 from `{open && (` to `{renderDropdown && (`.
3. On the `<ul>` (lines 308-311): add `data-state={dropdownVisible ? "open" : "closed"}` and append to its `className`: `origin-top-left transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100`.
4. Leave the outside-click handler (lines 273-278, checking `containerRef`) and the Escape handler (lines 279-281) untouched — they already call `setOpen(false)`, which now correctly triggers the same delayed-unmount path as the trigger button's own click.

## Boundaries

- Do NOT touch `src/components/Navbar.tsx`, `src/components/Mascot.tsx`, or `src/components/Reveal.tsx` — those are separate plans (002, 003, 004).
- Do NOT change any markup structure, ARIA attributes, click-outside/Escape logic, or component prop shapes beyond what's specified above (adding `visible`/`renderDropdown`/`renderedX` state and the `data-state` + transition classes).
- Do NOT add a new dependency (no Framer Motion, no `@formkit/auto-animate`, etc.) — this is plain React state + Tailwind CSS only, matching the rest of the codebase.
- Do NOT create a shared hook/component for this pattern even though it repeats 4 times — write it inline in each file exactly as specified, so each file stays independently correct and the four steps can be done in any order without a cross-file dependency.
- Do NOT add new `prefers-reduced-motion` handling in these four files. The existing sitewide rule in `src/app/globals.css` (`@media (prefers-reduced-motion: reduce) { * { transition-duration: 0.001ms !important; } }`) already forces every transition added here to be near-instant for reduced-motion users — that's a separate, already-identified issue (not part of this plan) but it means these new transitions are already covered; just verify it in the Verification section below, don't touch that CSS block.
- If a step doesn't match the code you find (drift since commit `adf0793`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npx tsc --noEmit` (expect no errors) and `npx eslint src/components/TeamGrid.tsx src/components/DivisionGrid.tsx src/components/GalleryCarousel.tsx src/components/InteractiveMap.tsx` (expect no errors/warnings).
- **Feel check** — for each of the four (open the site, trigger each interaction):
  - **TeamGrid**: go to `/tentang`, click a team member card. Confirm the backdrop fades in and the card scales up from 95%→100% while fading in, over roughly 200ms — not an instant snap. Click the backdrop (or the X) to close: confirm the card visibly scales down and fades out before disappearing (not an instant removal). Click a different member quickly right after closing — confirm no visual glitch (old content flashing) during the transition.
  - **DivisionGrid**: go to `/tentang`, click a cluster card. Same checks as above — entrance and exit both animate, roster/member pagination inside the modal (unrelated to this plan) still works.
  - **GalleryCarousel**: go to `/galeri`, click a photo. Same entrance/exit checks. Use the prev/next arrows rapidly — confirm no flicker or broken image reference during rapid navigation (renderedPhoto should always show the currently-selected photo, not a stale one, except during the brief exit fade when closing).
  - **InteractiveMap**: go to `/peta`, click the layer switcher button. Confirm the dropdown scales in from its top-left corner (not from center) while fading in. Click a layer option or click outside to close — confirm it scales/fades back out before disappearing. Press Escape while it's open — same close animation.
  - In DevTools, set the Animations panel (or just visually slow down by recording) and confirm none of the four ever start from `scale(0)` — they should start visibly at ~95% size, not from nothing.
  - Toggle `prefers-reduced-motion` in DevTools' Rendering panel, repeat all four interactions, and confirm they still open/close correctly (just without the visible scale/fade motion, per the existing sitewide reduced-motion rule) — no broken/stuck state.
- **Done when**: all four overlays visibly fade+scale in on open and fade+scale out on close at ~200ms, `tsc`/`eslint` are clean, and none of the four ever shows stale content (wrong member/division/photo) during a transition.
