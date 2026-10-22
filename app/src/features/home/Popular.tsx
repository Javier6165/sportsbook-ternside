import clsx from 'clsx'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { COMPETITIONS, EVENTS, EVENT_NOW, SPORTS, eventById, shortName, type SportEvent, type SportId } from '../../data/catalog'
import { useLiveEvent, useStore } from '../../state/store'
import { CompetitionMark } from '../../ui/CompetitionMark'
import { Crest } from '../../ui/Crest'
import { LiveBadge } from '../../ui/LiveBadge'
import { OddsButton } from '../../ui/OddsButton'
import { SportIcon } from '../../ui/SportIcon'
import { Hero } from './Hero'
import { HeroCarousel, type Slide } from './HeroCarousel'
import { CompactRow } from './Picks'
import { OffersRow } from './OffersRow'

const ease = [0.16, 1, 0.3, 1] as const

export function SectionTitle({ id, children, aside }: { id: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-3">
      <motion.h2
        initial={{ opacity: 0, y: 22, clipPath: 'inset(0 0 100% 0)' }}
        whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 -20% 0)' }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease }}
        id={id}
        className="font-display text-[30px] leading-none font-[780] tracking-[-0.045em] @tab:text-[40px]"
      >
        {children}
      </motion.h2>
      {aside}
    </div>
  )
}

const byPopularity = (a: SportEvent, b: SportEvent) => Number(!!b.popular) - Number(!!a.popular) || a.startsAt.localeCompare(b.startsAt)

/** Compact in-play scoreboard: one line per match, score and main prices. */
export function ScoreRow({ ev }: { ev: SportEvent }) {
  const { prices, minute } = useLiveEvent(ev)
  const L = ev.live!
  const m = ev.markets[0]
  const score = ev.sport === 'tennis' ? L.sets! : L.score
  const clock = ev.sport === 'football' ? `${minute}'` : ev.sport === 'basketball' ? `${L.period} ${L.clock}` : L.period
  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2.5 border-t border-line py-3.5 first:border-t-0 @tab:grid-cols-[96px_1fr_auto]">
      <span className="@tab:order-none">
        <LiveBadge clock={clock} />
      </span>
      <Link to={`/event/${ev.id}`} className="col-span-2 grid min-w-0 grid-cols-[1fr_auto] gap-x-3 text-[14.5px] font-semibold hover:text-sel-ink @tab:col-span-1">
        <span className="flex min-w-0 items-center gap-2 truncate">
          <SportIcon sport={ev.sport} size={13} className="shrink-0 text-secondary" />
          <span className="truncate">{ev.home.name}</span>
        </span>
        <span className="text-right font-display font-[780] tnum">{score[0]}</span>
        <span className="truncate pl-[21px] text-secondary">{ev.away.name}</span>
        <span className="text-right font-display font-[780] text-secondary tnum">{score[1]}</span>
      </Link>
      <div className={clsx('col-span-2 grid gap-1.5 @tab:col-span-1 @tab:w-[228px]', m.selections.length === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
        {m.selections.map((sel, i) => (
          <OddsButton key={sel.id} ev={ev} market={m} sel={sel} odds={prices[i]} className="!min-h-10 !rounded-[12px]" />
        ))}
      </div>
    </li>
  )
}

function TopCompetitions() {
  const comps = COMPETITIONS.slice(0, 8)
  return (
    <section aria-labelledby="topcomp-title" className="mt-12">
      <SectionTitle id="topcomp-title">Top competitions</SectionTitle>
      <div className="no-scrollbar -mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 @tab:mx-0 @tab:grid @tab:grid-cols-4 @tab:px-0">
        {comps.map((c, i) => {
          const evs = EVENTS.filter((e) => e.competitionId === c.id)
          const live = evs.filter((e) => e.status === 'live').length
          return (
            <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.5, ease }} className="w-[200px] shrink-0 snap-start @tab:w-auto">
              <Link to={`/sports/${c.sport}?competition=${c.id}`} className="group flex h-full items-center gap-3 rounded-[20px] bg-surface p-4 transition-colors hover:bg-white">
                <CompetitionMark id={c.id} sport={c.sport} size={36} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14.5px] font-semibold group-hover:text-sel-ink">{c.name}</span>
                  <span className="block text-[12.5px] text-secondary">
                    {evs.length} {evs.length === 1 ? 'match' : 'matches'}
                    {live > 0 && <span className="text-live"> · {live} live</span>}
                  </span>
                </span>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

function BigMatches() {
  const [sport, setSport] = useState<SportId>('football')
  const list = EVENTS.filter((e) => e.sport === sport && e.status === 'scheduled').sort(byPopularity).slice(0, 6)
  return (
    <section aria-labelledby="big-title" className="mt-14">
      <SectionTitle
        id="big-title"
        aside={
          <div role="tablist" aria-label="Sport" className="hidden rounded-full bg-chip p-1 @tab:inline-flex">
            {SPORTS.map((sp) => (
              <button key={sp.id} role="tab" aria-selected={sport === sp.id} onClick={() => setSport(sp.id)} className={clsx('relative z-10 flex h-9 items-center gap-1.5 rounded-full px-4 text-[13.5px] font-semibold', sport === sp.id ? 'text-ink' : 'text-secondary hover:text-ink')}>
                {sport === sp.id && <motion.span layoutId="big-tab" className="absolute inset-0 -z-10 rounded-full bg-surface shadow-[0_1px_3px_rgba(16,24,43,.14)]" />}
                <SportIcon sport={sp.id} size={14} /> {sp.name}
              </button>
            ))}
          </div>
        }
      >
        Today’s big matches
      </SectionTitle>
      <div role="tablist" aria-label="Sport" className="no-scrollbar -mt-2 mb-4 flex gap-2 overflow-x-auto @tab:hidden">
        {SPORTS.map((sp) => (
          <button key={sp.id} role="tab" aria-selected={sport === sp.id} onClick={() => setSport(sp.id)} className={clsx('flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] font-semibold', sport === sp.id ? 'bg-ink text-white' : 'bg-surface text-ink')}>
            <SportIcon sport={sp.id} size={14} /> {sp.name}
          </button>
        ))}
      </div>
      <motion.ul key={sport} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[24px] bg-surface px-5 py-1">
        {list.map((ev) => (
          <CompactRow key={ev.id} ev={ev} />
        ))}
      </motion.ul>
      <Link to={`/sports/${sport}`} className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-sel-ink hover:underline">
        All {SPORTS.find((x) => x.id === sport)!.name.toLowerCase()} <ArrowRight size={15} />
      </Link>
    </section>
  )
}

function InPlay() {
  const live = EVENTS.filter((e) => e.status === 'live')
  return (
    <section aria-labelledby="inplay-title" className="mt-14">
      <SectionTitle
        id="inplay-title"
        aside={
          <Link to="/live" className="pb-1 text-[14px] font-semibold text-sel-ink hover:underline">
            All live
          </Link>
        }
      >
        In play now
      </SectionTitle>
      <ul className="rounded-[24px] bg-surface px-5 py-1">
        {live.map((ev) => (
          <ScoreRow key={ev.id} ev={ev} />
        ))}
      </ul>
      <p className="mt-3 text-[12px] text-muted">Live information can be delayed.</p>
    </section>
  )
}

/** Markets with the most activity on tonight’s biggest match — popularity of markets, never a count of people. */
function PopularMarkets() {
  const ev = eventById('football-01')!
  if (ev.status !== 'scheduled') return null
  const ids = ['BTTS_90', 'TOTAL_2_5_90', 'ANYTIME_SCORER_90', 'DOUBLE_CHANCE_90']
  const markets = ids.map((id) => ev.markets.find((m) => m.id === id)).filter((m): m is NonNullable<typeof m> => !!m)
  return (
    <section aria-labelledby="pm-title" className="mt-14">
      <SectionTitle
        id="pm-title"
        aside={
          <Link to={`/event/${ev.id}`} className="flex items-center gap-1 pb-1 text-[14px] font-semibold text-sel-ink hover:underline">
            All markets <ChevronRight size={15} />
          </Link>
        }
      >
        Popular markets tonight
      </SectionTitle>
      <p className="-mt-3 mb-4 flex items-center gap-2 text-[14px] text-secondary">
        <Crest team={ev.home} size={18} /> {shortName(ev.home.name)} v {shortName(ev.away.name)} · 20:00
      </p>
      <div className="grid gap-3 @tab:grid-cols-2">
        {markets.map((m) => (
          <div key={m.id} className="rounded-[22px] bg-surface p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-[15px] font-semibold">{m.name}</h3>
              <span className="text-[12px] text-secondary">{m.period}</span>
            </div>
            <div className={clsx('mt-3 grid gap-2', m.selections.length >= 4 ? 'grid-cols-2' : m.selections.length === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
              {m.selections.slice(0, 4).map((sel) => (
                <OddsButton key={sel.id} ev={ev} market={m} sel={sel} odds={sel.odds} label={sel.label.replace(/ \((Southport|Northbridge)\)/, '')} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function StartingSoon() {
  const now = Date.parse(EVENT_NOW)
  const list = EVENTS.filter((e) => e.status === 'scheduled' && Date.parse(e.startsAt) - now <= 2 * 3600_000).sort((a, b) => a.startsAt.localeCompare(b.startsAt) || byPopularity(a, b)).slice(0, 8)
  if (!list.length) return null
  return (
    <section aria-labelledby="soon-title" className="mt-14">
      <SectionTitle id="soon-title">Starting soon</SectionTitle>
      <ul className="rounded-[24px] bg-surface px-5 py-1">
        {list.map((ev) => (
          <CompactRow key={ev.id} ev={ev} />
        ))}
      </ul>
    </section>
  )
}

function AtoZ() {
  return (
    <section aria-labelledby="az-title" className="mt-14">
      <SectionTitle id="az-title">All sports</SectionTitle>
      <div className="grid gap-3 @tab:grid-cols-3">
        {SPORTS.map((sp) => (
          <div key={sp.id} className="rounded-[22px] bg-surface p-5">
            <Link to={`/sports/${sp.id}`} className="flex items-center gap-2 font-display text-[19px] font-[740] tracking-[-0.03em] hover:text-sel-ink">
              <SportIcon sport={sp.id} size={18} /> {sp.name}
            </Link>
            <ul className="mt-3 space-y-1">
              {COMPETITIONS.filter((c) => c.sport === sp.id).map((c) => (
                <li key={c.id}>
                  <Link to={`/sports/${sp.id}?competition=${c.id}`} className="flex items-center gap-2.5 rounded-[10px] py-1.5 text-[14px] text-secondary hover:text-ink">
                    <CompetitionMark id={c.id} sport={c.sport} size={16} /> {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export function PopularHub() {
  const { s } = useStore()
  const pick = (f: (e: SportEvent) => boolean) => EVENTS.filter(f).sort(byPopularity)[0]
  const featured = [
    pick((e) => e.sport === 'football' && e.status === 'scheduled' && e.competitionId === 'premier-division'),
    pick((e) => e.sport === 'tennis' && e.status === 'live'),
    pick((e) => e.sport === 'basketball' && e.status === 'live'),
  ].filter(Boolean)
  const slides: Slide[] = featured.map((e) => ({ id: e.id, label: `${shortName(e.home.name)} v ${shortName(e.away.name)}`, node: <Hero ev={e} reason={null} compact /> }))
  return (
    <>
      <div className="@tab:px-8">
        <div className="mx-auto max-w-[1156px] overflow-hidden @tab:rounded-[32px]">
          <HeroCarousel slides={slides} label="Popular tonight" />
        </div>
      </div>
      <div className="mx-auto max-w-[1220px] px-4 @tab:px-8">
        <TopCompetitions />
        {s.offersOnHome && s.restriction === 'none' && <OffersRow ids={['predictor', 'matchday-free-bet', 'two-up']} />}
        <BigMatches />
        <InPlay />
        <PopularMarkets />
        <StartingSoon />
        <AtoZ />
      </div>
    </>
  )
}
