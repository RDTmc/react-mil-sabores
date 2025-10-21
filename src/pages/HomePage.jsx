import Hero from '../components/home/Hero'
import Benefits from '../components/home/Benefits'
import GrillaDeDestacados from '../components/home/GrillaDeDestacados'
import NewsGrid from '../components/home/NewsGrid'
import Testimonials from '../components/home/Testimonials'
import Discounts from '../components/home/Discounts'
import { productosDestacados } from '../hooks/ProductosDestacados'

export default function HomePage() {
  const { listaProductosDestacados, loadingCarga } = productosDestacados()

  return (
    <div className="py-3">
      <Hero />
      <Benefits />
      <GrillaDeDestacados listaProductosDestacados={listaProductosDestacados} loadingCarga={loadingCarga} />
      <NewsGrid />
      <Testimonials />
      <Discounts />
    </div>
  )
}
