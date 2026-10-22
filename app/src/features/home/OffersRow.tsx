import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { promoById, type PromoId } from '../../domain/promos'
import { PromoCard } from '../promotions/PromoCard'
import { SectionTitle } from './Popular'

/** Two or three plain offers, below the banner and never inside it. */
export function OffersRow({ ids }: { ids: PromoId[] }) {
  return (
    <section aria-labelledby="offers-title" className="mt-14">
      <SectionTitle
        id="offers-title"
        aside={
          <Link to="/promotions" className="flex items-center gap-1 pb-1 text-[14px] font-semibold text-sel-ink hover:underline">
            All promotions <ArrowRight size={15} />
          </Link>
        }
      >
        Offers
      </SectionTitle>
      <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 @tab:mx-0 @tab:grid @tab:grid-cols-3 @tab:px-0">
        {ids.map((id, i) => (
          <div key={id} className="w-[290px] shrink-0 snap-start @tab:w-auto">
            <PromoCard p={promoById(id)} compact i={i} />
          </div>
        ))}
      </div>
    </section>
  )
}
