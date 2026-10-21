import clsx from 'clsx'
import { Check, Info, Layers, Plus, Undo2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { POPULAR_BUILDERS, type SportEvent } from '../../data/catalog'
import { BUILDER_GROUPS, MARKET_RULES, groupOf, quoteFor } from '../../data/quotes'
import { useStore } from '../../state/store'
import { useFly } from '../../ui/fly'
import { matchGradient } from '../../ui/MatchField'
import { Perforation } from '../../ui/BuilderPass'
import { Inspector } from './Inspector'

const ease = [0.16, 1, 0.3, 1] as const

export function BuilderEditor({ ev, explain }: { ev: SportEvent; explain: boolean }) {
  const { s, d } = useStore()
  const fly = useFly()
  const [sels, setSels] = useState<string[]>(explain ? ['HOME', 'OVER_2_5', 'PLAYER_2_SOT'] : [])
  const [toast, setToast] = useState<{ text: string; undo: string[] } | null>(null)
  const [showRules, setShowRules] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const optionOf = (id: string) => {
    for (const m of ev.markets) {
      const sel = m.selections.find((x) => x.id === id)
      if (sel) return { m, sel }
    }
    return null
  }
  const labelOf = (id: string) => (id === 'HOME' ? `${ev.home.name} to win` : id === 'AWAY' ? `${ev.away.name} to win` : id === 'DRAW' ? 'Draw' : optionOf(id)!.sel.label.replace(' — ', ' ').replace(/^(Over|Under) 2\.5$/, '$1 2.5 goals'))
  const labels = useMemo(() => Object.fromEntries(BUILDER_GROUPS.flatMap((g) => g.options).map((id) => [id, labelOf(id)])), [ev.id])

  const ordered = BUILDER_GROUPS.flatMap((g) => sels.filter((x) => groupOf(x) === g.id))
  const price = ordered.length >= 2 ? quoteFor(ordered) : undefined
  const key = ordered.join('+')
  const inSlip = s.groups.some((g) => g.type === 'builder' && g.eventId === ev.id && g.legs.map((l) => l.selectionId).join('+') === key)

  const flash = (text: string, undo: string[]) => {
    clearTimeout(toastTimer.current)
    setToast({ text, undo })
    toastTimer.current = setTimeout(() => setToast(null), 4500)
  }

  const pick = (id: string) => {
    const g = groupOf(id)
    if (sels.includes(id)) return setSels(sels.filter((x) => x !== id))
    const clash = sels.find((x) => groupOf(x) === g)
    if (clash) {
      // R04: same group → replace immediately, announce it, offer Undo. No modal.
      flash(`Replaced ${labels[clash]} with ${labels[id]}`, sels)
      return setSels(sels.map((x) => (x === clash ? id : x)))
    }
    setSels([...sels, id])
  }

  const add = (el: HTMLElement) => {
    if (!price || inSlip) return d({ type: 'slip', open: true })
    fly(el, price)
    const legs = ordered.map((id) => {
      const o = optionOf(id)!
      return { marketId: o.m.id, marketName: o.m.name, selectionId: id, label: labels[id], odds: o.sel.odds, period: o.m.period }
    })
    d({ type: 'addBuilder', eventId: ev.id, legs, odds: price })
  }

  const addSingle = (el: HTMLElement) => {
    const id = ordered[0]
    const o = optionOf(id)!
    fly(el, o.sel.odds)
    d({ type: 'toggleSelection', eventId: ev.id, leg: { marketId: o.m.id, marketName: o.m.name, selectionId: id, label: o.sel.label, odds: o.sel.odds, period: o.m.period } })
    setSels([])
  }

  return (
    <div className="grid gap-5 @desk:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0 space-y-4">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 @tab:mx-0 @tab:flex-wrap @tab:px-0">
          <span className="flex h-9 shrink-0 items-center text-[12.5px] font-semibold text-secondary">Start from:</span>
          {POPULAR_BUILDERS.filter((b) => b.eventId === ev.id).map((b) => (
            <button
              key={b.id}
              onClick={() => setSels(b.legs)}
              className={clsx('h-9 shrink-0 rounded-full px-3.5 text-[13px] font-semibold transition-colors', key === b.legs.join('+') ? 'bg-ink text-white' : 'bg-surface text-ink hover:bg-chip')}
            >
              {b.title}
            </button>
          ))}
        </div>

        {BUILDER_GROUPS.map((g, gi) => (
          <motion.section key={g.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.06, ease }} className="rounded-[24px] bg-surface p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-[19px] font-[760] tracking-[-0.03em]">{g.label}</h3>
              <span className="text-[12px] font-medium text-secondary">Pick one · 90 min + stoppage</span>
            </div>
            <div className={clsx('mt-3 grid gap-2', g.options.length === 3 ? 'grid-cols-3' : g.options.length === 2 ? 'grid-cols-2' : 'grid-cols-1')}>
              {g.options.map((id) => {
                const on = sels.includes(id)
                const o = optionOf(id)!
                return (
                  <motion.button
                    key={id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => pick(id)}
                    aria-pressed={on}
                    className={clsx(
                      'flex min-h-14 items-center justify-between gap-2 rounded-[16px] px-4 text-left text-[14px] font-semibold transition-colors',
                      on ? 'bg-action text-white shadow-[0_10px_24px_-12px_rgba(41,72,255,.95)]' : 'bg-chip text-ink hover:bg-chip-hover',
                    )}
                  >
                    <span className="min-w-0 truncate">{id === 'HOME' ? ev.home.name : id === 'AWAY' ? ev.away.name : labels[id]}</span>
                    {on ? <Check size={17} strokeWidth={2.6} className="shrink-0" /> : <span className={clsx('shrink-0 text-[12.5px] tnum', 'text-secondary')}>{o.sel.odds}</span>}
                  </motion.button>
                )
              })}
            </div>
            {g.id === 'player' && <p className="mt-2.5 text-[12.5px] leading-snug text-secondary">{MARKET_RULES.PLAYER_SOT_90}</p>}
          </motion.section>
        ))}

        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} role="status" className="flex items-center gap-3 rounded-[18px] bg-ink px-4 py-3 text-[13.5px] font-medium text-white">
              <span className="flex-1">{toast.text}</span>
              <button
                onClick={() => {
                  setSels(toast.undo)
                  setToast(null)
                }}
                className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[12.5px] font-semibold hover:bg-white/25"
              >
                <Undo2 size={14} /> Undo
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {ordered.length >= 2 && <Inspector sels={ordered} labels={labels} />}
      </div>

      {/* The builder's own pass — the same ticket that will appear in the slip */}
      <div className="@desk:sticky @desk:top-[80px] @desk:self-start">
        <div className="overflow-hidden rounded-[28px] bg-surface shadow-[0_24px_60px_-30px_rgba(16,24,43,.4)]">
          <div className="on-dark flex items-end justify-between gap-3 px-5 py-5 text-white" style={{ background: matchGradient(ev) }}>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-[.12em] text-white/70 uppercase">
                <Layers size={13} /> Your Bet Builder
              </div>
              <div className="mt-1 text-[13px] font-medium text-white/80">
                {ordered.length} of 3 conditions · {ordered.length < 2 ? 'add at least two' : 'one joint price'}
              </div>
            </div>
            <AnimatePresence mode="popLayout">
              <motion.span key={price ?? 'none'} initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10 }} className="font-display text-[44px] leading-[.85] font-[800] tracking-[-0.05em] tnum">
                {price ?? '—'}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="px-5 pt-4">
            {ordered.length === 0 ? (
              <p className="py-3 text-[14px] text-secondary">Choose up to three conditions from different groups. They must all win, and they’re priced together — not multiplied.</p>
            ) : (
              <ol>
                <AnimatePresence initial={false}>
                  {ordered.map((id, i) => (
                    <motion.li key={id} layout initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="relative flex gap-3 pb-3.5">
                      {i < ordered.length - 1 && <span className="absolute top-[18px] bottom-0 left-[7px] w-[2px] rounded bg-sel" />}
                      <span className="relative mt-[3px] size-4 shrink-0 rounded-full border-[2.5px] border-action bg-surface" />
                      <span className="text-[14.5px] leading-tight font-semibold">{labels[id]}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ol>
            )}
            <button onClick={() => setShowRules((r) => !r)} className="mb-2 flex items-center gap-1.5 text-[12.5px] font-semibold text-sel-ink hover:underline">
              <Info size={14} /> {showRules ? 'Hide' : 'How this bet works'}
            </button>
            <AnimatePresence initial={false}>
              {showRules && (
                <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-1.5 overflow-hidden pb-2 text-[12.5px] leading-snug text-secondary">
                  <li>· All conditions must win. One loss settles the bet.</li>
                  <li>· Everything counts over 90 minutes plus stoppage time.</li>
                  <li>· If a condition is void (Costa doesn’t play), the rest carry on at their own archived price.</li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          <Perforation />
          <div className="px-5 pb-5">
            {ordered.length === 1 ? (
              <button onClick={(e) => addSingle(e.currentTarget)} className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[16px] bg-chip text-[15px] font-semibold hover:bg-chip-hover">
                One condition is a single · Add as single
              </button>
            ) : (
              <motion.button
                whileTap={price ? { scale: 0.97 } : undefined}
                onClick={(e) => add(e.currentTarget)}
                aria-disabled={!price}
                className={clsx('flex h-[52px] w-full items-center justify-center gap-2 rounded-[16px] text-[15px] font-semibold transition-colors', !price ? 'bg-chip text-muted' : inSlip ? 'bg-sel text-sel-ink' : 'bg-ink text-white hover:bg-black')}
              >
                {inSlip ? <Check size={18} /> : <Plus size={18} />}
                {!price ? 'Pick two or three conditions' : inSlip ? 'In your betslip' : `Add Bet Builder · ${price}`}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
