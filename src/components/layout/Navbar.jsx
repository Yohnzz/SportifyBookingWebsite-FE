import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { initials } from '../../lib/format'
import { buttonDanger, buttonPrimary } from '../../lib/ui'
import Icon from '../ui/Icon'

const navItems = [
  { label: 'Beranda', to: '/', end: true },
  { label: 'Lapangan', to: '/#lapangan' },
  { label: 'Tentang Kami', to: '/#keunggulan' },
  { label: 'Bantuan', to: '/#bantuan' },
]

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname, location.hash])

  const role = user?.roles?.[0] ?? 'Penyewa'

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant/40 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-3 px-4 lg:px-6">
        <Link to="/" className="flex shrink-0 items-center" aria-label="GOR - Beranda">
          <img src="/images/gor-logo.png" alt="GOR Eco Sports" className="h-10 w-auto lg:h-11" />
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {navItems.map((item) =>
            item.end ? (
              <NavLink
                key={item.label}
                to={item.to}
                end
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-label-lg transition ${
                    isActive
                      ? 'bg-secondary text-on-secondary'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className="rounded-lg px-4 py-2 text-label-lg text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                aria-label="Notifikasi"
                className="relative grid h-10 w-10 place-items-center rounded-full text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface"
              >
                <Icon name="notifications" className="text-[22px]" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-error ring-2 ring-white" />
              </Link>

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

              <button type="button" onClick={logout} className={`hidden lg:inline-flex ${buttonDanger}`}>
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

          <button
            type="button"
            aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center rounded-lg text-on-surface transition hover:bg-surface-container-low md:hidden"
          >
            <Icon name={isMenuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="border-t border-outline-variant/40 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="rounded-lg px-3 py-2.5 text-label-lg text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface"
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button type="button" onClick={logout} className={`mt-1 w-full justify-start ${buttonDanger}`}>
                <Icon name="logout" className="text-[18px]" />
                Keluar
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
