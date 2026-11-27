import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { buttonPrimary } from '../../lib/ui'
import Icon from '../ui/Icon'

// Navbar sticky + glassmorphism.
// - sticky/fixed top:0, z-index tinggi.
// - awal (scroll top, <=20px): background #FFFFFF solid + border-bottom tipis/shadow halus.
// - scroll > 20px: rgba(255,255,255,0.75) + backdrop-filter blur(10px).
// - transisi mulus 0.3s; kembali ke top -> solid putih. Berlaku semua tampilan.
// - TIDAK menampilkan profile / tombol Keluar (itu di sidebar); hanya tombol "Masuk" untuk guest.
export default function Navbar() {
  const { isAuthenticated } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ${
        isScrolled
          ? 'border-b border-outline-variant/50 bg-white/75 backdrop-blur-md'
          : 'border-b border-outline-variant bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]'
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center" aria-label="GOR - Beranda">
          <img src="/images/gor-logo.png" alt="GOR Eco Sports" className="h-10 w-auto lg:h-11" />
        </Link>

        {/* profile & Keluar dipindahkan ke sidebar; hanya Masuk untuk guest */}
        {!isAuthenticated && (
          <Link to="/login" className={buttonPrimary}>
            <Icon name="login" className="text-[18px]" />
            Masuk
          </Link>
        )}
      </div>
    </header>
  )
}
