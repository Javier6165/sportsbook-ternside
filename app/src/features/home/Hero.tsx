import { ArrowUpRight, ChevronDown, MapPin, Sparkles, Star } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { IMAGES, competitionById, teamColor, type SportEvent } from '../../data/catalog'
import type { Reason } from '../../lib/feed'
import { dayLabel, kickoffTime, secondsUntil } from '../../lib/time'
import { useLiveClock, useLiveEvent } from '../../state/store'
import { Crest } from '../../ui/Crest'
import { LiveBadge } from '../../ui/LiveBadge'
import { OddsButton } from '../../ui/OddsButton'

const ease = [0.16, 1, 0.3, 1] as const
const first = (n: string) => n.split(' ')[0]

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

function Form({ form, label }: { form: string; label: string }) {
  return (
    <span className="flex items-center gap-2 text-[12px] font-semibold text-white/65">
      <span className="w-8">{label}</span>
      <span className="flex gap-1" aria-label={`${label} last five: ${form.split('').join(', ')}`}>
        {form.split('').map((r, i) => (
          <span
            key={i}
            className={'grid size-[20px] place-items-center rounded-[6px] text-[10px] font-bold ' + (r === 'W' ? 'bg-white text-ink' : r === 'D' ? 'bg-white/30 text-white' : 'bg-white/[.08] text-white/70 ring-1 ring-white/25 ring-inset')}
          >
            {r}
          </span>
        ))}
      </span>
    </span>
  )
}

export function Hero({ ev, reason }: { ev: SportEvent; reason: Reason | null }) {
  const comp = competitionById(ev.competitionId)
  const result = ev.markets[0]
  const [why, setWhy] = useState(false)
  const hc = teamColor(ev.home)
  const ac = teamColor(ev.away)
  const { prices } = useLiveEvent(ev)
  const live = ev.status === 'live'

  return (
    <section aria-labelledby="featured-title" className="on-dark relative isolate overflow-hidden bg-night text-white">
      {/* Placeholder photo (Unsplash) — slot for Astra's matchday key art */}
      <motion.img
        data-asset-slot="hero-matchday"
        src={IMAGES.heroNight}
        alt=""
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease }}
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_40%] blur-[3px] saturate-[.85]"
      />
      {/* Colour of the game: home colour from the left, away colour from the right */}
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: `linear-gradient(100deg, color-mix(in oklab, ${hc} 92%, #05070d) 0%, color-mix(in oklab, ${hc} 70%, transparent) 38%, transparent 62%, color-mix(in oklab, ${ac} 55%, transparent) 100%)` }} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#05070d]/85 via-[#05070d]/15 to-[#05070d]/30" />

      <div className="mx-auto flex min-h-[560px] max-w-[1220px] flex-col px-4 pt-6 pb-6 @tab:min-h-[600px] @tab:px-8 @tab:pt-9 @tab:pb-9">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/[.16] px-3 py-1.5 text-[12.5px] font-semibold backdrop-blur-md">{comp.name}</span>
          <span className="text-[13px] font-medium text-white/75">{ev.stage}</span>
          {reason && (
            <span className="flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1.5 text-[12px] font-semibold text-white/90 backdrop-blur-md @tab:ml-auto">
              <Star size={13} fill="currentColor" /> {reason.text}
            </span>
          )}
        </motion.div>

        <div className="mt-auto grid items-end gap-6 pt-10 @desk:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <h2 id="featured-title" className="font-display leading-[.88] font-[800] tracking-[-0.055em]">
              {[ev.home, ev.away].map((t, i) => (
                <motion.span
                  key={t.id}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, delay: 0.1 + i * 0.1, ease }}
                  className="flex items-center gap-3 text-[clamp(48px,14cqi,112px)] @desk:text-[clamp(56px,6.2cqi,108px)]"
                >
                  {i === 1 && <span className="text-white/45">v</span>}
                  {first(t.name)}
                  <Crest team={t} size={56} className="hidden shrink-0 self-center drop-shadow-[0_10px_20px_rgba(0,0,0,.45)] @tab:block" />
                </motion.span>
              ))}
              <span className="sr-only">
                {' '}
                {ev.home.name} versus {ev.away.name}
              </span>
            </h2>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.6 }} className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
              {live && ev.live ? (
                <div>
                  <div className="mb-2">
                    <LiveBadge tone="solid" size="lg" clock={`${ev.live.minute}'`} />
                  </div>
                  <div className="font-display text-[44px] leading-none font-[800] tracking-[-0.05em] tnum">
                    {ev.live.score[0]}–{ev.live.score[1]}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-1.5 text-[11px] font-bold tracking-[.12em] text-white/60 uppercase">Kick-off in</div>
                  <Countdown iso={ev.startsAt} />
                </div>
              )}
              <div className="text-[14px] leading-snug">
                <div className="font-semibold">
                  {live ? `Kicked off ${kickoffTime(ev.startsAt)}` : `${dayLabel(ev.startsAt)} · ${kickoffTime(ev.startsAt)}`}
                </div>
                <div className="flex items-center gap-1 text-white/70">
                  <MapPin size={13} /> {ev.venue}
                </div>
              </div>
              {ev.form && (
                <div className="hidden space-y-1.5 @tab:block">
                  <Form form={ev.form[0]} label={ev.home.short} />
                  <Form form={ev.form[1]} label={ev.away.short} />
                </div>
              )}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.7, ease }} className="w-full @desk:w-[460px]">
            <div className="mb-2.5 flex items-baseline justify-between text-[12.5px] font-medium text-white/75">
              <span>{live ? 'Live · ' : ''}Match result · {result.period}</span>
              <Link to={`/event/${ev.id}`} className="flex items-center gap-1 font-semibold text-white hover:underline">
                All markets <ArrowUpRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {result.selections.map((sel, i) => (
                <OddsButton key={sel.id} ev={ev} market={result} sel={sel} odds={live ? prices[i] : sel.odds} variant="field" size="lg" label={i === 0 ? first(ev.home.name) : i === 1 ? 'Draw' : first(ev.away.name)} />
              ))}
            </div>
            {ev.brief && !live && (
              <button
                onClick={() => setWhy((w) => !w)}
                aria-expanded={why}
                className="mt-3 flex h-11 w-full items-center gap-2 rounded-[16px] bg-black/30 px-4 text-[14px] font-semibold ring-1 ring-white/10 backdrop-blur-xl transition-colors hover:bg-black/45"
              >
                <Sparkles size={16} /> Why these odds?
                <span className="ml-auto text-[11.5px] font-medium text-white/55">Plain-English summary</span>
                <motion.span animate={{ rotate: why ? 180 : 0 }}>
                  <ChevronDown size={17} />
                </motion.span>
              </button>
            )}
          </motion.div>
        </div>

        <AnimatePresence initial={false}>
          {why && ev.brief && !live && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease }} className="overflow-hidden">
              <div className="mt-5 rounded-[24px] bg-black/35 p-5 ring-1 ring-white/10 backdrop-blur-xl @tab:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display text-[20px] font-[760] tracking-[-0.03em]">The short version</span>
                  <span className="text-[11.5px] font-semibold text-white/55">AI summary of fictional match data · not a tip</span>
                </div>
                <ul className="mt-4 grid gap-x-8 gap-y-3 @desk:grid-cols-2">
                  {ev.brief.map((b, i) => (
                    <motion.li key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07, ease }} className="flex gap-3 text-[14.5px] leading-snug text-white/90">
                      <span className="mt-[6px] size-2 shrink-0 rounded-full" style={{ background: i % 2 ? ac : hc, boxShadow: '0 0 0 2px rgba(255,255,255,.6)' }} />
                      {b}
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-3.5 text-[12.5px] text-white/60">
                  <span>Odds describe likelihood, not certainty.</span>
                  <Link to={`/event/${ev.id}?tab=stats`} className="font-semibold text-white hover:underline">
                    Full stats
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
