import { useAuth } from '../hooks/useAuth'
import { cardClass } from '../lib/ui'

const detailItems = [
  ['Username', (user) => user?.username],
  ['Email', (user) => user?.email],
  ['Telepon', (user) => user?.phone],
  ['Role', (user) => user?.roles?.join(', ')],
]

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Halaman ini hanya bisa dibuka setelah login (token dikirim lewat header Bearer).
      </p>

      <section className={`${cardClass} mt-6 p-6`}>
        <h2 className="text-lg font-semibold text-slate-900">{user?.name}</h2>

        <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {detailItems.map(([label, getValue]) => (
            <div key={label}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900">{getValue(user) || '-'}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  )
}
