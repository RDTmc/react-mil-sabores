import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useFeatured() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('featured_products')
          .select('position, products:product_id (id, name, price, image_path)')
          .order('position', { ascending: true })
        if (error) throw error

        const mapped = (data ?? [])
          .map(r => r.products)
          .filter(Boolean)

        if (active) setItems(mapped)
      } catch (e) {
        setError(e)
      } finally {
        setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  return { items, loading, error }
}
