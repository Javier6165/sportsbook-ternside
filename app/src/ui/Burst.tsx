import { motion } from 'motion/react'

/** A tiny particle burst for small confirmations (favourite, copied, added). */
export function Burst({ color = '#f5a623', n = 8, r = 18 }: { color?: string; n?: number; r?: number }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2
        return (
          <motion.span
            key={i}
            className="absolute size-[5px] rounded-full"
            style={{ background: color }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ x: Math.cos(a) * r, y: Math.sin(a) * r, scale: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          />
        )
      })}
      <motion.span className="absolute size-8 rounded-full border-2" style={{ borderColor: color }} initial={{ scale: 0.3, opacity: 0.8 }} animate={{ scale: 1.4, opacity: 0 }} transition={{ duration: 0.5 }} />
    </span>
  )
}
