import { categoryIcon } from '../../lib/format'
import Icon from '../ui/Icon'

export default function CategoryStrip({ categories = [], activeSlug = '', onSelect, onExploreAll }) {
  return (
    <section className="w-full bg-surface-container-low py-9">
      <div className="mx-auto w-full max-w-[1200px] px-4 lg:px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <span className="text-label-sm font-bold uppercase tracking-widest text-secondary">Katalog Cabang</span>
            <h2 className="mt-0.5 font-display text-headline-md font-bold text-on-surface sm:text-headline-lg">
              Pilih Kategori Olahraga
            </h2>
          </div>
          <button
            type="button"
            onClick={onExploreAll}
            className="group flex shrink-0 items-center gap-1 text-label-md font-bold text-secondary transition hover:text-primary"
          >
            Eksplor Semua
            <Icon name="arrow_forward" className="text-[18px] transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:grid-cols-7">
          {categories.length === 0
            ? Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="h-[124px] animate-pulse rounded-2xl bg-white/70" />
              ))
            : categories.map((category) => {
                const isActive = category.slug === activeSlug

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => onSelect?.(category.slug)}
                    className={`group flex flex-col items-center justify-center rounded-2xl p-4 text-center shadow-sm ring-1 transition-all hover:bg-secondary hover:text-on-secondary ${
                      isActive ? 'bg-white ring-2 ring-secondary/40' : 'bg-white ring-transparent'
                    }`}
                  >
                    <span
                      className={`mb-2.5 grid h-12 w-12 place-items-center rounded-xl transition-all ${
                        isActive
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-surface-container text-secondary group-hover:bg-white/20 group-hover:text-on-secondary'
                      }`}
                    >
                      <Icon name={categoryIcon(category.slug)} className="text-[26px]" />
                    </span>
                    <span className="font-display text-headline-sm font-bold leading-tight">{category.name}</span>
                    <span className="mt-0.5 text-body-sm text-on-surface-variant group-hover:text-on-secondary/80">
                      {category.fields_count ?? 0} Venue
                    </span>
                  </button>
                )
              })}
        </div>
      </div>
    </section>
  )
}
