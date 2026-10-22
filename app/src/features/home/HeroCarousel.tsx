import clsx from 'clsx'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

export interface Slide {
  id: string
  label: string
  node: ReactNode
}

const DURATION = 8000
const ease = [0.76, 0, 0.24, 1] as const

/**
 * Full-width rotating banner. Slides share one grid cell so the container keeps
 * the tallest height; each new slide wipes in from the travel direction and its
 * own content re-runs its entrance animation. Pauses on hover/focus, honours
 * reduced motion, supports swipe, arrows and keyboard.
 */
export function HeroCarousel({ slides, label }: { slides: Slide[]; label: string }) {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const [hover, setHover] = useState(false)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()
  const n = slides.length
  const t0 = useRef(Date.now())
  const [progress, setProgress] = useState(0)
  const running = n > 1 && !hover && !paused && !reduce

  const go = useCallback(
    (to: number, d?: number) => {
      setDir(d ?? (to > i ? 1 : -1))
      setI(((to % n) + n) % n)
      t0.current = Date.now()
      setProgress(0)
    },
    [i, n],
  )

  useEffect(() => {
    if (!running) {
      t0.current = Date.now() - progress * DURATION
      return
    }
    let raf = 0
    const tick = () => {
      const p = (Date.now() - t0.current) / DURATION
      if (p >= 1) go(i + 1, 1)
      else {
        setProgress(p)
        raf = requestAnimationFrame(tick)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, i])

  if (n === 0) return null
  const s = slides[i]

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className="group/car relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setHover(true)}
      onBlurCapture={() => setHover(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(i + 1, 1)
        if (e.key === 'ArrowLeft') go(i - 1, -1)
      }}
    >
      <div className="grid overflow-hidden">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={s.id}
            custom={dir}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}: ${s.label}`}
            className="[grid-area:1/1]"
            variants={{
              enter: (d: number) => ({ clipPath: d > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)', zIndex: 2 }),
              center: { clipPath: 'inset(0 0 0 0%)', zIndex: 2 },
              exit: (d: number) => ({ x: d > 0 ? '-12%' : '12%', opacity: 0.4, zIndex: 1 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0 : 0.9, ease }}
            drag={n > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(i + 1, 1)
              else if (info.offset.x > 60) go(i - 1, -1)
            }}
          >
            {s.node}
          </motion.div>
        </AnimatePresence>
      </div>

      {n > 1 && (
        <div className="on-dark pointer-events-none absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto flex max-w-[1220px] items-center gap-3 px-4 pb-5 @tab:px-8">
            <div className="pointer-events-auto flex flex-1 gap-1.5" role="tablist" aria-label="Choose a banner">
              {slides.map((sl, k) => (
                <button
                  key={sl.id}
                  role="tab"
                  aria-selected={k === i}
                  aria-label={sl.label}
                  onClick={() => go(k)}
                  className="group/dot relative h-8 flex-1 max-w-[120px]"
                >
                  <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/25 transition-[height] group-hover/dot:h-[5px]">
                    <span className="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: k < i ? '100%' : k === i ? `${(reduce ? 1 : progress) * 100}%` : '0%' }} />
                  </span>
                  <span className={clsx('absolute bottom-full left-0 mb-0.5 hidden max-w-full truncate text-left text-[11.5px] font-semibold @tab:block', k === i ? 'text-white' : 'text-white/55')}>{sl.label}</span>
                </button>
              ))}
            </div>
            <div className="pointer-events-auto flex gap-1.5">
              <button onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play banners' : 'Pause banners'} className="grid size-9 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/15 backdrop-blur-md hover:bg-white/25">
                {paused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
              </button>
              <button onClick={() => go(i - 1, -1)} aria-label="Previous banner" className="grid size-9 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/15 backdrop-blur-md hover:bg-white/25">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => go(i + 1, 1)} aria-label="Next banner" className="grid size-9 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/15 backdrop-blur-md hover:bg-white/25">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
