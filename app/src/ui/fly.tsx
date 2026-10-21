import { AnimatePresence, motion } from 'motion/react'
import { createContext, useCallback, useContext, useRef, useState, type ReactNode, type RefObject } from 'react'

interface Flight {
  id: number
  x0: number
  y0: number
  x1: number
  y1: number
  label: string
}

const FlyCtx = createContext<(from: HTMLElement, label: string) => void>(() => {})
export const useFly = () => useContext(FlyCtx)

/** Pulse targets listen for this to bounce when a selection lands. */
export const LAND_EVENT = 'ternside:land'

/**
 * A price chip that arcs from the tapped odds button into the betslip.
 * Coordinates are relative to the app root and corrected for the preview
 * frame's scale, so the same animation works in Full and Mobile.
 */
export function FlyLayer({ rootRef, children }: { rootRef: RefObject<HTMLDivElement | null>; children: ReactNode }) {
  const [flights, setFlights] = useState<Flight[]>([])
  const n = useRef(0)

  const fly = useCallback(
    (from: HTMLElement, label: string) => {
      const root = rootRef.current
      if (!root) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.dispatchEvent(new Event(LAND_EVENT))
        return
      }
      const rr = root.getBoundingClientRect()
      const scale = rr.width / root.offsetWidth || 1
      const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-slip-target]')).filter((el) => el.getClientRects().length > 0)
      const target = targets[0]
      if (!target) return
      const a = from.getBoundingClientRect()
      const b = target.getBoundingClientRect()
      const f: Flight = {
        id: n.current++,
        x0: (a.left + a.width / 2 - rr.left) / scale,
        y0: (a.top + a.height / 2 - rr.top) / scale,
        x1: (b.left + b.width / 2 - rr.left) / scale,
        y1: (b.top + b.height / 2 - rr.top) / scale,
        label,
      }
      setFlights((fs) => [...fs, f])
    },
    [rootRef],
  )

  return (
    <FlyCtx.Provider value={fly}>
      {children}
      <div className="pointer-events-none absolute inset-0 z-[80] overflow-hidden">
        <AnimatePresence>
          {flights.map((f) => {
            const midX = (f.x0 + f.x1) / 2
            const midY = Math.min(f.y0, f.y1) - 90
            return (
              <motion.div
                key={f.id}
                className="absolute top-0 left-0"
                initial={{ x: f.x0, y: f.y0, scale: 0.6, opacity: 0 }}
                animate={{
                  x: [f.x0, midX, f.x1],
                  y: [f.y0, midY, f.y1],
                  scale: [0.9, 1.1, 0.45],
                  opacity: [1, 1, 0.2],
                }}
                transition={{ duration: 0.62, ease: [0.45, 0, 0.2, 1], times: [0, 0.45, 1] }}
                onAnimationComplete={() => {
                  setFlights((fs) => fs.filter((x) => x.id !== f.id))
                  window.dispatchEvent(new Event(LAND_EVENT))
                }}
              >
                <div className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-action px-3 py-1.5 text-[13px] font-semibold whitespace-nowrap text-white shadow-[0_8px_24px_-6px_rgba(41,72,255,.7)] tnum">
                  {f.label}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </FlyCtx.Provider>
  )
}
