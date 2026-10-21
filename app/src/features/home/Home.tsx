import { ShieldCheck, SlidersHorizontal } from 'lucide-react'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { buildFeed, reasonFor } from '../../lib/feed'
import { useStore } from '../../state/store'
import { Hero } from './Hero'
import { LiveNow } from './LiveNow'
import { EverythingElse, Picks } from './Picks'
import { TuneSheet } from './TuneSheet'

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
        <span>Rules RULES-GB-01 · rev. 0.4</span>
      </div>
      <p className="mt-4 max-w-[640px] leading-relaxed text-muted">
        Ternside is a fictional sportsbook concept by Javier Ortiz, built for a design portfolio. Teams, players, competitions and prices are invented. No real money, accounts or
        payments are involved.
      </p>
    </footer>
  )
}

export function Home() {
  const { s } = useStore()
  const [tune, setTune] = useState(false)
  const feed = useMemo(() => buildFeed(s.prefs), [s.prefs])
  const reason = reasonFor(feed.featured, s.prefs)
  const teamPlaying = feed.featured.home.id === 'northbridge' || reason?.kind === 'team'

  return (
    <div className="mx-auto max-w-[1220px] px-4 pt-6 @tab:px-8 @tab:pt-10">
      <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="mb-6 flex flex-wrap items-end justify-between gap-4 @tab:mb-8">
        <div>
          <div className="text-[13.5px] font-semibold text-secondary">Tuesday 20 October</div>
          <h1 className="mt-1 font-display text-[40px] leading-[.95] font-[800] tracking-[-0.05em] @tab:text-[56px]">
            Good evening, Sam<span className="text-action">.</span>
          </h1>
          <p className="mt-2 text-[16px] text-secondary @tab:text-[17px]">
            {teamPlaying && reason ? `${feed.featured.home.name} play tonight. Here’s what matters to you.` : 'Here’s what’s worth your time tonight.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTune(true)} className="flex h-10 items-center gap-2 rounded-full bg-surface px-4 text-[13.5px] font-semibold text-ink shadow-[0_1px_2px_rgba(16,24,43,.06)] hover:bg-chip">
            <SlidersHorizontal size={15} /> Tune your feed
          </button>
          <Link to="/safer-gambling" className="flex h-10 items-center gap-2 rounded-full bg-surface px-4 text-[13.5px] font-semibold text-ink shadow-[0_1px_2px_rgba(16,24,43,.06)] hover:bg-chip">
            <ShieldCheck size={15} className="text-won-ink" /> Deposit limits
          </Link>
        </div>
      </motion.header>

      <Hero ev={feed.featured} reason={reason} />
      <LiveNow mine={feed.liveMine} other={feed.liveOther} />
      <Picks picks={feed.picks} />
      <EverythingElse rest={feed.rest} hidden={feed.hiddenCount} />
      <Footer />
      <TuneSheet open={tune} onClose={() => setTune(false)} />
    </div>
  )
}
