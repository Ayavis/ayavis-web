# Development

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

```bash
npm install
npm run dev
```

Runs at `http://localhost:3000`.

---

## Conventions

### Styling

The project mixes Tailwind utility classes and inline styles. Use:
- **Inline styles** for dynamic values, exact colours, and anything that changes at runtime
- **Tailwind** for layout utilities (`flex`, `grid-cols-*`, responsive breakpoints)
- **CSS variables** from `globals.css` for semantic tokens: `var(--bg)`, `var(--text-primary)`, `var(--text-secondary)`, `var(--text-muted)`, `var(--accent)`, `var(--border)`

Avoid Tailwind's CSS variable arbitrary syntax (`bg-[var(--bg)]`) — use inline styles instead.

### Colour palette

| Variable | Value | Use |
|----------|-------|-----|
| `--bg` | `#F4F6FB` | All section backgrounds |
| `--text-primary` | `#0C0F1E` | Headlines |
| `--text-secondary` | `rgba(12,15,30,0.55)` | Body copy |
| `--text-muted` | `rgba(12,15,30,0.35)` | Labels, captions |
| `--accent` | `#1A4FFF` | Buttons, highlights |
| `--border` | `rgba(30,50,120,0.08)` | Dividers |

**No dark backgrounds.** The canvas background is `#F4F6FB` to match.

### Copy rules

- Use "we / our" in body copy — never reference the firm by name in body text
- No em-dashes (`—`) anywhere; use a regular hyphen (`-`) or restructure the sentence
- No "not X" patterns (e.g. "not bolted on") — state what it is, not what it isn't

---

## Adding a section

1. Create `src/components/sections/YourSection.tsx`
2. Add `'use client'` at the top
3. Import and place it in `src/app/page.tsx` at the desired scroll position
4. If it needs a 3D zone, see [Adding a 3D zone](#adding-a-3d-zone)

---

## Adding a 3D zone

1. Create `src/components/canvas/zones/YourZone.tsx`
2. Extend `ZONE_RANGES` in `PersistentCanvas.tsx` with the new `{ ref, min, max }` scroll range
3. Add a `<group ref={...}><YourZone z={-N} /></group>` in `WorldScene`
4. Add a waypoint in `CameraRig.tsx` for the new Z position
5. Update `data/chapters.ts` with copy for the new chapter

**Zone Z positions** are spaced −80 apart. The next slot is `−480`.

---

## Working with the 3D canvas

- All 3D code lives in `components/canvas/`. It runs client-only (`ssr: false`).
- Read scroll progress from `lib/scrollStore.ts` — a plain mutable object. Never call `useState` inside `useFrame`.
- `useFrame` runs every render tick. Keep it cheap: no allocations, no DOM queries.
- Background colour is `#F4F6FB`. Match your material colours/emissive to look good on a light background — avoid heavy emissive bloom.
- Zone materials should set `transparent: true` if they use opacity — the culling system sets `mat.opacity` during fade transitions.

---

## GSAP + Lenis

Lenis handles smooth scrolling. GSAP ScrollTrigger is used for the Approach section sticky pin.

Do not drive Lenis and GSAP ScrollTrigger simultaneously with conflicting scroll sources. Lenis's RAF loop feeds GSAP via `ScrollTrigger.scrollerProxy` — if ScrollTrigger behaves unexpectedly, check that `lenis.on('scroll', ScrollTrigger.update)` is wired up.

---

## TypeScript

Strict mode is on. Key types are in `src/types/index.ts`.

When adding R3F geometry props, `rotation` belongs on `<mesh>` not on `<geometry>` — R3F geometry elements do not accept a `rotation` prop.

---

## Known constraints

- Next.js 16 has breaking changes from v14/v15 — consult `node_modules/next/dist/docs/` before modifying routing or metadata
- Tailwind v4 uses `@import "tailwindcss"` (not `@tailwind base/components/utilities`)
- `@react-three/postprocessing` is installed but Bloom is intentionally removed — it creates halos on light backgrounds
