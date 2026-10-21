import clsx from 'clsx'
import { ChevronRight, Star } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { COMPETITIONS, EVENTS, SPORTS, type SportEvent, type SportId } from '../../data/catalog'
import { dayLabel, dayOffset, kickoffTime } from '../../lib/time'
import { useStore } from '../../state/store'
import { Crest } from '../../ui/Crest'
import { OddsButton } from '../../ui/OddsButton'
import { SportIcon } from '../../ui/SportIcon'

type Day = 'today' | 'tomorrow' | 'later'
const DAYS: { id: Day; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'later', label: 'This week' },
]

function EventRow({ ev }: { ev: SportEvent }) {
  const { s, d } = useStore()
  const fav = s.favourites.includes(ev.id)
  const m = ev.markets[0]
  const three = m.selections.length === 3
  const more = ev.markets.length - 1
  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2.5 border-t border-line px-4 py-3 first:border-t-0 @tab:grid-cols-[64px_1fr_auto_auto] @tab:gap-x-4"
    >
      <div className="col-span-2 flex items-center gap-2 text-[12px] text-secondary @tab:col-span-1 @tab:block">
        <div className="font-semibold text-ink tnum">{kickoffTime(ev.startsAt)}</div>
        <div className="text-[11.5px] @tab:mt-0.5">{dayOffset(ev.startsAt) > 0 ? dayLabel(ev.startsAt) : ev.builder ? <span className="font-semibold text-sel-ink">Builder</span> : 'Today'}</div>
        <span className="ml-auto @tab:hidden">
          <FavButton fav={fav} onClick={() => d({ type: 'favourite', eventId: ev.id })} name={`${ev.home.name} v ${ev.away.name}`} />
        </span>
      </div>

      <Link to={`/event/${ev.id}`} className="min-w-0 space-y-1.5 rounded-md py-0.5">
        {[ev.home, ev.away].map((p) => (
          <span key={p.id} className="flex items-center gap-2">
            <Crest team={p} size={18} className="shrink-0" />
            <span className="truncate text-[14px] font-medium text-ink group-hover:text-sel-ink">{p.name}</span>
          </span>
        ))}
      </Link>

      <div className={clsx('col-span-2 grid gap-1.5 @tab:col-span-1 @tab:w-[234px]', three ? 'grid-cols-3' : 'grid-cols-2')}>
        {m.selections.map((sel, i) => (
          <OddsButton
            key={sel.id}
            ev={ev}
            market={m}
            sel={sel}
            odds={sel.odds}
            label={three ? (i === 0 ? '1' : i === 1 ? 'X' : '2') : undefined}
            className="@tab:justify-center @tab:[&>span:first-child]:hidden"
          />
        ))}
      </div>

      <div className="hidden items-center gap-1 @tab:flex">
        <FavButton fav={fav} onClick={() => d({ type: 'favourite', eventId: ev.id })} name={`${ev.home.name} v ${ev.away.name}`} />
        <Link
          to={`/event/${ev.id}`}
          className="flex h-9 items-center gap-0.5 rounded-lg px-2 text-[12.5px] font-semibold text-secondary hover:bg-canvas hover:text-ink"
          aria-label={`${more} more markets for ${ev.home.name} v ${ev.away.name}`}
        >
          {more > 0 ? `+${more}` : ''}
          <ChevronRight size={16} />
        </Link>
      </div>
    </motion.li>
  )
}

function FavButton({ fav, onClick, name }: { fav: boolean; onClick: () => void; name: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={onClick}
      aria-pressed={fav}
      aria-label={fav ? `Remove ${name} from favourites` : `Add ${name} to favourites`}
      className={clsx('grid size-9 place-items-center rounded-lg hover:bg-canvas', fav ? 'text-[#f5a623]' : 'text-line-strong hover:text-secondary')}
    >
      <motion.span key={String(fav)} initial={{ scale: fav ? 0.4 : 1, rotate: fav ? -40 : 0 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }}>
        <Star size={17} fill={fav ? 'currentColor' : 'none'} strokeWidth={fav ? 1.5 : 2} />
      </motion.span>
    </motion.button>
  )
}

export function Upcoming({ sport: fixedSport }: { sport?: SportId }) {
  const [day, setDay] = useState<Day>('today')
  const [sport, setSport] = useState<SportId | 'all'>(fixedSport ?? 'all')

  const groups = useMemo(() => {
    const evs = EVENTS.filter((e) => e.status === 'scheduled')
      .filter((e) => (sport === 'all' ? true : e.sport === sport))
      .filter((e) => {
        const o = dayOffset(e.startsAt)
        return day === 'today' ? o === 0 : day === 'tomorrow' ? o === 1 : o >= 0
      })
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    return COMPETITIONS.map((c) => ({ c, evs: evs.filter((e) => e.competitionId === c.id) })).filter((g) => g.evs.length)
  }, [day, sport])

  return (
    <section aria-labelledby="upcoming-title" className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[11.5px] font-semibold tracking-[.1em] text-sel-ink uppercase">Pre-match</div>
          <h2 id="upcoming-title" className="display mt-1 text-[30px] leading-none uppercase">
            Coming up
          </h2>
        </div>
        <div role="tablist" aria-label="Day" className="relative flex rounded-full bg-[#e9ecf1] p-1">
          {DAYS.map((x) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={day === x.id}
              onClick={() => setDay(x.id)}
              className={clsx('relative z-10 h-8 rounded-full px-3.5 text-[13px] font-semibold transition-colors', day === x.id ? 'text-ink' : 'text-secondary hover:text-ink')}
            >
              {day === x.id && <motion.span layoutId="day-pill" className="absolute inset-0 -z-10 rounded-full bg-surface shadow-[0_1px_3px_rgba(16,24,43,.15)]" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
              {x.label}
            </button>
          ))}
        </div>
      </div>

      {!fixedSport && (
        <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 @desk:mx-0 @desk:px-0" role="group" aria-label="Filter by sport">
          {[{ id: 'all' as const, name: 'All sports' }, ...SPORTS].map((x) => (
            <button
              key={x.id}
              aria-pressed={sport === x.id}
              onClick={() => setSport(x.id)}
              className={clsx(
                'flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition-colors',
                sport === x.id ? 'border-ink bg-ink text-white' : 'border-line bg-surface text-ink hover:border-line-strong',
              )}
            >
              {x.id !== 'all' && <SportIcon sport={x.id} size={15} />}
              {x.name}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 space-y-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {groups.map(({ c, evs }) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-[16px] border border-line bg-surface shadow-[0_1px_2px_rgba(16,24,43,.04)]"
            >
              <div className="flex items-center gap-2.5 border-b border-line bg-[#fafbfc] px-4 py-2.5">
                <SportIcon sport={c.sport} size={16} className="text-secondary" />
                <div className="min-w-0 flex-1">
                  <span className="text-[13.5px] font-semibold text-ink">{c.name}</span>
                  <span className="ml-2 text-[12px] text-muted">{c.region}</span>
                </div>
                <div className={clsx('hidden text-[11px] font-semibold text-muted @tab:grid @tab:w-[234px] @tab:text-center', evs[0].markets[0].selections.length === 3 ? 'grid-cols-3' : 'grid-cols-2')} aria-hidden="true">
                  {evs[0].markets[0].selections.length === 3 ? ['1', 'X', '2'].map((k) => <span key={k}>{k}</span>) : ['Home', 'Away'].map((k) => <span key={k}>{k}</span>)}
                </div>
                <div className="hidden w-[84px] @tab:block" />
              </div>
              <ul>
                {evs.map((ev) => (
                  <EventRow key={ev.id} ev={ev} />
                ))}
              </ul>
            </motion.div>
          ))}
        </AnimatePresence>
        {groups.length === 0 && (
          <div className="rounded-[16px] border border-dashed border-line-strong bg-surface px-6 py-10 text-center">
            <div className="text-[15px] font-semibold text-ink">No {sport === 'all' ? '' : SPORTS.find((x) => x.id === sport)?.name.toLowerCase() + ' '}matches {day === 'today' ? 'left today' : day === 'tomorrow' ? 'tomorrow' : 'this week'}</div>
            <p className="mt-1 text-[13px] text-secondary">Your filter is kept. Try another day or show all sports.</p>
            <button onClick={() => setSport('all')} className="mt-4 h-9 rounded-full border border-line px-4 text-[13px] font-semibold hover:bg-canvas">
              Show all sports
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
