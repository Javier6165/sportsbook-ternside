import clsx from 'clsx'
import { motion } from 'motion/react'
import { useState } from 'react'
import { EVENTS, SPORTS, type SportId } from '../../data/catalog'
import { reasonFor } from '../../lib/feed'
import { useStore } from '../../state/store'
import { SportIcon } from '../../ui/SportIcon'
import { LiveBadge } from '../../ui/LiveBadge'
import { LiveCard } from '../home/LiveNow'
import { PickCard } from '../home/Picks'

export function LivePage() {
  const { s } = useStore()
  const [sport, setSport] = useState<SportId | 'all'>('all')
  const live = EVENTS.filter((e) => e.status === 'live').filter((e) => sport === 'all' || e.sport === sport)
  const mine = live.filter((e) => reasonFor(e, s.prefs))
  const others = live.filter((e) => !reasonFor(e, s.prefs))
  const soon = EVENTS.filter((e) => e.status === 'scheduled' && e.startsAt <= '2026-10-20T21:00:00Z')
    .filter((e) => sport === 'all' || e.sport === sport)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, 4)

  return (
    <div>
      <div className="mx-auto max-w-[1220px] px-4 pt-6 @tab:px-8 @tab:pt-10">
        <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <LiveBadge clock="In play now" />
          <h1 className="mt-2 font-display text-[44px] leading-[.95] font-[800] tracking-[-0.05em] @tab:text-[64px]">
            Live<span className="text-live">.</span>
          </h1>
          <p className="mt-2 text-[15.5px] text-secondary">Every score here is an observation. Bets settle on the official result.</p>
        </motion.header>

        <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 @tab:mx-0 @tab:px-0">
          {[{ id: 'all' as const, name: 'All sports' }, ...SPORTS].map((x) => (
            <button
              key={x.id}
              onClick={() => setSport(x.id)}
              aria-pressed={sport === x.id}
              className={clsx('flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13.5px] font-semibold', sport === x.id ? 'bg-ink text-white' : 'bg-surface text-ink hover:bg-chip')}
            >
              {x.id !== 'all' && <SportIcon sport={x.id} size={15} />} {x.name}
            </button>
          ))}
        </div>

        {mine.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 font-display text-[26px] font-[780] tracking-[-0.04em]">You follow</h2>
            <div className="grid gap-3 @tab:grid-cols-2 @wide:grid-cols-3">
              {mine.map((ev, i) => (
                <LiveCard key={ev.id} ev={ev} i={i} />
              ))}
            </div>
          </section>
        )}
        {others.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 font-display text-[26px] font-[780] tracking-[-0.04em]">{mine.length ? 'Also live' : 'Live now'}</h2>
            <div className="grid gap-3 @tab:grid-cols-2 @wide:grid-cols-3">
              {others.map((ev, i) => (
                <LiveCard key={ev.id} ev={ev} i={i} />
              ))}
            </div>
          </section>
        )}
        {live.length === 0 && (
          <div className="mt-8 rounded-[26px] bg-surface px-6 py-12 text-center">
            <div className="font-display text-[22px] font-[780] tracking-[-0.04em]">Nothing live in this sport right now</div>
            <p className="mt-1 text-[14px] text-secondary">Here’s what starts next.</p>
          </div>
        )}

        {soon.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 font-display text-[26px] font-[780] tracking-[-0.04em]">Starting soon</h2>
            <div className="grid gap-3 @tab:grid-cols-2">
              {soon.map((e, i) => (
                <PickCard key={e.id} ev={e} reason={reasonFor(e, s.prefs) ?? { kind: 'popular', text: 'Starts tonight' }} i={i} />
              ))}
            </div>
          </section>
        )}
        <p className="mt-10 text-[12px] text-muted">Live information can be delayed. Others may have more up-to-date information.</p>
      </div>
    </div>
  )
}
