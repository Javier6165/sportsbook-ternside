import clsx from 'clsx'
import { Bell, ChevronRight, Clock, Coffee, HeartHandshake, Lock, ShieldCheck } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { LIMIT_LABEL, used, type LimitKey } from '../../domain/limits'
import { D, EDITABLE_AMOUNT, fmtMoney, parseAmount } from '../../domain/money'
import { useAccountNow, useStore } from '../../state/store'

const ease = [0.16, 1, 0.3, 1] as const
const fmtTime = (iso: string) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))

function Ring({ pct }: { pct: number }) {
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">
      <circle cx="42" cy="42" r={r} fill="none" stroke="var(--color-chip)" strokeWidth="9" />
      <motion.circle
        cx="42"
        cy="42"
        r={r}
        fill="none"
        stroke={pct >= 100 ? 'var(--color-warn-ink)' : 'var(--color-won-ink)'}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - Math.min(1, pct / 100)) }}
        transition={{ duration: 1, ease }}
        transform="rotate(-90 42 42)"
      />
    </svg>
  )
}

function LimitCard({ k }: { k: LimitKey }) {
  const { s, d } = useStore()
  const now = useAccountNow()
  const [edit, setEdit] = useState(false)
  const [v, setV] = useState(s.limits[k])
  const u = used(s.deposits, k, now)
  const lim = D(s.limits[k])
  const pct = lim.isZero() ? 100 : u.div(lim).times(100).toNumber()
  const pending = s.pendingIncrease?.key === k ? s.pendingIncrease : null
  const ready = pending && Date.parse(now) >= Date.parse(pending.availableAt)
  return (
    <motion.li initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ease }} className="rounded-[24px] bg-surface p-5">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Ring pct={pct} />
          <span className="absolute inset-0 grid place-items-center text-[13px] font-bold tnum">{Math.round(pct)}%</span>
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-secondary">{LIMIT_LABEL[k]}</div>
          <div className="font-display text-[26px] leading-none font-[780] tracking-[-0.04em] tnum">{fmtMoney(lim)}</div>
          <div className="mt-1 text-[12.5px] text-secondary tnum">
            {fmtMoney(u)} deposited · {fmtMoney(lim.minus(u).lt(0) ? D(0) : lim.minus(u))} left
          </div>
        </div>
      </div>
      {pending && (
        <div className="mt-4 rounded-[16px] bg-warn p-3.5 text-[13px] text-warn-ink">
          <div className="font-semibold">Increase to {fmtMoney(pending.value)} requested</div>
          <div className="mt-0.5">{ready ? 'The waiting time is over. Confirm if you still want it.' : `Available to confirm from ${fmtTime(pending.availableAt)}. Increases always wait 24 hours.`}</div>
          <div className="mt-2.5 flex gap-2">
            <button onClick={() => ready && d({ type: 'confirmIncrease', at: now })} disabled={!ready} className={clsx('h-9 rounded-full px-3.5 text-[12.5px] font-semibold', ready ? 'bg-warn-ink text-white' : 'cursor-not-allowed bg-warn-ink/20 text-warn-ink/70')}>
              Confirm increase
            </button>
            <button onClick={() => d({ type: 'cancelIncrease' })} className="h-9 rounded-full px-3 text-[12.5px] font-semibold hover:bg-warn-ink/10">
              Keep current limit
            </button>
          </div>
        </div>
      )}
      <AnimatePresence initial={false}>
        {edit ? (
          <motion.div key="e" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-4 flex gap-2">
              <label className="flex h-12 flex-1 items-center rounded-[14px] bg-chip px-3 focus-within:shadow-[0_0_0_2px_var(--color-action)]">
                <span className="font-semibold text-secondary">£</span>
                <input aria-label={`New ${LIMIT_LABEL[k]} limit`} inputMode="decimal" value={v} onChange={(e) => EDITABLE_AMOUNT.test(e.target.value) && setV(e.target.value)} className="w-full bg-transparent pl-1 font-semibold outline-none tnum" />
              </label>
              <button
                onClick={() => {
                  if (!parseAmount(v)) return
                  d({ type: 'setLimit', key: k, value: v, at: now })
                  setEdit(false)
                }}
                disabled={!parseAmount(v)}
                className="h-12 rounded-[14px] bg-ink px-4 text-[14px] font-semibold text-white"
              >
                Save
              </button>
            </div>
            <p className="mt-2 text-[12px] text-secondary">Lower limits apply straight away. Higher limits wait 24 hours and need confirming.</p>
          </motion.div>
        ) : (
          <motion.button key="b" onClick={() => (setV(s.limits[k]), setEdit(true))} className="mt-4 h-10 w-full rounded-full bg-chip text-[13.5px] font-semibold hover:bg-chip-hover">
            Change limit
          </motion.button>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

export function SaferGambling() {
  const { s, d } = useStore()
  const now = useAccountNow()
  const nav = useNavigate()
  const [brk, setBrk] = useState<string | null>(null)
  const [excl, setExcl] = useState<string | null>(null)
  return (
    <div className="mx-auto max-w-[1220px] px-4 pt-6 @tab:px-8 @tab:pt-10">
      <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-[13.5px] font-semibold text-won-ink">
          <ShieldCheck size={16} /> Safer gambling
        </div>
        <h1 className="mt-1 font-display text-[40px] leading-[.95] font-[800] tracking-[-0.05em] @tab:text-[56px]">
          Your limits, your call<span className="text-action">.</span>
        </h1>
        <p className="mt-2 max-w-[620px] text-[15.5px] text-secondary">Set limits, take a break or step away. Lower limits apply straight away.</p>
      </motion.header>

      {s.restriction === 'paused' && s.pausedUntil && (
        <div className="mt-6 flex items-center gap-3 rounded-[22px] bg-ink p-5 text-white">
          <Coffee size={22} />
          <span>
            <span className="block font-semibold">You’re taking a break until {fmtTime(s.pausedUntil)}.</span>
            <span className="block text-[13px] text-white/65">Betting and deposits are off. You can still see your bets and withdraw.</span>
          </span>
        </div>
      )}

      <h2 className="mt-10 font-display text-[26px] font-[780] tracking-[-0.04em]">Deposit limits</h2>
      <ul className="mt-4 grid gap-3 @tab:grid-cols-3">
        {(['daily', 'weekly', 'monthly'] as LimitKey[]).map((k) => (
          <LimitCard key={k} k={k} />
        ))}
      </ul>
      <p className="mt-2 text-[12px] text-muted">24 hours and 7 days roll with time — midnight doesn’t reset them. The month follows UK time.</p>

      <Link to="/account" className="mt-6 flex items-center gap-3 rounded-[22px] bg-surface px-5 py-4 hover:bg-chip">
        <Bell size={18} className="text-secondary" />
        <span className="flex-1">
          <span className="block text-[15px] font-semibold">Reality check</span>
          <span className="block text-[13px] text-secondary">{s.realityCheckMin ? `A reminder every ${s.realityCheckMin} minutes` : 'Off · get a reminder of time and stakes while you play'}</span>
        </span>
        <ChevronRight size={17} className="text-muted" />
      </Link>

      <div className="mt-10 grid gap-3 @desk:grid-cols-2">
        <section className="rounded-[26px] bg-surface p-6">
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <h2 className="font-display text-[22px] font-[780] tracking-[-0.04em]">Take a break</h2>
          </div>
          <p className="mt-2 text-[14px] text-secondary">Pause betting and deposits for a while. You’ll keep access to your bets and can still withdraw.</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              ['24 hours', 24],
              ['7 days', 168],
              ['30 days', 720],
            ].map(([l, h]) => (
              <button key={l} onClick={() => setBrk(String(h))} className={clsx('h-12 rounded-[14px] text-[14px] font-semibold', brk === String(h) ? 'bg-ink text-white' : 'bg-chip hover:bg-chip-hover')} disabled={s.restriction !== 'none'}>
                {l}
              </button>
            ))}
          </div>
          {brk && s.restriction === 'none' && (
            <div className="mt-3 rounded-[16px] bg-chip p-4 text-[13.5px]">
              Your break starts now and can’t be cancelled early. Your betslip will be cleared.
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    d({ type: 'pause', until: new Date(Date.parse(now) + Number(brk) * 3600_000).toISOString() })
                    setBrk(null)
                  }}
                  className="h-10 rounded-full bg-ink px-4 font-semibold text-white"
                >
                  Start break
                </button>
                <button onClick={() => setBrk(null)} className="h-10 rounded-full px-3 font-semibold text-secondary">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-[26px] bg-surface p-6">
          <div className="flex items-center gap-2">
            <Lock size={18} />
            <h2 className="font-display text-[22px] font-[780] tracking-[-0.04em]">Self-exclusion</h2>
          </div>
          <p className="mt-2 text-[14px] text-secondary">Close your account for gambling for at least six months. It takes effect immediately, your balance is returned, and open bets still settle — any winnings come back to you too.</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['6 months', '1 year', '5 years'].map((p) => (
              <button key={p} onClick={() => setExcl(p)} className={clsx('h-12 rounded-[14px] text-[14px] font-semibold', excl === p ? 'bg-lost-ink text-white' : 'bg-chip hover:bg-chip-hover')}>
                {p}
              </button>
            ))}
          </div>
          {excl && (
            <div className="mt-3 rounded-[16px] bg-lost p-4 text-[13.5px] text-lost-ink">
              <b className="font-semibold">Close my account for {excl}?</b> You won’t be able to bet or deposit, and it won’t reopen automatically. {D(s.available).gt(0) && `${fmtMoney(s.available)} will be returned to your demo bank.`}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    d({ type: 'exclude', at: now })
                    nav('/account-closed')
                  }}
                  className="h-10 rounded-full bg-lost-ink px-4 font-semibold text-white"
                >
                  Close my account
                </button>
                <button onClick={() => setExcl(null)} className="h-10 rounded-full px-3 font-semibold">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="mt-3 flex items-start gap-4 rounded-[26px] bg-ink p-6 text-white">
        <HeartHandshake size={22} className="mt-0.5 shrink-0 text-brand-dark" />
        <div>
          <h2 className="font-display text-[20px] font-[760] tracking-[-0.03em]">Want to talk to someone?</h2>
          <p className="mt-1 text-[14px] text-white/70">Free, confidential support, 24 hours a day in Great Britain.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href="tel:08088020133" className="inline-flex min-h-10 flex-col justify-center rounded-[18px] bg-white px-4 py-2 text-[13.5px] leading-tight font-semibold text-ink"><span>National Gambling Helpline</span><span className="text-[12.5px] font-medium text-secondary tnum">0808 8020 133 · free, 24/7</span></a>
            <a href="https://www.begambleaware.org" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center rounded-[18px] bg-white/15 px-4 text-[13.5px] font-semibold text-white hover:bg-white/25">BeGambleAware.org</a>
          </div>
        </div>
      </section>
      {(s.pendingIncrease || s.restriction === 'paused') && (
        <div className="on-dark mt-3 inline-flex items-center gap-2 rounded-full bg-[#0b1120] p-1 pl-3 text-[11.5px] font-semibold text-[#f5c04a]">
          DEMO
          <button onClick={() => d({ type: 'advanceAccount', hours: 24 })} className="h-8 rounded-full bg-white/10 px-3 text-white hover:bg-white/20">
            Advance account clock 24 hours
          </button>
        </div>
      )}
    </div>
  )
}
