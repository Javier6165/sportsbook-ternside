import clsx from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { Market, Selection, SportEvent } from '../data/catalog'
import { fmtOdds } from '../domain/money'
import { useStore } from '../state/store'
import { useFly } from './fly'

/**
 * light  — on canvas/white surfaces (soft chip, cobalt when picked)
 * field  — on a colour-of-the-game field (frosted white)
 * night  — on live/floodlight surfaces
 */
type Variant = 'light' | 'field' | 'night'

export function OddsButton({
  ev,
  market,
  sel,
  odds,
  label,
  variant = 'light',
  size = 'md',
  className,
}: {
  ev: SportEvent
  market: Market
  sel: Selection
  odds: string
  label?: string
  variant?: Variant
  size?: 'md' | 'lg'
  className?: string
}) {
  const { s, d } = useStore()
  const fly = useFly()
  const selected = s.groups.some(
    (g) => g.type === 'single' && g.eventId === ev.id && g.legs[0].marketId === market.id && g.legs[0].selectionId === sel.id,
  )

  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const prev = useRef(odds)
  const [dir, setDir] = useState<0 | 1 | -1>(0)
  useEffect(() => {
    if (prev.current !== odds) {
      setDir(Number(odds) > Number(prev.current) ? 1 : -1)
      prev.current = odds
      const t = setTimeout(() => setDir(0), 2600)
      return () => clearTimeout(t)
    }
  }, [odds])

  const name = `${sel.label}, ${market.name}, ${ev.home.name} v ${ev.away.name}, odds ${fmtOdds(odds)}`
  const lg = size === 'lg'

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      aria-pressed={selected}
      aria-label={name}
      aria-disabled={s.restriction !== 'none' || undefined}
      title={s.restriction === 'paused' ? 'Betting is off during your break' : undefined}
      onClick={(e) => {
        if (s.restriction !== 'none') return
        const r = e.currentTarget.getBoundingClientRect()
        const scale = r.width / e.currentTarget.offsetWidth || 1
        const id = Date.now()
        setRipples((rs) => [...rs, { id, x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale }])
        setTimeout(() => setRipples((rs) => rs.filter((x) => x.id !== id)), 700)
        if (!selected) fly(e.currentTarget, fmtOdds(odds))
        d({
          type: 'toggleSelection',
          eventId: ev.id,
          live: ev.status === 'live',
          leg: { marketId: market.id, marketName: market.name, selectionId: sel.id, label: sel.label, odds, period: market.period },
        })
      }}
      className={clsx(
        'group relative flex min-w-0 items-center gap-2 overflow-hidden text-left transition-[background,color,box-shadow] duration-200',
        lg ? 'min-h-[64px] flex-col !items-start justify-center !gap-0 rounded-[18px] px-3 @tab:px-4' : 'min-h-12 rounded-[14px] px-3.5',
        !lg && (label ? 'justify-between' : 'justify-center'),
        selected
          ? 'bg-action text-white shadow-[0_10px_24px_-12px_rgba(41,72,255,.95)]'
          : variant === 'light'
            ? 'bg-chip text-ink hover:bg-chip-hover'
            : variant === 'field'
              ? 'bg-white/[.94] text-ink shadow-[0_8px_24px_-16px_rgba(0,0,0,.5)] hover:bg-white'
              : 'on-dark bg-white/[.08] text-white hover:bg-white/[.14]',
        s.restriction !== 'none' && 'cursor-not-allowed opacity-45',
        className,
      )}
    >
      {label && (
        <span
          className={clsx(
            'truncate leading-tight font-semibold',
            lg ? 'max-w-full text-[12.5px]' : 'text-[12.5px]',
            selected ? 'text-white/80' : variant === 'night' ? 'text-white/55' : 'text-secondary',
          )}
        >
          {label}
        </span>
      )}
      <span className="relative shrink-0">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={odds}
            initial={{ y: dir > 0 ? 12 : -12, opacity: 0, filter: 'blur(3px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: dir > 0 ? -12 : 12, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={clsx('block font-display font-[720] tracking-[-0.03em] tnum', lg ? 'text-[23px] leading-tight' : 'text-[17px]')}
          >
            {fmtOdds(odds)}
          </motion.span>
        </AnimatePresence>
      </span>
      {ripples.map((rp) => (
        <motion.span
          key={rp.id}
          aria-hidden="true"
          className={clsx('pointer-events-none absolute size-10 -translate-x-1/2 -translate-y-1/2 rounded-full', selected ? 'bg-sel-ink/25' : 'bg-white/60')}
          style={{ left: rp.x, top: rp.y }}
          initial={{ scale: 0, opacity: 0.9 }}
          animate={{ scale: 6, opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      <AnimatePresence>
        {selected && (
          <motion.span
            key="sel-glint"
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent"
            initial={{ x: '-120%' }}
            animate={{ x: '260%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {dir !== 0 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={clsx('absolute top-[5px] right-[6px] text-[8px] leading-none', dir > 0 ? 'text-[#22b968]' : 'text-[#ff4d67]')}
            aria-hidden="true"
          >
            {dir > 0 ? '▲' : '▼'}
          </motion.span>
        )}
      </AnimatePresence>
      {dir !== 0 && (
        <motion.span
          aria-hidden="true"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 2.4 }}
          className={clsx('pointer-events-none absolute inset-0', dir > 0 ? 'bg-[#22b968]/25' : 'bg-[#ff4d67]/22')}
        />
      )}
    </motion.button>
  )
}
