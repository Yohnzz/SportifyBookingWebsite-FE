import { api } from './client'

export const fieldsApi = {
  categories: () => api.get('/categories').then((response) => response.data),
  list: (params) => api.get('/fields', { params }).then((response) => response.data),
  show: (slug) => api.get(`/fields/${slug}`).then((response) => response.data),
  pricing: (id) => api.get(`/fields/${id}/pricing`).then((response) => response.data),
  facilities: (id) => api.get(`/fields/${id}/facilities`).then((response) => response.data),
  availability: (id, params) => api.get(`/fields/${id}/availability`, { params }).then((response) => response.data),
  calendar: (id, params) => api.get(`/fields/${id}/calendar`, { params }).then((response) => response.data),
}
