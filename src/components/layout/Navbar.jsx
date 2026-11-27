import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { initials } from '../../lib/format'
import { buttonDanger, buttonPrimary } from '../../lib/ui'
import Icon from '../ui/Icon'

// Header landing: transparan, tanpa navigasi (Beranda/Lapangan/Tentang
// Kami/Bantuan) dan tanpa ikon notifikasi. Hanya logo + aksi akun.
export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const { pathname } = useLocation()
  const isLanding = pathname === '/'
  const role = user?.roles?.[0] ?? 'penyewa'

  return (
    <header
      className={`sticky top-0 z-40 ${
        isLanding
          ? 'border-0 bg-transparent'
          : 'border-b border-outline-variant/40 bg-white/95 backdrop-blur'
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-3 px-4 lg:px-6">
        <Link to="/" className="flex shrink-0 items-center" aria-label="GOR - Beranda">
          <img src="/images/gor-logo.png" alt="GOR Eco Sports" className="h-10 w-auto lg:h-11" />
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition hover:bg-surface-container-low"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary-container text-label-md font-bold text-on-secondary-container">
                  {initials(user?.name)}
                </span>
                <span className="hidden text-left leading-tight sm:block">
                  <span className="block max-w-[140px] truncate text-label-lg font-semibold text-on-surface">
                    {user?.name}
                  </span>
                  <span className="block text-label-sm uppercase capitalize tracking-wide text-on-surface-variant">
                    {role}
                  </span>
                </span>
              </Link>

              <button type="button" onClick={logout} className={buttonDanger}>
                <Icon name="logout" className="text-[18px]" />
                Keluar
              </button>
            </>
          ) : (
            <Link to="/login" className={buttonPrimary}>
              <Icon name="login" className="text-[18px]" />
              Masuk
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
