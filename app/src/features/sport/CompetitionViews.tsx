import clsx from 'clsx'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { EVENTS, type Competition } from '../../data/catalog'
import { outrightFor, standingsFor } from '../../data/standings'
import { ruleFor } from '../../data/quotes'
import { useStore } from '../../state/store'
import { Crest } from '../../ui/Crest'
import { OddsButton } from '../../ui/OddsButton'

const ease = [0.16, 1, 0.3, 1] as const

function FormDots({ form }: { form: string }) {
  return (
    <span className="flex justify-end gap-1" role="img" aria-label={`Last results: ${form.split('').join(', ')}`}>
      {form.split('').map((r, i) => (
        <span key={i} className={clsx('size-2 rounded-full', r === 'W' ? 'bg-won-ink' : r === 'D' ? 'bg-line-strong' : 'bg-lost-ink/70')} />
      ))}
    </span>
  )
}

export function Standings({ comp }: { comp: Competition }) {
  const { s } = useStore()
  const groups = standingsFor(comp.id)
  const next = new Set(EVENTS.filter((e) => e.competitionId === comp.id && e.status !== 'finished').flatMap((e) => [e.home.id, e.away.id]))
  const football = comp.sport === 'football'
  if (!groups.length) return <p className="mt-6 rounded-[24px] bg-surface p-6 text-[14px] text-secondary">Tournaments don’t have a table. See the draw in Matches, or the tournament winner in Outrights.</p>
  return (
    <div className="mt-6 grid gap-3 @desk:grid-cols-2">
      {groups.map((g, gi) => (
        <motion.section key={g.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.06, duration: 0.5, ease }} className={clsx('rounded-[24px] bg-surface p-5', groups.length === 1 && '@desk:col-span-2')} aria-label={`${comp.name} ${g.name}`}>
          <h2 className="font-display text-[19px] font-[760] tracking-[-0.03em]">{g.name}</h2>
          <table className="mt-3 w-full text-[13.5px] tnum">
            <thead>
              <tr className="text-left text-[11.5px] font-semibold text-secondary">
                <th className="w-7 py-2 font-semibold">#</th>
                <th className="py-2 font-semibold">Team</th>
                <th className="w-9 py-2 text-right font-semibold" title="Played">P</th>
                <th className="hidden w-9 py-2 text-right font-semibold @tab:table-cell" title="Won">W</th>
                {football && <th className="hidden w-9 py-2 text-right font-semibold @tab:table-cell" title="Drawn">D</th>}
                <th className="hidden w-9 py-2 text-right font-semibold @tab:table-cell" title="Lost">L</th>
                <th className="w-12 py-2 text-right font-semibold" title={football ? 'Goal difference' : 'Point difference'}>{football ? 'GD' : '+/−'}</th>
                <th className="w-11 py-2 text-right font-semibold" title="Points">Pts</th>
                <th className="hidden w-20 py-2 text-right font-semibold @tab:table-cell">Form</th>
              </tr>
            </thead>
            <tbody>
              {g.rows.map((r, i) => {
                const mine = s.prefs.teams.includes(r.team.id)
                const gd = r.gf - r.ga
                return (
                  <tr key={r.team.id} className={clsx('border-t border-line', mine && 'bg-sel/60')}>
                    <td className={clsx('py-2.5 font-semibold', i < (groups.length > 1 ? 2 : 4) ? 'text-sel-ink' : 'text-secondary')}>{i + 1}</td>
                    <td className="py-2.5">
                      <span className="flex min-w-0 items-center gap-2 font-semibold">
                        <Crest team={r.team} size={20} />
                        <span className="truncate">{r.team.name}</span>
                        {groups.length === 1 && next.has(r.team.id) && <span className="hidden shrink-0 rounded-full bg-chip px-1.5 py-0.5 text-[10.5px] font-semibold text-secondary @tab:inline">Plays this week</span>}
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-secondary">{r.p}</td>
                    <td className="hidden py-2.5 text-right text-secondary @tab:table-cell">{r.w}</td>
                    {football && <td className="hidden py-2.5 text-right text-secondary @tab:table-cell">{r.d}</td>}
                    <td className="hidden py-2.5 text-right text-secondary @tab:table-cell">{r.l}</td>
                    <td className="py-2.5 text-right text-secondary">{gd > 0 ? `+${gd}` : gd}</td>
                    <td className="py-2.5 text-right font-display font-[780]">{r.pts}</td>
                    <td className="hidden py-2.5 @tab:table-cell">
                      <FormDots form={r.form} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="mt-3 text-[11.5px] text-muted">{groups.length > 1 ? 'Top two in each group go through.' : football ? 'Top four marked. Fictional season.' : 'Top four reach the play-offs. Fictional season.'}</p>
        </motion.section>
      ))}
    </div>
  )
}

export function Outrights({ comp }: { comp: Competition }) {
  const ev = outrightFor(comp.id)
  if (!ev) return null
  const m = ev.markets[0]
  return (
    <section className="mt-6 rounded-[24px] bg-surface p-5" aria-labelledby="out-title">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="out-title" className="font-display text-[19px] font-[760] tracking-[-0.03em]">
          {comp.name} · {m.name}
        </h2>
        <span className="text-[12px] text-secondary">{m.period}</span>
      </div>
      <p className="mt-1 text-[13px] text-secondary">{ruleFor('OUTRIGHT', comp.sport)}</p>
      <div className="mt-4 grid gap-2 @tab:grid-cols-2">
        {m.selections.map((sel) => (
          <OddsButton key={sel.id} ev={ev} market={m} sel={sel} odds={sel.odds} label={sel.label} size="lg" />
        ))}
      </div>
      <p className="mt-3 text-[12px] text-muted">
        Outrights settle when the competition is decided. They can’t be cashed out in this demo.{' '}
        <Link to="/safer-gambling" className="font-semibold text-ink underline">
          Set a limit
        </Link>
      </p>
    </section>
  )
}
