import { Link, NavLink } from 'react-router-dom'
import Icon from './Icon'
import { initials } from '../../lib/format'

// Sidebar penyewa sesuai desain stitch_sportify_ui_design_system (2).
// Sementara hanya Dashboard yang ditampilkan & aktif (hijau); menu lain belum
// dibuatkan desain, akan ditambahkan satu per satu. (Yang belum ada halaman
// targetnya memakai `#` / no-op sampai disambungkan.)
const menuItems = [{ label: 'Dashboard', to: '/dashboard', icon: 'space_dashboard', end: true }]

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
    isActive
      ? 'bg-primary-container font-semibold text-on-primary shadow-sm'
      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
  }`

export default function PenyewaSidebar({
  user,
  activeCount = 0,
  onLogout,
  isOpen = false,
  onClose,
  className = '',
}) {
  const role = user?.roles?.[0] ?? 'penyewa'

  return (
    <>
      {/* Backdrop mobile */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={onClose} aria-hidden="true" />}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 select-none flex-col justify-between bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${className}`}
      >
        <div className="flex flex-col">
          {/* Brand */}
          <div className="flex h-16 items-center justify-between px-4">
            <Link to="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
              <img src="/images/gor-logo.png" alt="GOR Eco Sports" className="h-8 w-auto" />
              <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">Booking Hub</span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface lg:hidden"
              aria-label="Tutup menu"
            >
              <Icon name="close" className="text-[20px]" />
            </button>
          </div>

          {/* Menu utama */}
          <div className="px-3 pt-1">
            <p className="px-2 py-1 text-label-sm font-semibold uppercase tracking-wider text-outline">Menu Utama</p>
          </div>
          <nav className="flex flex-col gap-1 px-3">
            {menuItems.map((item) => (
              <NavLink key={item.label} to={item.to} end={item.end} onClick={onClose} className={navLinkClass}>
                <span className="flex min-w-0 flex-1 items-center gap-3">
                  <Icon name={item.icon} className="text-[20px]" />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.badgeKey === 'active' && activeCount > 0 && (
                  <span className="rounded-full bg-secondary-container px-2 py-0.5 text-label-sm font-bold text-on-secondary-container">
                    {activeCount} Aktif
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Profil + keluar */}
        <div className="flex flex-col gap-2.5 border-t border-surface-container-high bg-white p-3 shadow-[0_-1px_6px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 rounded-xl bg-surface-container-low p-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary-container text-label-md font-bold text-on-secondary-container shadow-sm ring-1 ring-outline-variant">
              {initials(user?.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-label-md font-bold leading-tight text-on-surface">{user?.name ?? 'Penyewa'}</p>
              <p className="truncate text-[11px] font-semibold capitalize text-secondary">{role}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-label-md text-error transition hover:bg-error-container hover:text-on-error-container"
          >
            <span className="flex items-center gap-3">
              <Icon name="logout" className="text-[18px]" />
              Keluar Akun
            </span>
            <Icon name="chevron_right" className="text-[16px]" />
          </button>
        </div>
      </aside>
    </>
  )
}
