import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CheckoutPage from './CheckoutPage.jsx'

// ✅ Mock mínimo del carrito para que CheckoutPage no redirija por carrito vacío
jest.mock('../context/CartContext', () => ({
  useCarrito: () => ({
    listaItems: [{ id:'TC001', name:'Torta', price: 10000, qty: 1 }],
    obtenerTotales: () => ({ sub: 10000, iva: 1900, total: 11900 }),
    vaciarCarrito: jest.fn(),
  }),
}))

// ✅ Mock del Toast (por si se usa showToast internamente)
jest.mock('../context/ToastContext.jsx', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}))

describe('CheckoutPage - validación de Método de pago', () => {
  test('bloquea submit y muestra error si no se selecciona método de pago', () => {
    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    )

    // Rellenar TODOS los campos obligatorios excepto método de pago
    fireEvent.change(screen.getByLabelText(/Nombre y Apellido/i), { target: { value: 'Ana Rodríguez' } })
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'ana@test.com' } })
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '+56912345678' } })
    fireEvent.change(screen.getByLabelText(/Dirección de entrega/i), { target: { value: 'Calle 123' } })
    fireEvent.change(screen.getByLabelText(/Comuna/i), { target: { value: 'Santiago' } })

    // Fecha válida: hoy o posterior
    const hoy = new Date()
    const yyyy = hoy.getFullYear()
    const mm = String(hoy.getMonth() + 1).padStart(2, '0')
    const dd = String(hoy.getDate()).padStart(2, '0')
    const fechaHoy = `${yyyy}-${mm}-${dd}`
    fireEvent.change(screen.getByLabelText(/Fecha de entrega/i), { target: { value: fechaHoy } })

    // No seleccionar método de pago
    // fireEvent.change(screen.getByLabelText(/Método de pago/i), { target: { value: '' } }) // intentionally omitted

    // Intentar pagar
    const botonPagar = screen.getByRole('button', { name: /Pagar/i })
    fireEvent.click(botonPagar)

    // Debe mostrarse el error específico de método de pago
    expect(screen.getByText(/Selecciona un método de pago/i)).toBeInTheDocument()

    // Y el botón NO debe pasar a "Procesando…" (submit bloqueado)
    expect(botonPagar).toHaveTextContent(/Pagar/i)
  })
})
