import Icon from '../ui/Icon'

const features = [
  {
    icon: 'touch_app',
    eyebrow: 'Langkah Praktis',
    title: 'Booking Mudah',
    description:
      'Reservasi lapangan cukup dalam 3 klik kapan saja tanpa perlu telepon manual atau konfirmasi chat yang lambat.',
  },
  {
    icon: 'calendar_month',
    eyebrow: 'Real-Time Sync',
    title: 'Jadwal Transparan',
    description:
      'Kalender dan ketersediaan jam slot selalu sinkron dan real-time langsung dengan sistem pengelola lapangan.',
  },
  {
    icon: 'payments',
    eyebrow: 'Bebas Hidden Fee',
    title: 'Informasi Harga Jelas',
    description:
      'Tarif sesi siang dan lampu malam dijabarkan transparan tanpa biaya tersembunyi saat checkout.',
  },
  {
    icon: 'electric_bolt',
    eyebrow: 'Instan QR Code',
    title: 'Proses Cepat',
    description:
      'Konfirmasi instan 100% langsung terbit kode booking resmi untuk check-in mudah di resepsionis venue.',
  },
]

export default function FeatureSection() {
  return (
    <section id="keunggulan" className="w-full scroll-mt-20 bg-surface-container-low py-14 lg:py-16">
      <div className="mx-auto w-full max-w-[1200px] px-4 lg:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-12">
          <span className="text-label-sm font-bold uppercase tracking-widest text-secondary">Kenapa Memilih Kami</span>
          <h2 className="mt-1 font-display text-headline-xl font-bold tracking-tight text-on-surface">
            Pengalaman Booking Modern &amp; Terpercaya
          </h2>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Kami mendesain GOR khusus untuk memudahkan atlet, komunitas, dan pengelola lapangan berinteraksi dalam satu
            platform aman.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-outline-variant/40 transition-shadow hover:shadow-md"
            >
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-secondary-container text-on-secondary-container">
                <Icon name={feature.icon} className="text-[26px]" />
              </div>
              <div className="mb-1 text-label-sm font-bold uppercase tracking-wider text-secondary">
                {feature.eyebrow}
              </div>
              <h3 className="mb-2 font-display text-headline-sm font-bold text-on-surface">{feature.title}</h3>
              <p className="text-body-md text-on-surface-variant">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
