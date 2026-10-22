import clsx from 'clsx'
import { ArrowRight, Check, ChevronDown, Lock, ShieldCheck } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { fmtMoney } from '../../domain/money'
import { qualifiesMatchday, type Promo } from '../../domain/promos'
import { useAccountNow, useStore, type State } from '../../state/store'
import { BRAND_GRADIENT } from '../../ui/MatchField'

const ease = [0.16, 1, 0.3, 1] as const

export type PromoStatus = 'available' | 'joined' | 'qualified' | 'completed' | 'not-eligible' | 'blocked'

export function promoStatus(p: Promo, s: State): { status: PromoStatus; note?: string } {
  if (p.audience === 'new') return { status: 'not-eligible', note: 'New customers only — not available on this account.' }
  if (s.restriction !== 'none') return { status: 'blocked', note: 'Promotions are off while your break is active.' }
  const e = s.promos[p.id]
  if (p.id === 'predictor') return s.predictor ? { status: 'joined', note: `Entry saved · ${Object.keys(s.predictor.picks).length} of 4 scores` } : { status: 'available' }
  if (!e) return { status: 'available' }
  if (e.completedAt) return { status: 'completed', note: p.id === 'matchday-free-bet' ? '£5 free bet added to your account.' : 'Completed.' }
  if (p.id === 'matchday-free-bet') {
    const q = s.bets.find((b) => b.status === 'open' && qualifiesMatchday(b, e))
    if (q) return { status: 'qualified', note: `${q.id} qualifies — your £5 free bet arrives when it settles.` }
    return { status: 'joined', note: 'Place a £10 pre-match bet on a Continental Cup match at 1.50 or more.' }
  }
  if (p.id === 'two-up') return { status: 'joined', note: 'Applies to Match result singles you place from now on.' }
  return { status: 'joined', note: 'Applies to three-condition Bet Builders you place from now on.' }
}

/** Small product-like visual for each promotion — no stock imagery, no flashing numbers. */
function Visual({ p }: { p: Promo }) {
  const box = 'grid h-11 w-9 place-items-center rounded-[10px] bg-white/[.14] font-display text-[22px] font-[780] backdrop-blur-md'
  if (p.id === 'predictor')
    return (
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {['2', '1', '0', '3'].map((n, i) => (
          <motion.span key={i} initial={{ rotateX: -90, opacity: 0 }} whileInView={{ rotateX: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease }} className={box}>
            {n}
          </motion.span>
        ))}
      </div>
    )
  if (p.id === 'two-up')
    return (
      <div className="flex items-center gap-2 font-display text-[40px] leading-none font-[800] tracking-[-0.03em]" aria-hidden="true">
        2<span className="mx-[0.08em] opacity-50">–</span>0
        <span className="ml-2 rounded-full bg-won px-2.5 py-1 font-sans text-[11.5px] font-bold tracking-normal text-won-ink">Paid</span>
      </div>
    )
  if (p.id === 'bb-insurance')
    return (
      <div className="flex items-center gap-2" aria-hidden="true">
        {['won', 'won', 'lost'].map((r, i) => (
          <span key={i} className={clsx('grid size-9 place-items-center rounded-full text-[13px] font-bold', r === 'won' ? 'bg-won text-won-ink' : 'bg-white/15 text-white')}>
            {r === 'won' ? '✓' : '✕'}
          </span>
        ))}
        <ArrowRight size={18} className="opacity-60" />
        <span className="rounded-full bg-white px-3 py-1.5 text-[13px] font-bold text-ink">£5 free bet</span>
      </div>
    )
  return (
    <div className="font-display text-[44px] leading-none font-[800] tracking-[-0.04em]" aria-hidden="true">
      {p.id === 'welcome' ? '£10' : '£5'}
      <span className="ml-2 align-middle font-sans text-[13px] font-semibold tracking-normal opacity-75">free bet{p.id === 'welcome' ? 's' : ''}</span>
    </div>
  )
}

export function PromoCard({ p, compact = false, i = 0 }: { p: Promo; compact?: boolean; i?: number }) {
  const { s, d } = useStore()
  const now = useAccountNow()
  const [terms, setTerms] = useState(false)
  const { status, note } = promoStatus(p, s)
  const join = () => d({ type: 'promoJoin', id: p.id, at: now })

  const action =
    p.route && status !== 'not-eligible' && status !== 'blocked' ? (
      <Link to={p.route} className="flex h-11 items-center gap-1.5 rounded-full bg-ink px-5 text-[14px] font-semibold text-white hover:bg-black">
        {status === 'joined' ? 'Edit your scores' : 'Play for free'} <ArrowRight size={16} />
      </Link>
    ) : status === 'available' ? (
      <motion.button whileTap={{ scale: 0.97 }} onClick={join} className="flex h-11 items-center gap-1.5 rounded-full bg-ink px-5 text-[14px] font-semibold text-white hover:bg-black">
        Opt in
      </motion.button>
    ) : status === 'not-eligible' || status === 'blocked' ? (
      <span className="flex h-11 items-center gap-1.5 rounded-full bg-chip px-4 text-[13px] font-semibold text-secondary">
        <Lock size={14} /> {status === 'blocked' ? 'Unavailable' : 'Not available'}
      </span>
    ) : (
      <span className={clsx('flex h-11 items-center gap-1.5 rounded-full px-4 text-[13.5px] font-semibold', status === 'completed' ? 'bg-chip text-secondary' : 'bg-won text-won-ink')}>
        <Check size={15} strokeWidth={2.6} /> {status === 'completed' ? 'Completed' : status === 'qualified' ? 'Qualified' : 'Opted in'}
      </span>
    )

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: i * 0.06, duration: 0.6, ease }}
      className={clsx('flex h-full flex-col overflow-hidden rounded-[26px] bg-surface', status === 'not-eligible' && 'opacity-[.92]')}
      aria-labelledby={`promo-${p.id}`}
    >
      <div className={clsx('on-dark relative flex items-end px-5 text-white', compact ? 'h-[104px] pb-4' : 'h-[132px] pb-5')} style={{ background: BRAND_GRADIENT }}>
        <Visual p={p} />
        {p.freeToPlay && <span className="absolute top-4 right-4 rounded-full bg-white/15 px-2.5 py-1 text-[11.5px] font-semibold backdrop-blur-md">Free to play</span>}
        {p.audience === 'new' && <span className="absolute top-4 right-4 rounded-full bg-white/15 px-2.5 py-1 text-[11.5px] font-semibold backdrop-blur-md">New customers</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 id={`promo-${p.id}`} className="font-display text-[21px] leading-tight font-[770] tracking-[-0.035em]">
          {p.title}
        </h3>
        <p className="mt-1.5 text-[14px] leading-snug text-secondary">{p.headline}</p>
        {!compact && (
          <dl className="mt-4 grid grid-cols-3 gap-2">
            {p.key.map((k) => (
              <div key={k.label} className="rounded-[14px] bg-chip px-3 py-2">
                <dt className="text-[11px] font-semibold text-secondary">{k.label}</dt>
                <dd className="mt-0.5 text-[13px] leading-tight font-semibold">{k.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {note && <p className={clsx('mt-3 text-[13px] font-medium', status === 'qualified' || status === 'completed' ? 'text-won-ink' : 'text-secondary')}>{note}</p>}
        <div className="mt-auto flex items-center gap-2 pt-5">
          {action}
          {!compact ? (
            <button onClick={() => setTerms((t) => !t)} aria-expanded={terms} className="ml-auto flex h-10 items-center gap-1 rounded-full px-3 text-[13px] font-semibold text-secondary hover:bg-chip hover:text-ink">
              Full terms
              <motion.span animate={{ rotate: terms ? 180 : 0 }}>
                <ChevronDown size={16} />
              </motion.span>
            </button>
          ) : (
            <Link to="/promotions" className="ml-auto text-[13px] font-semibold text-secondary hover:text-ink">
              Terms
            </Link>
          )}
        </div>
        <AnimatePresence initial={false}>
          {terms && (
            <motion.ol initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} className="overflow-hidden">
              <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-[13px] leading-snug text-secondary">
                {p.terms.map((t, k) => (
                  <li key={k} className="flex gap-2">
                    <span className="w-4 shrink-0 font-semibold text-ink tnum">{k + 1}.</span>
                    {t}
                  </li>
                ))}
                <li className="flex gap-2 pt-1">
                  <ShieldCheck size={15} className="mt-0.5 shrink-0 text-won-ink" /> 18+. Free bets have no cash value and lapse if you self-exclude; returns from bets already placed are paid as normal. Promotions never change your deposit limits.{' '}
                  <Link to="/safer-gambling" className="font-semibold text-ink underline">
                    Safer gambling
                  </Link>
                </li>
              </div>
            </motion.ol>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  )
}

export function FreeBetChip({ amount, expiresAt }: { amount: string; expiresAt: string }) {
  const left = Math.max(0, Math.ceil((Date.parse(expiresAt) - Date.now()) / 86_400_000))
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sel px-2.5 py-1 text-[12px] font-semibold text-sel-ink">
      {fmtMoney(amount)} free bet
      <span className="font-medium opacity-70">· {left > 0 ? `${left}d` : 'expires soon'}</span>
    </span>
  )
}
