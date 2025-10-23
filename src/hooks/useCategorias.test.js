import { renderHook, waitFor } from '@testing-library/react'
import { useCategorias } from '../hooks/useCategorias'
import * as supabaseMod from '../lib/supabaseClient'

// Mock: supabase.from('categories').select('id, name').order('name', {ascending:true})
jest.mock('../lib/supabaseClient', () => {
  const order = jest.fn().mockResolvedValue({
    data: [
      { id: 1, name: 'Alfajores' },
      { id: 2, name: 'Berlines' }
    ],
    error: null
  })
  const select = jest.fn(() => ({ order }))
  const from = jest.fn(() => ({ select }))
  return { supabase: { from }, __mocks: { from, select, order } }
})

describe('useCategorias', () => {
  it('carga categorías desde Supabase y reemplaza el respaldo', async () => {
    const { result } = renderHook(() => useCategorias())

    // Estado inicial: cargando y con respaldo
    expect(result.current.loadingCarga).toBe(true)
    expect(Array.isArray(result.current.listaCategorias)).toBe(true)
    expect(result.current.listaCategorias.length).toBeGreaterThan(0)

    // Espera fetch
    await waitFor(() => expect(result.current.loadingCarga).toBe(false))

    // Sin error y con datos mock
    expect(result.current.errorCarga).toBeNull()
    expect(result.current.listaCategorias.map(c => c.name)).toEqual(['Alfajores','Berlines'])

    // Verifica llamada correcta
    expect(supabaseMod.supabase.from).toHaveBeenCalledWith('categories')
    expect(supabaseMod.__mocks.select).toHaveBeenCalledWith('id, name')
    expect(supabaseMod.__mocks.order).toHaveBeenCalledWith('name', { ascending: true })
  })

  it('si hay error, mantiene respaldo y setea errorCarga', async () => {
    supabaseMod.__mocks.order.mockResolvedValueOnce({ data: null, error: new Error('falló categories') })
    const { result } = renderHook(() => useCategorias())
    await waitFor(() => expect(result.current.loadingCarga).toBe(false))

    expect(result.current.listaCategorias.length).toBeGreaterThan(0) // respaldo
    expect(String(result.current.errorCarga)).toMatch(/falló categories/i)
  })
})
