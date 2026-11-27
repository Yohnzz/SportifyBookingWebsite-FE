import { Fragment, useState } from 'react'
import { formatDateLong, toDateInputValue } from '../../lib/format'
import Icon from '../ui/Icon'
import SelectMenu from '../ui/SelectMenu'

const quickStats = [
  { icon: 'verified_user', label: 'Jaminan Ketersediaan 100%' },
  { icon: 'bolt', label: 'Verifikasi Instan QR Code' },
  { icon: 'thumb_up', label: 'Venue Terpilih di Berbagai Kota' },
]

export default function HeroSection({ categories = [], onSearch }) {
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(toDateInputValue())

  function handleSubmit(event) {
    event.preventDefault()
    onSearch?.({ location: location.trim(), category })
  }

  return (
    <section className="relative isolate z-10 bg-primary">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/images/hero-arena.jpg"
          alt="Arena olahraga indoor dengan lapangan sintetis dan lampu stadion"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/45 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/20 to-surface" />
      </div>

      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-4 pb-24 pt-16 text-center lg:px-6 lg:pb-28 lg:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-label-md font-semibold text-secondary-fixed shadow-sm ring-1 ring-white/15 backdrop-blur-md">
          <Icon name="verified" className="text-[16px]" />
          Venue Terverifikasi
        </span>

        <h1 className="mt-5 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-on-primary drop-shadow-sm sm:text-4xl lg:text-display-lg">
          Temukan Lapangan Favoritmu
        </h1>

        <p className="mt-4 max-w-2xl text-body-lg text-surface-container-low drop-shadow">
          Nikmati pengalaman booking lapangan olahraga dengan mudah, cepat, dan aman untuk komunitas serta permainan
          terbaik Anda.
        </p>

        <div className="mt-10 w-full max-w-4xl rounded-2xl bg-white p-3 shadow-2xl sm:p-4">
          <form className="grid grid-cols-1 items-center gap-3 md:grid-cols-12" onSubmit={handleSubmit}>
            <div className="relative flex items-center gap-2.5 rounded-xl bg-surface-container-low/80 px-3.5 py-2.5 transition-colors focus-within:bg-surface-container-lowest md:col-span-4">
              <Icon name="location_on" className="text-[22px] text-secondary" />
              <div className="flex w-full min-w-0 flex-col text-left">
                <label htmlFor="hero-location" className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                  Lokasi Lapangan
                </label>
                <input
                  id="hero-location"
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Pilih kota atau area..."
                  className="w-full truncate bg-transparent text-body-md font-semibold text-on-surface outline-none placeholder:text-outline"
                />
              </div>
            </div>

            <SelectMenu
              id="hero-category"
              label="Kategori"
              icon="sports_soccer"
              value={category}
              onChange={setCategory}
              className="md:col-span-3"
              options={[
                { value: '', label: 'Semua Kategori' },
                ...categories.map((item) => ({ value: item.slug, label: item.name })),
              ]}
            />

            <div className="relative flex items-center gap-2.5 rounded-xl bg-surface-container-low/80 px-3.5 py-2.5 transition-colors focus-within:bg-surface-container-lowest md:col-span-3">
              <Icon name="calendar_today" className="text-[22px] text-secondary" />
              <div className="flex w-full min-w-0 flex-col text-left">
                <label htmlFor="hero-date" className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                  Tanggal Main
                </label>
                <input
                  id="hero-date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full cursor-pointer bg-transparent text-body-md font-semibold text-on-surface outline-none [color-scheme:light]"
                />
                <span className="sr-only">{formatDateLong(date)}</span>
              </div>
            </div>

            <div className="w-full md:col-span-2">
              <button
                type="submit"
                className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-secondary text-label-lg font-bold text-on-secondary shadow-md transition-all hover:bg-primary-container active:scale-[0.98]"
              >
                <Icon name="search" className="text-[20px]" />
                Cari
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-body-sm text-on-surface-variant sm:gap-x-6">
          {quickStats.map((stat, index) => (
            <Fragment key={stat.label}>
              {index > 0 && <span className="hidden opacity-30 sm:inline">&bull;</span>}
              <span className="flex items-center gap-1.5">
                <Icon name={stat.icon} className="text-[16px] text-secondary" />
                {stat.label}
              </span>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
