import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { authApi, tokenStorage } from '../api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isBootstrapping, setIsBootstrapping] = useState(() => Boolean(tokenStorage.get()))

  const refreshUser = useCallback(async () => {
    if (!tokenStorage.get()) {
      setUser(null)

      return null
    }

    const response = await authApi.me()
    setUser(response.data)

    return response.data
  }, [])

  useEffect(() => {
    let isMounted = true

    async function bootstrap() {
      if (!tokenStorage.get()) {
        setIsBootstrapping(false)

        return
      }

      try {
        const response = await authApi.me()

        if (isMounted) {
          setUser(response.data)
        }
      } catch {
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false)
        }
      }
    }

    bootstrap()

    const handleUnauthorized = () => setUser(null)
    window.addEventListener('sportify:unauthorized', handleUnauthorized)

    return () => {
      isMounted = false
      window.removeEventListener('sportify:unauthorized', handleUnauthorized)
    }
  }, [])

  const login = useCallback(async (credentials, { remember = true } = {}) => {
    const response = await authApi.login(credentials)
    tokenStorage.set(response.data.token, remember)
    setUser(response.data.user)

    return response.data.user
  }, [])

  const register = useCallback(async (payload) => {
    const response = await authApi.register(payload)
    tokenStorage.set(response.data.token)
    setUser(response.data.user)

    return response.data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // Abaikan kegagalan revoke token; sesi lokal tetap dibersihkan.
    }

    tokenStorage.clear()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isBootstrapping, login, register, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
