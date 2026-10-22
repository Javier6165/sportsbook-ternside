// Usage: node scripts/scene.mjs <name> <w> <h> <sceneTitle> [extra-actions-json]
import { chromium } from 'playwright'
const [name, w, h, title, extra = '[]'] = process.argv.slice(2)
const out = process.env.SHOT_DIR || '/private/tmp/claude-501/-Users-javierortiz-Documents-Vibecoding-Sportsbook-Portfolio/caebd44d-a842-4a3a-b712-03984b9229b2/scratchpad'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 })
await p.goto('http://localhost:5173/#/sports')
await p.waitForTimeout(1200)
if (+w >= 760) { await p.click('button[aria-label="Open demo tools"]'); await p.waitForTimeout(200); await p.click('text=Scenes') }
else await p.click('button[aria-label="Open demo controls"]')
await p.waitForTimeout(400)
await p.click(`button[aria-label="Load ${title}"]`)
await p.waitForTimeout(200)
await p.click('button:text-is("Load")')
await p.waitForTimeout(1200)
for (const a of JSON.parse(extra)) {
  if (a.click) await p.click(a.click)
  if (a.wait) await p.waitForTimeout(a.wait)
  if (a.scroll) await p.evaluate(([sel, y]) => document.querySelector(sel)?.scrollTo(0, y), a.scroll)
}
await p.waitForTimeout(600)
await p.screenshot({ path: `${out}/${name}.png` })
await b.close()
console.log(`${out}/${name}.png`)
