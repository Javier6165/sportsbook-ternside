import clsx from 'clsx'
import { Check, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { COMPETITIONS, SPORTS, TEAMS } from '../../data/catalog'
import { SAM_PREFS, useStore, type Prefs } from '../../state/store'
import { Crest } from '../../ui/Crest'
import { SportIcon } from '../../ui/SportIcon'

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-pressed={on}
      className={clsx('flex h-10 items-center gap-2 rounded-full px-3.5 text-[13.5px] font-semibold transition-colors', on ? 'bg-ink text-white' : 'bg-chip text-ink hover:bg-chip-hover')}
    >
      {children}
      {on && <Check size={15} strokeWidth={2.6} />}
    </motion.button>
  )
}

const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

export function TuneSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { s, d } = useStore()
  const p = s.prefs
  const set = (next: Prefs) => d({ type: 'prefs', prefs: next })
  const [more, setMore] = useState(false)
  const [target, setTarget] = useState<HTMLElement | null>(null)
  useEffect(() => setTarget(document.getElementById('overlay-root')), [])
  useEffect(() => {
    if (!open) return
    const f = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [open, onClose])

  const core = COMPETITIONS.slice(0, 5)
  const extra = COMPETITIONS.slice(5)
  const teams = Object.values(TEAMS).slice(0, 12)

  if (!target) return null
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div key="tune" className="pointer-events-auto absolute inset-0 z-50 flex items-end justify-center @tab:items-center" role="dialog" aria-modal="true" aria-labelledby="tune-title">
          <motion.div className="absolute inset-0 bg-[#0b0f1a]/45 backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            className="thin-scrollbar relative max-h-[88%] w-full overflow-y-auto rounded-t-[30px] bg-surface p-6 shadow-2xl @tab:max-w-[620px] @tab:rounded-[30px] @tab:p-8"
          >
            <button onClick={onClose} aria-label="Close" className="absolute top-5 right-5 grid size-10 place-items-center rounded-full bg-chip hover:bg-chip-hover">
              <X size={18} />
            </button>
            <h2 id="tune-title" className="font-display text-[30px] leading-none font-[800] tracking-[-0.045em]">
              Tune your feed
            </h2>
            <p className="mt-2 max-w-[440px] text-[14.5px] text-secondary">
              Ternside shows what you follow and keeps the rest one tap away. It never uses how much you bet to decide what to show.
            </p>

            <h3 className="mt-7 mb-3 text-[12px] font-bold tracking-[.1em] text-muted uppercase">Sports</h3>
            <div className="flex flex-wrap gap-2">
              {SPORTS.map((sp) => (
                <Chip key={sp.id} on={p.sports.includes(sp.id)} onClick={() => set({ ...p, sports: toggle(p.sports, sp.id) })}>
                  <SportIcon sport={sp.id} size={16} /> {sp.name}
                </Chip>
              ))}
            </div>

            <h3 className="mt-7 mb-3 text-[12px] font-bold tracking-[.1em] text-muted uppercase">Competitions</h3>
            <div className="flex flex-wrap gap-2">
              {(more ? [...core, ...extra] : core).map((c) => (
                <Chip key={c.id} on={p.competitions.includes(c.id)} onClick={() => set({ ...p, competitions: toggle(p.competitions, c.id) })}>
                  {c.name}
                </Chip>
              ))}
              <button onClick={() => setMore((m) => !m)} className="h-10 rounded-full px-3 text-[13.5px] font-semibold text-sel-ink hover:bg-sel">
                {more ? 'Fewer' : `+${extra.length} more`}
              </button>
            </div>

            <h3 className="mt-7 mb-3 text-[12px] font-bold tracking-[.1em] text-muted uppercase">Teams</h3>
            <div className="flex flex-wrap gap-2">
              {teams.map((t) => (
                <Chip key={t.id} on={p.teams.includes(t.id)} onClick={() => set({ ...p, teams: toggle(p.teams, t.id) })}>
                  <Crest team={t} size={18} /> {t.name}
                </Chip>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-line pt-5">
              <button onClick={() => set({ sports: [], competitions: [], teams: [] })} className="h-11 rounded-full px-4 text-[13.5px] font-semibold text-secondary hover:bg-chip">
                Clear all
              </button>
              <button onClick={() => set(SAM_PREFS)} className="h-11 rounded-full px-4 text-[13.5px] font-semibold text-secondary hover:bg-chip">
                Reset
              </button>
              <button onClick={onClose} className="ml-auto h-11 rounded-full bg-ink px-6 text-[14px] font-semibold text-white hover:bg-black">
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    target,
  )
}
