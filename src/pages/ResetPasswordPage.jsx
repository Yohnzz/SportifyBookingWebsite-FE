import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authApi, getErrorMessage } from '../api'
import Icon from '../components/ui/Icon'

// Validasi mengikuti backend `ResetPasswordRequest`:
// token: required|string
// email: required|email|exists:users,email
// password: required|string|min:8|confirmed (butuh password_confirmation)
function validate(form) {
  const errors = {}

  if (!form.token.trim()) {
    errors.token = 'Token reset wajib diisi.'
  }
  if (!form.email.trim()) {
    errors.email = 'Email wajib diisi.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Format email tidak valid.'
  }
  if (!form.password) {
    errors.password = 'Kata sandi wajib diisi.'
  } else if (form.password.length < 8) {
    errors.password = 'Kata sandi minimal 8 karakter.'
  }
  if (!form.password_confirmation) {
    errors.password_confirmation = 'Konfirmasi kata sandi wajib diisi.'
  } else if (form.password !== form.password_confirmation) {
    errors.password_confirmation = 'Konfirmasi kata sandi tidak sesuai.'
  }

  return errors
}

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [form, setForm] = useState({
    token: searchParams.get('token') ?? '',
    email: searchParams.get('email') ?? '',
    password: '',
    password_confirmation: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
    setFieldErrors((previous) => ({ ...previous, [name]: null }))
    setError(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    const nextFieldErrors = validate(form)
    setFieldErrors(nextFieldErrors)

    if (Object.keys(nextFieldErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      await authApi.resetPassword({
        token: form.token.trim(),
        email: form.email.trim(),
        password: form.password,
        password_confirmation: form.password_confirmation,
      })

      navigate('/login', { replace: true })
    } catch (requestError) {
      // `Password::broker()->reset` mengembalikan 400 dengan pesan (token
      // tidak valid/kadaluarsa, email tidak cocok, dll). Tampilkan apa adanya.
      setError(getErrorMessage(requestError, 'Gagal mengatur ulang kata sandi. Periksa token & email.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-1 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Kolom kiri */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#14532D] p-12 text-white lg:flex lg:w-1/2">
        <img
          src="/images/auth-arena-bg.png"
          alt="Arena lapangan olahraga indoor modern GOR"
          className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14532D] via-[#14532D]/70 to-[#14532D]/50" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center">
            <img src="/images/gor-logo.png" alt="GOR Eco Sports" className="h-10 w-auto" />
          </Link>
        </div>

        <div className="relative z-10 my-auto max-w-lg pt-12 pb-8">
          <h2 className="mb-4 text-3xl font-bold leading-tight text-white xl:text-4xl">Buat Kata Sandi Baru.</h2>
          <p className="text-sm leading-relaxed text-emerald-100/90 xl:text-base">
            Gunakan token reset sekali pakai dan email akun Anda, lalu buat kata sandi baru minimal 8 karakter.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-2 border-t border-white/15 pt-6 text-xs text-emerald-100/80">
          <span className="flex items-center gap-1.5">
            <Icon name="check_circle" className="text-[16px] text-emerald-400" />
            Konfirmasi Instan 100%
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="verified_user" className="text-[16px] text-emerald-400" />
            Akun Aman
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="sell" className="text-[16px] text-emerald-400" />
            Bebas Hidden Fee
          </span>
        </div>
      </div>

      {/* Kolom kanan */}
      <div className="relative flex w-full flex-col justify-between bg-white p-6 sm:p-10 lg:w-1/2 lg:p-14">
        <div className="mb-8 flex w-full items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 lg:hidden" aria-label="GOR - Beranda">
            <img src="/images/gor-logo.png" alt="GOR Eco Sports" className="h-9 w-auto" />
          </Link>
          <Link
            to="/login"
            className="ml-auto hidden items-center gap-1.5 text-xs font-medium text-[#6B7280] transition-colors hover:text-[#16A34A] sm:inline-flex"
          >
            <Icon name="arrow_back" className="text-[14px]" />
            Kembali ke Masuk
          </Link>
        </div>

        <div className="mx-auto my-auto w-full max-w-md">
          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight text-[#1F2937] sm:text-3xl">Atur Ulang Kata Sandi</h1>
            <p className="mt-1.5 text-sm text-[#6B7280]">Masukkan token reset, email akun, dan kata sandi baru Anda.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-[#DC2626]/30 bg-[#FEE2E2] p-4 text-[#DC2626]" role="alert">
              <div className="flex items-start gap-3">
                <Icon name="error" className="mt-0.5 shrink-0 text-[20px]" />
                <div className="flex-1">
                  <h4 className="text-xs font-semibold">Gagal Mengatur Ulang</h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#DC2626]/90">{error}</p>
                </div>
                <button type="button" onClick={() => setError(null)} className="p-0.5 text-[#DC2626] transition-colors hover:text-red-800" aria-label="Tutup peringatan">
                  <Icon name="close" className="text-[16px]" />
                </button>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Token reset */}
            <div>
              <label htmlFor="token" className="mb-1.5 block text-xs font-medium text-[#1F2937]">
                Token Reset <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6B7280]">
                  <Icon name="key" className="text-[18px]" />
                </div>
                <input
                  id="token"
                  name="token"
                  type="text"
                  autoComplete="off"
                  placeholder="Token reset sekali pakai"
                  value={form.token}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.token)}
                  className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm text-[#1F2937] transition-all duration-200 placeholder:text-[#6B7280]/50 focus:outline-none focus:ring-3 focus:ring-[#16A34A]/15 ${
                    fieldErrors.token ? 'border-[#DC2626] bg-[#FFF5F5]' : 'border-[#E5E7EB] focus:border-[#16A34A]'
                  }`}
                />
              </div>
              {fieldErrors.token && <FieldError message={fieldErrors.token} />}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-[#1F2937]">
                Email <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6B7280]">
                  <Icon name="mail" className="text-[18px]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@email.com"
                  value={form.email}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.email)}
                  className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm text-[#1F2937] transition-all duration-200 placeholder:text-[#6B7280]/50 focus:outline-none focus:ring-3 focus:ring-[#16A34A]/15 ${
                    fieldErrors.email ? 'border-[#DC2626] bg-[#FFF5F5]' : 'border-[#E5E7EB] focus:border-[#16A34A]'
                  }`}
                />
              </div>
              {fieldErrors.email && <FieldError message={fieldErrors.email} />}
            </div>

            {/* Kata sandi baru */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-[#1F2937]">
                Kata Sandi Baru <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6B7280]">
                  <Icon name="lock" className="text-[18px]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Minimal 8 karakter"
                  value={form.password}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.password)}
                  className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-11 text-sm text-[#1F2937] transition-all duration-200 placeholder:text-[#6B7280]/50 focus:outline-none focus:ring-3 focus:ring-[#16A34A]/15 ${
                    fieldErrors.password ? 'border-[#DC2626] bg-[#FFF5F5]' : 'border-[#E5E7EB] focus:border-[#16A34A]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#6B7280] transition-colors hover:text-[#1F2937] focus:outline-none"
                  aria-label="Tampilkan atau sembunyikan kata sandi"
                  aria-pressed={showPassword}
                >
                  <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-[18px]" />
                </button>
              </div>
              {fieldErrors.password && <FieldError message={fieldErrors.password} />}
            </div>

            {/* Konfirmasi kata sandi baru */}
            <div>
              <label htmlFor="password_confirmation" className="mb-1.5 block text-xs font-medium text-[#1F2937]">
                Konfirmasi Kata Sandi Baru <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6B7280]">
                  <Icon name="verified_user" className="text-[18px]" />
                </div>
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Ulangi kata sandi baru"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.password_confirmation)}
                  className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-11 text-sm text-[#1F2937] transition-all duration-200 placeholder:text-[#6B7280]/50 focus:outline-none focus:ring-3 focus:ring-[#16A34A]/15 ${
                    fieldErrors.password_confirmation ? 'border-[#DC2626] bg-[#FFF5F5]' : 'border-[#E5E7EB] focus:border-[#16A34A]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((visible) => !visible)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#6B7280] transition-colors hover:text-[#1F2937] focus:outline-none"
                  aria-label="Tampilkan atau sembunyikan konfirmasi kata sandi"
                  aria-pressed={showConfirm}
                >
                  <Icon name={showConfirm ? 'visibility_off' : 'visibility'} className="text-[18px]" />
                </button>
              </div>
              {fieldErrors.password_confirmation && <FieldError message={fieldErrors.password_confirmation} />}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-5 py-3 text-sm font-medium text-white shadow-soft transition-all duration-200 hover:bg-[#15803D] hover:shadow-card focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:ring-offset-2 active:bg-[#14532D] ${
                  isSubmitting ? 'cursor-not-allowed opacity-80' : ''
                }`}
              >
                <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}</span>
                {isSubmitting ? (
                  <Icon name="progress_activity" className="animate-spin text-[16px]" />
                ) : (
                  <Icon name="arrow_forward" className="text-[16px]" />
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 border-t border-[#E5E7EB] pt-6 text-center">
            <p className="text-xs text-[#6B7280]">
              Belum punya token?
              <Link to="/forgot-password" className="ml-1 font-semibold text-[#16A34A] underline underline-offset-4 transition-colors hover:text-[#15803D]">
                Minta token reset
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-[#E5E7EB]/70 pt-4 text-[11px] text-[#6B7280] sm:flex-row">
          <p>&copy; 2026 GOR Eco Sports. Hak cipta dilindungi.</p>
          <div className="flex items-center gap-3">
            <Link to="/#bantuan" className="transition-colors hover:text-[#1F2937]">Kebijakan Privasi</Link>
            <span>&bull;</span>
            <Link to="/#bantuan" className="transition-colors hover:text-[#1F2937]">Ketentuan Layanan</Link>
            <span>&bull;</span>
            <Link to="/#bantuan" className="transition-colors hover:text-[#1F2937]">Pusat Bantuan</Link>
          </div>
        </div>
      </div>
    </main>
  )
}

function FieldError({ message }) {
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-[#DC2626]">
      <Icon name="error" className="text-[14px]" />
      {message}
    </p>
  )
}
