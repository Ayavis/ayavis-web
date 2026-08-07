# Deployment

## Build

```bash
npm run build   # outputs to out/ (static export)
```

The build produces a fully static site (`output: 'export'`). All content is hardcoded in `src/data/` — no server, no API calls.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | No | Canonical URL for sitemap/OG tags. Defaults to `https://ayavis.com` |
| `NEXT_PUBLIC_BASE_PATH` | No | Asset prefix for subpath deployments (e.g. `/ayavis-web`). Leave empty for custom domain |

## Hosting — GitHub Pages

Deployments are fully automated via GitHub Actions (`.github/workflows/deploy.yml`).

Every push to `main` triggers: install → build → deploy to GitHub Pages.

### Switching between GitHub Pages subpath and custom domain

Controlled by a GitHub repository variable — no code changes needed.

**Repo → Settings → Variables → Actions → `BASE_PATH`**

| Target URL | `BASE_PATH` value |
|---|---|
| `ayavis.github.io/ayavis-web` | `/ayavis-web` |
| `ayavis.com` (custom domain) | *(empty)* |

After changing the variable, trigger a redeploy: push a commit or use **Actions → Run workflow**.

### Custom domain setup

1. Add DNS records at your registrar:
   ```
   A      @    185.199.108.153
   A      @    185.199.109.153
   A      @    185.199.110.153
   A      @    185.199.111.153
   CNAME  www  ayavis.github.io
   ```
2. Repo → Settings → Pages → Custom domain → enter `ayavis.com` → Save
3. Set `BASE_PATH` repo variable to empty
4. Push a commit to trigger rebuild
5. GitHub auto-provisions SSL within ~5 minutes

The `public/CNAME` file (`ayavis.com`) is committed to the repo — GitHub Pages reads it to maintain the custom domain across deployments.

## Verifying a production build locally

```bash
npm run build
npx serve out/
```

Open `http://localhost:3000` and confirm:
- No hydration warnings in the console
- 3D canvas renders on page load
- Scroll drives the camera through all six zones
- Architecture section drag and mouse parallax work
- Approach section phases transition without overlap

## Performance notes

- The 3D canvas uses `dpr: [1, 1.2]` — capped device pixel ratio prevents GPU overload on retina displays
- Zone culling keeps at most 2 Three.js scenes rendering simultaneously
- Lenis smooth scrolling adds ~1ms per frame — acceptable on modern hardware
- The canvas is `pointer-events: none` so it never blocks HTML interaction
