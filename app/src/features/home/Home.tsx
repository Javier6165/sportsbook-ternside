import { ShieldCheck } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { SPORTS, type SportId } from '../../data/catalog'
import { Hero } from './Hero'
import { LiveNow } from './LiveNow'
import { Upcoming } from './Upcoming'

export function Footer() {
  return (
    <footer className="mt-12 border-t border-line pt-6 pb-10 text-[12px] text-secondary">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="grid size-8 place-items-center rounded-full border-2 border-ink text-[12px] font-bold text-ink">18+</span>
        <Link to="/safer-gambling" className="flex items-center gap-1.5 font-semibold text-ink hover:text-sel-ink">
          <ShieldCheck size={15} className="text-won-ink" /> Safer gambling
        </Link>
        <Link to="/safer-gambling" className="font-semibold text-ink hover:text-sel-ink">Deposit limits</Link>
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
  const { sportId } = useParams()
  const sport = SPORTS.find((s) => s.id === sportId)?.id as SportId | undefined
  return (
    <div className="mx-auto max-w-[1040px] px-4 pt-4 @desk:px-5 @desk:pt-5 @wide:px-6 @wide:pt-6">
      {!sport && <Hero />}
      {sport && (
        <h1 className="display pt-2 text-[40px] leading-none uppercase">{SPORTS.find((s) => s.id === sport)!.name}</h1>
      )}
      {!sport && <LiveNow />}
      <Upcoming key={sport ?? 'all'} sport={sport} />
      <Footer />
    </div>
  )
}
