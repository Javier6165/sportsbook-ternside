import clsx from 'clsx'
import { ChevronDown, Plus, Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { BUILDER_SHOWCASE, eventById } from '../data/catalog'
import { kickoffTime } from '../lib/time'
import { useStore } from '../state/store'
import { useFly } from './fly'
import { matchGradient } from './MatchField'

const ease = [0.16, 1, 0.3, 1] as const
const first = (n: string) => n.split(' ')[0]

/** Perforated tear line with side notches, painted in the page colour. */
export function Perforation({ notch = 'bg-canvas' }: { notch?: string }) {
  return (
    <div className="relative h-7" aria-hidden="true">
      <span className={clsx('absolute top-0 -left-3.5 size-7 rounded-full', notch)} />
      <span className={clsx('absolute top-0 -right-3.5 size-7 rounded-full', notch)} />
      <span className="absolute inset-x-5 top-1/2 border-t-2 border-dashed border-[#e3e5ea]" />
    </div>
  )
}

export function BuilderPass() {
  const ev = eventById(BUILDER_SHOWCASE.eventId)!
  const { s, d } = useStore()
  const fly = useFly()
  const [open, setOpen] = useState(false)
  const inSlip = s.groups.some((g) => g.type === 'builder' && g.eventId === ev.id && g.legs.length === 3)

  const add = (el: HTMLElement) => {
    if (!inSlip) fly(el, BUILDER_SHOWCASE.odds)
    const legs = BUILDER_SHOWCASE.conditions.map((c) => {
      const m = ev.markets.find((mk) => mk.selections.some((x) => x.id === c.id))!
      const sel = m.selections.find((x) => x.id === c.id)!
      return { marketId: m.id, marketName: m.name, selectionId: c.id, label: c.label, odds: sel.odds, period: m.period }
    })
    d({ type: 'addBuilder', eventId: ev.id, legs, odds: BUILDER_SHOWCASE.odds })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, rotate: 1.2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay: 0.25, duration: 0.9, ease }}
      className="relative flex flex-col overflow-hidden rounded-[28px] bg-surface shadow-[0_24px_60px_-30px_rgba(16,24,43,.45)]"
      aria-label="Featured Bet Builder"
    >
      <div className="on-dark relative flex items-start justify-between gap-3 px-5 pt-5 pb-5 text-white" style={{ background: matchGradient(ev) }}>
        <div className="min-w-0">
          <div className="text-[11px] font-bold tracking-[.12em] text-white/70 uppercase">Bet Builder</div>
          <div className="mt-1 font-display text-[22px] leading-none font-[760] tracking-[-0.035em]">
            {first(ev.home.name)} <span className="text-white/55">v</span> {first(ev.away.name)}
          </div>
          <div className="mt-1.5 text-[12.5px] font-medium text-white/75">One story: {first(ev.home.name)} on top · {kickoffTime(ev.startsAt)}</div>
        </div>
        <div className="text-right">
          <div className="font-display text-[42px] leading-[.9] font-[780] tracking-[-0.045em] tnum">{BUILDER_SHOWCASE.odds}</div>
          <div className="mt-1 text-[10.5px] font-bold tracking-[.12em] text-white/70 uppercase">Joint odds</div>
        </div>
      </div>

      <ol className="px-5 pt-5">
        {BUILDER_SHOWCASE.conditions.map((c, i) => (
          <motion.li
            key={c.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 + i * 0.1, duration: 0.6, ease }}
            className="relative flex gap-3 pb-4 last:pb-1"
          >
            {i < 2 && <span className="absolute top-[18px] bottom-0 left-[7px] w-[2px] rounded bg-sel" aria-hidden="true" />}
            <span className="relative mt-[3px] size-4 shrink-0 rounded-full border-[2.5px] border-action bg-surface" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block text-[15px] leading-tight font-semibold text-ink">{c.label}</span>
              <span className="mt-0.5 block text-[12.5px] text-secondary">
                {c.market} · {c.period}
              </span>
            </span>
          </motion.li>
        ))}
      </ol>

      <div className="px-5">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between rounded-[14px] px-3 py-2.5 text-left text-[13px] font-semibold text-sel-ink hover:bg-sel"
        >
          What if Costa doesn’t play?
          <motion.span animate={{ rotate: open ? 180 : 0 }}>
            <ChevronDown size={17} />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} className="overflow-hidden">
              <p className="px-3 pb-2 text-[13px] leading-relaxed text-secondary">
                His condition becomes <b className="font-semibold text-ink">void</b> and the bet carries on with the other two at their archived price of{' '}
                <b className="font-semibold text-ink tnum">2.70</b>. £10 would return £27 if both win.{' '}
                <Link to={`/event/${ev.id}?tab=builder&explain=1`} className="font-semibold text-sel-ink underline-offset-2 hover:underline">
                  Explore outcomes
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-auto">
        <Perforation />
      </div>

      <div className="flex items-center gap-3 px-5 pb-5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={(e) => add(e.currentTarget)}
          className={clsx(
            'flex h-[52px] flex-1 items-center justify-center gap-2 rounded-[16px] text-[15px] font-semibold transition-colors',
            inSlip ? 'bg-sel text-sel-ink' : 'bg-ink text-white hover:bg-black',
          )}
        >
          {inSlip ? <Check size={18} strokeWidth={2.6} /> : <Plus size={18} strokeWidth={2.6} />}
          {inSlip ? 'In your betslip' : 'Add to betslip'}
        </motion.button>
        <Link to={`/event/${ev.id}?tab=builder`} className="flex h-[52px] items-center rounded-[16px] px-4 text-[14px] font-semibold text-ink hover:bg-chip">
          Edit
        </Link>
      </div>
    </motion.article>
  )
}
