import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { competitionById, teamColor, type SportEvent } from '../../data/catalog'
import { useLiveClock, useLiveEvent } from '../../state/store'
import { Crest } from '../../ui/Crest'
import { OddsButton } from '../../ui/OddsButton'

function Momentum({ seed, home, away }: { seed: number; home: string; away: string }) {
  const { tick } = useLiveClock()
  const bars = Array.from({ length: 30 }, (_, i) => {
    const k = i + Math.floor(tick / 3)
    return Math.sin(k * 1.7 + seed) * 0.5 + Math.sin(k * 0.6 + seed * 2) * 0.5
  })
  return (
    <div className="relative flex h-8 gap-[2px]" aria-hidden="true">
      <span className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
      {bars.map((v, i) => (
        <span key={i} className="flex h-full flex-1 flex-col" style={{ opacity: 0.25 + (i / bars.length) * 0.75 }}>
          <span className="flex h-1/2 items-end">
            <motion.span animate={{ height: v > 0 ? `${Math.max(12, v * 100)}%` : '0%' }} transition={{ duration: 0.8 }} className="w-full rounded-t-[2px]" style={{ background: home }} />
          </span>
          <span className="flex h-1/2 items-start">
            <motion.span animate={{ height: v < 0 ? `${Math.max(12, -v * 100)}%` : '0%' }} transition={{ duration: 0.8 }} className="w-full rounded-b-[2px]" style={{ background: away }} />
          </span>
        </span>
      ))}
    </div>
  )
}

const lighten = (c: string) => `color-mix(in oklab, ${c} 70%, white)`

export function LiveCard({ ev, i, reason }: { ev: SportEvent; i: number; reason?: string }) {
  const { prices, minute } = useLiveEvent(ev)
  const comp = competitionById(ev.competitionId)
  const L = ev.live!
  const m = ev.markets[0]
  const hc = teamColor(ev.home)
  const ac = teamColor(ev.away)
  const clock = ev.sport === 'football' ? `${minute}’` : ev.sport === 'basketball' ? `${L.period} ${L.clock}` : L.period
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
      <span aria-hidden="true" className="pointer-events-none absolute -top-24 -left-16 size-56 rounded-full opacity-35 blur-3xl" style={{ background: hc }} />
      <span aria-hidden="true" className="pointer-events-none absolute -top-24 -right-16 size-56 rounded-full opacity-30 blur-3xl" style={{ background: ac }} />

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

      <div className="relative mt-4">
        {ev.sport === 'football' ? (
          <Momentum seed={i * 3 + 1} home={lighten(hc)} away="rgba(255,255,255,.4)" />
        ) : (
          <p className="line-clamp-1 text-[12.5px] text-white/55">{ev.sport === 'tennis' ? 'Lindqvist broke in game 4 · 71% first serves' : 'Mariners on a 9–2 run'}</p>
        )}
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
