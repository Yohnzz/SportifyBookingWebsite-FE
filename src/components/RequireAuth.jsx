import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RequireAuth() {
  const { isAuthenticated, isBootstrapping } = useAuth()
  const location = useLocation()

  if (isBootstrapping) {
    return (
      <p className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-10 text-body-md text-on-surface-variant lg:px-6">
        Memeriksa sesi...
      </p>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
