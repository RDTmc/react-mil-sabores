import { render, screen } from '@testing-library/react'
import HomePage from './HomePage'
import { MemoryRouter } from 'react-router-dom'

// Mock del hook productosDestacados exactamente como lo usas
jest.mock('../hooks/ProductosDestacados', () => ({
  productosDestacados: jest.fn(() => ({
    listaProductosDestacados: [
      { id: 'p1', nombre: 'Selva Negra', precio: 8900, imagen: '/img/1.png' },
      { id: 'p2', nombre: 'Tres Leches', precio: 7900, imagen: '/img/2.png' }
    ],
    loadingCarga: false,
    errorCarga: null
  }))
}))

// Mock de la grilla para observar props sin depender de su HTML interno
jest.mock('../components/home/GrillaDeDestacados', () => {
  // eslint-disable-next-line react/display-name
  return (props) => (
    <div data-testid="grilla-destacados" data-loading={String(props.loadingCarga)}>
      {props.listaProductosDestacados?.map(p => <span key={p.id}>{p.nombre}</span>)}
    </div>
  )
})

describe('HomePage - destacados tras skeleton', () => {
  it('renderiza la grilla con productos cuando loadingCarga=false', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    // La grilla recibió loading=false (ya no hay skeleton)
    const grilla = screen.getByTestId('grilla-destacados')
    expect(grilla).toBeInTheDocument()
    expect(grilla.getAttribute('data-loading')).toBe('false')

    // Nombres de productos (provenientes del hook mockeado)
    expect(screen.getByText(/selva negra/i)).toBeInTheDocument()
    expect(screen.getByText(/tres leches/i)).toBeInTheDocument()

    // (Opcional) Si HomePage muestra un heading "Destacados", puedes activar esto:
    // expect(screen.getByRole('heading', { name: /destacados/i })).toBeInTheDocument()
  })
})
