import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react'
import { EVENTS, eventById, type SportEvent, type SportId } from '../data/catalog'

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
}

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

interface State {
  available: string
  groups: DraftGroup[]
  mode: 'singles' | 'acca'
  accaStake: string
  favourites: string[]
  view: ViewMode
  slipOpen: boolean
  prefs: Prefs
  navOpen: boolean
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
}

type Action =
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

let seq = 0
const newId = () => `draft-${Date.now().toString(36)}-${(seq++).toString(36)}`

function reducer(s: State, a: Action): State {
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
  }
}

const KEY = 'ternside.demo.v2'

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initial
    const parsed = JSON.parse(raw)
    if (parsed?.v !== 2) return initial
    return { ...initial, ...parsed.state, slipOpen: false }
  } catch {
    return initial
  }
}

const Ctx = createContext<{ s: State; d: React.Dispatch<Action> } | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, d] = useReducer(reducer, undefined, load)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ v: 2, state: s }))
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
  if (minute != null) minute = Math.min(90, minute + Math.floor(elapsed / 60))
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
