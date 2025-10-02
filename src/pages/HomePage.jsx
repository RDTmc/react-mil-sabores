import Hero from '../components/home/Hero'
import Benefits from '../components/home/Benefits'
import FeaturedGrid from '../components/home/FeaturedGrid'
import NewsGrid from '../components/home/NewsGrid'
import Testimonials from '../components/home/Testimonials'
import Discounts from '../components/home/Discounts'
import { useFeatured } from '../hooks/useFeatured'

export default function HomePage() {
  const { items: featured, loading } = useFeatured()

  return (
    <div className="py-3">
      <Hero />
      <Benefits />
      <FeaturedGrid items={featured} loading={loading} />
      <NewsGrid />
      <Testimonials />
      <Discounts />
    </div>
  )
}
