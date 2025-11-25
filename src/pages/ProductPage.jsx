import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import GaleriaProducto from '../components/producto/GaleriaProducto.jsx'
import FichaProducto from '../components/producto/FichaProducto.jsx'
import { fetchProductById } from '../lib/apiClient'

export default function ProductPage() {
  const { id } = useParams()

  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let vivo = true
    ;(async () => {
      try {
        setLoading(true); setError(null)
        const p = await fetchProductById(id)

        // Adaptamos a snake_case para no romper componentes existentes:
        const adaptado = {
          ...p,
          image_path: p.imagePath ?? p.image_path ?? null,
          category_id: p.categoryId ?? p.category_id ?? null,
        }

        if (!vivo) return
        setProducto(adaptado)
      } catch (err) {
        if (!vivo) return
        setError(err?.response?.data?.message || err?.message || 'No se pudo cargar el producto')
      } finally {
        if (vivo) setLoading(false)
      }
    })()
    return () => { vivo = false }
  }, [id])

  const titulo = useMemo(() => producto?.name || 'Producto', [producto])

  return (
    <div className="container py-3">
      <h1 className="h3 mb-3">{titulo}</h1>

      {loading && (
        <div className="row g-4">
          <div className="col-md-6">
            <div className="ratio ratio-1x1 bg-light placeholder" />
          </div>
          <div className="col-md-6">
            <h5 className="placeholder-glow">
              <span className="placeholder col-6"></span>
            </h5>
            <p className="placeholder-glow">
              <span className="placeholder col-12"></span>
              <span className="placeholder col-10"></span>
              <span className="placeholder col-8"></span>
            </p>
            <span className="btn btn-primary disabled placeholder col-4"></span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {String(error)}
        </div>
      )}

      {!loading && !error && producto && (
        <div className="row g-4">
          <div className="col-md-6">
            <GaleriaProducto producto={producto} />
          </div>
          <div className="col-md-6">
            <FichaProducto producto={producto} />
          </div>
        </div>
      )}
    </div>
  )
}
