# Ternside — demo app

```bash
npm ci
npm run dev       # http://localhost:5173
npm test          # Vitest: money, rules, limits, ledger
npm run build     # static build in dist/ (relative paths, works under a subpath)
npm run preview
```

Node 24 / npm 11. No environment variables, keys or network services.

- `src/data/` fictional catalogue (derived secondary and in-play markets), quote table qv1, market rules, standings and outrights · `src/domain/` money maths (decimal.js, HALF_UP once), Bet Builder evaluation, accumulator rules, promotions and free bets · `src/state/` single reducer store (persisted to `localStorage`) + live price engine
- `src/shell/` header, rail, betslip, mobile nav · `src/presentation/` Full/Mobile frame (same React tree) and demo controls · `src/ui/` shared pieces (3D kits, match field, modal focus handling)

Identity v2, «Colour of the game»: neutral interface, colour comes from the team kits; the bet is a pass with a perforated tear line. Live has no theme of its own, only a red LIVE badge.

- Type: Inter Tight for display (`@fontsource-variable/inter-tight`), Inter for UI and body; crests use Barlow Condensed. Inter and Barlow Condensed are served locally from `src/assets/fonts` with their SIL OFL licences.
- 3D kits: three.js via @react-three/fiber, lazy-loaded (`src/ui/Kit3D.tsx`). Procedural texture by default; a flat front image at `public/images/kits/<teamId>.png` is used when present. Still frame under reduced motion, paused off-screen.
- Motion: `motion/react` with `MotionConfig reducedMotion="user"`.

Scripts (need `npm run dev` running; Playwright with Chromium):

- `node scripts/verify.mjs` 37 browser checks: money input, limit wait, live stats, accepted price, accumulator, Full/Mobile, modal focus, reduced motion, free bets, 2 Goals Ahead, opt-in, Predictor, Popular hub, market groups, standings, outrights, scoreboard, My Bets filters, reality check
- `node scripts/a11y.mjs` axe scan (WCAG 2 A/AA) of 15 routes. Automated only; not a manual audit
- `node scripts/shot.mjs` / `scene.mjs` screenshot helpers for visual review
