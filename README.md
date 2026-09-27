# Storage Calculator

An iPad storage estimator tool, originally generated with [v0.app](https://v0.app). Answer a few questions about the apps you plan to install and it estimates how much storage you'll need — then recommends the right iPad storage tier (64 / 128 / 256 / 512 / 1024 GB). Fully client-side, no backend.

## What It Does

- **App picker** — browse a list of popular apps (each with typical install size) and add the ones you use.
- **Custom apps** — type any app name and get a heuristic size estimate; add it to your list.
- **System-storage toggle** — include/exclude iPadOS system usage (~15 GB) in the estimate.
- **Live total + recommendation** — shows your total estimated usage and highlights the cheapest iPad storage option that fits, with a progress bar toward the next tier.

## Features

- Popular-apps catalog with per-app sizes and category breakdowns
- Custom app entry with name-based size estimation
- System storage (15 GB) on/off switch
- Recommended storage tier card (64 GB → 1 TB)
- Responsive card layout with gradient illustration panel
- Dark/light theme toggle
- No sign-in, no backend — all state in the browser

## Tech Stack

- **Framework:** Next.js 15 (App Router, static export) + React 19 + TypeScript
- **UI:** shadcn/ui, Radix UI primitives, Tailwind CSS 3, `lucide-react` icons
- **Package manager:** pnpm (lockfile committed); npm works too

## Quick Start

```bash
# clone
git clone https://github.com/girishlade111/storage-calculator.git
cd storage-calculator

# install (pnpm recommended; npm --legacy-peer-deps also works)
pnpm install
# or: npm install --legacy-peer-deps

# run locally
pnpm dev
# open http://localhost:3000
```

## Project Structure

```
app/
  page.tsx                  # Landing page wrapping the calculator
  layout.tsx / globals.css
components/
  storage-calculator.tsx    # All calculator logic + UI (app list, estimates, recommendation)
  ui/                       # shadcn/ui primitives
public/
  minimalist-ipad.png       # Hero illustration
next.config.mjs             # Static export config
```

## Environment Variables

None — the tool is fully client-side with hardcoded app-size data; no secrets needed.

## Deployment

The app is statically exported (`output: "export"` in `next.config.mjs`):

- **GitHub Pages:** this repo is published via the `gh-pages` branch → live at `https://girishlade111.github.io/storage-calculator/`
  - Note: `basePath: '/storage-calculator'` is set for the subpath deploy. Remove `basePath` (keep `output: 'export'`) when deploying to a root domain or Vercel.
- **Vercel / Netlify / Cloudflare Pages:** `pnpm build` produces `out/` — point your host at it.

## License

Free to use and adapt.

---

Built by Girish Lade — [ladestack.in](https://ladestack.in)
