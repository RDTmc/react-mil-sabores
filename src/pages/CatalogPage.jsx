// src/pages/CatalogPage.jsx
import { useEffect, useMemo, useState } from 'react'
import BarraFiltros from '../components/catalogo/BarraFiltros.jsx'
import GrillaDeProductos from '../components/catalogo/GrillaDeProductos.jsx'
import { fetchProducts, fetchCategories } from '../lib/apiClient'

// Mantiene los mismos nombres/props que ya usas en tu UI:
// - BarraFiltros: terminoDeBusqueda, onCambiarTerminoDeBusqueda, idCategoriaSeleccionada, onCambiarIdCategoriaSeleccionada, categorias
// - GrillaDeProductos: listaProductos

export default function CatalogPage() {
  // 1) CATEGORÍAS: ahora desde la API
  const [listaCategorias, setListaCategorias] = useState([])
  const [loadingCategorias, setLoadingCategorias] = useState(true)
  const [errorCategorias, setErrorCategorias] = useState(null)

  // 2) PRODUCTOS
  const [listaProductos, setListaProductos] = useState([])
  const [loadingCarga, setLoadingCarga] = useState(true)
  const [errorCarga, setErrorCarga] = useState(null)

  // 3) FILTROS UI (mismos nombres)
  const [terminoDeBusqueda, setTerminoDeBusqueda] = useState('')
  const [idCategoriaSeleccionada, setIdCategoriaSeleccionada] = useState('') // string del <select>

  // 4) Cargar categorías (una vez)
  useEffect(() => {
    let vivo = true
    ;(async () => {
      try {
        setLoadingCategorias(true); setErrorCategorias(null)
        const cats = await fetchCategories()
        if (!vivo) return
        setListaCategorias(cats ?? [])
      } catch (err) {
        if (vivo) setErrorCategorias(err?.response?.data?.message || err?.message || 'Error al cargar categorías')
      } finally {
        if (vivo) setLoadingCategorias(false)
      }
    })()
    return () => { vivo = false }
  }, [])

  // 5) Cargar productos cuando cambian filtros (servidor aplica filtros)
  useEffect(() => {
    let vivo = true
    ;(async () => {
      try {
        setLoadingCarga(true); setErrorCarga(null)
        const q = terminoDeBusqueda?.trim() || undefined
        const categoryId = idCategoriaSeleccionada ? Number(idCategoriaSeleccionada) : undefined
        const data = await fetchProducts({ page: 0, size: 48, q, categoryId })
        if (!vivo) return
        setListaProductos(Array.isArray(data?.items) ? data.items : [])
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log(`[Catalogo] Cargados ${data?.items?.length ?? 0} productos (q=${q||'-'} cat=${categoryId||'-'})`)
        }
      } catch (err) {
        if (vivo) setErrorCarga(err?.response?.data?.message || err?.message || 'Error al cargar catálogo')
      } finally {
        if (vivo) setLoadingCarga(false)
      }
    })()
    return () => { vivo = false }
  }, [terminoDeBusqueda, idCategoriaSeleccionada])

  // 6) (Opcional) Filtrado en memoria — ahora ya no es necesario, pero mantenemos tu contrato:
  const listaProductosFiltrada = useMemo(() => listaProductos, [listaProductos])

  const estaCargando = loadingCarga || loadingCategorias
  const errorGlobal = errorCarga || errorCategorias

  return (
    <div className="container py-3">
      <h1 className="h3 mb-3">Catálogo</h1>

      <BarraFiltros
        terminoDeBusqueda={terminoDeBusqueda}
        onCambiarTerminoDeBusqueda={setTerminoDeBusqueda}
        idCategoriaSeleccionada={idCategoriaSeleccionada}
        onCambiarIdCategoriaSeleccionada={setIdCategoriaSeleccionada}
        categorias={listaCategorias}
      />

      {estaCargando && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          {Array.from({length: 6}).map((_, i) => (
            <div className="col" key={i}>
              <div className="card h-100">
                <div className="ratio ratio-4x3 bg-light placeholder" />
                <div className="card-body">
                  <h5 className="placeholder-glow">
                    <span className="placeholder col-8"></span>
                  </h5>
                  <p className="placeholder-glow">
                    <span className="placeholder col-12"></span>
                    <span className="placeholder col-10"></span>
                  </p>
                  <div className="d-flex justify-content-between">
                    <span className="placeholder col-3"></span>
                    <span className="btn btn-outline-secondary disabled placeholder col-4"></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {errorGlobal && (
        <div className="alert alert-danger">
          <strong>No se pudo cargar el catálogo.</strong><br />
          {String(errorGlobal)}
        </div>
      )}

      {!estaCargando && !errorGlobal && (
        <GrillaDeProductos listaProductos={listaProductosFiltrada} />
      )}
    </div>
  )
}