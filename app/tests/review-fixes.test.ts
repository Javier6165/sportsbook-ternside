// Regression tests for Astra's review (round 2): money input, limit wait, accepted snapshot,
// post-exclusion returns, pause expiry and the accumulator from qualifying picks.
import { describe, expect, it } from 'vitest'
import { evaluate, SCENARIOS, type Scenario } from '../src/domain/builder'
import { EDITABLE_AMOUNT, grossReturn, isValidStake, parseAmount } from '../src/domain/money'
import { planBets, splitAcca, ACCA_MAX } from '../src/domain/bets'
import { INITIAL_STATE, isClosedDraft, reducer, type State } from '../src/state/store'
import { quoteFor } from '../src/data/quotes'

const BUILDER = ['HOME', 'OVER_2_5', 'PLAYER_2_SOT']
const leg = (id: string, odds = '2.00') => ({ marketId: 'RESULT_90', marketName: 'Match result', selectionId: id, label: id, odds, period: '90' })
const single = (id: string, eventId: string, odds = '2.00', extra: object = {}) => ({ id, eventId, type: 'single' as const, legs: [leg('HOME', odds)], odds, stake: '10', ...extra })

describe('Money input never crashes and never moves money when invalid', () => {
  it.each(['', '.', '1.', '-5', 'abc', '1e3', '0', '0.00', '1.234', ' 5', '5 '])('parseAmount(%j) → null', (v) => expect(parseAmount(v)).toBeNull())
  it.each([
    ['5', '5'],
    ['5.5', '5.5'],
    ['0.01', '0.01'],
    ['50.00', '50'],
  ])('parseAmount(%j) → %s', (v, out) => expect(parseAmount(v)!.toString()).toBe(out))
  it('the editing pattern accepts partial input like "." and "1." without parsing it', () => {
    for (const v of ['', '.', '1.', '12.3', '12.34']) expect(EDITABLE_AMOUNT.test(v)).toBe(true)
    for (const v of ['12.345', '-1', 'a', '1,5']) expect(EDITABLE_AMOUNT.test(v)).toBe(false)
  })
  it('stake validity is £1–£50 and rejects partial values', () => {
    expect(isValidStake('.')).toBe(false)
    expect(isValidStake('1.')).toBe(false)
    expect(isValidStake('0.99')).toBe(false)
    expect(isValidStake('1')).toBe(true)
    expect(isValidStake('50.01')).toBe(false)
  })
  it.each(['', '.', '1.', '-5', 'abc'])('deposit/withdraw/setLimit with %j leave the state untouched', (v) => {
    const at = '2026-10-20T12:00:00Z'
    expect(reducer(INITIAL_STATE, { type: 'deposit', amount: v, at })).toBe(INITIAL_STATE)
    expect(reducer(INITIAL_STATE, { type: 'withdraw', amount: v, at })).toBe(INITIAL_STATE)
    expect(reducer(INITIAL_STATE, { type: 'setLimit', key: 'daily', value: v, at })).toBe(INITIAL_STATE)
  })
  it('a withdrawal above the available balance is refused', () => {
    expect(reducer(INITIAL_STATE, { type: 'withdraw', amount: '100.01', at: '' })).toBe(INITIAL_STATE)
  })
  it('no deposits while paused or excluded', () => {
    const paused = reducer(INITIAL_STATE, { type: 'pause', until: '2026-10-21T12:00:00Z' })
    expect(reducer(paused, { type: 'deposit', amount: '10', at: '' }).available).toBe(paused.available)
  })
})

describe('R11 limit increase: 24 hours on the account clock, then explicit confirmation', () => {
  const asked = reducer(INITIAL_STATE, { type: 'setLimit', key: 'daily', value: '40', at: '2026-10-20T12:00:00Z' })
  it('confirming before the wait has passed changes nothing', () => {
    expect(reducer(asked, { type: 'confirmIncrease', at: '2026-10-20T12:00:01Z' })).toBe(asked)
    expect(reducer(asked, { type: 'confirmIncrease', at: '2026-10-21T11:59:59Z' })).toBe(asked)
  })
  it('the limit does not rise on its own when the wait passes', () => {
    const later = reducer(asked, { type: 'advanceAccount', hours: 25 })
    expect(later.limits.daily).toBe('20.00')
    expect(later.pendingIncrease).not.toBeNull()
  })
  it('after 24 hours an explicit confirmation applies it once', () => {
    const ok = reducer(asked, { type: 'confirmIncrease', at: '2026-10-21T12:00:00Z' })
    expect(ok.limits.daily).toBe('40.00')
    expect(ok.pendingIncrease).toBeNull()
    expect(reducer(ok, { type: 'confirmIncrease', at: '2026-10-22T12:00:00Z' })).toBe(ok)
  })
  it('a decrease applies immediately and cancels a pending increase on the same limit', () => {
    const dec = reducer(asked, { type: 'setLimit', key: 'daily', value: '10', at: '2026-10-20T13:00:00Z' })
    expect(dec.limits.daily).toBe('10.00')
    expect(dec.pendingIncrease).toBeNull()
  })
})

describe('Explore outcomes on an accepted bet uses the prices archived at acceptance', () => {
  const groups = [{ id: 'b', eventId: 'football-01', type: 'builder' as const, legs: BUILDER.map((id) => leg(id)), odds: '3.20', stake: '10' }]
  const [{ bet }] = planBets(groups, 'singles', '', '2026-10-20T18:00:00Z')
  const all: Scenario = SCENARIOS.find((s) => s.id === 'all-in')!
  it('archives the joint price actually accepted (3.20, not the current 3.40)', () => {
    expect(quoteFor(BUILDER)).toBe('3.40')
    expect(quoteFor(BUILDER, bet.subsetQuotes)).toBe('3.20')
  })
  it('all conditions win → £32.00 at 3.20', () => {
    const o = evaluate(BUILDER, all, bet.subsetQuotes).outcome
    expect(o.kind).toBe('won')
    if (o.kind === 'won') expect(grossReturn('10', o.odds).toFixed(2)).toBe('32.00')
  })
  it('a void condition still settles the rest at its archived subset price (2.70)', () => {
    const o = evaluate(BUILDER, { ...all, status: { ...all.status, PLAYER_2_SOT: 'void' } }, bet.subsetQuotes).outcome
    expect(o.kind === 'won' && o.odds).toBe('2.70')
  })
})

describe('R11 returns that settle after self-exclusion', () => {
  const g = single('s1', 'football-02', '1.80')
  const [p] = planBets([g], 'singles', '', '2026-10-20T18:00:00Z')
  const placed = reducer({ ...INITIAL_STATE, groups: [g] }, { type: 'placed', bets: [p.bet], consumed: ['s1'], acca: false })
  const excluded = reducer(placed, { type: 'exclude', at: '2026-10-20T18:05:00Z' })
  const won = { type: 'settle' as const, betId: p.bet.id, status: 'won' as const, settlement: { odds: '1.80', gross: '18.00', reason: '', at: '2026-10-20T20:00:00Z' } }
  it('the open bet keeps running and its return is reserved, never playable', () => {
    const s = reducer(excluded, won)
    expect(s.available).toBe('0.00')
    expect(s.withdrawals.find((w) => w.id === `excl-ret-${p.bet.id}`)?.amount).toBe('18.00')
    expect(s.bets.find((b) => b.id === p.bet.id)?.status).toBe('won')
  })
  it('settling again reserves nothing more', () => {
    const s1 = reducer(excluded, won)
    const s2 = reducer(s1, won)
    expect(s2).toBe(s1)
    expect(s2.withdrawals.filter((w) => w.id.startsWith('excl-ret-'))).toHaveLength(2) // balance + this return
  })
  it('a losing bet reserves nothing', () => {
    const s = reducer(excluded, { ...won, status: 'lost', settlement: { ...won.settlement, gross: '0.00' } })
    expect(s.withdrawals.filter((w) => w.id === `excl-ret-${p.bet.id}`)).toHaveLength(0)
  })
})

describe('Take a break ends on the account clock', () => {
  const paused: State = reducer(INITIAL_STATE, { type: 'pause', until: '2026-10-21T18:00:00Z' })
  it('stays paused before the end time', () => expect(reducer(paused, { type: 'pauseCheck', at: '2026-10-21T17:59:59Z' })).toBe(paused))
  it('lifts at the end time', () => {
    const s = reducer(paused, { type: 'pauseCheck', at: '2026-10-21T18:00:00Z' })
    expect(s.restriction).toBe('none')
    expect(s.pausedUntil).toBeNull()
  })
  it('self-exclusion never lifts on its own', () => {
    const ex = reducer(INITIAL_STATE, { type: 'exclude', at: '2026-10-20T12:00:00Z' })
    expect(reducer(ex, { type: 'pauseCheck', at: '2030-01-01T00:00:00Z' }).restriction).toBe('excluded')
  })
})

describe('Accumulator from the qualifying picks', () => {
  const never = () => false
  it('builders, live prices and a second pick from the same match stay separate, each with a reason', () => {
    const groups = [
      single('a', 'football-02', '2.10'),
      single('b', 'football-03', '1.80'),
      single('c', 'football-02', '3.00'),
      single('d', 'football-04', '1.50', { live: true }),
      { id: 'e', eventId: 'football-01', type: 'builder' as const, legs: BUILDER.map((id) => leg(id)), odds: '3.40', stake: '' },
    ]
    const { legs, out } = splitAcca(groups, never)
    expect(legs.map((g) => g.id)).toEqual(['a', 'b'])
    expect(out.map((o) => [o.g.id, o.why])).toEqual([
      ['c', 'Same match as another pick — use Bet Builder'],
      ['d', 'Live price — accumulators are pre-match'],
      ['e', 'Bet Builder — placed on its own'],
    ])
    const plan = planBets(legs, 'acca', '5', '2026-10-20T18:00:00Z')
    expect(plan).toHaveLength(1)
    expect(plan[0].consumes).toEqual(['a', 'b'])
    expect(plan[0].bet.odds).toBe('3.78')
    expect(plan[0].bet.potentialReturn).toBe('18.90')
  })
  it(`caps at ${ACCA_MAX} selections`, () => {
    const groups = Array.from({ length: 6 }, (_, i) => single(`g${i}`, `ev-${i}`))
    const { legs, out } = splitAcca(groups, never)
    expect(legs).toHaveLength(ACCA_MAX)
    expect(out).toHaveLength(2)
  })
  it('a pick whose match has started is excluded', () => {
    const live = reducer({ ...INITIAL_STATE, groups: [single('x', 'football-01'), single('y', 'football-02'), single('z', 'football-03')] }, { type: 'f01', phase: 'live-68' })
    const { legs, out } = splitAcca(live.groups, isClosedDraft)
    expect(out.map((o) => o.why)).toEqual(['Match has started'])
    expect(legs).toHaveLength(2)
    reducer(live, { type: 'f01', phase: 'pre' })
  })
  it('fewer than two qualifying picks places nothing', () => {
    expect(planBets([single('a', 'football-02')], 'acca', '5', '')).toHaveLength(0)
  })
})
