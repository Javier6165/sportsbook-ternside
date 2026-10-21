import clsx from 'clsx'
import { ChevronUp, Command, Plus, Radio, Search, Ticket, Trophy, User } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { EVENTS } from '../data/catalog'
import { D, fmtMoney, fmtOdds, grossReturn, isValidStake } from '../domain/money'
import { Betslip } from '../features/betslip/Betslip'
import { useStore } from '../state/store'
import { CountUp } from '../ui/CountUp'
import { FlyLayer, LAND_EVENT } from '../ui/fly'
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
    <header className="relative z-30 shrink-0 border-b border-black/[.04] bg-canvas/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1220px] items-center gap-3 px-4 @tab:px-8 @desk:h-[72px] @desk:gap-5">
        <Link to="/sports" className="shrink-0 rounded-md">
          <Wordmark size={26} />
        </Link>

        <nav aria-label="Primary" className="relative hidden rounded-full bg-chip p-1 @desk:flex">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className="relative z-10 flex h-9 items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold text-secondary transition-colors hover:text-ink aria-[current=page]:text-ink">
              {({ isActive }) => (
                <>
                  {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-surface shadow-[0_1px_3px_rgba(16,24,43,.14)]" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                  {n.label}
                  {n.to === '/live' && <span className="flex items-center gap-1 text-[12px] text-live tnum"><span className="live-dot !size-1.5" />{liveCount}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/search"
          className="ml-auto flex h-11 items-center gap-2.5 rounded-full bg-chip px-3.5 text-[14px] text-secondary transition-colors hover:bg-chip-hover @desk:ml-0 @desk:max-w-[300px] @desk:flex-1 @desk:px-4"
          aria-label="Search teams, players or markets"
        >
          <Search size={18} className="text-ink" />
          <span className="hidden @desk:inline">Search</span>
          <span className="ml-auto hidden items-center gap-0.5 rounded-md bg-surface px-1.5 py-0.5 text-[11px] font-semibold text-secondary @desk:flex">
            <Command size={11} />K
          </span>
        </Link>

        <div className="flex items-center gap-2 @desk:ml-auto @desk:gap-3">
          <Link to="/wallet" className="flex flex-col items-end rounded-lg px-1 leading-tight" aria-label={`Available balance ${fmtMoney(s.available)}, demo money`}>
            <span className="text-[11px] font-semibold text-secondary">Demo funds</span>
            <span className="font-display text-[17px] font-[760] tracking-[-0.02em] tnum">
              <CountUp value={Number(s.available)} format={money} />
            </span>
          </Link>
          <Link to="/wallet" className="hidden h-11 items-center gap-1.5 rounded-full bg-action px-4 text-[14px] font-semibold text-white hover:bg-action-hover @tab:flex">
            <Plus size={16} strokeWidth={2.6} /> Deposit
          </Link>
          <Link to="/account" aria-label="Account" className="grid size-11 place-items-center rounded-full bg-ink text-white">
            <span className="font-display text-[14px] font-[760]">SE</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

function useLanded() {
  const [pulse, setPulse] = useState(0)
  useEffect(() => {
    const f = () => setPulse((p) => p + 1)
    window.addEventListener(LAND_EVENT, f)
    return () => window.removeEventListener(LAND_EVENT, f)
  }, [])
  return pulse
}

/** Desktop: the betslip lives in a floating pass that unfolds on demand. */
function SlipDock() {
  const { s, d } = useStore()
  const n = s.groups.length
  const pulse = useLanded()
  const last = s.groups[s.groups.length - 1]
  const [peek, setPeek] = useState(false)
  const prevN = useRef(n)
  useEffect(() => {
    if (n > prevN.current) {
      setPeek(true)
      const t = setTimeout(() => setPeek(false), 2600)
      prevN.current = n
      return () => clearTimeout(t)
    }
    prevN.current = n
  }, [n])
  const ret = s.groups.reduce((a, g) => (isValidStake(g.stake) ? a.plus(grossReturn(g.stake, g.odds)) : a), D(0))

  return (
    <div className="pointer-events-none absolute inset-0 z-40 hidden @desk:block">
      <AnimatePresence>
        {s.slipOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
            style={{ transformOrigin: '100% 100%' }}
            className="pointer-events-auto absolute top-[88px] right-5 bottom-5 w-[408px] overflow-hidden rounded-[32px] shadow-[0_40px_90px_-30px_rgba(16,24,43,.55),0_0_0_1px_rgba(16,24,43,.05)]"
            role="dialog"
            aria-label="Betslip"
          >
            <Betslip onClose={() => d({ type: 'slip', open: false })} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!s.slipOpen && (
          <motion.button
            key="pill"
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            onClick={() => d({ type: 'slip', open: true })}
            className="on-dark pointer-events-auto absolute right-6 bottom-6 flex h-16 items-center gap-3 rounded-full bg-ink pr-6 pl-2 text-white shadow-[0_24px_50px_-18px_rgba(16,24,43,.7)]"
            aria-label={`Open betslip, ${n} selections`}
          >
            <motion.span
              key={pulse}
              data-slip-target
              initial={{ scale: pulse ? 1.35 : 1 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 12 }}
              className={clsx('grid size-12 place-items-center rounded-full font-display text-[18px] font-[780] tnum', n ? 'bg-action' : 'bg-white/10')}
            >
              {n}
            </motion.span>
            <motion.span layout className="flex flex-col items-start leading-tight">
              <AnimatePresence mode="popLayout" initial={false}>
                {peek && last ? (
                  <motion.span key="peek" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-col items-start">
                    <span className="text-[12px] font-semibold text-white/60">Added</span>
                    <span className="max-w-[240px] truncate text-[15px] font-semibold">
                      {last.type === 'builder' ? 'Bet Builder' : last.legs[0].label} · <span className="tnum">{fmtOdds(last.odds)}</span>
                    </span>
                  </motion.span>
                ) : (
                  <motion.span key="std" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-col items-start">
                    <span className="text-[15px] font-semibold">Betslip</span>
                    <span className="text-[12px] text-white/60">{ret.gt(0) ? `Return ${fmtMoney(ret)}` : n ? 'Add a stake' : 'Empty'}</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

function BottomNav() {
  return (
    <nav aria-label="Primary" className="relative z-30 grid shrink-0 grid-cols-4 border-t border-black/[.05] bg-canvas/90 pb-[max(6px,env(safe-area-inset-bottom))] backdrop-blur-xl @desk:hidden">
      {NAV.map((n) => (
        <NavLink key={n.to} to={n.to} className="relative flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-muted aria-[current=page]:text-ink">
          {({ isActive }) => (
            <>
              <n.icon size={22} strokeWidth={isActive ? 2.3 : 1.8} className={isActive ? 'text-action' : ''} />
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
  const pulse = useLanded()
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
            className="on-dark pointer-events-auto flex h-[60px] w-full max-w-[440px] items-center gap-3 rounded-full bg-ink pr-5 pl-2 text-white shadow-[0_18px_40px_-14px_rgba(16,24,43,.7)]"
          >
            <motion.span key={pulse} data-slip-target initial={{ scale: pulse ? 1.3 : 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 12 }} className="grid size-11 place-items-center rounded-full bg-action font-display text-[17px] font-[780] tnum">
              {n}
            </motion.span>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-[15px] font-semibold">Betslip</span>
              <span className="text-[12px] text-white/60">{ret.gt(0) ? `Return ${fmtMoney(ret)}` : 'Add a stake'}</span>
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
          <motion.div className="absolute inset-0 bg-[#0b0f1a]/45 backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.div
            className="relative mt-auto flex h-[calc(100%-24px)] flex-col overflow-hidden rounded-t-[30px] bg-canvas shadow-2xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
          >
            <div className="absolute top-2 left-1/2 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-line-strong" />
            <Betslip onClose={close} />
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
        <main ref={mainRef} id="main" className="thin-scrollbar relative min-h-0 flex-1 overflow-y-auto">
          {children}
          <div className="h-24 @desk:h-28" />
        </main>
        <div className="relative">
          <SlipBar />
          <BottomNav />
        </div>
        <SlipDock />
        <MobileSlipSheet />
        <div id="overlay-root" className="pointer-events-none absolute inset-0 z-50" />
      </FlyLayer>
    </div>
  )
}
