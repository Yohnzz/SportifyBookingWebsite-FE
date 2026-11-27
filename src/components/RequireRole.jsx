import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * Wajib login + role. Dipakai di dalam <RequireAuth>.
 * `allowedRoles` kosong = semua role. Saat ini hanya dipakai untuk penyewa;
 * admin/petugas akan ditambahkan terpisah.
 */
export default function RequireRole({ allowedRoles = [] }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0) {
    const roles = user?.roles ?? []

    if (!allowedRoles.some((role) => roles.includes(role))) {
      return <Navigate to="/" replace />
    }
  }

  return <Outlet />
}
