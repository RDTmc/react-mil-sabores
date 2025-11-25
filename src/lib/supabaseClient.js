import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log('[Supabase] URL:', url ? '(ok)' : '(vacía)', 'KEY:', key ? '(ok)' : '(vacía)')
}

export const supabase = (url && key) ? createClient(url, key) : null
