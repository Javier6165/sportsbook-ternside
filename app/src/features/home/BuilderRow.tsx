import { shortName } from '../../data/catalog'
import { Tilt } from '../../ui/Tilt'
import clsx from 'clsx'
import { ArrowRight, Check, Layers, Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { POPULAR_BUILDERS, type SportEvent } from '../../data/catalog'
import { useStore } from '../../state/store'
import { useFly } from '../../ui/fly'

const ease = [0.16, 1, 0.3, 1] as const
const LEG_LABEL: Record<string, string> = {
  HOME: 'to win',
  OVER_2_5: 'Over 2.5 goals',
  UNDER_2_5: 'Under 2.5 goals',
  PLAYER_2_SOT: 'Costa 2+ shots on target',
}

function BuilderTile({ ev, b, i }: { ev: SportEvent; b: (typeof POPULAR_BUILDERS)[number]; i: number }) {
  const { s, d } = useStore()
  const fly = useFly()
  const key = b.legs.join('+')
  const inSlip = s.groups.some((g) => g.type === 'builder' && g.eventId === ev.id && g.legs.map((l) => l.selectionId).join('+') === key)
  const label = (id: string) => (id === 'HOME' ? `${shortName(ev.home.name)} to win` : LEG_LABEL[id])

  const add = (el: HTMLElement) => {
    if (inSlip) return d({ type: 'slip', open: true })
    fly(el, b.odds)
    const legs = b.legs.map((id) => {
      const m = ev.markets.find((mk) => mk.selections.some((x) => x.id === id))!
      const sel = m.selections.find((x) => x.id === id)!
      return { marketId: m.id, marketName: m.name, selectionId: id, label: id === 'HOME' ? `${ev.home.name} to win` : sel.label.replace('Daniel Costa — ', 'Daniel Costa ').replace(/^(Over|Under) 2\.5$/, '$1 2.5 goals'), odds: sel.odds, period: m.period }
    })
    d({ type: 'addBuilder', eventId: ev.id, legs, odds: b.odds })
  }

  return (
    <Tilt className="w-[272px] shrink-0 snap-start rounded-[24px] @desk:w-auto">
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease }}
      className="flex h-full flex-col rounded-[24px] bg-surface p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11.5px] font-semibold text-secondary">
          {b.legs.length} conditions · one price
        </span>
      </div>
      <h3 className="mt-1.5 font-display text-[20px] leading-tight font-[760] tracking-[-0.035em]">{b.title}</h3>
      <p className="mt-1 text-[13px] leading-snug text-secondary">{b.story}</p>
      <ul className="mt-4 space-y-1.5">
        {b.legs.map((id) => (
          <li key={id} className="flex items-center gap-2 text-[13.5px] font-medium">
            <span className="size-1.5 shrink-0 rounded-full bg-action" />
            {label(id)}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center gap-2 pt-5">
        <span className="font-display text-[26px] leading-none font-[780] tracking-[-0.04em] tnum">{b.odds}</span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={(e) => add(e.currentTarget)}
          aria-label={inSlip ? `${b.title} is in your betslip` : `Add ${b.title} Bet Builder at ${b.odds}`}
          className={clsx('ml-auto flex h-10 items-center gap-1.5 rounded-full px-4 text-[13.5px] font-semibold transition-colors', inSlip ? 'bg-sel text-sel-ink' : 'bg-chip text-ink hover:bg-ink hover:text-white')}
        >
          {inSlip ? <Check size={15} strokeWidth={2.6} /> : <Plus size={15} strokeWidth={2.6} />}
          {inSlip ? 'Added' : 'Add'}
        </motion.button>
      </div>
    </motion.article>
    </Tilt>
  )
}

export function BuilderRow({ ev }: { ev: SportEvent }) {
  const list = POPULAR_BUILDERS.filter((b) => b.eventId === ev.id)
  if (!list.length) return null
  return (
    <section aria-labelledby="builders-title" className="mt-8">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <motion.h2 initial={{ opacity: 0, y: 22, clipPath: "inset(0 0 100% 0)" }} whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 -20% 0)" }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} id="builders-title" className="flex items-center gap-2 font-display text-[24px] leading-none font-[780] tracking-[-0.04em] @tab:text-[28px]">
            <Layers size={22} className="text-action" /> Bet Builder ideas
          </motion.h2>
          <p className="mt-1.5 text-[14px] text-secondary">
            {shortName(ev.home.name)} v {shortName(ev.away.name)}
          </p>
        </div>
        <Link to={`/event/${ev.id}?tab=builder`} className="hidden items-center gap-1 pb-0.5 text-[14px] font-semibold text-sel-ink hover:underline @tab:flex">
          Build your own <ArrowRight size={15} />
        </Link>
      </div>
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 @desk:mx-0 @desk:grid @desk:grid-cols-4 @desk:overflow-visible @desk:px-0">
        {list.map((b, i) => (
          <BuilderTile key={b.id} ev={ev} b={b} i={i} />
        ))}
        <Link
          to={`/event/${ev.id}?tab=builder`}
          className="flex w-[200px] shrink-0 snap-start flex-col items-start justify-end rounded-[24px] border-2 border-dashed border-line-strong p-5 text-[15px] font-semibold text-ink hover:border-action hover:text-action @desk:hidden"
        >
          <Plus size={22} className="mb-auto" />
          Build your own
          <span className="mt-1 text-[12.5px] font-medium text-secondary">Up to three conditions</span>
        </Link>
      </div>
    </section>
  )
}
