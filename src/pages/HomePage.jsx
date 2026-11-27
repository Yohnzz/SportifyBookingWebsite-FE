import { useEffect, useState } from 'react'
import { fieldsApi } from '../api'
import CategoryStrip from '../components/home/CategoryStrip'
import FeatureSection from '../components/home/FeatureSection'
import HeroSection from '../components/home/HeroSection'
import PartnerCta from '../components/home/PartnerCta'
import VenueSection from '../components/home/VenueSection'

const emptyFilters = { location: '', category: '' }

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState(emptyFilters)

  useEffect(() => {
    let isMounted = true

    fieldsApi
      .categories()
      .then((response) => {
        if (isMounted) {
          setCategories(response.data ?? [])
        }
      })
      .catch(() => {
        if (isMounted) {
          setCategories([])
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  function scrollToVenues() {
    document.getElementById('lapangan')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleSearch(nextFilters) {
    setFilters(nextFilters)
    scrollToVenues()
  }

  function handleCategorySelect(slug) {
    setFilters((current) => ({
      ...current,
      category: current.category === slug ? '' : slug,
    }))
    scrollToVenues()
  }

  function handleExploreAll() {
    setFilters(emptyFilters)
    scrollToVenues()
  }

  return (
    <>
      <HeroSection categories={categories} onSearch={handleSearch} />
      <CategoryStrip
        categories={categories}
        activeSlug={filters.category}
        onSelect={handleCategorySelect}
        onExploreAll={handleExploreAll}
      />
      <VenueSection filters={filters} categories={categories} />
      <FeatureSection />
      <PartnerCta />
    </>
  )
}
