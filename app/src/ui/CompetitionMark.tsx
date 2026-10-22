import { useId } from 'react'
import type { SportId } from '../data/catalog'

/**
 * Competition marks the way sportsbooks and score apps do it: a round country flag for domestic
 * leagues, a globe for international competitions, the sport's ball for tours. Flags are simplified
 * vector drawings (national flags, not brands); competitions themselves are fictional.
 */
type Mark = { kind: 'flag'; draw: () => React.ReactNode } | { kind: 'globe'; color: string } | { kind: 'ball'; color: string }

const h3 = (a: string, b: string, c: string) => () => (
  <>
    <rect width="24" height="8" fill={a} />
    <rect y="8" width="24" height="8" fill={b} />
    <rect y="16" width="24" height="8" fill={c} />
  </>
)
const v3 = (a: string, b: string, c: string) => () => (
  <>
    <rect width="8" height="24" fill={a} />
    <rect x="8" width="8" height="24" fill={b} />
    <rect x="16" width="8" height="24" fill={c} />
  </>
)

const FLAGS = {
  England: () => (
    <>
      <rect width="24" height="24" fill="#fff" />
      <rect x="9.5" width="5" height="24" fill="#CE1124" />
      <rect y="9.5" width="24" height="5" fill="#CE1124" />
    </>
  ),
  Scotland: () => (
    <>
      <rect width="24" height="24" fill="#005EB8" />
      <path d="M0 0 24 24M24 0 0 24" stroke="#fff" strokeWidth="4.2" />
    </>
  ),
  Spain: () => (
    <>
      <rect width="24" height="24" fill="#AA151B" />
      <rect y="6" width="24" height="12" fill="#F1BF00" />
    </>
  ),
  Portugal: () => (
    <>
      <rect width="24" height="24" fill="#DA291C" />
      <rect width="10" height="24" fill="#046A38" />
      <circle cx="10" cy="12" r="4" fill="#FFE900" stroke="#DA291C" strokeWidth="1" />
    </>
  ),
  Germany: h3('#000', '#DD0000', '#FFCE00'),
  Netherlands: h3('#AE1C28', '#fff', '#21468B'),
  Italy: v3('#009246', '#fff', '#CE2B37'),
  Azerbaijan: () => (
    <>
      {h3('#00B5E2', '#EF3340', '#509E2F')()}
      <circle cx="11.2" cy="12" r="2.6" fill="#fff" />
      <circle cx="12" cy="12" r="2.1" fill="#EF3340" />
    </>
  ),
  // Regional league across several countries: a neutral Nordic cross rather than one country's flag.
  Scandinavia: () => (
    <>
      <rect width="24" height="24" fill="#1F3A6E" />
      <rect x="6.5" width="4" height="24" fill="#E8EDF7" />
      <rect y="10" width="24" height="4" fill="#E8EDF7" />
    </>
  ),
}

const BY_ID: Record<string, Mark> = {
  'continental-cup': { kind: 'globe', color: '#13204A' },
  cbl: { kind: 'globe', color: '#13204A' },
  'premier-division': { kind: 'flag', draw: FLAGS.England },
  'northern-championship': { kind: 'flag', draw: FLAGS.England },
  'highland-premiership': { kind: 'flag', draw: FLAGS.Scotland },
  'primera-iberica': { kind: 'flag', draw: FLAGS.Spain },
  'iberian-basket': { kind: 'flag', draw: FLAGS.Spain },
  'liga-atlantica': { kind: 'flag', draw: FLAGS.Portugal },
  'rheinland-liga': { kind: 'flag', draw: FLAGS.Germany },
  'lowlands-league': { kind: 'flag', draw: FLAGS.Netherlands },
  'serie-adriatica': { kind: 'flag', draw: FLAGS.Italy },
  'caspian-super-league': { kind: 'flag', draw: FLAGS.Azerbaijan },
  'nordic-premier': { kind: 'flag', draw: FLAGS.Scandinavia },
  'riviera-masters': { kind: 'ball', color: '#0E7490' },
  'riviera-ladies': { kind: 'ball', color: '#9D174D' },
  'alpine-challenger': { kind: 'ball', color: '#9A3412' },
}

function Ball({ sport }: { sport: SportId }) {
  if (sport === 'tennis')
    return (
      <>
        <circle cx="12" cy="12" r="6.2" fill="#D9F24A" />
        <path d="M6.6 9.2c2.4.6 3.6 2.8 3 5.6M17.4 9.2c-2.4.6-3.6 2.8-3 5.6" stroke="#fff" strokeWidth="1.1" fill="none" />
      </>
    )
  if (sport === 'basketball')
    return (
      <>
        <circle cx="12" cy="12" r="6.2" fill="#F08A3C" />
        <path d="M5.8 12h12.4M12 5.8v12.4M7.6 7.6c2 1.6 2 7.2 0 8.8M16.4 7.6c-2 1.6-2 7.2 0 8.8" stroke="#5a2a0c" strokeWidth=".9" fill="none" />
      </>
    )
  return (
    <>
      <circle cx="12" cy="12" r="6.2" fill="#fff" />
      <path d="m12 9.3 2.5 1.8-.95 2.9h-3.1l-.95-2.9z" fill="#10182B" />
    </>
  )
}

export function CompetitionMark({ id, sport, size = 20 }: { id: string; sport: SportId; size?: number }) {
  const clip = useId()
  const m: Mark = BY_ID[id] ?? { kind: 'ball', color: '#13204A' }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <clipPath id={clip}>
        <circle cx="12" cy="12" r="12" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        {m.kind === 'flag' && m.draw()}
        {m.kind === 'globe' && (
          <>
            <rect width="24" height="24" fill={m.color} />
            <g fill="none" stroke="#fff" strokeWidth="1.3" opacity=".92">
              <circle cx="12" cy="12" r="6.6" />
              <ellipse cx="12" cy="12" rx="2.8" ry="6.6" />
              <path d="M5.4 12h13.2M6.4 8.6h11.2M6.4 15.4h11.2" />
            </g>
          </>
        )}
        {m.kind === 'ball' && (
          <>
            <rect width="24" height="24" fill={m.color} />
            <Ball sport={sport} />
          </>
        )}
      </g>
      <circle cx="12" cy="12" r="11.5" fill="none" stroke="rgba(16,24,43,.14)" />
    </svg>
  )
}
