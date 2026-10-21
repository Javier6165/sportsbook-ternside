// Usage: node scripts/shot.mjs <name> <width> <height> [hash] [view=full|mobile] [actions-json]
import { chromium } from 'playwright'
const [name, w = '1440', h = '900', hash = '#/sports', view = 'full', actions = '[]'] = process.argv.slice(2)
const out = process.env.SHOT_DIR || '/private/tmp/claude-501/-Users-javierortiz--claude-spares-spare-C8TlPh/caebd44d-a842-4a3a-b712-03984b9229b2/scratchpad'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 })
await p.addInitScript((v) => {
  localStorage.setItem('ternside.demo.v1', JSON.stringify({ v: 1, state: { view: v } }))
}, view)
await p.goto('http://localhost:5173/' + hash)
await p.waitForTimeout(1800)
for (const a of JSON.parse(actions)) {
  if (a.click) await p.click(a.click)
  if (a.scroll) await p.evaluate(([sel, y]) => document.querySelector(sel)?.scrollTo(0, y), a.scroll)
  if (a.wait) await p.waitForTimeout(a.wait)
  if (a.fill) await p.fill(a.fill[0], a.fill[1])
}
await p.waitForTimeout(900)
await p.screenshot({ path: `${out}/${name}.png` })
await b.close()
console.log(`${out}/${name}.png`)
