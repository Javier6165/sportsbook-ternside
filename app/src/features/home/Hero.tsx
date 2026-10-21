import { ArrowUpRight, ChevronDown, Sparkles, Star } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { competitionById, type SportEvent } from '../../data/catalog'
import type { Reason } from '../../lib/feed'
import { dayLabel, kickoffTime, secondsUntil } from '../../lib/time'
import { useLiveClock } from '../../state/store'
import { BuilderPass } from '../../ui/BuilderPass'
import { MatchField } from '../../ui/MatchField'
import { OddsButton } from '../../ui/OddsButton'

const ease = [0.16, 1, 0.3, 1] as const
const first = (n: string) => n.split(' ')[0]

function Countdown({ iso }: { iso: string }) {
  const { elapsed } = useLiveClock()
  const s = secondsUntil(iso, elapsed)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const txt = (h ? `${h}:${String(m).padStart(2, '0')}` : String(m).padStart(2, '0')) + ':' + String(sec).padStart(2, '0')
  return (
    <span className="tnum" role="timer" aria-label={`Kick-off in ${h ? h + ' hours ' : ''}${m} minutes`}>
      {txt}
    </span>
  )
}

function Form({ form }: { form: string }) {
  return (
    <span className="flex gap-[3px]" aria-label={`Last five: ${form.split('').join(', ')}`}>
      {form.split('').map((r, i) => (
        <span key={i} className={'size-2 rounded-full ' + (r === 'W' ? 'bg-white' : r === 'D' ? 'bg-white/45' : 'bg-white/15 ring-1 ring-white/45 ring-inset')} />
      ))}
    </span>
  )
}

export function Hero({ ev, reason }: { ev: SportEvent; reason: Reason | null }) {
  const comp = competitionById(ev.competitionId)
  const result = ev.markets[0]
  const [why, setWhy] = useState(false)
  return (
    <section aria-labelledby="featured-title" className="grid gap-4 @desk:grid-cols-[minmax(0,1fr)_392px] @desk:gap-5">
      <MatchField ev={ev} className="on-dark flex min-h-[440px] flex-col rounded-[32px] p-5 text-white @container/hero @tab:p-8 @desk:min-h-[520px]">
        {/* Asset slot for Astra: matchday key art blended under the colour field */}
        <div data-asset-slot="hero-matchday" className="pointer-events-none absolute inset-0 -z-20" />


        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/[.16] px-3 py-1.5 text-[12.5px] font-semibold backdrop-blur-md">{comp.name}</span>
          <span className="text-[13px] font-medium text-white/75">{ev.stage}</span>
          {reason && (
            <span className="flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1.5 text-[12px] font-semibold text-white/90 backdrop-blur-md @tab:ml-auto">
              <Star size={13} fill="currentColor" /> {reason.text}
            </span>
          )}
        </motion.div>

        <h1 id="featured-title" className="mt-7 font-display leading-[.88] font-[800] tracking-[-0.055em] @tab:mt-10">
          <motion.span initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08, ease }} className="block text-[clamp(50px,16cqi,104px)]">
            {first(ev.home.name)}
          </motion.span>
          <motion.span initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.18, ease }} className="block text-[clamp(50px,16cqi,104px)]">
            <span className="text-white/45">v </span>
            {first(ev.away.name)}
          </motion.span>
          <span className="sr-only">
            {' '}
            {ev.home.name} versus {ev.away.name}
          </span>
        </h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] font-semibold text-white/90 @tab:text-[17px]">
          <span>
            {dayLabel(ev.startsAt)} {kickoffTime(ev.startsAt)} · Kick-off in <Countdown iso={ev.startsAt} />
          </span>
          {ev.form && (
            <span className="hidden items-center gap-3 text-[12px] font-semibold text-white/60 @tab:flex">
              <span className="flex items-center gap-1.5">
                {ev.home.short} <Form form={ev.form[0]} />
              </span>
              <span className="flex items-center gap-1.5">
                {ev.away.short} <Form form={ev.form[1]} />
              </span>
            </span>
          )}
        </motion.div>

        {ev.brief && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="mt-5">
            <button
              onClick={() => setWhy((w) => !w)}
              aria-expanded={why}
              className="flex h-10 items-center gap-2 rounded-full bg-white/[.14] pr-3 pl-3.5 text-[13.5px] font-semibold backdrop-blur-md transition-colors hover:bg-white/[.22]"
            >
              <Sparkles size={15} /> Why these odds?
              <motion.span animate={{ rotate: why ? 180 : 0 }}>
                <ChevronDown size={16} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {why && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden">
                  <div className="mt-3 max-w-[620px] rounded-[22px] bg-black/25 p-4 ring-1 ring-white/10 backdrop-blur-xl @tab:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-display text-[18px] font-[760] tracking-[-0.03em]">The short version</span>
                      <span className="text-[11px] font-semibold text-white/55">AI summary of fictional match data · not a tip</span>
                    </div>
                    <ul className="mt-3 space-y-2.5">
                      {ev.brief.map((b, i) => (
                        <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08, ease }} className="flex gap-2.5 text-[14px] leading-snug text-white/90">
                          <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-white/70" />
                          {b}
                        </motion.li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-[12px] text-white/55">
                      <span>Odds describe likelihood, not certainty.</span>
                      <Link to={`/event/${ev.id}?tab=stats`} className="font-semibold text-white hover:underline">
                        Full stats
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7, ease }} className="mt-auto pt-8">
          <div className="mb-2.5 flex items-baseline justify-between text-[12.5px] font-medium text-white/70">
            <span>Match result · {result.period}</span>
            <Link to={`/event/${ev.id}`} className="flex items-center gap-1 font-semibold text-white hover:underline">
              All markets <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2 @tab:gap-2.5">
            {result.selections.map((sel, i) => (
              <OddsButton key={sel.id} ev={ev} market={result} sel={sel} odds={sel.odds} variant="field" size="lg" label={i === 0 ? first(ev.home.name) : i === 1 ? 'Draw' : first(ev.away.name)} />
            ))}
          </div>
        </motion.div>
      </MatchField>

      {ev.builder && <BuilderPass />}
    </section>
  )
}
