// src/pages/CatalogPage.jsx
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import BarraFiltros from '../components/catalogo/BarraFiltros.jsx'
import GrillaDeProductos from '../components/catalogo/GrillaDeProductos.jsx'
import { useCategorias } from '../hooks/useCategorias'

export default function CatalogPage() {
  // 1) CATEGORÍAS: vienen del hook
  const {
    listaCategorias,
    loadingCarga: loadingCategorias,
    errorCarga: errorCategorias
  } = useCategorias()

  // 2) PRODUCTOS: estados locales
  const [listaProductos, setListaProductos] = useState([])
  const [loadingCarga, setLoadingCarga] = useState(true)
  const [errorCarga, setErrorCarga] = useState(null)

  // 3) FILTROS UI
  const [terminoDeBusqueda, setTerminoDeBusqueda] = useState('')
  const [idCategoriaSeleccionada, setIdCategoriaSeleccionada] = useState('') // string del <select>

  // 4) CARGA DE PRODUCTOS (solo productos)
  useEffect(() => {
    let activo = true

    async function cargarProductos() {
      if (!supabase) {
        if (activo) {
          setLoadingCarga(false)
          setErrorCarga('Supabase no está configurado. Revisa tu .env')
        }
        return
      }
      try {
        if (activo) {
          setLoadingCarga(true)
          setErrorCarga(null)
        }

        const { data: prods, error } = await supabase
          .from('products')
          .select('id, name, price, image_path, description, category_id')
          .order('name')

        if (error) throw error
        if (!activo) return
        setListaProductos(prods ?? [])

        if (import.meta.env.DEV) {
          console.log(`[Catalogo] Cargados ${prods?.length ?? 0} productos.`)
        }
      } catch (err) {
        if (activo) setErrorCarga(err?.message || 'Error al cargar catálogo')
      } finally {
        if (activo) setLoadingCarga(false)
      }
    }

    cargarProductos()
    return () => { activo = false }
  }, [])

  // 5) APLICAR FILTROS EN MEMORIA
  const listaProductosFiltrada = useMemo(() => {
    const texto = terminoDeBusqueda.trim().toLowerCase()
    const categoriaNumero = idCategoriaSeleccionada ? Number(idCategoriaSeleccionada) : null

    return listaProductos.filter(p => {
      const coincideCategoria = categoriaNumero ? p.category_id === categoriaNumero : true
      const coincideTexto = texto
        ? (p.name?.toLowerCase().includes(texto) || p.description?.toLowerCase().includes(texto))
        : true
      return coincideCategoria && coincideTexto
    })
  }, [listaProductos, terminoDeBusqueda, idCategoriaSeleccionada])

  // 6) FLAGS combinados de carga/errores para mostrar UI
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
