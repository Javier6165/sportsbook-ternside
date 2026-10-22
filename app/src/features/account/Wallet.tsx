import clsx from 'clsx'
import { ArrowDownLeft, ArrowUpRight, Check, CreditCard, Gauge, HandCoins, RotateCcw, Ticket } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { LIMIT_LABEL, remaining } from '../../domain/limits'
import { D, fmtMoney } from '../../domain/money'
import { useAccountNow, useStore } from '../../state/store'
import { CountUp } from '../../ui/CountUp'

const ease = [0.16, 1, 0.3, 1] as const
const money = (n: number) => fmtMoney(n.toFixed(2))
const fmtTime = (iso: string) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))

function AmountInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <label className="flex h-14 items-center rounded-[16px] bg-chip px-4 focus-within:bg-surface focus-within:shadow-[0_0_0_2px_var(--color-action)]">
      <span className="font-display text-[22px] font-[720] text-secondary">£</span>
      <input
        aria-label={label}
        inputMode="decimal"
        placeholder="0.00"
        value={value}
        onChange={(e) => {
          const v = e.target.value.replace(/[^\d.]/g, '')
          if (/^\d*(\.\d{0,2})?$/.test(v)) onChange(v)
        }}
        className="w-full bg-transparent pl-1 font-display text-[24px] font-[760] tracking-[-0.02em] outline-none placeholder:text-[#b9bec8] tnum"
      />
    </label>
  )
}

function Deposit() {
  const { s, d } = useStore()
  const now = useAccountNow()
  const [v, setV] = useState('')
  const [done, setDone] = useState<string | null>(null)
  const r = remaining(s.deposits, s.limits, now)
  const blocked = s.restriction !== 'none'
  const amount = v ? D(v) : D(0)
  const over = amount.gt(r.left)
  const valid = amount.gte(5) && !over && !blocked && !s.pendingOp
  return (
    <section className="rounded-[26px] bg-surface p-5 @tab:p-6">
      <div className="flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-full bg-sel text-sel-ink">
          <ArrowDownLeft size={17} />
        </span>
        <h2 className="font-display text-[22px] font-[780] tracking-[-0.04em]">Deposit</h2>
      </div>
      <p className="mt-3 text-[14px] text-secondary">
        You can deposit up to <b className="font-semibold text-ink tnum">{fmtMoney(r.left)}</b> right now · {LIMIT_LABEL[r.by].toLowerCase()} limit.{' '}
        <Link to="/safer-gambling" className="font-semibold text-sel-ink hover:underline">
          Deposit limits
        </Link>
      </p>
      <div className="mt-4">
        <AmountInput value={v} onChange={(x) => (setV(x), setDone(null))} label="Deposit amount" />
      </div>
      <div className="mt-3 flex items-center gap-3 rounded-[16px] border border-line px-4 py-3 text-[13.5px]">
        <CreditCard size={18} className="text-secondary" />
        <span className="flex-1">
          <span className="block font-semibold">Demo debit card</span>
          <span className="block text-[12px] text-secondary">Fictional method · no card details are ever collected</span>
        </span>
        <Check size={16} className="text-action" />
      </div>
      {blocked && <p className="mt-3 text-[13px] font-medium text-warn-ink">Deposits are off while your break is active.</p>}
      {over && !blocked && <p className="mt-3 text-[13px] font-medium text-lost-ink">That’s more than your limit allows now. You can deposit up to {fmtMoney(r.left)}.</p>}
      {v && amount.lt(5) && <p className="mt-3 text-[13px] font-medium text-secondary">The minimum deposit is £5.00.</p>}
      <motion.button
        whileTap={valid ? { scale: 0.98 } : undefined}
        aria-disabled={!valid}
        onClick={() => {
          if (!valid) return
          d({ type: 'deposit', amount: amount.toFixed(2), at: now })
          setDone(amount.toFixed(2))
          setV('')
        }}
        className={clsx('mt-4 h-14 w-full rounded-[18px] text-[16px] font-semibold', valid ? 'bg-action text-white hover:bg-action-hover' : 'bg-chip text-muted')}
      >
        {valid ? `Deposit ${fmtMoney(amount)}` : 'Enter an amount'}
      </motion.button>
      <AnimatePresence>
        {done && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 flex items-center gap-2 text-[13.5px] font-semibold text-won-ink" role="status">
            <Check size={16} /> {fmtMoney(done)} added to your demo funds.
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  )
}

function Withdraw() {
  const { s, d } = useStore()
  const now = useAccountNow()
  const [v, setV] = useState('')
  const amount = v ? D(v) : D(0)
  const valid = amount.gte(1) && amount.lte(s.available) && s.restriction !== 'excluded' && !s.pendingOp
  return (
    <section className="rounded-[26px] bg-surface p-5 @tab:p-6">
      <div className="flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-full bg-chip">
          <ArrowUpRight size={17} />
        </span>
        <h2 className="font-display text-[22px] font-[780] tracking-[-0.04em]">Withdraw</h2>
      </div>
      <p className="mt-3 text-[14px] text-secondary">
        Up to <b className="font-semibold text-ink tnum">{fmtMoney(s.available)}</b>. The amount is set aside straight away. This is different from Cash Out, which closes a bet.
      </p>
      <div className="mt-4">
        <AmountInput value={v} onChange={setV} label="Withdrawal amount" />
      </div>
      {v && amount.gt(s.available) && <p className="mt-3 text-[13px] font-medium text-lost-ink">You only have {fmtMoney(s.available)} available.</p>}
      <motion.button
        whileTap={valid ? { scale: 0.98 } : undefined}
        aria-disabled={!valid}
        onClick={() => {
          if (!valid) return
          d({ type: 'withdraw', amount: amount.toFixed(2), at: now })
          setV('')
        }}
        className={clsx('mt-4 h-14 w-full rounded-[18px] text-[16px] font-semibold', valid ? 'bg-ink text-white hover:bg-black' : 'bg-chip text-muted')}
      >
        {valid ? `Withdraw ${fmtMoney(amount)}` : 'Enter an amount'}
      </motion.button>
    </section>
  )
}

const ICON = { opening_balance: HandCoins, stake: Ticket, return: Ticket, void_return: RotateCcw, cash_out: HandCoins, deposit: ArrowDownLeft, withdrawal: ArrowUpRight } as const

export function Wallet() {
  const { s, d } = useStore()
  const now = useAccountNow()
  const reserved = s.withdrawals.filter((w) => w.status === 'pending').reduce((t, w) => t.plus(w.amount), D(0))
  const atStake = s.bets.filter((b) => b.status === 'open').reduce((t, b) => t.plus(b.stake), D(0))
  return (
    <div className="mx-auto max-w-[1220px] px-4 pt-6 @tab:px-8 @tab:pt-10">
      <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ease }}>
        <div className="text-[13.5px] font-semibold text-secondary">Wallet · demo funds</div>
        <div className="mt-1 font-display text-[56px] leading-none font-[800] tracking-[-0.055em] tnum @tab:text-[84px]">
          <CountUp value={Number(s.available)} format={money} />
        </div>
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[13px] text-secondary">
          <div>
            <dt>Available to bet or withdraw</dt>
          </div>
          <div>
            <dt className="inline">In open bets </dt>
            <dd className="inline font-semibold text-ink tnum">{fmtMoney(atStake)}</dd>
          </div>
          <div>
            <dt className="inline">Withdrawals pending </dt>
            <dd className="inline font-semibold text-ink tnum">{fmtMoney(reserved)}</dd>
          </div>
        </dl>
      </motion.header>

      <div className="mt-8 grid gap-3 @desk:grid-cols-2">
        <Deposit />
        <Withdraw />
      </div>

      {s.withdrawals.some((w) => w.status === 'pending') && (
        <section className="mt-3 rounded-[26px] bg-surface p-5">
          <h3 className="font-display text-[19px] font-[760] tracking-[-0.03em]">Pending withdrawals</h3>
          <ul className="mt-2">
            {s.withdrawals
              .filter((w) => w.status === 'pending')
              .map((w) => (
                <li key={w.id} className="flex flex-wrap items-center gap-3 border-t border-line py-3 first:border-t-0">
                  <span className="flex-1">
                    <span className="block font-semibold tnum">{fmtMoney(w.amount)}</span>
                    <span className="block text-[12.5px] text-secondary">Requested {fmtTime(w.at)} · set aside from your balance</span>
                  </span>
                  <span className="on-dark flex items-center gap-1 rounded-full bg-[#0b1120] p-1 pl-2.5 text-[11px] font-semibold text-[#f5c04a]">
                    DEMO
                    <button onClick={() => d({ type: 'withdrawalResolve', id: w.id, ok: true, at: now })} className="h-7 rounded-full bg-white/10 px-2.5 text-white hover:bg-white/20">
                      Complete
                    </button>
                    <button onClick={() => d({ type: 'withdrawalResolve', id: w.id, ok: false, at: now })} className="h-7 rounded-full bg-white/10 px-2.5 text-white hover:bg-white/20">
                      Reject
                    </button>
                  </span>
                </li>
              ))}
          </ul>
        </section>
      )}

      <section className="mt-3 rounded-[26px] bg-surface p-5 @tab:p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-[22px] font-[780] tracking-[-0.04em]">Activity</h3>
          <Link to="/safer-gambling" className="flex items-center gap-1.5 text-[13px] font-semibold text-sel-ink hover:underline">
            <Gauge size={14} /> Deposit limits
          </Link>
        </div>
        <ul className="mt-3">
          {s.ledger.map((e) => {
            const I = ICON[e.type]
            const pos = D(e.delta).gt(0)
            return (
              <li key={e.id} className="flex items-center gap-3 border-t border-line py-3 first:border-t-0">
                <span className={clsx('grid size-9 shrink-0 place-items-center rounded-full', pos ? 'bg-won text-won-ink' : 'bg-chip text-secondary')}>
                  <I size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold">{e.label}</span>
                  <span className="block text-[12px] text-secondary">{fmtTime(e.at)}</span>
                </span>
                {e.betId && (
                  <Link to={`/bets/${e.betId}`} className="hidden text-[12.5px] font-semibold text-sel-ink hover:underline @tab:block">
                    View bet
                  </Link>
                )}
                <span className={clsx('w-24 text-right font-display text-[17px] font-[760] tracking-[-0.02em] tnum', pos ? 'text-won-ink' : 'text-ink')}>
                  {pos ? '+' : ''}
                  {fmtMoney(e.delta)}
                </span>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
