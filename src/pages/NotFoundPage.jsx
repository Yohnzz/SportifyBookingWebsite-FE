import { Link } from 'react-router-dom'
import { buttonPrimary } from '../lib/ui'

export default function NotFoundPage() {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 py-16 text-center">
      <p className="text-6xl font-black tracking-tight text-emerald-600">404</p>
      <h1 className="mt-2 text-xl font-semibold text-slate-900">Halaman tidak ditemukan</h1>
      <Link to="/" className={`${buttonPrimary} mt-6`}>
        Kembali ke beranda
      </Link>
    </main>
  )
}
