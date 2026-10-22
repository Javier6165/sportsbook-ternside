import { shortName } from '../../data/catalog'
import clsx from 'clsx'
import { Score } from '../../ui/Score'
import { ArrowLeft, ChevronDown, Info, MapPin, Search, Star } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { lazy, Suspense, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { IMAGES, MARKET_GROUPS, MATCH_STATS, competitionById, eventById, teamColor, type Market, type SportEvent } from '../../data/catalog'
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
import { MatchContext } from '../../ui/MatchContext'
import { LiveStory, PreMatchStats } from './StatsViews'

const Kits3D = lazy(() => import('../../ui/Kit3D'))

const ease = [0.16, 1, 0.3, 1] as const
const POPULAR_IDS = ['RESULT_90', 'WINNER', 'TOTAL_2_5_90', 'PLAYER_SOT_90', 'BTTS_90', 'SET_BETTING', 'HANDICAP', 'LIVE_NEXT_GOAL', 'LIVE_TOTAL', 'LIVE_SET']

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

        {!live && ev.home.crest && ev.away.crest && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-[33%] top-[6%] h-[52%] -z-[5] hidden @tab:block">
            <Suspense fallback={null}>
              <Kits3D home={ev.home} away={ev.away} kind={ev.sport === 'basketball' ? 'vest' : 'shirt'} />
            </Suspense>
          </div>
        )}
        {live ? (
          <div className="mt-6">
            <MatchCentre ev={ev} />
          </div>
        ) : (
        <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-end gap-3 @tab:mt-24 @tab:gap-6">
          {[ev.home, ev.away].map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: i ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease }}
              className={clsx('flex min-w-0 flex-col gap-3', i ? 'col-start-3 items-end text-right' : 'items-start')}
            >
              <Crest team={t} size={56} className="drop-shadow-[0_10px_20px_rgba(0,0,0,.45)]" />
              <span className="max-w-full truncate font-display text-[19px] leading-[1.05] font-[800] tracking-[-0.04em] @tab:text-[44px] @desk:text-[52px]">
                <span className="@tab:hidden">{shortName(t.name)}</span>
                <span className="hidden @tab:inline">{t.name}</span>
              </span>
            </motion.div>
          ))}
          <div className="col-start-2 row-start-1 text-center">
            {ev.status === 'finished' && L ? (
              <>
                <div className="font-display text-[52px] leading-none font-[800] tracking-[-0.03em] tnum @tab:text-[72px]">
                  <Score a={L.score[0]} b={L.score[1]} />
                </div>
                <div className="mt-2 text-[13px] font-semibold text-white/70">{L.period}</div>
              </>
            ) : live && L ? (
              <>
                <div className="font-display text-[52px] leading-none font-[800] tracking-[-0.03em] tnum @tab:text-[72px]">
                  {ev.sport === 'tennis' ? <Score a={L.sets![0]} b={L.sets![1]} /> : <Score a={L.score[0]} b={L.score[1]} />}
                </div>
                <div className="mt-2 flex justify-center"><LiveBadge tone="solid" size="lg" clock={ev.sport === 'football' ? `${minute}'` : ev.sport === 'basketball' ? `${L.period} ${L.clock}` : L.period} /></div>
              </>
            ) : (
              <div className="rounded-[18px] bg-black/30 px-3 py-2.5 ring-1 ring-white/10 backdrop-blur-xl @tab:rounded-[22px] @tab:px-6 @tab:py-4">
                <div className="font-display text-[26px] leading-none font-[800] tracking-[-0.05em] @tab:text-[48px]">{kickoffTime(ev.startsAt)}</div>
                <div className="mt-1.5 text-[12.5px] font-semibold text-white/70">
                  {dayLabel(ev.startsAt)}
                  {dayLabel(ev.startsAt) === 'Today' && (
                    <>
                      {' '}
                      · in <Countdown iso={ev.startsAt} />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        )}
        {(ev.venue || live) && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[12.5px] text-white/65">
            {ev.venue && (
              <span className={clsx('flex items-center gap-1', !live && ev.home.crest && '@tab:hidden')}>
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
  const closed = ev.status === 'finished' || (ev.status === 'live' && m.id !== 'RESULT_90' && m.id !== 'WINNER' && !m.id.startsWith('LIVE_'))
  const n = m.selections.length
  const cols = n === 3 ? 'grid-cols-3' : n === 2 ? 'grid-cols-2' : n === 1 ? 'grid-cols-1' : n === 4 ? 'grid-cols-2 @tab:grid-cols-4' : 'grid-cols-2 @tab:grid-cols-3'
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 6) * 0.04, duration: 0.5, ease }} className={clsx('rounded-[24px] p-5', dark ? 'bg-white/[.05] ring-1 ring-white/[.06]' : 'bg-surface')}>
      <div className="flex items-start gap-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1.5">
        <h3 className="font-display text-[19px] font-[760] tracking-[-0.03em]">{m.name}</h3>
        <span className={clsx('rounded-full px-2.5 py-1 text-[11.5px] font-semibold whitespace-nowrap', dark ? 'bg-white/10 text-white/70' : 'bg-chip text-secondary')}>{m.period}</span>
        {m.id === 'RESULT_90' && ev.sport === 'football' && ev.status === 'scheduled' && (
          <Link to="/promotions" className="rounded-full bg-won px-2.5 py-1 text-[11.5px] font-semibold whitespace-nowrap text-won-ink">2 Goals Ahead applies</Link>
        )}
        </div>
        <button onClick={() => setRule((r) => !r)} aria-expanded={rule} aria-label={`Rules for ${m.name}`} className={clsx('-mt-1 ml-auto grid size-9 shrink-0 place-items-center rounded-full', rule ? 'bg-sel text-sel-ink' : dark ? 'text-white/60 hover:bg-white/10' : 'text-secondary hover:bg-chip')}>
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
          {ev.status === 'finished' ? 'Market closed — see My Bets for settled bets' : 'Pre-match market closed'}
          <span className="text-[12px] font-medium opacity-70">{ev.status === 'finished' ? ev.live?.period : 'No live price'}</span>
        </div>
      ) : (
      <div className={clsx('mt-3.5 grid gap-2', cols)}>
        {m.selections.map((sel, k) => (
          <OddsButton key={sel.id} ev={ev} market={m} sel={sel} odds={prices?.[k] ?? sel.odds} label={m.id === 'RESULT_90' && sel.id !== 'DRAW' ? shortName(sel.label) : sel.label.replace('Daniel Costa — ', 'Costa ')} size="lg" variant={dark ? 'night' : 'light'} />
        ))}
      </div>
      )}
    </motion.section>
  )
}

function Brief({ ev }: { ev: SportEvent }) {
  return <MatchContext ev={ev} />
}

/** In play (or after), Stats leads with the live picture; pre-match context stays available, clearly dated. */
function LiveStats({ ev }: { ev: SportEvent }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="space-y-4">
      {ev.status === 'live' ? <LiveStory ev={ev} /> : <p className="rounded-[22px] bg-surface p-5 text-[14px] text-secondary">The match has ended. Final stats are confirmed with the official result.</p>}
      {MATCH_STATS[ev.id] && (
        <div className="rounded-[22px] bg-surface">
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between px-5 py-4 text-left">
            <span>
              <span className="block font-display text-[17px] font-[740] tracking-[-0.03em]">Before kick-off</span>
              <span className="block text-[12.5px] text-secondary">Context and prices as they were at {kickoffTime(ev.startsAt)} — not current</span>
            </span>
            <motion.span animate={{ rotate: open ? 180 : 0 }}>
              <ChevronDown size={18} />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-3 pb-3">
                <PreMatchStats ev={ev} brief={<Brief ev={ev} />} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

function Markets({ ev }: { ev: SportEvent }) {
  const { prices } = useLiveEvent(ev)
  const [group, setGroup] = useState('popular')
  const [find, setFind] = useState('')
  const popular = ev.markets.filter((m) => POPULAR_IDS.includes(m.id))
  // Categories only appear when they have markets; Popular stays the default view.
  const groups = [{ id: 'popular', label: 'Popular', list: popular }, ...MARKET_GROUPS.map((g) => ({ id: g.id, label: g.label, list: ev.markets.filter((m) => g.ids.includes(m.id)) })).filter((g) => g.list.length), { id: 'all', label: `All · ${ev.markets.length}`, list: ev.markets }]
  const q = find.trim().toLowerCase()
  const list = q ? ev.markets.filter((m) => m.name.toLowerCase().includes(q) || m.selections.some((x) => x.label.toLowerCase().includes(q))) : (groups.find((g) => g.id === group) ?? groups[0]).list
  const showGroups = ev.markets.length > popular.length
  return (
    <div className="space-y-3">
      {ev.status === 'scheduled' && <Brief ev={ev} />}
      {showGroups && (
        <div className="flex flex-col gap-2 @tab:flex-row @tab:items-center">
          <div role="tablist" aria-label="Market groups" className="no-scrollbar -mx-4 flex min-w-0 flex-1 gap-2 overflow-x-auto px-4 @tab:mx-0 @tab:px-0">
            {groups.map((g) => (
              <button
                key={g.id}
                role="tab"
                aria-selected={!q && group === g.id}
                onClick={() => (setGroup(g.id), setFind(''))}
                className={clsx('h-9 shrink-0 rounded-full px-3.5 text-[13.5px] font-semibold transition-colors', !q && group === g.id ? 'bg-ink text-white' : 'bg-surface text-ink hover:bg-chip')}
              >
                {g.label}
              </button>
            ))}
          </div>
          <label className="flex h-10 items-center gap-2 rounded-full bg-surface px-3.5 text-[13.5px] focus-within:shadow-[0_0_0_2px_var(--color-action)] @tab:w-[220px]">
            <Search size={15} className="text-secondary" />
            <input value={find} onChange={(e) => setFind(e.target.value)} placeholder="Find a market" aria-label="Find a market in this match" className="w-full min-w-0 bg-transparent outline-none placeholder:text-muted" />
          </label>
        </div>
      )}
      {list.map((m, i) => (
        <MarketCard key={(q || group) + m.id} ev={ev} m={m} i={i} prices={m.id === ev.markets[0].id && ev.status === 'live' ? prices : undefined} />
      ))}
      {q && list.length === 0 && <p className="rounded-[24px] bg-surface px-5 py-6 text-center text-[14px] text-secondary">No market matches “{find}”.</p>}
      {ev.status === 'live' && !q && group === 'popular' && (
        <div className="pt-5">
          <LiveStory ev={ev} />
        </div>
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
        <div className="mx-auto max-w-[1156px]">
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
          {tab === 'stats' && (ev.status === 'scheduled' ? <PreMatchStats ev={ev} brief={<Brief ev={ev} />} /> : <LiveStats ev={ev} />)}
        </div>
        <Footer />
      </div>
    </div>
  )
}
