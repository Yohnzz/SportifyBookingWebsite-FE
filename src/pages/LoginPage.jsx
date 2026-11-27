import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api'
import Icon from '../components/ui/Icon'
import { useAuth } from '../hooks/useAuth'

const EMERALD = 'bg-[#16A34A]'
const EMERALD_HOVER = 'hover:bg-[#15803D]'
const FOREST = 'bg-[#14532D]'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ username: '', password: '' })
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Setelah login berhasil, kembali ke halaman pertama (beranda) kecuali
  // memang diarahkan ke halaman lain yang meminta login. Tombol "Masuk" di
  // halaman pertama otomatis berubah menjadi profil karena state auth global.
  const redirectTo = location.state?.from?.pathname ?? '/'

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
    setFieldErrors((previous) => ({ ...previous, [name]: null }))
    setError(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    const nextFieldErrors = {}
    if (!form.username.trim()) {
      nextFieldErrors.username = 'Username tidak boleh kosong.'
    }
    if (!form.password.trim()) {
      nextFieldErrors.password = 'Kata sandi tidak boleh kosong.'
    }

    setFieldErrors(nextFieldErrors)

    if (Object.keys(nextFieldErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      await login({ username: form.username.trim(), password: form.password }, { remember: rememberMe })
      navigate(redirectTo === '/login' ? '/' : redirectTo, { replace: true })
    } catch (requestError) {
      // Kredensial salah ditampilkan sebagai alert di halaman, bukan di toast.
      setError(
        getErrorMessage(
          requestError,
          'Kredensial Tidak Sesuai. Username atau kata sandi yang Anda masukkan salah. Pastikan kombinasi huruf besar dan kecil sudah benar.',
        ),
      )
      setFieldErrors((previous) => ({ ...previous, password: 'Kata sandi tidak sesuai.' }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-1 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Kolom kiri: visual split + branding */}
      <div className={`relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex lg:w-1/2 ${FOREST}`}>
        <img
          src="/images/auth-arena-bg.png"
          alt="Arena lapangan olahraga indoor modern GOR"
          className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-40 mix-blend-luminosity transition-transform duration-1000 ease-out hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14532D] via-[#14532D]/70 to-[#14532D]/50" />

        {/* Brand */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center">
            <img src="/images/gor-logo.png" alt="GOR Eco Sports" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Narasi tengah */}
        <div className="relative z-10 my-auto max-w-lg pt-12 pb-8">
          <h2 className="mb-4 text-3xl font-bold leading-tight text-white xl:text-4xl">
            Satu Akun untuk Semua Kebutuhan Olahragamu.
          </h2>
          <p className="text-sm leading-relaxed text-emerald-100/90 xl:text-base">
            Akses jadwal transparan secara real-time di seluruh gelanggang. Reservasi instan dalam hitungan detik
            tanpa ribet.
          </p>
        </div>

        {/* Trust markers */}
        <div className="relative z-10 flex items-center justify-between gap-2 border-t border-white/15 pt-6 text-xs text-emerald-100/80">
          <span className="flex items-center gap-1.5">
            <Icon name="check_circle" className="text-[16px] text-emerald-400" />
            Konfirmasi Instan 100%
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="verified_user" className="text-[16px] text-emerald-400" />
            Check-in QR Code
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="sell" className="text-[16px] text-emerald-400" />
            Bebas Hidden Fee
          </span>
        </div>
      </div>

      {/* Kolom kanan: form login */}
      <div className="relative flex w-full flex-col justify-between bg-white p-6 sm:p-10 lg:w-1/2 lg:p-14">
        {/* Top action bar */}
        <div className="mb-8 flex w-full items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 lg:hidden" aria-label="GOR - Beranda">
            <img src="/images/gor-logo.png" alt="GOR Eco Sports" className="h-9 w-auto" />
          </Link>

          <Link
            to="/"
            className="ml-auto hidden items-center gap-1.5 text-xs font-medium text-[#6B7280] transition-colors hover:text-[#16A34A] sm:inline-flex"
          >
            <Icon name="arrow_back" className="text-[14px]" />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="mx-auto my-auto w-full max-w-md">
          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight text-[#1F2937] sm:text-3xl">Selamat Datang Kembali</h1>
            <p className="mt-1.5 text-sm text-[#6B7280]">Silakan masukkan username dan kata sandi akun GOR Anda.</p>
          </div>

          {/* Alert kredensial salah */}
          {error && (
            <div className="mb-5 rounded-xl border border-[#DC2626]/30 bg-[#FEE2E2] p-4 text-[#DC2626]" role="alert">
              <div className="flex items-start gap-3">
                <Icon name="error" className="mt-0.5 shrink-0 text-[20px]" />
                <div className="flex-1">
                  <h4 className="text-xs font-semibold">Kredensial Tidak Sesuai</h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#DC2626]/90">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="p-0.5 text-[#DC2626] transition-colors hover:text-red-800"
                  aria-label="Tutup peringatan"
                >
                  <Icon name="close" className="text-[16px]" />
                </button>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div>
              <label htmlFor="username" className="mb-1.5 block text-xs font-medium text-[#1F2937]">
                Username atau ID Penyewa <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6B7280]">
                  <Icon name="person" className="text-[18px]" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Contoh: rizkyp"
                  value={form.username}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.username)}
                  className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm text-[#1F2937] transition-all duration-200 placeholder:text-[#6B7280]/50 focus:outline-none focus:ring-3 focus:ring-[#16A34A]/15 ${
                    fieldErrors.username ? 'border-[#DC2626] bg-[#FFF5F5]' : 'border-[#E5E7EB] focus:border-[#16A34A]'
                  }`}
                />
              </div>
              {fieldErrors.username && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-[#DC2626]">
                  <Icon name="error" className="text-[14px]" />
                  {fieldErrors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-medium text-[#1F2937]">
                  Kata Sandi <span className="text-[#DC2626]">*</span>
                </label>
                <Link to="/forgot-password" className="text-xs font-medium text-[#16A34A] transition-colors hover:text-[#15803D]">
                  Lupa Kata Sandi?
                </Link>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#6B7280]">
                  <Icon name="key" className="text-[18px]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
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
                  title="Tampilkan / Sembunyikan Kata Sandi"
                  aria-label="Tampilkan atau sembunyikan kata sandi"
                  aria-pressed={showPassword}
                >
                  <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-[18px]" />
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-[#DC2626]">
                  <Icon name="error" className="text-[14px]" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Ingat saya */}
            <div className="flex items-center pt-1">
              <label className="flex cursor-pointer select-none items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-[#E5E7EB] accent-[#16A34A] transition-colors focus:ring-[#16A34A] focus:ring-offset-0"
                />
                <span className="text-xs text-[#6B7280]">Ingat saya di perangkat ini</span>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-soft transition-all duration-200 hover:shadow-card focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:ring-offset-2 ${EMERALD} ${EMERALD_HOVER} active:bg-[#14532D] ${
                  isSubmitting ? 'cursor-not-allowed opacity-80' : ''
                }`}
              >
                <span>{isSubmitting ? 'Memverifikasi...' : 'Masuk Sekarang'}</span>
                {isSubmitting ? (
                  <Icon name="progress_activity" className="animate-spin text-[16px]" />
                ) : (
                  <Icon name="arrow_forward" className="text-[16px]" />
                )}
              </button>
            </div>
          </form>

          {/* Daftar */}
          <div className="mt-8 border-t border-[#E5E7EB] pt-6 text-center">
            <p className="text-xs text-[#6B7280]">
              Belum memiliki akun penyewa?
              <Link
                to="/register"
                className="ml-1 font-semibold text-[#16A34A] underline underline-offset-4 transition-colors hover:text-[#15803D]"
              >
                Daftar Akun Baru
              </Link>
            </p>
          </div>
        </div>

        {/* Mini footer */}
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
