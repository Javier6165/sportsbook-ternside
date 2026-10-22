import clsx from 'clsx'
import { Ticket } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
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
  const [kind, setKind] = useState<'all' | 'single' | 'builder' | 'acca'>('all')
  const [result, setResult] = useState<'all' | 'won' | 'lost' | 'void' | 'cashed_out'>('all')
  const list = (tab === 'open' ? open : settled).filter((b) => (kind === 'all' || b.type === kind) && (tab === 'open' || result === 'all' || b.status === result))
  // Settled summary: cash stakes and what came back. Free-bet stakes were never the customer's money.
  const staked = settled.reduce((t, b) => (b.freeBet ? t : t.plus(b.stake)), D(0))
  const returned = settled.reduce((t, b) => t.plus(b.settlement?.gross ?? 0), D(0))
  const netAll = returned.minus(staked)
  const chip = (on: boolean) => clsx('h-9 shrink-0 rounded-full px-3.5 text-[13px] font-semibold transition-colors', on ? 'bg-ink text-white' : 'bg-surface text-ink hover:bg-chip')
  const atStake = open.reduce((t, b) => t.plus(b.stake), D(0))
  const potential = open.reduce((t, b) => t.plus(b.potentialReturn), D(0))

  return (
    <div className="mx-auto max-w-[1220px] px-4 pt-6 @tab:px-8 @tab:pt-10">
      <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[40px] leading-[.95] font-[800] tracking-[-0.05em] @tab:text-[56px]">
            My Bets<span className="text-action">.</span>
          </h1>
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

      {tab === 'settled' && settled.length > 0 && (
        <dl className="mt-5 grid grid-cols-3 gap-2 rounded-[22px] bg-surface p-4 @tab:max-w-[560px]">
          <div>
            <dt className="text-[12px] font-semibold text-secondary">Staked</dt>
            <dd className="font-display text-[20px] font-[760] tnum">{fmtMoney(staked)}</dd>
          </div>
          <div>
            <dt className="text-[12px] font-semibold text-secondary">Returned</dt>
            <dd className="font-display text-[20px] font-[760] tnum">{fmtMoney(returned)}</dd>
          </div>
          <div>
            <dt className="text-[12px] font-semibold text-secondary">Net</dt>
            <dd className={clsx('font-display text-[20px] font-[760] tnum', netAll.gt(0) ? 'text-won-ink' : netAll.lt(0) ? 'text-lost-ink' : '')}>
              {netAll.gt(0) ? '+' : ''}
              {fmtMoney(netAll)}
            </dd>
          </div>
          <dd className="col-span-3 text-[11.5px] text-muted">These settled bets. Free-bet stakes aren’t counted as staked.</dd>
        </dl>
      )}

      <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 @tab:mx-0 @tab:flex-wrap @tab:px-0" role="group" aria-label="Filter bets">
        {(['all', 'single', 'builder', 'acca'] as const).map((k) => (
          <button key={k} aria-pressed={kind === k} onClick={() => setKind(k)} className={chip(kind === k)}>
            {k === 'all' ? 'All types' : k === 'single' ? 'Singles' : k === 'builder' ? 'Bet Builders' : 'Accumulators'}
          </button>
        ))}
        {tab === 'settled' && <span className="mx-1 my-2 w-px shrink-0 bg-line-strong" />}
        {tab === 'settled' &&
          (['all', 'won', 'lost', 'void', 'cashed_out'] as const).map((k) => (
            <button key={k} aria-pressed={result === k} onClick={() => setResult(k)} className={chip(result === k)}>
              {k === 'all' ? 'Any result' : k === 'cashed_out' ? 'Cashed out' : k[0].toUpperCase() + k.slice(1)}
            </button>
          ))}
      </div>

      <div className="mt-4 grid gap-3 @tab:grid-cols-2 @wide:grid-cols-3">
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
          <div className="mt-4 font-display text-[22px] font-[780] tracking-[-0.04em]">{kind !== 'all' || result !== 'all' ? 'No bets match these filters' : tab === 'open' ? 'No open bets' : 'Nothing settled yet'}</div>
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
