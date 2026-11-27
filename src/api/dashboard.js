import { api } from './client'

// Penyewa dashboard. `data` berisi `data` dari ApiResponse. Semua dari server.
export const userDashboardApi = {
  summary: () => api.get('/user/dashboard/summary').then((response) => response.data),
  activeBookings: () => api.get('/user/dashboard/active-bookings').then((response) => response.data),
  recentBookings: () => api.get('/user/dashboard/recent-bookings').then((response) => response.data),
  recommendedFields: () => api.get('/user/dashboard/recommended-fields').then((response) => response.data),
}

// Penyewa digital tickets.
export const ticketsApi = {
  list: (params) => api.get('/tickets', { params }).then((response) => response.data),
  show: (id) => api.get(`/tickets/${id}`).then((response) => response.data),
  qr: (id) => api.get(`/tickets/${id}/qr`).then((response) => response.data),
}
