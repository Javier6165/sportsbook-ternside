import clsx from 'clsx'
import { ChevronDown, Flame, Gift, PanelLeftClose, PanelLeftOpen, Radio, ShieldCheck, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { NavLink, useLocation, useSearchParams } from 'react-router'
import { COMPETITIONS, EVENTS, SPORTS, TEAMS } from '../data/catalog'
import { useStore } from '../state/store'
import { Crest } from '../ui/Crest'
import { SportIcon } from '../ui/SportIcon'
import { CompetitionMark } from '../ui/CompetitionMark'

const W_CLOSED = 76
const W_OPEN = 268

function Item({ to, icon, label, meta, open, active }: { to: string; icon: ReactNode; label: string; meta?: ReactNode; open: boolean; active?: boolean }) {
  return (
    <NavLink
      to={to}
      end
      title={open ? undefined : label}
      aria-label={open ? undefined : label}
      className={({ isActive }) =>
        clsx(
          'group relative flex h-11 items-center gap-3 rounded-[14px] px-[14px] text-[14px] font-semibold transition-colors',
          (active ?? isActive) ? 'bg-surface text-ink shadow-[0_1px_2px_rgba(16,24,43,.08)]' : 'text-secondary hover:bg-chip hover:text-ink',
        )
      }
    >
      <span className="grid size-5 shrink-0 place-items-center">{icon}</span>
      <AnimatePresence initial={false}>
        {open && (
          <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="flex min-w-0 flex-1 items-center gap-2 whitespace-nowrap">
            <span className="truncate">{label}</span>
            {meta && <span className="ml-auto text-[12px] font-medium text-muted tnum">{meta}</span>}
          </motion.span>
        )}
      </AnimatePresence>
      {!open && (
        <span className="pointer-events-none absolute left-[calc(100%+10px)] z-50 hidden rounded-lg bg-ink px-2.5 py-1.5 text-[12.5px] font-semibold whitespace-nowrap text-white shadow-lg group-hover:block">
          {label}
        </span>
      )}
    </NavLink>
  )
}

function Section({ open, children }: { open: boolean; children: ReactNode }) {
  return open ? <div className="px-[14px] pt-5 pb-1.5 text-[11px] font-bold tracking-[.12em] whitespace-nowrap text-muted uppercase">{children}</div> : <div className="mx-auto my-3 h-px w-8 bg-line-strong" />
}

export function SideNav() {
  const { s, d } = useStore()
  const open = s.navOpen
  const [q] = useSearchParams()
  const loc = useLocation()
  const comp = q.get('competition')
  const [allOpen, setAllOpen] = useState(false)
  const live = EVENTS.filter((e) => e.status === 'live').length
  const followed = COMPETITIONS.filter((c) => s.prefs.competitions.includes(c.id))
  const teams = Object.values(TEAMS).filter((t) => s.prefs.teams.includes(t.id))
  const others = COMPETITIONS.filter((c) => !s.prefs.competitions.includes(c.id))
  const hub = (q.get('hub') as 'for-you' | 'popular' | null) ?? s.hub
  const activePromos = s.restriction === 'none' ? Object.values(s.promos).filter((e) => e && !e.completedAt).length + s.freeBets.filter((f) => f.status === 'available').length : 0

  return (
    <motion.nav
      aria-label="Sports"
      initial={false}
      animate={{ width: open ? W_OPEN : W_CLOSED }}
      transition={{ type: 'spring', stiffness: 380, damping: 38 }}
      className={clsx('thin-scrollbar relative z-20 hidden shrink-0 border-r border-black/[.05] @desk:block', open ? 'overflow-x-hidden overflow-y-auto' : 'overflow-visible')}
    >
      <div className="flex min-h-full flex-col p-3" style={{ width: open ? W_OPEN : W_CLOSED }}>
        <button
          onClick={() => d({ type: 'nav', open: !open })}
          aria-label={open ? 'Collapse navigation' : 'Expand navigation'}
          aria-expanded={open}
          className="mb-2 flex h-11 items-center gap-3 rounded-[14px] px-[14px] text-secondary hover:bg-chip hover:text-ink"
        >
          {open ? <PanelLeftClose size={19} /> : <PanelLeftOpen size={19} />}
          {open && <span className="text-[13px] font-semibold whitespace-nowrap">Collapse</span>}
        </button>

        <Item to="/sports?hub=for-you" icon={<Sparkles size={18} />} label="For you" open={open} active={loc.pathname === '/sports' && hub === 'for-you'} />
        <Item to="/sports?hub=popular" icon={<Flame size={18} />} label="Popular" open={open} active={loc.pathname === '/sports' && hub === 'popular'} />
        <Item to="/live" icon={<Radio size={18} />} label="Live now" meta={<span className="text-live">{live}</span>} open={open} />
        <Item to="/promotions" icon={<Gift size={18} />} label="Promotions" meta={activePromos || undefined} open={open} active={loc.pathname.startsWith('/promotions')} />

        <Section open={open}>Sports</Section>
        {SPORTS.map((sp) => (
          <Item
            key={sp.id}
            to={`/sports/${sp.id}`}
            icon={<SportIcon sport={sp.id} size={19} />}
            label={sp.name}
            meta={EVENTS.filter((e) => e.sport === sp.id).length}
            open={open}
            active={loc.pathname === `/sports/${sp.id}` && !comp}
          />
        ))}

        <Section open={open}>Following</Section>
        {teams.map((t) => (
          <Item key={t.id} to={`/sports/football?team=${t.id}`} icon={<Crest team={t} size={18} />} label={t.name} open={open} active={false} />
        ))}
        {followed.map((c) => (
          <Item
            key={c.id}
            to={`/sports/${c.sport}?competition=${c.id}`}
            icon={<CompetitionMark id={c.id} sport={c.sport} />}
            label={c.name}
            open={open}
            active={comp === c.id}
          />
        ))}

        {open && (
          <div className="mt-1">
            <button onClick={() => setAllOpen((a) => !a)} aria-expanded={allOpen} className="flex h-10 w-full items-center justify-between rounded-[14px] px-[14px] text-[13px] font-semibold whitespace-nowrap text-sel-ink hover:bg-sel">
              All competitions · {others.length}
              <motion.span animate={{ rotate: allOpen ? 180 : 0 }}>
                <ChevronDown size={16} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {allOpen && (
                <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  {others.map((c) => (
                    <li key={c.id}>
                      <NavLink
                        to={`/sports/${c.sport}?competition=${c.id}`}
                        className={clsx('flex h-9 items-center gap-2.5 rounded-[12px] px-[14px] text-[13px] whitespace-nowrap hover:bg-chip', comp === c.id ? 'font-semibold text-ink' : 'text-secondary')}
                      >
                        <CompetitionMark id={c.id} sport={c.sport} size={16} />
                        <span className="truncate">{c.name}</span>
                      </NavLink>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-auto pt-6">
          <Item to="/safer-gambling" icon={<ShieldCheck size={18} className="text-won-ink" />} label="Safer gambling" open={open} />
        </div>
      </div>
    </motion.nav>
  )
}
