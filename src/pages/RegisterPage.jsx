import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api'
import Icon from '../components/ui/Icon'
import { useAuth } from '../hooks/useAuth'

const FOREST = 'bg-[#14532D]'
const EMERALD = 'bg-[#16A34A]'

const initialForm = {
  name: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
}

function passwordStrength(value) {
  const hasLength = value.length >= 8
  const hasNumber = /\d/.test(value)

  if (!value) {
    return null
  }

  if (hasLength && hasNumber) {
    return { width: '100%', bar: 'bg-[#16A34A]', text: 'text-[#16A34A]', label: 'Kata sandi kuat (Kombinasi teks & angka terpenuhi)' }
  }

  if (hasLength || hasNumber) {
    return { width: '55%', bar: 'bg-amber-500', text: 'text-amber-600', label: 'Kata sandi sedang (Tambahkan angka & minimal 8 karakter)' }
  }

  return { width: '25%', bar: 'bg-red-500', text: 'text-red-600', label: 'Kata sandi lemah' }
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
  const [terms, setTerms] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const strength = passwordStrength(form.password)

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }))
    setFieldErrors((previous) => ({ ...previous, [name]: null }))
    setError(null)
  }

  function validate() {
    const nextFieldErrors = {}

    if (!form.name.trim()) {
      nextFieldErrors.name = 'Nama lengkap wajib diisi.'
    }
    if (!form.username.trim()) {
      nextFieldErrors.username = 'Username wajib diisi.'
    } else if (form.username.trim().length < 3) {
      nextFieldErrors.username = 'Username minimal 3 karakter.'
    }
    if (!form.email.trim()) {
      nextFieldErrors.email = 'Email wajib diisi.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextFieldErrors.email = 'Format email tidak valid.'
    }
    if (!form.password) {
      nextFieldErrors.password = 'Kata sandi wajib diisi.'
    } else if (form.password.length < 8 || !/\d/.test(form.password)) {
      nextFieldErrors.password = 'Kata sandi minimal 8 karakter dan mengandung angka.'
    }
    if (!form.password_confirmation) {
      nextFieldErrors.password_confirmation = 'Konfirmasi kata sandi wajib diisi.'
    } else if (form.password !== form.password_confirmation) {
      nextFieldErrors.password_confirmation = 'Konfirmasi kata sandi tidak sesuai dengan kata sandi.'
    }
    if (!terms) {
      nextFieldErrors.terms = 'Anda harus menyetujui Syarat & Ketentuan untuk melanjutkan.'
    }

    return nextFieldErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    const nextFieldErrors = validate()
    setFieldErrors(nextFieldErrors)

    if (Object.keys(nextFieldErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      // Catatan: backend `RegisterRequest` membutuhkan `email`, jadi email
      // disertakan meski tidak ada di mockup. `password_confirmation` dikirim
      // untuk aturan `confirmed`. `terms` tidak dikirim (tidak diperlukan API).
      await register({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
        password_confirmation: form.password_confirmation,
      })

      // Registrasi + token otomatis tersimpan; arahkan ke dashboard.
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Registrasi gagal. Periksa kembali data Anda.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-1 flex-col selection:bg-emerald-100 selection:text-emerald-900">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-12">
        {/* Kolom kiri: visual & branding */}
        <div className={`relative flex min-h-[460px] flex-col justify-between overflow-hidden p-8 text-white sm:p-10 lg:col-span-5 lg:min-h-screen lg:p-12 ${FOREST}`}>
          <img
            src="/images/auth-arena-bg.png"
            alt="Arena olahraga GOR"
            className="absolute inset-0 z-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 z-[1] bg-[#14532D]/80 mix-blend-multiply" />
          <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#0e3b20] via-[#14532D]/75 to-[#14532D]/55" />

          <div className="relative z-10 flex items-center">
            <Link to="/" aria-label="GOR - Beranda">
              <img src="/images/gor-logo.png" alt="GOR Eco Sports" className="h-10 w-auto drop-shadow-sm" />
            </Link>
          </div>

          <div className="relative z-10 my-10 max-w-lg lg:my-auto">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-200 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#7ffc97]" />
              Pendaftaran Anggota Baru
            </div>
            <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-white drop-shadow-sm sm:text-4xl">
              Bergabung dengan Komunitas Olahraga Terbesar.
            </h1>
            <p className="text-sm font-normal leading-relaxed text-white/85 drop-shadow-sm sm:text-base">
              Buat akun penyewa untuk menikmati akses jadwal real-time, booking instan, dan riwayat pertandinganmu.
            </p>
          </div>

          <div className="relative z-10" />
        </div>

        {/* Kolom kanan: form registrasi */}
        <div className="flex flex-col justify-between overflow-y-auto bg-[#F8FAF7] p-6 sm:p-10 lg:col-span-7 lg:p-12 xl:p-16">
          <div className="flex w-full justify-end">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#16A34A]"
            >
              <Icon name="arrow_back" className="text-[16px] transition-transform group-hover:-translate-x-1" />
              Kembali ke Beranda
            </Link>
          </div>

          <div className="mx-auto my-6 w-full max-w-[460px] sm:my-8">
            <div className="mb-7">
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Buat Akun Baru</h2>
              <p className="text-sm text-gray-600">Lengkapi data diri Anda untuk mulai booking lapangan di GOR.</p>
            </div>

            {/* Alert error */}
            {error && (
              <div className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm" role="alert">
                <div className="flex items-start gap-3">
                  <Icon name="error" className="mt-0.5 shrink-0 text-[20px] text-red-600" />
                  <div className="text-sm">
                    <p className="font-semibold text-red-900">Periksa Kembali Data Anda</p>
                    <p className="mt-0.5 text-red-700">{error}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setError(null)} className="text-red-400 transition-colors hover:text-red-700" aria-label="Tutup peringatan">
                  <Icon name="close" className="text-[16px]" />
                </button>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {/* Nama lengkap */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-800" htmlFor="name">Nama Lengkap</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Icon name="person" className="text-[20px]" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Rizky Pratama"
                    value={form.name}
                    onChange={handleChange}
                    className={`h-11 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 transition-all focus:outline-none focus:ring-3 focus:ring-[#16A34A]/15 ${
                      fieldErrors.name ? 'border-[#DC2626] bg-[#FFF5F5]' : 'border-[#E5E7EB] focus:border-[#16A34A]'
                    }`}
                  />
                </div>
                {fieldErrors.name && <FieldError message={fieldErrors.name} />}
              </div>

              {/* Username */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-800" htmlFor="username">Username</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Icon name="alternate_email" className="text-[20px]" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="rizkyp"
                    value={form.username}
                    onChange={handleChange}
                    className={`h-11 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 transition-all focus:outline-none focus:ring-3 focus:ring-[#16A34A]/15 ${
                      fieldErrors.username ? 'border-[#DC2626] bg-[#FFF5F5]' : 'border-[#E5E7EB] focus:border-[#16A34A]'
                    }`}
                  />
                </div>
                {fieldErrors.username && <FieldError message={fieldErrors.username} />}
              </div>

              {/* Email (wajib backend) */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-800" htmlFor="email">
                  Email <span className="font-normal text-gray-400">(untuk akun &amp; notifikasi)</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Icon name="mail" className="text-[20px]" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className={`h-11 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 transition-all focus:outline-none focus:ring-3 focus:ring-[#16A34A]/15 ${
                      fieldErrors.email ? 'border-[#DC2626] bg-[#FFF5F5]' : 'border-[#E5E7EB] focus:border-[#16A34A]'
                    }`}
                  />
                </div>
                {fieldErrors.email && <FieldError message={fieldErrors.email} />}
              </div>

              {/* Kata sandi */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-800" htmlFor="password">Kata Sandi</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Icon name="lock" className="text-[20px]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 8 karakter & angka"
                    value={form.password}
                    onChange={handleChange}
                    className={`h-11 w-full rounded-xl border bg-white pl-11 pr-11 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 transition-all focus:outline-none focus:ring-3 focus:ring-[#16A34A]/15 ${
                      fieldErrors.password ? 'border-[#DC2626] bg-[#FFF5F5]' : 'border-[#E5E7EB] focus:border-[#16A34A]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition-colors hover:text-gray-700 focus:outline-none"
                    aria-label="Tampilkan atau sembunyikan kata sandi"
                    aria-pressed={showPassword}
                  >
                    <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-[18px]" />
                  </button>
                </div>

                {/* Indikator kekuatan sandi */}
                {strength && (
                  <div className="mt-2">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                      <div className={`h-full rounded-full transition-all duration-300 ${strength.bar}`} style={{ width: strength.width }} />
                    </div>
                    <p className={`mt-1 text-xs font-medium ${strength.text}`}>{strength.label}</p>
                  </div>
                )}

                {fieldErrors.password && <FieldError message={fieldErrors.password} />}
              </div>

              {/* Konfirmasi kata sandi */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-800" htmlFor="password_confirmation">
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Icon name="verified_user" className="text-[20px]" />
                  </div>
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Ulangi kata sandi Anda"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    className={`h-11 w-full rounded-xl border bg-white pl-11 pr-11 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 transition-all focus:outline-none focus:ring-3 focus:ring-[#16A34A]/15 ${
                      fieldErrors.password_confirmation ? 'border-[#DC2626] bg-[#FFF5F5]' : 'border-[#E5E7EB] focus:border-[#16A34A]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((visible) => !visible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition-colors hover:text-gray-700 focus:outline-none"
                    aria-label="Tampilkan atau sembunyikan konfirmasi kata sandi"
                    aria-pressed={showConfirm}
                  >
                    <Icon name={showConfirm ? 'visibility_off' : 'visibility'} className="text-[18px]" />
                  </button>
                </div>
                {fieldErrors.password_confirmation && <FieldError message={fieldErrors.password_confirmation} />}
              </div>

              {/* Syarat & ketentuan */}
              <div className="pt-1.5">
                <label className="flex cursor-pointer select-none items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(event) => {
                      setTerms(event.target.checked)
                      setFieldErrors((previous) => ({ ...previous, terms: null }))
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A]"
                  />
                  <span className="text-xs leading-snug text-gray-600 sm:text-sm">
                    Saya menyetujui{' '}
                    <Link to="/#bantuan" className="font-medium text-[#16A34A] hover:underline">Syarat &amp; Ketentuan</Link>{' '}
                    serta{' '}
                    <Link to="/#bantuan" className="font-medium text-[#16A34A] hover:underline">Kebijakan Privasi</Link>{' '}
                    GOR.
                  </span>
                </label>
                {fieldErrors.terms && <FieldError message={fieldErrors.terms} />}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 font-semibold text-white shadow-md shadow-emerald-700/20 transition-all active:scale-[0.99] ${EMERALD} hover:bg-[#15803D] ${
                  isSubmitting ? 'cursor-not-allowed opacity-80' : ''
                }`}
              >
                <span>{isSubmitting ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}</span>
                {isSubmitting ? (
                  <Icon name="progress_activity" className="animate-spin text-[16px]" />
                ) : (
                  <Icon name="arrow_forward" className="text-[16px]" />
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-600">
              Sudah memiliki akun?
              <Link to="/login" className="ml-1 font-semibold text-[#16A34A] transition-colors hover:text-[#15803D] hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

function FieldError({ message }) {
  return (
    <p className="mt-1 flex items-center gap-1.5 text-xs text-red-600">
      <Icon name="error" className="text-[14px]" />
      {message}
    </p>
  )
}
