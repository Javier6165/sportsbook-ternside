import clsx from 'clsx'
import { ArrowRight, Clock, Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { COMPETITIONS, EVENTS, competitionById, type SportEvent } from '../../data/catalog'
import { dayLabel, kickoffTime } from '../../lib/time'
import { Crest } from '../../ui/Crest'
import { SportIcon } from '../../ui/SportIcon'

interface Hit {
  id: string
  group: 'Matches' | 'Competitions' | 'Markets'
  title: string
  sub: string
  to: string
  ev?: SportEvent
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const RECENT_KEY = 'ternside.search.recent'

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function useSearch(q: string): Hit[] {
  return useMemo(() => {
    const n = norm(q.trim())
    if (n.length < 2) return []
    const words = n.split(/\s+/)
    const hits: Hit[] = []
    for (const e of EVENTS) {
      const comp = competitionById(e.competitionId)
      const hay = norm(`${e.home.name} ${e.away.name} ${comp.name}`)
      if (words.every((w) => hay.includes(w)))
        hits.push({
          id: e.id,
          group: 'Matches',
          title: `${e.home.name} v ${e.away.name}`,
          sub: `${comp.name} · ${e.status === 'live' ? 'Live now' : `${dayLabel(e.startsAt)} ${kickoffTime(e.startsAt)}`}`,
          to: `/event/${e.id}`,
          ev: e,
        })
      for (const m of e.markets.slice(1)) {
        for (const sel of m.selections) {
          const h2 = norm(`${sel.label} ${m.name}`)
          if (words.every((w) => h2.includes(w) || hay.includes(w)) && words.some((w) => h2.includes(w)) && sel.label.length > 3)
            hits.push({ id: `${e.id}-${sel.id}`, group: 'Markets', title: `${sel.label.replace(' — ', ' ')}`, sub: `${m.name} · ${e.home.name} v ${e.away.name}`, to: `/event/${e.id}`, ev: e })
        }
      }
    }
    for (const c of COMPETITIONS)
      if (words.every((w) => norm(`${c.name} ${c.region}`).includes(w))) hits.push({ id: c.id, group: 'Competitions', title: c.name, sub: c.region, to: `/sports/${c.sport}?competition=${c.id}` })
    return hits.slice(0, 14)
  }, [q])
}

export function SearchPanel({ onClose, autoFocus = true }: { onClose?: () => void; autoFocus?: boolean }) {
  const [q, setQ] = useState('')
  const [recent, setRecent] = useState<string[]>(readRecent)
  const [active, setActive] = useState(0)
  const hits = useSearch(q)
  const nav = useNavigate()
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (autoFocus) ref.current?.focus()
  }, [autoFocus])
  useEffect(() => setActive(0), [q])

  const go = (h: Hit) => {
    const next = [q.trim(), ...recent.filter((r) => r !== q.trim())].filter(Boolean).slice(0, 5)
    setRecent(next)
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
    onClose?.()
    nav(h.to)
  }
  const groups = (['Matches', 'Markets', 'Competitions'] as const).map((g) => ({ g, items: hits.filter((h) => h.group === g) })).filter((x) => x.items.length)
  const flat = groups.flatMap((g) => g.items)
  const ambiguous = groups.find((g) => g.g === 'Matches')?.items.length ?? 0

  return (
    <div className="flex max-h-full flex-col">
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        <Search size={20} className="text-secondary" />
        <input
          ref={ref}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') setActive((a) => Math.min(flat.length - 1, a + 1))
            if (e.key === 'ArrowUp') setActive((a) => Math.max(0, a - 1))
            if (e.key === 'Enter' && flat[active]) go(flat[active])
            if (e.key === 'Escape') onClose?.()
          }}
          placeholder="Teams, players or markets — try “Costa shots”"
          aria-label="Search"
          className="min-w-0 flex-1 bg-transparent font-display text-[20px] font-[650] tracking-[-0.02em] outline-none placeholder:font-sans placeholder:text-[16px] placeholder:font-medium placeholder:tracking-normal placeholder:text-muted"
        />
        {q && (
          <button onClick={() => setQ('')} aria-label="Clear search" className="grid size-8 place-items-center rounded-full bg-chip">
            <X size={15} />
          </button>
        )}
        {onClose && (
          <button onClick={onClose} className="rounded-lg bg-chip px-2 py-1 text-[11.5px] font-semibold text-secondary">
            Esc
          </button>
        )}
      </div>
      <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto p-3">
        {!q && (
          <div className="p-2">
            {recent.length > 0 && (
              <>
                <div className="mb-2 flex items-center justify-between text-[12px] font-bold tracking-[.1em] text-muted uppercase">
                  Recent
                  <button
                    onClick={() => {
                      setRecent([])
                      try {
                        localStorage.removeItem(RECENT_KEY)
                      } catch {
                        /* ignore */
                      }
                    }}
                    className="text-[12px] font-semibold tracking-normal text-sel-ink normal-case"
                  >
                    Clear
                  </button>
                </div>
                <div className="mb-5 flex flex-wrap gap-2">
                  {recent.map((r) => (
                    <button key={r} onClick={() => setQ(r)} className="flex h-9 items-center gap-1.5 rounded-full bg-chip px-3 text-[13.5px] font-semibold">
                      <Clock size={13} /> {r}
                    </button>
                  ))}
                </div>
              </>
            )}
            <div className="mb-2 text-[12px] font-bold tracking-[.1em] text-muted uppercase">Try</div>
            <div className="flex flex-wrap gap-2">
              {['Northbridge', 'Costa shots', 'Lindqvist', 'Premier Division'].map((t) => (
                <button key={t} onClick={() => setQ(t)} className="h-9 rounded-full bg-chip px-3 text-[13.5px] font-semibold hover:bg-chip-hover">
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
        {q.trim().length >= 2 && flat.length === 0 && (
          <div className="px-3 py-10 text-center">
            <div className="font-display text-[19px] font-[760] tracking-[-0.03em]">No matches for “{q}”</div>
            <p className="mt-1 text-[13.5px] text-secondary">This demo covers football, tennis and basketball. Try a team, player or competition.</p>
          </div>
        )}
        {ambiguous > 1 && groups[0]?.g === 'Matches' && q.trim().split(' ').length === 1 && (
          <p className="px-3 pt-1 pb-2 text-[12.5px] text-secondary">More than one match fits “{q}”. Pick the one you mean — nothing is added to your slip.</p>
        )}
        <AnimatePresence initial={false}>
          {groups.map(({ g, items }) => (
            <motion.div key={g} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-2">
              <div className="px-3 pt-2 pb-1.5 text-[12px] font-bold tracking-[.1em] text-muted uppercase">{g}</div>
              <ul>
                {items.map((h) => {
                  const idx = flat.indexOf(h)
                  return (
                    <li key={h.id}>
                      <button
                        onClick={() => go(h)}
                        onMouseEnter={() => setActive(idx)}
                        className={clsx('flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left', idx === active ? 'bg-chip' : '')}
                      >
                        {h.ev ? (
                          <span className="flex -space-x-2">
                            <Crest team={h.ev.home} size={24} />
                            <Crest team={h.ev.away} size={24} />
                          </span>
                        ) : (
                          <span className="grid size-8 place-items-center rounded-full bg-surface ring-1 ring-line">
                            <SportIcon sport={COMPETITIONS.find((c) => c.id === h.id)?.sport ?? 'football'} size={15} />
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14.5px] font-semibold">{h.title}</span>
                          <span className="block truncate text-[12.5px] text-secondary">{h.sub}</span>
                        </span>
                        {h.ev?.status === 'live' && <span className="led text-[13px] text-live">LIVE</span>}
                        <ArrowRight size={16} className="text-muted" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
