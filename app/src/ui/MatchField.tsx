import type { CSSProperties, ReactNode } from 'react'
import { teamColor, type SportEvent } from '../data/catalog'

/** "Colour of the game": a field blended from both sides' colours. */
export function matchGradient(ev: SportEvent, angle = 105) {
  const h = teamColor(ev.home)
  const a = teamColor(ev.away)
  // Both colours are pulled slightly towards night so two saturated kits never clash at full strength.
  return `linear-gradient(${angle}deg, color-mix(in oklab, ${h} 62%, #05070d) 0%, color-mix(in oklab, ${h} 86%, #05070d) 34%, color-mix(in oklab, ${a} 86%, #05070d) 70%, color-mix(in oklab, ${a} 62%, #05070d) 100%)`
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

/** One live colour language for every in-play card: ink → cobalt, with the red LIVE badge as the only accent. */
export const LIVE_GRADIENT = 'linear-gradient(115deg, #0c1022 0%, #141d4f 50%, #23379e 100%)'

/** The only non-team surface gradient: ink → navy. Cobalt appears as a glow, never as a bright end stop. */
export const BRAND_GRADIENT = 'radial-gradient(60% 90% at 88% 0%, rgba(41,72,255,.35), transparent 70%), linear-gradient(115deg, #0b0f1c 0%, #121a3c 55%, #1b2763 100%)'
