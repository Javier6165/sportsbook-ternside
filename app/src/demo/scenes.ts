// Curated Demo controls scenes (SIM-01). Each one is an independent, fully
// reconciled setup: bets carry their debit in the ledger, balances add up.
import { QUOTES_QV1 } from '../data/quotes'
import { INITIAL_BETS, INITIAL_LEDGER, type AcceptedBet, type LedgerEntry } from '../domain/bets'
import { evaluate, type Scenario } from '../domain/builder'
import { grossReturn } from '../domain/money'
import { issueFreeBet } from '../domain/promos'
import type { Action, State } from '../state/store'

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
  steps?: { label: string; patch?: Partial<State>; action?: Action; on: (s: State) => boolean }[]
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
      { label: '68’ · Costa 1 shot', patch: { f01: 'live-68' }, on: (s) => s.f01 === 'live-68' },
      { label: '72’ · Costa 2 shots', patch: { f01: 'live-72' }, on: (s) => s.f01 === 'live-72' },
      { label: '72’ · Stat corrected to 1', patch: { f01: 'live-72c' }, on: (s) => s.f01 === 'live-72c' },
      { label: 'Stats feed delayed', patch: { f01: 'live-delayed' }, on: (s) => s.f01 === 'live-delayed' },
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

// —— More moments (C07, C09/C10, C30, C33, C23, C29) ——————————————————————————

const draftBuilder = (stake = '10.00') => ({
  id: 'draft-scene-builder',
  eventId: 'football-01',
  type: 'builder' as const,
  legs: builderBet().legs.map((l) => ({ marketId: l.marketName === 'Match result' ? 'RESULT_90' : l.marketName.startsWith('Total') ? 'TOTAL_2_5_90' : 'PLAYER_SOT_90', marketName: l.marketName, selectionId: l.selectionId, label: l.label, odds: l.odds, period: l.period })),
  odds: '3.40',
  stake,
})

function abandoned(): Partial<State> {
  const bet = builderBet()
  return {
    available: '108.00',
    bets: [
      {
        ...bet,
        status: 'won',
        settlement: {
          odds: '1.80',
          gross: '18.00',
          reason: 'Match abandoned at 2–1 on 70’ and not resumed. The result can’t be decided, so Northbridge to win is void. Three goals were already confirmed, so Over 2.5 stands. Costa had one shot on target, so his condition is void. The bet settles on Over 2.5 alone.',
          at: '2026-10-20T20:40:00Z',
          legResults: { HOME: 'void', OVER_2_5: 'won', PLAYER_2_SOT: 'void' },
        },
      },
      ...INITIAL_BETS,
    ],
    ledger: [{ id: `ret-${BUILDER_ID}`, type: 'return', delta: '18.00', betId: BUILDER_ID, at: '2026-10-20T20:40:00Z', label: 'Return · Northbridge FC v Southport Athletic' }, stakeEntry, ...INITIAL_LEDGER],
    f01: 'abandoned',
  }
}

function corrected(): Partial<State> {
  const id = 'TS-C0RR3C'
  const bet: AcceptedBet = {
    id,
    type: 'single',
    legs: [{ eventId: 'archive-02', eventLabel: 'Ravensworth v Milltown Albion', marketName: 'Match result', selectionId: 'HOME', label: 'Ravensworth', period: '90 min + stoppage', odds: '2.10' }],
    odds: '2.10',
    stake: '10.00',
    potentialReturn: '21.00',
    placedAt: '2026-10-19T13:55:00Z',
    status: 'lost',
    settlement: {
      odds: '2.10',
      gross: '0.00',
      reason: 'Settlement updated: the official result was corrected to 1–2 after a goal was awarded to Milltown Albion. Your earlier £21.00 credit has been reversed by one adjustment.',
      at: '2026-10-20T09:10:00Z',
      legResults: { HOME: 'lost' },
      version: 2,
      history: [{ version: 1, status: 'won', gross: '21.00', at: '2026-10-19T16:52:00Z', reason: 'Settled as a win on the provisional official result, 2–1.' }],
    },
    rules: 'RULES-GB-01 · rev 0.4',
  }
  return {
    available: '90.00',
    bets: [bet, ...INITIAL_BETS],
    ledger: [
      { id: `adj-${id}`, type: 'return', delta: '-21.00', betId: id, at: '2026-10-20T09:10:00Z', label: 'Settlement correction · Ravensworth v Milltown Albion' },
      { id: `ret-${id}`, type: 'return', delta: '21.00', betId: id, at: '2026-10-19T16:52:00Z', label: 'Return · Ravensworth v Milltown Albion' },
      { id: `stake-${id}`, type: 'stake', delta: '-10.00', betId: id, at: '2026-10-19T13:55:00Z', label: 'Stake · Ravensworth v Milltown Albion' },
      ...INITIAL_LEDGER,
    ],
  }
}

function retirement(): Partial<State> {
  const id = 'TS-R3T1RE'
  const bet: AcceptedBet = {
    id,
    type: 'single',
    legs: [{ eventId: 'archive-03', eventLabel: 'F. Gruber v D. Popescu', marketName: 'Match winner', selectionId: 'HOME', label: 'F. Gruber', period: 'Match must complete', odds: '1.75' }],
    odds: '1.75',
    stake: '10.00',
    potentialReturn: '17.50',
    placedAt: '2026-10-20T10:05:00Z',
    status: 'void',
    settlement: { odds: '1.00', gross: '10.00', reason: 'Popescu retired injured in the second set. In this demo’s tennis rules the match must be completed, so the bet is void and your stake is returned — even though Gruber was leading.', at: '2026-10-20T12:40:00Z', legResults: { HOME: 'void' } },
    rules: 'RULES-GB-01 · rev 0.4',
  }
  return {
    bets: [bet, ...INITIAL_BETS],
    ledger: [
      { id: `ret-${id}`, type: 'void_return', delta: '10.00', betId: id, at: '2026-10-20T12:40:00Z', label: 'Void return · F. Gruber v D. Popescu' },
      { id: `stake-${id}`, type: 'stake', delta: '-10.00', betId: id, at: '2026-10-20T10:05:00Z', label: 'Stake · F. Gruber v D. Popescu' },
      ...INITIAL_LEDGER,
    ],
  }
}

SCENES.splice(1, 0, {
  id: 'price',
  title: 'Price change at review',
  detail: 'A £10 Bet Builder is ready. Place it and the joint price moves 3.40 → 3.20 before it’s accepted.',
  build: () => ({ groups: [draftBuilder()], nextPlacement: 'price-change', slipOpen: true }),
  route: '/sports',
})
SCENES.splice(2, 0, {
  id: 'unknown',
  title: 'Checking your bet',
  detail: 'Place the £10 builder and the response gets lost. Check the same operation — no double debit, no auto-resend.',
  build: () => ({ groups: [draftBuilder()], nextPlacement: 'unknown-accepted', slipOpen: true }),
  route: '/sports',
  steps: [
    { label: 'Will turn out accepted', patch: { nextPlacement: 'unknown-accepted' }, on: (s) => s.nextPlacement === 'unknown-accepted' || s.pendingOp?.resolveAs === 'accepted' },
    { label: 'Will turn out rejected', patch: { nextPlacement: 'unknown-rejected' }, on: (s) => s.nextPlacement === 'unknown-rejected' || s.pendingOp?.resolveAs === 'rejected' },
  ],
})
SCENES.push(
  { id: 'abandoned', title: 'Settled: match abandoned', detail: 'Abandoned at 2–1 on 70’. Each condition is resolved on its own: £18, not a full refund.', build: abandoned, route: `/bets/${BUILDER_ID}` },
  { id: 'corrected', title: 'Settlement corrected', detail: 'A win becomes a loss after an official correction. One adjustment, history kept.', build: corrected, route: '/bets/TS-C0RR3C' },
  { id: 'retired', title: 'Tennis retirement', detail: 'The opponent retires. The match wasn’t completed, so the bet is void and the stake comes back.', build: retirement, route: '/bets/TS-R3T1RE' },
  {
    id: 'excluded',
    title: 'Self-exclusion with an open bet',
    detail: 'Sam excludes with a £10 bet still open. Gambling closes at once; the bet still settles and the balance is set aside.',
    build: () => ({
      available: '0.00',
      bets: [builderBet(), ...INITIAL_BETS],
      ledger: [{ id: 'excl-01', type: 'withdrawal', delta: '-90.00', at: '2026-10-20T18:00:00Z', label: 'Balance reserved for return · self-exclusion' }, stakeEntry, ...INITIAL_LEDGER],
      withdrawals: [{ id: 'excl-ret-balance', amount: '90.00', at: '2026-10-20T18:00:00Z', status: 'pending' }],
      restriction: 'excluded',
    }),
    route: '/account-closed',
    steps: [
      {
        label: 'Open bet settles: won £34',
        action: { type: 'settle', betId: BUILDER_ID, status: 'won', settlement: { odds: '3.40', gross: '34.00', reason: 'All three conditions won. Because the account is self-excluded, the return was set aside for refund.', at: '2026-10-20T20:55:00Z', legResults: { HOME: 'won', OVER_2_5: 'won', PLAYER_2_SOT: 'won' } } },
        on: (s) => s.bets.some((b) => b.id === BUILDER_ID && b.status === 'won'),
      },
    ],
  },
)

// —— Promotions ——————————————————————————————————————————————————————————————

const TWO_UP_ID = 'TS-2UP4NB'
const twoUpBet: AcceptedBet = {
  id: TWO_UP_ID,
  type: 'single',
  legs: [{ eventId: 'football-01', eventLabel: 'Northbridge FC v Southport Athletic', marketName: 'Match result', selectionId: 'HOME', label: 'Northbridge FC', period: '90 min + stoppage', odds: '2.10' }],
  odds: '2.10',
  stake: '10.00',
  potentialReturn: '21.00',
  placedAt: '2026-10-20T17:30:00Z',
  status: 'open',
  rules: 'RULES-GB-01 · rev 0.4',
}

SCENES.push(
  {
    id: 'free-bet',
    title: 'Free bet ready',
    detail: 'Sam earned a £5 free bet from the Matchday promotion. Use it on Eastford at 1.80: returns £4.00, because the free bet stake isn’t returned.',
    build: () => ({
      promos: { 'matchday-free-bet': { joinedAt: '2026-10-19T12:00:00Z', completedAt: '2026-10-19T21:00:00Z', note: 'Qualified with TS-C0RR3C' } },
      freeBets: [issueFreeBet('matchday-free-bet', '5', '2026-10-19T21:00:00Z')],
      groups: [{ id: 'draft-scene-fb', eventId: 'football-02', type: 'single', legs: [{ marketId: 'RESULT_90', marketName: 'Match result', selectionId: 'HOME', label: 'Eastford Rovers', odds: '1.80', period: '90 min + stoppage' }], odds: '1.80', stake: '' }],
      slipOpen: true,
    }),
    route: '/promotions',
  },
  {
    id: 'two-up',
    title: '2 Goals Ahead paid out',
    detail: 'Sam opted in and backed Northbridge at 2.10 for £10. When they go 2–0 up, the bet is paid as a winner straight away: £21.',
    build: () => ({
      available: '90.00',
      promos: { 'two-up': { joinedAt: '2026-10-20T17:00:00Z' } },
      bets: [twoUpBet, ...INITIAL_BETS],
      ledger: [{ id: `stake-${TWO_UP_ID}`, type: 'stake', delta: '-10.00', betId: TWO_UP_ID, at: twoUpBet.placedAt, label: 'Stake · Northbridge FC v Southport Athletic' }, ...INITIAL_LEDGER],
    }),
    route: `/bets/${TWO_UP_ID}`,
    steps: [
      {
        label: '58’ · Northbridge go 2–0',
        patch: { f01: 'live-2up' },
        action: { type: 'earlyPayout', betId: TWO_UP_ID, at: '2026-10-20T19:58:00Z' },
        on: (s) => s.bets.some((b) => b.id === TWO_UP_ID && b.status === 'won'),
      },
    ],
  },
)

