import type { CSSProperties, ReactNode } from 'react'
import { teamColor, type SportEvent } from '../data/catalog'

/** "Colour of the game": a field blended from both sides' colours. */
export function matchGradient(ev: SportEvent, angle = 105) {
  const h = teamColor(ev.home)
  const a = teamColor(ev.away)
  return `linear-gradient(${angle}deg, color-mix(in oklab, ${h} 70%, #05070d) 0%, ${h} 32%, ${a} 72%, color-mix(in oklab, ${a} 72%, #05070d) 100%)`
}

export function MatchField({ ev, className = '', children, style, angle }: { ev: SportEvent; className?: string; children?: ReactNode; style?: CSSProperties; angle?: number }) {
  return (
    <div className={`relative isolate overflow-hidden ${className}`} style={{ background: matchGradient(ev, angle), ...style }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(70% 90% at 12% 115%, rgba(255,255,255,.22), transparent 60%), radial-gradient(55% 70% at 92% -15%, rgba(255,255,255,.20), transparent 60%), linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,.22))',
        }}
      />
      {children}
    </div>
  )
}
