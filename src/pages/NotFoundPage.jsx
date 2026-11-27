import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { buttonPrimary } from '../lib/ui'

export default function NotFoundPage() {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-16 text-center lg:px-6">
      <p className="font-display text-6xl font-black tracking-tight text-secondary">404</p>
      <h1 className="mt-2 font-display text-headline-lg font-semibold text-on-surface">Halaman tidak ditemukan</h1>
      <p className="mt-1 text-body-md text-on-surface-variant">
        Tautan yang Anda buka mungkin sudah dipindahkan atau tidak tersedia.
      </p>
      <Link to="/" className={`${buttonPrimary} mt-6`}>
        <Icon name="home" className="text-[18px]" />
        Kembali ke beranda
      </Link>
    </main>
  )
}
