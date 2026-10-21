# Notes for Astra — from Claude (project lead)

Last update: 21-10-2026 · first build cut (home page). Javier asked Claude to lead the build and to log here any change to the HANDOFF-01 decisions. Everything not listed stays as you specified.

## Changes to the handoff

| Area | HANDOFF-01 said | Now | Why |
| --- | --- | --- | --- |
| Catalogue size | 5 events; "don't widen the catalogue to fill space" | ~21 fictional events across 5 competitions, 4 of them live | A five-match home reads as a mock-up. The extra events carry only main markets (1X2 / winner, plus double chance, O/U 2.5 and BTTS for some football). Deep rules and scenarios stay on football-01 |
| Competition names | "Demo European Cup", "Demo Premier Division", "Demo Tour", "Demo Basketball League" | Continental Cup, Premier Division, Primera Ibérica, Riviera Masters, Continental League | "Demo" inside the product breaks realism. The demo/fictional-money label stays visible in the betslip footer, the header ("Demo funds"), the site footer and the presentation dock |
| Account holder | "Alex Morgan — Demo" | Sam Ellery (initials SE) | Alex Morgan is a real, famous footballer |
| Motion | "brief CSS transitions; no animation library" | Motion (motion.dev) for price ticks, betslip flights, count-ups and shared layout | Javier wants visual impact; reduced-motion is respected |
| Live on the home page | Base scenario fully pre-match | Four background live events with authored price paths (no interpolation) | A sportsbook home without live content does not feel real. football-01 still goes live only through the Demo controls scenario |
| Testing | 48 cases + Playwright E2E + formal report | Unit tests for the money/rules engine; visual review in the browser at 1440/1280/390/320 | Visual polish matters more for this portfolio piece; money must still be exact |
| Accumulator | Two or three selections | Unchanged; the slip explains why an acca isn't available (builder, live pick, same match, >3) | — |

Same-market singles: picking Home and Draw of the same match as separate singles is allowed, as on most UK books. Builder exclusivity (R04) still applies inside a builder.

## Image requests (when you have time)

The UI works without images. These slots are already marked in code with `data-asset-slot`.

| Slot | Use | Spec |
| --- | --- | --- |
| `hero-matchday` | Background of the featured match card (football-01, Northbridge FC v Southport Athletic) | 2400×1000 px, dark, navy #10182B → cobalt #2948FF grade, night stadium with floodlights, no real logos, kits or sponsors. Keep the left 55% calm (team names sit there) |
| `player-costa` (later) | Daniel Costa on the match page / Bet Builder | Fictional player, waist-up cutout, transparent PNG ~1200×1500, Northbridge kit (navy and white stripes, no badge) |
| `og-share` | Link preview for Netlify / the case study | 1200×630, Ternside wordmark in Barlow Condensed on navy, plus one ticket visual |

Team crests are generated in code (geometric SVG emblems from `app/src/data/catalog.ts`), so they need no images.

## Where things are

- App: `app/` (React 19, TypeScript, Vite 8, Tailwind 4, React Router, Motion, decimal.js). Run with `npm --prefix app run dev`.
- Brand tokens: `app/src/index.css` (BRAND-01 values plus a few derived neutrals).
- Catalogue: `app/src/data/catalog.ts`.
