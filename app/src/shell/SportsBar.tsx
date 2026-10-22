import clsx from 'clsx'
import { ChevronDown, Flame, Gift, Sparkles, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useParams, useSearchParams } from 'react-router'
import { COMPETITIONS, EVENTS, SPORTS } from '../data/catalog'
import { useStore } from '../state/store'
import { SportIcon } from '../ui/SportIcon'
import { useModal } from '../ui/useModal'

/** Mobile/tablet: sports + followed competitions as a calm chip row; everything else in a sheet. */
export function SportsBar() {
  const { s } = useStore()
  const { sportId } = useParams()
  const [q] = useSearchParams()
  const loc = useLocation()
  const comp = q.get('competition')
  const [all, setAll] = useState(false)
  const followed = COMPETITIONS.filter((c) => s.prefs.competitions.includes(c.id))
  const isHome = loc.pathname === '/sports'
  const hub = (q.get('hub') as 'for-you' | 'popular' | null) ?? s.hub

  const chip = (active: boolean) =>
    clsx('flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] font-semibold transition-colors', active ? 'bg-ink text-white' : 'bg-surface text-ink hover:bg-chip')

  return (
    <div className="sticky top-0 z-20 border-b border-black/[.04] bg-canvas/85 backdrop-blur-xl @desk:hidden">
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2.5 @tab:px-8">
        <Link to="/sports?hub=for-you" className={chip(isHome && hub === 'for-you')}>
          <Sparkles size={14} /> For you
        </Link>
        <Link to="/sports?hub=popular" className={chip(isHome && hub === 'popular')}>
          <Flame size={14} /> Popular
        </Link>
        {SPORTS.map((sp) => (
          <Link key={sp.id} to={`/sports/${sp.id}`} className={chip(sportId === sp.id && !comp)}>
            <SportIcon sport={sp.id} size={15} /> {sp.name}
          </Link>
        ))}
        <span className="mx-1 my-2 w-px shrink-0 bg-line-strong" />
        {followed.map((c) => (
          <Link key={c.id} to={`/sports/${c.sport}?competition=${c.id}`} className={chip(comp === c.id)}>
            {c.name}
          </Link>
        ))}
        <Link to="/promotions" className={chip(loc.pathname.startsWith('/promotions'))}>
          <Gift size={14} /> Promotions
        </Link>
        <button onClick={() => setAll(true)} className={clsx(chip(false), 'text-sel-ink')}>
          All <ChevronDown size={15} />
        </button>
      </div>
      <AllCompetitionsSheet open={all} onClose={() => setAll(false)} />
    </div>
  )
}

export function AllCompetitionsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const modalRef = useModal<HTMLDivElement>(open, onClose)
  useEffect(() => setTarget(document.getElementById('overlay-root')), [])
  if (!target) return null
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div ref={modalRef} key="all" className="pointer-events-auto absolute inset-0 z-50 flex items-end" role="dialog" aria-modal="true" aria-label="All sports and competitions">
          <motion.div className="absolute inset-0 bg-[#0b0f1a]/45 backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className="thin-scrollbar relative max-h-[85%] w-full overflow-y-auto rounded-t-[30px] bg-surface p-6 pb-10"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[28px] font-[800] tracking-[-0.045em]">All competitions</h2>
              <button onClick={onClose} aria-label="Close" className="grid size-10 place-items-center rounded-full bg-chip">
                <X size={18} />
              </button>
            </div>
            {SPORTS.map((sp) => (
              <div key={sp.id} className="mt-6">
                <Link to={`/sports/${sp.id}`} onClick={onClose} className="flex items-center gap-2 font-display text-[19px] font-[740] tracking-[-0.03em]">
                  <SportIcon sport={sp.id} size={18} /> {sp.name}
                </Link>
                <ul className="mt-2">
                  {COMPETITIONS.filter((c) => c.sport === sp.id).map((c) => (
                    <li key={c.id}>
                      <Link to={`/sports/${sp.id}?competition=${c.id}`} onClick={onClose} className="flex items-center justify-between border-t border-line py-3 text-[15px] font-medium first:border-t-0">
                        <span>
                          {c.name} <span className="text-[13px] text-muted">{c.region}</span>
                        </span>
                        <span className="text-[13px] text-secondary tnum">{EVENTS.filter((e) => e.competitionId === c.id).length}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    target,
  )
}
