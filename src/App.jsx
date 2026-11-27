import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'
import RequireAuth from './components/RequireAuth'
import DashboardPage from './pages/DashboardPage'
import FieldDetailPage from './pages/FieldDetailPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import RegisterPage from './pages/RegisterPage'

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const frame = requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })

      return () => cancelAnimationFrame(frame)
    }

    window.scrollTo({ top: 0 })

    return undefined
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollManager />
      <Navbar />

      <div className="flex flex-1 flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lapangan/:slug" element={<FieldDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}
