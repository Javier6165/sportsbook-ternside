import { shortName } from '../../data/catalog'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { useState } from 'react'
import { COMPETITIONS, EVENTS, SPORTS, type SportId } from '../../data/catalog'
import { LayoutGrid, Rows3 } from 'lucide-react'
import { CompetitionMark } from '../../ui/CompetitionMark'
import { ScoreRow } from '../home/Popular'
import { reasonFor } from '../../lib/feed'
import { useStore } from '../../state/store'
import { SportIcon } from '../../ui/SportIcon'
import { LiveBadge } from '../../ui/LiveBadge'
import { LiveCard } from '../home/LiveNow'
import { PickCard } from '../home/Picks'
import { Hero } from '../home/Hero'
import { HeroCarousel } from '../home/HeroCarousel'

export function LivePage() {
  const { s } = useStore()
  const [sport, setSport] = useState<SportId | 'all'>('all')
  const [view, setView] = useState<'cards' | 'scores'>('cards')
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
        </motion.header>
      </div>

      {live.length > 0 && (
        <div className="mt-6 @tab:px-8">
          <div className="mx-auto max-w-[1156px] overflow-hidden @tab:rounded-[32px]">
            <HeroCarousel
              key={sport}
              label="Live highlights"
              slides={[...mine, ...others].slice(0, 3).map((e) => ({ id: e.id, label: `${shortName(e.home.name)} v ${shortName(e.away.name)}`, node: <Hero ev={e} reason={reasonFor(e, s.prefs)} compact /> }))}
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1220px] px-4 @tab:px-8">

        <div className="mt-6 flex items-center gap-3">
        <div className="no-scrollbar -mx-4 flex min-w-0 flex-1 gap-2 overflow-x-auto px-4 @tab:mx-0 @tab:px-0">
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
          <div role="radiogroup" aria-label="Live layout" className="flex shrink-0 rounded-full bg-chip p-1">
            {([['cards', LayoutGrid, 'Cards'], ['scores', Rows3, 'Scoreboard']] as const).map(([v, Icon, label]) => (
              <button key={v} role="radio" aria-checked={view === v} aria-label={label} title={label} onClick={() => setView(v)} className={clsx('flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold', view === v ? 'bg-surface text-ink shadow-[0_1px_3px_rgba(16,24,43,.14)]' : 'text-secondary')}>
                <Icon size={15} /> <span className="hidden @tab:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {view === 'scores' && live.length > 0 && (
          <div className="mt-8 space-y-3">
            {COMPETITIONS.map((c) => ({ c, evs: live.filter((e) => e.competitionId === c.id) }))
              .filter((g) => g.evs.length)
              .map(({ c, evs }) => (
                <section key={c.id} className="rounded-[24px] bg-surface px-5 pt-4 pb-1" aria-label={`${c.name} live`}>
                  <h2 className="flex items-center gap-2 text-[14px] font-semibold">
                    <CompetitionMark id={c.id} sport={c.sport} size={18} /> {c.name}
                    <span className="font-medium text-secondary">· {c.region}</span>
                  </h2>
                  <ul className="mt-1">
                    {evs.map((ev) => (
                      <ScoreRow key={ev.id} ev={ev} />
                    ))}
                  </ul>
                </section>
              ))}
          </div>
        )}

        {view === 'cards' && mine.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 font-display text-[26px] font-[780] tracking-[-0.04em]">You follow</h2>
            <div className="grid gap-3 @tab:grid-cols-2 @wide:grid-cols-3">
              {mine.map((ev, i) => (
                <LiveCard key={ev.id} ev={ev} i={i} />
              ))}
            </div>
          </section>
        )}
        {view === 'cards' && others.length > 0 && (
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
