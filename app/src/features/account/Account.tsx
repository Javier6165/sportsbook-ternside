import clsx from 'clsx'
import { BadgeCheck, Bell, ChevronRight, CreditCard, Gauge, Gift, Globe, Landmark, Mail, SlidersHorizontal, Ticket, UserRound, Wallet } from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { fmtMoney } from '../../domain/money'
import { useStore } from '../../state/store'

const ease = [0.16, 1, 0.3, 1] as const

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={clsx('relative h-7 w-12 shrink-0 rounded-full transition-colors', on ? 'bg-action' : 'bg-line-strong')}>
      <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 34 }} className={clsx('absolute top-1 size-5 rounded-full bg-white shadow', on ? 'right-1' : 'left-1')} />
    </button>
  )
}

function Card({ title, icon: Icon, children, i }: { title: string; icon: typeof Globe; children: ReactNode; i: number }) {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.04, duration: 0.5, ease }} className="rounded-[24px] bg-surface p-5">
      <div className="flex items-center gap-2">
        <Icon size={17} className="text-secondary" />
        <h2 className="font-display text-[18px] font-[760] tracking-[-0.03em]">{title}</h2>
      </div>
      <div className="mt-3">{children}</div>
    </motion.section>
  )
}

function Line({ k, v, children }: { k: string; v?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-t border-line py-3 first:border-t-0 first:pt-0">
      <span className="flex-1 text-[14px] text-secondary">{k}</span>
      {v && <span className="text-right text-[14px] font-semibold">{v}</span>}
      {children}
    </div>
  )
}

export function Account() {
  const { s, d } = useStore()
  const set = (patch: Partial<typeof s>) => d({ type: 'patch', patch })
  const rows = [
    { to: '/wallet', icon: Wallet, label: 'Wallet and activity', meta: fmtMoney(s.available) },
    { to: '/my-bets', icon: Ticket, label: 'My Bets', meta: `${s.bets.filter((b) => b.status === 'open').length} open` },
    { to: '/promotions', icon: Gift, label: 'Promotions and free bets', meta: `${s.freeBets.filter((f) => f.status === 'available').length} free bets` },
    { to: '/safer-gambling', icon: Gauge, label: 'Safer gambling', meta: `£${Number(s.limits.daily)} / 24h` },
    { to: '/sports?hub=for-you', icon: SlidersHorizontal, label: 'Your feed', meta: `${s.prefs.teams.length + s.prefs.competitions.length} followed` },
  ]
  return (
    <div className="mx-auto max-w-[1220px] px-4 pt-6 @tab:px-8 @tab:pt-10">
      <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <span className="grid size-16 place-items-center rounded-full bg-ink font-display text-[22px] font-[780] text-white">SE</span>
        <div>
          <h1 className="font-display text-[34px] leading-none font-[800] tracking-[-0.05em] @tab:text-[44px]">Sam Ellery</h1>
          <div className="mt-1.5 flex items-center gap-1.5 text-[13.5px] font-semibold text-won-ink">
            <BadgeCheck size={15} /> Verified · fictional demo identity
          </div>
        </div>
      </motion.header>

      <div className="mt-8 grid gap-3 @desk:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          <ul className="overflow-hidden rounded-[24px] bg-surface">
            {rows.map((r) => (
              <li key={r.to + r.label} className="border-t border-line first:border-t-0">
                <Link to={r.to} className="flex items-center gap-3 px-5 py-4 hover:bg-chip">
                  <r.icon size={19} className="text-secondary" />
                  <span className="flex-1 text-[15px] font-semibold">{r.label}</span>
                  <span className="text-[13px] text-secondary tnum">{r.meta}</span>
                  <ChevronRight size={17} className="text-muted" />
                </Link>
              </li>
            ))}
          </ul>

          <Card title="Personal details" icon={UserRound} i={0}>
            <Line k="Name" v="Sam Ellery" />
            <Line k="Email" v="sam.ellery@example.com" />
            <Line k="Mobile" v="07••• ••• 421" />
            <Line k="Date of birth" v="•• •• 1991" />
            <Line k="Address" v="Riverside, London" />
            <p className="mt-2 text-[12px] text-muted">Changes to these details go through support and a fresh verification check. Fictional demo data.</p>
          </Card>

          <Card title="Verification" icon={BadgeCheck} i={1}>
            <Line k="Identity" v={<span className="text-won-ink">Verified · 12 Mar 2026</span>} />
            <Line k="Age (18+)" v={<span className="text-won-ink">Verified</span>} />
            <Line k="Source of funds" v="Not requested" />
          </Card>
        </div>

        <div className="space-y-3">
          <Card title="Payment methods" icon={CreditCard} i={2}>
            <Line k="Demo debit card" v="•••• 0127 · expires 09/29" />
            <Line k="Demo bank account" v="•••• 5530 · for withdrawals" />
            <p className="mt-2 flex items-center gap-1.5 text-[12px] text-muted">
              <Landmark size={13} /> Withdrawals go back to the method you deposited with. No real payments in this demo.
            </p>
          </Card>

          <Card title="Reality check" icon={Bell} i={3}>
            <p className="text-[14px] text-secondary">A reminder with how long you’ve been here and what you’ve staked this session.</p>
            <div role="radiogroup" aria-label="Reality check interval" className="mt-3 inline-flex rounded-full bg-chip p-1">
              {([0, 30, 60] as const).map((m) => (
                <button key={m} role="radio" aria-checked={s.realityCheckMin === m} onClick={() => set({ realityCheckMin: m })} className={clsx('h-9 rounded-full px-4 text-[13.5px] font-semibold', s.realityCheckMin === m ? 'bg-surface text-ink shadow-[0_1px_3px_rgba(16,24,43,.14)]' : 'text-secondary')}>
                  {m === 0 ? 'Off' : `Every ${m} min`}
                </button>
              ))}
            </div>
            <button onClick={() => set({ realityOpen: true })} className="mt-3 block text-[13px] font-semibold text-sel-ink hover:underline">
              Show one now
            </button>
          </Card>

          <Card title="Marketing" icon={Mail} i={4}>
            <Line k="Show offers on the home pages (this app only)">
              <Switch on={s.offersOnHome} onChange={(on) => d({ type: 'offersOnHome', on })} label="Show offers on the home pages" />
            </Line>
            <Line k="Direct marketing · email">
              <Switch on={s.marketingEmail} onChange={(on) => set({ marketingEmail: on })} label="Email offers" />
            </Line>
            <Line k="Direct marketing · text message">
              <Switch on={s.marketingSms} onChange={(on) => set({ marketingSms: on })} label="Text message offers" />
            </Line>
            <p className="mt-2 text-[12px] text-muted">The first is a display preference for this app. Direct marketing is a separate consent per channel, off by default, and nothing is sent during a break or self-exclusion.</p>
          </Card>

          <Card title="Region and format" icon={Globe} i={5}>
            <p className="text-[14px] text-secondary">English (UK) · British pounds · decimal odds. This demo follows one set of GB-style rules (RULES-GB-01), so there’s no country or odds-format switch.</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
