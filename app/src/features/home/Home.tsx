import { shortName } from '../../data/catalog'
import { ShieldCheck, SlidersHorizontal } from 'lucide-react'
import { motion } from 'motion/react'
import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { buildFeed, reasonFor } from '../../lib/feed'
import { useStore } from '../../state/store'
import { BuilderRow } from './BuilderRow'
import { Hero } from './Hero'
import { HeroCarousel, type Slide } from './HeroCarousel'
import { SportsBar } from '../../shell/SportsBar'
import { LiveNow } from './LiveNow'
import { EverythingElse, Picks } from './Picks'
import { TuneSheet } from './TuneSheet'
import { OffersRow } from './OffersRow'
import { PopularHub } from './Popular'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line pt-7 pb-12 text-[12.5px] text-secondary">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <span className="grid size-9 place-items-center rounded-full border-2 border-ink text-[12px] font-bold text-ink">18+</span>
        <Link to="/safer-gambling" className="flex items-center gap-1.5 font-semibold text-ink hover:text-sel-ink">
          <ShieldCheck size={15} className="text-won-ink" /> Safer gambling
        </Link>
        <Link to="/safer-gambling" className="font-semibold text-ink hover:text-sel-ink">
          Deposit limits
        </Link>
        <span>Betting rules · RULES-GB-01 rev 0.4</span>
      </div>
      <p className="mt-4 max-w-[640px] leading-relaxed text-muted">
        Ternside is a fictional sportsbook concept by Javier Ortiz, built for a design portfolio. Teams, players, competitions and prices are invented. No real money, accounts or
        payments are involved.
      </p>
    </footer>
  )
}

/** For you (personal) ↔ Popular (the same for everyone). The last choice is remembered. */
function HubSwitch({ hub, onChange }: { hub: 'for-you' | 'popular'; onChange: (h: 'for-you' | 'popular') => void }) {
  return (
    <div role="tablist" aria-label="Home" className="hidden rounded-full bg-chip p-1 @desk:inline-flex">
      {(['for-you', 'popular'] as const).map((h) => (
        <button key={h} role="tab" aria-selected={hub === h} onClick={() => onChange(h)} className={clsx('relative z-10 h-9 rounded-full px-4 text-[13.5px] font-semibold', hub === h ? 'text-ink' : 'text-secondary hover:text-ink')}>
          {hub === h && <motion.span layoutId="hub-pill" className="absolute inset-0 -z-10 rounded-full bg-surface shadow-[0_1px_3px_rgba(16,24,43,.14)]" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
          {h === 'for-you' ? 'For you' : 'Popular'}
        </button>
      ))}
    </div>
  )
}

export function Home() {
  const { s, d } = useStore()
  const [q, setQ] = useSearchParams()
  const hub = (q.get('hub') as 'for-you' | 'popular' | null) ?? s.hub
  useEffect(() => {
    if (hub !== s.hub) d({ type: 'hub', hub })
  }, [hub, s.hub, d])
  const setHub = (h: 'for-you' | 'popular') => setQ({ hub: h }, { replace: true })
  const [tune, setTune] = useState(false)
  const feed = useMemo(() => buildFeed(s.prefs), [s.prefs])
  const reason = reasonFor(feed.featured, s.prefs)
  const teamPlaying = feed.featured.home.id === 'northbridge' || reason?.kind === 'team'
  // The personal hub has one banner — your match — so the Bet Builder ideas below clearly belong to it.
  const slides: Slide[] = [{ id: feed.featured.id, label: `${shortName(feed.featured.home.name)} v ${shortName(feed.featured.away.name)}`, node: <Hero ev={feed.featured} reason={reason} controls={false} /> }]

  return (
    <>
      <SportsBar />
      <div className="mx-auto max-w-[1220px] px-4 pt-4 @tab:px-8 @tab:pt-8">
        <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="mb-4 flex flex-wrap items-end justify-between gap-3 @tab:mb-7 @tab:gap-4">
          <div>
            <div className="mb-0 flex items-center gap-3 @tab:mb-3 @desk:mb-4">
              <HubSwitch hub={hub} onChange={setHub} />
              <span className="hidden text-[13.5px] font-semibold text-secondary @tab:block">Tuesday 20 October</span>
            </div>
            <h1 className="font-display text-[30px] leading-[.95] font-[800] tracking-[-0.05em] @tab:text-[48px]">
              {hub === 'popular' ? 'Popular tonight' : 'Good evening, Sam'}
              <span className="text-action">.</span>
            </h1>
            <p className="mt-1.5 text-[14px] text-secondary @tab:mt-2 @tab:text-[16.5px]">
              {hub === 'popular'
                ? 'The biggest matches and markets across Ternside.'
                : teamPlaying && reason
                  ? feed.featured.status === 'live'
                    ? `${feed.featured.home.name} are playing right now.`
                    : `${feed.featured.home.name} play tonight. Here’s what matters to you.`
                  : 'Here’s what’s worth your time tonight.'}
            </p>
          </div>
          <div className="flex gap-2">
            {hub === 'for-you' && (
            <button onClick={() => setTune(true)} className="flex h-9 items-center gap-2 rounded-full bg-surface px-3.5 text-[13px] font-semibold whitespace-nowrap @tab:h-10 @tab:px-4 @tab:text-[13.5px] text-ink shadow-[0_1px_2px_rgba(16,24,43,.06)] hover:bg-chip">
              <SlidersHorizontal size={15} /> Tune your feed
            </button>
            )}
            <Link to="/safer-gambling" className="flex h-9 items-center gap-2 rounded-full bg-surface px-3.5 text-[13px] font-semibold whitespace-nowrap @tab:h-10 @tab:px-4 @tab:text-[13.5px] text-ink shadow-[0_1px_2px_rgba(16,24,43,.06)] hover:bg-chip">
              <ShieldCheck size={15} className="text-won-ink" /> Deposit limits
            </Link>
          </div>
        </motion.header>
      </div>

      {hub === 'popular' ? (
        <>
          <PopularHub />
          <div className="mx-auto max-w-[1220px] px-4 @tab:px-8">
            <Footer />
          </div>
        </>
      ) : (
        <>
          <div className="@tab:px-8">
            <div className="mx-auto max-w-[1156px] overflow-hidden @tab:rounded-[32px]">
              <HeroCarousel slides={slides} label="Featured" />
            </div>
          </div>

          <div className="mx-auto max-w-[1220px] px-4 @tab:px-8">
            {feed.featured.builder && feed.featured.status === 'scheduled' && <BuilderRow ev={feed.featured} />}
            {s.offersOnHome && s.restriction === 'none' && <OffersRow ids={['bb-insurance', 'predictor', 'matchday-free-bet']} />}
            <LiveNow mine={feed.liveMine} other={feed.liveOther} />
            <Picks picks={feed.picks} />
            <EverythingElse rest={feed.rest} hidden={feed.hiddenCount} />
            <Footer />
          </div>
        </>
      )}
      <TuneSheet open={tune} onClose={() => setTune(false)} />
    </>
  )
}
