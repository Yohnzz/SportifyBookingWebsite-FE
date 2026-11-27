import { api } from './client'
import { cachedGet } from './cache'

// Penyewa dashboard. `data` berisi `data` dari ApiResponse.
// GET di-cache sementara (memory + localStorage, TTL 60s); mutasi tidak.
export const userDashboardApi = {
  summary: () => cachedGet(api, '/user/dashboard/summary').then((response) => response.data),
  activeBookings: () => cachedGet(api, '/user/dashboard/active-bookings').then((response) => response.data),
  recentBookings: () => cachedGet(api, '/user/dashboard/recent-bookings').then((response) => response.data),
  recommendedFields: () => cachedGet(api, '/user/dashboard/recommended-fields').then((response) => response.data),
}

// Penyewa digital tickets (GET di-cache sementara; QR tidak di-cache agar segar).
export const ticketsApi = {
  list: (params) => cachedGet(api, '/tickets', { params }).then((response) => response.data),
  show: (id) => cachedGet(api, `/tickets/${id}`).then((response) => response.data),
  qr: (id) => api.get(`/tickets/${id}/qr`).then((response) => response.data),
}
