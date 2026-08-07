# Deployment

## Build

```bash
npm run build   # outputs to .next/
npm run start   # serves the production build locally
```

The build produces a statically prerendered site (`○ Static`). No server-side data fetching — all content is hardcoded in `src/data/`.

## Environment variables

None required. The site has no external API calls, no forms, no analytics.

Contact link is a `mailto:` — no backend needed.

## Hosting

Any static or Node.js host works. Recommended: **Vercel** (zero config for Next.js).

```bash
# Via Vercel CLI
npx vercel
```

Minimum requirements for any host:
- Node.js 20+ (for `npm run build`)
- Serve the `.next/` directory with the Next.js start command, or export as static files

## Static export (optional)

If you need a pure static export with no Node.js server:

```ts
// next.config.ts
const config: NextConfig = {
  output: 'export',
}
```

Then `npm run build` produces a static `out/` directory. Note: this disables any future server features.

## Performance notes

- The 3D canvas uses `dpr: [1, 1.2]` — capped device pixel ratio prevents GPU overload on retina displays
- Zone culling keeps at most 2 Three.js scenes rendering simultaneously
- Lenis smooth scrolling adds ~1ms per frame — acceptable on modern hardware
- The canvas is `pointer-events: none` so it never blocks HTML interaction

## Verifying a production build locally

```bash
npm run build && npm run start
```

Open `http://localhost:3000` and confirm:
- No hydration warnings in the console
- 3D canvas renders on page load
- Scroll drives the camera through all six zones
- Architecture section drag and mouse parallax work
- Approach section phases transition without overlap
