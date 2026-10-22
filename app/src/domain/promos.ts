// Promotions: few, plain and opt-in. Sports-only free bets with no wagering requirement (0x).
// Every reward is decided here from the accepted bet and its settlement — never from the live score.
import { eventById } from '../data/catalog'
import type { AcceptedBet } from './bets'
import Decimal from 'decimal.js'
import { D, grossReturn } from './money'

export type PromoId = 'predictor' | 'two-up' | 'bb-insurance' | 'matchday-free-bet' | 'welcome'

export interface Promo {
  id: PromoId
  title: string
  /** one sentence a first-time bettor understands */
  headline: string
  /** the three conditions that matter, always visible */
  key: { label: string; value: string }[]
  terms: string[]
  audience: 'existing' | 'new'
  /** free-to-play promos never need a stake */
  freeToPlay?: boolean
  route?: string
  tone: 'cobalt' | 'night' | 'team'
}

export const FREE_BET_MIN_ODDS = '1.50'

/** The four Continental Cup matches in this week’s Predictor round. */
export const PREDICTOR_EVENTS = ['football-01', 'football-cc-02', 'football-cc-03', 'football-cc-04']

export const PROMOS: Promo[] = [
  {
    id: 'predictor',
    title: 'Matchday Predictor',
    headline: 'Predict four Continental Cup scores for free. Get all four right and win £100 in free bets.',
    key: [
      { label: 'Cost', value: 'Free to play' },
      { label: 'Prize', value: '£100 free bets' },
      { label: 'Closes', value: 'Today 20:00' },
    ],
    terms: [
      'Free to enter. No bet or deposit needed.',
      'Pick the exact 90-minute score of the four listed matches before the first kick-off.',
      'All four correct wins £100 in free bets — not cash — as four £25 free bets, each lasting 7 days. If more than one entry wins, the £100 is shared equally.',
      'One entry per account. Entries can be changed until the first kick-off.',
      'Not available while a break or self-exclusion is active.',
    ],
    audience: 'existing',
    freeToPlay: true,
    route: '/promotions/predictor',
    tone: 'night',
  },
  {
    id: 'two-up',
    title: '2 Goals Ahead',
    headline: 'Back a team to win and we pay you as a winner if they go two goals ahead.',
    key: [
      { label: 'Market', value: 'Match result' },
      { label: 'Bet type', value: 'Pre-match single' },
      { label: 'Max stake', value: '£20' },
    ],
    terms: [
      'Opt in first. Applies to pre-match singles on the Match result of football matches placed after opting in.',
      'If your team goes two goals ahead at any point in the 90 minutes, the bet settles as a winner straight away at the price you took. Only goals that stand count: a goal ruled out before we pay doesn’t trigger it.',
      'Once paid early, the result at full time no longer changes your bet. If the match is abandoned before your team goes two up, normal abandonment rules apply.',
      'If they don’t, the bet settles normally at full time.',
      'Stakes up to £20 per bet qualify. Draw selections, live bets and Bet Builders are not included.',
      'Paid in cash, not free bets. No wagering.',
    ],
    audience: 'existing',
    tone: 'team',
  },
  {
    id: 'bb-insurance',
    title: 'Bet Builder Insurance',
    headline: 'If your three-condition Bet Builder loses by just one condition, get a free bet worth your stake, up to £5.',
    key: [
      { label: 'Bet type', value: 'Bet Builder · 3 conditions' },
      { label: 'Refund', value: 'Up to £5 free bet' },
      { label: 'Min odds', value: '2.00' },
    ],
    terms: [
      'Opt in first. Applies to cash Bet Builders with exactly three conditions placed after opting in, at a joint price of 2.00 or more.',
      'If exactly one condition loses and the other two win, you get a free bet worth your stake, up to £5. It’s promotional credit, not cash, and it doesn’t make the bet risk-free.',
      'Void conditions don’t count as losing. One refund per day.',
      'The free bet lasts 7 days, has no wagering and its stake isn’t included in the return.',
    ],
    audience: 'existing',
    tone: 'cobalt',
  },
  {
    id: 'matchday-free-bet',
    title: 'Matchday free bet',
    headline: 'Bet £10 on any Continental Cup match this week and get a £5 free bet once it settles.',
    key: [
      { label: 'Qualifying bet', value: '£10 cash' },
      { label: 'Min odds', value: '1.50' },
      { label: 'Reward', value: '£5 free bet' },
    ],
    terms: [
      'Opt in first. Your first pre-match cash bet of £10 or more on a Continental Cup match, at odds of 1.50 or more, qualifies.',
      'The £5 free bet is added when that bet settles, win or lose. Void bets don’t qualify.',
      'One free bet per account. The free bet lasts 7 days.',
      'Free bets can be used at odds of 1.50 or more. No wagering; the free bet stake isn’t included in the return.',
    ],
    audience: 'existing',
    tone: 'night',
  },
  {
    id: 'welcome',
    title: 'Welcome offer',
    headline: 'New to Ternside? Bet £10 and get £10 in free bets.',
    key: [
      { label: 'Who', value: 'New customers' },
      { label: 'Qualifying bet', value: '£10 at 1.50+' },
      { label: 'Reward', value: '2 × £5 free bets' },
    ],
    terms: [
      'New customers only, 18+, UK residents. One offer per person, household and payment method.',
      'Place your first cash bet of £10 or more at odds of 1.50 or more within 14 days of signing up.',
      'Get two £5 free bets when it settles. Each lasts 7 days.',
      'No wagering. The free bet stake isn’t included in the return.',
    ],
    audience: 'new',
    tone: 'cobalt',
  },
]

export const promoById = (id: PromoId) => PROMOS.find((p) => p.id === id)!

export interface FreeBet {
  id: string
  amount: string
  source: PromoId
  issuedAt: string
  expiresAt: string
  minOdds: string
  status: 'available' | 'used'
  usedOn?: string
}

export interface PromoEntry {
  joinedAt: string
  /** set once the promo has paid out (or been used up) */
  completedAt?: string
  note?: string
}

/** Free bet return: the stake is not included (stake × odds − stake), rounded once. */
export function freeBetReturn(amount: string, odds: string) {
  return grossReturn(amount, odds).minus(amount)
}

export const isExpired = (fb: FreeBet, now: string) => Date.parse(now) >= Date.parse(fb.expiresAt)
export const usableFreeBets = (fbs: FreeBet[], now: string) => fbs.filter((f) => f.status === 'available' && !isExpired(f, now))

const days = (iso: string, n: number) => new Date(Date.parse(iso) + n * 86_400_000).toISOString()
export function issueFreeBet(source: PromoId, amount: string, at: string): FreeBet {
  return { id: `fb-${source}-${Date.parse(at).toString(36)}`, amount: D(amount).toFixed(2), source, issuedAt: at, expiresAt: days(at, 7), minOdds: FREE_BET_MIN_ODDS, status: 'available' }
}

const placedAfter = (bet: AcceptedBet, e?: PromoEntry) => !!e && !e.completedAt && Date.parse(bet.placedAt) >= Date.parse(e.joinedAt)

/** Does this accepted bet count for the Matchday free bet? */
export function qualifiesMatchday(bet: AcceptedBet, e?: PromoEntry) {
  if (!placedAfter(bet, e) || bet.freeBet || bet.live) return false
  if (D(bet.stake).lt(10) || D(bet.odds).lt(1.5)) return false
  return bet.legs.some((l) => eventById(l.eventId)?.competitionId === 'continental-cup')
}

export function qualifiesInsurance(bet: AcceptedBet, e?: PromoEntry) {
  return placedAfter(bet, e) && !bet.freeBet && bet.type === 'builder' && bet.legs.length === 3 && D(bet.odds).gte(2)
}

export function qualifiesTwoUp(bet: AcceptedBet, e?: PromoEntry) {
  const l = bet.legs[0]
  return placedAfter(bet, e) && !bet.freeBet && !bet.live && bet.type === 'single' && l.marketName === 'Match result' && (l.selectionId === 'HOME' || l.selectionId === 'AWAY') && eventById(l.eventId)?.sport === 'football' && D(bet.stake).lte(20)
}

/**
 * Rewards earned when a bet settles. Pure: the reducer applies the result once,
 * because a bet can only reach one terminal settlement.
 */
export function rewardsOnSettle(bet: AcceptedBet, status: 'won' | 'lost' | 'void', legResults: Record<string, 'won' | 'lost' | 'void'> | undefined, promos: Partial<Record<PromoId, PromoEntry>>, at: string) {
  const out: { promo: PromoId; freeBet: FreeBet; note: string }[] = []
  if (status !== 'void' && qualifiesMatchday(bet, promos['matchday-free-bet'])) out.push({ promo: 'matchday-free-bet', freeBet: issueFreeBet('matchday-free-bet', '5', at), note: `Qualified with ${bet.id}` })
  if (status === 'lost' && legResults && qualifiesInsurance(bet, promos['bb-insurance'])) {
    const r = Object.values(legResults)
    if (r.filter((x) => x === 'lost').length === 1 && r.filter((x) => x === 'won').length === 2) {
      out.push({ promo: 'bb-insurance', freeBet: issueFreeBet('bb-insurance', Decimal.min(bet.stake, 5).toFixed(2), at), note: `One condition lost on ${bet.id}` })
    }
  }
  return out
}

/** 2 Goals Ahead: the bet settles early as a winner at the accepted price. */
export const twoUpPayout = (bet: AcceptedBet) => grossReturn(bet.stake, bet.odds).toFixed(2)
