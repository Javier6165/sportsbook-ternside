import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { competitionById, teamColor, type SportEvent } from '../../data/catalog'
import { useLiveEvent } from '../../state/store'
import { Crest } from '../../ui/Crest'
import { Tilt } from '../../ui/Tilt'
import { LiveBadge } from '../../ui/LiveBadge'
import { matchGradient } from '../../ui/MatchField'
import { OddsButton } from '../../ui/OddsButton'

/**
 * What the market currently thinks, derived only from the live prices
 * (1/odds, normalised). Moves smoothly when a price ticks — so the motion
 * on the card always means something.
 */
export function MarketView({ prices, labels, colors }: { prices: string[]; labels: string[]; colors: string[] }) {
  const inv = prices.map((p) => 1 / Number(p))
  const sum = inv.reduce((a, b) => a + b, 0)
  const pct = inv.map((v) => Math.round((v / sum) * 100))
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-[11px] font-semibold text-secondary">
        <span>Win probability</span>
        <span>from current odds</span>
      </div>
      <div className="flex h-2 gap-[3px] overflow-hidden rounded-full" aria-hidden="true">
        {pct.map((p, i) => (
          <motion.span key={i} animate={{ flexGrow: Math.max(p, 4) }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full" style={{ flexBasis: 0, background: colors[i] }} />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[11.5px] font-semibold text-ink tnum">
        {pct.map((p, i) => (
          <span key={i} className={i === 1 && pct.length === 3 ? 'text-center' : i === pct.length - 1 ? 'text-right' : ''}>
            {labels[i]} {p}%
          </span>
        ))}
      </div>
    </div>
  )
}

export const lighten = (c: string) => `color-mix(in oklab, ${c} 70%, white)`

export function LiveCard({ ev, i, reason }: { ev: SportEvent; i: number; reason?: string }) {
  const { prices, minute } = useLiveEvent(ev)
  const comp = competitionById(ev.competitionId)
  const L = ev.live!
  const m = ev.markets[0]
  const hc = teamColor(ev.home)
  const ac = teamColor(ev.away)
  const clock = ev.sport === 'football' ? `${minute}'` : ev.sport === 'basketball' ? `${L.period} ${L.clock}` : L.period
  return (
    <Tilt className="min-w-0 rounded-[26px]">
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex h-full min-w-0 flex-col overflow-hidden rounded-[26px] bg-surface"
    >
      {/* Same colour-of-the-game header as every pass; the sweep is the live heartbeat */}
      <div className="on-dark relative flex items-center justify-between gap-2 overflow-hidden px-5 py-3 text-white" style={{ background: matchGradient(ev) }}>
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          animate={{ x: ['-120%', '420%'] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
        />
        <Link to={`/event/${ev.id}`} className="relative min-w-0 truncate text-[12.5px] font-semibold text-white/85 hover:text-white">
          {comp.name}
        </Link>
        <LiveBadge clock={clock} tone="solid" className="relative" />
      </div>

      <div className="flex flex-1 flex-col p-5 pt-4">
        <Link to={`/event/${ev.id}`} className="group block space-y-2.5">
          {[ev.home, ev.away].map((p, idx) => (
            <div key={p.id} className="flex items-center gap-3">
              <Crest team={p} size={26} />
              <span className="min-w-0 flex-1 truncate text-[16px] font-semibold group-hover:text-sel-ink">{p.name}</span>
              {ev.sport === 'tennis' ? (
                <span className="flex items-center gap-2 font-display text-[15px] font-semibold tnum">
                  {L.serving === idx && <span className="size-1.5 rounded-full bg-live" aria-label="Serving" />}
                  <span className="text-muted">{L.sets![idx]}</span>
                  <span className="text-secondary">{L.games![idx]}</span>
                  <span className="w-7 rounded-md bg-chip py-0.5 text-center">{L.points![idx]}</span>
                </span>
              ) : (
                <motion.span key={L.score[idx]} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-display text-[30px] leading-none font-[780] tracking-[-0.04em] tnum">
                  {L.score[idx]}
                </motion.span>
              )}
            </div>
          ))}
        </Link>

        <div className="mt-5">
          <MarketView
            prices={prices}
            labels={m.selections.length === 3 ? [ev.home.short, 'Draw', ev.away.short] : [ev.home.name.split(' ').pop()!, ev.away.name.split(' ').pop()!]}
            colors={m.selections.length === 3 ? [hc, 'var(--color-chip-hover)', ac] : [hc, ac]}
          />
        </div>

        <div className={`mt-4 grid gap-2 ${m.selections.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {m.selections.map((sel, k) => (
            <OddsButton
              key={sel.id}
              ev={ev}
              market={m}
              sel={sel}
              odds={prices[k]}
              label={m.selections.length === 3 ? (k === 0 ? '1' : k === 1 ? 'X' : '2') : (k === 0 ? ev.home : ev.away).name.split(' ').pop()}
            />
          ))}
        </div>
        {reason && <div className="mt-3 text-[11.5px] font-medium text-muted">{reason}</div>}
      </div>
    </motion.article>
    </Tilt>
  )
}

export function LiveNow({ mine, other }: { mine: SportEvent[]; other: SportEvent[] }) {
  const [all, setAll] = useState(false)
  const list = all ? [...mine, ...other] : mine.length ? mine : other.slice(0, 2)
  const hidden = mine.length ? other.length : Math.max(0, other.length - 2)
  return (
    <section aria-labelledby="live-title" className="mt-14">
      <div className="mb-5 flex items-end justify-between gap-3">
        <motion.h2 initial={{ opacity: 0, y: 22, clipPath: "inset(0 0 100% 0)" }} whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 -20% 0)" }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} id="live-title" className="font-display text-[34px] leading-none font-[780] tracking-[-0.045em] @tab:text-[40px]">
          Live now
          <span className="ml-3 align-middle font-sans text-[13px] font-semibold tracking-normal text-secondary">{mine.length ? `${mine.length} you follow` : 'Popular'}</span>
        </motion.h2>
        <Link to="/live" className="pb-1 text-[14px] font-semibold text-sel-ink hover:underline">
          All live
        </Link>
      </div>
      <div className="grid gap-3 @tab:grid-cols-2 @wide:grid-cols-3">
        <AnimatePresence initial={false} mode="popLayout">
          {list.map((ev, i) => (
            <LiveCard key={ev.id} ev={ev} i={i} />
          ))}
        </AnimatePresence>
      </div>
      {hidden > 0 && (
        <button onClick={() => setAll((a) => !a)} aria-expanded={all} className="mt-3 flex items-center gap-1.5 rounded-full px-1 text-[13.5px] font-semibold text-secondary hover:text-ink">
          <motion.span animate={{ rotate: all ? 180 : 0 }}>
            <ChevronDown size={17} />
          </motion.span>
          {all ? 'Show less' : `${hidden} more live`}
        </button>
      )}
      <p className="mt-3 text-[12px] text-muted">Live information can be delayed. Others may have more up-to-date information.</p>
    </section>
  )
}
