import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'

const quickLinks = [
  { label: 'Beranda', to: '/' },
  { label: 'Daftar Lapangan', to: '/#lapangan' },
  { label: 'Jadwal Saya', to: '/dashboard' },
  { label: 'Riwayat Booking', to: '/dashboard' },
]

const categoryLinks = [
  { label: 'Futsal & Mini Soccer', to: '/#lapangan' },
  { label: 'Badminton', to: '/#lapangan' },
  { label: 'Tenis & Padel', to: '/#lapangan' },
  { label: 'Basket', to: '/#lapangan' },
]

const socials = [
  { icon: 'public', label: 'Media Sosial Komunitas' },
  { icon: 'forum', label: 'Kanal Informasi' },
  { icon: 'smart_display', label: 'Pusat Siaran Video' },
  { icon: 'photo_camera', label: 'Galeri Lapangan' },
]

export default function Footer() {
  return (
    <footer id="bantuan" className="mt-space-xl w-full border-t border-outline-variant/40 bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-6 pt-12 lg:px-6">
        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="inline-flex items-center">
              <img src="/images/gor-logo.png" alt="GOR Eco Sports" className="h-12 w-auto" />
            </Link>
            <p className="max-w-sm text-body-md text-on-surface-variant">
              Platform booking lapangan olahraga terpercaya di Indonesia.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {socials.map((social) => (
                <a
                  key={social.icon}
                  href="#"
                  aria-label={social.label}
                  className="grid h-10 w-10 place-items-center rounded-full bg-surface-container text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface"
                >
                  <Icon name={social.icon} className="text-[20px]" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-headline-sm font-semibold text-on-surface">Navigasi Cepat</h4>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-body-md text-on-surface-variant transition-colors hover:text-secondary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-headline-sm font-semibold text-on-surface">Kategori Olahraga</h4>
            <ul className="mt-4 space-y-2.5">
              {categoryLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-body-md text-on-surface-variant transition-colors hover:text-secondary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-headline-sm font-semibold text-on-surface">Kontak &amp; Bantuan</h4>
            <ul className="mt-4 space-y-2.5 text-body-md text-on-surface-variant">
              <li className="flex items-center gap-2">
                <Icon name="mail" className="text-[18px] text-secondary" />
                <a href="mailto:support@gorecosports.id" className="transition-colors hover:text-secondary">
                  support@gorecosports.id
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="call" className="text-[18px] text-secondary" />
                <a href="tel:+6282111223344" className="transition-colors hover:text-secondary">
                  +62 821 1122 3344
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="help" className="text-[18px] text-secondary" />
                <Link to="/#bantuan" className="transition-colors hover:text-secondary">
                  Pusat Bantuan
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="info" className="text-[18px] text-secondary" />
                <Link to="/#bantuan" className="transition-colors hover:text-secondary">
                  Syarat &amp; Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-outline-variant/40 pt-6 sm:flex-row">
          <p className="text-center text-body-sm text-on-surface-variant sm:text-left">
            Copyright &copy; 2026 GOR Eco Sports. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-3 text-body-sm text-on-surface-variant">
            <Link to="/#bantuan" className="transition-colors hover:text-secondary">
              Kebijakan Privasi
            </Link>
            <span className="text-outline-variant">&bull;</span>
            <Link to="/#bantuan" className="transition-colors hover:text-secondary">
              Ketentuan Layanan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
