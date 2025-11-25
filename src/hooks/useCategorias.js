import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const RESPALDO_CATEGORIAS = [
  { id: 1, name: 'Tortas Cuadradas' },
  { id: 2, name: 'Tortas Circulares' },
  { id: 3, name: 'Postres Individuales' },
]

export function useCategorias() {
  const [listaCategorias, setListaCategorias] = useState(RESPALDO_CATEGORIAS)
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
          .from('categories')
          .select('id, name')
          .order('name', { ascending: true })
        if (error) throw error
        if (activo && data?.length) setListaCategorias(data)
      } catch (err) {
        if (activo) setErrorCarga(err?.message ?? String(err))
      } finally {
        if (activo) setLoadingCarga(false)
      }
    })()
    return () => { activo = false }
  }, [])

  return { listaCategorias, loadingCarga, errorCarga }
}
