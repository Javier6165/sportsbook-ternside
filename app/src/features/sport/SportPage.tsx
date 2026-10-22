import { shortName } from '../../data/catalog'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { Link, useParams, useSearchParams } from 'react-router'
import { COMPETITIONS, EVENTS, SPORTS, TEAMS, type SportEvent } from '../../data/catalog'
import { reasonFor } from '../../lib/feed'
import { useStore } from '../../state/store'
import { SportsBar } from '../../shell/SportsBar'
import { Crest } from '../../ui/Crest'
import { SportIcon } from '../../ui/SportIcon'
import { Footer } from '../home/Home'
import { LiveCard } from '../home/LiveNow'
import { CompetitionFold, PickCard } from '../home/Picks'
import { NotFound } from '../NotFound'
import { Hero } from '../home/Hero'
import { HeroCarousel, type Slide } from '../home/HeroCarousel'
import { FeatureSlide } from '../home/FeatureSlide'

const byTime = (a: SportEvent, b: SportEvent) => a.startsAt.localeCompare(b.startsAt)

export function SportPage() {
  const { sportId } = useParams()
  const [q] = useSearchParams()
  const { s } = useStore()
  const sport = SPORTS.find((x) => x.id === sportId)
  if (!sport) return <NotFound what="sport" />

  const compId = q.get('competition')
  const teamId = q.get('team')
  const comp = compId ? COMPETITIONS.find((c) => c.id === compId && c.sport === sport.id) : undefined
  const team = teamId ? Object.values(TEAMS).find((t) => t.id === teamId) : undefined
  if (compId && !comp) return <NotFound what="competition" />

  const pool = EVENTS.filter((e) => e.sport === sport.id).filter((e) => (comp ? e.competitionId === comp.id : true)).filter((e) => (team ? e.home.id === team.id || e.away.id === team.id : true))
  const live = pool.filter((e) => e.status === 'live')
  const scheduled = pool.filter((e) => e.status === 'scheduled').sort(byTime)
  const comps = COMPETITIONS.filter((c) => c.sport === sport.id).sort((a, b) => Number(s.prefs.competitions.includes(b.id)) - Number(s.prefs.competitions.includes(a.id)))

  // Highlights: followed / popular matches as cards; the rest folds away per competition.
  const highlights = (comp || team ? scheduled.slice(0, 4) : scheduled.filter((e) => reasonFor(e, s.prefs) || e.popular).slice(0, 4)).map((e) => ({
    e,
    r: reasonFor(e, s.prefs) ?? { kind: 'popular' as const, text: e.popular ? 'Popular' : comp?.name ?? sport.name },
  }))
  const shown = new Set(highlights.map((h) => h.e.id))
  const groups = comps.map((c) => ({ c, evs: scheduled.filter((e) => e.competitionId === c.id && !shown.has(e.id)) })).filter((g) => g.evs.length && (!comp || g.c.id === comp.id))

  const title = team ? team.name : comp ? comp.name : sport.name
  const bannerEvents = [...live.slice(0, 1), ...highlights.slice(0, 2).map((h) => h.e)]
  const slides: Slide[] = [
    ...bannerEvents.map((e) => ({ id: e.id, label: `${e.status === 'live' ? 'Live · ' : ''}${shortName(e.home.name)} v ${shortName(e.away.name)}`, node: <Hero ev={e} reason={reasonFor(e, s.prefs)} compact /> })),
    ...(sport.id === 'football' && !comp && !team ? [{ id: 'f-explore', label: 'Explore outcomes', node: <FeatureSlide kind="explore" /> }] : []),
  ]

  return (
    <>
      <SportsBar />
      <div className="mx-auto max-w-[1220px] px-4 pt-6 @tab:px-8 @tab:pt-10">
        <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          <div className="flex items-center gap-2 text-[13.5px] font-semibold text-secondary">
            <Link to={`/sports/${sport.id}`} className="flex items-center gap-1.5 hover:text-ink">
              <SportIcon sport={sport.id} size={15} /> {sport.name}
            </Link>
            {comp && <span>· {comp.region}</span>}
          </div>
          <h1 className="mt-1 flex items-center gap-3 font-display text-[40px] leading-[.95] font-[800] tracking-[-0.05em] @tab:text-[56px]">
            {team && <Crest team={team} size={44} />}
            <span>
              {title}
              <span className="text-action">.</span>
            </span>
          </h1>
          <p className="mt-2 text-[15.5px] text-secondary">
            {pool.length} {pool.length === 1 ? 'match' : 'matches'}
            {live.length ? ` · ${live.length} live now` : ''}
          </p>
        </motion.header>

        {!team && (
          <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 @tab:mx-0 @tab:flex-wrap @tab:px-0">
            <Link to={`/sports/${sport.id}`} className={clsx('flex h-10 shrink-0 items-center rounded-full px-4 text-[13.5px] font-semibold', !comp ? 'bg-ink text-white' : 'bg-surface text-ink hover:bg-chip')}>
              All {sport.name.toLowerCase()}
            </Link>
            {comps.map((c) => (
              <Link
                key={c.id}
                to={`/sports/${sport.id}?competition=${c.id}`}
                className={clsx('flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13.5px] font-semibold', comp?.id === c.id ? 'bg-ink text-white' : 'bg-surface text-ink hover:bg-chip')}
              >
                {s.prefs.competitions.includes(c.id) && <span className="size-1.5 rounded-full bg-action" aria-label="Followed" />}
                {c.name}
              </Link>
            ))}
          </div>
        )}

      </div>

      {slides.length > 0 && (
        <div className="mt-6 @tab:px-8">
          <div className="mx-auto max-w-[1600px] overflow-hidden @tab:rounded-[32px]">
            <HeroCarousel key={`${sport.id}-${comp?.id}-${team?.id}`} slides={slides} label={`${title} featured`} />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1220px] px-4 @tab:px-8">
        {live.length > 0 && (
          <section className="mt-10" aria-labelledby="sp-live">
            <motion.h2 initial={{ opacity: 0, y: 22, clipPath: "inset(0 0 100% 0)" }} whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 -20% 0)" }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} id="sp-live" className="mb-4 font-display text-[28px] leading-none font-[780] tracking-[-0.045em]">
              Live now
            </motion.h2>
            <div className="grid gap-3 @tab:grid-cols-2 @wide:grid-cols-3">
              {live.map((ev, i) => (
                <LiveCard key={ev.id} ev={ev} i={i} />
              ))}
            </div>
          </section>
        )}

        {highlights.length > 0 && (
          <section className="mt-10" aria-labelledby="sp-high">
            <motion.h2 initial={{ opacity: 0, y: 22, clipPath: "inset(0 0 100% 0)" }} whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 -20% 0)" }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} id="sp-high" className="mb-4 font-display text-[28px] leading-none font-[780] tracking-[-0.045em]">
              {comp || team ? 'Next up' : 'Worth a look'}
            </motion.h2>
            <div className="grid gap-3 @tab:grid-cols-2">
              {highlights.map((x, i) => (
                <PickCard key={x.e.id} ev={x.e} reason={x.r} i={i} />
              ))}
            </div>
          </section>
        )}

        {groups.length > 0 && (
          <section className="mt-10" aria-labelledby="sp-all">
            <motion.h2 initial={{ opacity: 0, y: 22, clipPath: "inset(0 0 100% 0)" }} whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 -20% 0)" }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} id="sp-all" className="font-display text-[28px] leading-none font-[780] tracking-[-0.045em]">
              {comp ? 'More fixtures' : 'By competition'}
            </motion.h2>
            <div className="mt-4 rounded-[24px] bg-surface px-5 py-1">
              {groups.map((g) => (
                <CompetitionFold key={g.c.id} c={g.c} evs={g.evs} defaultOpen={!!comp || s.prefs.competitions.includes(g.c.id)} />
              ))}
            </div>
          </section>
        )}

        {pool.length === 0 && (
          <div className="mt-10 rounded-[24px] bg-surface px-6 py-12 text-center">
            <div className="font-display text-[20px] font-[760] tracking-[-0.03em]">Nothing scheduled right now</div>
            <p className="mt-1 text-[14px] text-secondary">New fixtures appear here as soon as they’re priced.</p>
            <Link to="/sports" className="mt-4 inline-flex h-10 items-center rounded-full bg-ink px-5 text-[14px] font-semibold text-white">
              Back to For you
            </Link>
          </div>
        )}
        <Footer />
      </div>
    </>
  )
}
