import clsx from 'clsx'
import { ArrowLeft, ChevronDown, Info, MapPin, Sparkles, Star } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { IMAGES, MATCH_STATS, briefFor, competitionById, eventById, teamColor, type Market, type SportEvent } from '../../data/catalog'
import { ruleFor } from '../../data/quotes'
import { dayLabel, kickoffTime, secondsUntil } from '../../lib/time'
import { useLiveClock, useLiveEvent, useStore } from '../../state/store'
import { Crest } from '../../ui/Crest'
import { OddsButton } from '../../ui/OddsButton'
import { Footer } from '../home/Home'
import { NotFound } from '../NotFound'
import { BuilderEditor } from './BuilderEditor'
import { MatchCentre } from './MatchCentre'
import { LiveBadge } from '../../ui/LiveBadge'
import { LiveStory, PreMatchStats } from './StatsViews'

const ease = [0.16, 1, 0.3, 1] as const
const POPULAR_IDS = ['RESULT_90', 'WINNER', 'TOTAL_2_5_90', 'PLAYER_SOT_90', 'BTTS_90']

function Countdown({ iso }: { iso: string }) {
  const { elapsed } = useLiveClock()
  const s = secondsUntil(iso, elapsed)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return <span className="tnum">{h ? `${h}h ${m}m` : `${m}:${String(s % 60).padStart(2, '0')}`}</span>
}

function Header({ ev }: { ev: SportEvent }) {
  const comp = competitionById(ev.competitionId)
  const { s, d } = useStore()
  const nav = useNavigate()
  const live = ev.status === 'live'
  const { minute } = useLiveEvent(ev)
  const fav = s.favourites.includes(ev.id)
  const hc = teamColor(ev.home)
  const ac = teamColor(ev.away)
  const L = ev.live

  return (
    <section className="on-dark relative isolate overflow-hidden bg-nav text-white @tab:rounded-[32px]">
      {ev.id === 'football-01' && <img src={IMAGES.heroNight} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover blur-[3px] saturate-[.85]" />}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(100deg, color-mix(in oklab, ${hc} 92%, #05070d) 0%, color-mix(in oklab, ${hc} 65%, transparent) 40%, transparent 60%, color-mix(in oklab, ${ac} 70%, transparent) 100%), linear-gradient(0deg, rgba(5,7,13,.7), rgba(5,7,13,.15))`,
        }}
      />

      <div className="mx-auto max-w-[1220px] px-4 pt-4 pb-6 @tab:px-8 @tab:pt-6 @tab:pb-8">
        <div className="flex items-center gap-2">
          <button onClick={() => nav(-1)} aria-label="Back" className="grid size-10 place-items-center rounded-full bg-white/[.14] backdrop-blur-md hover:bg-white/25">
            <ArrowLeft size={18} />
          </button>
          <Link to={`/sports/${ev.sport}?competition=${comp.id}`} className="rounded-full bg-white/[.14] px-3 py-2 text-[12.5px] font-semibold backdrop-blur-md hover:bg-white/25">
            {comp.name}
          </Link>
          <span className="hidden text-[13px] text-white/70 @tab:inline">{ev.stage}</span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => d({ type: 'favourite', eventId: ev.id })}
            aria-pressed={fav}
            aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
            className={clsx('ml-auto grid size-10 place-items-center rounded-full bg-white/[.14] backdrop-blur-md', fav && 'text-[#f5c04a]')}
          >
            <Star size={18} fill={fav ? 'currentColor' : 'none'} />
          </motion.button>
        </div>

        {live ? (
          <div className="mt-6">
            <MatchCentre ev={ev} />
          </div>
        ) : (
        <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3 @tab:mt-10 @tab:gap-6">
          {[ev.home, ev.away].map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: i ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease }}
              className={clsx('flex min-w-0 flex-col gap-3', i ? 'col-start-3 items-end text-right' : 'items-start')}
            >
              <Crest team={t} size={56} className="drop-shadow-[0_10px_20px_rgba(0,0,0,.45)]" />
              <span className="font-display text-[26px] leading-[.95] font-[800] tracking-[-0.045em] @tab:text-[44px] @desk:text-[52px]">{t.name}</span>
            </motion.div>
          ))}
          <div className="col-start-2 row-start-1 text-center">
            {ev.status === 'finished' && L ? (
              <>
                <div className="font-display text-[52px] leading-none font-[800] tracking-[-0.05em] tnum @tab:text-[72px]">
                  {L.score[0]}–{L.score[1]}
                </div>
                <div className="mt-2 text-[13px] font-semibold text-white/70">Full time</div>
              </>
            ) : live && L ? (
              <>
                <div className="font-display text-[52px] leading-none font-[800] tracking-[-0.05em] tnum @tab:text-[72px]">
                  {ev.sport === 'tennis' ? `${L.sets![0]}–${L.sets![1]}` : `${L.score[0]}–${L.score[1]}`}
                </div>
                <div className="mt-2 flex justify-center"><LiveBadge tone="solid" size="lg" clock={ev.sport === 'football' ? `${minute}'` : ev.sport === 'basketball' ? `${L.period} ${L.clock}` : L.period} /></div>
              </>
            ) : (
              <>
                <div className="font-display text-[34px] leading-none font-[800] tracking-[-0.05em] @tab:text-[48px]">{kickoffTime(ev.startsAt)}</div>
                <div className="mt-1.5 text-[12.5px] font-semibold text-white/70">
                  {dayLabel(ev.startsAt)}
                  {dayLabel(ev.startsAt) === 'Today' && (
                    <>
                      {' '}
                      · in <Countdown iso={ev.startsAt} />
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        )}
        {(ev.venue || live) && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[12.5px] text-white/65">
            {ev.venue && (
              <span className="flex items-center gap-1">
                <MapPin size={13} /> {ev.venue}
              </span>
            )}
            {live && <span>Live information can be delayed. Others may have more up-to-date information.</span>}
          </div>
        )}
      </div>
    </section>
  )
}

function MarketCard({ ev, m, prices, i }: { ev: SportEvent; m: Market; prices?: string[]; i: number }) {
  const [rule, setRule] = useState(false)
  const dark = false
  const closed = ev.status === 'finished' || (ev.status === 'live' && m.id !== 'RESULT_90' && m.id !== 'WINNER')
  const n = m.selections.length
  const cols = n === 3 ? 'grid-cols-3' : n === 2 ? 'grid-cols-2' : n === 1 ? 'grid-cols-1' : 'grid-cols-2 @tab:grid-cols-3'
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 6) * 0.04, duration: 0.5, ease }} className={clsx('rounded-[24px] p-5', dark ? 'bg-white/[.05] ring-1 ring-white/[.06]' : 'bg-surface')}>
      <div className="flex items-center gap-2">
        <h3 className="font-display text-[19px] font-[760] tracking-[-0.03em]">{m.name}</h3>
        <span className={clsx('rounded-full px-2.5 py-1 text-[11.5px] font-semibold', dark ? 'bg-white/10 text-white/70' : 'bg-chip text-secondary')}>{m.period}</span>
        <button onClick={() => setRule((r) => !r)} aria-expanded={rule} aria-label={`Rules for ${m.name}`} className={clsx('ml-auto grid size-9 place-items-center rounded-full', rule ? 'bg-sel text-sel-ink' : dark ? 'text-white/60 hover:bg-white/10' : 'text-secondary hover:bg-chip')}>
          <Info size={17} />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {rule && (
          <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={clsx('overflow-hidden text-[13px] leading-snug', dark ? 'text-white/65' : 'text-secondary')}>
            <span className="block pt-2">{ruleFor(m.id, ev.sport)}</span>
          </motion.p>
        )}
      </AnimatePresence>
      {closed ? (
        <div className={clsx('mt-3.5 flex items-center justify-between rounded-[16px] px-4 py-3.5 text-[13.5px] font-semibold', dark ? 'bg-white/[.06] text-white/60' : 'bg-chip text-secondary')}>
          {ev.status === 'finished' ? 'Market settled — see My Bets' : 'Pre-match market closed'}
          <span className="text-[12px] font-medium opacity-70">{ev.status === 'finished' ? 'Full time' : 'No live price'}</span>
        </div>
      ) : (
      <div className={clsx('mt-3.5 grid gap-2', cols)}>
        {m.selections.map((sel, k) => (
          <OddsButton key={sel.id} ev={ev} market={m} sel={sel} odds={prices?.[k] ?? sel.odds} label={m.id === 'RESULT_90' && sel.id !== 'DRAW' ? sel.label.split(' ')[0] : sel.label.replace('Daniel Costa — ', 'Costa ')} size="lg" variant={dark ? 'night' : 'light'} />
        ))}
      </div>
      )}
    </motion.section>
  )
}

function Brief({ ev }: { ev: SportEvent }) {
  const brief = briefFor(ev)
  if (!brief) return null
  return (
    <section className="rounded-[24px] bg-ink p-5 text-white @tab:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Sparkles size={17} className="text-brand-dark" />
        <h3 className="font-display text-[20px] font-[760] tracking-[-0.03em]">Why these odds?</h3>
        <span className="ml-auto text-[11.5px] font-medium text-white/50">AI summary of fictional match data · not a tip</span>
      </div>
      <ul className="mt-4 grid gap-x-8 gap-y-3 @desk:grid-cols-2">
        {brief.map((b, i) => (
          <li key={i} className="flex gap-3 text-[14.5px] leading-snug text-white/85">
            <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-brand-dark" />
            {b}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Markets({ ev }: { ev: SportEvent }) {
  const { prices } = useLiveEvent(ev)
  const [more, setMore] = useState(false)
  const popular = ev.markets.filter((m) => POPULAR_IDS.includes(m.id))
  const rest = ev.markets.filter((m) => !POPULAR_IDS.includes(m.id))
  return (
    <div className="space-y-3">
      {ev.status === 'scheduled' && <Brief ev={ev} />}
      {popular.map((m, i) => (
        <MarketCard key={m.id} ev={ev} m={m} i={i} prices={i === 0 && ev.status === 'live' ? prices : undefined} />
      ))}
      {ev.status === 'live' && (
        <div className="pt-5">
          <LiveStory ev={ev} />
        </div>
      )}
      {rest.length > 0 && (
        <>
          <button onClick={() => setMore((x) => !x)} aria-expanded={more} className="flex w-full items-center justify-between rounded-[24px] bg-surface px-5 py-4 text-left">
            <span>
              <span className="block font-display text-[18px] font-[740] tracking-[-0.03em]">{more ? 'Fewer markets' : `${rest.length} more markets`}</span>
              <span className="block text-[13px] text-secondary">{rest.map((m) => m.name).join(' · ')}</span>
            </span>
            <motion.span animate={{ rotate: more ? 180 : 0 }} className="grid size-9 place-items-center rounded-full bg-chip">
              <ChevronDown size={18} />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {more && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }} className="space-y-3 overflow-hidden">
                {rest.map((m, i) => (
                  <MarketCard key={m.id} ev={ev} m={m} i={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

export function EventPage() {
  const { eventId } = useParams()
  const [q, setQ] = useSearchParams()
  const ev = eventId ? eventById(eventId) : undefined
  if (!ev) return <NotFound what="match" />
  const tabs = [
    { id: 'markets', label: ev.status === 'live' ? 'Live markets' : 'Markets' },
    ...(ev.builder && ev.status !== 'live' ? [{ id: 'builder', label: 'Bet Builder' }] : []),
    ...(MATCH_STATS[ev.id] ? [{ id: 'stats', label: 'Stats' }] : []),
  ]
  const tab = tabs.find((t) => t.id === q.get('tab'))?.id ?? 'markets'


  return (
    <div>
      <div className="@tab:px-8 @tab:pt-6">
        <div className="mx-auto max-w-[1600px]">
          <Header ev={ev} />
        </div>
      </div>
      <div className="mx-auto max-w-[1220px] px-4 @tab:px-8">
        <div role="tablist" aria-label="Match sections" className={clsx('sticky top-0 z-10 -mx-4 flex gap-1 px-4 py-3 backdrop-blur-xl @tab:mx-0 @tab:px-0', 'bg-canvas/95')}>
          {tabs.map((t) => (
            <button
              type="button"
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setQ(t.id === 'markets' ? {} : { tab: t.id }, { replace: true })}
              className={clsx('relative h-10 rounded-full px-4 text-[14px] font-semibold transition-colors', tab === t.id ? 'text-white' : 'text-secondary hover:text-ink')}
            >
              {tab === t.id && <motion.span layoutId="event-tab" className={clsx('absolute inset-0 -z-10 rounded-full', 'bg-ink')} transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
        <div className="pt-2">
          {tab === 'markets' && <Markets ev={ev} />}
          {tab === 'builder' && <BuilderEditor ev={ev} explain={q.get('explain') === '1'} />}
          {tab === 'stats' && <PreMatchStats ev={ev} brief={<Brief ev={ev} />} />}
        </div>
        <Footer />
      </div>
    </div>
  )
}
