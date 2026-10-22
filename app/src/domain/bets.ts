import { eventById } from '../data/catalog'
import { QUOTES_QV1 } from '../data/quotes'
import { D, accaOdds, grossReturn, isValidStake } from './money'
import type { DraftGroup } from '../state/store'

export interface BetLeg {
  eventId: string
  eventLabel: string
  marketName: string
  selectionId: string
  label: string
  period: string
  odds: string
}

export type BetStatus = 'open' | 'won' | 'lost' | 'void' | 'cashed_out'

export interface Settlement {
  odds: string
  gross: string
  reason: string
  at: string
  legResults?: Record<string, 'won' | 'lost' | 'void'>
  /** R07: earlier settlement versions, kept as history */
  version?: number
  history?: { version: number; status: BetStatus; gross: string; at: string; reason: string }[]
}

export interface AcceptedBet {
  id: string
  type: 'single' | 'builder' | 'acca'
  legs: BetLeg[]
  odds: string
  stake: string
  potentialReturn: string
  placedAt: string
  status: BetStatus
  live?: boolean
  /** Builder only: archived subset prices used if a condition is later void (R05). */
  subsetQuotes?: Record<string, string>
  settlement?: Settlement
  rules: string
}

export interface LedgerEntry {
  id: string
  type: 'opening_balance' | 'stake' | 'return' | 'void_return' | 'cash_out' | 'deposit' | 'withdrawal'
  delta: string
  betId?: string
  at: string
  label: string
}

const RULES = 'RULES-GB-01 · rev 0.4'
const short = (n: string) => n
export const eventLabel = (eventId: string) => {
  const ev = eventById(eventId)
  return ev ? `${short(ev.home.name)} v ${short(ev.away.name)}` : 'Unknown match'
}

let n = 0
export const receiptId = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = ''
  let x = Date.now() + n++ * 7919
  for (let i = 0; i < 6; i++) {
    id += alphabet[x % alphabet.length]
    x = Math.floor(x / alphabet.length) + i * 13
  }
  return `TS-${id}`
}

const legOf = (g: DraftGroup, l: DraftGroup['legs'][number]): BetLeg => ({
  eventId: g.eventId,
  eventLabel: eventLabel(g.eventId),
  marketName: l.marketName,
  selectionId: l.selectionId,
  label: l.label,
  period: l.period,
  odds: l.odds,
})

export interface PlannedBet {
  bet: AcceptedBet
  consumes: string[]
}

/** Turns the shared slip into the bets that would be placed (no money moves here). */
export function planBets(groups: DraftGroup[], mode: 'singles' | 'acca', accaStake: string, placedAt: string): PlannedBet[] {
  if (mode === 'acca') {
    if (!isValidStake(accaStake) || groups.length < 2) return []
    const odds = accaOdds(groups.map((g) => g.odds))
    return [
      {
        consumes: groups.map((g) => g.id),
        bet: {
          id: receiptId(),
          type: 'acca',
          legs: groups.map((g) => legOf(g, g.legs[0])),
          odds: odds.toString(),
          stake: D(accaStake).toFixed(2),
          potentialReturn: grossReturn(accaStake, odds).toFixed(2),
          placedAt,
          status: 'open',
          rules: RULES,
        },
      },
    ]
  }
  return groups
    .filter((g) => isValidStake(g.stake))
    .map((g) => ({
      consumes: [g.id],
      bet: {
        id: receiptId(),
        type: g.type,
        legs: g.legs.map((l) => legOf(g, l)),
        odds: g.odds,
        stake: D(g.stake).toFixed(2),
        potentialReturn: grossReturn(g.stake, g.odds).toFixed(2),
        placedAt,
        status: 'open' as const,
        live: g.live,
        subsetQuotes: g.type === 'builder' ? { ...QUOTES_QV1 } : undefined,
        rules: RULES,
      },
    }))
}

export const INITIAL_BETS: AcceptedBet[] = [
  {
    id: 'TS-H1ST0R',
    type: 'single',
    legs: [
      {
        eventId: 'archive-01',
        eventLabel: 'Harrowgate v Oakhurst',
        marketName: 'Match result',
        selectionId: 'HOME',
        label: 'Harrowgate',
        period: '90 min + stoppage',
        odds: '1.80',
      },
    ],
    odds: '1.80',
    stake: '5.00',
    potentialReturn: '9.00',
    placedAt: '2026-10-18T12:00:00Z',
    status: 'void',
    settlement: { odds: '1.00', gross: '5.00', reason: 'Match cancelled — your stake was returned.', at: '2026-10-18T17:40:00Z', legResults: { HOME: 'void' } },
    rules: RULES,
  },
]

export const INITIAL_LEDGER: LedgerEntry[] = [
  { id: 'seed-01', type: 'opening_balance', delta: '100.00', at: '2026-10-18T09:00:00Z', label: 'Demo funds' },
  { id: 'historic-bet-01', type: 'stake', delta: '-5.00', betId: 'TS-H1ST0R', at: '2026-10-18T12:00:00Z', label: 'Stake · Harrowgate v Oakhurst' },
  { id: 'historic-refund-01', type: 'void_return', delta: '5.00', betId: 'TS-H1ST0R', at: '2026-10-18T17:40:00Z', label: 'Void return · Harrowgate v Oakhurst' },
]
