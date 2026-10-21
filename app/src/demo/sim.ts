// SIM-01: football-01 driven by Astra's authored snapshots (fixtures.json).
// The match clock, offer and observations move together; no interpolation.
import { eventById, type Market } from '../data/catalog'

export type F01Phase = 'pre' | 'live-68' | 'live-72' | 'live-72c' | 'ft'

export const SNAPSHOTS = {
  'live-68': { minute: 68, score: [2, 1] as [number, number], sot: 1, prices: ['1.30', '5.00', '13.00'], version: 'live-qv1', corrected: false },
  'live-72': { minute: 72, score: [2, 1] as [number, number], sot: 2, prices: ['1.24', '5.80', '15.00'], version: 'live-qv2', corrected: false },
  'live-72c': { minute: 72, score: [2, 1] as [number, number], sot: 1, prices: ['1.24', '5.80', '15.00'], version: 'live-qv2', corrected: true },
}

let preMarkets: Market[] | null = null

export function applySim(phase: F01Phase) {
  const ev = eventById('football-01')
  if (!ev) return
  if (!preMarkets) preMarkets = ev.markets
  if (phase === 'pre') {
    ev.status = 'scheduled'
    ev.live = undefined
    ev.markets = preMarkets
    return
  }
  if (phase === 'ft') {
    ev.status = 'finished'
    ev.live = { period: 'Full time', minute: 90, score: [2, 1], path: [['1.30', '5.00', '13.00']], frozen: true, sot: 1 }
    ev.markets = preMarkets
    return
  }
  const snap = SNAPSHOTS[phase]
  ev.status = 'live'
  ev.live = {
    minute: snap.minute,
    period: '2nd half',
    score: snap.score,
    path: [snap.prices],
    frozen: true,
    sot: snap.sot,
    corrected: snap.corrected,
    quoteVersion: snap.version,
    detail: snap.corrected ? 'A Costa shot was reclassified by the data provider' : 'Northbridge lead 2–1',
  }
  // Only the 90-minute result is offered live; pre-match lines are shown as closed.
  ev.markets = preMarkets.map((m) => (m.id === 'RESULT_90' ? { ...m, selections: m.selections.map((x, i) => ({ ...x, odds: snap.prices[i] })) } : m))
}
