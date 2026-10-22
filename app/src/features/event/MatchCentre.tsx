import clsx from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { teamColor, type SportEvent } from '../../data/catalog'
import { useLiveClock, useLiveEvent } from '../../state/store'
import { Crest } from '../../ui/Crest'
import { LiveBadge } from '../../ui/LiveBadge'

const ease = [0.16, 1, 0.3, 1] as const
const lighten = (c: string, p = 70) => `color-mix(in oklab, ${c} ${p}%, white)`
const shortName = (n: string) => { const w = n.split(' '); return w[0].endsWith('.') ? w[w.length - 1] : w[0] }

// Fictional live feed: a gentle, deterministic stream of match moments.
const FOOTBALL_EVENTS = [
  { side: 0, kind: 'Dangerous attack', big: false },
  { side: 0, kind: 'Shot on target', big: true },
  { side: 1, kind: 'Corner', big: false },
  { side: 0, kind: 'In possession', big: false },
  { side: 1, kind: 'Dangerous attack', big: false },
  { side: 0, kind: 'Free kick', big: false },
  { side: 1, kind: 'Shot wide', big: true },
  { side: 0, kind: 'In possession', big: false },
]
const TENNIS_EVENTS = [
  { side: 0, kind: 'Ace', big: true },
  { side: 1, kind: 'Rally · 14 shots', big: false },
  { side: 0, kind: 'Break point', big: true },
  { side: 1, kind: 'Double fault', big: false },
]
const BASKET_EVENTS = [
  { side: 0, kind: '3-pointer', big: true },
  { side: 1, kind: 'Fast break', big: false },
  { side: 0, kind: 'Defensive rebound', big: false },
  { side: 1, kind: 'Free throws', big: false },
]

function rnd(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

/** Top-down pitch / court drawn in SVG, tilted in 3D by the parent. */
function Surface({ sport }: { sport: SportEvent['sport'] }) {
  const line = 'rgba(255,255,255,.55)'
  if (sport === 'tennis')
    return (
      <svg viewBox="0 0 1000 560" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <rect width="1000" height="560" fill="#123a6b" />
        <rect x="80" y="60" width="840" height="440" fill="#1d5aa0" />
        <g stroke={line} strokeWidth="4" fill="none" className="draw-lines">
          <rect x="80" y="60" width="840" height="440" />
          <line x1="80" y1="115" x2="920" y2="115" />
          <line x1="80" y1="445" x2="920" y2="445" />
          <line x1="290" y1="115" x2="290" y2="445" />
          <line x1="710" y1="115" x2="710" y2="445" />
          <line x1="290" y1="280" x2="710" y2="280" />
        </g>
        <line x1="500" y1="40" x2="500" y2="520" stroke="rgba(255,255,255,.85)" strokeWidth="6" />
      </svg>
    )
  if (sport === 'basketball')
    return (
      <svg viewBox="0 0 1000 560" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <rect width="1000" height="560" fill="#3b2412" />
        <rect x="40" y="40" width="920" height="480" fill="#8a5a2b" />
        <g stroke={line} strokeWidth="4" fill="none" className="draw-lines">
          <rect x="40" y="40" width="920" height="480" />
          <line x1="500" y1="40" x2="500" y2="520" />
          <circle cx="500" cy="280" r="70" />
          <rect x="40" y="200" width="190" height="160" />
          <rect x="770" y="200" width="190" height="160" />
          <path d="M40 80 H140 A230 230 0 0 1 140 480 H40" />
          <path d="M960 80 H860 A230 230 0 0 0 860 480 H960" />
        </g>
      </svg>
    )
  return (
    <svg viewBox="0 0 1000 560" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <pattern id="stripes" width="125" height="560" patternUnits="userSpaceOnUse">
          <rect width="62.5" height="560" fill="#0f3b26" />
          <rect x="62.5" width="62.5" height="560" fill="#11442c" />
        </pattern>
      </defs>
      <rect width="1000" height="560" fill="url(#stripes)" />
      <g stroke={line} strokeWidth="3.5" fill="none" className="draw-lines">
        <rect x="30" y="30" width="940" height="500" />
        <line x1="500" y1="30" x2="500" y2="530" />
        <circle cx="500" cy="280" r="70" />
        <rect x="30" y="160" width="140" height="240" />
        <rect x="30" y="215" width="50" height="130" />
        <rect x="830" y="160" width="140" height="240" />
        <rect x="920" y="215" width="50" height="130" />
        <path d="M170 235 A60 60 0 0 1 170 325" />
        <path d="M830 235 A60 60 0 0 0 830 325" />
      </g>
      <circle cx="500" cy="280" r="4" fill={line} />
    </svg>
  )
}

const FORMATION: [number, number][] = [
  [8, 50],
  [22, 22],
  [22, 78],
  [36, 38],
  [36, 62],
  [46, 50],
]

export function MatchCentre({ ev }: { ev: SportEvent }) {
  const { tick } = useLiveClock()
  const { prices, minute } = useLiveEvent(ev)
  const L = ev.live!
  const hc = teamColor(ev.home)
  const ac = teamColor(ev.away)
  const sport = ev.sport

  // a new phase of play every ~3.5s
  const phase = Math.floor(tick / 3.5)
  const events = sport === 'football' ? FOOTBALL_EVENTS : sport === 'tennis' ? TENNIS_EVENTS : BASKET_EVENTS
  const evIdx = Math.floor(tick / 7) % events.length
  const moment = events[evIdx]
  const attacking = moment.side // 0 home attacks right, 1 away attacks left

  const ball = useMemo(() => {
    const r = rnd(phase + ev.id.length)
    const r2 = rnd(phase * 3 + 7)
    if (sport === 'tennis') return { x: attacking === 0 ? 70 + r * 14 : 16 + r * 14, y: 22 + r2 * 56 }
    const baseX = attacking === 0 ? 58 + r * 32 : 10 + r * 32
    return { x: baseX, y: 18 + r2 * 64 }
  }, [phase, attacking, sport, ev.id])

  // players drift towards the ball, holding shape
  const players = useMemo(() => {
    if (sport === 'tennis') return [{ x: ball.x < 50 ? 12 : 10, y: 50, side: 0 }, { x: ball.x > 50 ? 88 : 90, y: 50, side: 1 }].map((p, i) => ({ ...p, y: i === (ball.x < 50 ? 0 : 1) ? ball.y : 50 }))
    const shift = (ball.x - 50) * 0.35
    const n = sport === 'basketball' ? 5 : 6
    const home = FORMATION.slice(0, n).map(([x, y], i) => ({ x: x + shift + rnd(phase + i) * 4, y: y + (ball.y - 50) * 0.25 + (rnd(phase * 2 + i) - 0.5) * 6, side: 0 }))
    const away = FORMATION.slice(0, n).map(([x, y], i) => ({ x: 100 - x + shift + rnd(phase + i + 20) * 4, y: 100 - y + (ball.y - 50) * 0.25 + (rnd(phase * 2 + i + 9) - 0.5) * 6, side: 1 }))
    return [...home, ...away]
  }, [ball, phase, sport])

  const [trail, setTrail] = useState<{ x: number; y: number; k: number }[]>([])
  useEffect(() => {
    setTrail((t) => [{ ...ball, k: phase }, ...t].slice(0, 4))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ball])
  const [toast, setToast] = useState<{ id: number; text: string; side: number; big: boolean } | null>(null)
  useEffect(() => {
    setToast({ id: evIdx + tick, text: moment.kind, side: moment.side, big: moment.big })
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evIdx])

  const sideName = (s: number) => shortName((s === 0 ? ev.home : ev.away).name)
  const tColor = (s: number) => (s === 0 ? hc : ac)

  // Win probability: implied by current odds, normalised (not a model).
  const inv = prices.map((p) => 1 / Number(p))
  const sum = inv.reduce((a, b) => a + b, 0)
  const pct = inv.map((v) => Math.round((v / sum) * 100))
  const three = pct.length === 3

  return (
    <section aria-label="Live match centre" className="relative">
      {/* Scoreboard */}
      <div className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-center gap-3 @tab:gap-8">
        {[ev.home, ev.away].map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, x: i ? 16 : -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease }} className={clsx('flex min-w-0 flex-col gap-2 @tab:flex-row @tab:items-center @tab:gap-3', i ? 'col-start-3 items-end text-right @tab:flex-row-reverse' : 'items-start')}>
            <Crest team={t} size={52} className="shrink-0 drop-shadow-[0_10px_20px_rgba(0,0,0,.5)]" />
            <span className="min-w-0 font-display text-[17px] leading-[1] font-[800] tracking-[-0.035em] @tab:text-[36px] @desk:text-[44px]">{t.name}</span>
          </motion.div>
        ))}
        <div className="col-start-2 row-start-1 text-center">
          <div className="font-display text-[48px] leading-none font-[800] tracking-[-0.05em] tnum @tab:text-[84px]">
            {sport === 'tennis' ? `${L.sets![0]}–${L.sets![1]}` : (
              <>
                <motion.span key={`h${L.score[0]}`} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block">{L.score[0]}</motion.span>
                <span className="text-white/40">–</span>
                <motion.span key={`a${L.score[1]}`} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block">{L.score[1]}</motion.span>
              </>
            )}
          </div>
          <div className="mt-2.5 flex justify-center">
            <LiveBadge tone="solid" size="lg" clock={sport === 'football' ? `${minute}'` : sport === 'basketball' ? `${L.period} ${L.clock}` : `${L.period} · ${L.games![0]}–${L.games![1]}`} />
          </div>
        </div>
      </div>

      <div className="mt-2 grid items-center gap-6 @desk:mt-0 @desk:grid-cols-[minmax(0,1fr)_300px] @desk:gap-10">
      {/* Pitch */}
      <div className="relative aspect-[1000/560] w-full [perspective:1100px]">
        <motion.div initial={{ rotateX: 72, scale: 0.82, opacity: 0, y: 40 }} animate={{ rotateX: 32, scale: 1, opacity: 1, y: 0 }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0 origin-bottom overflow-hidden rounded-[22px] shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)]">
          <Surface sport={sport} />
          {/* attacking third glow */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 w-[42%]"
            animate={{ left: attacking === 0 ? '58%' : '0%', opacity: [0.35, 0.6, 0.35] }}
            transition={{ left: { duration: 1.2, ease }, opacity: { duration: 2.4, repeat: Infinity } }}
            style={{ background: `linear-gradient(${attacking === 0 ? 90 : 270}deg, transparent, ${lighten(tColor(attacking), 55)})`, mixBlendMode: 'soft-light' }}
          />
          {/* floodlight vignette */}
          <div aria-hidden="true" className="absolute inset-0" style={{ background: 'radial-gradient(80% 90% at 50% 40%, transparent 50%, rgba(5,7,13,.55))' }} />
          {/* players */}
          {players.map((p, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="absolute size-[2.4%] min-h-2.5 min-w-2.5 -translate-x-1/2 -translate-y-1/2 scale-y-[1.9] rounded-full ring-2 ring-white/80"
              animate={{ left: `${p.x}%`, top: `${p.y}%` }}
              transition={{ duration: 3.2, ease: 'easeInOut' }}
              style={{ background: tColor(p.side), boxShadow: `0 0 14px ${tColor(p.side)}` }}
            />
          ))}
          {/* trail */}
          {trail.map((p, k) => (
            <motion.span key={`${p.k}`} aria-hidden="true" className="absolute size-[1.2%] min-h-1.5 min-w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" style={{ left: `${p.x}%`, top: `${p.y}%` }} initial={{ opacity: 0.45 - k * 0.08, scale: 1 }} animate={{ opacity: 0, scale: 0.3 }} transition={{ duration: 1.6 }} />
          ))}
          {/* shockwave on big moments */}
          <AnimatePresence>
            {moment.big && (
              <motion.span
                key={`sw${evIdx}${Math.floor(tick / 7)}`}
                aria-hidden="true"
                className="absolute size-[10%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px]"
                style={{ left: `${ball.x}%`, top: `${ball.y}%`, borderColor: lighten(tColor(attacking), 70) }}
                initial={{ scale: 0.2, opacity: 0.9 }}
                animate={{ scale: 3, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </AnimatePresence>
          {/* ball + glow */}
          <motion.span
            aria-hidden="true"
            className="absolute size-[1.6%] min-h-2 min-w-2 -translate-x-1/2 -translate-y-1/2 scale-y-[1.9] rounded-full bg-white"
            animate={{ left: `${ball.x}%`, top: `${ball.y}%` }}
            transition={{ duration: 1.6, ease: [0.45, 0, 0.2, 1] }}
            style={{ boxShadow: '0 0 0 6px rgba(255,255,255,.18), 0 0 30px 8px rgba(255,255,255,.55)' }}
          />
        </motion.div>

        {/* Moment banner, floating above the tilted pitch */}
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 18, scale: 0.9, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
              transition={{ duration: 0.5, ease }}
              className={clsx('pointer-events-none absolute top-[4%] left-1/2 z-10 -translate-x-1/2 @tab:top-[14%] @tab:translate-x-0', toast.side === 0 ? '@tab:left-[56%]' : '@tab:right-[56%] @tab:left-auto')}
              role="status"
            >
              <div className="flex items-center gap-2.5 rounded-[16px] bg-black/55 px-4 py-2.5 ring-1 ring-white/15 backdrop-blur-xl" style={{ boxShadow: `0 0 40px -6px ${tColor(toast.side)}` }}>
                <span className="h-8 w-1.5 rounded-full" style={{ background: lighten(tColor(toast.side), 80) }} />
                <span>
                  <span className="block text-[11px] font-bold tracking-[.12em] text-white/60 uppercase">{sideName(toast.side)}</span>
                  <span className={clsx('block font-display leading-none font-[800] tracking-[-0.03em] whitespace-nowrap', toast.big ? 'text-[24px] @tab:text-[30px]' : 'text-[18px] @tab:text-[22px]')}>{toast.text}</span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Win probability + moments */}
      <div className="relative z-10">
        <div className="mb-2 flex items-baseline justify-between text-[12px] font-semibold text-white/60">
          <span className="text-[14px] text-white">Win probability</span>
          <span>from current odds</span>
        </div>
        <div className="relative flex h-4 gap-1 overflow-hidden rounded-full">
          {pct.map((p, i) => (
            <motion.span
              key={i}
              animate={{ flexGrow: Math.max(p, 3) }}
              transition={{ duration: 1.2, ease }}
              className="relative h-full overflow-hidden rounded-full"
              style={{ flexBasis: 0, background: three && i === 1 ? 'rgba(255,255,255,.3)' : lighten(i === 0 ? hc : ac, 78) }}
            >
              <motion.span className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent" animate={{ x: ['-100%', '300%'] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }} />
            </motion.span>
          ))}
        </div>
        <div className="mt-2.5 grid grid-cols-3 text-[12.5px] font-semibold">
          <span>
            <span className="block font-display text-[26px] leading-none font-[800] tracking-[-0.03em] tnum">{pct[0]}%</span>
            {shortName(ev.home.name)}
          </span>
          <span className="text-center text-white/70">
            {three && (
              <>
                <span className="block font-display text-[26px] leading-none font-[800] tracking-[-0.03em] text-white tnum">{pct[1]}%</span>
                Draw
              </>
            )}
          </span>
          <span className="text-right">
            <span className="block font-display text-[26px] leading-none font-[800] tracking-[-0.03em] tnum">{pct[pct.length - 1]}%</span>
            {shortName(ev.away.name)}
          </span>
        </div>
        <p className="mt-2 text-[11.5px] text-white/50">What the prices imply right now — not a prediction.</p>

        <div className="mt-5 @desk:mt-6">
          <div className="mb-2 text-[12px] font-bold tracking-[.1em] text-white/50 uppercase">Latest</div>
          <ul className="space-y-1.5">
            <AnimatePresence initial={false}>
              {[0, 1, 2, 3].map((k) => {
                const idx = (evIdx - k + events.length * 4) % events.length
                const m = events[idx]
                return (
                  <motion.li
                    key={`${Math.floor(tick / 7) - k}`}
                    layout
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1 - k * 0.2, x: 0 }}
                    exit={{ opacity: 0 }}
                    className={clsx('items-center gap-2.5 rounded-[12px] bg-white/[.07] px-3 py-2 text-[13px]', k < 2 ? 'flex' : 'hidden @desk:flex')}
                  >
                    <span className="h-5 w-1 rounded-full" style={{ background: lighten(tColor(m.side), 80) }} />
                    <span className="font-semibold">{m.kind}</span>
                    <span className="ml-auto text-white/55">{sideName(m.side)}</span>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </ul>
        </div>
      </div>
      </div>
    </section>
  )
}
