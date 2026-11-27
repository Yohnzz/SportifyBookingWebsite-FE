import { useEffect, useState } from 'react'
import { fieldsApi, getErrorMessage, healthApi, storageUrl } from '../api'
import { alertClass, cardClass } from '../lib/ui'

const statusStyles = {
  loading: 'border-slate-200 bg-white text-slate-500',
  ok: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-red-700',
}

export default function HomePage() {
  const [health, setHealth] = useState({ state: 'loading', message: 'Menghubungi backend...' })
  const [fields, setFields] = useState([])
  const [fieldsError, setFieldsError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const response = await healthApi.ping()

        if (isMounted) {
          setHealth({ state: 'ok', message: response.data.status })
        }
      } catch (error) {
        if (isMounted) {
          setHealth({ state: 'error', message: getErrorMessage(error) })
        }
      }

      try {
        const response = await fieldsApi.list({ per_page: 6 })

        if (isMounted) {
          setFields(response.data ?? [])
        }
      } catch (error) {
        if (isMounted) {
          setFieldsError(getErrorMessage(error))
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <section className={`${cardClass} p-7`}>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Frontend React siap terhubung ke backend Laravel
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          Request API memakai axios dengan base URL{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">
            {import.meta.env.VITE_API_BASE_URL}
          </code>{' '}
          dan token Sanctum disimpan di <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">localStorage</code>.
        </p>

        <div className={`mt-5 rounded-lg border px-4 py-2.5 text-sm ${statusStyles[health.state]}`}>
          <span className="font-semibold">Status backend:</span> {health.message}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">Katalog lapangan</h2>
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Publik</span>
        </div>

        {fieldsError && <p className={`${alertClass} mt-4`}>{fieldsError}</p>}

        {!fieldsError && fields.length === 0 && (
          <p className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
            Belum ada lapangan aktif di database.
          </p>
        )}

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => (
            <article
              key={field.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {field.primary_image ? (
                <img src={storageUrl(field.primary_image)} alt={field.name} className="h-40 w-full object-cover" />
              ) : (
                <div className="flex h-40 items-center justify-center bg-slate-100 text-sm text-slate-400">
                  Tanpa gambar
                </div>
              )}

              <div className="space-y-1 p-4">
                <h3 className="font-semibold text-slate-900">{field.name}</h3>
                <p className="text-sm text-slate-500">
                  {field.category?.name ?? 'Tanpa kategori'} &middot; {field.location ?? '-'}
                </p>
                <p className="text-sm text-slate-500">
                  Buka {field.opening_time} &ndash; {field.closing_time}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
