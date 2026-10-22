import { Clock } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { EVENT_NOW } from '../../data/catalog'
import { D, fmtMoney } from '../../domain/money'
import { useLiveClock, useStore } from '../../state/store'
import { useModal } from '../../ui/useModal'

/** Reality check: time on site and this session’s stakes and returns, at the interval the customer chose. */
export function RealityCheck() {
  const { s, d } = useStore()
  const { elapsed } = useLiveClock()
  const nav = useNavigate()
  const open = s.realityOpen
  const close = () => d({ type: 'patch', patch: { realityOpen: false } })
  const ref = useModal<HTMLDivElement>(open, close)

  useEffect(() => {
    if (s.realityCheckMin && elapsed > 0 && elapsed % (s.realityCheckMin * 60) === 0) d({ type: 'patch', patch: { realityOpen: true } })
  }, [elapsed, s.realityCheckMin, d])

  const session = s.bets.filter((b) => Date.parse(b.placedAt) >= Date.parse(EVENT_NOW))
  const staked = session.reduce((t, b) => (b.freeBet ? t : t.plus(b.stake)), D(0))
  const returned = session.reduce((t, b) => t.plus(b.settlement?.gross ?? 0), D(0))
  const mins = Math.max(1, Math.round(elapsed / 60))

  return (
    <AnimatePresence>
      {open && (
        <motion.div ref={ref} className="pointer-events-auto absolute inset-0 z-[60] grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="rc-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-[#0b0f1a]/50 backdrop-blur-[3px]" onClick={close} />
          <motion.div initial={{ y: 20, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 34 }} className="relative w-full max-w-[420px] rounded-[28px] bg-surface p-6 shadow-2xl">
            <span className="grid size-12 place-items-center rounded-full bg-sel text-sel-ink">
              <Clock size={22} />
            </span>
            <h2 id="rc-title" className="mt-4 font-display text-[26px] leading-tight font-[800] tracking-[-0.04em]">
              You’ve been here {mins} {mins === 1 ? 'minute' : 'minutes'}
            </h2>
            <dl className="mt-4 grid grid-cols-3 gap-2 rounded-[18px] bg-chip p-3.5 text-[12px] text-secondary">
              <div>
                <dt>Bets this session</dt>
                <dd className="font-display text-[19px] font-[760] text-ink tnum">{session.length}</dd>
              </div>
              <div>
                <dt>Staked</dt>
                <dd className="font-display text-[19px] font-[760] text-ink tnum">{fmtMoney(staked)}</dd>
              </div>
              <div>
                <dt>Returned so far</dt>
                <dd className="font-display text-[19px] font-[760] text-ink tnum">{fmtMoney(returned)}</dd>
              </div>
            </dl>
            <div className="mt-5 grid gap-2">
              <button onClick={close} className="h-12 rounded-[16px] bg-ink text-[15px] font-semibold text-white">
                Continue
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => (close(), nav('/my-bets'))} className="h-11 rounded-[14px] bg-chip text-[14px] font-semibold">
                  See my bets
                </button>
                <button onClick={() => (close(), nav('/safer-gambling'))} className="h-11 rounded-[14px] bg-chip text-[14px] font-semibold">
                  Take a break
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
