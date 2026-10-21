import clsx from 'clsx'
import { AlertTriangle, ArrowRight, Info, Layers, Ticket, Trash2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { eventById } from '../../data/catalog'
import { accaOdds, D, fmtMoney, fmtOdds, grossReturn, isValidStake } from '../../domain/money'
import { currentOdds, useLiveClock, useStore, type DraftGroup } from '../../state/store'
import { CountUp } from '../../ui/CountUp'
import { LAND_EVENT } from '../../ui/fly'

const ease = [0.16, 1, 0.3, 1] as const
const money = (n: number) => fmtMoney(n.toFixed(2))

function StakeInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const invalid = value !== '' && !isValidStake(value)
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <span
        className={clsx(
          'flex h-11 items-center rounded-[10px] border bg-surface px-3 transition-[border-color,box-shadow] focus-within:border-sel-ink focus-within:shadow-[0_0_0_3px_rgba(41,72,255,.14)]',
          invalid ? 'border-lost-ink' : 'border-line-strong',
        )}
      >
        <span className="text-[15px] font-semibold text-secondary">£</span>
        <input
          inputMode="decimal"
          placeholder="Stake"
          value={value}
          onChange={(e) => {
            const v = e.target.value.replace(/[^\d.]/g, '')
            if (/^\d*(\.\d{0,2})?$/.test(v)) onChange(v)
          }}
          className="w-full min-w-0 bg-transparent pl-1 text-[15.5px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-muted tnum"
          aria-invalid={invalid}
        />
      </span>
      {invalid && <span className="mt-1 block text-[11.5px] font-medium text-lost-ink">Stakes from £1.00 to £50.00</span>}
    </label>
  )
}

function Returns({ stake, odds }: { stake: string; odds: string }) {
  const ok = isValidStake(stake)
  const r = ok ? grossReturn(stake, odds) : D(0)
  return (
    <div className="flex items-end justify-between text-[12px]">
      <div className="text-secondary">
        Potential return <span className="text-muted">· includes stake</span>
      </div>
      <div className="text-[15px] font-semibold text-ink tnum">{ok ? <CountUp value={r.toNumber()} format={money} /> : '—'}</div>
    </div>
  )
}

function SlipCard({ g, index }: { g: DraftGroup; index: number }) {
  const { d } = useStore()
  const { tick } = useLiveClock()
  const ev = eventById(g.eventId)!
  const now = currentOdds(g, tick)
  const changed = now !== g.odds
  const isBuilder = g.type === 'builder'

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.22 } }}
      transition={{ duration: 0.45, ease, delay: index === 0 ? 0 : 0.02 }}
      className={clsx('relative overflow-hidden rounded-[14px] border bg-surface', changed ? 'border-[#f0c46a]' : 'border-line')}
    >
      <div className="p-3.5">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {isBuilder && (
                <span className="inline-flex items-center gap-1 rounded-md bg-sel px-1.5 py-0.5 text-[10.5px] font-bold tracking-[.06em] text-sel-ink uppercase">
                  <Layers size={11} /> Bet Builder
                </span>
              )}
              {g.live && (
                <span className="inline-flex items-center gap-1 rounded-md bg-live/10 px-1.5 py-0.5 text-[10.5px] font-bold tracking-[.06em] text-live uppercase">
                  <span className="live-dot !size-[5px]" /> Live
                </span>
              )}
            </div>
            {!isBuilder && (
              <>
                <div className="mt-0.5 truncate text-[14.5px] font-semibold text-ink">{g.legs[0].label}</div>
                <div className="truncate text-[12px] text-secondary">
                  {g.legs[0].marketName} · {g.legs[0].period}
                </div>
              </>
            )}
            <Link to={`/event/${ev.id}`} className="mt-0.5 block truncate text-[12px] text-muted hover:text-sel-ink">
              {ev.home.name} v {ev.away.name}
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <div className="text-right">
              <div className={clsx('text-[16px] font-semibold tnum', changed ? 'text-warn-ink' : 'text-ink')}>{fmtOdds(changed ? now : g.odds)}</div>
              {isBuilder && <div className="text-[10.5px] text-muted">joint odds</div>}
            </div>
            <button
              onClick={() => d({ type: 'remove', groupId: g.id })}
              aria-label={`Remove ${isBuilder ? 'Bet Builder' : g.legs[0].label}`}
              className="-mr-1.5 grid size-8 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {isBuilder && (
          <ol className="mt-3">
            {g.legs.map((l, i) => (
              <li key={l.selectionId} className="relative flex gap-2.5 pb-2.5 last:pb-0">
                {i < g.legs.length - 1 && <span className="absolute top-3.5 bottom-0 left-[5.5px] w-px bg-sel-ink/25" aria-hidden="true" />}
                <span className="relative mt-[4px] size-3 shrink-0 rounded-full border-[1.5px] border-sel-ink bg-surface" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-[13px] leading-tight font-semibold text-ink">{l.label}</span>
                  <span className="block text-[11.5px] text-secondary">
                    {l.marketName} · {l.period}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        )}

        <AnimatePresence>
          {changed && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-3 flex items-center gap-2 rounded-[10px] bg-warn px-3 py-2 text-[12.5px] text-warn-ink">
                <AlertTriangle size={15} className="shrink-0" />
                <span className="flex-1">
                  Odds changed <span className="tnum">{fmtOdds(g.odds)}</span> → <span className="font-semibold tnum">{fmtOdds(now)}</span>
                </span>
                <button onClick={() => d({ type: 'acceptPrice', groupId: g.id, odds: now })} className="rounded-md bg-warn-ink px-2 py-1 text-[11.5px] font-semibold text-white">
                  Accept
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-3 grid gap-2">
          <StakeInput value={g.stake} onChange={(v) => d({ type: 'stake', groupId: g.id, value: v })} label={`Stake for ${isBuilder ? 'Bet Builder' : g.legs[0].label}`} />
          <Returns stake={g.stake} odds={changed ? now : g.odds} />
        </div>

        {isBuilder && (
          <Link to={`/event/${ev.id}?tab=builder&explain=1`} className="mt-2.5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-sel-ink hover:underline">
            <Info size={14} /> How this bet works
          </Link>
        )}
      </div>
    </motion.li>
  )
}

function EmptySlip() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center px-6 py-10 text-center">
      <div className="relative mb-5 h-[104px] w-[160px]" aria-hidden="true">
        <motion.div
          animate={{ rotate: [-6, -4, -6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-[14px] border border-dashed border-line-strong bg-surface"
        />
        <motion.div
          animate={{ rotate: [4, 6, 4], y: [0, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-[14px] border border-line bg-surface p-3 shadow-[0_12px_30px_-16px_rgba(16,24,43,.35)]"
        >
          {[0, 1, 2].map((i) => (
            <div key={i} className="mb-2.5 flex items-center gap-2">
              <span className="size-2.5 rounded-full border-[1.5px] border-sel-ink/60" />
              <span className="h-2 rounded-full bg-line" style={{ width: [86, 64, 74][i] }} />
            </div>
          ))}
          <div className="absolute right-3 bottom-3 h-3 w-8 rounded-full bg-sel" />
        </motion.div>
      </div>
      <div className="text-[15px] font-semibold text-ink">Your betslip is empty</div>
      <p className="mt-1 max-w-[240px] text-[13px] leading-snug text-secondary">Tap any price to add a selection. Combine picks from one match with Bet Builder.</p>
    </motion.div>
  )
}

export function Betslip({ onClose, compact }: { onClose?: () => void; compact?: boolean }) {
  const { s, d } = useStore()
  const [note, setNote] = useState(false)
  const [pulse, setPulse] = useState(0)
  useEffect(() => {
    const f = () => setPulse((p) => p + 1)
    window.addEventListener(LAND_EVENT, f)
    return () => window.removeEventListener(LAND_EVENT, f)
  }, [])

  const n = s.groups.length
  const singles = s.groups.filter((g) => g.type === 'single')
  const distinctEvents = new Set(singles.map((g) => g.eventId)).size
  const accaReason =
    n < 2
      ? 'Add two or three selections from different matches.'
      : s.groups.some((g) => g.type === 'builder')
        ? 'Bet Builders are placed on their own. Review it in Singles or remove it.'
        : s.groups.some((g) => g.live)
          ? 'Accumulators use pre-match selections only.'
          : distinctEvents !== singles.length
            ? 'Two selections are from the same match. Use Bet Builder for same-match picks.'
            : n > 3
              ? 'Accumulators take up to three selections in this version.'
              : null
  const accaPrice = accaOdds(singles.map((g) => g.odds))

  const totalStake = s.mode === 'singles' ? s.groups.reduce((a, g) => (isValidStake(g.stake) ? a.plus(g.stake) : a), D(0)) : isValidStake(s.accaStake) && !accaReason ? D(s.accaStake) : D(0)
  const totalReturn =
    s.mode === 'singles'
      ? s.groups.reduce((a, g) => (isValidStake(g.stake) ? a.plus(grossReturn(g.stake, g.odds)) : a), D(0))
      : isValidStake(s.accaStake) && !accaReason
        ? grossReturn(s.accaStake, accaPrice)
        : D(0)
  const ready = totalStake.gt(0)

  return (
    <div className="flex h-full min-h-0 flex-col bg-canvas">
      <div className="flex items-center gap-2 border-b border-line bg-surface px-4 pt-3.5 pb-3">
        <Ticket size={19} className="text-sel-ink" />
        <h2 className="display text-[24px] leading-none uppercase">Betslip</h2>
        <motion.span
          key={pulse}
          data-slip-target
          initial={{ scale: pulse ? 1.45 : 1 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 520, damping: 13 }}
          className={clsx('grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-[12.5px] font-bold tnum', n ? 'bg-action text-white' : 'bg-[#e9ecf1] text-secondary')}
          aria-label={`${n} in betslip`}
        >
          {n}
        </motion.span>
        <div className="ml-auto flex items-center gap-1">
          {n > 0 && (
            <button onClick={() => d({ type: 'clear' })} className="flex h-8 items-center gap-1 rounded-lg px-2 text-[12.5px] font-semibold text-secondary hover:bg-canvas hover:text-ink">
              <Trash2 size={14} /> Clear
            </button>
          )}
          {onClose && (
            <button onClick={onClose} aria-label="Close betslip" className="grid size-9 place-items-center rounded-lg text-ink hover:bg-canvas">
              <X size={19} />
            </button>
          )}
        </div>
      </div>

      <div role="tablist" aria-label="Bet type" className="grid grid-cols-2 border-b border-line bg-surface px-2">
        {(['singles', 'acca'] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={s.mode === m}
            onClick={() => d({ type: 'mode', mode: m })}
            className={clsx('relative h-11 text-[13.5px] font-semibold transition-colors', s.mode === m ? 'text-sel-ink' : 'text-secondary hover:text-ink')}
          >
            {m === 'singles' ? 'Singles' : 'Accumulator'}
            {s.mode === m && <motion.span layoutId={compact ? 'slip-tab-m' : 'slip-tab'} className="absolute inset-x-3 bottom-0 h-[2.5px] rounded-full bg-sel-ink" />}
          </button>
        ))}
      </div>

      <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto">
        {n === 0 ? (
          <EmptySlip />
        ) : s.mode === 'singles' ? (
          <>
            <p className="px-4 pt-3 text-[12px] text-secondary">Place each bet separately</p>
            <ul className="space-y-2.5 p-3 pt-2">
              <AnimatePresence initial={false} mode="popLayout">
                {s.groups.map((g, i) => (
                  <SlipCard key={g.id} g={g} index={i} />
                ))}
              </AnimatePresence>
            </ul>
          </>
        ) : (
          <div className="p-3">
            {accaReason ? (
              <div className="rounded-[14px] border border-line bg-surface p-4 text-[13px] text-secondary">
                <div className="mb-1 font-semibold text-ink">Accumulator not available</div>
                {accaReason}
                {s.groups.some((g) => g.type === 'builder') && (
                  <button onClick={() => d({ type: 'mode', mode: 'singles' })} className="mt-3 flex items-center gap-1 text-[12.5px] font-semibold text-sel-ink">
                    Back to Singles <ArrowRight size={14} />
                  </button>
                )}
              </div>
            ) : (
              <div className="rounded-[14px] border border-line bg-surface p-3.5">
                <div className="flex items-baseline justify-between">
                  <div className="text-[14.5px] font-semibold">
                    {n}-fold accumulator <span className="font-normal text-secondary">· {n} selections</span>
                  </div>
                  <div className="text-[16px] font-semibold tnum">{fmtOdds(accaPrice)}</div>
                </div>
                <ol className="mt-3 space-y-2">
                  {singles.map((g) => {
                    const ev = eventById(g.eventId)!
                    return (
                      <li key={g.id} className="flex items-baseline justify-between gap-3 text-[13px]">
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">{g.legs[0].label}</span>
                          <span className="block truncate text-[11.5px] text-muted">
                            {ev.home.name} v {ev.away.name}
                          </span>
                        </span>
                        <span className="tnum">{fmtOdds(g.odds)}</span>
                      </li>
                    )
                  })}
                </ol>
                <div className="mt-3 grid gap-2 border-t border-line pt-3">
                  <StakeInput value={s.accaStake} onChange={(v) => d({ type: 'accaStake', value: v })} label="Accumulator stake" />
                  <Returns stake={s.accaStake} odds={accaPrice.toString()} />
                </div>
                <p className="mt-2 text-[11.5px] text-muted">All selections must win. Odds are multiplied exactly; the return is rounded once.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {n > 0 && (
        <div className="border-t border-line bg-surface p-3.5">
          <div className="mb-3 grid grid-cols-2 gap-2 text-[12px]">
            <div>
              <div className="text-secondary">Total stake</div>
              <div className="text-[15px] font-semibold tnum">
                <CountUp value={totalStake.toNumber()} format={money} />
              </div>
            </div>
            <div className="text-right">
              <div className="text-secondary">Potential return</div>
              <div className="text-[15px] font-semibold tnum">
                <CountUp value={totalReturn.toNumber()} format={money} />
              </div>
            </div>
          </div>
          <motion.button
            whileTap={ready ? { scale: 0.98 } : undefined}
            disabled={!ready}
            onClick={() => setNote(true)}
            className={clsx(
              'flex h-12 w-full items-center justify-center gap-2 rounded-[12px] text-[15px] font-semibold transition-colors',
              ready ? 'bg-action text-white shadow-[0_10px_24px_-12px_rgba(41,72,255,1)] hover:bg-action-hover' : 'bg-[#e4e7ec] text-muted',
            )}
          >
            {ready ? (
              <>
                Review {s.mode === 'acca' ? 'accumulator' : 'bets'} · <span className="tnum">{fmtMoney(totalStake)}</span>
              </>
            ) : (
              'Enter a stake to continue'
            )}
          </motion.button>
          <AnimatePresence>
            {note && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-center text-[12px] text-secondary" onAnimationComplete={() => setTimeout(() => setNote(false), 2600)}>
                Review and placement arrive in the next build.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}
      <div className="border-t border-line bg-surface px-4 py-2 text-center text-[11px] text-muted">18+ · Demo with fictional money · <Link to="/safer-gambling" className="underline hover:text-ink">Deposit limits</Link></div>
    </div>
  )
}
