import clsx from 'clsx'
import { ArrowUpRight, ChevronDown, MapPin, Sparkles, Star } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { competitionById, imageFor, shortName, teamColor, type SportEvent } from '../../data/catalog'
import type { Reason } from '../../lib/feed'
import { dayLabel, kickoffTime, secondsUntil } from '../../lib/time'
import { useLiveClock, useLiveEvent } from '../../state/store'
import { Crest } from '../../ui/Crest'
import { LiveBadge } from '../../ui/LiveBadge'
import { OddsButton } from '../../ui/OddsButton'
import { Reveal } from '../../ui/Reveal'
import { Score } from '../../ui/Score'
import { MatchContext } from '../../ui/MatchContext'
import { lazy, Suspense } from 'react'

const Kits3D = lazy(() => import('../../ui/Kit3D'))

const ease = [0.16, 1, 0.3, 1] as const
const first = shortName

function Countdown({ iso }: { iso: string }) {
  const { elapsed } = useLiveClock()
  const s = secondsUntil(iso, elapsed)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const parts = h ? [h, m, sec] : [m, sec]
  return (
    <span className="flex items-center gap-1 tnum" role="timer" aria-label={`Kick-off in ${h ? h + ' hours ' : ''}${m} minutes`}>
      {parts.map((v, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="grid h-11 min-w-11 place-items-center rounded-[12px] bg-white/[.14] px-2 font-display text-[22px] font-[760] tracking-[-0.03em] backdrop-blur-md">{String(v).padStart(2, '0')}</span>
          {i < parts.length - 1 && <span className="text-white/50">:</span>}
        </span>
      ))}
    </span>
  )
}

export function Hero({ ev, reason, compact, controls = true }: { ev: SportEvent; reason: Reason | null; compact?: boolean; controls?: boolean }) {
  const comp = competitionById(ev.competitionId)
  const result = ev.markets[0]
  const [why, setWhy] = useState(false)
  const hc = teamColor(ev.home)
  const ac = teamColor(ev.away)
  const { prices } = useLiveEvent(ev)
  const live = ev.status === 'live'

  return (
    <section aria-label={`${ev.home.name} v ${ev.away.name}`} className="on-dark relative isolate h-full overflow-hidden bg-night text-white">
      {/* Placeholder photo (Unsplash) — slot for Astra's matchday key art */}
      <motion.img
        data-asset-slot="hero-matchday"
        src={imageFor(ev)}
        alt=""
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease }}
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_40%] blur-[3px] saturate-[.85]"
      />
      {/* Colour of the game: home colour from the left, away colour from the right */}
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: `linear-gradient(100deg, color-mix(in oklab, ${hc} 92%, #05070d) 0%, color-mix(in oklab, ${hc} 70%, transparent) 38%, transparent 62%, color-mix(in oklab, ${ac} 55%, transparent) 100%)` }} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#05070d]/85 via-[#05070d]/15 to-[#05070d]/30" />
      {/* Colour sweep on entry */}
      <motion.div aria-hidden="true" className="absolute inset-0 -z-10" initial={{ opacity: 0.9, x: '-30%' }} animate={{ opacity: 0, x: '30%' }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} style={{ background: `linear-gradient(100deg, transparent, ${hc} 45%, ${ac} 70%, transparent)` }} />
      {ev.home.crest && ev.away.crest && (
        <div aria-hidden="true" className="pointer-events-none absolute top-[8%] right-[-14%] -z-[5] h-[26%] w-[66%] @tab:top-[3%] @tab:right-[1%] @tab:h-[60%] @tab:w-[50%] @desk:right-[2%] @desk:h-[62%] @desk:w-[44%]">
          <Suspense fallback={null}>
            <Kits3D home={ev.home} away={ev.away} kind={ev.sport === 'basketball' ? 'vest' : 'shirt'} />
          </Suspense>
        </div>
      )}

      {(() => {
        const chips = (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/[.16] px-3 py-1.5 text-[12.5px] font-semibold backdrop-blur-md">{comp.name}</span>
            <span className="text-[13px] font-medium text-white/75">{ev.stage}</span>
            {reason && (
              <span className={clsx('flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1.5 text-[12px] font-semibold text-white/90 backdrop-blur-md', compact && '@tab:ml-auto')}>
                <Star size={13} fill="currentColor" /> {reason.text}
              </span>
            )}
          </motion.div>
        )
        const title = (
          <h2 className="font-display leading-[.88] font-[800] tracking-[-0.055em]">
            {[ev.home, ev.away].map((t, i) => (
              <span key={t.id} className={clsx('flex items-center gap-3', compact ? 'text-[clamp(40px,12cqi,104px)] @desk:text-[clamp(52px,5.6cqi,84px)]' : 'text-[clamp(40px,12cqi,96px)] @desk:text-[clamp(56px,6.4cqi,88px)]')}>
                {i === 1 && <Reveal text="v" delay={0.35} className="text-white/45" />}
                <Reveal text={first(t.name)} delay={0.15 + i * 0.22} />
                {t.crest && (
                  <motion.span initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.6 + i * 0.15, type: 'spring', stiffness: 260, damping: 14 }} className="hidden shrink-0 self-center @tab:block">
                    <Crest team={t} size={compact ? 56 : 50} className="drop-shadow-[0_10px_20px_rgba(0,0,0,.45)]" />
                  </motion.span>
                )}
              </span>
            ))}
            <span className="sr-only">
              {' '}
              {ev.home.name} versus {ev.away.name}
            </span>
          </h2>
        )
        const info = (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.6 }} className={clsx('flex flex-wrap items-end gap-x-6 gap-y-4', compact ? 'mt-6' : 'mt-5')}>
            {live && ev.live ? (
              <div>
                <div className="mb-2">
                  <LiveBadge tone="solid" size="lg" clock={ev.sport === 'football' ? `${ev.live.minute}'` : ev.sport === 'basketball' ? `${ev.live.period} ${ev.live.clock}` : ev.live.period} />
                </div>
                <div className="font-display text-[44px] leading-none font-[800] tracking-[-0.03em] tnum">
                  <Score a={ev.sport === 'tennis' ? ev.live.sets![0] : ev.live.score[0]} b={ev.sport === 'tennis' ? ev.live.sets![1] : ev.live.score[1]} />
                  {ev.sport === 'tennis' && <span className="ml-2 text-[20px] font-[700] tracking-[-0.02em] text-white/75">sets</span>}
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-1.5 text-[11px] font-bold tracking-[.12em] text-white/60 uppercase">Kick-off in</div>
                <Countdown iso={ev.startsAt} />
              </div>
            )}
            <div className="text-[14px] leading-snug">
              <div className="font-semibold">{live ? `Kicked off ${kickoffTime(ev.startsAt)}` : `${dayLabel(ev.startsAt)} · ${kickoffTime(ev.startsAt)}`}</div>
              {ev.venue && (
                <div className="flex items-center gap-1 text-white/70">
                  <MapPin size={13} /> {ev.venue}
                </div>
              )}
            </div>
          </motion.div>
        )
        const odds = (
          <div>
            <div className="mb-2.5 flex items-baseline justify-between text-[12.5px] font-medium text-white/75">
              <span>
                {live ? 'Live · ' : ''}
                {result.name} · {result.period}
              </span>
              <Link to={`/event/${ev.id}`} className="flex items-center gap-1 font-semibold text-white hover:underline">
                All markets <ArrowUpRight size={15} />
              </Link>
            </div>
            <div className={clsx('grid gap-2', result.selections.length === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
              {result.selections.map((sel, i) => (
                <OddsButton key={sel.id} ev={ev} market={result} sel={sel} odds={live ? prices[i] : sel.odds} variant="field" size="lg" label={sel.id === 'DRAW' ? 'Draw' : sel.id === 'HOME' ? first(ev.home.name) : first(ev.away.name)} />
              ))}
            </div>
          </div>
        )
        const context = !live && (
          <button
            onClick={() => setWhy((w) => !w)}
            aria-expanded={why}
            className={clsx('flex h-11 w-full items-center gap-2 rounded-[16px] bg-black/30 px-4 text-[14px] font-semibold ring-1 ring-white/10 backdrop-blur-xl transition-colors hover:bg-black/45', !compact && '@desk:h-16 @desk:rounded-[18px] @desk:px-5')}
          >
            <Sparkles size={16} /> Match context
            <span className="ml-auto text-[11.5px] font-medium text-white/55">Form and what the odds imply</span>
            <motion.span animate={{ rotate: why ? 180 : 0 }}>
              <ChevronDown size={17} />
            </motion.span>
          </button>
        )
        const panel = (
          <AnimatePresence initial={false}>
            {why && !live && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease }} className="overflow-hidden">
                <div className="mt-5">
                  <MatchContext ev={ev} tone="glass" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )

        if (compact)
          return (
            <div className={clsx('mx-auto flex h-full min-h-[500px] max-w-[1220px] flex-col px-4 pt-6 @tab:min-h-[480px] @tab:px-8 @tab:pt-9', controls ? 'pb-20 @tab:pb-24' : 'pb-5 @tab:pb-8')}>
              {chips}
              <div className="mt-auto grid items-end gap-6 pt-10 @desk:grid-cols-[minmax(0,1fr)_auto]">
                <div className="min-w-0">
                  {title}
                  {info}
                </div>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7, ease }} className="w-full @desk:w-[460px]">
                  {odds}
                  {context && <div className="mt-3">{context}</div>}
                </motion.div>
              </div>
              {panel}
            </div>
          )

        // Featured banner: four quadrants — who/when top-left, kits top-right, prices bottom-left, context bottom-right.
        return (
          <div className={clsx('mx-auto flex h-full min-h-[500px] max-w-[1220px] flex-col px-4 pt-6 @tab:min-h-[440px] @tab:px-8 @tab:pt-8', controls ? 'pb-20 @tab:pb-24' : 'pb-5 @tab:pb-8')}>
            {chips}
            <div className="mt-[21%] min-w-0 @tab:mt-6 @desk:max-w-[60%]">
              {title}
              {info}
            </div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7, ease }} className="mt-auto grid items-end gap-3 pt-8 @desk:grid-cols-2 @desk:gap-8">
              {odds}
              {context}
            </motion.div>
            {panel}
          </div>
        )
      })()}
    </section>
  )
}
