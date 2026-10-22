import clsx from 'clsx'
import { Ban, Check, ChevronRight, Layers, X } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { eventById } from '../../data/catalog'
import type { AcceptedBet, BetStatus } from '../../domain/bets'
import { D, fmtMoney, fmtOdds } from '../../domain/money'
import { dayLabel, kickoffTime } from '../../lib/time'
import { useLiveEvent } from '../../state/store'
import { BRAND_GRADIENT, matchGradient } from '../../ui/MatchField'
import { LiveBadge } from '../../ui/LiveBadge'

export const STATUS_CHIP: Record<BetStatus, { label: string; cls: string }> = {
  open: { label: 'Open', cls: 'bg-white/20 text-white' },
  won: { label: 'Won', cls: 'bg-won text-won-ink' },
  lost: { label: 'Lost', cls: 'bg-lost text-lost-ink' },
  void: { label: 'Void', cls: 'bg-void text-void-ink' },
  cashed_out: { label: 'Cashed out', cls: 'bg-sel text-sel-ink' },
}

function WhenChip({ eventId }: { eventId: string }) {
  const ev = eventById(eventId)
  const live = useLiveEvent(ev ?? ({ id: '', status: 'scheduled', markets: [{ selections: [] }] } as never))
  if (!ev) return null
  if (ev.outright) return <span className="text-[12.5px] font-semibold text-white/80">Outright</span>
  if (ev.status === 'live')
    return (
      <LiveBadge tone="solid" clock={ev.sport === 'football' ? `${live.minute}'` : ev.live?.period} />
    )
  return (
    <span className="text-[12.5px] font-semibold text-white/80">
      {dayLabel(ev.startsAt)} · {kickoffTime(ev.startsAt)}
    </span>
  )
}

export function legIcon(r?: 'won' | 'lost' | 'void', tone?: 'good' | 'bad' | 'neutral' | 'warn') {
  if (r === 'won') return <span className="grid size-5 shrink-0 place-items-center rounded-full bg-won-ink text-white"><Check size={12} strokeWidth={3} /></span>
  if (r === 'lost') return <span className="grid size-5 place-items-center rounded-full bg-lost-ink text-white"><X size={12} strokeWidth={3} /></span>
  if (r === 'void') return <span className="grid size-5 place-items-center rounded-full bg-void-ink text-white"><Ban size={11} strokeWidth={3} /></span>
  if (tone && tone !== 'neutral')
    return (
      <span className={'relative grid size-5 place-items-center rounded-full border-[2.5px] bg-surface ' + (tone === 'good' ? 'border-won-ink' : tone === 'bad' ? 'border-lost-ink' : 'border-warn-ink')}>
        <span className={'size-2 animate-pulse rounded-full ' + (tone === 'good' ? 'bg-won-ink' : tone === 'bad' ? 'bg-lost-ink' : 'bg-warn-ink')} />
      </span>
    )
  return <span className="block size-5 rounded-full border-[2.5px] border-action bg-surface" />
}

export function BetPass({ bet, i = 0, compact }: { bet: AcceptedBet; i?: number; compact?: boolean }) {
  const ev = eventById(bet.legs[0].eventId)
  const title = bet.type === 'acca' ? `${bet.legs.length}-fold accumulator` : bet.type === 'builder' ? 'Bet Builder' : bet.legs[0].label
  const settled = bet.status !== 'open'
  const gross = bet.settlement ? D(bet.settlement.gross) : D(0)
  // A free-bet stake was never the customer’s money, so the net is the whole return.
  const net = bet.freeBet ? gross : gross.minus(bet.stake)
  const chip = STATUS_CHIP[bet.status]
  const bg = ev && bet.type !== 'acca' ? matchGradient(ev) : bet.type === 'acca' ? BRAND_GRADIENT : 'linear-gradient(105deg,#3a4256,#596579)'

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={clsx('relative overflow-hidden rounded-[26px] bg-surface', settled && bet.status !== 'won' && 'opacity-[.97]')}
    >
      <Link to={`/bets/${bet.id}`} className="block">
        <div className={clsx('on-dark flex items-center gap-2 px-5 py-3.5 text-white', settled && bet.status === 'lost' && 'saturate-[.35]')} style={{ background: bg }}>
          {bet.type !== 'single' && <Layers size={14} />}
          <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">{bet.type === 'acca' ? 'Accumulator · all must win' : bet.legs[0].eventLabel}</span>
          {bet.status === 'open' && bet.type !== 'acca' ? <WhenChip eventId={bet.legs[0].eventId} /> : <span className={clsx('rounded-full px-2.5 py-1 text-[11.5px] font-bold', chip.cls)}>{chip.label}{bet.settlement?.version && bet.settlement.version > 1 ? ' · updated' : ''}</span>}
        </div>
        <div className="px-5 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="min-w-0 font-display text-[20px] leading-tight font-[760] tracking-[-0.035em]">{title}</h3>
            <span className="font-display text-[22px] font-[780] tracking-[-0.03em] tnum">{fmtOdds(bet.odds)}</span>
          </div>
          {!compact && bet.type !== 'single' && (
            <ol className="mt-3 space-y-2.5">
              {bet.legs.map((l) => (
                <li key={l.eventId + l.selectionId} className="flex items-center gap-2.5 text-[14px]">
                  {legIcon(bet.settlement?.legResults?.[l.selectionId])}
                  <span className={clsx('min-w-0 flex-1 truncate font-medium', bet.settlement?.legResults?.[l.selectionId] === 'void' && 'text-void-ink line-through')}>{l.label}</span>
                  {bet.type === 'acca' && <span className="text-[12px] text-muted tnum">{fmtOdds(l.odds)}</span>}
                </li>
              ))}
            </ol>
          )}
          {bet.type === 'single' && <div className="mt-0.5 text-[12.5px] text-secondary">{bet.legs[0].marketName} · {bet.legs[0].period}</div>}
        </div>
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-dashed border-line-strong px-5 py-4 text-[12px] text-secondary">
          <span>
            {bet.freeBet ? 'Free bet' : 'Stake'}
            <b className="block font-display text-[18px] font-[760] text-ink tnum">{fmtMoney(bet.stake)}</b>
            {bet.promo === 'two-up' && <span className="mt-1 inline-block rounded-full bg-won px-2 py-0.5 text-[11px] font-bold text-won-ink">Paid early · 2 Goals Ahead</span>}
          </span>
          {settled ? (
            <span className="text-right">
              {bet.status === 'cashed_out' ? 'Cashed out for' : bet.status === 'void' ? 'Returned' : 'Returned'}
              <b className={clsx('block font-display text-[18px] font-[760] tnum', bet.status === 'won' ? 'text-won-ink' : 'text-ink')}>
                {fmtMoney(gross)} <span className="text-[12px] font-semibold text-secondary">· {net.isZero() ? 'net £0.00' : `${net.gt(0) ? '+' : ''}${fmtMoney(net)} net`}</span>
              </b>
            </span>
          ) : (
            <span className="text-right">
              Potential return
              <b className="block font-display text-[18px] font-[760] text-ink tnum">{fmtMoney(bet.potentialReturn)}</b>
            </span>
          )}
          <ChevronRight size={18} className="mb-1 text-muted" />
        </div>
      </Link>
    </motion.article>
  )
}
