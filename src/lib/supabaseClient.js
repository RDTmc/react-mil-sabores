import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = (url && anon) ? createClient(url, anon) : null;

if (!url || !anon) {
    console.warn('[MilSabores] Supabase env vars faltan. La app seguirá con mocks hasta que las agregues.');
  }