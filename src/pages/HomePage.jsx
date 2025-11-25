// src/pages/HomePage.jsx
import Hero from '../components/home/Hero'
import Benefits from '../components/home/Benefits'
import GrillaDeDestacados from '../components/home/GrillaDeDestacados'
import NewsGrid from '../components/home/NewsGrid'
import Testimonials from '../components/home/Testimonials'
import Discounts from '../components/home/Discounts'
import { useProductosDestacados } from '../hooks/productosDestacados' // ← ruta y nombre correctos
import '../styles/brand.css';
import '../styles/HomeSections.css';

export default function HomePage() {
  // Hook correcto + mapeo a los nombres que ya usabas
  const { destacados, loadingDestacados, errorDestacados } = useProductosDestacados()
  const listaProductosDestacados = destacados
  const loadingCarga = loadingDestacados
  const errorCarga = errorDestacados

  return (
    <div className="py-3">
      <Hero />
      <Benefits />

      {/* Mensaje de error opcional */}
      {errorCarga && (
        <div className="container mb-3">
          <div className="alert alert-warning">
            No se pudieron cargar los destacados: {String(errorCarga)}
          </div>
        </div>
      )}

      <GrillaDeDestacados
        listaProductosDestacados={listaProductosDestacados}
        loadingCarga={loadingCarga}
      />

      <NewsGrid />
      <Testimonials />
      <Discounts />
    </div>
  )
}
