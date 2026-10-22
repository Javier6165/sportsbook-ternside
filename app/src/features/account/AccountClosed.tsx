import { HeartHandshake, Lock } from 'lucide-react'
import { motion } from 'motion/react'
import { D, fmtMoney } from '../../domain/money'
import { useStore } from '../../state/store'

/** V13 — administrative status only: no odds, no live, no Cash Out, no reactivation. */
export function AccountClosed() {
  const { s } = useStore()
  const open = s.bets.filter((b) => b.status === 'open')
  const returning = s.withdrawals.filter((w) => w.status === 'pending').reduce((t, w) => t.plus(w.amount), D(0))
  return (
    <div className="mx-auto max-w-[720px] px-4 pt-10 pb-10 @tab:pt-16">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <span className="grid size-14 place-items-center rounded-full bg-ink text-white">
          <Lock size={24} />
        </span>
        <h1 className="mt-5 font-display text-[40px] leading-[.95] font-[800] tracking-[-0.05em] @tab:text-[52px]">Your account is closed for gambling.</h1>
        <p className="mt-3 text-[16px] text-secondary">You chose to self-exclude. This took effect straight away and won’t end automatically.</p>
      </motion.div>
      <div className="mt-8 space-y-3">
        <section className="rounded-[24px] bg-surface p-5">
          <h2 className="font-display text-[19px] font-[760] tracking-[-0.03em]">Your money</h2>
          <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3 text-[14px]">
            <span className="text-secondary">Being returned to your demo bank</span>
            <span className="font-display text-[22px] font-[780] tnum">{fmtMoney(returning)}</span>
          </div>
          <p className="mt-2 text-[12.5px] text-secondary">This money can’t be used to bet. If a return is delayed we’ll keep it set aside until it reaches you.</p>
        </section>
        <section className="rounded-[24px] bg-surface p-5">
          <h2 className="font-display text-[19px] font-[760] tracking-[-0.03em]">Bets you’d already placed</h2>
          {open.length ? (
            <>
              <ul className="mt-3">
                {open.map((b) => (
                  <li key={b.id} className="flex justify-between border-t border-line py-2.5 text-[14px]">
                    <span className="min-w-0 truncate font-semibold">{b.type === 'builder' ? 'Bet Builder' : b.legs[0].label} · {b.legs[0].eventLabel}</span>
                    <span className="text-secondary tnum">{fmtMoney(b.stake)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[12.5px] text-secondary">They settle under the rules you accepted. Any returns are added to the money sent back to you — they won’t reopen betting.</p>
            </>
          ) : (
            <p className="mt-2 text-[14px] text-secondary">No open bets.</p>
          )}
        </section>
        <section className="flex items-start gap-4 rounded-[24px] bg-ink p-5 text-white">
          <HeartHandshake size={22} className="mt-0.5 shrink-0 text-brand-dark" />
          <div><p className="text-[14px] text-white/75">Free, confidential support, 24 hours a day in Great Britain.</p><div className="mt-3 flex flex-wrap gap-2"><a href="tel:08088020133" className="inline-flex min-h-10 flex-col justify-center rounded-[18px] bg-white px-4 py-2 text-[13.5px] leading-tight font-semibold text-ink"><span>National Gambling Helpline</span><span className="text-[12.5px] font-medium text-secondary tnum">0808 8020 133 · free, 24/7</span></a><a href="https://www.begambleaware.org" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center rounded-[18px] bg-white/15 px-4 text-[13.5px] font-semibold text-white">BeGambleAware.org</a></div></div>
        </section>
        <p className="pt-2 text-[12px] text-muted">To explore the demo again, use Reset in Demo controls. That restores the fictional session — it isn’t how a real account reopens.</p>
      </div>
    </div>
  )
}
