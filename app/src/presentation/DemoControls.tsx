import clsx from 'clsx'
import { Clapperboard, Play, RotateCcw, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { SCENES } from '../demo/scenes'
import { useStore } from '../state/store'

/**
 * F16 · Demo controls. Lives outside the sportsbook UI (presentation chrome),
 * replaces the whole fictional session after confirmation, and only offers the
 * transitions each scene defines.
 */
export function DemoControls({ onClose, inline }: { onClose?: () => void; inline?: boolean }) {
  const { s, d } = useStore()
  const nav = useNavigate()
  const [pending, setPending] = useState<string | null>(null)
  const current = SCENES.find((x) => x.id === s.scene)

  const load = (id: string) => {
    const sc = SCENES.find((x) => x.id === id)!
    d({ type: 'load', state: { ...sc.build(), scene: id } })
    setPending(null)
    nav(sc.route)
    onClose?.()
  }

  return (
    <div className={clsx('on-dark text-white', !inline && 'w-[360px] rounded-[26px] bg-[#0b1120]/95 p-5 shadow-[0_30px_70px_-20px_rgba(0,0,0,.7)] ring-1 ring-white/10 backdrop-blur-xl')}>
      <div className="flex items-center gap-2">
        <Clapperboard size={17} className="text-[#f5c04a]" />
        <h2 className="font-display text-[19px] font-[780] tracking-[-0.03em]">Demo controls</h2>
        {onClose && (
          <button onClick={onClose} aria-label="Close demo controls" className="ml-auto grid size-8 place-items-center rounded-full bg-white/10 hover:bg-white/20">
            <X size={15} />
          </button>
        )}
      </div>
      <p className="mt-1.5 text-[12.5px] leading-snug text-white/55">Load a moment of the story. Each scene replaces the fictional session — bets, balance and slip.</p>

      <ul className="mt-4 space-y-1.5">
        {SCENES.map((sc) => (
          <li key={sc.id}>
            <div className={clsx('rounded-[16px] p-3 transition-colors', s.scene === sc.id ? 'bg-white/[.12]' : 'hover:bg-white/[.06]')}>
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[14px] font-semibold">
                    {sc.title}
                    {s.scene === sc.id && <span className="rounded-full bg-[#f5c04a]/20 px-2 py-0.5 text-[10.5px] font-bold text-[#f5c04a]">Current</span>}
                  </div>
                  <div className="mt-0.5 text-[12px] leading-snug text-white/55">{sc.detail}</div>
                </div>
                <button onClick={() => setPending(sc.id)} aria-label={`Load ${sc.title}`} className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white hover:text-nav">
                  <Play size={14} fill="currentColor" />
                </button>
              </div>
              <AnimatePresence>
                {pending === sc.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="mt-3 flex items-center gap-2 rounded-[12px] bg-black/30 p-2 pl-3 text-[12px]">
                      <span className="flex-1 text-white/70">Replace your current demo session?</span>
                      <button onClick={() => setPending(null)} className="h-8 rounded-full px-3 font-semibold text-white/70 hover:text-white">
                        Cancel
                      </button>
                      <button onClick={() => load(sc.id)} className="h-8 rounded-full bg-white px-3 font-semibold text-nav">
                        Load
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {s.scene === sc.id && sc.steps && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {sc.steps.map((st) => (
                    <button
                      key={st.phase}
                      onClick={() => d({ type: 'f01', phase: st.phase })}
                      className={clsx('h-8 rounded-full px-3 text-[12px] font-semibold', s.f01 === st.phase ? 'bg-[#f5c04a] text-nav' : 'bg-white/10 text-white/80 hover:bg-white/20')}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setPending(pending === 'fresh-reset' ? null : 'fresh-reset')}
        className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-white/[.06] text-[13px] font-semibold text-white/75 hover:bg-white/[.12]"
      >
        <RotateCcw size={14} /> Reset demo
      </button>
      {pending === 'fresh-reset' && (
        <div className="mt-2 flex items-center gap-2 rounded-[12px] bg-black/30 p-2 pl-3 text-[12px]">
          <span className="flex-1 text-white/70">Restore £100, the original history and an empty slip?</span>
          <button onClick={() => load('fresh')} className="h-8 rounded-full bg-white px-3 font-semibold text-nav">
            Reset
          </button>
        </div>
      )}
      {current && <p className="mt-3 text-[11px] text-white/35">Fictional demo · not a real match or payment.</p>}
    </div>
  )
}
