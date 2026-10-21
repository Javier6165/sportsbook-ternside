import clsx from 'clsx'
import { Ticket } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Link, useSearchParams } from 'react-router'
import { D, fmtMoney } from '../../domain/money'
import { useStore } from '../../state/store'
import { BetPass } from './BetPass'

export function MyBets() {
  const { s } = useStore()
  const [q, setQ] = useSearchParams()
  const tab = q.get('tab') === 'settled' ? 'settled' : 'open'
  const open = s.bets.filter((b) => b.status === 'open')
  const settled = s.bets.filter((b) => b.status !== 'open')
  const list = tab === 'open' ? open : settled
  const atStake = open.reduce((t, b) => t.plus(b.stake), D(0))
  const potential = open.reduce((t, b) => t.plus(b.potentialReturn), D(0))

  return (
    <div className="mx-auto max-w-[1220px] px-4 pt-6 @tab:px-8 @tab:pt-10">
      <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[40px] leading-[.95] font-[800] tracking-[-0.05em] @tab:text-[56px]">
            My Bets<span className="text-action">.</span>
          </h1>
          <p className="mt-2 text-[15.5px] text-secondary">The same ticket you built, from placement to settlement.</p>
        </div>
        {open.length > 0 && (
          <dl className="flex gap-6 text-[12.5px] text-secondary">
            <div>
              <dt>At stake</dt>
              <dd className="font-display text-[22px] font-[760] text-ink tnum">{fmtMoney(atStake)}</dd>
            </div>
            <div>
              <dt>Potential return</dt>
              <dd className="font-display text-[22px] font-[760] text-ink tnum">{fmtMoney(potential)}</dd>
            </div>
          </dl>
        )}
      </motion.header>

      <div role="tablist" aria-label="Bet status" className="mt-6 inline-flex rounded-full bg-chip p-1">
        {(['open', 'settled'] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setQ(t === 'open' ? {} : { tab: t }, { replace: true })}
            className={clsx('relative z-10 h-10 rounded-full px-5 text-[14px] font-semibold', tab === t ? 'text-ink' : 'text-secondary hover:text-ink')}
          >
            {tab === t && <motion.span layoutId="mybets-tab" className="absolute inset-0 -z-10 rounded-full bg-surface shadow-[0_1px_3px_rgba(16,24,43,.14)]" />}
            {t === 'open' ? 'Open' : 'Settled'} <span className="ml-1 text-secondary tnum">{t === 'open' ? open.length : settled.length}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 @tab:grid-cols-2 @wide:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((b, i) => (
            <BetPass key={b.id} bet={b} i={i} />
          ))}
        </AnimatePresence>
      </div>

      {list.length === 0 && (
        <div className="mt-2 rounded-[26px] bg-surface px-6 py-14 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-chip">
            <Ticket size={24} />
          </span>
          <div className="mt-4 font-display text-[22px] font-[780] tracking-[-0.04em]">{tab === 'open' ? 'No open bets' : 'Nothing settled yet'}</div>
          <p className="mx-auto mt-1.5 max-w-[340px] text-[14px] text-secondary">
            {tab === 'open' ? 'Bets you place appear here with every condition, so you can follow them live.' : 'Settled bets show what won, lost or was void — and exactly why.'}
          </p>
          {tab === 'open' && (
            <Link to="/sports" className="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-5 text-[14px] font-semibold text-white">
              Find a match
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
