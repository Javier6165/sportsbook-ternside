import clsx from 'clsx'
import { AlertTriangle, ArrowLeft, Check, Layers } from 'lucide-react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { eventById } from '../../data/catalog'
import type { AcceptedBet } from '../../domain/bets'
import { D, fmtMoney, fmtOdds } from '../../domain/money'
import { matchGradient } from '../../ui/MatchField'

const ease = [0.16, 1, 0.3, 1] as const

export function BetMiniPass({ bet, stamped, i = 0 }: { bet: AcceptedBet; stamped?: boolean; i?: number }) {
  const ev = eventById(bet.legs[0].eventId)
  const title = bet.type === 'acca' ? `${bet.legs.length}-fold accumulator` : bet.type === 'builder' ? 'Bet Builder' : bet.legs[0].label
  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.08, duration: 0.5, ease }}
      className="relative overflow-hidden rounded-[22px] bg-surface"
    >
      <div className="h-2" style={{ background: ev && bet.type !== 'acca' ? matchGradient(ev) : 'linear-gradient(90deg,#2948ff,#86a8ff)' }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-secondary">
              {bet.type !== 'single' && <Layers size={12} />}
              {bet.type === 'acca' ? 'All must win' : bet.legs[0].eventLabel}
            </div>
            <div className="mt-0.5 truncate font-display text-[18px] leading-tight font-[740] tracking-[-0.03em]">{title}</div>
            {bet.type !== 'single' && (
              <ul className="mt-1.5 space-y-0.5 text-[12.5px] text-secondary">
                {bet.legs.map((l) => (
                  <li key={l.eventId + l.selectionId} className="truncate">
                    · {l.label}
                    {bet.type === 'acca' && <span className="text-muted"> — {l.eventLabel}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="font-display text-[20px] font-[760] tracking-[-0.03em] tnum">{fmtOdds(bet.odds)}</div>
        </div>
        <div className="mt-3 flex items-end justify-between border-t border-dashed border-line-strong pt-3 text-[12px] text-secondary">
          <span>
            Stake <b className="ml-1 text-[14px] font-semibold text-ink tnum">{fmtMoney(bet.stake)}</b>
          </span>
          <span className="text-right">
            Potential return <b className="ml-1 text-[14px] font-semibold text-ink tnum">{fmtMoney(bet.potentialReturn)}</b>
          </span>
        </div>
        {stamped && <div className="mt-2 text-[11px] font-semibold text-muted tnum">Receipt {bet.id}</div>}
      </div>
      {stamped && (
        <motion.span
          initial={{ scale: 2.2, opacity: 0, rotate: -24 }}
          animate={{ scale: 1, opacity: 1, rotate: -12 }}
          transition={{ delay: 0.25 + i * 0.12, type: 'spring', stiffness: 420, damping: 16 }}
          className="pointer-events-none absolute right-5 bottom-[52px] rounded-[8px] border-[2.5px] border-action px-2 py-0.5 font-display text-[15px] font-[800] tracking-[.04em] text-action uppercase"
        >
          Accepted
        </motion.span>
      )}
    </motion.li>
  )
}

export function ReviewStep({
  planned,
  available,
  blocked,
  onBack,
  onPlace,
}: {
  planned: AcceptedBet[]
  available: string
  blocked: string | null
  onBack: () => void
  onPlace: () => void
}) {
  const total = planned.reduce((t, b) => t.plus(b.stake), D(0))
  const ret = planned.reduce((t, b) => t.plus(b.potentialReturn), D(0))
  const after = D(available).minus(total)
  const short = after.lt(0)
  const nav = useNavigate()
  return (
    <div className="flex h-full min-h-0 flex-col bg-canvas">
      <div className="flex items-center gap-2 px-5 pt-5 pb-3">
        <button onClick={onBack} aria-label="Back to betslip" className="grid size-10 place-items-center rounded-full bg-chip hover:bg-chip-hover">
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-display text-[26px] leading-none font-[800] tracking-[-0.045em]">Review</h2>
        <span className="ml-auto text-[12.5px] font-semibold text-secondary">
          {planned.length} {planned.length === 1 ? 'bet' : 'bets'}
        </span>
      </div>
      <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <ul className="space-y-3">
          {planned.map((b, i) => (
            <BetMiniPass key={b.id} bet={b} i={i} />
          ))}
        </ul>
        <p className="mt-4 px-1 text-[12px] leading-relaxed text-secondary">
          Prices are fixed when we accept your bet. If a price moves before then, we’ll ask you again — we never accept a different price on your behalf. Rules: RULES-GB-01 rev 0.4.
        </p>
      </div>
      <div className="border-t border-line bg-surface px-5 pt-4 pb-5">
        <dl className="grid grid-cols-3 gap-2 text-[12px] text-secondary">
          <div>
            <dt>Total stake</dt>
            <dd className="mt-0.5 font-display text-[18px] font-[760] text-ink tnum">{fmtMoney(total)}</dd>
          </div>
          <div>
            <dt>Potential return</dt>
            <dd className="mt-0.5 font-display text-[18px] font-[760] text-ink tnum">{fmtMoney(ret)}</dd>
          </div>
          <div className="text-right">
            <dt>Balance after</dt>
            <dd className={clsx('mt-0.5 font-display text-[18px] font-[760] tnum', short ? 'text-lost-ink' : 'text-ink')}>{fmtMoney(after)}</dd>
          </div>
        </dl>
        {(short || blocked) && (
          <div className="mt-3 flex items-center gap-2 rounded-[14px] bg-warn px-3 py-2.5 text-[12.5px] text-warn-ink">
            <AlertTriangle size={15} className="shrink-0" />
            <span className="flex-1">{short ? 'Not enough demo funds for these stakes.' : blocked}</span>
            {short && (
              <button onClick={() => nav('/wallet')} className="rounded-full bg-warn-ink px-3 py-1 text-[12px] font-semibold text-white">
                Deposit
              </button>
            )}
          </div>
        )}
        <motion.button
          whileTap={!short && !blocked ? { scale: 0.98 } : undefined}
          onClick={() => !short && !blocked && onPlace()}
          aria-disabled={short || !!blocked}
          className={clsx('mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-[18px] text-[16px] font-semibold', short || blocked ? 'bg-chip text-muted' : 'bg-action text-white shadow-[0_14px_30px_-14px_rgba(41,72,255,1)] hover:bg-action-hover')}
        >
          <Check size={18} strokeWidth={2.6} /> Place {planned.length === 1 ? 'bet' : `${planned.length} bets`} · <span className="tnum">{fmtMoney(total)}</span>
        </motion.button>
      </div>
    </div>
  )
}

export function PlacingStep({ planned }: { planned: AcceptedBet[] }) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-canvas px-8 text-center">
      <div className="relative h-[150px] w-[220px]" aria-hidden="true">
        {planned.slice(0, 3).map((b, i) => (
          <motion.div
            key={b.id}
            className="absolute inset-x-0 top-4 h-[110px] rounded-[20px] bg-surface shadow-[0_20px_40px_-24px_rgba(16,24,43,.5)]"
            initial={{ y: 30, opacity: 0, rotate: (i - 1) * 6 }}
            animate={{ y: [-4 * i, -4 * i - 8, -4 * i], opacity: 1 }}
            transition={{ y: { duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }, opacity: { duration: 0.3 } }}
            style={{ zIndex: 3 - i }}
          >
            <div className="h-7 rounded-t-[20px]" style={{ background: 'linear-gradient(90deg,#13204A,#C8102E)' }} />
          </motion.div>
        ))}
      </div>
      <div className="mt-6 font-display text-[22px] font-[780] tracking-[-0.04em]" role="status">
        Placing your {planned.length === 1 ? 'bet' : 'bets'}…
      </div>
      <p className="mt-1 text-[13.5px] text-secondary">Checking prices, balance and your account.</p>
    </div>
  )
}

export function DoneStep({ placed, onClose }: { placed: AcceptedBet[]; onClose: () => void }) {
  const nav = useNavigate()
  return (
    <div className="flex h-full min-h-0 flex-col bg-canvas">
      <div className="px-5 pt-6 pb-3 text-center">
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 14 }} className="mx-auto grid size-14 place-items-center rounded-full bg-action text-white">
          <Check size={28} strokeWidth={3} />
        </motion.span>
        <h2 className="mt-3 font-display text-[28px] leading-none font-[800] tracking-[-0.045em]">{placed.length === 1 ? 'Bet placed' : `${placed.length} bets placed`}</h2>
        <p className="mt-1.5 text-[13.5px] text-secondary">The same tickets now live in My Bets, where you can follow every condition.</p>
      </div>
      <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <ul className="space-y-3">
          {placed.map((b, i) => (
            <BetMiniPass key={b.id} bet={b} stamped i={i} />
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-2 gap-2 border-t border-line bg-surface px-5 pt-4 pb-5">
        <button onClick={onClose} className="h-12 rounded-[16px] bg-chip text-[15px] font-semibold hover:bg-chip-hover">
          Done
        </button>
        <button
          onClick={() => {
            onClose()
            nav(placed.length === 1 ? `/bets/${placed[0].id}` : '/my-bets')
          }}
          className="h-12 rounded-[16px] bg-ink text-[15px] font-semibold text-white hover:bg-black"
        >
          {placed.length === 1 ? 'Track bet' : 'View in My Bets'}
        </button>
      </div>
    </div>
  )
}
