# Ternside — build brief for Claude

HANDOFF-01 · 20 October 2026. Build the freely explorable fictional sportsbook demo described in this package. The research and specifications are complete enough for implementation; there is no app code here yet.

## Latest user instruction and precedence

Javier explicitly removed the requirement to generate reference screenshots for every screen. **You own the visual composition of the app.** Apply the defined Ternside brand and functional specifications; do not wait for more images or copy historical SC01 drafts. Finish implementation and review the rendered app yourself.

Order: this entry point and [release decisions](release-notes.md); [brand guide](../branding/brand-guide.md) and [creative direction](../implementation/creative-direction.md); product rules/contracts and active flow specs; fixtures/cases; research/history. Earlier documents may describe proposals or work in progress. The current scope below supersedes their optional/open wording. User decisions and money/rule invariants cannot be overridden by a template or a pretty layout.

## Product to build

Ternside: a recognizable fixed-odds European sportsbook concept with one consistent representation of ticket conditions before placement, during the event and after settlement. Optional **Explore outcomes** explains hypothetical rules, not probabilities or betting advice. Its benefit is a design hypothesis; do not claim a validated improvement.

Interface en-GB, fictitious GBP, decimal odds, GB reference policy RULES-GB-01 revision 0.4. Football main journey, tennis and basketball narrow coverage. Enter as verified fictional adult with £100 available, existing historical void receipt and empty betslip. Use authored events/prices/dates. Mobile and desktop must both be polished; recruiters likely start on desktop.

Active flows: F01–F14 and F16. F15 assistant/chat is deferred and has no product entry point. Include a Full/Mobile selector and scenario controls outside sportsbook navigation, sharing one session. No external AI, feed, payment, account, real credential or identity document. All required dependencies/assets run without API keys.

## Read before implementation

1. [Scope](../product/scope.md), [rules](../product/demo-rules.md), [domain model](../product/domain-model.md).
2. [Screen/action map](../product/screen-map.md), [betslip state](../product/betslip-state-contract.md), [navigation](../product/navigation-and-mobile.md), [live offer](../product/live-offer-contract.md).
3. [Flow index](../flows/README.md); implement active flows, treating unfinished visual-copy questions as your design decisions within the contract.
4. [Fixtures](../demo/fixtures.json), [48 independent scenarios](../demo/scenario-cases.json), [acceptance matrix](../demo/acceptance-matrix.md).
5. [Brand guide](../branding/brand-guide.md), [tokens](../branding/brand-tokens.json), original font files/licenses in branding/assets/fonts.
6. [Architecture](../implementation/architecture.md), [scenario/presentation engine](../implementation/scenario-engine.md), [creative direction](../implementation/creative-direction.md), [acceptance](../implementation/acceptance.md).
7. [Demo walkthrough](demo-script.md). Research and case-study files are supporting evidence, not extra UI pages to implement.

## Build order

First domain operations, exact arithmetic and fixtures; then shared state/persistence/routing; then the end-to-end event → ticket → review → receipt → My Bets journey. Add live/void/Cash Out, wallet/safer gambling/exclusion and scenario controls. Apply consistent brand/UI throughout. Render and inspect desktop/mobile, fix concrete defects, execute acceptance tests and deliver source/build/report.

Do not stop after a hero, homepage, static mock or scripted slideshow. The suggested walkthrough is optional; buttons, navigation, direct routes, recovery and reset must work when explored in other orders. Do not add unsupported markets to fill whitespace. Keep mandatory rule/period and monetary information visible or directly accessible in context.

## Non-negotiable examples

- £10 builder Home+Over+Player at 3.40 → potential £34. Player does not participate, Home/Over win → archived 2.70 and £27 return.
- £1.25 at 2.10 → £2.63 gross, £1.38 net. Three-leg 2.10×1.80×1.65 keeps exact 6.237; £1.25 → £7.80.
- £100 opening, stake £10, Cash Out £8 → £98 available and £2 net loss. No extra stake refund.
- Unknown response checks the same operation ID; no new financial operation or automatic resend. Exclusion still closes gambling immediately.
- Switching Singles/Accumulator preserves one group list and separate stake inputs. Acceptance consumes submitted groups once; no hidden copies in another tab.
- Pre-match builder is unavailable for new placement after kickoff. Existing accepted builder tracks; new live result single uses the exact live quote snapshot.

## Deliver back

Complete app source, exact lockfile, local assets/licenses, working static build, run instructions and honest test/defect report. Implement the scripts in TECH-01, run relevant checks and report anything not run. No public deployment, domain registration or purchases are requested. The included manifest describes this input package, not a test certificate for your future app.
