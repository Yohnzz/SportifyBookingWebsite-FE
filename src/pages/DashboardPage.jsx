import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getErrorMessage, ticketsApi, userDashboardApi } from '../api'
import Icon from '../components/ui/Icon'
import PenyewaSidebar from '../components/ui/PenyewaSidebar'
import { useAuth } from '../hooks/useAuth'
import {
  categoryIcon,
  facilityIcon,
  fieldFallbackImage,
  fieldImage,
  formatDuration,
  formatRupiah,
  initials,
} from '../lib/format'
import { cardClass } from '../lib/ui'

// Pemetaan status BookingStatus backend → token status DESIGN.md.
const bookingStatusMeta = {
  pending_payment: { label: 'Menunggu Pembayaran', icon: 'pending', tone: 'amber', key: 'menunggu_pembayaran' },
  paid: { label: 'Berhasil', icon: 'check_circle', tone: 'emerald', key: 'berhasil' },
  confirmed: { label: 'Berhasil', icon: 'check_circle', tone: 'emerald', key: 'berhasil' },
  completed: { label: 'Selesai', icon: 'task_alt', tone: 'forest', key: 'selesai' },
  cancelled: { label: 'Dibatalkan', icon: 'cancel', tone: 'red', key: 'dibatalkan' },
  expired: { label: 'Dibatalkan', icon: 'cancel', tone: 'red', key: 'dibatalkan' },
  refund_pending: { label: 'Menunggu Refund', icon: 'pending', tone: 'amber', key: 'menunggu_pembayaran' },
  refunded: { label: 'Dikembalikan', icon: 'undo', tone: 'red', key: 'dibatalkan' },
}

const toneClass = {
  amber: 'bg-[#FEF3C7] text-[#B45309]',
  emerald: 'bg-[#DCFCE7] text-[#15803D]',
  forest: 'bg-[#E2E8F0] text-[#14532D]',
  red: 'bg-[#FEE2E2] text-[#B91C1C]',
}

const historyStatusLabel = {
  pending_payment: 'Menunggu Bayar',
  paid: 'Lunas',
  confirmed: 'Lunas',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
  expired: 'Dibatalkan',
  refund_pending: 'Menunggu Refund',
  refunded: 'Dikembalikan',
}

const filterOptions = ['Semua Status', 'Lunas / Terjadwal', 'Selesai Dimainkan', 'Menunggu Bayar']

function bookingStatus(status) {
  return bookingStatusMeta[status] ?? { label: status ?? '-', icon: 'info', tone: 'forest', key: 'selesai' }
}

function formatBookingDay(dateString) {
  if (!dateString) {
    return '-'
  }

  const value = new Date(`${dateString}T00:00:00`)

  if (Number.isNaN(value.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }).format(value)
}

function formatShortDate(dateString) {
  if (!dateString) {
    return '-'
  }

  const value = new Date(`${dateString}T00:00:00`)

  if (Number.isNaN(value.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(value)
}

function countdownLabel(dateString, startTime) {
  if (!dateString) {
    return null
  }

  const target = new Date(`${dateString}T${startTime ?? '00:00'}:00`)

  if (Number.isNaN(target.getTime())) {
    return null
  }

  const diffMs = target.getTime() - Date.now()

  if (diffMs <= 0) {
    return 'Sedang berlangsung / selesai'
  }

  const totalMinutes = Math.floor(diffMs / 60000)
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60
  const parts = []

  if (days > 0) parts.push(`${days} Hari`)
  if (hours > 0) parts.push(`${hours} Jam`)
  if (minutes > 0 && days === 0) parts.push(`${minutes} Menit`)

  return `${parts.join(' ') || 'Kurang dari 1 menit'} Lagi`
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [summary, setSummary] = useState(null)
  const [activeBookings, setActiveBookings] = useState([])
  const [recentBookings, setRecentBookings] = useState([])
  const [recommendedFields, setRecommendedFields] = useState([])
  const [qrData, setQrData] = useState(null)
  const [filter, setFilter] = useState('Semua Status')

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Keluar Akun: bersihkan sesi lalu ke landing page (guest).
  async function handleLogout() {
    // bersihkan sesi, lalu ke landing page (guest); jangan menyisakan /dashboard terproteksi.
    await logout()
    navigate('/', { replace: true })
  }
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  const role = user?.roles?.[0] ?? 'penyewa'

  const load = useCallback(async () => {
    setStatus('loading')
    setError(null)

    try {
      const [summaryResponse, activeResponse, recentResponse, recommendedResponse] = await Promise.all([
        userDashboardApi.summary(),
        userDashboardApi.activeBookings(),
        userDashboardApi.recentBookings(),
        userDashboardApi.recommendedFields(),
      ])

      setSummary(summaryResponse.data ?? null)
      setActiveBookings(activeResponse.data ?? [])
      setRecentBookings(recentResponse.data ?? [])
      setRecommendedFields(recommendedResponse.data ?? [])

      const firstActive = (activeResponse.data ?? [])[0] ?? (recentResponse.data ?? []).find((b) => b.ticket)

      if (firstActive?.ticket?.id) {
        try {
          const qrResponse = await ticketsApi.qr(firstActive.ticket.id)
          setQrData(qrResponse.data ?? null)
        } catch {
          setQrData(null)
        }
      }

      setStatus('ready')
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Gagal memuat dashboard penyewa.'))
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (status === 'loading') {
    return <DashboardSkeleton />
  }

  if (status === 'error') {
    return (
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-10 lg:px-6">
        <div className={`${cardClass} p-6 text-center`}>
          <Icon name="error" className="text-[40px] text-error" />
          <h1 className="mt-2 font-display text-headline-lg font-bold text-on-surface">Dashboard tidak bisa dimuat</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">{error}</p>
          <button type="button" onClick={load} className="mt-4 rounded-xl bg-secondary px-5 py-2.5 text-label-lg font-semibold text-on-secondary hover:bg-primary-container">
            Coba lagi
          </button>
        </div>
      </main>
    )
  }

  const activeBookingCount = summary?.active_bookings ?? activeBookings.length
  const pendingCount = summary?.pending_payment_bookings ?? 0
  const completedCount = summary?.completed_bookings ?? 0

  const nextMatch = activeBookings[0] ?? null
  const nextMatchTicket = nextMatch?.ticket ?? null

  const filteredBookings = recentBookings.filter((booking) => {
    if (filter === 'Semua Status') return true
    if (filter === 'Menunggu Bayar') return booking.status === 'pending_payment'
    if (filter === 'Selesai Dimainkan') return booking.status === 'completed'
    if (filter === 'Lunas / Terjadwal') return ['paid', 'confirmed', 'completed'].includes(booking.status)
    return true
  })

  return (
    <div className="min-h-screen bg-surface">
      <PenyewaSidebar
        user={user}
        activeCount={activeBookingCount}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="lg:pl-64">
        <DashboardHeader user={user} onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-[1200px] space-y-6 px-4 py-6 lg:space-y-8 lg:px-6 lg:py-8">
      {/* Header penyewa + aksi cepat */}
      <section className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-outline-variant/40 sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-secondary-container/20 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-secondary-container/40 px-2.5 py-0.5 text-label-sm font-bold uppercase tracking-widest text-secondary">
                Selamat Datang Kembali
              </span>
              <span className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> {role}
              </span>
            </div>
            <h1 className="font-display text-headline-xl font-bold tracking-tight text-primary">
              Halo, {user?.name ?? 'Penyewa'}! <span aria-hidden="true">👋</span>
            </h1>
            <p className="max-w-xl text-body-md text-on-surface-variant">
              Siap bermain olahraga hari ini? Cek jadwal terdekat dan amankan lapangan favoritmu sebelum slot habis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-3 text-label-lg font-semibold text-on-secondary shadow-sm transition hover:bg-primary-container hover:shadow-md"
            >
              <Icon name="search" className="text-[20px]" />
              Cari Lapangan Baru
            </Link>
          </div>
        </div>
      </section>

      {/* 3 metrik */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Booking Terjadwal"
          value={activeBookingCount}
          subtitle="Akan Datang"
          icon="event_upcoming"
          iconTone="emerald"
          footer={
            nextMatch ? (
              <Link to="/dashboard" className="flex items-center justify-between gap-2 rounded-lg bg-surface-container-low p-2 transition hover:bg-surface-container">
                <div className="min-w-0 truncate">
                  <p className="truncate text-label-md font-bold text-on-surface">{nextMatch.lapangan?.name}</p>
                  <p className="text-body-sm text-on-surface-variant">{formatBookingDay(nextMatch.booking_date)} • {nextMatch.start_time}</p>
                </div>
                <Icon name="arrow_forward" className="text-[18px] text-secondary" />
              </Link>
            ) : (
              <div className="rounded-lg bg-surface-container-low p-2 text-body-sm text-on-surface-variant">Belum ada booking aktif.</div>
            )
          }
        />

        <MetricCard
          title="Menunggu Pembayaran"
          value={pendingCount}
          icon="pending"
          iconTone="amber"
          accentBar
          titleTone="amber"
          footer={
            <div className="flex items-center justify-between gap-2 text-body-sm">
              <span className="min-w-0 truncate text-on-surface-variant">Total menunggu pembayaran</span>
              {pendingCount > 0 && (
                <span className="whitespace-nowrap rounded-full bg-[#FEF3C7] px-2 py-0.5 text-label-sm font-bold text-[#B45309]">
                  {pendingCount}
                </span>
              )}
            </div>
          }
        />

        <MetricCard
          title="Total Pertandingan"
          value={completedCount}
          subtitle="Laga Selesai"
          icon="sports_score"
          iconTone="forest"
          footer={
            <div className="flex items-center justify-between text-body-sm text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-secondary" /> Riwayat selesai
              </span>
              <span className="text-label-sm font-bold text-secondary">Akun aktif</span>
            </div>
          }
        />
      </section>

      {/* Hero match ticket */}
      {nextMatch ? (
        <HeroMatchTicket booking={nextMatch} ticket={nextMatchTicket} qrData={qrData} />
      ) : (
        <section className="rounded-2xl bg-primary p-6 text-on-primary shadow-lg">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-headline-md font-bold">Belum ada pertandingan terjadwal</h2>
              <p className="mt-1 text-on-primary-container">Pilih lapangan dan amankan slot pertamamu.</p>
            </div>
            <Link to="/#lapangan" className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-label-md font-semibold text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container">
              <Icon name="sports_soccer" className="text-[18px]" /> Booking Lapangan
            </Link>
          </div>
        </section>
      )}

      {/* Riwayat booking */}
      <BookingHistory bookings={filteredBookings} filter={filter} onFilterChange={setFilter} />

      {/* Rekomendasi lapangan */}
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-headline-md font-bold text-on-surface">Rekomendasi Lapangan Favorit</h2>
            <p className="text-body-sm text-on-surface-variant">Pilihan lapangan aktif terbaru untuk kamu</p>
          </div>
          <Link to="/#lapangan" className="inline-flex items-center gap-1 rounded-lg bg-surface-container-low px-3 py-2 text-label-md font-semibold text-primary transition hover:bg-surface-container-high">
            Lihat Semua <Icon name="chevron_right" className="text-[16px]" />
          </Link>
        </div>

        {recommendedFields.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recommendedFields.slice(0, 3).map((field) => (
              <RecommendedField key={field.id} field={field} />
            ))}
          </div>
        ) : (
          <div className={`${cardClass} p-5 text-body-sm text-on-surface-variant`}>Belum ada rekomendasi lapangan.</div>
        )}
      </section>
        </main>
      </div>
    </div>
  )
}

function DashboardHeader({ user, onOpenSidebar }) {
  const role = user?.roles?.[0] ?? 'penyewa'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-outline-variant/40 bg-surface/85 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onOpenSidebar} className="grid h-9 w-9 place-items-center rounded-lg text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface lg:hidden" aria-label="Buka menu">
          <Icon name="menu" className="text-[20px]" />
        </button>
        <div className="flex items-center gap-1.5 text-label-md text-on-surface-variant">
          <span className="hidden font-semibold text-outline sm:inline">GOR</span>
          <Icon name="chevron_right" className="hidden text-[16px] text-outline sm:inline" />
          <span className="font-bold text-primary">Dashboard Penyewa</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right leading-tight sm:block">
          <p className="text-label-lg font-bold text-on-surface">{user?.name ?? 'Penyewa'}</p>
          <div className="flex items-center justify-end gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            <span className="text-label-sm font-semibold capitalize text-secondary">{role}</span>
          </div>
        </div>
        <div className="relative">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary-container text-label-md font-bold text-on-secondary-container shadow-sm ring-2 ring-surface-container-high">
            {initials(user?.name)}
          </span>
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-secondary ring-2 ring-white" />
        </div>
      </div>
    </header>
  )
}

function MetricCard({ title, value, subtitle, icon, iconTone, footer, accentBar, titleTone }) {
  const tone = iconTone === 'amber' ? 'bg-[#FEF3C7] text-[#D97706]' : iconTone === 'emerald' ? 'bg-secondary-container/50 text-secondary' : 'bg-surface-container-high text-primary'

  return (
    <div className={`relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-outline-variant/40 transition-shadow hover:shadow-md ${accentBar ? 'border-t-4 border-amber-500' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <span className={`text-label-sm font-bold uppercase tracking-wider ${titleTone === 'amber' ? 'text-[#B45309]' : 'text-outline'}`}>{title}</span>
          <div className="flex items-baseline gap-2">
            <span className={`font-display text-headline-xl font-bold ${accentBar ? 'text-amber-900' : 'text-on-surface'}`}>{value}</span>
            {subtitle && <span className="text-label-md font-semibold text-on-surface-variant">{subtitle}</span>}
          </div>
        </div>
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tone}`}>
          <Icon name={icon} className="text-[24px]" />
        </div>
      </div>
      <div className="mt-4 border-t border-surface-container-high pt-3">{footer}</div>
    </div>
  )
}

function HeroMatchTicket({ booking, ticket, qrData }) {
  const field = booking.lapangan
  const scheduleDate = formatBookingDay(booking.booking_date)
  const timeRange = `${booking.start_time} - ${booking.end_time}`
  const countdown = countdownLabel(booking.booking_date, booking.start_time)
  const facilityName = field?.address ?? field?.location ?? 'Lapangan'

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-container to-tertiary p-5 text-on-primary shadow-lg sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-secondary/15 blur-2xl" />
      <div className="pointer-events-none absolute -top-24 right-1/3 h-60 w-60 rounded-full bg-surface-tint/20 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-3 py-1 text-label-sm font-bold uppercase tracking-wider text-on-secondary-container">
              <span className="h-2 w-2 animate-ping rounded-full bg-secondary" /> Pertandingan Anda Selanjutnya
            </span>
            {ticket?.ticket_code && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-label-sm text-on-primary backdrop-blur-sm">
                Kode Tiket: {ticket.ticket_code}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="font-display text-headline-lg font-bold tracking-tight text-on-primary sm:text-headline-xl">{field?.name}</h2>
            <p className="text-headline-sm font-normal text-on-primary-container">{facilityName}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3">
            <TicketStat label="Hari & Tanggal" value={scheduleDate} icon="event" />
            <TicketStat label="Waktu Bermain" value={timeRange} icon="schedule" />
            <TicketStat label="Durasi Main" value={formatDuration(booking.duration)} icon="timer" className="col-span-2 sm:col-span-1" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary-container text-on-secondary-container">
                <Icon name="timer" className="text-[22px]" />
              </div>
              <div>
                <p className="text-label-sm uppercase tracking-wider text-on-primary-container">Hitung Mundur Main</p>
                <p className="font-display text-headline-md font-bold text-secondary-fixed">{countdown ?? 'Segera hadir'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={field?.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(field.address)}` : 'https://www.google.com/maps'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-2 text-label-md text-on-primary backdrop-blur-sm transition hover:bg-white/25"
              >
                <Icon name="near_me" className="text-[18px]" /> Rute Maps
              </a>
              {field?.slug && (
                <Link to={`/lapangan/${field.slug}`} className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-label-md text-on-secondary shadow-sm transition hover:bg-secondary-container hover:text-on-secondary-container">
                  <Icon name="info" className="text-[18px]" /> Detail Lapangan
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Digital QR Pass */}
        <div className="lg:col-span-4">
          <div className="relative flex w-full flex-col items-center overflow-hidden rounded-2xl bg-white p-5 text-center text-on-surface shadow-xl">
            <div className="mb-3 flex w-full items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-1.5">
                <span className="grid h-5 w-5 place-items-center rounded bg-primary text-[11px] font-bold text-on-primary">G</span>
                <span className="text-label-sm font-bold uppercase tracking-wider text-primary">GOR E-Pass</span>
              </div>
              <span className="inline-flex items-center gap-0.5 text-label-sm font-bold text-secondary">
                <Icon name="verified" className="text-[14px]" /> Terverifikasi
              </span>
            </div>

            <QrPass ticket={ticket} qrData={qrData} />
            <p className="mt-2 text-label-sm tracking-widest text-outline">SCAN CHECK-IN DI VENUE</p>
            <p className="mt-2 text-body-sm text-on-surface-variant">
              Tunjukkan kode/tiket kepada petugas venue untuk validasi instan.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function TicketStat({ label, value, icon, className = '' }) {
  return (
    <div className={`rounded-lg bg-white/10 p-3 backdrop-blur-md ${className}`}>
      <p className="flex items-center gap-1 text-label-sm uppercase text-on-primary-container">
        <Icon name={icon} className="text-[14px]" /> {label}
      </p>
      <p className="mt-0.5 text-label-lg font-bold text-on-primary">{value}</p>
    </div>
  )
}

// QR honest: render `qr_token` dari `GET /tickets/{id}/qr`. Tanpa library QR
// eksternal (tidak menambah dependency), kode ini bisa dipindai oleh petugas
// (`POST /petugas/check-in/validate`) atau diketik manual.
function QrPass({ ticket, qrData }) {
  const token = qrData?.qr_token ?? null
  const code = ticket?.ticket_code ?? qrData?.ticket_code ?? '-'

  return (
    <div className="w-full">
      <div className="mx-auto flex h-40 w-40 flex-col items-center justify-center gap-1 rounded-xl border border-outline-variant bg-white p-3 text-center">
        <Icon name="qr_code_2" className="text-[56px] text-primary" />
        <span className="text-[10px] font-mono text-outline">QR</span>
      </div>

      <div className="mt-3 w-full space-y-1.5 rounded-lg bg-surface-container-low p-3 text-left">
        <p className="text-label-sm text-on-surface-variant">Kode Tiket</p>
        <p className="truncate font-mono text-label-md font-bold text-on-surface">{code}</p>
        {token && (
          <>
            <p className="text-label-sm text-on-surface-variant">Token QR</p>
            <p className="break-all font-mono text-[11px] leading-tight text-on-surface-variant">{token}</p>
          </>
        )}
      </div>
    </div>
  )
}

function BookingHistory({ bookings, filter, onFilterChange }) {
  return (
    <section className={`${cardClass} space-y-4 p-4 sm:p-5`}>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-headline-md font-bold text-on-surface">Riwayat Booking Terbaru</h2>
          <p className="text-body-sm text-on-surface-variant">Lacak status pesanan, jadwal sewa, dan total biaya</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Icon name="filter_list" className="absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline" />
            <select
              value={filter}
              onChange={(event) => onFilterChange(event.target.value)}
              className="cursor-pointer rounded-lg bg-surface-container-low py-2 pl-9 pr-8 text-label-md text-on-surface outline-none"
            >
              {filterOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <Link to="/#lapangan" className="inline-flex items-center gap-1 rounded-lg bg-surface-container-low px-3 py-2 text-label-md font-bold text-primary transition hover:bg-surface-container-high">
            Lihat Semua <Icon name="chevron_right" className="text-[16px]" />
          </Link>
        </div>
      </div>

      {bookings.length > 0 ? (
        <>
          {/* Tabel desktop */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="rounded-lg bg-surface-container-low text-label-md uppercase tracking-wider text-on-surface-variant">
                  <th className="rounded-l-lg px-4 py-3">ID &amp; Tanggal Booking</th>
                  <th className="px-4 py-3">Venue &amp; Lapangan</th>
                  <th className="px-4 py-3">Jadwal Main</th>
                  <th className="px-4 py-3">Total Biaya</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="rounded-r-lg px-4 py-3 text-right">E-Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high text-body-md">
                {bookings.map((booking) => (
                  <BookingRow key={booking.id} booking={booking} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Kartu mobile/tablet */}
          <div className="space-y-3 lg:hidden">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-lg bg-surface-container-low p-5 text-center text-body-sm text-on-surface-variant">
          Belum ada riwayat booking untuk filter ini.
        </div>
      )}
    </section>
  )
}

function BookingRow({ booking }) {
  const status = bookingStatus(booking.status)

  return (
    <tr className="transition-colors hover:bg-surface-container-low/50">
      <td className="px-4 py-4">
        <span className="block text-label-md font-bold text-primary">{booking.booking_code}</span>
        <span className="text-body-sm text-on-surface-variant">{formatShortDate(booking.created_at?.slice(0, 10))}</span>
      </td>
      <td className="px-4 py-4">
        <span className="block text-label-md font-bold text-on-surface">{booking.lapangan?.name ?? '-'}</span>
        <span className="text-body-sm text-on-surface-variant">{booking.lapangan?.location ?? '-'}</span>
      </td>
      <td className="px-4 py-4">
        <span className="block text-label-md text-on-surface">{formatBookingDay(booking.booking_date)}</span>
        <span className="text-body-sm font-semibold text-secondary">{booking.start_time} - {booking.end_time} ({formatDuration(booking.duration)})</span>
      </td>
      <td className="px-4 py-4">
        <span className="font-display text-price-md font-bold text-on-surface">{formatRupiah(booking.total_amount)}</span>
        <span className="block text-label-sm text-outline">{booking.latest_payment?.payment_method ?? '-'}</span>
      </td>
      <td className="px-4 py-4"><StatusBadge status={status} raw={booking.status} /></td>
      <td className="px-4 py-4 text-right">
        <ReceiptButton booking={booking} />
      </td>
    </tr>
  )
}

function BookingCard({ booking }) {
  const status = bookingStatus(booking.status)

  return (
    <div className="rounded-xl border border-outline-variant/50 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="block truncate text-label-md font-bold text-primary">{booking.booking_code}</span>
          <span className="text-body-sm text-on-surface-variant">{formatShortDate(booking.created_at?.slice(0, 10))}</span>
        </div>
        <StatusBadge status={status} raw={booking.status} />
      </div>
      <div className="mt-3 space-y-1">
        <span className="block text-label-md font-bold text-on-surface">{booking.lapangan?.name ?? '-'}</span>
        <span className="block text-body-sm text-on-surface-variant">{booking.lapangan?.location ?? '-'}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-body-sm">
        <div className="rounded-lg bg-surface-container-low p-2">
          <p className="text-label-sm text-on-surface-variant">Jadwal</p>
          <p className="font-semibold text-on-surface">{formatShortDate(booking.booking_date)}</p>
          <p className="text-secondary">{booking.start_time} - {booking.end_time}</p>
        </div>
        <div className="rounded-lg bg-surface-container-low p-2">
          <p className="text-label-sm text-on-surface-variant">Total</p>
          <p className="font-display font-bold text-on-surface">{formatRupiah(booking.total_amount)}</p>
          <p className="text-label-sm text-outline">{formatDuration(booking.duration)}</p>
        </div>
      </div>
      <div className="mt-3 flex justify-end"><ReceiptButton booking={booking} /></div>
    </div>
  )
}

function StatusBadge({ status, raw }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-label-sm font-bold ${toneClass[status.tone]}`}>
      <Icon name={status.icon} className="text-[14px]" />
      {historyStatusLabel[raw] ?? status.label}
    </span>
  )
}

function ReceiptButton({ booking }) {
  // Backend penyewa tidak punya endpoint unduh e-receipt PDF; tampilkan
  // visual desain tapi jangan klaim bisa diunduh. `booking` dipertahankan.
  void booking

  return (
    <button
      type="button"
      disabled
      title="E-receipt PDF belum tersedia"
      className="inline-flex items-center gap-1 rounded-lg bg-surface-container-low p-2 text-label-sm text-primary opacity-50"
    >
      <Icon name="download" className="text-[18px]" />
      <span className="hidden sm:inline">PDF</span>
    </button>
  )
}

function RecommendedField({ field }) {
  const price = lowestFromTarif(field.tarif)

  return (
    <Link
      to={field.slug ? `/lapangan/${field.slug}` : '/#lapangan'}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-outline-variant/50 transition-all hover:shadow-md"
    >
      <div className="relative h-44 w-full overflow-hidden bg-surface-container">
        <img
          src={fieldImage(field)}
          alt={field.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(event) => {
            if (event.currentTarget.dataset.fallback === 'true') return
            event.currentTarget.dataset.fallback = 'true'
            event.currentTarget.src = fieldFallbackImage(field)
          }}
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-white/90 px-2.5 py-1 text-label-sm font-bold text-primary shadow-sm backdrop-blur-md">
          <Icon name={categoryIcon(field.category?.slug)} className="text-[14px]" /> {field.category?.name ?? 'Lapangan'}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
        <div>
          <p className="text-label-sm text-outline">{field.location ?? field.address ?? '-'}</p>
          <h3 className="font-display text-headline-sm font-bold text-on-surface">{field.name}</h3>
          {(field.facilities ?? []).length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-3 text-label-sm text-on-surface-variant">
              {field.facilities.slice(0, 3).map((facility) => (
                <span key={facility} className="inline-flex items-center gap-1">
                  <Icon name={facilityIcon(facility)} className="text-[16px] text-secondary" /> {facility.split(' / ')[0].split(' & ')[0]}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-surface-container-high pt-3">
          <div>
            <span className="text-label-sm text-outline">Mulai dari</span>
            <p className="font-display text-price-md font-bold text-primary">
              {price ? formatRupiah(price) : 'Hubungi venue'}
              {price && <span className="text-body-sm font-normal text-on-surface-variant">/jam</span>}
            </p>
          </div>
          <span className="rounded-lg bg-secondary px-3 py-2 text-label-md text-on-secondary shadow-sm transition-colors group-hover:bg-primary-container">
            Booking
          </span>
        </div>
      </div>
    </Link>
  )
}

function lowestFromTarif(tarifList = []) {
  const prices = tarifList
    .filter((tarif) => tarif.is_active !== false)
    .map((tarif) => Number(tarif.price))
    .filter((price) => Number.isFinite(price) && price > 0)

  return prices.length > 0 ? Math.min(...prices) : null
}

function DashboardSkeleton() {
  return (
    <main className="mx-auto w-full max-w-[1200px] space-y-6 px-4 py-6 lg:space-y-8 lg:px-6 lg:py-8">
      <div className="h-32 animate-pulse rounded-2xl bg-surface-container" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="h-32 animate-pulse rounded-2xl bg-surface-container" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-surface-container" />
      <div className="h-64 animate-pulse rounded-2xl bg-surface-container" />
    </main>
  )
}
