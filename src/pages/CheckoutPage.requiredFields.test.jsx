import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CheckoutPage from './CheckoutPage'

// Mock de useCarrito (lista con un ítem + obtenerTotales(lista))
let mockUseCarritoImpl
jest.mock('../context/CartContext', () => ({
  __esModule: true,
  useCarrito: (...args) => mockUseCarritoImpl?.(...args),
}))

// Mock de useToast (capturamos showToast pero aquí no se usa)
jest.mock('../context/ToastContext.jsx', () => ({
  __esModule: true,
  useToast: () => ({ showToast: jest.fn() }) // sin variables externas
}))


describe('CheckoutPage - required fields', () => {
  beforeEach(() => {
    showToastSpy = jest.fn()
    mockUseCarritoImpl = jest.fn(() => ({
      listaItems: [{ id: 'p1', nombre: 'Cheesecake', precio: 9900, cantidad: 1 }],
      vaciarCarrito: jest.fn(),
      obtenerTotales: (items) => {
        const subtotal = items.reduce((a, i) => a + i.precio * i.cantidad, 0)
        return { cantidad: items.reduce((a, i) => a + i.cantidad, 0), subtotal, total: subtotal }
      }
    }))
  })

  it('marca inválidos y muestra mensajes al enviar vacío', () => {
    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    )

    // Enviar sin completar
    const btnPagar = screen.getByRole('button', { name: /pagar/i })
    fireEvent.click(btnPagar)

    // Todos los requeridos quedan con aria-invalid="true" y muestran error
    const nombre = screen.getByLabelText(/nombre y apellido/i)
    const email = screen.getByLabelText(/correo electr[oó]nico/i)
    const telefono = screen.getByLabelText(/tel[eé]fono/i)
    const direccion = screen.getByLabelText(/direcci[oó]n de entrega/i)
    const comuna = screen.getByLabelText(/comuna/i)
    const fecha = screen.getByLabelText(/fecha de entrega/i)
    const metodo = screen.getByLabelText(/m[eé]todo de pago/i)

    expect(nombre).toHaveAttribute('aria-invalid', 'true')
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(telefono).toHaveAttribute('aria-invalid', 'true')
    expect(direccion).toHaveAttribute('aria-invalid', 'true')
    expect(comuna).toHaveAttribute('aria-invalid', 'true')
    expect(fecha).toHaveAttribute('aria-invalid', 'true')
    expect(metodo).toHaveAttribute('aria-invalid', 'true')

    // Mensajes de error visibles
    const mensajes = screen.getAllByText(/obligatorio|selecciona|formato|ingresa|debe/i)
    expect(mensajes.length).toBeGreaterThanOrEqual(5)
  })
})
