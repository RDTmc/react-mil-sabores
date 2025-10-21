import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'
import GaleriaProducto from '../components/producto/GaleriaProducto'
import FichaProducto from '../components/producto/FichaProducto'

export default function ProductPage() {
  const { id: idProductoDeRuta } = useParams();
  const [producto, setProducto] = useState(null);
  const [loadingCarga, setLoadingCarga] = useState(!!supabase)

  useEffect(() => {
    if (!supabase) return
    let activo = true
    ;(async () => {
      setLoadingCarga(true)
      const { data } = await supabase
        .from('products')
        .select('id, name, price, image_path, description, sizes')
        .eq('id', idProductoDeRuta)
        .maybeSingle()
      if (!activo) return
      setProducto(data ?? null)
      setLoadingCarga(false)
    })()
    return () => { activo = false }
  }, [idProductoDeRuta])

  return (
    <div className="container py-3">
      {loadingCarga ? <p className="text-muted">Cargando…</p> : (
        producto ? (
          <div className="row g-4">
            <div className="col-md-6"><GaleriaProducto imagen={producto.image_path} /></div>
            <div className="col-md-6"><FichaProducto producto={producto} /></div>
          </div>
        ) : <div className="alert alert-warning">Producto no encontrado.</div>
      )}
    </div>
  )
}
