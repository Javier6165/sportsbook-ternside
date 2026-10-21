import { useId } from 'react'
import type { Crest as CrestSpec, Participant } from '../data/catalog'

const SHAPES: Record<CrestSpec['shape'], string> = {
  shield: 'M4 4H36V20C36 31.5 28.5 38.6 20 42C11.5 38.6 4 31.5 4 20Z',
  round: 'M20 3A19 19 0 1 1 19.99 3Z',
  hex: 'M20 2.5L37 12V32L20 41.5L3 32V12Z',
  diamond: 'M20 1.5L38.5 22L20 42.5L1.5 22Z',
  badge: 'M7 3.5H33Q36.5 3.5 36.5 7V29.5L20 41.5L3.5 29.5V7Q3.5 3.5 7 3.5Z',
}

function Pattern({ p, c1, c2 }: { p: CrestSpec['pattern']; c1: string; c2: string }) {
  switch (p) {
    case 'solid':
      return <rect width="40" height="44" fill={c1} />
    case 'stripes':
      return (
        <>
          <rect width="40" height="44" fill={c1} />
          {[6, 16, 26, 36].map((x) => (
            <rect key={x} x={x} y="0" width="5" height="44" fill={c2} />
          ))}
        </>
      )
    case 'half':
      return (
        <>
          <rect width="20" height="44" fill={c1} />
          <rect x="20" width="20" height="44" fill={c2} />
        </>
      )
    case 'sash':
      return (
        <>
          <rect width="40" height="44" fill={c1} />
          <path d="M-4 10L10 -4L46 32L32 46Z" fill={c2} />
        </>
      )
    case 'hoops':
      return (
        <>
          <rect width="40" height="44" fill={c1} />
          {[6, 18, 30].map((y) => (
            <rect key={y} x="0" y={y} width="40" height="6" fill={c2} />
          ))}
        </>
      )
    case 'chevron':
      return (
        <>
          <rect width="40" height="44" fill={c1} />
          <path d="M0 14L20 28L40 14V22L20 36L0 22Z" fill={c2} />
        </>
      )
    case 'quarters':
      return (
        <>
          <rect width="40" height="44" fill={c1} />
          <rect width="20" height="22" fill={c2} />
          <rect x="20" y="22" width="20" height="22" fill={c2} />
        </>
      )
    case 'band':
      return (
        <>
          <rect width="40" height="44" fill={c1} />
          <rect y="16" width="40" height="11" fill={c2} />
        </>
      )
  }
}

export function Crest({ team, size = 28, className = '' }: { team: Participant; size?: number; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const c = team.crest
  if (!c) return <PlayerMark p={team} size={size} className={className} />
  const d = SHAPES[c.shape]
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 40 44" className={className} aria-hidden="true">
      <defs>
        <clipPath id={`c${uid}`}>
          <path d={d} />
        </clipPath>
        <linearGradient id={`g${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".34" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".18" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#c${uid})`}>
        <Pattern p={c.pattern} c1={c.c1} c2={c.c2} />
        <circle cx="20" cy="21" r="8.6" fill={c.c1} stroke={c.c2} strokeWidth="1.6" />
        <text
          x="20"
          y="25.2"
          textAnchor="middle"
          fontFamily="Barlow Condensed, Inter, sans-serif"
          fontWeight="600"
          fontSize="12.5"
          fill={c.c2}
        >
          {c.mark}
        </text>
        <rect width="40" height="44" fill={`url(#g${uid})`} />
      </g>
      <path d={d} fill="none" stroke="rgba(10,15,30,.28)" strokeWidth="1.1" />
    </svg>
  )
}

function PlayerMark({ p, size, className }: { p: Participant; size: number; className: string }) {
  const initials = p.name
    .replace(/\./g, '')
    .split(' ')
    .map((x) => x[0])
    .join('')
  return (
    <span
      className={`relative inline-grid place-items-center rounded-full bg-gradient-to-br from-[#2a3656] to-[#10182b] font-display text-white ring-1 ring-black/10 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden="true"
    >
      {initials}
      {p.country && size >= 30 && (
        <span className="absolute -right-1 -bottom-1 rounded-[4px] bg-white px-[3px] font-sans text-[8px] leading-[12px] font-bold text-ink ring-1 ring-line">
          {p.country}
        </span>
      )}
    </span>
  )
}
