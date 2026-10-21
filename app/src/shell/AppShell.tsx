import clsx from 'clsx'
import { ChevronUp, Command, Gauge, Plus, Radio, Search, ShieldCheck, Star, Ticket, Trophy, User } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { COMPETITIONS, EVENTS, SPORTS, eventById } from '../data/catalog'
import { D, fmtMoney, grossReturn, isValidStake } from '../domain/money'
import { Betslip } from '../features/betslip/Betslip'
import { useStore } from '../state/store'
import { CountUp } from '../ui/CountUp'
import { Crest } from '../ui/Crest'
import { FlyLayer, LAND_EVENT } from '../ui/fly'
import { SportIcon } from '../ui/SportIcon'
import { Wordmark } from '../ui/Wordmark'

const NAV = [
  { to: '/sports', label: 'Sports', icon: Trophy },
  { to: '/live', label: 'Live', icon: Radio },
  { to: '/my-bets', label: 'My Bets', icon: Ticket },
  { to: '/account', label: 'Account', icon: User },
]

const money = (n: number) => fmtMoney(n.toFixed(2))

function Header() {
  const { s } = useStore()
  const liveCount = EVENTS.filter((e) => e.status === 'live').length
  return (
    <header className="on-dark relative z-30 shrink-0 bg-nav text-white">
      <div className="flex h-14 items-center gap-3 px-4 @desk:h-16 @desk:gap-6 @desk:px-5">
        <Link to="/sports" className="shrink-0 rounded-md">
          <Wordmark size={28} className="@desk:!text-[32px]" />
        </Link>

        <nav aria-label="Primary" className="hidden h-full items-stretch @desk:flex">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className="group relative flex items-center px-3.5 text-[14px] font-semibold text-white/70 hover:text-white aria-[current=page]:text-white">
              {({ isActive }) => (
                <>
                  {n.label}
                  {n.to === '/live' && <span className="ml-1.5 rounded-full bg-live/20 px-1.5 text-[11px] text-[#ff8098] tnum">{liveCount}</span>}
                  {isActive && <motion.span layoutId="nav-underline" className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-action" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/search"
          className="ml-auto flex h-10 items-center gap-2.5 rounded-full bg-white/[.07] px-3 text-[13.5px] text-white/55 ring-1 ring-white/10 ring-inset transition-colors hover:bg-white/[.11] @desk:ml-0 @desk:max-w-[360px] @desk:flex-1 @desk:px-4"
          aria-label="Search events, teams or markets"
        >
          <Search size={17} className="text-white/70" />
          <span className="hidden @desk:inline">Search events, teams or markets</span>
          <span className="ml-auto hidden items-center gap-0.5 rounded-md bg-white/10 px-1.5 py-0.5 text-[11px] font-semibold text-white/60 @desk:flex">
            <Command size={11} />K
          </span>
        </Link>

        <div className="flex items-center gap-2 @desk:ml-auto @desk:gap-3">
          <Link to="/wallet" className="flex flex-col items-end rounded-lg px-1 leading-tight" aria-label={`Available balance ${fmtMoney(s.available)}, demo money`}>
            <span className="text-[10.5px] font-semibold tracking-[.06em] text-brand-dark uppercase">Demo funds</span>
            <span className="text-[15px] font-semibold tnum">
              <CountUp value={Number(s.available)} format={money} />
            </span>
          </Link>
          <Link to="/wallet" className="hidden h-10 items-center gap-1.5 rounded-full bg-action px-4 text-[13.5px] font-semibold hover:bg-action-hover @tab:flex">
            <Plus size={16} strokeWidth={2.5} /> Deposit
          </Link>
          <Link to="/account" aria-label="Account" className="grid size-10 place-items-center rounded-full bg-white/[.08] ring-1 ring-white/10 hover:bg-white/15">
            <span className="display text-[16px]">SE</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

function Rail() {
  const { s } = useStore()
  const favs = s.favourites.map(eventById).filter(Boolean)
  return (
    <aside aria-label="Sports navigation" className="thin-scrollbar hidden w-[220px] shrink-0 overflow-y-auto border-r border-line bg-surface @desk:block @wide:w-[232px]">
      <div className="p-3">
        <div className="px-2 pt-2 pb-1.5 text-[11px] font-semibold tracking-[.1em] text-muted uppercase">Sports</div>
        {SPORTS.map((sp) => {
          const count = EVENTS.filter((e) => e.sport === sp.id).length
          return (
            <NavLink
              key={sp.id}
              to={`/sports/${sp.id}`}
              className={({ isActive }) =>
                clsx('flex h-10 items-center gap-3 rounded-[10px] px-2.5 text-[14px] font-semibold', isActive ? 'bg-sel text-sel-ink' : 'text-ink hover:bg-canvas')
              }
            >
              <SportIcon sport={sp.id} size={18} />
              <span className="flex-1">{sp.name}</span>
              <span className="text-[12px] font-medium text-muted tnum">{count}</span>
            </NavLink>
          )
        })}

        <div className="px-2 pt-5 pb-1.5 text-[11px] font-semibold tracking-[.1em] text-muted uppercase">Competitions</div>
        {COMPETITIONS.map((c) => (
          <Link key={c.id} to={`/sports/${c.sport}?competition=${c.id}`} className="flex h-9 items-center gap-2.5 rounded-[10px] px-2.5 text-[13.5px] text-ink hover:bg-canvas">
            <span className="grid size-5 place-items-center rounded-md bg-canvas text-secondary">
              <SportIcon sport={c.sport} size={12} />
            </span>
            <span className="truncate">{c.name}</span>
          </Link>
        ))}

        <div className="flex items-center gap-1.5 px-2 pt-5 pb-1.5 text-[11px] font-semibold tracking-[.1em] text-muted uppercase">
          <Star size={12} /> Favourites
        </div>
        <AnimatePresence initial={false}>
          {favs.length === 0 ? (
            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-2.5 text-[12.5px] leading-snug text-secondary">
              Star a match to keep it here.
            </motion.p>
          ) : (
            favs.map((ev) => (
              <motion.div key={ev!.id} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}>
                <Link to={`/event/${ev!.id}`} className="flex items-center gap-2 rounded-[10px] px-2.5 py-2 text-[12.5px] hover:bg-canvas">
                  <span className="flex -space-x-1.5">
                    <Crest team={ev!.home} size={16} />
                    <Crest team={ev!.away} size={16} />
                  </span>
                  <span className="truncate font-medium">
                    {ev!.home.short} v {ev!.away.short}
                  </span>
                </Link>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="m-3 mt-4 mb-20 rounded-[14px] border border-line bg-[#fafbfc] p-3.5">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-ink">
          <ShieldCheck size={16} className="text-won-ink" /> Deposit limits
        </div>
        <div className="mt-3 space-y-2.5">
          {[
            ['Last 24 hours', 20],
            ['Last 7 days', 50],
            ['This calendar month', 100],
          ].map(([label, lim]) => (
            <div key={label as string}>
              <div className="flex justify-between gap-2 text-[11px] whitespace-nowrap">
                <span className="text-secondary">{label}</span>
                <span className="font-semibold tnum">£0 / £{lim}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#e6e9ee]">
                <div className="h-full w-[2%] rounded-full bg-won-ink" />
              </div>
            </div>
          ))}
        </div>
        <Link to="/safer-gambling" className="mt-3 flex items-center gap-1 text-[12.5px] font-semibold text-sel-ink hover:underline">
          <Gauge size={14} /> Manage limits
        </Link>
      </div>
    </aside>
  )
}

function BottomNav() {
  return (
    <nav aria-label="Primary" className="on-dark relative z-30 grid shrink-0 grid-cols-4 border-t border-white/10 bg-nav pb-[max(6px,env(safe-area-inset-bottom))] text-white @desk:hidden">
      {NAV.map((n) => (
        <NavLink key={n.to} to={n.to} className="relative flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-white/55 aria-[current=page]:text-white">
          {({ isActive }) => (
            <>
              {isActive && <motion.span layoutId="tab-glow" className="absolute top-0 h-[3px] w-10 rounded-b-full bg-action" />}
              <n.icon size={21} strokeWidth={isActive ? 2.2 : 1.8} />
              {n.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function SlipBar() {
  const { s, d } = useStore()
  const n = s.groups.length
  const [pulse, setPulse] = useState(0)
  useEffect(() => {
    const f = () => setPulse((p) => p + 1)
    window.addEventListener(LAND_EVENT, f)
    return () => window.removeEventListener(LAND_EVENT, f)
  }, [])
  const ret = s.groups.reduce((a, g) => (isValidStake(g.stake) ? a.plus(grossReturn(g.stake, g.odds)) : a), D(0))
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[calc(100%+10px)] z-40 flex justify-center px-3 @desk:hidden">
      <span data-slip-target className="absolute bottom-4 left-1/2 size-1" aria-hidden="true" style={{ display: n ? 'none' : undefined }} />
      <AnimatePresence>
        {n > 0 && (
          <motion.button
            key="bar"
            initial={{ y: 30, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            onClick={() => d({ type: 'slip', open: true })}
            className="on-dark pointer-events-auto flex h-14 w-full max-w-[440px] items-center gap-3 rounded-[16px] bg-action pr-4 pl-2 text-white shadow-[0_16px_36px_-12px_rgba(41,72,255,.9)]"
          >
            <motion.span
              key={pulse}
              data-slip-target
              initial={{ scale: pulse ? 1.3 : 1 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 12 }}
              className="grid size-10 place-items-center rounded-[11px] bg-white text-[15px] font-bold text-action tnum"
            >
              {n}
            </motion.span>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-[14.5px] font-semibold">Betslip</span>
              <span className="text-[12px] text-white/75">{ret.gt(0) ? <>Potential return {fmtMoney(ret)}</> : `${n} ${n === 1 ? 'selection' : 'selections'} · add a stake`}</span>
            </span>
            <ChevronUp size={20} className="ml-auto" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileSlipSheet() {
  const { s, d } = useStore()
  const close = () => d({ type: 'slip', open: false })
  return (
    <AnimatePresence>
      {s.slipOpen && (
        <motion.div key="sheet" className="absolute inset-0 z-50 flex flex-col @desk:hidden" role="dialog" aria-modal="true" aria-label="Betslip">
          <motion.div className="absolute inset-0 bg-nav/50 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.div
            className="relative mt-auto flex h-[calc(100%-28px)] flex-col overflow-hidden rounded-t-[22px] bg-canvas shadow-2xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
          >
            <div className="absolute top-1.5 left-1/2 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-line-strong" />
            <Betslip onClose={close} compact />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const loc = useLocation()
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
  }, [loc.pathname])

  return (
    <div ref={rootRef} className="@container relative flex h-full w-full flex-col overflow-hidden bg-canvas">
      <FlyLayer rootRef={rootRef}>
        <Header />
        <div className="flex min-h-0 flex-1">
          <Rail />
          <main ref={mainRef} id="main" className="thin-scrollbar relative min-w-0 flex-1 overflow-y-auto">
            {children}
          </main>
          <aside aria-label="Betslip" className="hidden w-[340px] shrink-0 border-l border-line @desk:block @wide:w-[384px]">
            <Betslip />
          </aside>
        </div>
        <div className="relative">
          <SlipBar />
          <BottomNav />
        </div>
        <MobileSlipSheet />
      </FlyLayer>
    </div>
  )
}
