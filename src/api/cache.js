/**
 * Cache GET API ringan (local sementara). Tidak menambah dependency.
 * - hanya response `response.data` GET yang di-cache; mutasi (POST/PUT/PATCH/DELETE) tidak.
 * - TTL default 60s; `cachedGet(..., ttlMs)`.
 * - memory + localStorage; `clearApiCache()` (logout / 401 / setelah mutasi).
 * - key = url + params terurut.
 * - BUKAN jaminan data selalu segar; `Ctrl+R` / TTL / clear on logout.
 */
const STORAGE_KEY = 'gor.api-cache.v1'
const DEFAULT_TTL_MS = 60_000

const memoryCache = new Map()

function getStorage() {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null
  } catch {
    return null
  }
}

function readPersisted() {
  try {
    const raw = getStorage()?.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writePersisted(store) {
  try {
    getStorage()?.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // quota / private mode: abaikan, memory tetap
  }
}

function normalizeParams(params) {
  if (!params) {
    return ''
  }

  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b))

  return JSON.stringify(entries)
}

function makeKey(url, params) {
  return `${url}?${normalizeParams(params)}`
}

export function getCached(key) {
  const now = Date.now()
  const fromMemory = memoryCache.get(key)

  if (fromMemory && fromMemory.expires > now) {
    return { hit: true, value: fromMemory.value }
  }

  const store = readPersisted()
  const fromDisk = store[key]

  if (fromDisk && fromDisk.expires > now) {
    memoryCache.set(key, fromDisk)
    return { hit: true, value: fromDisk.value }
  }

  return { hit: false, value: null }
}

export function setCached(key, value, ttlMs = DEFAULT_TTL_MS) {
  const entry = { value, expires: Date.now() + ttlMs }

  memoryCache.set(key, entry)

  const store = readPersisted()
  store[key] = entry
  writePersisted(store)
}

export function clearApiCache() {
  memoryCache.clear()

  try {
    getStorage()?.removeItem(STORAGE_KEY)
  } catch {
    // abaikan
  }
}

/**
 * GET ter-cache. `api` = instance axios. Kembalikan `response.data`.
 */
export async function cachedGet(api, url, { params, ttlMs = DEFAULT_TTL_MS } = {}) {
  const key = makeKey(url, params)
  const cached = getCached(key)

  if (cached.hit) {
    return cached.value
  }

  const response = await api.get(url, { params })
  const value = response.data

  setCached(key, value, ttlMs)

  return value
}
