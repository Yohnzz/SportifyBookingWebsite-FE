import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fieldsApi, getErrorMessage } from '../api'
import Icon from '../components/ui/Icon'
import PenyewaSidebar from '../components/ui/PenyewaSidebar'
import { useAuth } from '../hooks/useAuth'
import {
  categoryIcon,
  facilityIcon,
  fieldFallbackImage,
  fieldImage,
  formatRupiah,
  lowestPrice,
} from '../lib/format'

// Katalog Lapangan (penyewa) sesuai desain. Semua data dari backend
// (`GET /fields`, `GET /categories`); tidak ada dummy. Fitur yang tidak ada di
// backend (rating, ketersediaan slot, wilayah Malang, modal booking) TIDAK
// ditampilkan/dibuat.
export default function KatalogLapanganPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [fields, setFields] = useState([])
  const [total, setTotal] = useState(0)

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [sort, setSort] = useState('latest')

  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // kategori dari backend
  useEffect(() => {
    let isMounted = true

    fieldsApi
      .categories()
      .then((response) => {
        if (isMounted) setCategories(response.data ?? [])
      })
      .catch(() => {
        if (isMounted) setCategories([])
      })

    return () => {
      isMounted = false
    }
  }, [])

  // daftar lapangan dari backend
  const fetchFields = useCallback(async () => {
    // jangan kosongkan data; skeleton hanya kalau belum ada apa pun
    setStatus((previous) => (previous === 'ready' ? 'ready' : 'loading'))
    setError(null)

    try {
      const params = { per_page: 50, sort }

      if (activeCategory) params.category = activeCategory
      if (search.trim()) params.search = search.trim()
      if (locationFilter.trim()) params.location = locationFilter.trim()

      const response = await fieldsApi.list(params)
      const list = response.data ?? []

      setFields(list)
      setTotal(response.meta?.total ?? list.length)
      setStatus('ready')
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Gagal memuat katalog lapangan.'))
      setStatus('error')
    }
  }, [activeCategory, locationFilter, search, sort])

  useEffect(() => {
    fetchFields()
  }, [fetchFields])

  // rentang tarif & penyortiran sisi klien (backend hanya `latest/name_asc/name_desc`)
  const sortedFields = useMemo(() => {
    const list = [...fields]

    if (sort === 'price_asc') {
      list.sort((a, b) => (lowestPrice(a) ?? Infinity) - (lowestPrice(b) ?? Infinity))
    } else if (sort === 'name_asc') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }

    return list
  }, [fields, sort])

  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  const totalVenues = categories.reduce((sum, category) => sum + (category.fields_count ?? category.fields?.length ?? 0), 0) || total

  return (
    <div className="min-h-screen bg-surface">
      <PenyewaSidebar
        user={user}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="lg:pl-64">
        {/* header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-outline-variant/40 bg-white/90 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <button type="button" onClick={() => setIsSidebarOpen(true)} className="grid h-9 w-9 place-items-center rounded-lg text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface lg:hidden" aria-label="Buka menu">
              <Icon name="menu" className="text-[20px]" />
            </button>
            <div className="flex min-w-0 items-center gap-1.5 text-label-md text-on-surface-variant">
              <Link to="/dashboard" className="cursor-pointer font-bold text-primary hover:text-primary">GOR</Link>
              <Icon name="chevron_right" className="text-[14px]" />
              <span className="truncate font-semibold text-on-surface">Katalog Lapangan</span>
            </div>
          </div>
        </header>

        <main className="min-h-screen w-full bg-surface pt-4">
          <div className="flex w-full flex-col">
            {/* Hero banner */}
            <section className="px-4 pb-0 pt-4 sm:px-6 lg:px-8">
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-outline-variant/40">
                <div className="grid grid-cols-12 items-stretch">
                  <div className="z-10 col-span-12 flex flex-col justify-between p-5 sm:p-6 lg:col-span-7 lg:p-8">
                    <div>
                      <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-label-md text-secondary">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" /> Katalog Lapangan Resmi
                      </span>
                      <h1 className="mb-2 font-display text-headline-xl font-bold leading-tight tracking-tight text-primary">
                        Temukan &amp; Sewa Gelanggang Olahraga
                      </h1>
                      <p className="mb-4 max-w-xl text-body-lg text-on-surface-variant">
                        Satu portal terintegrasi untuk reservasi lapangan Futsal, Mini Soccer, Badminton, Tennis, Padel, dan Voli tanpa perantara.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface-container-low/60 p-4 sm:grid-cols-4">
                      <Chip icon="stadium" value={totalVenues || fields.length} label="Gelanggang" />
                      <Chip icon="sports" value={categories.length} label="Kategori" />
                      <Chip icon="verified" value="Aktif" label="Status" />
                      <Chip icon="schedule" value="Real-time" label="Ketersediaan" />
                    </div>
                  </div>

                  {/* visual */}
                  <div className="relative col-span-12 min-h-[220px] lg:col-span-5 lg:min-h-full">
                    <img
                      src="/images/field-mini-soccer.jpg"
                      alt="Lapangan olahraga indoor modern"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
                  </div>
                </div>
              </div>
            </section>

            {/* Filter & search */}
            <section className="px-4 pb-0 pt-5 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-outline-variant/40 sm:p-5">
                <div className="flex flex-col items-center gap-3 md:flex-row">
                  <div className="relative w-full flex-1">
                    <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-[22px] text-on-surface-variant" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') setSearch(searchInput)
                      }}
                      placeholder="Cari nama gelanggang, jenis olahraga, atau area..."
                      className="w-full rounded-lg bg-surface-container-low py-3 pl-12 pr-4 text-body-md text-on-surface placeholder:text-on-surface-variant/70 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setSearch(searchInput)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-3 text-label-lg text-on-secondary shadow-xs transition-colors hover:bg-primary-container md:w-auto"
                  >
                    <Icon name="tune" className="text-[20px]" />
                    Terapkan Filter
                  </button>
                </div>

                {/* category pills */}
                <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1">
                  <FilterPill
                    active={activeCategory === ''}
                    onClick={() => setActiveCategory('')}
                    icon="sports"
                    label="Semua Olahraga"
                    count={totalVenues || fields.length}
                    activeClass="bg-secondary text-on-secondary"
                  />
                  {categories.map((category) => (
                    <FilterPill
                      key={category.id ?? category.slug}
                      active={activeCategory === category.slug}
                      onClick={() => setActiveCategory(activeCategory === category.slug ? '' : category.slug)}
                      icon={categoryIcon(category.slug)}
                      label={category.name}
                      count={category.fields_count ?? category.fields?.length}
                      activeClass="bg-secondary text-on-secondary"
                    />
                  ))}
                </div>

                {/* quick filters */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-container-high pt-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={locationFilter}
                      onChange={(event) => setLocationFilter(event.target.value)}
                      className="cursor-pointer rounded-lg bg-surface-container-low px-3 py-2 text-body-sm text-on-surface outline-none transition-colors hover:bg-surface-container-high"
                    >
                      <option value="">Semua Wilayah</option>
                      {uniqueLocations(fields).map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>

                    <select
                      value={sort}
                      onChange={(event) => setSort(event.target.value)}
                      className="cursor-pointer rounded-lg bg-surface-container-low px-3 py-2 text-label-md text-on-surface outline-none transition-colors hover:bg-surface-container-high"
                    >
                      <option value="latest">Terbaru</option>
                      <option value="name_asc">Nama A–Z</option>
                      <option value="price_asc">Harga Termurah</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('')
                      setSearch('')
                      setActiveCategory('')
                      setLocationFilter('')
                      setSort('latest')
                    }}
                    className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-error"
                    title="Reset Semua Filter"
                  >
                    <Icon name="restart_alt" className="text-[20px]" />
                  </button>
                </div>
              </div>
            </section>

            {/* title + counter */}
            <section className="flex items-center justify-between px-4 pb-2 pt-5 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-headline-md font-bold text-on-surface">Katalog Lapangan</h2>
                <span className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-label-md font-bold text-primary">
                  {status === 'ready' ? `${sortedFields.length} Lapangan` : '…'}
                </span>
              </div>
              <span className="hidden items-center gap-1.5 text-label-sm text-on-surface-variant sm:inline-flex">
                <span className="h-2 w-2 rounded-full bg-secondary" /> Data dari server
              </span>
            </section>

            {/* grid */}
            <section className="px-4 pt-0 pb-8 sm:px-6 lg:px-8">
              {status === 'loading' && sortedFields.length === 0 ? (
                <GridSkeleton />
              ) : status === 'error' ? (
                <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-outline-variant/40">
                  <Icon name="error" className="text-[40px] text-error" />
                  <p className="mt-2 text-body-md text-on-surface-variant">{error}</p>
                  <button type="button" onClick={fetchFields} className="mt-4 rounded-xl bg-secondary px-5 py-2.5 text-label-lg font-semibold text-on-secondary hover:bg-primary-container">Coba lagi</button>
                </div>
              ) : sortedFields.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {sortedFields.map((field) => (
                    <FieldCard key={field.id} field={field} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-outline-variant/40">
                  <Icon name="search_off" className="text-[40px] text-outline" />
                  <p className="mt-2 text-body-md text-on-surface-variant">Tidak ada lapangan yang cocok dengan filter.</p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

function Chip({ icon, value, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-secondary shadow-xs">
        <Icon name={icon} className="text-[18px]" />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-display text-headline-sm font-bold text-primary">{value}</span>
        <span className="truncate text-label-sm text-on-surface-variant">{label}</span>
      </div>
    </div>
  )
}

function FilterPill({ active, onClick, icon, label, count, activeClass }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-label-md transition-all ${
        active ? `${activeClass} shadow-xs` : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
      }`}
    >
      <Icon name={icon} className="text-[18px]" />
      <span>{label}</span>
      {count !== undefined && count !== null && (
        <span className={`rounded-full px-1.5 py-0.5 text-label-sm ${active ? 'bg-white/20' : 'bg-surface-container-high'}`}>{count}</span>
      )}
    </button>
  )
}

function FieldCard({ field }) {
  const price = lowestPrice(field)
  const facilities = field.facilities ?? []

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-outline-variant/50 transition-all hover:shadow-md">
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-surface-container">
          <img
            src={fieldImage(field)}
            alt={field.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(event) => {
              if (event.currentTarget.dataset.fallback === 'true') return
              event.currentTarget.dataset.fallback = 'true'
              event.currentTarget.src = fieldFallbackImage(field)
            }}
          />
          <div className="absolute left-3 top-3 flex items-center gap-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-label-sm text-on-primary backdrop-blur-sm">
              <Icon name={categoryIcon(field.category?.slug)} className="text-[14px]" /> {field.category?.name ?? 'Lapangan'}
            </span>
          </div>
          {field.status === 'active' && (
            <div className="absolute right-3 top-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-2.5 py-1 text-label-sm font-semibold text-on-secondary-container shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> Terverifikasi
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 p-4 sm:p-5">
          <div>
            <h3 className="font-display text-headline-sm font-bold text-on-surface">{field.name}</h3>
            <div className="mt-0.5 flex items-center gap-1 text-body-sm text-on-surface-variant">
              <Icon name="location_on" className="text-[16px] text-secondary" />
              <span className="truncate">{field.location ?? field.address ?? '-'}</span>
            </div>
          </div>

          {facilities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {facilities.slice(0, 4).map((facility) => (
                <span key={facility} className="inline-flex items-center gap-1 rounded bg-surface-container-low px-2 py-0.5 text-label-sm text-on-surface-variant">
                  <Icon name={facilityIcon(facility)} className="text-[13px] text-secondary" /> {facility.split(' / ')[0].split(' & ')[0]}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-surface-container-high px-4 py-4 sm:px-5">
        <div>
          <span className="mb-0.5 block text-body-sm text-on-surface-variant">Mulai dari</span>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-headline-md font-bold leading-tight text-secondary">
              {price ? formatRupiah(price) : 'Hubungi venue'}
            </span>
            {price && <span className="text-body-sm text-on-surface-variant">/jam</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={field.slug ? `/lapangan/${field.slug}` : '#'}
            className="grid h-9 w-9 place-items-center rounded-lg bg-surface-container-low text-on-surface transition-colors hover:bg-surface-container-high"
            title="Lihat Detail"
          >
            <Icon name="info" className="text-[20px]" />
          </Link>
          <Link
            to={field.slug ? `/lapangan/${field.slug}` : '#'}
            className="rounded-lg bg-secondary px-3 py-2 text-label-md text-on-secondary shadow-xs transition-colors hover:bg-primary-container"
          >
            Booking
          </Link>
        </div>
      </div>
    </article>
  )
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <div key={index} className="h-72 animate-pulse rounded-2xl bg-surface-container" />
      ))}
    </div>
  )
}

function uniqueLocations(fields) {
  return [...new Set(fields.map((field) => field.location).filter(Boolean))]
}
