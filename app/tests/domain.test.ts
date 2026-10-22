// RULES-GB-01 money and settlement checks, mapped to Astra's scenario cases.
import { describe, expect, it } from 'vitest'
import { evaluate, SCENARIOS, type Scenario } from '../src/domain/builder'
import { accaOdds, grossReturn } from '../src/domain/money'
import { remaining, used, type DepositRecord } from '../src/domain/limits'
import { INITIAL_STATE, reducer } from '../src/state/store'
import { planBets } from '../src/domain/bets'

const BUILDER = ['HOME', 'OVER_2_5', 'PLAYER_2_SOT']
const sc = (id: string) => SCENARIOS.find((s) => s.id === id)!

describe('R01 returns', () => {
  it('£10 at 3.40 returns £34', () => expect(grossReturn('10', '3.40').toFixed(2)).toBe('34.00'))
  it('C38 half penny rounds up once: £1.25 × 2.10 = £2.63', () => expect(grossReturn('1.25', '2.10').toFixed(2)).toBe('2.63'))
  it('C44 accumulator keeps the exact product and rounds the return once', () => {
    const odds = accaOdds(['2.10', '1.80', '1.65'])
    expect(odds.toString()).toBe('6.237')
    expect(grossReturn('1.25', odds).toFixed(2)).toBe('7.80')
  })
})

describe('R05/R06 Bet Builder settlement via Explore outcomes', () => {
  it('C05/C27 Costa does not play → remaining subset at archived 2.70, £27 if both win', () => {
    const { outcome } = evaluate(BUILDER, sc('no-costa'))
    expect(outcome.kind).toBe('conditional')
    if (outcome.kind === 'conditional') {
      expect(outcome.odds).toBe('2.70')
      expect(grossReturn('10', outcome.odds).toFixed(2)).toBe('27.00')
    }
    const settled: Scenario = { id: 'x', title: '', detail: '', status: { HOME: 'won', OVER_2_5: 'won', PLAYER_2_SOT: 'void' }, why: {} }
    const r = evaluate(BUILDER, settled).outcome
    expect(r.kind === 'won' && r.odds).toBe('2.70')
  })
  it('C37 a draw after 90 settles the builder as lost without knowing the other stats', () => {
    expect(evaluate(BUILDER, sc('draw')).outcome.kind).toBe('lost')
  })
  it('extra time does not count for the 90-minute result', () => {
    expect(evaluate(BUILDER, sc('extra-time')).outcome.kind).toBe('lost')
  })
  it('C30 abandoned at 2–1 with one Costa shot → Over only at 1.80, £18', () => {
    const o = evaluate(BUILDER, sc('abandoned')).outcome
    expect(o.kind).toBe('won')
    if (o.kind === 'won') expect(grossReturn('10', o.odds).toFixed(2)).toBe('18.00')
  })
  it('R06 abandoned with two confirmed Costa shots → Over + Player at 2.50, £25', () => {
    const s: Scenario = { ...sc('abandoned'), status: { ...sc('abandoned').status, PLAYER_2_SOT: 'won' } }
    const o = evaluate(BUILDER, s).outcome
    expect(o.kind === 'won' && grossReturn('10', o.odds).toFixed(2)).toBe('25.00')
  })
  it('C32 Home + Under in an abandoned 2–1 loses once three goals are confirmed', () => {
    expect(evaluate(['HOME', 'UNDER_2_5'], sc('abandoned')).outcome.kind).toBe('lost')
  })
  it('C06 all conditions void returns the stake', () => {
    const s: Scenario = { id: 'v', title: '', detail: '', status: { HOME: 'void', OVER_2_5: 'void', PLAYER_2_SOT: 'void' }, why: {} }
    expect(evaluate(BUILDER, s).outcome.kind).toBe('refund')
  })
})

describe('R11 deposit limits by elapsed time', () => {
  const dep = (at: string, amount = '15.00'): DepositRecord => ({ id: at, amount, at, status: 'confirmed' })
  const limits = { daily: '20.00', weekly: '50.00', monthly: '100.00' }
  it('C15 £15 deposited leaves £5 under a £20 24-hour limit', () => {
    expect(remaining([dep('2026-10-20T10:00:00Z')], limits, '2026-10-20T12:00:00Z').left.toFixed(2)).toBe('5.00')
  })
  it('C39 midnight does not reset the 24-hour window', () => {
    expect(used([dep('2026-10-20T22:30:00Z')], 'daily', '2026-10-21T01:00:00Z').toFixed(2)).toBe('15.00')
  })
  it('a deposit exactly 24 hours old has aged out', () => {
    expect(used([dep('2026-10-20T10:00:00Z')], 'daily', '2026-10-21T10:00:00Z').toFixed(2)).toBe('0.00')
  })
  it('C40 the clock change does not shorten 24 hours', () => {
    // BST ends 25 Oct 2026 at 01:00 UTC
    expect(used([dep('2026-10-24T23:30:00Z', '20.00')], 'daily', '2026-10-25T23:00:00Z').toFixed(2)).toBe('20.00')
    expect(used([dep('2026-10-24T23:30:00Z', '20.00')], 'daily', '2026-10-25T23:30:00Z').toFixed(2)).toBe('0.00')
  })
  it('the calendar month starts at 00:00 London time', () => {
    expect(used([dep('2026-09-30T23:30:00Z')], 'monthly', '2026-10-10T12:00:00Z').toFixed(2)).toBe('15.00')
    expect(used([dep('2026-09-30T22:30:00Z')], 'monthly', '2026-10-10T12:00:00Z').toFixed(2)).toBe('0.00')
  })
  it('failed deposits never consume the limit', () => {
    expect(used([{ ...dep('2026-10-20T10:00:00Z'), status: 'failed' }], 'daily', '2026-10-20T12:00:00Z').toFixed(2)).toBe('0.00')
  })
})

describe('Ledger: one debit, one terminal resolution', () => {
  const groups = [
    { id: 'g1', eventId: 'football-01', type: 'builder' as const, legs: BUILDER.map((id) => ({ marketId: 'x', marketName: 'x', selectionId: id, label: id, odds: '2.00', period: '90' })), odds: '3.40', stake: '10' },
    { id: 'g2', eventId: 'football-02', type: 'single' as const, legs: [{ marketId: 'RESULT_90', marketName: 'Match result', selectionId: 'HOME', label: 'Eastford Rovers', odds: '1.80', period: '90' }], odds: '1.80', stake: '5' },
  ]
  const plan = planBets(groups, 'singles', '', '2026-10-20T18:00:00Z')
  const placed = reducer({ ...INITIAL_STATE, groups }, { type: 'placed', bets: plan.map((p) => p.bet), consumed: plan.flatMap((p) => p.consumes), acca: false })

  it('C46 placing debits each stake once and consumes the submitted groups', () => {
    expect(placed.available).toBe('85.00')
    expect(placed.groups).toHaveLength(0)
    expect(placed.bets.filter((b) => b.status === 'open')).toHaveLength(2)
  })
  it('C12 Cash Out credits the offer once: £10 stake, £8 cash out → £98 from £100', () => {
    const one = reducer({ ...INITIAL_STATE, groups: [groups[0]] }, { type: 'placed', bets: [plan[0].bet], consumed: ['g1'], acca: false })
    const out = reducer(one, { type: 'cashOut', betId: plan[0].bet.id, amount: '8.00', at: '2026-10-20T19:30:00Z' })
    expect(out.available).toBe('98.00')
    // C14: a later settlement cannot pay again
    const late = reducer(out, { type: 'settle', betId: plan[0].bet.id, status: 'won', settlement: { odds: '3.40', gross: '34.00', reason: '', at: '' } })
    expect(late.available).toBe('98.00')
  })
  it('settling twice never pays twice', () => {
    const id = plan[1].bet.id
    const s1 = reducer(placed, { type: 'settle', betId: id, status: 'won', settlement: { odds: '1.80', gross: '9.00', reason: '', at: '' } })
    const s2 = reducer(s1, { type: 'settle', betId: id, status: 'won', settlement: { odds: '1.80', gross: '9.00', reason: '', at: '' } })
    expect(s1.available).toBe('94.00')
    expect(s2.available).toBe('94.00')
  })
  it('C16 a withdrawal reserves once; rejecting restores once', () => {
    const w = reducer(INITIAL_STATE, { type: 'withdraw', amount: '20.00', at: '2026-10-20T12:00:00Z' })
    expect(w.available).toBe('80.00')
    const id = w.withdrawals[0].id
    const ok = reducer(w, { type: 'withdrawalResolve', id, ok: true, at: '' })
    expect(ok.available).toBe('80.00')
    const back = reducer(w, { type: 'withdrawalResolve', id, ok: false, at: '' })
    expect(back.available).toBe('100.00')
    expect(reducer(back, { type: 'withdrawalResolve', id, ok: false, at: '' }).available).toBe('100.00')
  })
  it('C17 a limit increase waits; a decrease applies straight away', () => {
    const inc = reducer(INITIAL_STATE, { type: 'setLimit', key: 'daily', value: '40', at: '2026-10-20T12:00:00Z' })
    expect(inc.limits.daily).toBe('20.00')
    expect(inc.pendingIncrease?.availableAt).toBe('2026-10-21T12:00:00.000Z')
    const dec = reducer(INITIAL_STATE, { type: 'setLimit', key: 'daily', value: '10', at: '2026-10-20T12:00:00Z' })
    expect(dec.limits.daily).toBe('10.00')
  })
  it('C19 self-exclusion closes gambling and reserves the balance for return', () => {
    const ex = reducer(INITIAL_STATE, { type: 'exclude', at: '2026-10-20T12:00:00Z' })
    expect(ex.restriction).toBe('excluded')
    expect(ex.available).toBe('0.00')
    expect(ex.withdrawals[0].amount).toBe('100.00')
  })
})

describe('R08 unknown response and C43 closed drafts', () => {
  const g = { id: 'g9', eventId: 'football-02', type: 'single' as const, legs: [{ marketId: 'RESULT_90', marketName: 'Match result', selectionId: 'HOME', label: 'Eastford Rovers', odds: '1.80', period: '90' }], odds: '1.80', stake: '10' }
  const [p] = planBets([g], 'singles', '', '2026-10-20T18:00:00Z')
  const op = { opId: 'OP-1', bets: [p.bet], consumed: ['g9'], acca: false, at: '' }
  it('C09 while unknown nothing is debited; recovering as accepted debits exactly once', () => {
    const pending = reducer({ ...INITIAL_STATE, groups: [g] }, { type: 'pendingStart', op: { ...op, resolveAs: 'accepted' } })
    expect(pending.available).toBe('100.00')
    expect(pending.groups).toHaveLength(1)
    const done = reducer(pending, { type: 'pendingResolve' })
    expect(done.available).toBe('90.00')
    expect(done.groups).toHaveLength(0)
    expect(reducer(done, { type: 'pendingResolve' }).available).toBe('90.00')
  })
  it('C10 recovering as rejected debits nothing and keeps the draft', () => {
    const pending = reducer({ ...INITIAL_STATE, groups: [g] }, { type: 'pendingStart', op: { ...op, resolveAs: 'rejected' } })
    const done = reducer(pending, { type: 'pendingResolve' })
    expect(done.available).toBe('100.00')
    expect(done.groups).toHaveLength(1)
    expect(done.bets.filter((b) => b.status === 'open')).toHaveLength(0)
  })
  it('C43 kick-off keeps a pre-match builder draft but marks it closed', async () => {
    const { isClosedDraft } = await import('../src/state/store')
    const b = { id: 'b1', eventId: 'football-01', type: 'builder' as const, legs: [], odds: '3.40', stake: '10' }
    const live = reducer({ ...INITIAL_STATE, groups: [b] }, { type: 'f01', phase: 'live-68' })
    expect(live.groups).toHaveLength(1)
    expect(isClosedDraft(live.groups[0])).toBe(true)
    reducer(live, { type: 'f01', phase: 'pre' })
  })
})

describe('C48 explicit conversion to Bet Builder', () => {
  const leg = (id: string) => ({ marketId: 'x', marketName: 'x', selectionId: id, label: id, odds: '2.00', period: '90' })
  const a = { id: 'a', eventId: 'football-01', type: 'single' as const, legs: [leg('HOME')], odds: '2.10', stake: '10' }
  const b = { id: 'b', eventId: 'football-01', type: 'single' as const, legs: [leg('OVER_2_5')], odds: '1.80', stake: '5' }
  it('replaces the singles once, uses the joint price and does not inherit stakes', () => {
    const s = reducer({ ...INITIAL_STATE, groups: [a, b] }, { type: 'convertToBuilder', groupIds: ['a', 'b'], odds: '2.70' })
    expect(s.groups).toHaveLength(1)
    expect(s.groups[0].type).toBe('builder')
    expect(s.groups[0].odds).toBe('2.70')
    expect(s.groups[0].stake).toBe('')
    expect(s.available).toBe('100.00')
  })
})
