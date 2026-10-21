import type { SportId } from '../data/catalog'

/** Line icons drawn to match Lucide's 2px stroke grid. */
export function SportIcon({ sport, size = 18, className = '' }: { sport: SportId; size?: number; className?: string }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.85, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className, 'aria-hidden': true }
  if (sport === 'football')
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9.2" />
        <path d="M12 7.2l4.1 3-1.6 4.8H9.5L7.9 10.2z" />
        <path d="M12 7.2V2.9M16.1 10.2l4.2-1.4M14.5 15l2.7 3.6M9.5 15l-2.7 3.6M7.9 10.2L3.7 8.8" />
      </svg>
    )
  if (sport === 'tennis')
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9.2" />
        <path d="M5.6 5.4c3.2 3.4 3.2 9.8 0 13.2M18.4 5.4c-3.2 3.4-3.2 9.8 0 13.2" />
      </svg>
    )
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 2.8v18.4M2.8 12h18.4M5.5 5.5c2.6 2.6 2.6 10.4 0 13M18.5 5.5c-2.6 2.6-2.6 10.4 0 13" />
    </svg>
  )
}
