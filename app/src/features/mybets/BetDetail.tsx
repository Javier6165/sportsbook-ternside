import clsx from 'clsx'
import { ArrowLeft, Check, Copy, HandCoins, Info, Layers } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { EVENT_NOW, eventById, type SportEvent } from '../../data/catalog'
import { ruleFor } from '../../data/quotes'
import type { AcceptedBet } from '../../domain/bets'
import { D, fmtMoney, fmtOdds } from '../../domain/money'
import { dayLabel, kickoffTime } from '../../lib/time'
import { mainPrices, useLiveClock, useLiveEvent, useStore } from '../../state/store'
import { Crest } from '../../ui/Crest'
import { LiveBadge } from '../../ui/LiveBadge'
import { matchGradient } from '../../ui/MatchField'
import { Perforation } from '../../ui/Perforation'
import { Inspector } from '../event/Inspector'
import { NotFound } from '../NotFound'
import { STATUS_CHIP, legIcon } from './BetPass'

const ease = [0.16, 1, 0.3, 1] as const
const fmtTime = (iso: string) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))

/** Live reading of a leg — an observation, never a result (F09). */
function liveReading(ev: SportEvent | undefined, selectionId: string): { text: string; tone: 'good' | 'bad' | 'neutral' | 'warn' } | null {
  if (!ev || ev.status !== 'live' || !ev.live) return null
  const [h, a] = ev.live.score
  if (ev.sport !== 'football') return { text: 'In play', tone: 'neutral' }
  const goals = h + a
  if (selectionId === 'OVER_2_5') return goals >= 3 ? { text: `${goals} goals · line reached, provisional`, tone: 'good' } : { text: `${goals} of 3 goals`, tone: 'neutral' }
  if (selectionId === 'UNDER_2_5') return goals >= 3 ? { text: `${goals} goals · can no longer win`, tone: 'bad' } : { text: `${goals} goals so far`, tone: 'good' }
  if (selectionId === 'PLAYER_2_SOT') {
    const sot = ev.live.sot ?? 0
    if (ev.live.delayed) return { text: `${sot} of 2 shots · stats delayed`, tone: 'warn' }
    if (ev.live.corrected) return { text: `Corrected 2 → ${sot} · ${sot} of 2 shots`, tone: 'warn' }
    return sot >= 2 ? { text: `${sot} of 2 shots · reached, provisional`, tone: 'good' } : { text: `${sot} of 2 shots on target`, tone: 'neutral' }
  }
  const lead = h > a ? 'HOME' : a > h ? 'AWAY' : 'DRAW'
  if (selectionId === lead) return { text: selectionId === 'DRAW' ? 'Level now' : 'Ahead now', tone: 'good' }
  return { text: lead === 'DRAW' ? 'Level now' : 'Behind now', tone: 'bad' }
}

function useCashOutOffer(bet: AcceptedBet) {
  const { tick } = useLiveClock()
  const ev = eventById(bet.legs[0].eventId)
  if (bet.status !== 'open' || bet.type === 'acca') return null
  if (!ev) return null
  let factor = 0.9
  if (ev.status === 'live' && bet.type === 'single') {
    const idx = ev.markets[0].selections.findIndex((x) => x.id === bet.legs[0].selectionId)
    if (idx >= 0) factor = (Number(bet.odds) / Number(mainPrices(ev, tick)[idx])) * 0.95
  } else if (bet.type === 'builder') factor = 0.8
  const amount = D(bet.stake).times(factor).toDecimalPlaces(2, 1)
  return amount.lt(0.1) ? D('0.10') : amount
}

function CashOut({ bet }: { bet: AcceptedBet }) {
  const { d } = useStore()
  const { elapsed } = useLiveClock()
  const offer = useCashOutOffer(bet)
  const [confirm, setConfirm] = useState<string | null>(null)
  const [changed, setChanged] = useState(false)
  const { s } = useStore()
  if (!offer) return null
  const net = offer.minus(bet.stake)
  if (s.pendingOp) return <section className="rounded-[24px] bg-surface p-5 text-[13.5px] text-secondary"><b className="font-semibold text-ink">Cash Out is paused</b> while we check another bet.</section>
  return (
    <section className="rounded-[24px] bg-surface p-5">
      <div className="flex items-center gap-2">
        <HandCoins size={18} className="text-action" />
        <h3 className="font-display text-[19px] font-[760] tracking-[-0.03em]">Cash Out</h3>
        <span className="ml-auto text-[12px] text-secondary">Full Cash Out only</span>
      </div>
      <p className="mt-2 text-[13.5px] text-secondary">Close this bet now for a fixed amount. The offer moves with the match and can disappear.</p>
      <AnimatePresence mode="wait">
        {confirm ? (
          <motion.div key="confirm" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 rounded-[18px] bg-chip p-4">
            {changed && <div className="mb-2 rounded-[12px] bg-warn px-3 py-2 text-[12.5px] font-medium text-warn-ink">The offer changed. Check the new amount before confirming.</div>}
            <div className="font-display text-[20px] font-[760] tracking-[-0.03em]">Cash Out {fmtMoney(confirm)}?</div>
            <p className="mt-1 text-[13px] text-secondary">
              Your bet closes now. On a {fmtMoney(bet.stake)} stake that’s{' '}
              <b className={clsx('font-semibold', D(confirm).minus(bet.stake).lt(0) ? 'text-lost-ink' : 'text-won-ink')}>
                {D(confirm).minus(bet.stake).lt(0) ? `${fmtMoney(D(confirm).minus(bet.stake).abs())} net loss` : `${fmtMoney(D(confirm).minus(bet.stake))} net profit`}
              </b>
              . It’s not the same as withdrawing funds.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={() => setConfirm(null)} className="h-11 rounded-[14px] bg-surface text-[14px] font-semibold">
                Keep bet
              </button>
              <button
                onClick={() => {
                  if (!offer.eq(confirm)) {
                    setChanged(true)
                    setConfirm(offer.toFixed(2))
                    return
                  }
                  d({ type: 'cashOut', betId: bet.id, amount: confirm, at: new Date(Date.parse(EVENT_NOW) + elapsed * 1000).toISOString() })
                }}
                className="h-11 rounded-[14px] bg-ink text-[14px] font-semibold text-white"
              >
                Confirm {fmtMoney(confirm)}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="offer"
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setChanged(false)
              setConfirm(offer.toFixed(2))
            }}
            className="mt-4 flex h-14 w-full items-center justify-between rounded-[18px] bg-chip px-5 hover:bg-chip-hover"
          >
            <span className="text-[14px] font-semibold">Cash Out</span>
            <span className="text-right">
              <span className="block font-display text-[22px] leading-none font-[780] tracking-[-0.03em] tnum">{fmtMoney(offer)}</span>
              <span className={clsx('text-[11.5px] font-semibold', net.lt(0) ? 'text-lost-ink' : 'text-won-ink')}>{net.lt(0) ? `${fmtMoney(net.abs())} below stake` : `${fmtMoney(net)} above stake`}</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  )
}

function Receipt({ bet }: { bet: AcceptedBet }) {
  const [copied, setCopied] = useState(false)
  const rows = [
    ['Receipt', bet.id],
    ['Placed', fmtTime(bet.placedAt)],
    ['Accepted odds', fmtOdds(bet.odds)],
    ['Stake', fmtMoney(bet.stake)],
    ['Rules', bet.rules],
  ]
  return (
    <section className="rounded-[24px] bg-surface p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-[19px] font-[760] tracking-[-0.03em]">Receipt</h3>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(bet.id).catch(() => {})
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
          }}
          className="flex h-9 items-center gap-1.5 rounded-full bg-chip px-3 text-[12.5px] font-semibold hover:bg-chip-hover"
          aria-live="polite"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy ID'}
        </button>
      </div>
      <dl className="mt-3">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between border-t border-line py-2.5 text-[13.5px] first:border-t-0">
            <dt className="text-secondary">{k}</dt>
            <dd className="font-semibold tnum">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function BetDetail() {
  const { betId } = useParams()
  const { s } = useStore()
  const nav = useNavigate()
  const bet = s.bets.find((b) => b.id === betId)
  const ev = bet ? eventById(bet.legs[0].eventId) : undefined
  const { minute } = useLiveEvent(ev ?? ({ id: '', status: 'scheduled', markets: [{ selections: [] }] } as never))
  const [rulesOpen, setRulesOpen] = useState(false)
  if (!bet) return <NotFound what="bet" />

  const title = bet.type === 'acca' ? `${bet.legs.length}-fold accumulator` : bet.type === 'builder' ? 'Bet Builder' : bet.legs[0].label
  const gross = bet.settlement ? D(bet.settlement.gross) : null
  const net = gross ? gross.minus(bet.stake) : null
  const chip = STATUS_CHIP[bet.status]
  const live = ev?.status === 'live'
  const labels = Object.fromEntries(bet.legs.map((l) => [l.selectionId, l.label]))
  const canExplore = bet.type === 'builder' && bet.legs[0].eventId === 'football-01' && bet.status === 'open'

  return (
    <div className="mx-auto max-w-[1220px] px-4 pt-5 @tab:px-8 @tab:pt-8">
      <button onClick={() => nav(-1)} className="mb-4 flex h-10 items-center gap-1.5 rounded-full bg-surface pr-4 pl-3 text-[13.5px] font-semibold hover:bg-chip">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="grid gap-4 @desk:grid-cols-[minmax(0,1fr)_380px]">
        <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="overflow-hidden rounded-[30px] bg-surface shadow-[0_24px_60px_-34px_rgba(16,24,43,.4)]">
          <div className={clsx('on-dark relative px-6 pt-6 pb-7 text-white', bet.status === 'lost' && 'saturate-[.35]')} style={{ background: ev && bet.type !== 'acca' ? matchGradient(ev) : 'linear-gradient(105deg,#1a2a6b,#2948ff 60%,#86a8ff)' }}>
            <div className="flex items-center gap-2 text-[13px] font-semibold text-white/80">
              {bet.type !== 'single' && <Layers size={14} />}
              {bet.type === 'acca' ? 'Accumulator · every selection must win' : bet.legs[0].eventLabel}
              <span className={clsx('ml-auto rounded-full px-2.5 py-1 text-[11.5px] font-bold', chip.cls)}>{chip.label}</span>
            </div>
            {ev && bet.type !== 'acca' && (
              <div className="mt-5 flex items-center gap-4">
                <Crest team={ev.home} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[30px] leading-none font-[800] tracking-[-0.045em] @tab:text-[40px]">{title}</div>
                  <div className="mt-1.5 text-[13px] text-white/75">
                    {live ? (
                      <span className="flex items-center gap-2"><LiveBadge tone="solid" clock={ev.sport === 'football' ? `${minute}'` : ev.live!.period} /><span className="font-display text-[18px] font-[800] text-white tnum">{ev.live!.score[0]}–{ev.live!.score[1]}</span></span>
                    ) : bet.status === 'open' ? (
                      `${dayLabel(ev.startsAt)} · ${kickoffTime(ev.startsAt)} · not started`
                    ) : (
                      'Full time'
                    )}
                  </div>
                </div>
                <Crest team={ev.away} size={40} />
              </div>
            )}
            {bet.type === 'acca' && <div className="mt-5 font-display text-[34px] leading-none font-[800] tracking-[-0.045em]">{title}</div>}
          </div>

          <ol className="px-6 pt-5">
            {bet.legs.map((l, i) => {
              const res = bet.settlement?.legResults?.[l.selectionId]
              const reading = !res ? liveReading(eventById(l.eventId), l.selectionId) : null
              return (
                <li key={l.eventId + l.selectionId} className="relative flex gap-3 pb-5 last:pb-2">
                  {i < bet.legs.length - 1 && <span className="absolute top-6 bottom-0 left-[9px] w-[2px] rounded bg-sel" />}
                  <span className="relative mt-0.5 shrink-0">{legIcon(res, reading?.tone)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className={clsx('text-[16px] font-semibold', res === 'void' && 'text-void-ink line-through')}>{l.label}</span>
                      {res ? (
                        <span className={clsx('text-[12.5px] font-semibold', res === 'won' ? 'text-won-ink' : res === 'lost' ? 'text-lost-ink' : 'text-void-ink')}>{res === 'void' ? 'Void — removed' : res === 'won' ? 'Won' : 'Lost'}</span>
                      ) : reading ? (
                        <span className={clsx('text-[12.5px] font-semibold', reading.tone === 'good' ? 'text-won-ink' : reading.tone === 'bad' ? 'text-lost-ink' : reading.tone === 'warn' ? 'text-warn-ink' : 'text-secondary')}>{reading.text}</span>
                      ) : (
                        <span className="text-[12.5px] font-semibold text-secondary">Not started</span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] text-secondary">
                      {bet.type === 'acca' ? `${l.eventLabel} · ` : ''}
                      {l.marketName} · {l.period}
                      {bet.type !== 'builder' && ` · ${fmtOdds(l.odds)}`}
                    </span>
                  </span>
                </li>
              )
            })}
          </ol>

          {live && bet.status === 'open' && (
            <div className="mx-6 mb-3 rounded-[14px] bg-chip px-4 py-3 text-[12.5px] leading-snug text-secondary">
              <b className="font-semibold text-ink">Nothing is paid from the live score.</b> Green means it’s going your way right now; the bet settles on the official result.
              {ev?.live?.corrected && !ev.live.delayed && <span className="mt-1 block text-warn-ink">The data provider reclassified one of Costa’s shots. Your bet hasn’t changed — only the live count.</span>}
              {ev?.live?.delayed && <span className="mt-1 block text-warn-ink">Live stats are delayed. We’re showing the last update and won’t treat missing data as zero.</span>}
            </div>
          )}
          <div className="px-6">
            <button onClick={() => setRulesOpen((r) => !r)} aria-expanded={rulesOpen} className="flex items-center gap-1.5 text-[13px] font-semibold text-sel-ink hover:underline">
              <Info size={14} /> How this bet works
            </button>
            <AnimatePresence initial={false}>
              {rulesOpen && (
                <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-1.5 overflow-hidden pt-2 text-[13px] leading-snug text-secondary">
                  {bet.type !== 'single' && <li>· Every condition must win. One loss settles the bet.</li>}
                  {[...new Set(bet.legs.map((l) => l.marketName))].map((mn) => {
                    const leg = bet.legs.find((l) => l.marketName === mn)!
                    const mk = eventById(leg.eventId)?.markets.find((m) => m.name === mn)
                    return <li key={mn}>· {ruleFor(mk?.id ?? '', eventById(leg.eventId)?.sport ?? 'football')}</li>
                  })}
                  <li>· Live scores are observations. Nothing is paid until the official result.</li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <Perforation notch="bg-canvas" />

          <div className="grid grid-cols-2 gap-4 px-6 pb-6 text-[12.5px] text-secondary">
            <div>
              Stake
              <div className="font-display text-[26px] font-[780] tracking-[-0.03em] text-ink tnum">{fmtMoney(bet.stake)}</div>
            </div>
            <div className="text-right">
              {bet.status === 'open' ? 'Potential return · includes stake' : bet.status === 'cashed_out' ? 'Cashed out for' : 'Returned'}
              <div className={clsx('font-display text-[26px] font-[780] tracking-[-0.03em] tnum', bet.status === 'won' ? 'text-won-ink' : 'text-ink')}>{fmtMoney(gross ?? bet.potentialReturn)}</div>
              {net && <div className="font-semibold">{net.isZero() ? 'Net £0.00' : net.gt(0) ? `+${fmtMoney(net)} net profit` : `${fmtMoney(net.abs())} net loss`}</div>}
            </div>
          </div>
          {bet.settlement && (
            <div className={clsx('mx-6 mb-6 rounded-[18px] p-4 text-[13.5px]', bet.status === 'won' ? 'bg-won text-won-ink' : bet.status === 'lost' ? 'bg-lost text-lost-ink' : bet.status === 'void' ? 'bg-void text-void-ink' : 'bg-sel text-sel-ink')}>
              <div className="font-semibold">{bet.settlement.reason}</div>
              {bet.settlement.odds && bet.settlement.odds !== bet.odds && bet.status === 'won' && (
                <div className="mt-1 opacity-85">
                  Accepted at {fmtOdds(bet.odds)} · settled at {fmtOdds(bet.settlement.odds)} after a void condition.
                </div>
              )}
              <div className="mt-1 text-[12px] opacity-70">
                {bet.settlement.version && bet.settlement.version > 1 ? `Version ${bet.settlement.version} · updated` : 'Settled'} {fmtTime(bet.settlement.at)}
              </div>
              {bet.settlement.history && (
                <ul className="mt-3 border-t border-current/15 pt-3">
                  {bet.settlement.history.map((h) => (
                    <li key={h.version} className="text-[12.5px] opacity-80">
                      <span className="font-semibold">Version {h.version} · {STATUS_CHIP[h.status].label} {fmtMoney(h.gross)}</span> — {h.reason} {fmtTime(h.at)}. Replaced; kept for your records.
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </motion.article>

        <div className="space-y-4">
          <CashOut bet={bet} />
          <Receipt bet={bet} />
          {ev && (
            <Link to={`/event/${ev.id}`} className="flex items-center justify-between rounded-[24px] bg-surface p-5 hover:bg-chip">
              <span className="font-semibold">Go to match</span>
              <span className="text-[13px] text-secondary">{ev.home.short} v {ev.away.short}</span>
            </Link>
          )}
        </div>
      </div>
      {canExplore && (
        <div className="mt-4">
          <Inspector sels={bet.legs.map((l) => l.selectionId)} labels={labels} stake={bet.stake} />
        </div>
      )}
    </div>
  )
}
