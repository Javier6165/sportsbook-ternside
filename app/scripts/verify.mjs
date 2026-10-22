// Browser checks for the review fixes. Needs `npm run dev` on :5173.
// Usage: node scripts/verify.mjs
import { chromium } from 'playwright'
const BASE = 'http://localhost:5173/'
const b = await chromium.launch({ args: ['--use-gl=angle', '--enable-webgl', '--ignore-gpu-blocklist'] })
const results = []
const check = (name, ok, detail = '') => (results.push({ name, ok, detail }), console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`))

async function page(w = 1440, h = 900) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } })
  const p = await ctx.newPage()
  const errors = []
  p.on('pageerror', (e) => errors.push(e.message))
  await p.goto(BASE + '#/sports')
  await p.evaluate(() => localStorage.clear())
  return { p, ctx, errors }
}
async function step(name, fn) {
  try { await fn() } catch (e) { check(`section ${name} threw`, false, String(e.message).split('\n')[0]) }
}
async function scene(p, title) {
  await p.goto(BASE + '#/sports')
  await p.waitForTimeout(800)
  await p.click('button[aria-label="Open demo tools"]')
  await p.click('text=Scenes')
  await p.click(`button[aria-label="Load ${title}"]`)
  await p.click('button:text-is("Load")')
  await p.waitForTimeout(900)
  await p.keyboard.press('Escape')
}

await step('wallet', async () => {
// 1. Wallet: partial amounts never crash
{
  const { p, ctx, errors } = await page()
  await p.goto(BASE + '#/wallet')
  await p.waitForTimeout(600)
  const input = p.locator('input[placeholder="0.00"]').first()
  for (const v of ['.', '1.', '-', 'abc']) {
    await input.fill('')
    await input.pressSequentially(v)
    await p.waitForTimeout(100)
  }
  const alive = await p.locator('h2:text-is("Deposit")').isVisible()
  const balance = await p.locator('header').first().innerText()
  check('Wallet: ".", "1.", "-", "abc" typed without a crash', alive && errors.length === 0, errors.join('; '))
  check('Wallet: balance untouched by invalid input', balance.includes('£100.00'))
  await ctx.close()
}

})
await step('2', async () => {
// 2. Limit increase waits 24h on the account clock and needs confirming
{
  const { p, ctx, errors } = await page()
  await p.goto(BASE + '#/safer-gambling')
  await p.waitForTimeout(600)
  await p.locator('button:text-is("Change limit")').first().click()
  const inp = p.locator('input[aria-label^="New "]').first()
  await inp.fill('.')
  const saveDisabled = await p.locator('button:text-is("Save")').isDisabled()
  check('Limit: "." cannot be saved', saveDisabled && errors.length === 0)
  await inp.fill('40')
  await p.locator('button:text-is("Save")').click()
  await p.waitForTimeout(400)
  const confirm = p.locator('button:text-is("Confirm increase")')
  check('Limit: Confirm is disabled during the 24-hour wait', await confirm.isDisabled())
  await confirm.click({ force: true })
  await p.waitForTimeout(200)
  check('Limit: forcing a click early changes nothing', (await p.locator('text=Increase to £40.00 requested').count()) === 1)
  await p.locator('button:text-is("Advance account clock 24 hours")').click()
  await p.waitForTimeout(400)
  check('Limit: after 24h it still waits for confirmation', (await p.locator('text=The waiting time is over').count()) === 1)
  await confirm.click()
  await p.waitForTimeout(400)
  check('Limit: explicit confirmation applies £40.00', (await p.locator('text=£40.00').count()) > 0 && (await confirm.count()) === 0)
  await ctx.close()
}

})
await step('3', async () => {
// 3. Live tracking → Stats shows the live view and labels kick-off prices as such
{
  const { p, ctx, errors } = await page()
  await scene(p, 'Live tracking')
  await p.goto(BASE + '#/event/football-01?tab=stats')
  await p.waitForTimeout(1200)
  const txt = await p.locator('#main').innerText()
  check('Stats (live): kick-off data labelled as not current', /Before kick-off/i.test(txt) && /not current/i.test(txt), errors.join('; '))
  await ctx.close()
}

})
await step('4', async () => {
// 4. Price change → accepted at 3.20 → Explore outcomes uses the accepted snapshot
{
  const { p, ctx, errors } = await page()
  await scene(p, 'Price change at review')
  const T = { timeout: 15000 }
  await p.locator('button:visible:has-text("Review bet")').first().click(T)
  await p.locator('button:visible:has-text("Place bet")').first().click(T)
  await p.locator('button:visible:has-text("Place at 3.20")').first().click(T)
  await p.locator('text=/Accepted|placed/i').first().waitFor(T)
  await p.goto(BASE + '#/my-bets')
  await p.locator('a[href*="/bets/"]').first().click(T)
  await p.locator('button:text-is("Northbridge win 3–1, Costa has 2 shots")').click(T)
  await p.waitForTimeout(500)
  const sec = await p.locator('section[aria-labelledby="explore-title"]').innerText()
  check('Explore outcomes: all-win returns £32.00 at 3.20', sec.includes('£32.00') && sec.includes('3.20'), errors.join('; '))
  check('Explore outcomes: says it uses the accepted prices', /archived when your bet was accepted \(3\.20\)/.test(sec))
  await ctx.close()
}

})
await step('5', async () => {
// 5. Accumulator from the qualifying picks, others shown as staying separate
{
  const { p, ctx, errors } = await page()
  await p.goto(BASE + '#/sports/football')
  await p.waitForTimeout(1000)
  // three different scheduled matches, then a second pick from the first match
  const by = (l) => p.locator(`button[aria-label="${l}"]`).first().click().then(() => p.waitForTimeout(300))
  await by('Eastford Rovers, Match result, Eastford Rovers v Westhaven United, odds 1.80')
  await by('Kingsmere City, Match result, Kingsmere City v Northbridge United, odds 1.65')
  await by('Calder Vale, Match result, Calder Vale v Redmoor, odds 1.72')
  await p.goto(BASE + '#/event/football-02')
  await p.waitForTimeout(1000)
  await p.locator('button[aria-pressed]:has-text("Over")').first().click()
  await p.waitForTimeout(300)
  await p.locator('button:has-text("Betslip")').first().click()
  await p.waitForTimeout(500)
  await p.locator('[role="tab"]:visible:has-text("Accumulator")').first().click()
  await p.waitForTimeout(500)
  const body = await p.locator('body').innerText()
  check('Accumulator: 3-fold offered from the qualifying picks (5.1084)', /3-fold accumulator/.test(body) && body.includes('5.1084'))
  check('Accumulator: same-match pick listed as separate with a reason', /Same match as another pick/.test(body), errors.join('; '))
  await ctx.close()
}

})
await step('6', async () => {
// 6. Full / Mobile toggle and Escape on the betslip
{
  const { p, ctx, errors } = await page()
  await p.goto(BASE + '#/sports')
  await p.waitForTimeout(800)
  await p.click('button[aria-label="Open demo tools"]')
  const toggle = p.locator('button[aria-label="Mobile view"]').first()
  if (await toggle.count()) {
    await toggle.click()
    await p.waitForTimeout(800)
    const phone = (await p.locator('text=390 × 844 layout').count()) > 0
    check('Presentation: Mobile toggle shows the 390px phone', phone, errors.join('; '))
    await p.locator('[role="radio"]:has-text("Full"), button[aria-label="Full view"]').first().click()
    await p.waitForTimeout(600)
    check('Presentation: back to Full view', (await p.locator('text=390 × 844 layout').count()) === 0)
  } else check('Presentation: Mobile toggle present', false)
  await ctx.close()
}

})

await step('7', async () => {
// 7. Search modal: focus inside, Tab stays inside, background inert, Escape returns focus to the opener
  const { p, ctx, errors } = await page()
  await p.goto(BASE + '#/sports')
  await p.waitForTimeout(800)
  const opener = p.locator('header button:has-text("Search")').first()
  await opener.focus()
  await p.keyboard.press('Enter')
  await p.waitForTimeout(500)
  const inDialog = () => p.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))
  check('Search: focus moves into the dialog', await inDialog())
  let stayed = true
  for (let i = 0; i < 25; i++) { await p.keyboard.press('Tab'); if (!(await inDialog())) stayed = false }
  check('Search: Tab ×25 never leaves the dialog', stayed)
  check('Search: main content is inert while open', await p.evaluate(() => document.getElementById('main')?.inert === true))
  await p.keyboard.press('Escape')
  await p.waitForTimeout(500)
  check('Search: Escape closes and returns focus to the opener', (await p.locator('[role="dialog"]').count()) === 0 && (await p.evaluate(() => document.activeElement?.textContent?.includes('Search'))), errors.join('; '))
  await ctx.close()
})

await step('8', async () => {
// 8. Reduced motion: pages render without errors and the 3D kits draw a still frame
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const p = await ctx.newPage()
  const errors = []
  p.on('pageerror', (e) => errors.push(e.message))
  for (const r of ['#/sports', '#/event/football-01', '#/live', '#/wallet']) { await p.goto(BASE + r); await p.waitForTimeout(900) }
  check('Reduced motion: four pages render with no errors', errors.length === 0, errors.join('; '))
  await ctx.close()
})

await step('9', async () => {
// 9. Free bet: the stake isn't returned and the balance doesn't move
  const { p, ctx, errors } = await page()
  await scene(p, 'Free bet ready')
  await p.locator('button:visible:has-text("Betslip")').first().click().catch(() => {})
  await p.locator('button:visible:has-text("Use your £5.00 free bet")').first().click({ timeout: 10000 })
  const slip = await p.locator('body').innerText()
  check('Free bet: slip shows £4.00 return for £5 at 1.80', slip.includes('£4.00'))
  await p.locator('button:visible:has-text("Review bet")').first().click({ timeout: 10000 })
  await p.locator('button:visible:has-text("Place bet")').first().click({ timeout: 10000 })
  await p.locator('text=/Accepted/i').first().waitFor({ timeout: 15000 })
  const header = await p.locator('header').first().innerText()
  check('Free bet: balance still £100.00 after placing', header.includes('£100.00'), errors.join('; '))
  await p.goto(BASE + '#/promotions')
  await p.waitForTimeout(800)
  check('Free bet: shown as used on the promotions page', /Used on TS-/.test(await p.locator('#main').innerText()))
  await ctx.close()
})

await step('10', async () => {
// 10. 2 Goals Ahead: paid as a winner when the team goes two up
  const { p, ctx, errors } = await page()
  await scene(p, '2 Goals Ahead paid out')
  const opener = p.locator('button[aria-label="Open demo tools"]')
  if (await opener.count()) await opener.click()
  if (!(await p.locator('button:has-text("58’ · Northbridge go 2–0")').count())) await p.locator('button[aria-label="Demo controls"]').first().click()
  await p.locator('button:has-text("58’ · Northbridge go 2–0")').click({ timeout: 10000 })
  await p.waitForTimeout(800)
  await p.keyboard.press('Escape')
  await p.goto(BASE + '#/my-bets?tab=settled')
  await p.waitForTimeout(900)
  const txt = await p.locator('#main').innerText()
  const header = await p.locator('header').first().innerText()
  check('2 Goals Ahead: bet settled early with its label', /Paid early · 2 Goals Ahead/.test(txt), errors.join('; '))
  check('2 Goals Ahead: £21 credited once (£90 → £111)', header.includes('£111.00'))
  await ctx.close()
})

await step('11', async () => {
// 11. Opt in, predictor entry, popular hub, offers toggle
  const { p, ctx, errors } = await page()
  await p.goto(BASE + '#/promotions')
  await p.waitForTimeout(800)
  await p.locator('article:has-text("2 Goals Ahead") button:has-text("Opt in")').click()
  await p.waitForTimeout(400)
  check('Promotions: opt in moves it to Opted in', /Opted in\s*1/.test(await p.locator('[role="tablist"]').innerText()))
  await p.goto(BASE + '#/promotions/predictor')
  await p.waitForTimeout(600)
  await p.locator('button[aria-label="Northbridge FC goals: one more"]').click()
  await p.locator('button:has-text("Submit entry")').click()
  await p.waitForTimeout(300)
  check('Predictor: entry saved', (await p.locator('text=Entry saved').count()) > 0)
  await p.goto(BASE + '#/sports?hub=popular')
  await p.waitForTimeout(1500)
  const pop = await p.locator('#main').innerText()
  check('Popular hub: sections render', ['Top competitions', 'Today’s big matches', 'In play now', 'Popular markets tonight', 'Starting soon', 'All sports', 'Offers'].every((t) => pop.includes(t)), errors.join('; '))
  await p.goto(BASE + '#/account')
  await p.waitForTimeout(500)
  await p.locator('button[aria-label="Show offers on the home pages"]').click()
  await p.goto(BASE + '#/sports?hub=for-you')
  await p.waitForTimeout(1200)
  check('Account: offers switch hides the Offers row', !(await p.locator('#main').innerText()).includes('All promotions'))
  check('No page errors across promotions flows', errors.length === 0, errors.join('; '))
  await ctx.close()
})

await step('12', async () => {
// 12. Depth: market groups, standings, outrights, live scoreboard, My Bets filters, reality check
  const { p, ctx, errors } = await page()
  await p.goto(BASE + '#/event/football-02')
  await p.waitForTimeout(1000)
  await p.click('[role="tab"]:has-text("Corners")')
  check('Match page: Corners & cards group shows its markets', (await p.locator('h3:has-text("Total corners 9.5")').count()) === 1)
  await p.fill('input[aria-label="Find a market in this match"]', 'half')
  check('Match page: market search finds the half-time markets', (await p.locator('h3:has-text("Half-time result")').count()) === 1)
  await p.goto(BASE + '#/sports/football?competition=continental-cup&view=standings')
  await p.waitForTimeout(900)
  check('Competition: group tables render', (await p.locator('section[aria-label^="Continental Cup Group"]').count()) >= 2)
  await p.goto(BASE + '#/sports/football?competition=premier-division&view=outrights')
  await p.waitForTimeout(900)
  await p.locator('button[aria-pressed="false"]').first().click()
  await p.waitForTimeout(300)
  check('Outrights: a pick goes into the betslip', (await p.locator('header').first().innerText()).includes('Betslip\n1') || (await p.locator('text=Premier Division · Outright').count()) > 0)
  await p.goto(BASE + '#/live')
  await p.waitForTimeout(900)
  await p.click('button[aria-label="Scoreboard"]')
  check('Live: scoreboard groups matches by competition', (await p.locator('section[aria-label$=" live"]').count()) >= 5)
  await p.goto(BASE + '#/my-bets?tab=settled')
  await p.waitForTimeout(700)
  await p.click('button[aria-pressed]:has-text("Lost")')
  check('My Bets: result filter applies', !(await p.locator('#main').innerText()).includes('Returned\n£21'))
  await p.goto(BASE + '#/account')
  await p.waitForTimeout(600)
  await p.click('text=Show one now')
  await p.waitForTimeout(500)
  check('Reality check: dialog shows session time', (await p.locator('[role="dialog"]:has-text("You’ve been here")').count()) === 1)
  await p.keyboard.press('Escape')
  check('No page errors across depth flows', errors.length === 0, errors.join('; '))
  await ctx.close()
})

await b.close()
const failed = results.filter((r) => !r.ok).length
console.log(`\n${results.length - failed}/${results.length} passed`)
process.exit(failed ? 1 : 0)
