// The "other 80%": a deterministic, generated long tail of fictional fixtures.
// It exists so progressive disclosure has real depth behind it — collapsed by
// default, one tap away. Main markets only (1X2 / winner, plus goals line).
import type { Competition, Crest, CrestPattern, CrestShape, Participant, SportEvent } from './catalog'

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}

const SHAPES: CrestShape[] = ['shield', 'round', 'hex', 'diamond', 'badge']
const PATTERNS: CrestPattern[] = ['solid', 'stripes', 'half', 'sash', 'hoops', 'chevron', 'quarters', 'band']
const PALETTE = ['#0B3D91', '#C8102E', '#0F5E4A', '#F59E0B', '#5B21B6', '#0E7490', '#111827', '#B91C1C', '#1D4ED8', '#9A3412', '#065F46', '#BE185D', '#334155', '#CA8A04']
const LIGHTS = ['#FFFFFF', '#F2F2EE', '#FDE68A', '#BFDBFE', '#FED7AA', '#A7F3D0', '#E9D5FF']

export const EXTRA_COMPETITIONS: (Competition & { teams: string[] })[] = [
  { id: 'northern-championship', sport: 'football', name: 'Northern Championship', short: 'Champ.', region: 'England', teams: ['Ravensworth', 'Coldharbour Town', 'Milltown Albion', 'Harrowgate', 'Saltmarsh City', 'Brackley Vale', 'Fenwick Rangers', 'Oakhurst'] },
  { id: 'highland-premiership', sport: 'football', name: 'Highland Premiership', short: 'Highland', region: 'Scotland', teams: ['Glenmorrow', 'Kilbride Thistle', 'Strathcairn', 'Dunloch Athletic', 'Port Aird', 'Inverbeck'] },
  { id: 'rheinland-liga', sport: 'football', name: 'Rheinland Liga', short: 'Rheinland', region: 'Germany', teams: ['SV Altenfeld', 'FC Brückstadt', 'Eintracht Waldheim', 'Borussia Kellen', 'TSV Rotberg', 'SC Mühlenau'] },
  { id: 'serie-adriatica', sport: 'football', name: 'Serie Adriatica', short: 'Adriatica', region: 'Italy', teams: ['Real Portosole', 'AC Vallerossa', 'Sporting Castelmare', 'US Montebaldo', 'Atletico Lucera', 'FC Riva Nera'] },
  { id: 'lowlands-league', sport: 'football', name: 'Lowlands League', short: 'Lowlands', region: 'Netherlands', teams: ['VV Noorddijk', 'SC Haverveld', 'FC Zeekant', 'Go Ahead Wierden', 'RKC Molenhoek', 'De Graafschap Oost'] },
  { id: 'liga-atlantica', sport: 'football', name: 'Liga Atlântica', short: 'Atlântica', region: 'Portugal', teams: ['SC Vila Mar', 'Académico Serra', 'FC Alvorada', 'União Ribeira', 'Desportivo Lagos Norte', 'CD Monte Azul'] },
  { id: 'caspian-super-league', sport: 'football', name: 'Caspian Super League', short: 'Caspian', region: 'Azerbaijan', teams: ['Neftçi Qala', 'Sabah Xəzər', 'Kəpəz Vadi', 'Şamaxı Ulduz', 'Qəbələ Dağ', 'Zirə Port'] },
  { id: 'nordic-premier', sport: 'football', name: 'Nordic Premier', short: 'Nordic', region: 'Scandinavia', teams: ['IF Fjällby', 'Hammarvik BK', 'Solberg FK', 'Ålund United', 'Norrvik IK', 'Kvarnås FF'] },
  { id: 'riviera-ladies', sport: 'tennis', name: 'Riviera Ladies Open', short: 'Ladies', region: 'Women’s tour', teams: ['E. Marchetti', 'S. Nakamura', 'L. Okonjo', 'C. Duarte', 'P. Kowalska', 'H. Lind', 'M. Sato', 'A. Ferrer'] },
  { id: 'alpine-challenger', sport: 'tennis', name: 'Alpine Challenger', short: 'Alpine', region: 'Challenger · Clay', teams: ['F. Gruber', 'D. Popescu', 'J. Ortega', 'K. Varga', 'T. Weiss', 'R. Lemaire'] },
  { id: 'iberian-basket', sport: 'basketball', name: 'Iberian Basket Liga', short: 'Iberian', region: 'Spain · Portugal', teams: ['Valdora Basket', 'CB Puerto Real Norte', 'Lusitânia BC', 'Estrella Mar', 'Galicia Celtas', 'Monteluz CB'] },
]

const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-')

function teamOf(name: string, r: () => number, isPlayer: boolean): Participant {
  if (isPlayer) return { id: slug(name), name, short: name }
  const words = name.replace(/^(FC|SC|SV|AC|US|VV|RKC|CD|CB|IF|BK|IK|FF|TSV|IK)\s/, '').split(' ')
  const crest: Crest = {
    shape: SHAPES[Math.floor(r() * SHAPES.length)],
    pattern: PATTERNS[Math.floor(r() * PATTERNS.length)],
    c1: PALETTE[Math.floor(r() * PALETTE.length)],
    c2: LIGHTS[Math.floor(r() * LIGHTS.length)],
    mark: words[0][0].toUpperCase(),
  }
  return { id: slug(name), name, short: words[0].slice(0, 3).toUpperCase(), crest }
}

const fmt = (n: number) => (Math.max(1.05, Math.round(n * 20) / 20)).toFixed(2)

function prices(r: () => number, three: boolean) {
  const ph = 0.25 + r() * 0.45
  const margin = 1.06
  if (!three) {
    return [fmt(1 / (ph * margin) - 0.02), fmt(1 / ((1 - ph) * margin))]
  }
  const pd = 0.22 + r() * 0.08
  const pa = Math.max(0.1, 1 - ph - pd)
  return [fmt(1 / (ph * margin)), fmt(1 / (pd * margin)), fmt(1 / (pa * margin))]
}

const DAYS = ['2026-10-20', '2026-10-21', '2026-10-22', '2026-10-24', '2026-10-25']
const TIMES: Record<string, string[]> = {
  football: ['17:30', '18:45', '19:00', '19:45', '12:30', '14:00', '16:30'],
  tennis: ['10:00', '11:30', '13:00', '14:30', '16:00'],
  basketball: ['17:00', '18:30', '19:00', '19:45'],
}

export function buildExtraEvents(): SportEvent[] {
  const out: SportEvent[] = []
  EXTRA_COMPETITIONS.forEach((c, ci) => {
    const r = rng(9001 + ci * 77)
    const isPlayer = c.sport === 'tennis'
    const teams = c.teams.map((t) => teamOf(t, r, isPlayer))
    for (let i = 0; i + 1 < teams.length; i += 2) {
      const day = DAYS[Math.floor(r() * DAYS.length)]
      const times = TIMES[c.sport]
      const time = times[Math.floor(r() * times.length)]
      const [hh, mm] = time.split(':').map(Number)
      const iso = new Date(Date.UTC(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8, 10), hh - 1, mm)).toISOString()
      if (iso < '2026-10-20T18:00:00Z') continue
      const home = teams[i]
      const away = teams[i + 1]
      const three = c.sport === 'football'
      const p = prices(r, three)
      const period = c.sport === 'football' ? '90 min + stoppage' : c.sport === 'tennis' ? 'Match must complete' : 'Includes overtime'
      const ev: SportEvent = {
        id: `x-${c.id}-${i / 2}`,
        sport: c.sport,
        competitionId: c.id,
        home,
        away,
        startsAt: iso,
        status: 'scheduled',
        stage: c.sport === 'tennis' ? 'Round of 32' : 'Regular season',
        markets: [
          three
            ? {
                id: 'RESULT_90',
                name: 'Match result',
                period,
                selections: [
                  { id: 'HOME', label: home.name, odds: p[0] },
                  { id: 'DRAW', label: 'Draw', odds: p[1] },
                  { id: 'AWAY', label: away.name, odds: p[2] },
                ],
              }
            : {
                id: 'WINNER',
                name: c.sport === 'tennis' ? 'Match winner' : 'Winner',
                period,
                selections: [
                  { id: 'HOME', label: home.name, odds: p[0] },
                  { id: 'AWAY', label: away.name, odds: p[1] },
                ],
              },
        ],
      }
      if (three) {
        const o = 1.6 + r() * 0.6
        ev.markets.push({
          id: 'TOTAL_2_5_90',
          name: 'Total goals 2.5',
          period,
          selections: [
            { id: 'OVER_2_5', label: 'Over 2.5', odds: fmt(o) },
            { id: 'UNDER_2_5', label: 'Under 2.5', odds: fmt(1 / (1.06 - 1 / o)) },
          ],
        })
      }
      out.push(ev)
    }
    if (LIVE_IN.includes(c.id)) out.push(liveOf(c, teams[0], teams[3], r))
  })
  return out
}

// A few long-tail matches are in play, so Live has the breadth a real book shows on a Tuesday evening.
const LIVE_IN = ['highland-premiership', 'rheinland-liga', 'lowlands-league', 'nordic-premier', 'riviera-ladies', 'iberian-basket']

function liveOf(c: Competition, home: Participant, away: Participant, r: () => number): SportEvent {
  const base = prices(r, c.sport === 'football')
  const wob = (k: number) => base.map((o, i) => fmt(Number(o) * (1 + (i === 0 ? -1 : 1) * 0.04 * k)))
  const path = [base, wob(1), wob(-1), wob(2), wob(0.5)]
  const period = c.sport === 'football' ? '90 min + stoppage' : c.sport === 'tennis' ? 'Match must complete' : 'Includes overtime'
  const sel = (id: string, label: string, odds: string) => ({ id, label, odds })
  const market =
    c.sport === 'football'
      ? { id: 'RESULT_90', name: 'Match result', period, selections: [sel('HOME', home.name, base[0]), sel('DRAW', 'Draw', base[1]), sel('AWAY', away.name, base[2])] }
      : { id: 'WINNER', name: c.sport === 'tennis' ? 'Match winner' : 'Winner', period, selections: [sel('HOME', home.name, base[0]), sel('AWAY', away.name, base[1])] }
  const minute = 12 + Math.floor(r() * 70)
  const g = () => Math.floor(r() * 3)
  const live =
    c.sport === 'football'
      ? { minute, period: minute > 45 ? '2nd half' : '1st half', score: [g(), g()] as [number, number], path }
      : c.sport === 'tennis'
        ? { period: 'Set 1', score: [0, 0] as [number, number], sets: [0, 0] as [number, number], games: [Math.floor(r() * 5), Math.floor(r() * 5)] as [number, number], points: ['15', '30'] as [string, string], serving: 0 as const, path }
        : { period: `Q${2 + Math.floor(r() * 2)}`, clock: `${1 + Math.floor(r() * 9)}:${String(Math.floor(r() * 60)).padStart(2, '0')}`, score: [38 + Math.floor(r() * 30), 36 + Math.floor(r() * 30)] as [number, number], path }
  return {
    id: `live-${c.id}`,
    sport: c.sport,
    competitionId: c.id,
    home,
    away,
    startsAt: c.sport === 'tennis' ? '2026-10-20T17:20:00Z' : c.sport === 'football' ? new Date(Date.parse('2026-10-20T18:00:00Z') - minute * 60_000 - (minute > 45 ? 15 : 0) * 60_000).toISOString() : '2026-10-20T17:30:00Z',
    status: 'live',
    stage: c.sport === 'tennis' ? 'Round of 32' : 'Regular season',
    live,
    markets: [market],
  }
}
