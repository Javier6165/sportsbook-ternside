import clsx from 'clsx'
import { ChevronDown, ChevronRight, Star } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { competitionById, type Competition, type SportEvent } from '../../data/catalog'
import type { Reason, buildFeed } from '../../lib/feed'
import { dayLabel, kickoffTime } from '../../lib/time'
import { useStore } from '../../state/store'
import { Crest } from '../../ui/Crest'
import { OddsButton } from '../../ui/OddsButton'
import { SportIcon } from '../../ui/SportIcon'

const ease = [0.16, 1, 0.3, 1] as const

function FavButton({ id, name, dark }: { id: string; name: string; dark?: boolean }) {
  const { s, d } = useStore()
  const fav = s.favourites.includes(id)
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={() => d({ type: 'favourite', eventId: id })}
      aria-pressed={fav}
      aria-label={fav ? `Remove ${name} from favourites` : `Add ${name} to favourites`}
      className={clsx('grid size-9 shrink-0 place-items-center rounded-full', fav ? 'text-[#f5a623]' : dark ? 'text-white/40 hover:text-white' : 'text-[#c4c9d2] hover:bg-chip hover:text-secondary')}
    >
      <motion.span key={String(fav)} initial={{ scale: fav ? 0.4 : 1, rotate: fav ? -40 : 0 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }}>
        <Star size={17} fill={fav ? 'currentColor' : 'none'} strokeWidth={fav ? 1.5 : 2} />
      </motion.span>
    </motion.button>
  )
}

export function PickCard({ ev, reason, i }: { ev: SportEvent; reason: Reason; i: number }) {
  const m = ev.markets[0]
  const three = m.selections.length === 3
  const comp = competitionById(ev.competitionId)
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: (i % 2) * 0.06, duration: 0.6, ease }}
      className="relative overflow-hidden rounded-[26px] bg-surface p-5"
    >
      <div className="flex items-center gap-2">
        <span
          className={clsx(
            'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold',
            reason.kind === 'team' ? 'bg-sel text-sel-ink' : reason.kind === 'competition' ? 'bg-chip text-ink' : 'bg-warn text-warn-ink',
          )}
        >
          {reason.kind === 'popular' ? '★ ' : ''}
          {reason.text}
        </span>
        <span className="ml-auto text-[13px] font-semibold text-ink tnum">
          {dayLabel(ev.startsAt)} · {kickoffTime(ev.startsAt)}
        </span>
        <FavButton id={ev.id} name={`${ev.home.name} v ${ev.away.name}`} />
      </div>
      <Link to={`/event/${ev.id}`} className="group mt-3 block">
        {[ev.home, ev.away].map((p) => (
          <span key={p.id} className="flex items-center gap-3 py-1">
            <Crest team={p} size={26} />
            <span className="truncate font-display text-[20px] font-[700] tracking-[-0.03em] group-hover:text-sel-ink">{p.name}</span>
          </span>
        ))}
        <span className="mt-1 flex items-center gap-1.5 text-[12.5px] text-secondary">
          <SportIcon sport={ev.sport} size={13} /> {comp.name} · {m.name}
          {ev.markets.length > 1 && <span className="ml-auto flex items-center font-semibold text-ink">{ev.markets.length} markets <ChevronRight size={15} /></span>}
        </span>
      </Link>
      <div className={clsx('mt-4 grid gap-2', three ? 'grid-cols-3' : 'grid-cols-2')}>
        {m.selections.map((sel, k) => (
          <OddsButton key={sel.id} ev={ev} market={m} sel={sel} odds={sel.odds} label={three ? (k === 0 ? '1' : k === 1 ? 'X' : '2') : (k === 0 ? ev.home : ev.away).name.split(' ').pop()} />
        ))}
      </div>
    </motion.article>
  )
}

export function Picks({ picks }: { picks: { e: SportEvent; r: Reason }[] }) {
  return (
    <section aria-labelledby="picks-title" className="mt-14">
      <div className="mb-5">
        <h2 id="picks-title" className="font-display text-[34px] leading-none font-[780] tracking-[-0.045em] @tab:text-[40px]">
          Coming up for you
        </h2>
        <p className="mt-2 text-[15px] text-secondary">Your teams and competitions first, then the few matches worth knowing about.</p>
      </div>
      <div className="grid gap-3 @tab:grid-cols-2">
        {picks.map((x, i) => (
          <PickCard key={x.e.id} ev={x.e} reason={x.r} i={i} />
        ))}
      </div>
    </section>
  )
}

// —— Everything else: two levels of disclosure (sport → competition → matches) ——

export function CompactRow({ ev }: { ev: SportEvent }) {
  const m = ev.markets[0]
  const three = m.selections.length === 3
  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 border-t border-line py-3 first:border-t-0 @tab:grid-cols-[72px_1fr_auto]">
      <span className="text-[12.5px] font-semibold text-secondary tnum @tab:order-none">
        {dayLabel(ev.startsAt) === 'Today' ? '' : dayLabel(ev.startsAt) + ' · '}
        {kickoffTime(ev.startsAt)}
      </span>
      <Link to={`/event/${ev.id}`} className="col-span-2 min-w-0 text-[14.5px] font-semibold hover:text-sel-ink @tab:col-span-1">
        <span className="block truncate">{ev.home.name}</span>
        <span className="block truncate text-secondary">{ev.away.name}</span>
      </Link>
      <div className={clsx('col-span-2 grid gap-1.5 @tab:col-span-1 @tab:w-[228px]', three ? 'grid-cols-3' : 'grid-cols-2')}>
        {m.selections.map((sel) => (
          <OddsButton key={sel.id} ev={ev} market={m} sel={sel} odds={sel.odds} className="!min-h-10 !rounded-[12px]" />
        ))}
      </div>
    </li>
  )
}

export function CompetitionFold({ c, evs, defaultOpen = false }: { c: Competition; evs: SportEvent[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-t border-line first:border-t-0">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center gap-3 py-3.5 text-left">
        <span className="min-w-0 flex-1">
          <span className="text-[15px] font-semibold">{c.name}</span>
          <span className="ml-2 text-[13px] text-muted">{c.region}</span>
        </span>
        <span className="text-[13px] font-medium text-secondary tnum">{evs.length}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-secondary">
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden pb-2">
            {evs.map((ev) => (
              <CompactRow key={ev.id} ev={ev} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

function SportFold({ g }: { g: ReturnType<typeof buildFeed>['rest'][number] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-[24px] bg-surface">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center gap-4 px-5 py-4 text-left">
        <span className="grid size-11 place-items-center rounded-full bg-chip text-ink">
          <SportIcon sport={g.sport.id} size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[19px] font-[720] tracking-[-0.03em]">{g.sport.name}</span>
          <span className="block text-[13px] text-secondary">
            {g.comps.length} {g.comps.length === 1 ? 'competition' : 'competitions'} · {g.count} {g.count === 1 ? 'match' : 'matches'}
          </span>
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="grid size-9 place-items-center rounded-full bg-chip">
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden">
            <div className="px-5 pb-3">
              {g.comps.map(({ c, evs }) => (
                <CompetitionFold key={c.id} c={c} evs={evs} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function EverythingElse({ rest, hidden }: { rest: ReturnType<typeof buildFeed>['rest']; hidden: number }) {
  const comps = rest.reduce((a, g) => a + g.comps.length, 0)
  return (
    <section aria-labelledby="rest-title" className="mt-14">
      <h2 id="rest-title" className="font-display text-[34px] leading-none font-[780] tracking-[-0.045em] @tab:text-[40px]">
        Everything else
      </h2>
      <p className="mt-2 max-w-[560px] text-[15px] text-secondary">
        {hidden} more matches in {comps} competitions, tucked away so the rest of the page stays calm. Open what you need.
      </p>
      <div className="mt-5 grid gap-3">
        {rest.map((g) => (
          <SportFold key={g.sport.id} g={g} />
        ))}
      </div>
    </section>
  )
}
