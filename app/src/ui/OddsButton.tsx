import clsx from 'clsx'
import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { Market, Selection, SportEvent } from '../data/catalog'
import { fmtOdds } from '../domain/money'
import { useStore } from '../state/store'
import { useFly } from './fly'

type Variant = 'light' | 'dark' | 'hero'

export function OddsButton({
  ev,
  market,
  sel,
  odds,
  label,
  variant = 'light',
  className,
}: {
  ev: SportEvent
  market: Market
  sel: Selection
  odds: string
  label?: string
  variant?: Variant
  className?: string
}) {
  const { s, d } = useStore()
  const fly = useFly()
  const selected = s.groups.some(
    (g) => g.type === 'single' && g.eventId === ev.id && g.legs[0].marketId === market.id && g.legs[0].selectionId === sel.id,
  )

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

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      aria-pressed={selected}
      aria-label={name}
      onClick={(e) => {
        if (!selected) fly(e.currentTarget, fmtOdds(odds))
        d({
          type: 'toggleSelection',
          eventId: ev.id,
          live: ev.status === 'live',
          leg: { marketId: market.id, marketName: market.name, selectionId: sel.id, label: sel.label, odds, period: market.period },
        })
      }}
      className={clsx(
        'group relative flex min-h-11 min-w-0 items-center justify-between gap-2 overflow-hidden rounded-[10px] px-3 text-left transition-[background,border-color,color,box-shadow] duration-200',
        variant === 'light' &&
          (selected
            ? 'border-[1.5px] border-sel-ink bg-sel text-sel-ink shadow-[0_0_0_3px_rgba(41,72,255,.10)]'
            : 'border border-line bg-surface text-ink hover:border-line-strong hover:bg-[#fafbfd] hover:shadow-[0_2px_8px_-4px_rgba(16,24,43,.18)]'),
        variant === 'dark' &&
          (selected
            ? 'on-dark border border-action bg-action text-white shadow-[0_6px_20px_-8px_rgba(41,72,255,.9)]'
            : 'on-dark border border-white/10 bg-white/[.06] text-white hover:border-white/20 hover:bg-white/[.11]'),
        variant === 'hero' &&
          (selected
            ? 'on-dark min-h-[60px] flex-col !items-start !justify-center !gap-0.5 border border-action bg-action text-white shadow-[0_10px_30px_-10px_rgba(41,72,255,1)]'
            : 'on-dark min-h-[60px] flex-col !items-start !justify-center !gap-0.5 border border-white/12 bg-white/[.07] text-white backdrop-blur-md hover:border-white/25 hover:bg-white/[.13]'),
        label ? '' : 'justify-center',
        className,
      )}
    >
      {label && (
        <span
          className={clsx(
            'truncate text-[12.5px] leading-tight font-medium',
            variant === 'light' ? (selected ? 'text-sel-ink' : 'text-secondary') : selected ? 'text-white' : 'text-white/65',
          )}
        >
          {label}
        </span>
      )}
      <span className="relative flex shrink-0 items-center gap-1">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={odds}
            initial={{ y: dir > 0 ? 10 : -10, opacity: 0, filter: 'blur(3px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: dir > 0 ? -10 : 10, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={clsx('tnum font-semibold', variant === 'hero' ? 'text-[17px]' : 'text-[14.5px]')}
          >
            {fmtOdds(odds)}
          </motion.span>
        </AnimatePresence>
      </span>
      <AnimatePresence>
        {dir !== 0 && (
          <motion.span
            initial={{ opacity: 0, y: dir > 0 ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={clsx('absolute top-[3px] right-[5px] text-[8px] leading-none', dir > 0 ? 'text-[#2fbf71]' : 'text-[#ff5a6e]')}
            aria-hidden="true"
          >
            {dir > 0 ? '▲' : '▼'}
          </motion.span>
        )}
      </AnimatePresence>
      {selected && variant === 'light' && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1 right-1 grid size-3.5 place-items-center rounded-full bg-sel-ink text-white"
          aria-hidden="true"
        >
          <Check size={9} strokeWidth={3.5} />
        </motion.span>
      )}
      {dir !== 0 && (
        <motion.span
          aria-hidden="true"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 2.4 }}
          className={clsx('pointer-events-none absolute inset-0', dir > 0 ? 'bg-[#2fbf71]/25' : 'bg-[#ff5a6e]/22')}
        />
      )}
    </motion.button>
  )
}
