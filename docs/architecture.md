# Architecture

## Source layout

```
src/
├── app/                    # Next.js App Router entry
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Page composition — section order lives here
│   └── globals.css         # CSS variables, Tailwind imports
│
├── components/
│   ├── canvas/             # Three.js / WebGL world
│   │   ├── PersistentCanvas.tsx   # Fixed canvas + zone visibility culling
│   │   ├── CameraRig.tsx          # Scroll-driven camera travel
│   │   └── zones/                 # One 3D scene per scroll chapter
│   │       ├── HeroZone.tsx
│   │       ├── CloudZone.tsx
│   │       ├── SecurityZone.tsx
│   │       ├── DataZone.tsx
│   │       ├── EngineeringZone.tsx
│   │       └── OperationsZone.tsx
│   │
│   ├── sections/           # Full-page scroll sections (HTML layer)
│   │   ├── HeroSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── ApproachSection.tsx
│   │   ├── ArchitectureSection.tsx
│   │   ├── ChapterSection.tsx     # Generic chapter wrapper (reused 5×)
│   │   └── ContactSection.tsx
│   │
│   ├── diagrams/           # Data-visualisation components
│   │   └── AnimatedArchitecture.tsx
│   │
│   ├── layout/             # App chrome
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── SmoothScroll.tsx       # Lenis wrapper
│   │
│   └── ui/                 # Shared primitives
│       ├── Button.tsx
│       └── Logo.tsx
│
├── data/
│   ├── chapters.ts         # Copy and metadata for each scroll chapter
│   └── architecture.ts     # Reference architecture nodes (8 layers × 13+ nodes)
│
├── hooks/
│   └── useReducedMotion.ts
│
├── lib/
│   └── scrollStore.ts      # Shared mutable scroll + mouse state (no React)
│
└── types/
    └── index.ts
```

---

## Scroll model

The page is one tall document. Scroll progress `[0, 1]` drives everything.

```
scrollState.progress = window.scrollY / (scrollHeight - innerHeight)
```

`scrollStore.ts` holds a plain mutable object — no React state, no context. Both the HTML layer (GSAP) and the WebGL layer (useFrame) read from it each frame.

```ts
// lib/scrollStore.ts
export const scrollState = { progress: 0, mouseX: 0, mouseY: 0 }
```

`ScrollDriver` (inside `PersistentCanvas`) attaches the scroll and mouse listeners and writes to `scrollState` on every event.

---

## 3D canvas system

A single `<Canvas>` is fixed to the viewport (`position: fixed, z-index: 0`). HTML sections sit on top (`z-index: 10`), transparent, letting the 3D scene show through.

### Zone layout

Zones are positioned along the Z-axis at fixed intervals:

| Zone | Z position |
|------|-----------|
| Hero | 0 |
| Cloud | −80 |
| Security | −160 |
| Data | −240 |
| Engineering | −320 |
| Operations | −400 |

### Zone culling

Each zone lives in a `<group>`. `WorldScene` lerps a per-zone `alpha` value (0→1) based on scroll progress and applies it to all materials via `group.traverse()`. Zones outside their scroll range fade out and are set `visible = false` to skip GPU draw calls.

```
ZONE_RANGES = [
  { ref: 'hero',        min: 0.00, max: 0.58 },
  { ref: 'cloud',       min: 0.54, max: 0.70 },
  ...
]
```

### Camera travel

`CameraRig` lerps the camera position through waypoints keyed to `scrollState.progress`. Fast lerp (`0.15`) when the camera is far from target; slower (`0.055`) for fine approaches.

```
waypoints: [
  { p: 0.00, z: 14  },   // hero
  { p: 0.55, z: 14  },   // still at hero
  { p: 0.615, z: -66 },  // cloud
  ...
  { p: 1.00, z: -440 },  // operations
]
```

---

## Sections and chapters

`page.tsx` composes sections in order. The five domain chapters (Cloud, Security, Data, Engineering, Operations) are driven by a `CHAPTER_MAP` array — adding a chapter means adding an entry there and a corresponding entry in `data/chapters.ts`.

`ChapterSection` is a generic component that renders a frosted-glass text block at the bottom of a transparent `100vh` section. The 3D canvas behind it shows the matching zone.

---

## Approach section (GSAP sticky scroll)

`ApproachSection` pins itself for `400vh` while four phases (Strategy → Design → Build → Operate) cross-fade. The GSAP timeline uses `autoAlpha` (opacity + visibility) with explicit durations so fade-out completes before fade-in begins — preventing content overlap.

---

## Reference architecture diagram

`AnimatedArchitecture` renders 8 horizontal layer rows. Each layer contains 13–14 node chips.

- **Mouse parallax**: middle layers (1–6) shift `±12–20px` on mouse move
- **Drag scroll**: `mousedown` + drag manipulates `container.scrollLeft`; label column stays sticky
- **Mobile**: `overflow-x: auto` + `minWidth: 900px` enables native swipe
