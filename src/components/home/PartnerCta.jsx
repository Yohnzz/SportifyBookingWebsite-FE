import { Link } from 'react-router-dom'

export default function PartnerCta() {
  return (
    <section id="mitra" className="w-full scroll-mt-20 bg-surface py-12">
      <div className="mx-auto w-full max-w-[1200px] px-4 lg:px-6">
        <div className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-container p-8 text-on-primary shadow-lg sm:p-12 lg:flex-row">
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-secondary-container/10 blur-2xl" />

          <div className="relative z-10 max-w-xl text-center lg:text-left">
            <span className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-label-sm font-semibold uppercase tracking-wider text-secondary-fixed">
              Punya Gelanggang Olahraga?
            </span>
            <h2 className="mb-2 font-display text-headline-xl font-bold tracking-tight">
              Daftarkan Lapangan Anda di GOR
            </h2>
            <p className="text-body-md text-surface-container-low">
              Optimalkan jam sewa lapangan yang kosong, terima pembayaran otomatis, dan jangkau ribuan atlet setiap hari.
            </p>
          </div>

          <div className="relative z-10 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <Link
              to="/register"
              className="w-full rounded-xl bg-secondary px-6 py-3.5 text-center text-label-lg font-bold text-on-secondary shadow-md transition-all hover:bg-secondary-fixed hover:text-primary sm:w-auto"
            >
              Gabung Mitra Lapangan
            </Link>
            <a
              href="mailto:support@gorecosports.id?subject=Konsultasi%20Mitra%20Lapangan"
              className="w-full rounded-xl bg-white/10 px-5 py-3.5 text-center text-label-lg font-semibold text-on-primary transition-all hover:bg-white/20 sm:w-auto"
            >
              Konsultasi Gratis
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
