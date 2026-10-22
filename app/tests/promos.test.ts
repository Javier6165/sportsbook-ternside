// Promotions: opt-in, free bets with stake not returned, rewards decided once at settlement.
import { describe, expect, it } from 'vitest'
import { planBets } from '../src/domain/bets'
import { freeBetReturn, issueFreeBet, usableFreeBets } from '../src/domain/promos'
import { INITIAL_STATE, reducer, type State } from '../src/state/store'

const JOIN_AT = '2026-10-20T17:00:00Z'
const AT = '2026-10-20T18:00:00Z'
const leg = (id: string, odds: string, marketName = 'Match result') => ({ marketId: 'RESULT_90', marketName, selectionId: id, label: id, odds, period: '90' })
const single = (id: string, eventId: string, odds: string, stake = '10', extra: object = {}) => ({ id, eventId, type: 'single' as const, legs: [leg('HOME', odds)], odds, stake, ...extra })
const BUILDER = ['HOME', 'OVER_2_5', 'PLAYER_2_SOT']
const builder = (stake = '10', odds = '3.40') => ({ id: 'bb', eventId: 'football-01', type: 'builder' as const, legs: BUILDER.map((id) => leg(id, '2.00')), odds, stake })

function place(s: State, groups: State['groups']) {
  const plan = planBets(groups, 'singles', '', AT, s.freeBets)
  return { s: reducer({ ...s, groups }, { type: 'placed', bets: plan.map((p) => p.bet), consumed: plan.flatMap((p) => p.consumes), acca: false }), bets: plan.map((p) => p.bet) }
}
const join = (s: State, id: Parameters<typeof reducer>[1] extends infer A ? (A extends { type: 'promoJoin'; id: infer I } ? I : never) : never) => reducer(s, { type: 'promoJoin', id, at: JOIN_AT })

describe('Free bets: stake not returned, used once, no cash debit', () => {
  it('£5 free bet at 3.40 returns £12.00, not £17.00', () => expect(freeBetReturn('5.00', '3.40').toFixed(2)).toBe('12.00'))
  it('rounds once: £5 at 2.15 → £5.75', () => expect(freeBetReturn('5.00', '2.15').toFixed(2)).toBe('5.75'))
  const fb = issueFreeBet('matchday-free-bet', '5', AT)
  const s0: State = { ...INITIAL_STATE, freeBets: [fb] }
  it('placing with a free bet leaves the balance alone and marks the free bet used', () => {
    const g = single('g', 'football-02', '1.80', '', { freeBetId: fb.id })
    const { s, bets } = place(s0, [g])
    expect(s.available).toBe('100.00')
    expect(bets[0].stake).toBe('5.00')
    expect(bets[0].potentialReturn).toBe('4.00')
    expect(s.freeBets[0].status).toBe('used')
    expect(s.ledger[0]).toMatchObject({ type: 'free_bet', delta: '0.00' })
  })
  it('a free bet below its minimum odds (1.50) is not applied', () => {
    expect(planBets([single('g', 'football-02', '1.40', '', { freeBetId: fb.id })], 'singles', '', AT, [fb])).toHaveLength(0)
  })
  it('the same free bet cannot be put on two selections', () => {
    const s = { ...s0, groups: [single('a', 'football-02', '1.80', ''), single('b', 'football-03', '1.80', '')] }
    const one = reducer(s, { type: 'useFreeBet', groupId: 'a', freeBetId: fb.id })
    expect(reducer(one, { type: 'useFreeBet', groupId: 'b', freeBetId: fb.id })).toBe(one)
  })
  it('a void free-bet bet gives the free bet back, not cash', () => {
    const { s, bets } = place(s0, [single('g', 'football-02', '1.80', '', { freeBetId: fb.id })])
    const v = reducer(s, { type: 'settle', betId: bets[0].id, status: 'void', settlement: { odds: '1.80', gross: '0.00', reason: '', at: AT } })
    expect(v.available).toBe('100.00')
    expect(v.freeBets[0].status).toBe('available')
  })
  it('expires after 7 days on the account clock', () => {
    expect(usableFreeBets([fb], '2026-10-27T17:59:59Z')).toHaveLength(1)
    expect(usableFreeBets([fb], '2026-10-27T18:00:00Z')).toHaveLength(0)
  })
})

describe('Opt-in rules', () => {
  it('joining is explicit and once', () => {
    const s = join(INITIAL_STATE, 'two-up')
    expect(s.promos['two-up']?.joinedAt).toBe(JOIN_AT)
    expect(join(s, 'two-up')).toBe(s)
  })
  it('the welcome offer is for new customers only', () => expect(join(INITIAL_STATE, 'welcome')).toBe(INITIAL_STATE))
  it('no promotions during a break', () => {
    const p = reducer(INITIAL_STATE, { type: 'pause', until: '2026-10-21T18:00:00Z' })
    expect(join(p, 'two-up')).toBe(p)
    expect(reducer(p, { type: 'predictorSave', picks: {}, at: AT })).toBe(p)
  })
  it('self-exclusion ends promotions and removes unused free bets', () => {
    const s = { ...join(INITIAL_STATE, 'two-up'), freeBets: [issueFreeBet('matchday-free-bet', '5', AT)] }
    const ex = reducer(s, { type: 'exclude', at: AT })
    expect(ex.promos).toEqual({})
    expect(ex.freeBets).toHaveLength(0)
  })
})

describe('Matchday free bet', () => {
  const settle = (s: State, id: string, status: 'won' | 'lost' | 'void') => reducer(s, { type: 'settle', betId: id, status, settlement: { odds: '2.10', gross: status === 'won' ? '21.00' : status === 'void' ? '10.00' : '0.00', reason: '', at: '2026-10-20T20:00:00Z' } })
  it('a £10 pre-match Continental Cup bet at 2.10 earns £5 once it settles, win or lose', () => {
    const { s, bets } = place(join(INITIAL_STATE, 'matchday-free-bet'), [single('g', 'football-01', '2.10')])
    expect(s.freeBets).toHaveLength(0)
    const lost = settle(s, bets[0].id, 'lost')
    expect(lost.freeBets.map((f) => f.amount)).toEqual(['5.00'])
    expect(lost.promos['matchday-free-bet']?.completedAt).toBeTruthy()
  })
  it('does not count without opting in, under £10, on another competition, or when void', () => {
    expect(settle(place(INITIAL_STATE, [single('g', 'football-01', '2.10')]).s, place(INITIAL_STATE, [single('g', 'football-01', '2.10')]).bets[0].id, 'lost').freeBets).toHaveLength(0)
    const j = join(INITIAL_STATE, 'matchday-free-bet')
    for (const g of [single('g', 'football-01', '2.10', '9.99'), single('g', 'football-02', '1.80')]) {
      const r = place(j, [g])
      expect(settle(r.s, r.bets[0].id, 'lost').freeBets).toHaveLength(0)
    }
    const v = place(j, [single('g', 'football-01', '2.10')])
    expect(settle(v.s, v.bets[0].id, 'void').freeBets).toHaveLength(0)
  })
  it('pays once: a second qualifying bet earns nothing more', () => {
    const r1 = place(join(INITIAL_STATE, 'matchday-free-bet'), [single('g', 'football-01', '2.10')])
    const s1 = settle(r1.s, r1.bets[0].id, 'lost')
    const r2 = place(s1, [single('h', 'football-01', '2.10')])
    expect(settle(r2.s, r2.bets[0].id, 'lost').freeBets).toHaveLength(1)
  })
})

describe('Bet Builder Insurance', () => {
  const lose = (s: State, id: string, legResults: Record<string, 'won' | 'lost' | 'void'>) => reducer(s, { type: 'settle', betId: id, status: 'lost', settlement: { odds: '3.40', gross: '0.00', reason: '', at: '2026-10-20T20:00:00Z', legResults } })
  it('loses by exactly one condition → stake back as a free bet, capped at £5', () => {
    const r = place(join(INITIAL_STATE, 'bb-insurance'), [builder('10')])
    const s = lose(r.s, r.bets[0].id, { HOME: 'won', OVER_2_5: 'won', PLAYER_2_SOT: 'lost' })
    expect(s.freeBets.map((f) => f.amount)).toEqual(['5.00'])
  })
  it('a £3 stake refunds £3', () => {
    const r = place(join(INITIAL_STATE, 'bb-insurance'), [builder('3')])
    expect(lose(r.s, r.bets[0].id, { HOME: 'won', OVER_2_5: 'won', PLAYER_2_SOT: 'lost' }).freeBets[0].amount).toBe('3.00')
  })
  it('two losing conditions, or a void plus a loss, refund nothing', () => {
    const r = place(join(INITIAL_STATE, 'bb-insurance'), [builder('10')])
    expect(lose(r.s, r.bets[0].id, { HOME: 'lost', OVER_2_5: 'won', PLAYER_2_SOT: 'lost' }).freeBets).toHaveLength(0)
    expect(lose(r.s, r.bets[0].id, { HOME: 'won', OVER_2_5: 'void', PLAYER_2_SOT: 'lost' }).freeBets).toHaveLength(0)
  })
  it('a joint price under 2.00 does not qualify', () => {
    const r = place(join(INITIAL_STATE, 'bb-insurance'), [builder('10', '1.90')])
    expect(lose(r.s, r.bets[0].id, { HOME: 'won', OVER_2_5: 'won', PLAYER_2_SOT: 'lost' }).freeBets).toHaveLength(0)
  })
})

describe('2 Goals Ahead', () => {
  it('pays a qualifying home-win single early at the accepted price, once', () => {
    const r = place(join(INITIAL_STATE, 'two-up'), [single('g', 'football-02', '1.80')])
    const s = reducer(r.s, { type: 'earlyPayout', betId: r.bets[0].id, at: '2026-10-20T19:10:00Z' })
    expect(s.available).toBe('108.00')
    expect(s.bets[0]).toMatchObject({ status: 'won', promo: 'two-up' })
    expect(reducer(s, { type: 'earlyPayout', betId: r.bets[0].id, at: '' })).toBe(s)
  })
  it('does not apply without opting in or above a £20 stake', () => {
    const a = place(INITIAL_STATE, [single('g', 'football-02', '1.80')])
    expect(reducer(a.s, { type: 'earlyPayout', betId: a.bets[0].id, at: '' })).toBe(a.s)
    const b = place(join(INITIAL_STATE, 'two-up'), [single('g', 'football-02', '1.80', '25')])
    expect(reducer(b.s, { type: 'earlyPayout', betId: b.bets[0].id, at: '' })).toBe(b.s)
  })
})
