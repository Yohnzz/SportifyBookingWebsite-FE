import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { buttonGhost, buttonPrimary } from '../lib/ui'

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-6 py-3">
        <Link to="/" className="text-lg font-extrabold tracking-[0.18em] text-emerald-700">
          SPORTIFY
        </Link>

        <nav className="flex flex-1 items-center gap-5">
          <NavLink to="/" end className={navLinkClass}>
            Beranda
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3 text-sm text-slate-500">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline">{user?.name}</span>
              <button type="button" className={buttonGhost} onClick={logout}>
                Keluar
              </button>
            </>
          ) : (
            <Link to="/login" className={buttonPrimary}>
              Masuk
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
