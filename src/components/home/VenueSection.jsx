import { useCallback, useEffect, useRef, useState } from 'react'
import { fieldsApi, getErrorMessage } from '../../api'
import { alertClass } from '../../lib/ui'
import Icon from '../ui/Icon'
import VenueCard from './VenueCard'

const SkeletonCard = () => (
  <div className="w-[85vw] max-w-[340px] shrink-0 animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-outline-variant/40 sm:w-[calc(50%-12px)] sm:max-w-none lg:w-[calc(25%-18px)]">
    <div className="aspect-[16/10] w-full bg-surface-container" />
    <div className="space-y-3 p-5">
      <div className="h-3 w-1/2 rounded bg-surface-container" />
      <div className="h-5 w-3/4 rounded bg-surface-container" />
      <div className="h-3 w-2/3 rounded bg-surface-container" />
      <div className="h-10 w-full rounded bg-surface-container" />
    </div>
  </div>
)

export default function VenueSection({ filters, categories = [] }) {
  const [venues, setVenues] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const scrollerRef = useRef(null)
  const [scrollState, setScrollState] = useState({ start: true, end: true })

  const updateScrollState = useCallback(() => {
    const element = scrollerRef.current

    if (!element) {
      return
    }

    setScrollState({
      start: element.scrollLeft <= 4,
      end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 4,
    })
  }, [])

  useEffect(() => {
    let isMounted = true
    setStatus('loading')
    setError(null)

    fieldsApi
      .list({
        per_page: 8,
        ...(filters.location ? { location: filters.location } : {}),
        ...(filters.category ? { category: filters.category } : {}),
      })
      .then((response) => {
        if (!isMounted) {
          return
        }

        setVenues(response.data ?? [])
        setStatus('ready')
      })
      .catch((requestError) => {
        if (!isMounted) {
          return
        }

        setError(getErrorMessage(requestError))
        setStatus('error')
      })

    return () => {
      isMounted = false
    }
  }, [filters.location, filters.category, reloadKey])

  useEffect(() => {
    const element = scrollerRef.current

    if (!element) {
      return undefined
    }

    updateScrollState()
    element.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      element.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState, venues.length])

  function scrollByCard(direction) {
    const element = scrollerRef.current

    if (!element) {
      return
    }

    element.scrollBy({ left: direction * Math.max(300, element.clientWidth * 0.8), behavior: 'smooth' })
  }

  const hasPrev = !scrollState.start
  const hasNext = !scrollState.end
  const hasFilters = Boolean(filters.location || filters.category)
  const activeCategoryName = categories.find((category) => category.slug === filters.category)?.name

  return (
    <section id="lapangan" className="w-full scroll-mt-20 bg-surface py-14 lg:py-16">
      <div className="mx-auto w-full max-w-[1200px] px-4 lg:px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="flex items-center gap-1.5 text-label-md font-bold uppercase tracking-widest text-secondary">
              <Icon name="local_fire_department" className="text-[16px]" />
              Terfavorit Minggu Ini
            </span>
            <h2 className="mt-1 font-display text-headline-xl font-extrabold tracking-tight text-on-surface">
              Rekomendasi Lapangan Terbaik
            </h2>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Standar kebersihan prima, fasilitas lengkap, dan telah diverifikasi oleh komunitas pemain.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Sebelumnya"
              onClick={() => scrollByCard(-1)}
              disabled={!hasPrev}
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-on-surface shadow-sm ring-1 ring-outline-variant/50 transition-all hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon name="chevron_left" className="text-[20px]" />
            </button>
            <button
              type="button"
              aria-label="Selanjutnya"
              onClick={() => scrollByCard(1)}
              disabled={!hasNext}
              className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-on-secondary shadow-sm transition-all hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon name="chevron_right" className="text-[20px]" />
            </button>
          </div>
        </div>

        {hasFilters && status === 'ready' && (
          <p className="-mt-4 mb-5 text-body-sm text-on-surface-variant">
            Menampilkan {venues.length} lapangan
            {filters.category ? ` untuk kategori "${activeCategoryName ?? filters.category}"` : ''}
            {filters.location ? ` di "${filters.location}"` : ''}.
          </p>
        )}

        {status === 'error' && (
          <div className={`${alertClass} flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between`}>
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="rounded-lg bg-error px-3 py-1.5 text-label-md font-semibold text-white"
            >
              Coba lagi
            </button>
          </div>
        )}

        {status !== 'error' && status === 'ready' && venues.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-outline-variant bg-white px-6 py-14 text-center">
            <Icon name="search_off" className="text-[40px] text-outline" />
            <p className="font-display text-headline-sm font-semibold text-on-surface">
              Lapangan tidak ditemukan
            </p>
            <p className="max-w-md text-body-md text-on-surface-variant">
              Coba ubah lokasi atau kategori pencarian Anda untuk melihat venue lain yang tersedia.
            </p>
          </div>
        )}

        <div
          ref={scrollerRef}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-2 lg:mx-0 lg:px-0"
        >
          {status === 'loading'
            ? Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
            : venues.map((venue) => <VenueCard key={venue.id} field={venue} />)}
        </div>
      </div>
    </section>
  )
}
