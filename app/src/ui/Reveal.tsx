import { motion, useReducedMotion } from 'motion/react'

/** Letters rise out of a mask, one after another — used for big display type. */
export function Reveal({ text, delay = 0, stagger = 0.028, className }: { text: string; delay?: number; stagger?: number; className?: string }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  let n = 0
  return (
    <span className={className} role="img" aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden="true" className="inline-flex overflow-hidden pb-[0.08em] align-bottom" style={{ marginRight: wi < words.length - 1 ? '0.22em' : 0 }}>
          {w.split('').map((ch) => {
            const i = n++
            return (
              <motion.span
                key={i}
                className="inline-block will-change-transform"
                initial={reduce ? false : { y: '108%', rotate: 6, opacity: 0 }}
                animate={{ y: '0%', rotate: 0, opacity: 1 }}
                transition={{ delay: delay + i * stagger, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              >
                {ch}
              </motion.span>
            )
          })}
        </span>
      ))}
    </span>
  )
}
