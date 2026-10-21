# Ternside — demo app

```bash
npm ci
npm run dev       # http://localhost:5173
npm run build     # static build in dist/ (relative paths, works under a subpath)
npm run preview
```

Node 24 / npm 11. No environment variables, keys or network services.

- `src/data/` fictional catalogue · `src/domain/` money maths (decimal.js, HALF_UP once) · `src/state/` single store + live price engine
- `src/shell/` header, rail, betslip column, mobile nav · `src/presentation/` Full/Mobile frame (same React tree)
- `scripts/shot.mjs` Playwright screenshot helper for visual review

Fonts: Inter and Barlow Condensed (SIL OFL), served locally from `src/assets/fonts` with their licences.
