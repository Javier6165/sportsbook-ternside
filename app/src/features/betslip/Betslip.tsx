import clsx from 'clsx'
import { AlertTriangle, ArrowRight, Info, Trash2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { eventById } from '../../data/catalog'
import { accaOdds, D, fmtMoney, fmtOdds, grossReturn, isValidStake } from '../../domain/money'
import { kickoffTime } from '../../lib/time'
import { currentOdds, useLiveClock, useStore, type DraftGroup } from '../../state/store'
import { CountUp } from '../../ui/CountUp'
import { matchGradient } from '../../ui/MatchField'
import { Perforation } from '../../ui/BuilderPass'
import { planBets, type AcceptedBet } from '../../domain/bets'
import { EVENT_NOW } from '../../data/catalog'
import { DoneStep, PlacingStep, ReviewStep } from './Review'

const ease = [0.16, 1, 0.3, 1] as const
const money = (n: number) => fmtMoney(n.toFixed(2))
const first = (n: string) => n.split(' ')[0]

function StakeInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const invalid = value !== '' && !isValidStake(value)
  return (
    <label className="block min-w-0 flex-1">
      <span className="mb-1 block text-[11.5px] font-semibold text-secondary">Stake</span>
      <span
        className={clsx(
          'flex h-12 items-center rounded-[14px] bg-chip px-3.5 transition-shadow focus-within:bg-surface focus-within:shadow-[0_0_0_2px_var(--color-action)]',
          invalid && 'shadow-[0_0_0_2px_var(--color-lost-ink)]',
        )}
      >
        <span className="font-display text-[18px] font-[700] text-secondary">£</span>
        <input
          inputMode="decimal"
          placeholder="0.00"
          value={value}
          aria-label={label}
          onChange={(e) => {
            const v = e.target.value.replace(/[^\d.]/g, '')
            if (/^\d*(\.\d{0,2})?$/.test(v)) onChange(v)
          }}
          className="w-full min-w-0 bg-transparent pl-1 font-display text-[20px] font-[720] tracking-[-0.02em] text-ink outline-none placeholder:text-[#b9bec8] tnum"
          aria-invalid={invalid}
        />
      </span>
      {invalid && <span className="mt-1 block text-[11.5px] font-medium text-lost-ink">From £1.00 to £50.00</span>}
    </label>
  )
}

function ReturnBox({ stake, odds }: { stake: string; odds: string }) {
  const ok = isValidStake(stake)
  const r = ok ? grossReturn(stake, odds) : D(0)
  return (
    <div className="min-w-0 flex-1 text-right">
      <span className="mb-1 block text-[11.5px] font-semibold text-secondary">Potential return</span>
      <span className="flex h-12 items-center justify-end font-display text-[20px] font-[720] tracking-[-0.02em] tnum">{ok ? <CountUp value={r.toNumber()} format={money} /> : <span className="text-[#b9bec8]">£0.00</span>}</span>
    </div>
  )
}

function SlipPass({ g }: { g: DraftGroup }) {
  const { d } = useStore()
  const { tick } = useLiveClock()
  const ev = eventById(g.eventId)!
  const now = currentOdds(g, tick)
  const changed = now !== g.odds
  const isBuilder = g.type === 'builder'

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, transition: { duration: 0.22 } }}
      transition={{ duration: 0.5, ease }}
      className="relative overflow-hidden rounded-[24px] bg-surface shadow-[0_1px_2px_rgba(16,24,43,.05)]"
    >
      <div className="on-dark flex items-center gap-2 px-4 py-3 text-white" style={{ background: matchGradient(ev) }}>
        <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold">
          {isBuilder ? 'Bet Builder · ' : ''}
          {first(ev.home.name)} v {first(ev.away.name)} · {g.live ? 'Live' : kickoffTime(ev.startsAt)}
        </span>
        <button onClick={() => d({ type: 'remove', groupId: g.id })} aria-label={`Remove ${isBuilder ? 'Bet Builder' : g.legs[0].label}`} className="-mr-1.5 grid size-7 place-items-center rounded-full bg-black/15 hover:bg-black/30">
          <X size={14} />
        </button>
      </div>

      <div className="px-4 pt-3.5">
        {isBuilder ? (
          <ol>
            {g.legs.map((l, i) => (
              <li key={l.selectionId} className="relative flex gap-2.5 pb-3 last:pb-0">
                {i < g.legs.length - 1 && <span className="absolute top-[15px] bottom-0 left-[6px] w-[2px] rounded bg-sel" aria-hidden="true" />}
                <span className="relative mt-[3px] size-3.5 shrink-0 rounded-full border-[2.5px] border-action bg-surface" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] leading-tight font-semibold">{l.label}</span>
                  <span className="block text-[12px] text-secondary">{l.period}</span>
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate font-display text-[19px] leading-tight font-[720] tracking-[-0.03em]">{g.legs[0].label}</div>
              <div className="mt-0.5 text-[12.5px] text-secondary">
                {g.legs[0].marketName} · {g.legs[0].period}
              </div>
            </div>
          </div>
        )}
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-[12px] font-semibold text-secondary">{isBuilder ? 'Joint odds' : 'Odds'}</span>
          <span className={clsx('font-display text-[22px] leading-none font-[760] tracking-[-0.03em] tnum', changed ? 'text-warn-ink' : 'text-ink')}>{fmtOdds(changed ? now : g.odds)}</span>
        </div>

        <AnimatePresence>
          {changed && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-3 flex items-center gap-2 rounded-[14px] bg-warn px-3 py-2.5 text-[12.5px] text-warn-ink">
                <AlertTriangle size={15} className="shrink-0" />
                <span className="flex-1">
                  Odds changed <span className="tnum">{fmtOdds(g.odds)}</span> → <span className="font-semibold tnum">{fmtOdds(now)}</span>
                </span>
                <button onClick={() => d({ type: 'acceptPrice', groupId: g.id, odds: now })} className="rounded-full bg-warn-ink px-3 py-1 text-[12px] font-semibold text-white">
                  Accept
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Perforation notch="bg-canvas" />

      <div className="flex gap-3 px-4 pb-4">
        <StakeInput value={g.stake} onChange={(v) => d({ type: 'stake', groupId: g.id, value: v })} label={`Stake for ${isBuilder ? 'Bet Builder' : g.legs[0].label}`} />
        <ReturnBox stake={g.stake} odds={changed ? now : g.odds} />
      </div>
      {isBuilder && (
        <Link to={`/event/${ev.id}?tab=builder&explain=1`} className="mx-4 mb-4 flex items-center gap-1.5 text-[12.5px] font-semibold text-sel-ink hover:underline">
          <Info size={14} /> How this bet works
        </Link>
      )}
    </motion.li>
  )
}

function EmptySlip() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center px-8 py-12 text-center">
      <div className="relative mb-6 h-[120px] w-[170px]" aria-hidden="true">
        <motion.div animate={{ rotate: [-7, -5, -7] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-0 rounded-[20px] bg-chip" />
        <motion.div animate={{ rotate: [4, 6, 4], y: [0, -3, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-0 overflow-hidden rounded-[20px] bg-surface shadow-[0_16px_34px_-18px_rgba(16,24,43,.4)]">
          <div className="h-7 bg-gradient-to-r from-[#13204A] to-[#C8102E]" />
          <div className="p-3">
            {[70, 54, 62].map((w, i) => (
              <div key={i} className="mb-2 flex items-center gap-2">
                <span className="size-2.5 rounded-full border-2 border-action/60" />
                <span className="h-2 rounded-full bg-chip" style={{ width: w }} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="font-display text-[20px] font-[760] tracking-[-0.03em]">Your betslip is empty</div>
      <p className="mt-1.5 max-w-[250px] text-[14px] leading-snug text-secondary">Tap a price to add it here. Every bet keeps the same ticket from now until it settles.</p>
    </motion.div>
  )
}

export function Betslip({ onClose }: { onClose?: () => void }) {
  const { s, d } = useStore()
  const { tick, elapsed } = useLiveClock()
  const [step, setStep] = useState<'edit' | 'review' | 'placing' | 'done'>('edit')
  const [planned, setPlanned] = useState<AcceptedBet[]>([])
  const [consumes, setConsumes] = useState<string[]>([])
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
              ? 'Accumulators take up to three selections, to keep them readable.'
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
  const priceMoved = s.groups.some((g) => currentOdds(g, tick) !== g.odds)

  const startReview = () => {
    const at = new Date(Date.parse(EVENT_NOW) + elapsed * 1000).toISOString()
    const groups = s.mode === 'acca' ? s.groups : s.groups
    const plan = planBets(groups, s.mode, s.accaStake, at)
    setPlanned(plan.map((p) => p.bet))
    setConsumes(plan.flatMap((p) => p.consumes))
    setStep('review')
  }
  const place = () => {
    setStep('placing')
    const live = planned.some((b) => b.live)
    setTimeout(() => {
      d({ type: 'placed', bets: planned, consumed: consumes, acca: s.mode === 'acca' })
      setStep('done')
    }, live ? 2000 : 1400)
  }

  if (step === 'review')
    return <ReviewStep planned={planned} available={s.available} blocked={priceMoved ? 'A price changed. Go back and accept the new odds first.' : null} onBack={() => setStep('edit')} onPlace={place} />
  if (step === 'placing') return <PlacingStep planned={planned} />
  if (step === 'done')
    return (
      <DoneStep
        placed={planned}
        onClose={() => {
          setStep('edit')
          onClose?.()
        }}
      />
    )

  return (
    <div className="flex h-full min-h-0 flex-col bg-canvas">
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <h2 className="font-display text-[28px] leading-none font-[800] tracking-[-0.045em]">Betslip</h2>
        <span className={clsx('grid h-7 min-w-7 place-items-center rounded-full px-2 text-[13px] font-bold tnum', n ? 'bg-action text-white' : 'bg-chip text-secondary')} aria-label={`${n} in betslip`}>
          {n}
        </span>
        <div className="ml-auto flex items-center gap-1">
          {n > 0 && (
            <button onClick={() => d({ type: 'clear' })} className="flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-secondary hover:bg-chip hover:text-ink">
              <Trash2 size={14} /> Clear
            </button>
          )}
          {onClose && (
            <button onClick={onClose} aria-label="Close betslip" className="grid size-10 place-items-center rounded-full bg-chip hover:bg-chip-hover">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {n > 0 && (
        <div className="px-5 pb-3">
          <div role="tablist" aria-label="Bet type" className="grid grid-cols-2 rounded-full bg-chip p-1">
            {(['singles', 'acca'] as const).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={s.mode === m}
                onClick={() => d({ type: 'mode', mode: m })}
                className={clsx('relative z-10 h-9 rounded-full text-[13.5px] font-semibold transition-colors', s.mode === m ? 'text-ink' : 'text-secondary hover:text-ink')}
              >
                {s.mode === m && <motion.span layoutId="slip-mode" className="absolute inset-0 -z-10 rounded-full bg-surface shadow-[0_1px_3px_rgba(16,24,43,.14)]" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                {m === 'singles' ? 'Singles' : 'Accumulator'}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        {n === 0 ? (
          <EmptySlip />
        ) : s.mode === 'singles' ? (
          <ul className="space-y-3">
            <AnimatePresence initial={false} mode="popLayout">
              {s.groups.map((g) => (
                <SlipPass key={g.id} g={g} />
              ))}
            </AnimatePresence>
          </ul>
        ) : accaReason ? (
          <div className="rounded-[24px] bg-surface p-5 text-[14px] text-secondary">
            <div className="mb-1 font-display text-[18px] font-[720] tracking-[-0.03em] text-ink">Accumulator not available</div>
            {accaReason}
            {s.groups.some((g) => g.type === 'builder') && (
              <button onClick={() => d({ type: 'mode', mode: 'singles' })} className="mt-3 flex items-center gap-1 text-[13px] font-semibold text-sel-ink">
                Back to Singles <ArrowRight size={14} />
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-[24px] bg-surface">
            <div className="flex items-baseline justify-between px-4 pt-4">
              <span className="font-display text-[19px] font-[740] tracking-[-0.03em]">{n}-fold accumulator</span>
              <span className="font-display text-[22px] font-[760] tracking-[-0.03em] tnum">{fmtOdds(accaPrice)}</span>
            </div>
            <ol className="mt-3 space-y-2.5 px-4">
              {singles.map((g) => {
                const ev = eventById(g.eventId)!
                return (
                  <li key={g.id} className="flex items-center gap-3">
                    <span className="h-8 w-1.5 shrink-0 rounded-full" style={{ background: matchGradient(ev, 180) }} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold">{g.legs[0].label}</span>
                      <span className="block truncate text-[12px] text-secondary">
                        {ev.home.name} v {ev.away.name}
                      </span>
                    </span>
                    <span className="font-semibold tnum">{fmtOdds(g.odds)}</span>
                  </li>
                )
              })}
            </ol>
            <p className="mt-3 px-4 text-[12px] text-secondary">Every selection must win. Odds multiply exactly; the return is rounded once.</p>
            <Perforation />
            <div className="flex gap-3 px-4 pb-4">
              <StakeInput value={s.accaStake} onChange={(v) => d({ type: 'accaStake', value: v })} label="Accumulator stake" />
              <ReturnBox stake={s.accaStake} odds={accaPrice.toString()} />
            </div>
          </div>
        )}
      </div>

      {n > 0 && (
        <div className="border-t border-line bg-surface px-5 pt-4 pb-5">
          <div className="mb-3 flex items-baseline justify-between text-[13px] text-secondary">
            <span>
              Total stake <b className="ml-1 font-semibold text-ink tnum"><CountUp value={totalStake.toNumber()} format={money} /></b>
            </span>
            <span>
              Return <b className="ml-1 font-display text-[18px] font-[760] tracking-[-0.02em] text-ink tnum"><CountUp value={totalReturn.toNumber()} format={money} /></b>
            </span>
          </div>
          <motion.button
            whileTap={ready ? { scale: 0.98 } : undefined}
            onClick={() => ready && startReview()}
            aria-disabled={!ready}
            className={clsx('flex h-14 w-full items-center justify-center gap-2 rounded-[18px] text-[16px] font-semibold transition-colors', ready ? 'bg-ink text-white hover:bg-black' : 'bg-chip text-muted')}
          >
            {ready ? (
              <>
                Review {s.mode === 'acca' ? 'accumulator' : n > 1 ? 'bets' : 'bet'} · <span className="tnum">{fmtMoney(totalStake)}</span>
              </>
            ) : (
              'Add a stake to continue'
            )}
          </motion.button>

          <p className="mt-3 text-center text-[11.5px] text-muted">
            18+ · Fictional money ·{' '}
            <Link to="/safer-gambling" className="underline hover:text-ink">
              Deposit limits
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
