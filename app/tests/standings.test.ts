// Standings must be internally consistent: results, points and goals agree.
import { describe, expect, it } from 'vitest'
import { COMPETITIONS } from '../src/data/catalog'
import { outrightFor, standingsFor } from '../src/data/standings'

describe('Standings and outrights', () => {
  for (const c of COMPETITIONS.filter((x) => x.sport !== 'tennis')) {
    it(`${c.name}: W+D+L = P, points and goal difference agree`, () => {
      for (const g of standingsFor(c.id))
        for (const r of g.rows) {
          expect(r.w + r.d + r.l).toBe(r.p)
          expect(r.pts).toBe(c.sport === 'football' ? r.w * 3 + r.d : r.w * 2 + r.l)
          if (r.w === 0 && r.l === 0) expect(r.gf).toBe(r.ga)
          if (r.w === r.p) expect(r.gf).toBeGreaterThan(r.ga)
          if (r.l === r.p) expect(r.gf).toBeLessThan(r.ga)
        }
    })
  }
  it('outright prices shorten with table position', () => {
    const o = outrightFor('premier-division')!
    const odds = o.markets[0].selections.map((x) => Number(x.odds))
    expect([...odds].sort((a, b) => a - b)).toEqual(odds)
    expect(o.outright).toBe(true)
  })
})
