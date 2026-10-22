// Standings and outright markets per competition. Deterministic and fictional, derived from the
// competition's own fixtures so the table, the matches and the prices tell the same story.
import { COMPETITIONS, EVENTS, competitionById, registerOutright, type Participant, type SportEvent } from './catalog'

export interface Row {
  team: Participant
  p: number
  w: number
  d: number
  l: number
  gf: number
  ga: number
  pts: number
  form: string
}

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}
const seedOf = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7)

const fixtures = (compId: string) => EVENTS.filter((e) => e.competitionId === compId)

/** Strength from the match prices: shorter price → stronger side. */
function strength(compId: string) {
  const m = new Map<string, { t: Participant; s: number; n: number }>()
  for (const e of fixtures(compId)) {
    const sel = e.markets[0].selections
    const pH = 1 / Number(sel[0].odds)
    const pA = 1 / Number(sel[sel.length - 1].odds)
    for (const [t, p] of [
      [e.home, pH],
      [e.away, pA],
    ] as const) {
      const x = m.get(t.id) ?? { t, s: 0, n: 0 }
      x.s += p
      x.n += 1
      m.set(t.id, x)
    }
  }
  return [...m.values()].map((x) => ({ team: x.t, s: x.s / x.n }))
}

function table(compId: string, teams: { team: Participant; s: number }[], played: number, draws: boolean): Row[] {
  const rows = teams.map(({ team, s }) => {
    const r = rng(seedOf(compId + team.id))
    let w = 0
    let d = 0
    let l = 0
    let gf = 0
    let ga = 0
    let form = ''
    // Each game is played out, so goals for/against always agree with the results.
    const goals = () => Math.floor(r() * (draws ? 3 : 25)) + (draws ? 0 : 70)
    for (let i = 0; i < played; i++) {
      const x = r()
      const win = s * 0.9 + 0.08
      const draw = draws ? 0.26 : 0
      const res = x < win ? 'W' : x < win + draw ? 'D' : 'L'
      const low = goals()
      const margin = draws ? 1 + Math.floor(r() * 2) : 1 + Math.floor(r() * 14)
      if (res === 'W') (w++, (gf += low + margin), (ga += low))
      else if (res === 'D') (d++, (gf += low), (ga += low))
      else (l++, (gf += low), (ga += low + margin))
      form = (form + res).slice(-5)
    }
    return { team, p: played, w, d, l, gf, ga, pts: draws ? w * 3 + d : w * 2 + l, form }
  })
  return rows.sort((a, b) => b.pts - a.pts || b.gf - b.ga - (a.gf - a.ga) || b.gf - a.gf)
}

export interface StandingsGroup {
  name: string
  rows: Row[]
}

export function standingsFor(compId: string): StandingsGroup[] {
  const c = competitionById(compId)
  if (c.sport === 'tennis') return []
  const teams = strength(compId)
  if (compId === 'continental-cup') {
    // Group stage: each fixture's stage names its group.
    const byGroup = new Map<string, Set<string>>()
    for (const e of fixtures(compId)) {
      const g = e.stage?.split(' · ')[0] ?? 'Group'
      for (const t of [e.home, e.away]) byGroup.set(g, (byGroup.get(g) ?? new Set()).add(t.id))
    }
    return [...byGroup.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, ids]) => ({ name, rows: table(compId, teams.filter((t) => ids.has(t.team.id)), 2, true) }))
  }
  const played = c.sport === 'basketball' ? 12 : compId === 'premier-division' ? 8 : 10
  return [{ name: 'Table', rows: table(compId, teams, played, c.sport === 'football') }]
}

const step = (o: number) => (o < 5 ? 0.25 : o < 10 ? 0.5 : o < 20 ? 1 : o < 50 ? 2.5 : 5)
const round = (o: number) => (Math.round(o / step(o)) * step(o)).toFixed(2)

/** Outright market for a competition: a pseudo-event so it can go in the betslip like any selection. */
export function outrightFor(compId: string): SportEvent | null {
  const c = competitionById(compId)
  const evs = fixtures(compId)
  if (!evs.length) return null
  const ranked = c.sport === 'tennis' ? strength(compId).sort((a, b) => b.s - a.s).map((x) => x.team) : standingsFor(compId).flatMap((g) => g.rows).sort((a, b) => b.pts - a.pts).map((r) => r.team)
  const field = ranked.slice(0, 8)
  const weights = field.map((_, i) => 1 / (i + 1.6) ** 1.35)
  const total = weights.reduce((a, b) => a + b, 0)
  const last = [...evs].sort((a, b) => b.startsAt.localeCompare(a.startsAt))[0]
  return {
    id: `out-${compId}`,
    sport: c.sport,
    competitionId: compId,
    home: { id: `field-${compId}`, name: c.name, short: c.short, color: '#13204A' },
    away: { id: `out-${compId}`, name: 'Outright', short: 'Outright', color: '#2948FF' },
    startsAt: last.startsAt,
    status: 'scheduled',
    outright: true,
    stage: c.sport === 'tennis' ? 'Tournament winner' : 'Competition winner',
    markets: [
      {
        id: 'OUTRIGHT',
        name: c.sport === 'tennis' ? 'Tournament winner' : 'Winner',
        period: c.sport === 'tennis' ? 'Whole tournament' : 'Whole season, including any play-offs',
        selections: field.map((t, i) => ({ id: `OUT_${t.id}`, label: t.name, odds: round(Math.max(1.5, 1 / ((weights[i] / total) * 1.18))) })),
      },
    ],
  }
}

// Register every competition's outright so stored bets and drafts resolve after a reload.
for (const c of COMPETITIONS) {
  const o = outrightFor(c.id)
  if (o) registerOutright(o)
}
