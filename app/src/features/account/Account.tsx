import { BadgeCheck, ChevronRight, Gauge, Globe, SlidersHorizontal, Wallet } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { fmtMoney } from '../../domain/money'
import { useStore } from '../../state/store'

export function Account() {
  const { s } = useStore()
  const rows = [
    { to: '/wallet', icon: Wallet, label: 'Wallet and activity', meta: fmtMoney(s.available) },
    { to: '/safer-gambling', icon: Gauge, label: 'Safer gambling', meta: `£${Number(s.limits.daily)} / 24h` },
    { to: '/my-bets', icon: BadgeCheck, label: 'My Bets', meta: `${s.bets.filter((b) => b.status === 'open').length} open` },
    { to: '/sports', icon: SlidersHorizontal, label: 'Your feed', meta: `${s.prefs.teams.length + s.prefs.competitions.length} followed` },
  ]
  return (
    <div className="mx-auto max-w-[720px] px-4 pt-6 @tab:pt-10">
      <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <span className="grid size-16 place-items-center rounded-full bg-ink font-display text-[22px] font-[780] text-white">SE</span>
        <div>
          <h1 className="font-display text-[34px] leading-none font-[800] tracking-[-0.05em]">Sam Ellery</h1>
          <div className="mt-1.5 flex items-center gap-1.5 text-[13.5px] font-semibold text-won-ink">
            <BadgeCheck size={15} /> Verified · fictional demo identity
          </div>
        </div>
      </motion.header>
      <ul className="mt-8 overflow-hidden rounded-[24px] bg-surface">
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
      <section className="mt-3 rounded-[24px] bg-surface p-5">
        <div className="flex items-center gap-2">
          <Globe size={17} className="text-secondary" />
          <h2 className="font-display text-[18px] font-[760] tracking-[-0.03em]">Region and format</h2>
        </div>
        <p className="mt-2 text-[14px] text-secondary">English (UK) · British pounds · decimal odds. This demo follows one set of GB-style rules (RULES-GB-01), so there’s no country or odds-format switch.</p>
      </section>
    </div>
  )
}
