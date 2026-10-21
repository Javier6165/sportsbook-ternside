import { ArrowLeft, Hammer } from 'lucide-react'
import { Link } from 'react-router'

export function Placeholder({ title }: { title: string }) {
  return (
    <div className="mx-auto grid min-h-full max-w-[560px] place-items-center px-6 py-16 text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-sel text-sel-ink">
          <Hammer size={22} />
        </span>
        <h1 className="display mt-4 text-[34px] leading-none uppercase">{title}</h1>
        <p className="mt-2 text-[14px] text-secondary">This surface is part of the next build. The home page is the first cut for visual review.</p>
        <Link to="/sports" className="mt-5 inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-[13.5px] font-semibold text-white">
          <ArrowLeft size={16} /> Back to Sports
        </Link>
      </div>
    </div>
  )
}
