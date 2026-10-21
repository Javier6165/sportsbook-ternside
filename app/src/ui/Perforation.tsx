import clsx from 'clsx'

/** Perforated tear line with side notches, painted in the page colour. */
export function Perforation({ notch = 'bg-canvas' }: { notch?: string }) {
  return (
    <div className="relative h-7" aria-hidden="true">
      <span className={clsx('absolute top-0 -left-3.5 size-7 rounded-full', notch)} />
      <span className={clsx('absolute top-0 -right-3.5 size-7 rounded-full', notch)} />
      <span className="absolute inset-x-5 top-1/2 border-t-2 border-dashed border-[#e3e5ea]" />
    </div>
  )
}
