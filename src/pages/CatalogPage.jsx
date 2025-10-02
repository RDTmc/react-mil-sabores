import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import BarraFiltros from '../components/catalogo/BarraFiltros'
import GrillaDeProductos from '../components/catalogo/GrillaDeProductos'

export default function CatalogPage() {
  const [loading, setLoading] = useState(!!supabase)
  const [listaCategorias, setListaCategorias] = useState([])
  const [listaProductos, setListaProductos] = useState([])
  const [terminoDeBusqueda, setTerminoDeBusqueda] = useState('')
  const [idCategoriaSeleccionada, cambiarIdCategoriaSeleccionada] = useState('')

  useEffect(() => {
    if (!supabase) return
    let activo = true
    ;(async () => {
      setLoading(true)
      const [{ data: cats }, { data: prods }] = await Promise.all([
        supabase.from('categories').select('id, name').order('name'),
        supabase.from('products').select('id, name, price, image_path, description, category_id').order('name')
      ])
      if (!activo) return
      setListaCategorias(cats ?? [])
      setListaProductos(prods ?? [])
      setLoading(false)
    })()
    return () => { activo = false }
  }, [])

  const listaProductosFiltrada  = useMemo(() => {
    const texto = terminoDeBusqueda.trim().toLowerCase()
    return listaProductos.filter(p => {
      const coincideCategoria  = idCategoriaSeleccionada ? p.category_id === Number(idCategoriaSeleccionada) : true
      const coincideTexto = texto ? (p.name?.toLowerCase().includes(texto) || p.description?.toLowerCase().includes(texto)) : true
      return coincideCategoria && coincideTexto
    })
  }, [listaProductos, terminoDeBusqueda, idCategoriaSeleccionada])

  return (
    <div className="container py-3">
      <h1 className="h3 mb-3">Catálogo</h1>
      <BarraFiltros 
        terminoDeBusqueda={terminoDeBusqueda} 
        setTerminoDeBusqueda={setTerminoDeBusqueda} 
        idCategoriaSeleccionada={idCategoriaSeleccionada} 
        cambiarIdCategoriaSeleccionada={cambiarIdCategoriaSeleccionada} 
        categorias={listaCategorias} />
      {loading ? <p className="text-muted">Cargando…</p> : <GrillaDeProductos listaProductos={listaProductosFiltrada} />}
    </div>
  )
}
