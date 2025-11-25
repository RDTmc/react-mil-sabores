import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PaginaCarrito from './CartPage'

// --- Mock del contexto: useCarrito() controlado por el test ---
let mockUseCarritoImpl
jest.mock('../context/CartContext', () => ({
  __esModule: true,
  useCarrito: (...args) => mockUseCarritoImpl?.(...args)
}))

// --- Mock de TablaCarrito: muestra total y un botón para remover "Pie" (p2) ---
jest.mock('../components/carrito/TablaCarrito', () => {
  const React = require('react')
  const { useCarrito } = require('../context/CartContext')
  // eslint-disable-next-line react/display-name
  return () => {
    const { obtenerTotales, removerItem } = useCarrito()
    const [version, setVersion] = React.useState(0)
    const { total } = obtenerTotales()

    return (
      <div>
        <div aria-label="total-carrito">${total}</div>
        <button
          type="button"
          aria-label="Remover Pie"
          onClick={() => {
            removerItem('p2')
            // Fuerza re-render para volver a leer obtenerTotales() desde la fuente actualizada
            setVersion(v => v + 1)
          }}
        >
          Remover Pie
        </button>
      </div>
    )
  }
})

const setItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem')

// Helpers para persistencia bajo la clave real
const KEY = 'ms_carrito'
const readLS = () => JSON.parse(localStorage.getItem(KEY) || '[]')
const writeLS = (arr) => localStorage.setItem(KEY, JSON.stringify(arr))

describe('CartPage - remover item recalcula totales y persiste', () => {
  beforeEach(() => {
    localStorage.clear()
    setItemSpy.mockClear()
    // Estado inicial: Brownie x2 ($2000 c/u) + Pie x1 ($3000) => total 7000
    writeLS([
      { id: 'p1', nombre: 'Brownie', precio: 2000, cantidad: 2 },
      { id: 'p2', nombre: 'Pie', precio: 3000, cantidad: 1 }
    ])

    // Implementación de useCarrito() conectada a localStorage
    mockUseCarritoImpl = jest.fn(() => ({
      listaItems: readLS(),
      removerItem: (id) => {
        const next = readLS().filter(i => i.id !== id)
        writeLS(next)
      },
      vaciarCarrito: () => writeLS([]),
      obtenerTotales: () => {
        const items = readLS()
        const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
        return { cantidad: items.reduce((a, i) => a + i.cantidad, 0), subtotal, total: subtotal }
      },
      agregarItem: jest.fn()
    }))
  })

  it('al remover un item, el total baja y localStorage se actualiza', () => {
    render(
      <MemoryRouter>
        <PaginaCarrito />
      </MemoryRouter>
    )

    // Total inicial 7000
    expect(screen.getByLabelText('total-carrito').textContent).toMatch(/7000/)

    // Remover "Pie" (p2)
    fireEvent.click(screen.getByRole('button', { name: /remover pie/i }))

    // Se persistió en localStorage
    expect(setItemSpy).toHaveBeenCalled()
    const stored = readLS()
    expect(stored.find(i => i.id === 'p2')).toBeUndefined()
    expect(stored.find(i => i.id === 'p1')).toBeDefined()

    // Total actualizado: quedan sólo Brownies (2 x 2000 = 4000)
    expect(screen.getByLabelText('total-carrito').textContent).toMatch(/4000/)
  })
})
