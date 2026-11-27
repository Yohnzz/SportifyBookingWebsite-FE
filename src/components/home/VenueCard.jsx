import { useState } from 'react'
import { Link } from 'react-router-dom'
import { facilityIcon, fieldFallbackImage, fieldImage, formatRupiah, lowestPrice } from '../../lib/format'
import Icon from '../ui/Icon'

export default function VenueCard({ field }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const price = lowestPrice(field)
  const fallback = fieldFallbackImage(field)

  return (
    <article className="group flex w-[85vw] max-w-[340px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-outline-variant/50 transition-all duration-300 hover:shadow-xl sm:w-[calc(50%-12px)] sm:max-w-none lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container">
        <img
          src={fieldImage(field)}
          alt={field.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(event) => {
            if (event.currentTarget.dataset.fallback === 'true') {
              return
            }

            event.currentTarget.dataset.fallback = 'true'
            event.currentTarget.src = fallback
          }}
        />

        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-secondary-container/95 px-3 py-1 text-label-md text-on-secondary-container shadow-sm backdrop-blur-sm">
          <Icon name="check_circle" className="text-[14px]" />
          <span>Lapangan Tersedia</span>
        </div>

        <button
          type="button"
          aria-label={isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'}
          aria-pressed={isFavorite}
          onClick={() => setIsFavorite((favorite) => !favorite)}
          className={`absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/80 backdrop-blur-sm transition-colors ${
            isFavorite ? 'text-error' : 'text-on-surface hover:text-error'
          }`}
        >
          <Icon name="favorite" filled={isFavorite} className="text-[18px]" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-label-sm font-semibold uppercase tracking-wider text-secondary">
            {field.category?.name ?? 'Lapangan'}
          </span>
          <span className="inline-flex items-center gap-1 text-label-md font-semibold text-secondary">
            <Icon name="verified" className="text-[15px]" />
            Terverifikasi
          </span>
        </div>

        <h3 className="font-display text-headline-sm font-bold leading-snug text-on-surface transition-colors group-hover:text-secondary">
          {field.name}
        </h3>

        <p className="mb-4 mt-1.5 flex items-center gap-1.5 text-body-sm text-on-surface-variant">
          <Icon name="location_on" className="text-[16px] text-outline" />
          <span className="line-clamp-1">{field.location ?? field.address ?? '-'}</span>
        </p>

        <div className="mb-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-surface-container pt-3 text-[11px] leading-tight text-on-surface-variant">
          {(field.facilities ?? []).slice(0, 3).map((facility) => (
            <span key={facility} className="flex items-center gap-1" title={facility}>
              <Icon name={facilityIcon(facility)} className="text-[15px]" />
              {facility.split(' / ')[0].split(' & ')[0]}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-2 gap-y-3 pt-2">
          <div>
            <span className="block text-label-sm text-on-surface-variant">Mulai dari</span>
            <span className="flex flex-wrap items-baseline gap-x-1">
              <span className="whitespace-nowrap font-display text-price-lg font-extrabold leading-none text-secondary">
                {price ? formatRupiah(price) : 'Hubungi venue'}
              </span>
              {price && <span className="whitespace-nowrap text-body-sm text-on-surface-variant">/ jam</span>}
            </span>
          </div>

          <Link
            to={`/lapangan/${field.slug}`}
            className="shrink-0 whitespace-nowrap rounded-xl bg-surface-container px-3 py-2 text-label-md font-semibold text-on-surface transition-all hover:bg-secondary hover:text-on-secondary"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </article>
  )
}
