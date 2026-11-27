import { api } from './client'
import { cachedGet } from './cache'

// GET katalog di-cache sementara (memory + localStorage, TTL) agar tidak request
// backend berulang saat kembali ke halaman. `availability`/`calendar` TIDAK
// di-cache (harus segar); mutasi tidak lewat sini.
export const fieldsApi = {
  categories: () => cachedGet(api, '/categories').then((response) => response.data),
  list: (params) => cachedGet(api, '/fields', { params }).then((response) => response.data),
  show: (slug) => cachedGet(api, `/fields/${slug}`).then((response) => response.data),
  pricing: (id) => cachedGet(api, `/fields/${id}/pricing`).then((response) => response.data),
  facilities: (id) => cachedGet(api, `/fields/${id}/facilities`).then((response) => response.data),
  // ketersediaan & kalender sengaja tanpa cache (data realtime)
  availability: (id, params) => api.get(`/fields/${id}/availability`, { params }).then((response) => response.data),
  calendar: (id, params) => api.get(`/fields/${id}/calendar`, { params }).then((response) => response.data),
}
