import { api } from './client'

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials).then((response) => response.data),
  register: (payload) => api.post('/auth/register', payload).then((response) => response.data),
  me: () => api.get('/auth/me').then((response) => response.data),
  logout: () => api.post('/auth/logout').then((response) => response.data),
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload).then((response) => response.data),
  resetPassword: (payload) => api.post('/auth/reset-password', payload).then((response) => response.data),
}
