// Curated Demo controls scenes (SIM-01). Each one is an independent, fully
// reconciled setup: bets carry their debit in the ledger, balances add up.
import { QUOTES_QV1 } from '../data/quotes'
import { INITIAL_BETS, INITIAL_LEDGER, type AcceptedBet, type LedgerEntry } from '../domain/bets'
import { evaluate, type Scenario } from '../domain/builder'
import { grossReturn } from '../domain/money'
import type { State } from '../state/store'

const BUILDER_ID = 'TS-NB34X0'
const PLACED = '2026-10-20T17:42:00Z'

const builderBet = (): AcceptedBet => ({
  id: BUILDER_ID,
  type: 'builder',
  legs: [
    { eventId: 'football-01', eventLabel: 'Northbridge FC v Southport Athletic', marketName: 'Match result', selectionId: 'HOME', label: 'Northbridge FC to win', period: '90 min + stoppage', odds: '2.10' },
    { eventId: 'football-01', eventLabel: 'Northbridge FC v Southport Athletic', marketName: 'Total goals 2.5', selectionId: 'OVER_2_5', label: 'Over 2.5 goals', period: '90 min + stoppage', odds: '1.80' },
    { eventId: 'football-01', eventLabel: 'Northbridge FC v Southport Athletic', marketName: 'Player shots on target', selectionId: 'PLAYER_2_SOT', label: 'Daniel Costa 2+ shots on target', period: '90 min + stoppage', odds: '1.90' },
  ],
  odds: '3.40',
  stake: '10.00',
  potentialReturn: '34.00',
  placedAt: PLACED,
  status: 'open',
  subsetQuotes: { ...QUOTES_QV1 },
  rules: 'RULES-GB-01 · rev 0.4',
})

const stakeEntry: LedgerEntry = { id: `stake-${BUILDER_ID}`, type: 'stake', delta: '-10.00', betId: BUILDER_ID, at: PLACED, label: 'Stake · Northbridge FC v Southport Athletic' }

const FT_NO_COSTA: Scenario = {
  id: 'ft-no-costa',
  title: '',
  detail: '',
  status: { HOME: 'won', OVER_2_5: 'won', PLAYER_2_SOT: 'void' },
  why: {},
}

function settledNoCosta(): Partial<State> {
  const bet = builderBet()
  const sels = bet.legs.map((l) => l.selectionId)
  const { outcome } = evaluate(sels, FT_NO_COSTA)
  const odds = outcome.kind === 'won' ? outcome.odds : '0'
  const gross = grossReturn(bet.stake, odds).toFixed(2)
  const settled: AcceptedBet = {
    ...bet,
    status: 'won',
    settlement: {
      odds,
      gross,
      reason: 'Selection void — Daniel Costa didn’t take part. Northbridge won 2–1 and Over 2.5 landed, so the bet settled on those two at their archived price.',
      at: '2026-10-20T20:55:00Z',
      legResults: { HOME: 'won', OVER_2_5: 'won', PLAYER_2_SOT: 'void' },
    },
  }
  return {
    available: '117.00',
    bets: [settled, ...INITIAL_BETS],
    ledger: [{ id: `ret-${BUILDER_ID}`, type: 'return', delta: gross, betId: BUILDER_ID, at: '2026-10-20T20:55:00Z', label: 'Return · Northbridge FC v Southport Athletic' }, stakeEntry, ...INITIAL_LEDGER],
    f01: 'ft',
  }
}

export interface Scene {
  id: string
  title: string
  detail: string
  build: () => Partial<State>
  route: string
  /** extra transitions available inside this scene */
  steps?: { label: string; phase: State['f01'] }[]
}

export const SCENES: Scene[] = [
  { id: 'fresh', title: 'Fresh start', detail: 'Sam, verified, £100 demo funds, empty slip. Explore freely.', build: () => ({}), route: '/sports' },
  {
    id: 'placed',
    title: 'Bet placed, kick-off soon',
    detail: '£10 Bet Builder on Northbridge v Southport at 3.40. Balance £90.',
    build: () => ({ available: '90.00', bets: [builderBet(), ...INITIAL_BETS], ledger: [stakeEntry, ...INITIAL_LEDGER] }),
    route: `/bets/${BUILDER_ID}`,
  },
  {
    id: 'live',
    title: 'Live tracking',
    detail: 'The match is on: 68’, 2–1. Follow each condition — then watch a stat get corrected.',
    build: () => ({ available: '90.00', bets: [builderBet(), ...INITIAL_BETS], ledger: [stakeEntry, ...INITIAL_LEDGER], f01: 'live-68' }),
    route: `/bets/${BUILDER_ID}`,
    steps: [
      { label: '68’ · Costa 1 shot', phase: 'live-68' },
      { label: '72’ · Costa 2 shots', phase: 'live-72' },
      { label: '72’ · Stat corrected to 1', phase: 'live-72c' },
    ],
  },
  {
    id: 'cashout',
    title: 'Cash Out',
    detail: 'Same live bet with an £8 offer. Closing it returns £8 — a £2 net loss, nothing more.',
    build: () => ({ available: '90.00', bets: [builderBet(), ...INITIAL_BETS], ledger: [stakeEntry, ...INITIAL_LEDGER], f01: 'live-68' }),
    route: `/bets/${BUILDER_ID}`,
  },
  {
    id: 'void',
    title: 'Settled: Costa didn’t play',
    detail: 'Full time 2–1. His condition is void, the bet pays at the archived 2.70: £27, not £34.',
    build: settledNoCosta,
    route: `/bets/${BUILDER_ID}`,
  },
]
