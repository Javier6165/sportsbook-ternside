import clsx from 'clsx'
import { ArrowLeft, Gift, Minus, Plus, ShieldCheck } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { eventById, shortName } from '../../data/catalog'
import { fmtMoney } from '../../domain/money'
import { PREDICTOR_EVENTS, PROMOS, isExpired, promoById, usableFreeBets } from '../../domain/promos'
import { kickoffTime } from '../../lib/time'
import { useAccountNow, useStore } from '../../state/store'
import { Crest } from '../../ui/Crest'
import { BRAND_GRADIENT } from '../../ui/MatchField'
import { Footer } from '../home/Home'
import { SportsBar } from '../../shell/SportsBar'
import { PromoCard, promoStatus } from './PromoCard'

const ease = [0.16, 1, 0.3, 1] as const
const dateFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', day: 'numeric', month: 'short' })

function FreeBets() {
  const { s } = useStore()
  const now = useAccountNow()
  const usable = usableFreeBets(s.freeBets, now)
  if (!s.freeBets.length) return null
  return (
    <section aria-labelledby="fb-title" className="on-dark mt-6 rounded-[26px] p-5 text-white @tab:p-6" style={{ background: BRAND_GRADIENT }}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-white/15">
          <Gift size={18} />
        </span>
        <div>
          <h2 id="fb-title" className="font-display text-[20px] font-[760] tracking-[-0.03em]">
            {usable.length ? `${usable.length} free bet${usable.length > 1 ? 's' : ''} ready` : 'Your free bets'}
          </h2>
          <p className="text-[13px] text-white/70">Choose one in the betslip instead of a stake. The free bet stake isn’t included in the return.</p>
        </div>
      </div>
      <ul className="mt-4 grid gap-2 @tab:grid-cols-2">
        {s.freeBets.map((f) => {
          const gone = f.status === 'used' || isExpired(f, now)
          return (
            <li key={f.id} className={clsx('flex items-center gap-3 rounded-[18px] bg-white/[.08] px-4 py-3 ring-1 ring-white/10', gone && 'opacity-55')}>
              <span className="font-display text-[26px] font-[780] tracking-[-0.03em] tnum">{fmtMoney(f.amount)}</span>
              <span className="min-w-0 text-[12.5px] leading-snug text-white/75">
                <span className="block font-semibold text-white">{promoById(f.source).title}</span>
                {f.status === 'used' ? `Used on ${f.usedOn}` : isExpired(f, now) ? 'Expired' : `Min odds ${f.minOdds} · until ${dateFmt.format(new Date(f.expiresAt))}`}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function Promotions() {
  const { s } = useStore()
  const [q, setQ] = useSearchParams()
  const tab = (q.get('tab') as 'available' | 'joined' | 'history') || 'available'
  const st = (id: (typeof PROMOS)[number]) => promoStatus(id, s).status
  const lists = {
    available: PROMOS.filter((p) => ['available', 'not-eligible', 'blocked'].includes(st(p))),
    joined: PROMOS.filter((p) => ['joined', 'qualified'].includes(st(p))),
    history: PROMOS.filter((p) => st(p) === 'completed'),
  }
  const list = lists[tab]

  return (
    <>
    <SportsBar />
    <div className="mx-auto max-w-[1220px] px-4 pt-6 @tab:px-8 @tab:pt-10">
      <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
        <h1 className="font-display text-[40px] leading-[.95] font-[800] tracking-[-0.05em] @tab:text-[56px]">
          Promotions<span className="text-action">.</span>
        </h1>
        <p className="mt-2 max-w-[560px] text-[15px] text-secondary">Opt in to the ones you want. Free bets have no wagering requirements.</p>
      </motion.header>

      {s.restriction !== 'none' && (
        <p className="mt-5 flex items-center gap-2 rounded-[18px] bg-warn px-4 py-3 text-[13.5px] font-medium text-warn-ink">
          <ShieldCheck size={16} /> Promotions are switched off while your break is active.
        </p>
      )}

      <FreeBets />

      <div role="tablist" aria-label="Promotions" className="mt-6 inline-flex rounded-full bg-chip p-1">
        {(['available', 'joined', 'history'] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setQ(t === 'available' ? {} : { tab: t }, { replace: true })}
            className={clsx('relative z-10 h-10 rounded-full px-5 text-[14px] font-semibold', tab === t ? 'text-ink' : 'text-secondary hover:text-ink')}
          >
            {tab === t && <motion.span layoutId="promo-tab" className="absolute inset-0 -z-10 rounded-full bg-surface shadow-[0_1px_3px_rgba(16,24,43,.14)]" />}
            {t === 'available' ? 'Available' : t === 'joined' ? 'Opted in' : 'History'} <span className="ml-1 text-secondary tnum">{lists[t].length}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 @tab:grid-cols-2 @wide:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <PromoCard key={p.id} p={p} i={i} />
          ))}
        </AnimatePresence>
      </div>
      {list.length === 0 && (
        <div className="mt-2 rounded-[26px] bg-surface px-6 py-12 text-center">
          <div className="font-display text-[22px] font-[780] tracking-[-0.04em]">{tab === 'joined' ? 'Nothing opted in yet' : 'No past promotions'}</div>
          <p className="mx-auto mt-1.5 max-w-[340px] text-[14px] text-secondary">{tab === 'joined' ? 'Promotions you opt in to show their progress here.' : 'Completed promotions and used free bets appear here.'}</p>
        </div>
      )}
      <Footer />
    </div>
    </>
  )
}

// —— Matchday Predictor: free to play ———————————————————————————————————————

function Stepper({ v, onChange, label }: { v: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label={label}>
      <button onClick={() => onChange(Math.max(0, v - 1))} aria-label={`${label}: one fewer`} className="grid size-9 place-items-center rounded-full bg-chip hover:bg-chip-hover">
        <Minus size={15} />
      </button>
      <motion.span key={v} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-9 text-center font-display text-[28px] font-[780] tnum" aria-live="polite">
        {v}
      </motion.span>
      <button onClick={() => onChange(Math.min(9, v + 1))} aria-label={`${label}: one more`} className="grid size-9 place-items-center rounded-full bg-chip hover:bg-chip-hover">
        <Plus size={15} />
      </button>
    </div>
  )
}

export function Predictor() {
  const { s, d } = useStore()
  const now = useAccountNow()
  const nav = useNavigate()
  const [picks, setPicks] = useState<Record<string, [number, number]>>(() => s.predictor?.picks ?? Object.fromEntries(PREDICTOR_EVENTS.map((id) => [id, [1, 1]])))
  const [saved, setSaved] = useState(false)
  const blocked = s.restriction !== 'none'
  const p = promoById('predictor')

  return (
    <div className="mx-auto max-w-[820px] px-4 pt-6 @tab:px-8 @tab:pt-10">
      <button onClick={() => nav('/promotions')} className="flex items-center gap-1.5 text-[14px] font-semibold text-secondary hover:text-ink">
        <ArrowLeft size={16} /> Promotions
      </button>
      <h1 className="mt-4 font-display text-[40px] leading-[.95] font-[800] tracking-[-0.05em] @tab:text-[52px]">
        Matchday Predictor<span className="text-action">.</span>
      </h1>
      <p className="mt-2 text-[15px] text-secondary">{p.headline} No bet needed.</p>

      <ol className="mt-6 space-y-2.5">
        {PREDICTOR_EVENTS.map((id, i) => {
          const ev = eventById(id)!
          const [h, a] = picks[id]
          const set = (k: 0 | 1, n: number) => setPicks((x) => ({ ...x, [id]: (k === 0 ? [n, x[id][1]] : [x[id][0], n]) as [number, number] }))
          return (
            <motion.li key={id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.5, ease }} className="rounded-[22px] bg-surface p-4 @tab:p-5">
              <div className="text-[12px] font-semibold text-secondary">
                {ev.stage} · {kickoffTime(ev.startsAt)}
              </div>
              <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <span className="flex min-w-0 items-center gap-2.5 font-display text-[17px] font-[720] tracking-[-0.03em] @tab:text-[19px]">
                  <Crest team={ev.home} size={28} />
                  <span className="truncate">{shortName(ev.home.name)}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Stepper v={h} onChange={(n) => set(0, n)} label={`${ev.home.name} goals`} />
                  <span className="text-secondary">–</span>
                  <Stepper v={a} onChange={(n) => set(1, n)} label={`${ev.away.name} goals`} />
                </span>
                <span className="flex min-w-0 items-center justify-end gap-2.5 font-display text-[17px] font-[720] tracking-[-0.03em] @tab:text-[19px]">
                  <span className="truncate text-right">{shortName(ev.away.name)}</span>
                  <Crest team={ev.away} size={28} />
                </span>
              </div>
            </motion.li>
          )
        })}
      </ol>

      <div className="sticky bottom-24 mt-5 flex flex-wrap items-center gap-3 rounded-[22px] bg-surface/90 p-4 shadow-[0_18px_40px_-26px_rgba(16,24,43,.5)] backdrop-blur-xl @desk:bottom-6">
        <p className="min-w-0 flex-1 text-[13px] text-secondary">{saved || s.predictor ? 'Entry saved. You can change it until 20:00.' : 'Scores after 90 minutes plus stoppage. You can change your entry until 20:00.'}</p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={blocked}
          onClick={() => (d({ type: 'predictorSave', picks, at: now }), setSaved(true))}
          className="h-12 rounded-full bg-action px-6 text-[15px] font-semibold text-white hover:bg-action-hover disabled:bg-chip disabled:text-muted"
        >
          {s.predictor ? 'Update entry' : 'Submit entry'}
        </motion.button>
      </div>
      <ol className="mt-8 space-y-1.5 text-[13px] text-secondary">
        {p.terms.map((t, k) => (
          <li key={k}>
            {k + 1}. {t}
          </li>
        ))}
      </ol>
      <Link to="/safer-gambling" className="mt-3 inline-block text-[13px] font-semibold text-ink underline">
        Safer gambling
      </Link>
    </div>
  )
}
