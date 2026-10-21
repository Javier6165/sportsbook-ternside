import clsx from 'clsx'
import { Monitor, Smartphone, SlidersHorizontal } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { useStore } from '../state/store'
import { Wordmark } from '../ui/Wordmark'

const PHONE_W = 390
const PHONE_H = 844
const BEZEL = 12

function useWindow() {
  const [w, setW] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))
  useEffect(() => {
    const f = () => setW({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  }, [])
  return w
}

function StatusBar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[90] flex h-[50px] items-center justify-between px-[34px] pt-1 text-white" aria-hidden="true">
      <span className="text-[15.5px] font-semibold tracking-[-.01em]">19:00</span>
      <span className="absolute top-[11px] left-1/2 h-[33px] w-[118px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-[6px]">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.3c2.3 0 4.4.9 6 2.4l1.2-1.3A10.3 10.3 0 0 0 8 .5C5.2.5 2.7 1.6.8 3.4L2 4.7a8.5 8.5 0 0 1 6-2.4Zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.7 6.7 0 0 0 8 4.1c-1.8 0-3.4.7-4.6 1.8l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3Zm0 3.5c-.6 0-1.1.2-1.5.6L8 11.5l1.5-1.5c-.4-.4-.9-.6-1.5-.6Z" /></svg>
        <span className="relative h-[13px] w-[27px] rounded-[4px] border border-white/45 p-[1.5px]">
          <span className="block h-full w-[78%] rounded-[2px] bg-white" />
          <span className="absolute top-[3.5px] -right-[3.5px] h-[5px] w-[2px] rounded-r bg-white/45" />
        </span>
      </span>
    </div>
  )
}

function ViewToggle({ mobile, onChange, dark = true }: { mobile: boolean; onChange: (m: boolean) => void; dark?: boolean }) {
  return (
    <div role="radiogroup" aria-label="Preview size" className={clsx('relative flex rounded-full p-1', dark ? 'bg-white/[.08] ring-1 ring-white/10' : 'bg-canvas')}>
      {[
        { m: false, label: 'Full', icon: Monitor },
        { m: true, label: 'Mobile', icon: Smartphone },
      ].map((o) => (
        <button
          key={o.label}
          role="radio"
          aria-checked={mobile === o.m}
          onClick={() => onChange(o.m)}
          className={clsx('relative z-10 flex h-8 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-semibold transition-colors', mobile === o.m ? 'text-nav' : 'text-white/70 hover:text-white')}
        >
          {mobile === o.m && <motion.span layoutId="view-pill" className="absolute inset-0 -z-10 rounded-full bg-white" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
          <o.icon size={14} /> {o.label}
        </button>
      ))}
    </div>
  )
}

/** Slim vertical dock in the left gutter, so it never covers product content. */
function SideDock({ mobile, onChange }: { mobile: boolean; onChange: (m: boolean) => void }) {
  return (
    <div className="group flex flex-col items-center gap-1 rounded-full bg-[#0b1120]/92 p-1.5 shadow-[0_12px_30px_-10px_rgba(0,0,0,.6)] ring-1 ring-white/10 backdrop-blur-md" role="radiogroup" aria-label="Preview size">
      <span className="py-1 text-[9px] font-bold tracking-[.12em] text-[#f5c04a] uppercase [writing-mode:vertical-rl] rotate-180">Demo</span>
      {[
        { m: false, label: 'Full view', icon: Monitor },
        { m: true, label: 'Mobile view', icon: Smartphone },
      ].map((o) => (
        <button
          key={o.label}
          role="radio"
          aria-checked={mobile === o.m}
          aria-label={o.label}
          title={o.label}
          onClick={() => onChange(o.m)}
          className={clsx('grid size-9 place-items-center rounded-full transition-colors', mobile === o.m ? 'bg-white text-nav' : 'text-white/70 hover:bg-white/10 hover:text-white')}
        >
          <o.icon size={16} />
        </button>
      ))}
    </div>
  )
}

/**
 * Presentation frame (F16 / SIM-01). The product tree is mounted once; switching
 * Full ↔ Mobile only changes the wrapper's size, so route, betslip, stakes and
 * balance survive. The phone is a real 390×844 layout (container queries), scaled
 * as a whole only when the window is too short to show it 1:1.
 */
export function DemoFrame({ children }: { children: ReactNode }) {
  const { s, d } = useStore()
  const win = useWindow()
  const realMobile = win.w < 760
  const mobile = !realMobile && s.view === 'mobile'
  const k = Math.min(1, (win.h - 48) / (PHONE_H + BEZEL * 2), (win.w - 48) / (PHONE_W + BEZEL * 2))

  return (
    <div className={clsx('relative h-full w-full overflow-hidden', mobile && 'bg-[#0b1120]')}>
      {mobile ? (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 size-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-action/25 blur-[140px]" />
          <div className="absolute -bottom-40 left-[10%] size-[500px] rounded-full bg-brand-dark/10 blur-[120px]" />
          <div className="absolute inset-0 opacity-[.06] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:56px_56px]" />
        </div>
      ) : null}

      <motion.div
        key="frame"
        initial={false}
        animate={mobile ? { scale: k, opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 32 }}
        className={clsx(
          mobile
            ? 'absolute top-1/2 left-1/2 rounded-[60px] bg-gradient-to-b from-[#2b3450] via-[#171e31] to-[#2b3450] p-[12px] shadow-[0_0_0_1.5px_#3a4562,0_60px_120px_-30px_rgba(0,0,0,.8),inset_0_0_0_1px_rgba(255,255,255,.08)]'
            : 'h-full w-full',
        )}
        style={
          mobile
            ? { width: PHONE_W + BEZEL * 2, height: PHONE_H + BEZEL * 2, marginLeft: -(PHONE_W / 2 + BEZEL), marginTop: -(PHONE_H / 2 + BEZEL), transformOrigin: '50% 50%' }
            : { transform: 'translateZ(0)' }
        }
      >
        <div className={clsx('relative overflow-hidden', mobile ? 'h-full w-full rounded-[48px] bg-nav pt-[50px] pb-[8px]' : 'h-full w-full')} style={{ transform: 'translateZ(0)' }}>
          {mobile ? <StatusBar /> : null}
          {children}
          {mobile ? <span className="pointer-events-none absolute bottom-[7px] left-1/2 z-[90] h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-white/85" aria-hidden="true" /> : null}
        </div>
      </motion.div>

      {/* Presentation controls — outside the sportsbook UI */}
      {!realMobile && (
        <div className={clsx('on-dark absolute z-[100]', mobile ? 'top-1/2 left-[max(24px,calc(50%-560px))] w-[280px] -translate-y-1/2' : 'top-1/2 left-2.5 -translate-y-1/2')}>
          {mobile ? (
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="hidden text-white min-[1120px]:block">
              <Wordmark size={44} />
              <p className="mt-3 text-[14px] leading-relaxed text-white/65">
                A fixed-odds sportsbook concept where every bet keeps the same readable ticket — before placement, in play and after settlement.
              </p>
              <p className="mt-4 text-[12.5px] text-white/45">Same session as Full view · 390 × 844 layout</p>
              <div className="mt-5">
                <ViewToggle mobile={mobile} onChange={(m) => d({ type: 'view', view: m ? 'mobile' : 'full' })} />
              </div>
              <p className="mt-6 border-t border-white/10 pt-4 text-[11.5px] leading-relaxed text-white/40">Fictional demo · no real money, events or accounts. Concept & design by Javier Ortiz.</p>
            </motion.div>
          ) : null}
          {!mobile ? (
            <SideDock mobile={mobile} onChange={(m) => d({ type: 'view', view: m ? 'mobile' : 'full' })} />
          ) : win.w < 1120 ? (
            <div className="fixed bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-[#0b1120]/90 p-1.5 pl-3 shadow-[0_12px_30px_-10px_rgba(0,0,0,.6)] ring-1 ring-white/10 backdrop-blur-md">
              <span className="flex items-center gap-1.5 pr-1 text-[11px] font-semibold tracking-[.08em] text-[#f5c04a] uppercase">
                <SlidersHorizontal size={13} /> Demo
              </span>
              <ViewToggle mobile={mobile} onChange={(m) => d({ type: 'view', view: m ? 'mobile' : 'full' })} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
