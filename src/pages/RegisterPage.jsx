import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api'
import { useAuth } from '../hooks/useAuth'
import { alertClass, buttonPrimary, cardClass, inputClass, labelClass } from '../lib/ui'

const initialForm = {
  name: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
}

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Registrasi gagal. Periksa kembali data Anda.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Daftar akun penyewa</h1>

      <form className={`${cardClass} mt-6 flex flex-col gap-4 p-6`} onSubmit={handleSubmit}>
        {error && <p className={alertClass}>{error}</p>}

        <label className={labelClass}>
          <span>Nama lengkap</span>
          <input name="name" className={inputClass} value={form.name} onChange={handleChange} required />
        </label>

        <label className={labelClass}>
          <span>Username</span>
          <input name="username" className={inputClass} value={form.username} onChange={handleChange} required />
        </label>

        <label className={labelClass}>
          <span>Email</span>
          <input
            name="email"
            type="email"
            className={inputClass}
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className={labelClass}>
          <span>No. telepon</span>
          <input name="phone" className={inputClass} value={form.phone} onChange={handleChange} />
        </label>

        <label className={labelClass}>
          <span>Password</span>
          <input
            name="password"
            type="password"
            className={inputClass}
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
        </label>

        <label className={labelClass}>
          <span>Konfirmasi password</span>
          <input
            name="password_confirmation"
            type="password"
            className={inputClass}
            value={form.password_confirmation}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
        </label>

        <button type="submit" className={`${buttonPrimary} mt-1`} disabled={isSubmitting}>
          {isSubmitting ? 'Memproses...' : 'Daftar'}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-500">
        Sudah punya akun?{' '}
        <Link to="/login" className="font-semibold text-emerald-700 hover:underline">
          Masuk di sini
        </Link>
      </p>
    </main>
  )
}
