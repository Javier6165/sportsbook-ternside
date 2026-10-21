import { ArrowRight, Info, Plus, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { BUILDER_SHOWCASE, competitionById, eventById } from '../../data/catalog'
import { secondsUntil, kickoffTime, longDate } from '../../lib/time'
import { useLiveClock, useStore } from '../../state/store'
import { Crest } from '../../ui/Crest'
import { OddsButton } from '../../ui/OddsButton'
import { useFly } from '../../ui/fly'

const ease = [0.16, 1, 0.3, 1] as const

function Countdown({ iso }: { iso: string }) {
  const { elapsed } = useLiveClock()
  const s = secondsUntil(iso, elapsed)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const parts = h > 0 ? [h, m, sec] : [m, sec]
  return (
    <div className="flex items-center gap-1.5" role="timer" aria-label={`Kick-off in ${m} minutes`}>
      {parts.map((v, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="grid h-9 min-w-9 place-items-center rounded-md bg-white/[.08] px-1.5 text-[17px] font-semibold text-white tnum ring-1 ring-white/10 ring-inset">
            {String(v).padStart(2, '0')}
          </span>
          {i < parts.length - 1 && <span className="text-white/40">:</span>}
        </span>
      ))}
    </div>
  )
}

function FormDots({ form }: { form: string }) {
  return (
    <span className="flex gap-1" aria-label={`Last five: ${form.split('').join(', ')}`}>
      {form.split('').map((r, i) => (
        <span
          key={i}
          className={
            'grid size-[18px] place-items-center rounded-[5px] text-[10px] font-bold ' +
            (r === 'W' ? 'bg-[#2fbf71]/90 text-white' : r === 'D' ? 'bg-white/20 text-white' : 'bg-[#ff5a6e]/85 text-white')
          }
        >
          {r}
        </span>
      ))}
    </span>
  )
}

function PitchArt() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="pg" cx="50%" cy="110%" r="80%">
          <stop offset="0" stopColor="#2948FF" stopOpacity=".55" />
          <stop offset=".55" stopColor="#1a2a6b" stopOpacity=".25" />
          <stop offset="1" stopColor="#10182B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#86A8FF" stopOpacity="0" />
          <stop offset="1" stopColor="#86A8FF" stopOpacity=".35" />
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill="url(#pg)" />
      {/* perspective pitch */}
      <g stroke="url(#pl)" strokeWidth="1.2" fill="none" opacity=".55">
        <path d="M120 400 L300 210 L500 210 L680 400" />
        <path d="M400 210 L400 400" />
        <ellipse cx="400" cy="300" rx="95" ry="34" />
        <path d="M250 262 L550 262" />
        <path d="M330 210 L318 232 L482 232 L470 210" />
      </g>
    </svg>
  )
}

export function Hero() {
  const ev = eventById(BUILDER_SHOWCASE.eventId)!
  const comp = competitionById(ev.competitionId)
  const { d, s } = useStore()
  const fly = useFly()
  const result = ev.markets[0]
  const inSlip = s.groups.some((g) => g.type === 'builder' && g.eventId === ev.id && g.legs.length === 3)

  const addBuilder = (el: HTMLElement) => {
    if (!inSlip) fly(el, BUILDER_SHOWCASE.odds)
    const legs = BUILDER_SHOWCASE.conditions.map((c) => {
      const m = ev.markets.find((mk) => mk.selections.some((x) => x.id === c.id))!
      const sel = m.selections.find((x) => x.id === c.id)!
      return { marketId: m.id, marketName: m.name, selectionId: c.id, label: c.label, odds: sel.odds, period: m.period }
    })
    d({ type: 'addBuilder', eventId: ev.id, legs, odds: BUILDER_SHOWCASE.odds })
  }

  return (
    <section aria-labelledby="featured-title" className="@container/hero relative isolate overflow-hidden rounded-[22px] bg-nav text-white shadow-[0_30px_60px_-30px_rgba(16,24,43,.6)] grain">
      <PitchArt />
      <div className="beam left-[6%]" style={{ ['--r' as string]: '-14deg', ['--o' as string]: 0.32 }} />
      <div className="beam right-[4%] hidden @2xl/hero:block" style={{ ['--r' as string]: '16deg', ['--o' as string]: 0.26, animationDelay: '-4s' }} />
      {/* image slot for Astra: matchday key art. Kept empty until assets land. */}
      <div data-asset-slot="hero-matchday" className="pointer-events-none absolute inset-0 -z-10" />

      <div className="relative grid gap-6 p-5 @2xl/hero:grid-cols-[minmax(0,1fr)_320px] @2xl/hero:gap-7 @2xl/hero:p-7 @4xl/hero:grid-cols-[minmax(0,1fr)_350px]">
        {/* ——— Match ——— */}
        <div className="flex min-w-0 flex-col">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] font-medium text-white/70"
          >
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold tracking-[.08em] text-brand-dark uppercase">
              Featured · {comp.name}
            </span>
            <span>{ev.stage}</span>
          </motion.div>

          <h2 id="featured-title" className="mt-5 flex flex-col gap-1">
            {[ev.home, ev.away].map((team, i) => (
              <motion.span
                key={team.id}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease }}
                className="flex items-center gap-3.5"
              >
                <Crest team={team} size={40} className="shrink-0 drop-shadow-[0_6px_14px_rgba(0,0,0,.45)]" />
                <span className="display min-w-0 text-[clamp(32px,9cqi,64px)] leading-[.92] tracking-[-.01em] text-balance uppercase @2xl/hero:text-[clamp(32px,5.7cqi,64px)]">
                  {team.name}
                </span>
                
              </motion.span>
            ))}
            <span className="sr-only">versus</span>
          </h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3"
          >
            <div>
              <div className="text-[11px] font-semibold tracking-[.08em] text-white/50 uppercase">Kick-off in</div>
              <div className="mt-1.5"><Countdown iso={ev.startsAt} /></div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-[13px] leading-snug text-white/70">
              <div className="font-semibold text-white">{longDate(ev.startsAt)} · {kickoffTime(ev.startsAt)}</div>
              <div>{ev.venue}</div>
            </div>
            {ev.form && (
              <>
                <div className="hidden h-10 w-px bg-white/10 @lg/hero:block" />
                <div className="hidden space-y-1.5 @lg/hero:block">
                  {ev.form.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] font-semibold text-white/50">
                      <span className="w-7">{i === 0 ? ev.home.short : ev.away.short}</span>
                      <FormDots form={f} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7, ease }}
            className="mt-auto pt-6"
          >
            <div className="mb-2 flex items-baseline justify-between text-[12px] text-white/55">
              <span className="font-semibold text-white/80">Match result</span>
              <span>90 min + stoppage</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {result.selections.map((sel, i) => (
                <OddsButton
                  key={sel.id}
                  ev={ev}
                  market={result}
                  sel={sel}
                  odds={sel.odds}
                  variant="hero"
                  label={i === 0 ? ev.home.name.split(' ')[0] : i === 1 ? 'Draw' : ev.away.name.split(' ')[0]}
                />
              ))}
            </div>
            <Link
              to={`/event/${ev.id}`}
              className="on-dark mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-dark hover:text-white"
            >
              All markets & Bet Builder <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>

        {/* ——— Bet Builder ticket ——— */}
        <motion.div
          initial={{ opacity: 0, y: 24, rotate: 1.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease }}
          className="relative self-end"
        >
          <div className="absolute -inset-px rounded-[18px] bg-gradient-to-b from-white/25 via-white/5 to-brand-dark/30" aria-hidden="true" />
          <div className="relative rounded-[18px] bg-[#131d36]/85 p-4 backdrop-blur-xl @2xl/hero:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg bg-action/90 text-white shadow-[0_6px_16px_-6px_rgba(41,72,255,1)]">
                  <Sparkles size={15} />
                </span>
                <div>
                  <div className="display text-[20px] leading-none uppercase">Bet Builder</div>
                  <div className="mt-0.5 text-[11.5px] text-white/55">Three conditions · one price</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10.5px] font-semibold tracking-[.08em] text-white/50 uppercase">Joint odds</div>
                <div className="text-[26px] leading-none font-semibold tnum">{BUILDER_SHOWCASE.odds}</div>
              </div>
            </div>

            <ol className="relative mt-4 space-y-0">
              {BUILDER_SHOWCASE.conditions.map((c, i) => (
                <motion.li
                  key={c.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.12, duration: 0.6, ease }}
                  className="relative flex gap-3 pb-3.5 last:pb-0"
                >
                  {i < 2 && <span className="absolute top-4 bottom-0 left-[7px] w-px bg-gradient-to-b from-brand-dark/70 to-brand-dark/20" aria-hidden="true" />}
                  <span className="relative mt-[3px] size-[15px] shrink-0 rounded-full border-2 border-brand-dark bg-nav" aria-hidden="true">
                    <span className="absolute inset-[3px] rounded-full bg-brand-dark/70" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] leading-tight font-semibold">{c.label}</span>
                    <span className="mt-0.5 block text-[12px] text-white/55">
                      {c.market} · {c.period}
                    </span>
                  </span>
                </motion.li>
              ))}
            </ol>

            <div className="mt-4 hidden rounded-xl bg-white/[.05] p-3 text-[12.5px] @md/hero:block leading-snug text-white/70 ring-1 ring-white/[.07] ring-inset">
              <span className="font-semibold text-white">If Costa doesn’t play,</span> that condition is void and the bet stays on at the archived price for the other two.
            </div>

            <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={(e) => addBuilder(e.currentTarget)}
                className="on-dark sheen inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-action px-4 text-[14px] font-semibold text-white shadow-[0_10px_30px_-10px_rgba(41,72,255,1)] hover:bg-action-hover"
              >
                <Plus size={16} strokeWidth={2.5} />
                {inSlip ? 'In betslip' : 'Add to betslip'}
              </motion.button>
              <Link
                to={`/event/${ev.id}?tab=builder&explain=1`}
                className="on-dark inline-flex h-11 items-center gap-1.5 rounded-[10px] border border-white/15 px-3.5 text-[13px] font-semibold text-white/85 hover:bg-white/10"
              >
                <Info size={15} /> Explain
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
