import axios from 'axios'

const TOKEN_KEY = 'sportify.token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

/**
 * Instance axios yang dipakai seluruh aplikasi.
 * Semua request otomatis membawa header Authorization bila token tersedia.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = tokenStorage.get()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token kedaluwarsa / dicabut: bersihkan sesi lokal.
    if (error.response?.status === 401 && tokenStorage.get()) {
      tokenStorage.clear()
      window.dispatchEvent(new Event('sportify:unauthorized'))
    }

    return Promise.reject(error)
  },
)

/**
 * Ambil pesan error yang ramah dari response API (format ApiResponse Laravel).
 */
export function getErrorMessage(error, fallback = 'Terjadi kesalahan. Silakan coba lagi.') {
  if (!error?.response) {
    if (error?.code === 'ECONNABORTED') {
      return 'Server terlalu lama merespons. Silakan coba lagi.'
    }

    return 'Tidak dapat terhubung ke server. Pastikan backend Laravel sedang berjalan.'
  }

  const payload = error.response.data

  if (payload?.errors && typeof payload.errors === 'object') {
    const firstError = Object.values(payload.errors).flat().find(Boolean)

    if (firstError) {
      return firstError
    }
  }

  return payload?.message || fallback
}

/**
 * Ubah path file dari storage backend menjadi URL yang bisa dipakai browser.
 */
export function storageUrl(path) {
  if (!path) {
    return null
  }

  if (/^https?:\/\//.test(path)) {
    return path
  }

  const base = import.meta.env.VITE_STORAGE_BASE_URL ?? 'http://localhost:8000/storage'

  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}
