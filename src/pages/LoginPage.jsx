import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api'
import Icon from '../components/ui/Icon'
import { useAuth } from '../hooks/useAuth'
import { alertClass, buttonPrimary, cardClass, inputClass, labelClass } from '../lib/ui'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo = location.state?.from?.pathname ?? '/dashboard'

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login(form)
      navigate(redirectTo, { replace: true })
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Login gagal. Periksa username dan password.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-12 lg:px-6">
      <h1 className="font-display text-headline-lg font-bold text-on-surface">Masuk</h1>
      <p className="mt-1 text-body-md text-on-surface-variant">Gunakan akun yang sudah terdaftar di GOR.</p>

      <form className={`${cardClass} mt-6 flex flex-col gap-4 p-6`} onSubmit={handleSubmit}>
        {error && <p className={alertClass}>{error}</p>}

        <label className={labelClass}>
          <span>Username atau email</span>
          <input
            name="username"
            className={inputClass}
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            required
          />
        </label>

        <label className={labelClass}>
          <span>Password</span>
          <input
            name="password"
            type="password"
            className={inputClass}
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </label>

        <button type="submit" className={`${buttonPrimary} mt-1`} disabled={isSubmitting}>
          <Icon name="login" className="text-[18px]" />
          {isSubmitting ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <p className="mt-4 text-body-md text-on-surface-variant">
        Belum punya akun?{' '}
        <Link to="/register" className="font-semibold text-secondary hover:underline">
          Daftar di sini
        </Link>
      </p>
    </main>
  )
}
