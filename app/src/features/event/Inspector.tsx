import clsx from 'clsx'
import { Ban, Check, CircleDashed, FlaskConical, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { SCENARIOS, evaluate, type LegStatus } from '../../domain/builder'
import { fmtMoney, grossReturn, isValidStake } from '../../domain/money'
import { quoteFor } from '../../data/quotes'

const ease = [0.16, 1, 0.3, 1] as const

const STATUS: Record<LegStatus, { label: string; cls: string; icon: typeof Check }> = {
  won: { label: 'Would win', cls: 'bg-won text-won-ink', icon: Check },
  lost: { label: 'Would lose', cls: 'bg-lost text-lost-ink', icon: X },
  void: { label: 'Void — removed', cls: 'bg-void text-void-ink', icon: Ban },
  open: { label: 'Still to decide', cls: 'bg-chip text-secondary', icon: CircleDashed },
}

/**
 * "Explore outcomes" — a read-only what-if. It applies RULES-GB-01 to a
 * hypothetical and never touches the real match, price, bet or balance.
 */
export function Inspector({ sels, labels, stake, quotes, accepted }: { sels: string[]; labels: Record<string, string>; stake?: string; quotes?: Record<string, string>; accepted?: boolean }) {
  const [id, setId] = useState(SCENARIOS[0].id)
  const sc = SCENARIOS.find((x) => x.id === id)!
  const { legs, outcome } = evaluate(sels, sc, quotes)
  const usesOwn = !!stake && isValidStake(stake)
  const st = usesOwn ? stake! : '10.00'
  const full = quoteFor(sels, quotes)

  return (
    <section aria-labelledby="explore-title" className="rounded-[26px] bg-surface p-5 @tab:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="grid size-9 place-items-center rounded-full bg-sel text-sel-ink">
          <FlaskConical size={17} />
        </span>
        <h3 id="explore-title" className="font-display text-[22px] leading-none font-[780] tracking-[-0.04em]">
          Explore outcomes
        </h3>
        <span className="ml-auto text-[12px] font-medium text-secondary">Pick a what-if. Nothing about your bet changes.</span>
      </div>

      <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 @tab:-mx-6 @tab:flex-wrap @tab:px-6">
        {SCENARIOS.map((x) => (
          <button
            key={x.id}
            onClick={() => setId(x.id)}
            aria-pressed={x.id === id}
            className={clsx('h-10 shrink-0 rounded-full px-4 text-[13px] font-semibold transition-colors', x.id === id ? 'bg-ink text-white' : 'bg-chip text-ink hover:bg-chip-hover')}
          >
            {x.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease }}>
          <p className="mt-4 text-[14px] text-secondary">{sc.detail}</p>
          <ul className="mt-3 space-y-2">
            {legs.map((l) => {
              const S = STATUS[l.status]
              return (
                <li key={l.id} className="flex items-start gap-3 rounded-[16px] border border-line p-3">
                  <span className={clsx('mt-0.5 grid size-7 shrink-0 place-items-center rounded-full', S.cls)}>
                    <S.icon size={14} strokeWidth={2.6} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className={clsx('text-[14.5px] font-semibold', l.status === 'void' && 'text-void-ink line-through decoration-1')}>{labels[l.id]}</span>
                      <span className={clsx('text-[12px] font-semibold', l.status === 'won' ? 'text-won-ink' : l.status === 'lost' ? 'text-lost-ink' : 'text-secondary')}>{S.label}</span>
                    </span>
                    {l.why && <span className="mt-0.5 block text-[12.5px] leading-snug text-secondary">{l.why}</span>}
                  </span>
                </li>
              )
            })}
          </ul>

          <div
            className={clsx(
              'mt-4 rounded-[18px] p-4',
              outcome.kind === 'lost' ? 'bg-lost' : outcome.kind === 'won' ? 'bg-won' : outcome.kind === 'refund' ? 'bg-void' : 'bg-sel',
            )}
          >
            {outcome.kind === 'lost' && (
              <>
                <div className="font-display text-[20px] font-[760] tracking-[-0.03em] text-lost-ink">This bet would lose · £0.00 back</div>
                <p className="mt-1 text-[13px] text-lost-ink/85">Every condition has to win. One losing condition settles it — the others don’t need to be known.</p>
              </>
            )}
            {outcome.kind === 'refund' && (
              <>
                <div className="font-display text-[20px] font-[760] tracking-[-0.03em] text-void-ink">Stake returned · {fmtMoney(st)}</div>
                <p className="mt-1 text-[13px] text-void-ink/85">Every condition would be void, so the whole bet is void.</p>
              </>
            )}
            {outcome.kind === 'won' && (
              <>
                <div className="font-display text-[20px] font-[760] tracking-[-0.03em] text-won-ink">
                  Would return {fmtMoney(grossReturn(st, outcome.odds))} <span className="text-[14px] font-semibold">at {outcome.odds}</span>
                </div>
                <p className="mt-1 text-[13px] text-won-ink/85">
                  {outcome.reduced ? `A void condition drops out. The rest settle at their archived price of ${outcome.odds}, not ${full}.` : accepted ? 'All conditions won at the joint price you took.' : 'All conditions would win at the current joint price.'}
                </p>
              </>
            )}
            {outcome.kind === 'conditional' && (
              <>
                <div className="font-display text-[20px] font-[760] tracking-[-0.03em] text-sel-ink">
                  {fmtMoney(grossReturn(st, outcome.odds))} if {outcome.pending.map((p) => labels[p]).join(' and ')} {outcome.pending.length > 1 ? 'both win' : 'wins'}
                </div>
                <p className="mt-1 text-[13px] text-sel-ink/85">
                  {outcome.reduced ? `The bet carries on without the void condition, at the archived price of ${outcome.odds} instead of ${full}.` : 'Nothing is settled yet.'} Not a forecast — just how the rules work.
                </p>
              </>
            )}
            <p className="mt-2 text-[11.5px] font-medium opacity-60">
              {usesOwn ? `Based on your ${fmtMoney(st)} stake` : 'Shown for a £10 stake'}
              {accepted ? ` and the prices archived when your bet was accepted (${full}).` : ` and current prices (${full}).`}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
