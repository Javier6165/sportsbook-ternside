import { COMPETITIONS, EVENTS, SPORTS, competitionById, type SportEvent, type SportId } from '../data/catalog'
import type { Prefs } from '../state/store'

export interface Reason {
  kind: 'team' | 'competition' | 'popular'
  text: string
}

export function reasonFor(ev: SportEvent, p: Prefs): Reason | null {
  const team = [ev.home, ev.away].find((t) => p.teams.includes(t.id))
  if (team) return { kind: 'team', text: `You follow ${team.name}` }
  if (p.competitions.includes(ev.competitionId)) return { kind: 'competition', text: `You follow ${competitionById(ev.competitionId).name}` }
  const sportName = SPORTS.find((s) => s.id === ev.sport)!.name
  if (ev.popular && (p.sports.includes(ev.sport) || p.sports.length === 0)) return { kind: 'popular', text: `Popular in ${sportName.toLowerCase()}` }
  return null
}

const rank = (r: Reason) => (r.kind === 'team' ? 0 : r.kind === 'competition' ? 1 : 2)

export function buildFeed(p: Prefs) {
  const scheduled = EVENTS.filter((e) => e.status === 'scheduled').sort((a, b) => a.startsAt.localeCompare(b.startsAt))
  const live = EVENTS.filter((e) => e.status === 'live')

  const f01 = EVENTS.find((e) => e.builder)
  const featured =
    (f01 && f01.status !== 'finished' ? f01 : undefined) ??
    scheduled.find((e) => reasonFor(e, p)?.kind === 'team') ??
    scheduled.find((e) => e.popular) ??
    scheduled[0]

  const liveMine = live.filter((e) => e.id !== featured.id && reasonFor(e, p))
  const liveOther = live.filter((e) => e.id !== featured.id && !reasonFor(e, p))

  const picks = scheduled
    .filter((e) => e.id !== featured.id)
    .map((e) => ({ e, r: reasonFor(e, p) }))
    .filter((x): x is { e: SportEvent; r: Reason } => !!x.r)
    .sort((a, b) => rank(a.r) - rank(b.r) || a.e.startsAt.localeCompare(b.e.startsAt))
    .slice(0, 6)
    .sort((a, b) => a.e.startsAt.localeCompare(b.e.startsAt))

  const shown = new Set([featured.id, ...picks.map((x) => x.e.id), ...live.map((e) => e.id)])
  const rest = SPORTS.map((s) => {
    const comps = COMPETITIONS.filter((c) => c.sport === s.id)
      .map((c) => ({ c, evs: scheduled.filter((e) => e.competitionId === c.id && !shown.has(e.id)) }))
      .filter((g) => g.evs.length)
    return { sport: s, comps, count: comps.reduce((a, g) => a + g.evs.length, 0) }
  }).filter((g) => g.count)

  return { featured, liveMine, liveOther, picks, rest, hiddenCount: rest.reduce((a, g) => a + g.count, 0) }
}

export const sportName = (id: SportId) => SPORTS.find((s) => s.id === id)!.name
