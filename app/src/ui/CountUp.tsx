import { animate } from 'motion/react'
import { useEffect, useRef } from 'react'

/** Tweens a numeric value; formatter keeps money/odds formatting consistent. */
export function CountUp({ value, format, duration = 0.6 }: { value: number; format: (n: number) => string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef(value)
  useEffect(() => {
    const from = prev.current
    prev.current = value
    if (!ref.current) return
    if (from === value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ref.current.textContent = format(value)
      return
    }
    const c = animate(from, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v)
      },
    })
    return () => c.stop()
  }, [value, format, duration])
  return <span ref={ref}>{format(value)}</span>
}
