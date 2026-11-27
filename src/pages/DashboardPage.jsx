import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { useAuth } from '../hooks/useAuth'
import { initials } from '../lib/format'
import { buttonDanger, cardClass } from '../lib/ui'

const detailItems = [
  ['Username', (user) => user?.username],
  ['Email', (user) => user?.email],
  ['Telepon', (user) => user?.phone],
  ['Role', (user) => user?.roles?.join(', ')],
]

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-10 lg:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-headline-lg font-bold text-on-surface">Dashboard</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Halaman ini hanya bisa dibuka setelah login (token dikirim lewat header Bearer).
          </p>
        </div>
        <button type="button" onClick={logout} className={buttonDanger}>
          <Icon name="logout" className="text-[18px]" />
          Keluar
        </button>
      </div>

      <section className={`${cardClass} mt-6 p-6`}>
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-secondary-container text-headline-sm font-bold text-on-secondary-container">
            {initials(user?.name)}
          </span>
          <div>
            <h2 className="font-display text-headline-md font-semibold text-on-surface">{user?.name}</h2>
            <p className="text-body-sm text-on-surface-variant">Akun aktif di GOR Eco Sports</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {detailItems.map(([label, getValue]) => (
            <div key={label} className="rounded-xl bg-surface-container-low px-4 py-3">
              <dt className="text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">{label}</dt>
              <dd
                className={`mt-1 text-body-md font-semibold text-on-surface ${label === 'Role' ? 'capitalize' : ''}`}
              >
                {getValue(user) || '-'}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { icon: 'event_available', title: 'Booking Saya', description: 'Lihat jadwal dan status booking aktif.' },
          { icon: 'confirmation_number', title: 'Tiket Digital', description: 'Akses QR code untuk check-in venue.' },
          { icon: 'history', title: 'Riwayat', description: 'Tinjau kembali transaksi dan kunjungan Anda.' },
        ].map((item) => (
          <Link
            key={item.title}
            to="/#lapangan"
            className={`${cardClass} group p-5 transition hover:shadow-md`}
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary-container text-on-secondary-container">
              <Icon name={item.icon} className="text-[22px]" />
            </span>
            <h3 className="mt-3 font-display text-headline-sm font-semibold text-on-surface group-hover:text-secondary">
              {item.title}
            </h3>
            <p className="mt-1 text-body-sm text-on-surface-variant">{item.description}</p>
          </Link>
        ))}
      </section>
    </main>
  )
}
