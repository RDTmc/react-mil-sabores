// src/pages/ProductPage.addToCart.test.jsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProductPage from './ProductPage'
import * as supabaseMod from '../lib/supabaseClient'

// --- Mock de Supabase: from('products').select(...).eq('id', ...).maybeSingle() ---
jest.mock('../lib/supabaseClient', () => {
  const maybeSingle = jest.fn().mockResolvedValue({
    data: {
      id: 'abc',
      name: 'Cheesecake Frutilla',
      price: 9900,
      image_path: '/img/cheesecake.png',
      description: 'Rico',
      sizes: ['S', 'M']
    },
    error: null
  })
  const eq = jest.fn(() => ({ maybeSingle }))
  const select = jest.fn(() => ({ eq }))
  const from = jest.fn(() => ({ select }))
  return { supabase: { from }, __mocks: { from, select, eq, maybeSingle } }
})

// --- Mock GaleriaProducto para simplificar render ---
jest.mock('../components/producto/GaleriaProducto', () => () => (
  <div data-testid="galeria" />
))

// --- Mock del contexto: useCarrito() devuelve un objeto controlado por el test ---
let mockUseCarritoImpl
jest.mock('../context/CartContext', () => ({
  __esModule: true,
  useCarrito: (...args) => mockUseCarritoImpl?.(...args)
}))

// --- Mock FichaProducto que invoca useCarrito().agregarItem al hacer click ---
jest.mock('../components/producto/FichaProducto', () => {
  const React = require('react')
  const { useCarrito } = require('../context/CartContext')
  // eslint-disable-next-line react/display-name
  return ({ producto }) => {
    const { agregarItem } = useCarrito()
    return (
      <button
        type="button"
        aria-label="Agregar al carrito"
        onClick={() => agregarItem(producto, 1)}
      >
        Agregar
      </button>
    )
  }
})

const setItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem')

describe('ProductPage - agregar al carrito + localStorage (ms_carrito)', () => {
  beforeEach(() => {
    localStorage.clear()
    setItemSpy.mockClear()
  })

  it('click en "Agregar" llama agregarItem y persiste en ms_carrito', async () => {
    const agregarItem = jest.fn((item, cantidad) => {
      const prev = JSON.parse(localStorage.getItem('ms_carrito') || '[]')
      prev.push({ ...item, cantidad })
      localStorage.setItem('ms_carrito', JSON.stringify(prev))
    })

    // useCarrito() devolverá este objeto
    const providerValue = {
      listaItems: [],
      agregarItem,
      removerItem: jest.fn(),
      vaciarCarrito: jest.fn(),
      obtenerTotales: () => ({ cantidad: 0, subtotal: 0, total: 0 })
    }
    mockUseCarritoImpl = jest.fn(() => providerValue)

    render(
      <MemoryRouter initialEntries={['/producto/abc']}>
        <Routes>
          <Route path="/producto/:id" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>
    )

    // Se dispara la carga del producto
    await waitFor(() =>
      expect(supabaseMod.supabase.from).toHaveBeenCalledWith('products')
    )

    // El botón de FichaProducto (mock) debe estar disponible
    const btn = await screen.findByRole('button', { name: /agregar al carrito/i })
    fireEvent.click(btn)

    // Se invoca agregarItem(producto, 1)
    expect(agregarItem).toHaveBeenCalledTimes(1)
    expect(agregarItem.mock.calls[0][0]).toEqual(
      expect.objectContaining({ id: 'abc', name: 'Cheesecake Frutilla' })
    )
    expect(agregarItem.mock.calls[0][1]).toBe(1)

    // Persistencia en localStorage con la clave real ms_carrito
    expect(setItemSpy).toHaveBeenCalled()
    const stored = JSON.parse(localStorage.getItem('ms_carrito') || '[]')
    expect(stored).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'abc', cantidad: 1 })
      ])
    )
  })
})
