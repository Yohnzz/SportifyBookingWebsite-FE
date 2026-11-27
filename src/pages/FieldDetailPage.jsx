import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fieldsApi, getErrorMessage } from '../api'
import Icon from '../components/ui/Icon'
import { useAuth } from '../hooks/useAuth'
import {
  facilityIcon,
  fieldFallbackImage,
  fieldImage,
  formatDuration,
  formatRupiah,
  lowestPrice,
} from '../lib/format'
import { alertClass, buttonPrimary, cardClass } from '../lib/ui'

const dayTypeLabels = {
  all: 'Setiap hari',
  weekday: 'Senin - Jumat',
  weekend: 'Sabtu - Minggu',
}

export default function FieldDetailPage() {
  const { slug } = useParams()
  const { isAuthenticated } = useAuth()
  const [field, setField] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    setStatus('loading')

    fieldsApi
      .show(slug)
      .then((response) => {
        if (!isMounted) {
          return
        }

        setField(response.data)
        setStatus('ready')
      })
      .catch((requestError) => {
        if (!isMounted) {
          return
        }

        setError(getErrorMessage(requestError, 'Lapangan tidak ditemukan.'))
        setStatus('error')
      })

    return () => {
      isMounted = false
    }
  }, [slug])

  if (status === 'loading') {
    return (
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-10 lg:px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-40 rounded bg-surface-container" />
          <div className="aspect-[16/7] w-full rounded-2xl bg-surface-container" />
          <div className="h-8 w-1/2 rounded bg-surface-container" />
          <div className="h-4 w-2/3 rounded bg-surface-container" />
        </div>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-16 text-center lg:px-6">
        <Icon name="error" className="text-[48px] text-error" />
        <h1 className="mt-3 font-display text-headline-lg font-bold text-on-surface">Lapangan tidak ditemukan</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">{error}</p>
        <Link to="/#lapangan" className={`${buttonPrimary} mt-6`}>
          <Icon name="arrow_back" className="text-[18px]" />
          Kembali ke katalog
        </Link>
      </main>
    )
  }

  const price = lowestPrice(field)
  const facilities = field.facilities ?? []
  const tarifList = [...(field.tarif ?? [])]
    .filter((tarif) => tarif.is_active !== false)
    .sort((first, second) => first.start_time.localeCompare(second.start_time))

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 lg:px-6 lg:py-10">
      <Link
        to="/#lapangan"
        className="inline-flex items-center gap-1.5 text-label-lg font-semibold text-on-surface-variant transition hover:text-secondary"
      >
        <Icon name="arrow_back" className="text-[18px]" />
        Kembali ke katalog
      </Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-surface-container">
            <img
              src={fieldImage(field)}
              alt={field.name}
              className="h-full w-full object-cover"
              onError={(event) => {
                if (event.currentTarget.dataset.fallback === 'true') {
                  return
                }

                event.currentTarget.dataset.fallback = 'true'
                event.currentTarget.src = fieldFallbackImage(field)
              }}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-secondary-container px-3 py-1 text-label-md font-semibold text-on-secondary-container">
              {field.category?.name ?? 'Lapangan'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-1 text-label-md font-semibold text-on-surface-variant">
              <Icon name="verified" className="text-[14px] text-secondary" />
              Terverifikasi
            </span>
          </div>

          <h1 className="mt-3 font-display text-headline-xl font-extrabold tracking-tight text-on-surface">
            {field.name}
          </h1>

          <p className="mt-1 flex items-center gap-1.5 text-body-md text-on-surface-variant">
            <Icon name="location_on" className="text-[18px] text-outline" />
            {field.address ?? field.location ?? '-'}
          </p>

          {field.description && (
            <p className="mt-5 max-w-3xl text-body-md leading-relaxed text-on-surface-variant">{field.description}</p>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className={`${cardClass} p-5`}>
              <h2 className="flex items-center gap-2 font-display text-headline-sm font-semibold text-on-surface">
                <Icon name="schedule" className="text-[20px] text-secondary" />
                Jam Operasional
              </h2>
              <p className="mt-2 text-body-md text-on-surface-variant">
                Setiap hari, {field.opening_time} - {field.closing_time}
              </p>
              <p className="mt-1 text-body-sm text-on-surface-variant">
                Durasi sewa {formatDuration(field.minimum_booking_duration)} -{' '}
                {formatDuration(field.maximum_booking_duration)} per sesi.
              </p>
            </div>

            <div className={`${cardClass} p-5`}>
              <h2 className="flex items-center gap-2 font-display text-headline-sm font-semibold text-on-surface">
                <Icon name="pin_drop" className="text-[20px] text-secondary" />
                Area
              </h2>
              <p className="mt-2 text-body-md text-on-surface-variant">{field.location ?? '-'}</p>
              <p className="mt-1 text-body-sm text-on-surface-variant">Status lapangan: aktif dan siap dibooking.</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="font-display text-headline-md font-semibold text-on-surface">Fasilitas</h2>
            {facilities.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {facilities.map((facility) => (
                  <div
                    key={facility}
                    className="flex items-center gap-2.5 rounded-xl bg-white px-4 py-3 text-body-sm text-on-surface-variant ring-1 ring-outline-variant/40"
                  >
                    <Icon name={facilityIcon(facility)} className="text-[20px] text-secondary" />
                    {facility}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-body-sm text-on-surface-variant">Belum ada data fasilitas.</p>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className={`${cardClass} p-6`}>
            <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">Mulai dari</span>
            <div className="mt-1 flex items-end gap-1">
              <span className="font-display text-price-lg font-extrabold leading-none text-secondary">
                {price ? formatRupiah(price) : 'Hubungi venue'}
              </span>
              {price && <span className="text-body-sm text-on-surface-variant">/ jam</span>}
            </div>

            <div className="mt-5 space-y-2 border-t border-outline-variant/40 pt-4">
              {tarifList.length > 0 ? (
                tarifList.map((tarif) => (
                  <div key={tarif.id} className="flex items-center justify-between gap-3 text-body-sm">
                    <span className="text-on-surface-variant">
                      {dayTypeLabels[tarif.day_type] ?? tarif.day_type}
                      <span className="block text-label-sm text-outline">
                        {tarif.start_time} - {tarif.end_time}
                      </span>
                    </span>
                    <span className="font-display text-price-md text-on-surface">{formatRupiah(tarif.price)}</span>
                  </div>
                ))
              ) : (
                <p className="text-body-sm text-on-surface-variant">Tarif belum tersedia.</p>
              )}
            </div>

            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className={`${buttonPrimary} mt-6 w-full`}
            >
              <Icon name="event_available" className="text-[18px]" />
              Booking Sekarang
            </Link>

            <p className="mt-3 text-center text-label-sm text-on-surface-variant">
              Konfirmasi instan &middot; Pembayaran aman
            </p>
          </div>

          <div className={`${cardClass} mt-4 flex items-start gap-3 p-5`}>
            <Icon name="support_agent" className="text-[24px] text-secondary" />
            <div>
              <p className="text-label-lg font-semibold text-on-surface">Butuh bantuan?</p>
              <a
                href="mailto:support@gorecosports.id"
                className="text-body-sm text-on-surface-variant transition hover:text-secondary"
              >
                support@gorecosports.id
              </a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
