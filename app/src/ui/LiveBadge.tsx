import clsx from 'clsx'

/**
 * The single "live" signature across Ternside: a red pill with a pulsing dot.
 * Same typeface and shapes as the rest of the brand — no separate live theme.
 */
export function LiveBadge({ clock, tone = 'light', size = 'sm', className }: { clock?: string; tone?: 'light' | 'solid'; size?: 'sm' | 'lg'; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold whitespace-nowrap tnum',
        size === 'lg' ? 'h-8 px-3 text-[13.5px]' : 'h-6 px-2 text-[11.5px]',
        tone === 'solid' ? 'bg-live text-white shadow-[0_6px_18px_-6px_rgba(255,59,92,.8)]' : 'bg-live/10 text-[#d81e43]',
        className,
      )}
    >
      <span className={clsx('live-dot', tone === 'solid' && '!bg-white')} aria-hidden="true" />
      <span className="font-bold tracking-[.06em]">LIVE</span>
      {clock && <span className={clsx('font-semibold', tone === 'solid' ? 'text-white/85' : 'text-[#d81e43]/80')}>{clock}</span>}
    </span>
  )
}
