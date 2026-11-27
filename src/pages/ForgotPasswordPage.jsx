import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi, getErrorMessage } from '../api'
import Icon from '../components/ui/Icon'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState(null)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validasi mengikuti backend `ForgotPasswordRequest`:
  // email: required | email | exists:users,email
  function validateEmail(value) {
    if (!value.trim()) {
      return 'Email wajib diisi.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      return 'Format email tidak valid.'
    }
    return null
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    const nextFieldError = validateEmail(email)
    setFieldError(nextFieldError)

    if (nextFieldError) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await authApi.forgotPassword({ email: email.trim() })
      const token = response.data?.reset_token

      // Backend proyek ini TIDAK mengirim email; ia mengembalikan `reset_token`
      // di response. Lanjutkan ke halaman reset dengan token + email terisi.
      navigate(`/reset-password?token=${encodeURIComponent(token ?? '')}&email=${encodeURIComponent(email.trim())}`, {
        replace: true,
      })
    } catch (requestError) {
      // `exists:users,email` dari backend → email tidak terdaftar / invalid.
      setError(getErrorMessage(requestError, 'Email tidak terdaftar. Periksa kembali email Anda.'))
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
          <h2 className="mb-4 text-3xl font-bold leading-tight text-white xl:text-4xl">Atur Ulang Kata Sandi.</h2>
          <p className="text-sm leading-relaxed text-emerald-100/90 xl:text-base">
            Masukkan email akun GOR Anda. Kami buat token reset kata sandi sekali pakai untuk membuat kata sandi baru.
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
            <h1 className="text-2xl font-bold tracking-tight text-[#1F2937] sm:text-3xl">Lupa Kata Sandi?</h1>
            <p className="mt-1.5 text-sm text-[#6B7280]">Masukkan email akun Anda untuk mendapatkan token reset kata sandi.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-[#DC2626]/30 bg-[#FEE2E2] p-4 text-[#DC2626]" role="alert">
              <div className="flex items-start gap-3">
                <Icon name="error" className="mt-0.5 shrink-0 text-[20px]" />
                <div className="flex-1">
                  <h4 className="text-xs font-semibold">Gagal Memproses</h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#DC2626]/90">{error}</p>
                </div>
                <button type="button" onClick={() => setError(null)} className="p-0.5 text-[#DC2626] transition-colors hover:text-red-800" aria-label="Tutup peringatan">
                  <Icon name="close" className="text-[16px]" />
                </button>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
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
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setFieldError(null)
                    setError(null)
                  }}
                  aria-invalid={Boolean(fieldError)}
                  className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm text-[#1F2937] transition-all duration-200 placeholder:text-[#6B7280]/50 focus:outline-none focus:ring-3 focus:ring-[#16A34A]/15 ${
                    fieldError ? 'border-[#DC2626] bg-[#FFF5F5]' : 'border-[#E5E7EB] focus:border-[#16A34A]'
                  }`}
                />
              </div>
              {fieldError && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-[#DC2626]">
                  <Icon name="error" className="text-[14px]" />
                  {fieldError}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-5 py-3 text-sm font-medium text-white shadow-soft transition-all duration-200 hover:bg-[#15803D] hover:shadow-card focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:ring-offset-2 active:bg-[#14532D] ${
                  isSubmitting ? 'cursor-not-allowed opacity-80' : ''
                }`}
              >
                <span>{isSubmitting ? 'Memproses...' : 'Kirim Token Reset'}</span>
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
              Ingat kata sandi Anda?
              <Link to="/login" className="ml-1 font-semibold text-[#16A34A] underline underline-offset-4 transition-colors hover:text-[#15803D]">
                Masuk di sini
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
