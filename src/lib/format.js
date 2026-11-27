import { storageUrl } from '../api'

const fallbackByCategory = {
  'mini-soccer': '/images/field-mini-soccer.jpg',
  futsal: '/images/field-futsal.jpg',
  badminton: '/images/field-badminton.jpg',
  padel: '/images/field-padel.jpg',
}

const categoryIcons = {
  'sepak-bola': 'sports_soccer',
  'mini-soccer': 'stadium',
  futsal: 'sports_soccer',
  voli: 'sports_volleyball',
  tennis: 'sports_tennis',
  padel: 'sports_baseball',
  badminton: 'sports_tennis',
  basket: 'sports_basketball',
}

const facilityIcons = [
  [/parkir/i, 'local_parking'],
  [/ganti|loker/i, 'checkroom'],
  [/shower|mandi/i, 'shower'],
  [/lampu|penerangan/i, 'lightbulb'],
  [/kantin|resto|kafe|cafe/i, 'local_cafe'],
  [/musholla|musala/i, 'mosque'],
  [/tribun/i, 'groups'],
  [/ac\b|pendingin/i, 'ac_unit'],
  [/raket/i, 'sports_tennis'],
  [/wifi/i, 'wifi'],
  [/toilet|wc/i, 'wc'],
]

export function formatRupiah(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '-'
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value))
}

export function formatDateLong(date) {
  const value = date instanceof Date ? date : new Date(date)

  if (Number.isNaN(value.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(value)
}

export function toDateInputValue(date = new Date()) {
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60 * 1000)

  return local.toISOString().slice(0, 10)
}

export function categoryIcon(slug) {
  return categoryIcons[slug] ?? 'sports'
}

export function facilityIcon(name = '') {
  const match = facilityIcons.find(([pattern]) => pattern.test(name))

  return match ? match[1] : 'check_circle'
}

export function fieldFallbackImage(field) {
  return fallbackByCategory[field?.category?.slug] ?? '/images/hero-arena.jpg'
}

export function fieldImage(field) {
  return field?.primary_image ? storageUrl(field.primary_image) : fieldFallbackImage(field)
}

export function lowestPrice(field) {
  const prices = (field?.tarif ?? [])
    .filter((tarif) => tarif.is_active !== false)
    .map((tarif) => Number(tarif.price))
    .filter((price) => Number.isFinite(price) && price > 0)

  return prices.length > 0 ? Math.min(...prices) : null
}

export function formatDuration(minutes) {
  const value = Number(minutes)

  if (!Number.isFinite(value) || value <= 0) {
    return '-'
  }

  if (value < 60) {
    return `${value} menit`
  }

  const hours = value / 60

  return Number.isInteger(hours) ? `${hours} jam` : `${hours.toFixed(1)} jam`
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
