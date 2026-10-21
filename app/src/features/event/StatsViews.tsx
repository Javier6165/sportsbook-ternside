import clsx from 'clsx'
import { ChevronDown, GraduationCap } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { H2H, MATCH_STATS, PLAYER_FORM, teamColor, type SportEvent } from '../../data/catalog'
import { useLiveClock } from '../../state/store'

const ease = [0.16, 1, 0.3, 1] as const
const lighten = (c: string, p = 72) => `color-mix(in oklab, ${c} ${p}%, white)`
const short = (n: string) => {
  const w = n.split(' ')
  return w[0].endsWith('.') ? w[w.length - 1] : w[0]
}

/** One plain-English insight with its own small visual. */
function Insight({ title, children, visual, dark }: { title: string; children: ReactNode; visual: ReactNode; dark?: boolean }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease }}
      className={clsx('rounded-[22px] p-5', dark ? 'bg-white/[.05] ring-1 ring-white/[.06]' : 'bg-surface')}
    >
      <div>{visual}</div>
      <h4 className="mt-4 font-display text-[18px] leading-tight font-[760] tracking-[-0.03em]">{title}</h4>
      <p className={clsx('mt-1 text-[14px] leading-snug', dark ? 'text-white/65' : 'text-secondary')}>{children}</p>
    </motion.li>
  )
}

/** n-of-10 pictogram: easier to read than a percentage. */
function OutOfTen({ n, color, dark }: { n: number; color: string; dark?: boolean }) {
  return (
    <div className="flex gap-1.5" aria-label={`${n} out of 10`}>
      {Array.from({ length: 10 }, (_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04, type: 'spring', stiffness: 500, damping: 20 }}
          className="size-4 rounded-full @tab:size-5"
          style={{ background: i < n ? color : dark ? 'rgba(255,255,255,.12)' : 'var(--color-chip-hover)' }}
        />
      ))}
    </div>
  )
}

function Versus({ a, b, ca, cb, la, lb, dark }: { a: number; b: number; ca: string; cb: string; la: string; lb: string; dark?: boolean }) {
  const t = a + b || 1
  return (
    <div>
      <div className="flex items-end justify-between font-display font-[800] tracking-[-0.04em] tnum">
        <span className="text-[34px] leading-none">{a}</span>
        <span className="text-[34px] leading-none">{b}</span>
      </div>
      <div className="mt-2 flex h-3 gap-1">
        <motion.span initial={{ flexGrow: 1 }} whileInView={{ flexGrow: a / t }} viewport={{ once: true }} transition={{ duration: 1, ease }} className="rounded-full" style={{ flexBasis: 0, background: ca }} />
        <motion.span initial={{ flexGrow: 1 }} whileInView={{ flexGrow: b / t }} viewport={{ once: true }} transition={{ duration: 1, ease }} className="rounded-full" style={{ flexBasis: 0, background: cb }} />
      </div>
      <div className={clsx('mt-1.5 flex justify-between text-[12px] font-semibold', dark ? 'text-white/55' : 'text-secondary')}>
        <span>{la}</span>
        <span>{lb}</span>
      </div>
    </div>
  )
}

function FormRow({ form, label, color }: { form: string; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 truncate text-[13px] font-semibold">{label}</span>
      <div className="flex gap-1.5">
        {form.split('').map((r, i) => (
          <motion.span
            key={i}
            initial={{ y: 8, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={clsx('grid size-8 place-items-center rounded-[10px] text-[12px] font-bold', r === 'W' ? 'text-white' : r === 'D' ? 'bg-chip-hover text-ink' : 'bg-chip text-muted')}
            style={r === 'W' ? { background: color } : undefined}
          >
            {r}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

/** Advanced layer: the technical names, each with a one-line definition. */
export function Advanced({ rows, dark }: { rows: { label: string; home: string; away: string; def: string }[]; dark?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={clsx('rounded-[22px]', dark ? 'bg-white/[.05] ring-1 ring-white/[.06]' : 'bg-surface')}>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center gap-3 px-5 py-4 text-left">
        <GraduationCap size={18} className={dark ? 'text-white/60' : 'text-secondary'} />
        <span className="flex-1">
          <span className="block font-display text-[17px] font-[740] tracking-[-0.03em]">Advanced stats</span>
          <span className={clsx('block text-[12.5px]', dark ? 'text-white/50' : 'text-secondary')}>The full numbers, with what each one means</span>
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <dl className="px-5 pb-4">
              {rows.map((r) => (
                <div key={r.label} className={clsx('grid grid-cols-[56px_1fr_56px] items-center gap-3 border-t py-3', dark ? 'border-white/10' : 'border-line')}>
                  <span className="font-semibold tnum">{r.home}</span>
                  <span className="text-center">
                    <dt className="text-[13px] font-semibold">{r.label}</dt>
                    <dd className={clsx('text-[11.5px] leading-snug', dark ? 'text-white/50' : 'text-secondary')}>{r.def}</dd>
                  </span>
                  <span className="text-right font-semibold tnum">{r.away}</span>
                </div>
              ))}
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Live: "The story so far" — plain sentences first, numbers behind a fold. */
export function LiveStory({ ev }: { ev: SportEvent }) {
  const { tick } = useLiveClock()
  const hc = lighten(teamColor(ev.home))
  const ac = lighten(teamColor(ev.away))
  const H = short(ev.home.name)
  const A = short(ev.away.name)
  const poss = 54 + Math.round(Math.sin(tick / 20) * 1.5)

  let items: ReactNode
  let adv: { label: string; home: string; away: string; def: string }[]
  if (ev.sport === 'tennis') {
    items = (
      <>
        <Insight dark title={`${H} is winning his serve points`} visual={<OutOfTen n={7} color={hc} dark />}>
          When his first serve goes in, he wins about 7 points in every 10.
        </Insight>
        <Insight dark title={`${H} has broken serve twice`} visual={<Versus dark a={2} b={0} ca={hc} cb={ac} la={H} lb={A} />}>
          Winning a game on your opponent’s serve is the big swing in tennis. {A} hasn’t managed it yet.
        </Insight>
        <Insight dark title="Short, sharp points" visual={<OutOfTen n={6} color="rgba(255,255,255,.75)" dark />}>
          About 6 in 10 points end within four shots — the server is in control.
        </Insight>
      </>
    )
    adv = [
      { label: '1st serve in', home: '71%', away: '64%', def: 'Share of first serves that land in' },
      { label: '1st serve points won', home: '72%', away: '61%', def: 'Points won when the first serve is in' },
      { label: 'Break points won', home: '2/4', away: '0/2', def: 'Chances to win a game on the other player’s serve' },
      { label: 'Aces', home: '6', away: '3', def: 'Serves the opponent couldn’t touch' },
      { label: 'Double faults', home: '1', away: '3', def: 'Two missed serves in a row — point lost' },
    ]
  } else if (ev.sport === 'basketball') {
    items = (
      <>
        <Insight dark title={`${H} are shooting better`} visual={<Versus dark a={48} b={44} ca={hc} cb={ac} la={`${H} %`} lb={`${A} %`} />}>
          Out of every 100 shots, {H} are making 48 and {A} 44.
        </Insight>
        <Insight dark title={`${H} on a 9–2 run`} visual={<OutOfTen n={8} color={hc} dark />}>
          They’ve scored most of the recent points, which is why their price has shortened.
        </Insight>
        <Insight dark title={`${A} are giving the ball away`} visual={<Versus dark a={9} b={12} ca={hc} cb={ac} la="Turnovers" lb="Turnovers" />}>
          Losing the ball without a shot — {A} have done it 12 times.
        </Insight>
      </>
    )
    adv = [
      { label: 'FG%', home: '48%', away: '44%', def: 'Field goal percentage — shots made from play' },
      { label: '3P%', home: '38%', away: '31%', def: 'Three-point shots made' },
      { label: 'REB', home: '31', away: '27', def: 'Rebounds — catching the ball after a missed shot' },
      { label: 'TOV', home: '9', away: '12', def: 'Turnovers — losing the ball without shooting' },
    ]
  } else {
    items = (
      <>
        <Insight dark title={`${H} have had more of the ball`} visual={<Versus dark a={poss} b={100 - poss} ca={hc} cb={ac} la={`${H} %`} lb={`${A} %`} />}>
          Out of every 10 minutes, {H} have had the ball for about {Math.round(poss / 10)}.
        </Insight>
        <Insight dark title={`${H} are creating more`} visual={<Versus dark a={5} b={2} ca={hc} cb={ac} la="Shots on target" lb="Shots on target" />}>
          Shots that would go in without a save. {H} have tested the keeper five times.
        </Insight>
        <Insight dark title="Pressure on the visitors’ goal" visual={<Versus dark a={6} b={3} ca={hc} cb={ac} la="Corners" lb="Corners" />}>
          Corners are a rough sign of who’s pushing. {H} have twice as many.
        </Insight>
      </>
    )
    adv = [
      { label: 'Possession', home: `${poss}%`, away: `${100 - poss}%`, def: 'Share of time each team has had the ball' },
      { label: 'Shots on target', home: '5', away: '2', def: 'Shots that needed a save or went in' },
      { label: 'xG', home: '1.6', away: '0.7', def: 'Expected goals — how many goals the chances were worth' },
      { label: 'Corners', home: '6', away: '3', def: 'Restarts from the corner flag' },
      { label: 'Fouls', home: '8', away: '11', def: 'Free kicks given away' },
    ]
  }

  return (
    <section aria-labelledby="story-title">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 id="story-title" className="font-display text-[22px] font-[780] tracking-[-0.04em]">
          The story so far
        </h3>
        <span className="text-[11.5px] font-semibold text-white/45">Fictional live data</span>
      </div>
      {ev.live?.detail && <p className="mb-3 text-[15px] text-white/80">{ev.live.detail}.</p>}
      <ul className="grid gap-3 @tab:grid-cols-3">{items}</ul>
      <div className="mt-3">
        <Advanced rows={adv} dark />
      </div>
    </section>
  )
}

/** Pre-match: "What the numbers say". */
export function PreMatchStats({ ev, brief }: { ev: SportEvent; brief: ReactNode }) {
  const rows = MATCH_STATS[ev.id]
  if (!rows) return <p className="rounded-[24px] bg-surface p-6 text-[14px] text-secondary">No detailed stats for this fixture in the demo.</p>
  const hc = teamColor(ev.home)
  const ac = teamColor(ev.away)
  const H = short(ev.home.name)
  const A = short(ev.away.name)
  const h2h = H2H[ev.id]
  return (
    <div className="space-y-3">
      {brief}
      <ul className="grid gap-3 @tab:grid-cols-2">
        <Insight
          title={`Both sides arrive in form`}
          visual={
            <div className="space-y-2">
              <FormRow form={ev.form![0]} label={H} color={hc} />
              <FormRow form={ev.form![1]} label={A} color={ac} />
            </div>
          }
        >
          Last five games, newest on the right. {H} have lost once; {A} have lost once too.
        </Insight>
        <Insight title="Expect goals" visual={<Versus a={4} b={4} ca={hc} cb={ac} la={`${H} · games with 3+ goals`} lb={`${A} · of last 6`} />}>
          Four of each team’s last six games had three goals or more. That’s why Over 2.5 is the favourite.
        </Insight>
        <Insight
          title="Costa keeps shooting"
          visual={
            <div className="flex h-16 items-end gap-2">
              {PLAYER_FORM.lastSix.map((v, i) => (
                <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <motion.div initial={{ height: 0 }} whileInView={{ height: `${Math.max(6, (v / 3) * 78)}%` }} viewport={{ once: true }} transition={{ delay: i * 0.06, ease }} className="w-full rounded-t-[8px]" style={{ background: v >= 2 ? hc : 'var(--color-chip-hover)' }} />
                  <span className="text-[11px] font-semibold tnum">{v}</span>
                </div>
              ))}
            </div>
          }
        >
          Shots on target in his last six starts. He reached two or more in four of them.
        </Insight>
        <Insight
          title={`${H} unbeaten in the last three meetings`}
          visual={
            <div className="flex gap-2">
              {h2h.map((m) => (
                <div key={m.date} className="flex-1 rounded-[14px] bg-chip p-2.5 text-center">
                  <div className="font-display text-[18px] font-[800] tracking-[-0.03em] tnum">{m.score.match(/\d–\d/)?.[0]}</div>
                  <div className="text-[10.5px] font-semibold text-secondary">{m.date}</div>
                </div>
              ))}
            </div>
          }
        >
          Two wins and a draw. Past meetings don’t decide the next one, but they help explain the price.
        </Insight>
      </ul>
      <Advanced
        rows={[
          ...rows.map((r) => ({ label: r.label, home: r.home, away: r.away, def: r.label.includes('Clean') ? 'Games without conceding' : r.label.includes('Shots') ? 'Shots that needed a save or went in' : 'Recent form, fictional data' })),
          { label: 'xG per game', home: '1.9', away: '1.4', def: 'Expected goals — the value of the chances a team creates' },
          { label: 'PPDA', home: '9.8', away: '12.1', def: 'How hard a team presses: lower means more pressing' },
        ]}
      />
      <p className="px-1 text-[12px] text-muted">All statistics are fictional demo data.</p>
    </div>
  )
}
