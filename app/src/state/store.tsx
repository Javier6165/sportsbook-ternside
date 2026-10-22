import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react'
import { EVENTS, eventById, type SportEvent, type SportId } from '../data/catalog'
import { INITIAL_BETS, INITIAL_LEDGER, type AcceptedBet, type LedgerEntry, type Settlement } from '../domain/bets'
import { D, parseAmount } from '../domain/money'
import { promoById, rewardsOnSettle, qualifiesTwoUp, twoUpPayout, type FreeBet, type PromoEntry, type PromoId } from '../domain/promos'
import { applySim, type F01Phase } from '../demo/sim'
import type { DepositRecord, LimitKey } from '../domain/limits'
import { EVENT_NOW } from '../data/catalog'

export interface DraftLeg {
  marketId: string
  marketName: string
  selectionId: string
  label: string
  odds: string
  period: string
}

export interface DraftGroup {
  id: string
  eventId: string
  type: 'single' | 'builder'
  legs: DraftLeg[]
  /** builder joint price; singles use legs[0].odds */
  odds: string
  stake: string
  live?: boolean
  /** a free bet chosen for this selection (replaces the cash stake) */
  freeBetId?: string
}

export type { F01Phase }
export type ViewMode = 'full' | 'mobile'

export interface Prefs {
  sports: SportId[]
  competitions: string[]
  teams: string[]
}

export const SAM_PREFS: Prefs = {
  sports: ['football', 'tennis'],
  competitions: ['continental-cup', 'premier-division'],
  teams: ['northbridge'],
}

export interface State {
  available: string
  groups: DraftGroup[]
  mode: 'singles' | 'acca'
  accaStake: string
  favourites: string[]
  view: ViewMode
  slipOpen: boolean
  prefs: Prefs
  navOpen: boolean
  bets: AcceptedBet[]
  ledger: LedgerEntry[]
  f01: F01Phase
  scene: string
  deposits: DepositRecord[]
  limits: Record<LimitKey, string>
  pendingIncrease: { key: LimitKey; value: string; availableAt: string } | null
  withdrawals: { id: string; amount: string; at: string; status: 'pending' | 'completed' | 'rejected' }[]
  restriction: 'none' | 'paused' | 'excluded'
  pausedUntil: string | null
  accountOffsetH: number
  /** Demo controls: how the next placement responds (SIM-01) */
  nextPlacement: 'normal' | 'price-change' | 'unknown-accepted' | 'unknown-rejected'
  /** An operation whose response was lost — reconciled by the same ID (R08) */
  pendingOp: { opId: string; bets: AcceptedBet[]; consumed: string[]; acca: boolean; resolveAs: 'accepted' | 'rejected'; at: string } | null
  /** Promotions the customer opted into, by id */
  promos: Partial<Record<PromoId, PromoEntry>>
  freeBets: FreeBet[]
  predictor: { picks: Record<string, [number, number]>; submittedAt: string } | null
  /** Show offers on the home hubs (marketing preference) */
  offersOnHome: boolean
  /** Last hub opened under Sports */
  hub: 'for-you' | 'popular'
  /** Reality check reminder interval in minutes (0 = off) */
  realityCheckMin: 0 | 30 | 60
  realityOpen: boolean
  marketingEmail: boolean
  marketingSms: boolean
}

const initial: State = {
  available: '100.00',
  groups: [],
  mode: 'singles',
  accaStake: '',
  favourites: [],
  view: 'full',
  slipOpen: false,
  prefs: SAM_PREFS,
  navOpen: false,
  bets: INITIAL_BETS,
  ledger: INITIAL_LEDGER,
  f01: 'pre',
  scene: 'fresh',
  deposits: [],
  limits: { daily: '20.00', weekly: '50.00', monthly: '100.00' },
  pendingIncrease: null,
  withdrawals: [],
  restriction: 'none',
  pausedUntil: null,
  accountOffsetH: 0,
  nextPlacement: 'normal',
  pendingOp: null,
  promos: {},
  freeBets: [],
  predictor: null,
  offersOnHome: true,
  hub: 'for-you',
  realityCheckMin: 0,
  realityOpen: false,
  marketingEmail: false,
  marketingSms: false,
}

export const INITIAL_STATE = initial

export type Action =
  | { type: 'toggleSelection'; eventId: string; leg: DraftLeg; live?: boolean }
  | { type: 'addBuilder'; eventId: string; legs: DraftLeg[]; odds: string }
  | { type: 'remove'; groupId: string }
  | { type: 'clear' }
  | { type: 'stake'; groupId: string; value: string }
  | { type: 'accaStake'; value: string }
  | { type: 'mode'; mode: State['mode'] }
  | { type: 'acceptPrice'; groupId: string; odds: string }
  | { type: 'favourite'; eventId: string }
  | { type: 'view'; view: ViewMode }
  | { type: 'slip'; open: boolean }
  | { type: 'prefs'; prefs: Prefs }
  | { type: 'nav'; open: boolean }
  | { type: 'placed'; bets: AcceptedBet[]; consumed: string[]; acca: boolean }
  | { type: 'settle'; betId: string; status: 'won' | 'lost' | 'void'; settlement: Settlement }
  | { type: 'cashOut'; betId: string; amount: string; at: string }
  | { type: 'reset' }
  | { type: 'load'; state: Partial<State> }
  | { type: 'f01'; phase: F01Phase }
  | { type: 'deposit'; amount: string; at: string }
  | { type: 'withdraw'; amount: string; at: string }
  | { type: 'withdrawalResolve'; id: string; ok: boolean; at: string }
  | { type: 'setLimit'; key: LimitKey; value: string; at: string }
  | { type: 'confirmIncrease'; at: string }
  | { type: 'cancelIncrease' }
  | { type: 'pause'; until: string }
  | { type: 'pauseCheck'; at: string }
  | { type: 'exclude'; at: string }
  | { type: 'advanceAccount'; hours: number }
  | { type: 'patch'; patch: Partial<State> }
  | { type: 'pendingStart'; op: NonNullable<State['pendingOp']> }
  | { type: 'pendingResolve' }
  | { type: 'convertToBuilder'; groupIds: string[]; odds: string }
  | { type: 'promoJoin'; id: PromoId; at: string }
  | { type: 'useFreeBet'; groupId: string; freeBetId: string | null }
  | { type: 'predictorSave'; picks: Record<string, [number, number]>; at: string }
  | { type: 'earlyPayout'; betId: string; at: string }
  | { type: 'offersOnHome'; on: boolean }
  | { type: 'hub'; hub: State['hub'] }

const fmtGBP = (v: string) => `£${D(v).toFixed(2)}`

let seq = 0
const newId = () => `draft-${Date.now().toString(36)}-${(seq++).toString(36)}`

export function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'toggleSelection': {
      const existing = s.groups.find(
        (g) => g.type === 'single' && g.eventId === a.eventId && g.legs[0].selectionId === a.leg.selectionId && g.legs[0].marketId === a.leg.marketId,
      )
      if (existing) return { ...s, groups: s.groups.filter((g) => g.id !== existing.id) }
      const group: DraftGroup = { id: newId(), eventId: a.eventId, type: 'single', legs: [a.leg], odds: a.leg.odds, stake: '', live: a.live }
      return { ...s, groups: [...s.groups, group] }
    }
    case 'addBuilder': {
      const key = a.legs.map((l) => l.selectionId).join('+')
      const dup = s.groups.find((g) => g.type === 'builder' && g.eventId === a.eventId && g.legs.map((l) => l.selectionId).join('+') === key)
      if (dup) return { ...s, slipOpen: true }
      return { ...s, groups: [...s.groups, { id: newId(), eventId: a.eventId, type: 'builder', legs: a.legs, odds: a.odds, stake: '' }] }
    }
    case 'remove':
      return { ...s, groups: s.groups.filter((g) => g.id !== a.groupId) }
    case 'clear':
      return { ...s, groups: [], accaStake: '' }
    case 'stake':
      return { ...s, groups: s.groups.map((g) => (g.id === a.groupId ? { ...g, stake: a.value } : g)) }
    case 'accaStake':
      return { ...s, accaStake: a.value }
    case 'mode':
      return { ...s, mode: a.mode }
    case 'acceptPrice':
      return {
        ...s,
        groups: s.groups.map((g) => (g.id === a.groupId ? { ...g, odds: a.odds, legs: g.type === 'single' ? [{ ...g.legs[0], odds: a.odds }] : g.legs } : g)),
      }
    case 'favourite':
      return {
        ...s,
        favourites: s.favourites.includes(a.eventId) ? s.favourites.filter((f) => f !== a.eventId) : [...s.favourites, a.eventId],
      }
    case 'view':
      return { ...s, view: a.view }
    case 'slip':
      return { ...s, slipOpen: a.open }
    case 'prefs':
      return { ...s, prefs: a.prefs }
    case 'nav':
      return { ...s, navOpen: a.open }
    case 'placed': {
      // One debit per accepted bet; the accepted groups leave the slip once (C46).
      // Free-bet stakes never touch the balance; each free bet is used once.
      const total = a.bets.reduce((t, b) => (b.freeBet ? t : t.plus(b.stake)), D(0))
      const used = new Map(a.bets.filter((b) => b.freeBet).map((b) => [b.freeBet!.id, b.id]))
      return {
        ...s,
        available: D(s.available).minus(total).toFixed(2),
        bets: [...a.bets, ...s.bets],
        freeBets: s.freeBets.map((f) => (used.has(f.id) ? { ...f, status: 'used' as const, usedOn: used.get(f.id) } : f)),
        ledger: [
          ...a.bets.map((b) =>
            b.freeBet
              ? { id: `stake-${b.id}`, type: 'free_bet' as const, delta: '0.00', betId: b.id, at: b.placedAt, label: `Free bet ${fmtGBP(b.freeBet.amount)} used · ${b.legs[0].eventLabel}` }
              : { id: `stake-${b.id}`, type: 'stake' as const, delta: D(b.stake).neg().toFixed(2), betId: b.id, at: b.placedAt, label: `Stake · ${b.legs[0].eventLabel}` },
          ),
          ...s.ledger,
        ],
        groups: s.groups.filter((g) => !a.consumed.includes(g.id)),
        accaStake: a.acca ? '' : s.accaStake,
      }
    }
    case 'settle': {
      const bet = s.bets.find((b) => b.id === a.betId)
      if (!bet || bet.status !== 'open') return s // one terminal resolution only
      const gross = D(a.settlement.gross)
      if (s.restriction === 'excluded') {
        // R11: a later return is credited and immediately set aside for the administrative refund — never playable.
        const settledBets = s.bets.map((b) => (b.id === a.betId ? { ...b, status: a.status, settlement: a.settlement } : b))
        if (gross.lte(0)) return { ...s, bets: settledBets }
        return {
          ...s,
          bets: settledBets,
          withdrawals: [{ id: `excl-ret-${bet.id}`, amount: gross.toFixed(2), at: a.settlement.at, status: 'pending' }, ...s.withdrawals],
          ledger: [
            { id: `excl-res-${bet.id}`, type: 'withdrawal', delta: gross.neg().toFixed(2), betId: bet.id, at: a.settlement.at, label: `Return reserved for refund · ${bet.legs[0].eventLabel}` },
            { id: `ret-${bet.id}`, type: a.status === 'void' ? 'void_return' : 'return', delta: gross.toFixed(2), betId: bet.id, at: a.settlement.at, label: `${a.status === 'void' ? 'Void return' : 'Return'} · ${bet.legs[0].eventLabel}` },
            ...s.ledger,
          ],
        }
      }
      // A void free-bet bet gives the free bet back rather than cash.
      const fbBack = bet.freeBet && a.status === 'void'
      const rewards = rewardsOnSettle(bet, a.status, a.settlement.legResults, s.promos, a.settlement.at)
      const promos = { ...s.promos }
      for (const r of rewards) if (r.promo === 'matchday-free-bet') promos[r.promo] = { ...promos[r.promo]!, completedAt: a.settlement.at, note: r.note }
      return {
        ...s,
        available: fbBack ? s.available : D(s.available).plus(gross).toFixed(2),
        promos,
        freeBets: [
          ...rewards.map((r) => r.freeBet),
          ...s.freeBets.map((f) => (fbBack && f.id === bet.freeBet!.id ? { ...f, status: 'available' as const, usedOn: undefined } : f)),
        ],
        bets: s.bets.map((b) => (b.id === a.betId ? { ...b, status: a.status, settlement: a.settlement } : b)),
        ledger: gross.gt(0) && !fbBack
          ? [{ id: `ret-${bet.id}`, type: a.status === 'void' ? 'void_return' : 'return', delta: gross.toFixed(2), betId: bet.id, at: a.settlement.at, label: `${a.status === 'void' ? 'Void return' : 'Return'} · ${bet.legs[0].eventLabel}` }, ...s.ledger]
          : s.ledger,
      }
    }
    case 'cashOut': {
      const bet = s.bets.find((b) => b.id === a.betId)
      if (!bet || bet.status !== 'open') return s
      return {
        ...s,
        available: D(s.available).plus(a.amount).toFixed(2),
        bets: s.bets.map((b) => (b.id === a.betId ? { ...b, status: 'cashed_out', settlement: { odds: '', gross: a.amount, reason: 'Cashed out before the end.', at: a.at } } : b)),
        ledger: [{ id: `co-${bet.id}`, type: 'cash_out', delta: D(a.amount).toFixed(2), betId: bet.id, at: a.at, label: `Cash Out · ${bet.legs[0].eventLabel}` }, ...s.ledger],
      }
    }
    case 'reset':
      applySim('pre')
      return { ...initial, view: s.view, navOpen: s.navOpen }
    case 'load': {
      const next = { ...initial, view: s.view, navOpen: s.navOpen, ...a.state }
      applySim(next.f01)
      return next
    }
    case 'deposit': {
      if (!parseAmount(a.amount) || s.restriction !== 'none' || s.pendingOp) return s
      const id = `dep-${Date.now().toString(36)}`
      return {
        ...s,
        available: D(s.available).plus(a.amount).toFixed(2),
        deposits: [...s.deposits, { id, amount: D(a.amount).toFixed(2), at: a.at, status: 'confirmed' }],
        ledger: [{ id, type: 'deposit', delta: D(a.amount).toFixed(2), at: a.at, label: 'Deposit · Demo debit card' }, ...s.ledger],
      }
    }
    case 'withdraw': {
      const amt = parseAmount(a.amount)
      if (!amt || amt.gt(s.available) || s.restriction === 'excluded' || s.pendingOp) return s
      // R10: a withdrawal request reserves funds immediately; completing doesn't debit again.
      const id = `wd-${Date.now().toString(36)}`
      return {
        ...s,
        available: D(s.available).minus(a.amount).toFixed(2),
        withdrawals: [{ id, amount: D(a.amount).toFixed(2), at: a.at, status: 'pending' }, ...s.withdrawals],
        ledger: [{ id, type: 'withdrawal', delta: D(a.amount).neg().toFixed(2), at: a.at, label: 'Withdrawal requested · reserved' }, ...s.ledger],
      }
    }
    case 'withdrawalResolve': {
      const w = s.withdrawals.find((x) => x.id === a.id)
      if (!w || w.status !== 'pending') return s
      return {
        ...s,
        available: a.ok ? s.available : D(s.available).plus(w.amount).toFixed(2),
        withdrawals: s.withdrawals.map((x) => (x.id === a.id ? { ...x, status: a.ok ? 'completed' : 'rejected' } : x)),
        ledger: a.ok ? s.ledger : [{ id: `${w.id}-back`, type: 'deposit', delta: w.amount, at: a.at, label: 'Withdrawal rejected · funds back' }, ...s.ledger],
      }
    }
    case 'setLimit': {
      if (!parseAmount(a.value)) return s
      const cur = D(s.limits[a.key])
      if (D(a.value).lte(cur)) return { ...s, limits: { ...s.limits, [a.key]: D(a.value).toFixed(2) }, pendingIncrease: s.pendingIncrease?.key === a.key ? null : s.pendingIncrease }
      return { ...s, pendingIncrease: { key: a.key, value: D(a.value).toFixed(2), availableAt: new Date(Date.parse(a.at) + 24 * 3600_000).toISOString() } }
    }
    case 'confirmIncrease':
      // R11: only after the 24-hour wait, measured on the account clock, and only by explicit confirmation.
      if (!s.pendingIncrease || Date.parse(a.at) < Date.parse(s.pendingIncrease.availableAt)) return s
      return { ...s, limits: { ...s.limits, [s.pendingIncrease.key]: s.pendingIncrease.value }, pendingIncrease: null }
    case 'cancelIncrease':
      return { ...s, pendingIncrease: null }
    case 'pause':
      return { ...s, restriction: 'paused', pausedUntil: a.until, groups: [], slipOpen: false }
    case 'pauseCheck':
      // A break ends on the account clock. Self-exclusion never ends on its own.
      if (s.restriction !== 'paused' || !s.pausedUntil || Date.parse(a.at) < Date.parse(s.pausedUntil)) return s
      return { ...s, restriction: 'none', pausedUntil: null }
    case 'exclude':
      // R11: closes gambling immediately; open bets keep their accepted rules.
      return {
        ...s,
        restriction: 'excluded',
        groups: [],
        // Self-exclusion ends every promotion and removes unused free bets.
        promos: {},
        freeBets: s.freeBets.filter((f) => f.status === 'used'),
        slipOpen: false,
        ledger: D(s.available).gt(0) ? [{ id: `excl-${Date.now().toString(36)}`, type: 'withdrawal', delta: D(s.available).neg().toFixed(2), at: a.at, label: 'Balance reserved for return · self-exclusion' }, ...s.ledger] : s.ledger,
        withdrawals: D(s.available).gt(0) ? [{ id: `excl-ret-balance`, amount: s.available, at: a.at, status: 'pending' }, ...s.withdrawals] : s.withdrawals,
        available: '0.00',
      }
    case 'convertToBuilder': {
      // C48: explicit replacement; the new builder starts with an empty stake (nothing inherited).
      const picked = s.groups.filter((g) => a.groupIds.includes(g.id))
      if (picked.length < 2) return s
      const at = s.groups.findIndex((g) => g.id === picked[0].id)
      const builder: DraftGroup = { id: newId(), eventId: picked[0].eventId, type: 'builder', legs: picked.map((g) => g.legs[0]), odds: a.odds, stake: '' }
      const rest = s.groups.filter((g) => !a.groupIds.includes(g.id))
      rest.splice(Math.min(at, rest.length), 0, builder)
      return { ...s, groups: rest }
    }
    case 'promoJoin': {
      const p = promoById(a.id)
      if (s.restriction !== 'none' || p.audience !== 'existing' || s.promos[a.id]) return s
      return { ...s, promos: { ...s.promos, [a.id]: { joinedAt: a.at } } }
    }
    case 'useFreeBet': {
      if (a.freeBetId && (!s.freeBets.some((f) => f.id === a.freeBetId && f.status === 'available') || s.groups.some((g) => g.freeBetId === a.freeBetId && g.id !== a.groupId))) return s
      return { ...s, groups: s.groups.map((g) => (g.id === a.groupId ? { ...g, freeBetId: a.freeBetId ?? undefined } : g)) }
    }
    case 'predictorSave':
      if (s.restriction !== 'none') return s
      return { ...s, predictor: { picks: a.picks, submittedAt: a.at }, promos: s.promos.predictor ? s.promos : { ...s.promos, predictor: { joinedAt: a.at } } }
    case 'earlyPayout': {
      const bet = s.bets.find((b) => b.id === a.betId)
      if (!bet || bet.status !== 'open' || !qualifiesTwoUp(bet, s.promos['two-up'])) return s
      const gross = twoUpPayout(bet)
      const settled = reducer(s, { type: 'settle', betId: bet.id, status: 'won', settlement: { odds: bet.odds, gross, reason: 'Paid early under the 2 Goals Ahead promotion: your team went two goals ahead. The match is still being played, but the result at full time no longer changes this bet.', at: a.at, legResults: { [bet.legs[0].selectionId]: 'won' } } })
      return { ...settled, bets: settled.bets.map((b) => (b.id === bet.id ? { ...b, promo: 'two-up' } : b)) }
    }
    case 'offersOnHome':
      return { ...s, offersOnHome: a.on }
    case 'hub':
      return { ...s, hub: a.hub }
    case 'patch':
      return { ...s, ...a.patch }
    case 'pendingStart':
      // Nothing moves yet: confirmed balance stays, the attempt is frozen under its ID.
      return { ...s, pendingOp: a.op, nextPlacement: 'normal' }
    case 'pendingResolve': {
      const op = s.pendingOp
      if (!op) return s
      if (op.resolveAs === 'rejected') return { ...s, pendingOp: null }
      return reducer({ ...s, pendingOp: null }, { type: 'placed', bets: op.bets, consumed: op.consumed, acca: op.acca })
    }
    case 'advanceAccount':
      return { ...s, accountOffsetH: s.accountOffsetH + a.hours }
    case 'f01':
      applySim(a.phase)
      // Advancing the match keeps drafts and bets; a pre-match builder draft can no longer be placed (C43).
      return { ...s, f01: a.phase }
  }
}

const KEY = 'ternside.demo.v3'

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initial
    const parsed = JSON.parse(raw)
    if (parsed?.v !== 3) return initial
    const st = { ...initial, ...parsed.state, slipOpen: false, realityOpen: false }
    applySim(st.f01)
    return st
  } catch {
    return initial
  }
}

const Ctx = createContext<{ s: State; d: React.Dispatch<Action> } | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, d] = useReducer(reducer, undefined, load)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ v: 3, state: s }))
    } catch {
      /* storage unavailable: session-only */
    }
  }, [s])
  return (
    <Ctx.Provider value={useMemo(() => ({ s, d }), [s])}>
      <LiveProvider>{children}</LiveProvider>
    </Ctx.Provider>
  )
}

export function useStore() {
  const c = useContext(Ctx)
  if (!c) throw new Error('no store')
  return c
}

// —— Live engine: authored price paths cycled on a session clock —————————————
interface LiveCtx {
  tick: number
  elapsed: number
}
const LiveContext = createContext<LiveCtx>({ tick: 0, elapsed: 0 })

function LiveProvider({ children }: { children: ReactNode }) {
  const start = useRef(Date.now())
  const [v, setV] = useState<LiveCtx>({ tick: 0, elapsed: 0 })
  useEffect(() => {
    const id = setInterval(() => {
      setV((p) => ({ tick: p.tick + 1, elapsed: Math.floor((Date.now() - start.current) / 1000) }))
    }, 1000)
    return () => clearInterval(id)
  }, [])
  return <LiveContext.Provider value={v}>{children}</LiveContext.Provider>
}

export const useLiveClock = () => useContext(LiveContext)

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** Current main-market prices for an event (authored path for live events). */
export function mainPrices(ev: SportEvent, tick: number): string[] {
  const base = ev.markets[0].selections.map((x) => x.odds)
  if (ev.status !== 'live' || !ev.live) return base
  const h = hash(ev.id)
  const every = 7 + (h % 5)
  const idx = Math.floor((tick + (h % every)) / every) % ev.live.path.length
  return ev.live.path[idx]
}

export function useLiveEvent(ev: SportEvent) {
  const { tick, elapsed } = useLiveClock()
  const prices = mainPrices(ev, tick)
  let minute = ev.live?.minute
  if (minute != null && !ev.live?.frozen) minute = Math.min(90, minute + Math.floor(elapsed / 60))
  return { prices, minute }
}

export function currentOdds(group: DraftGroup, tick: number) {
  if (group.type !== 'single') return group.odds
  const ev = eventById(group.eventId)
  if (!ev || ev.status !== 'live') return group.odds
  const idx = ev.markets[0].selections.findIndex((x) => x.id === group.legs[0].selectionId)
  if (group.legs[0].marketId !== ev.markets[0].id || idx < 0) return group.odds
  return mainPrices(ev, tick)[idx]
}

export const liveEvents = () => EVENTS.filter((e) => e.status === 'live')

/** Account clock (R11): independent of the match clock; can be advanced from Demo controls. */
export function useAccountNow() {
  const { s } = useStore()
  const { elapsed } = useLiveClock()
  return new Date(Date.parse(EVENT_NOW) + elapsed * 1000 + s.accountOffsetH * 3600_000).toISOString()
}

/** A pre-match draft whose event has started (or finished) can't be placed — it's kept, not converted (C43). */
export function isClosedDraft(g: DraftGroup) {
  const ev = eventById(g.eventId)
  return !!ev && ev.status !== 'scheduled' && !g.live
}
