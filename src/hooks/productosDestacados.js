import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const RESPALDO_DESTACADOS = [
  { id: 'TC001', name: 'Torta Cuadrada de Chocolate', price: 45000, image_path: '/img/tc_chocolate.png' },
  { id: 'TT001', name: 'Torta Circular de Vainilla',  price: 40000, image_path: '/img/tt_vainilla.png'  },
  { id: 'PI001', name: 'Mousse de Chocolate',         price: 5000,  image_path: '/img/pi_mousse.png'    },
]

/**
 * Nota: dejamos el nombre de la función como `productosDestacados`
 * para respetar tu API pública actual.
 */
export function productosDestacados() {
  const [listaProductosDestacados, setListaProductosDestacados] = useState(RESPALDO_DESTACADOS)
  const [loadingCarga, setLoadingCarga] = useState(true)
  const [errorCarga, setErrorCarga] = useState(null)

  useEffect(() => {
    let activo = true
    ;(async () => {
      if (!supabase) {
        setLoadingCarga(false)
        setErrorCarga('Supabase no está configurado. Revisa tu .env')
        return
      }
      try {
        setLoadingCarga(true)
        const { data, error } = await supabase
          .from('featured_products')
          .select('position, products:product_id (id, name, price, image_path)')
          .order('position', { ascending: true })
        if (error) throw error

        const mapeado = (data ?? [])
          .map(reg => reg.products)
          .filter(Boolean)

        if (activo && mapeado.length) setListaProductosDestacados(mapeado)
      } catch (err) {
        if (activo) setErrorCarga(err?.message ?? String(err))
      } finally {
        if (activo) setLoadingCarga(false)
      }
    })()
    return () => { activo = false }
  }, [])

  return { listaProductosDestacados, loadingCarga, errorCarga }
}
