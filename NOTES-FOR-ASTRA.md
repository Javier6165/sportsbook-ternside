# Notes for Astra — from Claude (project lead)

Last update: 21-10-2026 · second cut (identity v2 + curated home). Javier asked Claude to lead the build and to log here any change to the HANDOFF-01 decisions. Everything not listed stays as you specified.

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

## Identity v2 and product principles (agreed with Javier, 21-10-2026)

The first cut read as correct but generic. BRAND-01 is evolved, not replaced:

| Area | BRAND-01 | Now |
| --- | --- | --- |
| Concept of the look | Matchday editorial, navy/cobalt | **Colour of the game**: calm neutral UI; colour comes only from the teams' kits (gradient fields per match). The bet is a **pass** (Wallet-like ticket with perforation and stub) that persists from slip to settlement |
| Live | — | Live surfaces go "night": near-black, volt LED clock (Doto font), team-colour glow |
| Display type | Barlow Condensed | Inter Tight (tight, heavy). Barlow read as generic sportsbook. Inter stays for UI and numbers |
| Wordmark | "Ternside" in Barlow | "Ternside." in Inter Tight with a cobalt full stop |
| Colour roles | navy as brand surface | cobalt #2948FF = selection/action, ink #111318 = primary commit buttons, navy only for presentation chrome |
| Desktop layout | rail + markets + betslip column | no rail; centred content, pill navigation, betslip as a floating pass that unfolds on demand |

Product principles from Javier:
1. **Show the relevant ~20%, tuck away the rest.** Home is "For you": followed teams/competitions first, a few popular matches, then "Everything else" collapsed by sport → competition. Personalisation comes from stated interests (Tune your feed), never from betting behaviour. Rules, money, periods and safer-gambling access are never hidden.
2. **No predatory patterns.** No boosted odds, no wild cross-match accas, no social-proof counters, no "build a bet" upsells. Only correlated same-match builders that tell one story (e.g. team wins + its striker shoots), max three conditions.
3. **Explain the odds in plain language.** "Why these odds?" gives a short, neutral summary of why prices sit where they do (labelled AI summary of fictional data, not a tip); full stats stay collapsed underneath. This is static authored text — F15's live LLM/chat stays out.

The long tail behind "Everything else" is generated in `app/src/data/catalog-extra.ts` (11 extra fictional competitions, main markets only).

## Image requests (when you have time)

The UI works without images. These slots are already marked in code with `data-asset-slot`.

| Slot | Use | Spec |
| --- | --- | --- |
| `hero-matchday` | Optional texture under the featured match colour field (football-01). The field is a navy (#13204A) → red (#C8102E) gradient, so the image must work blended at ~25% opacity: 2400×1100 px, night stadium / crowd silhouette, low detail, no real logos, kits or sponsors. Keep the left 60% calm (huge team names) |
| `player-costa` (later) | Daniel Costa on the match page / Bet Builder | Fictional player, waist-up cutout, transparent PNG ~1200×1500, Northbridge kit (navy and white stripes, no badge) |
| `og-share` | Link preview for Netlify / the case study | 1200×630, "Ternside." wordmark (Inter Tight) on the canvas colour, plus one bet pass on a team-colour field |

Team crests are generated in code (geometric SVG emblems from `app/src/data/catalog.ts`), so they need no images.

## Where things are

- App: `app/` (React 19, TypeScript, Vite 8, Tailwind 4, React Router, Motion, decimal.js). Run with `npm --prefix app run dev`.
- Brand tokens: `app/src/index.css` (BRAND-01 values plus a few derived neutrals).
- Catalogue: `app/src/data/catalog.ts`.
