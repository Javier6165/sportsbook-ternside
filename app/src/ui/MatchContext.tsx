import { motion } from 'motion/react'
import { contextFor, impliedFor, teamColor, type SportEvent } from '../data/catalog'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Two clearly separated layers: descriptive match facts, and what the odds
 * mean once converted to percentages. No causal claims about how prices were set.
 */
export function MatchContext({ ev, tone = 'dark' }: { ev: SportEvent; tone?: 'dark' | 'glass' }) {
  const facts = contextFor(ev)
  const imp = impliedFor(ev)
  const colors = imp.rows.map((r) => (r.id === 'HOME' ? teamColor(ev.home) : r.id === 'AWAY' ? teamColor(ev.away) : 'rgba(255,255,255,.35)'))
  return (
    <div className={tone === 'glass' ? 'rounded-[24px] bg-black/35 p-5 ring-1 ring-white/10 backdrop-blur-xl @tab:p-6' : 'rounded-[24px] bg-ink p-5 text-white @tab:p-6'}>
      <div className="grid gap-6 @desk:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-[19px] font-[760] tracking-[-0.03em]">Match context</h3>
            <span className="text-[11.5px] font-medium text-white/50">Prototype summary · fictional data</span>
          </div>
          <ul className="mt-3 space-y-2.5">
            {facts.map((f, i) => (
              <motion.li key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.06, ease }} className="flex gap-3 text-[14.5px] leading-snug text-white/85">
                <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-brand-dark" />
                {f}
              </motion.li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-[19px] font-[760] tracking-[-0.03em]">What the odds imply</h3>
          <div className="mt-3 flex h-2.5 gap-1 overflow-hidden rounded-full">
            {imp.rows.map((r, i) => (
              <motion.span key={r.id} initial={{ flexGrow: 1 }} animate={{ flexGrow: r.pct }} transition={{ duration: 1, ease }} className="h-full rounded-full" style={{ flexBasis: 0, background: colors[i] }} />
            ))}
          </div>
          <ul className="mt-3 space-y-1.5">
            {imp.rows.map((r) => (
              <li key={r.id} className="flex items-baseline justify-between text-[13.5px]">
                <span className="text-white/80">{r.label}</span>
                <span className="tnum">
                  <span className="text-white/55">{r.odds} → </span>
                  <b className="font-semibold">{r.pct}%</b>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] leading-snug text-white/55">Each price converted to a percentage, with the bookmaker’s {imp.margin}% margin removed. It shows what the odds say — not how likely the result really is.</p>
        </div>
      </div>
    </div>
  )
}
