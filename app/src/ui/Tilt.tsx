import clsx from 'clsx'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Card wrapper: a few degrees of 3D tilt towards the cursor and a soft
 * spotlight that follows it. Springs keep it calm; reduced motion disables it.
 */
export function Tilt({ children, className, max = 4, glow = 'rgba(255,255,255,.55)', dark = false }: { children: ReactNode; className?: string; max?: number; glow?: string; dark?: boolean }) {
  const reduce = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 220, damping: 22 })
  const sy = useSpring(py, { stiffness: 220, damping: 22 })
  const rx = useTransform(sy, [0, 1], [max, -max])
  const ry = useTransform(sx, [0, 1], [-max, max])
  const gx = useTransform(sx, (v) => `${v * 100}%`)
  const gy = useTransform(sy, (v) => `${v * 100}%`)
  const hover = useMotionValue(0)
  const ho = useSpring(hover, { stiffness: 200, damping: 25 })
  const bg = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, ${glow}, transparent 45%)`
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={clsx('relative [transform-style:preserve-3d]', className)}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        px.set((e.clientX - r.left) / r.width)
        py.set((e.clientY - r.top) / r.height)
        hover.set(1)
      }}
      onPointerLeave={() => {
        px.set(0.5)
        py.set(0.5)
        hover.set(0)
      }}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      {children}
      <motion.span aria-hidden="true" className={clsx('pointer-events-none absolute inset-0 rounded-[inherit]', dark ? 'mix-blend-screen' : 'mix-blend-soft-light')} style={{ background: bg, opacity: ho }} />
    </motion.div>
  )
}
