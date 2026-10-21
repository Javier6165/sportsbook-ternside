import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

/** V16 — unknown destination. Never substitutes a different event or ticket. */
export function NotFound({ what = 'page' }: { what?: string }) {
  return (
    <div className="mx-auto grid min-h-[70%] max-w-[520px] place-items-center px-6 py-20 text-center">
      <div>
        <div className="font-display text-[88px] leading-none font-[800] tracking-[-0.06em] text-chip-hover">404</div>
        <h1 className="mt-2 font-display text-[30px] leading-none font-[800] tracking-[-0.045em]">We can’t find that {what}</h1>
        <p className="mt-3 text-[15px] text-secondary">The link may be from another session or a fixture that isn’t in this demo. Nothing has been changed in your account.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to="/sports" className="inline-flex h-11 items-center gap-1.5 rounded-full bg-ink px-5 text-[14px] font-semibold text-white">
            <ArrowLeft size={16} /> For you
          </Link>
          <Link to="/my-bets" className="inline-flex h-11 items-center rounded-full bg-surface px-5 text-[14px] font-semibold">
            My Bets
          </Link>
        </div>
      </div>
    </div>
  )
}
