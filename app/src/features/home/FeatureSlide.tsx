import { shortName } from '../../data/catalog'
import { ArrowRight, Ban, Check, CircleDashed, ShieldCheck, SlidersHorizontal, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { TEAMS } from '../../data/catalog'
import { Crest } from '../../ui/Crest'
import { BRAND_GRADIENT } from '../../ui/MatchField'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Banner slides that promote features, never bets: no boosts, bonuses or odds.
 * Each one shows the feature working in a small animated vignette.
 */
function Shell({ eyebrow, title, body, cta, visual, tint }: { eyebrow: string; title: ReactNode; body: string; cta: ReactNode; visual: ReactNode; tint: [string, string] }) {
  return (
    <section className="on-dark relative isolate h-full overflow-hidden text-white" style={{ background: `radial-gradient(55% 80% at 85% 10%, ${tint[1]}, transparent 70%), ${BRAND_GRADIENT}` }}>
      <motion.span aria-hidden="true" className="absolute -top-40 -left-24 -z-10 size-[520px] rounded-full bg-white/10 blur-3xl" animate={{ x: [0, 60, 0], y: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.span aria-hidden="true" className="absolute -right-32 -bottom-40 -z-10 size-[560px] rounded-full bg-black/25 blur-3xl" animate={{ x: [0, -50, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
      <div className="mx-auto grid h-full min-h-[580px] max-w-[1220px] items-center gap-8 px-4 pt-8 pb-20 @tab:min-h-[620px] @tab:pb-24 @tab:px-8 @desk:grid-cols-[minmax(0,1fr)_minmax(0,460px)]">
        <div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[12.5px] font-semibold backdrop-blur-md">
            <Sparkles size={13} /> {eyebrow}
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.1, ease }} className="mt-6 font-display text-[clamp(40px,10cqi,84px)] leading-[.92] font-[800] tracking-[-0.05em] @desk:text-[clamp(48px,5.4cqi,84px)]">
            {title}
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.6 }} className="mt-5 max-w-[520px] text-[16px] leading-relaxed text-white/80 @tab:text-[18px]">
            {body}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6, ease }} className="mt-7">
            {cta}
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: 0.2, duration: 1, ease }} className="hidden @tab:block">
          {visual}
        </motion.div>
      </div>
    </section>
  )
}

const ctaCls = 'inline-flex h-14 items-center gap-2 rounded-full bg-white px-6 text-[15.5px] font-semibold text-ink shadow-[0_18px_40px_-16px_rgba(0,0,0,.6)] hover:bg-white/90'

const OUTCOMES = [
  { title: 'Costa doesn’t play', st: ['open', 'open', 'void'], res: '£27 if the other two win' },
  { title: 'It’s a draw after 90', st: ['lost', 'open', 'open'], res: 'Would lose · £0' },
  { title: 'Northbridge win 3–1', st: ['won', 'won', 'won'], res: 'Would return £34' },
]
const LEGS = ['Northbridge to win', 'Over 2.5 goals', 'Costa 2+ shots on target']

function ExploreVisual() {
  const [k, setK] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setK((x) => (x + 1) % OUTCOMES.length), 2600)
    return () => clearInterval(t)
  }, [])
  const o = OUTCOMES[k]
  return (
    <div className="relative mx-auto max-w-[420px] rounded-[28px] bg-white p-5 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)]">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold tracking-[.1em] text-secondary uppercase">Explore outcomes</span>
        <span className="font-display text-[22px] font-[800] tracking-[-0.03em] tnum">3.40</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={k} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35 }}>
          <div className="mt-3 inline-flex rounded-full bg-ink px-3 py-1.5 text-[12.5px] font-semibold text-white">{o.title}</div>
          <ul className="mt-4 space-y-2">
            {LEGS.map((l, i) => {
              const st = o.st[i]
              return (
                <li key={l} className="flex items-center gap-3 rounded-[14px] border border-line px-3 py-2.5 text-[14px] font-semibold">
                  <span className={'grid size-6 place-items-center rounded-full ' + (st === 'won' ? 'bg-won text-won-ink' : st === 'lost' ? 'bg-lost text-lost-ink' : st === 'void' ? 'bg-void text-void-ink' : 'bg-chip text-secondary')}>
                    {st === 'won' ? <Check size={13} strokeWidth={3} /> : st === 'void' ? <Ban size={12} /> : st === 'lost' ? '×' : <CircleDashed size={13} />}
                  </span>
                  <span className={st === 'void' ? 'text-void-ink line-through' : ''}>{l}</span>
                </li>
              )
            })}
          </ul>
          <div className="mt-4 rounded-[16px] bg-sel px-4 py-3 font-display text-[18px] font-[760] tracking-[-0.03em] text-sel-ink">{o.res}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function LimitsVisual() {
  const rings = [
    { l: 'Last 24 hours', v: 0.35, amt: '£7 of £20' },
    { l: 'Last 7 days', v: 0.6, amt: '£30 of £50' },
    { l: 'This month', v: 0.2, amt: '£20 of £100' },
  ]
  return (
    <div className="mx-auto grid max-w-[440px] grid-cols-3 gap-3">
      {rings.map((r, i) => (
        <div key={r.l} className="rounded-[24px] bg-white/[.12] p-4 text-center ring-1 ring-white/15 backdrop-blur-md">
          <svg viewBox="0 0 84 84" className="mx-auto size-20" aria-hidden="true">
            <circle cx="42" cy="42" r="34" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="9" />
            <motion.circle cx="42" cy="42" r="34" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeDasharray={213.6} initial={{ strokeDashoffset: 213.6 }} animate={{ strokeDashoffset: 213.6 * (1 - r.v) }} transition={{ delay: 0.5 + i * 0.15, duration: 1.4, ease }} transform="rotate(-90 42 42)" />
          </svg>
          <div className="mt-2 text-[12px] font-semibold text-white/70">{r.l}</div>
          <div className="font-display text-[15px] font-[760] tnum">{r.amt}</div>
        </div>
      ))}
      <div className="col-span-3 flex items-center gap-2 rounded-[18px] bg-white/[.12] px-4 py-3 text-[13px] font-medium ring-1 ring-white/15">
        <ShieldCheck size={16} /> Lower limits apply at once. Higher ones wait 24 hours.
      </div>
    </div>
  )
}

function FeedVisual() {
  const teams = Object.values(TEAMS).slice(0, 9)
  return (
    <div className="relative mx-auto h-[340px] max-w-[440px]">
      {teams.map((t, i) => {
        const on = i % 3 === 0
        const x = (i % 3) * 33 + (Math.floor(i / 3) % 2 ? 8 : 0)
        const y = Math.floor(i / 3) * 33
        return (
          <motion.span
            key={t.id}
            className={'absolute flex items-center gap-2 rounded-full px-3.5 py-2.5 text-[13.5px] font-semibold whitespace-nowrap ' + (on ? 'bg-white text-ink shadow-[0_14px_30px_-12px_rgba(0,0,0,.6)]' : 'bg-white/10 text-white/55 ring-1 ring-white/15')}
            style={{ left: `${x}%`, top: `${y}%` }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: on ? 1.04 : 0.94, y: [0, on ? -6 : 4, 0] }}
            transition={{ opacity: { delay: 0.3 + i * 0.05 }, scale: { delay: 0.3 + i * 0.05 }, y: { duration: 4 + (i % 3), repeat: Infinity, ease: 'easeInOut' } }}
          >
            <Crest team={t} size={18} /> {shortName(t.name)} {on && <Check size={14} strokeWidth={3} className="text-action" />}
          </motion.span>
        )
      })}
    </div>
  )
}

export function FeatureSlide({ kind, onTune }: { kind: 'explore' | 'limits' | 'feed'; onTune?: () => void }) {
  if (kind === 'explore')
    return (
      <Shell
        eyebrow="How Ternside works"
        tint={['', 'rgba(41,72,255,.38)']}
        title={
          <>
            Know how your bet settles
            <br />
            <span className="text-white/55">before you place it.</span>
          </>
        }
        body="Explore outcomes shows what happens if a player doesn’t start, the game is abandoned or it goes to extra time — using the rules your bet will actually follow."
        cta={
          <Link to="/event/football-01?tab=builder&explain=1" className={ctaCls}>
            Try it on Northbridge v Southport <ArrowRight size={18} />
          </Link>
        }
        visual={<ExploreVisual />}
      />
    )
  if (kind === 'limits')
    return (
      <Shell
        eyebrow="Safer gambling"
        tint={['', 'rgba(52,170,120,.22)']}
        title={
          <>
            Your limits,
            <br />
            <span className="text-white/60">your call.</span>
          </>
        }
        body="Set deposit limits, take a break or step away for longer. Change them whenever you like."
        cta={
          <Link to="/safer-gambling" className={ctaCls}>
            Manage your limits <ArrowRight size={18} />
          </Link>
        }
        visual={<LimitsVisual />}
      />
    )
  return (
    <Shell
      eyebrow="Your feed"
      tint={['', 'rgba(255,255,255,.06)']}
      title={
        <>
          Less noise.
          <br />
          <span className="text-white/55">Your teams first.</span>
        </>
      }
      body="Ternside shows what you follow and a few matches worth knowing about. Everything else is one tap away — never pushed at you."
      cta={
        <button onClick={onTune} className={ctaCls}>
          <SlidersHorizontal size={17} /> Tune your feed
        </button>
      }
      visual={<FeedVisual />}
    />
  )
}
