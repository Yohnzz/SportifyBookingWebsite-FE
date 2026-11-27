import { api } from './client'

export const healthApi = {
  ping: () => api.get('/ping').then((response) => response.data),
}
