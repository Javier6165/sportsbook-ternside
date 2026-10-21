import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router'
import { competitionById, type SportEvent } from '../../data/catalog'
import { liveEvents, useLiveClock, useLiveEvent } from '../../state/store'
import { Crest } from '../../ui/Crest'
import { OddsButton } from '../../ui/OddsButton'
import { SportIcon } from '../../ui/SportIcon'

function Momentum({ seed }: { seed: number }) {
  const { tick } = useLiveClock()
  const bars = Array.from({ length: 26 }, (_, i) => {
    const k = i + Math.floor(tick / 3)
    const v = Math.sin(k * 1.7 + seed) * 0.5 + Math.sin(k * 0.6 + seed * 2) * 0.5
    return v
  })
  return (
    <div className="relative flex h-9 gap-[2px]" aria-hidden="true">
      <span className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
      {bars.map((v, i) => (
        <span key={i} className="flex h-full flex-1 flex-col">
          <span className="flex h-1/2 items-end">
            <motion.span
              animate={{ height: v > 0 ? `${Math.max(10, v * 100)}%` : '0%' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full rounded-t-[2px] bg-brand-dark"
              style={{ opacity: 0.3 + (i / bars.length) * 0.7 }}
            />
          </span>
          <span className="flex h-1/2 items-start">
            <motion.span
              animate={{ height: v < 0 ? `${Math.max(10, -v * 100)}%` : '0%' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full rounded-b-[2px] bg-white/45"
              style={{ opacity: 0.3 + (i / bars.length) * 0.7 }}
            />
          </span>
        </span>
      ))}
    </div>
  )
}

function LiveCard({ ev, i }: { ev: SportEvent; i: number }) {
  const { prices, minute } = useLiveEvent(ev)
  const comp = competitionById(ev.competitionId)
  const L = ev.live!
  const m = ev.markets[0]
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex w-[292px] shrink-0 snap-start flex-col overflow-hidden rounded-[18px] bg-nav p-4 text-white shadow-[0_18px_40px_-24px_rgba(16,24,43,.8)] grain"
    >
      <div className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-action/30 blur-3xl" aria-hidden="true" />
      <div className="relative flex items-center justify-between text-[11.5px]">
        <Link to={`/event/${ev.id}`} className="on-dark flex min-w-0 items-center gap-1.5 text-white/60 hover:text-white">
          <SportIcon sport={ev.sport} size={13} />
          <span className="truncate">{comp.name}</span>
        </Link>
        <span className="flex items-center gap-1.5 rounded-full bg-live/15 px-2 py-0.5 font-semibold text-[#ff8098]">
          <span className="live-dot" aria-hidden="true" />
          {ev.sport === 'football' ? `${minute}’` : ev.sport === 'basketball' ? `${L.period} ${L.clock}` : L.period}
        </span>
      </div>

      <Link to={`/event/${ev.id}`} className="on-dark relative mt-3 block space-y-2">
        {[ev.home, ev.away].map((p, idx) => (
          <div key={p.id} className="flex items-center gap-2.5">
            <Crest team={p} size={22} />
            <span className="min-w-0 flex-1 truncate text-[14.5px] font-semibold">{p.name}</span>
            {ev.sport === 'tennis' && L.serving === idx && <span className="size-1.5 rounded-full bg-[#d8ff5a]" aria-label="Serving" />}
            {ev.sport === 'tennis' ? (
              <span className="flex gap-1 text-[13px] tnum">
                <span className="w-4 text-center text-white/50">{L.sets![idx]}</span>
                <span className="w-4 text-center text-white/80">{L.games![idx]}</span>
                <span className="w-6 rounded bg-white/10 text-center font-semibold">{L.points![idx]}</span>
              </span>
            ) : (
              <span className="display w-7 text-right text-[24px] leading-none tnum">{L.score[idx]}</span>
            )}
          </div>
        ))}
      </Link>

      <div className="relative mt-3">
        {ev.sport === 'football' ? (
          <>
            <div className="mb-1 flex justify-between text-[10px] font-semibold tracking-[.08em] text-white/40 uppercase">
              <span>Attack momentum</span>
              <span>Last 10 min</span>
            </div>
            <Momentum seed={i * 3 + 1} />
          </>
        ) : (
          <div className="line-clamp-2 h-[49px] rounded-lg bg-white/[.04] px-3 py-2 text-[12px] leading-snug text-white/60 ring-1 ring-white/[.06] ring-inset">
            {ev.sport === 'tennis' ? 'Lindqvist broke in game 4 · 71% first serves' : 'Mariners on a 9–2 run · Steel in the bonus'}
          </div>
        )}
      </div>

      <div className="relative mt-3 flex items-baseline justify-between text-[11px] text-white/45">
        <span className="font-semibold text-white/70">{m.name}</span>
        <span>{m.period}</span>
      </div>
      <div className={`relative mt-1.5 grid gap-1.5 ${m.selections.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {m.selections.map((sel, k) => (
          <OddsButton
            key={sel.id}
            ev={ev}
            market={m}
            sel={sel}
            odds={prices[k]}
            variant="dark"
            label={m.selections.length === 3 ? (k === 0 ? '1' : k === 1 ? 'X' : '2') : k === 0 ? ev.home.short.split(' ').pop() : ev.away.short.split(' ').pop()}
          />
        ))}
      </div>
    </motion.article>
  )
}

export function LiveNow() {
  const evs = liveEvents()
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dx: number) => ref.current?.scrollBy({ left: dx, behavior: 'smooth' })
  return (
    <section aria-labelledby="live-title" className="mt-9">
      <div className="mb-3.5 flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11.5px] font-semibold tracking-[.1em] text-live uppercase">
            <span className="live-dot" aria-hidden="true" /> In play
          </div>
          <h2 id="live-title" className="display mt-1 text-[30px] leading-none uppercase">
            Live now <span className="text-muted">{evs.length}</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/live" className="mr-1 text-[13px] font-semibold text-sel-ink hover:underline">
            See all live
          </Link>
          <button aria-label="Scroll live events left" onClick={() => scroll(-310)} className="hidden size-9 place-items-center rounded-full border border-line bg-surface text-ink hover:bg-canvas @tab:grid">
            <ChevronLeft size={17} />
          </button>
          <button aria-label="Scroll live events right" onClick={() => scroll(310)} className="hidden size-9 place-items-center rounded-full border border-line bg-surface text-ink hover:bg-canvas @tab:grid">
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
      <div ref={ref} className="no-scrollbar -mx-4 flex @desk:[mask-image:linear-gradient(90deg,#000_88%,transparent)] snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 @desk:-mx-0 @desk:scroll-px-0 @desk:px-0">
        {evs.map((ev, i) => (
          <LiveCard key={ev.id} ev={ev} i={i} />
        ))}
      </div>
      <p className="mt-2 text-[11.5px] text-muted">Live information can be delayed. Others may have more up-to-date information.</p>
    </section>
  )
}
