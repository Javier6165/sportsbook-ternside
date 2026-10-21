import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { competitionById, teamColor, type SportEvent } from '../../data/catalog'
import { useLiveEvent } from '../../state/store'
import { Crest } from '../../ui/Crest'
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
      <div className="mb-1.5 flex justify-between text-[11px] font-semibold text-white/50">
        <span>Win probability</span>
        <span>from current odds</span>
      </div>
      <div className="flex h-2 gap-[3px] overflow-hidden rounded-full" aria-hidden="true">
        {pct.map((p, i) => (
          <motion.span key={i} animate={{ flexGrow: Math.max(p, 4) }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full" style={{ flexBasis: 0, background: colors[i] }} />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[11.5px] font-semibold text-white/75 tnum">
        {pct.map((p, i) => (
          <span key={i} className={i === 1 && pct.length === 3 ? 'text-center' : i === pct.length - 1 ? 'text-right' : ''}>
            {labels[i]} {p}%
          </span>
        ))}
      </div>
    </div>
  )
}

/** Slow drifting floodlight glow in the teams' colours — the card's "live" heartbeat. */
function LiveAura({ hc, ac }: { hc: string; ac: string }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.span
        className="absolute -top-28 -left-20 size-64 rounded-full blur-3xl"
        style={{ background: hc }}
        animate={{ x: [0, 40, 0], y: [0, 20, 0], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="absolute -top-28 -right-20 size-64 rounded-full blur-3xl"
        style={{ background: ac }}
        animate={{ x: [0, -40, 0], y: [0, 24, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
    </span>
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
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="on-dark relative flex min-w-0 flex-col overflow-hidden rounded-[26px] bg-[#0a0e18] p-5 text-white"
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[5px]" style={{ background: `linear-gradient(90deg, ${hc}, ${ac})` }} />
      <LiveAura hc={hc} ac={ac} />

      <div className="relative flex items-center justify-between gap-2">
        <span className="truncate text-[12.5px] font-semibold text-white/55">{comp.name}</span>
        <span className="led flex shrink-0 items-center gap-2 text-[17px] leading-none text-volt [text-shadow:0_0_14px_rgba(198,255,61,.55)]">
          <span className="live-dot !bg-volt" aria-hidden="true" />
          {clock}
        </span>
      </div>

      <Link to={`/event/${ev.id}`} className="relative mt-4 block space-y-2.5">
        {[ev.home, ev.away].map((p, idx) => (
          <div key={p.id} className="flex items-center gap-3">
            <Crest team={p} size={26} />
            <span className="min-w-0 flex-1 truncate text-[16px] font-semibold">{p.name}</span>
            {ev.sport === 'tennis' ? (
              <span className="flex items-center gap-2 font-display text-[15px] font-semibold tnum">
                {L.serving === idx && <span className="size-1.5 rounded-full bg-volt" aria-label="Serving" />}
                <span className="text-white/40">{L.sets![idx]}</span>
                <span className="text-white/75">{L.games![idx]}</span>
                <span className="w-7 rounded-md bg-white/10 py-0.5 text-center">{L.points![idx]}</span>
              </span>
            ) : (
              <span className="font-display text-[30px] leading-none font-[780] tracking-[-0.04em] tnum">{L.score[idx]}</span>
            )}
          </div>
        ))}
      </Link>

      <div className="relative mt-5">
        <MarketView
          prices={prices}
          labels={m.selections.length === 3 ? [ev.home.short, 'Draw', ev.away.short] : [ev.home.name.split(' ').pop()!, ev.away.name.split(' ').pop()!]}
          colors={m.selections.length === 3 ? [lighten(hc), 'rgba(255,255,255,.35)', lighten(ac)] : [lighten(hc), lighten(ac)]}
        />
      </div>

      <div className={`relative mt-4 grid gap-2 ${m.selections.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {m.selections.map((sel, k) => (
          <OddsButton
            key={sel.id}
            ev={ev}
            market={m}
            sel={sel}
            odds={prices[k]}
            variant="night"
            label={m.selections.length === 3 ? (k === 0 ? '1' : k === 1 ? 'X' : '2') : (k === 0 ? ev.home : ev.away).name.split(' ').pop()}
          />
        ))}
      </div>
      {reason && <div className="relative mt-3 text-[11.5px] font-medium text-white/40">{reason}</div>}
    </motion.article>
  )
}

export function LiveNow({ mine, other }: { mine: SportEvent[]; other: SportEvent[] }) {
  const [all, setAll] = useState(false)
  const list = all ? [...mine, ...other] : mine.length ? mine : other.slice(0, 2)
  const hidden = mine.length ? other.length : Math.max(0, other.length - 2)
  return (
    <section aria-labelledby="live-title" className="mt-14">
      <div className="mb-5 flex items-end justify-between gap-3">
        <h2 id="live-title" className="font-display text-[34px] leading-none font-[780] tracking-[-0.045em] @tab:text-[40px]">
          Live now
          <span className="ml-3 align-middle font-sans text-[13px] font-semibold tracking-normal text-secondary">{mine.length ? `${mine.length} you follow` : 'Popular'}</span>
        </h2>
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
