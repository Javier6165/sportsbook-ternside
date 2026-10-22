import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
const routes = ['#/sports', '#/event/football-01', '#/event/football-01?tab=builder', '#/event/football-cc-live', '#/my-bets', '#/wallet', '#/safer-gambling', '#/live', '#/sports?hub=popular', '#/promotions', '#/promotions/predictor', '#/account', '#/sports/football?competition=continental-cup&view=standings', '#/sports/football?competition=premier-division&view=outrights', '#/event/football-02']
const b = await chromium.launch()
for (const r of routes) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage()
  await p.goto('http://localhost:5173/' + r)
  await p.waitForTimeout(1500)
  const res = await new AxeBuilder({ page: p }).withTags(['wcag2a', 'wcag2aa']).analyze()
  console.log(`\n${r}: ${res.violations.length} violation types`)
  for (const v of res.violations) console.log(`  [${v.impact}] ${v.id} ×${v.nodes.length} — ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ').slice(0, 160)}`)
  await ctx.close()
}
await b.close()
