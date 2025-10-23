/**
 * @file CheckoutPage.successFlow.test.jsx
 * Verifica el flujo de pago exitoso: dispara toast, vacía carrito y redirige a /compra
 */

import { render, screen, fireEvent, act } from '@testing-library/react'
import CheckoutPage from './CheckoutPage'
import { useCarrito } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'

// Mocks de dependencias
jest.mock('../context/CartContext')
jest.mock('../context/ToastContext')
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}))

describe('CheckoutPage - success flow', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('pago OK dispara toast, vacía carrito y redirige a /compra', async () => {
    // Mocks
    const mockNavigate = jest.fn()
    const mockVaciar = jest.fn()
    const mockShowToast = jest.fn()

    useNavigate.mockReturnValue(mockNavigate)
    useToast.mockReturnValue({ showToast: mockShowToast })
    useCarrito.mockReturnValue({
      listaItems: [
        { id: 1, name: 'Torta de Chocolate', price: 10000, qty: 1 }
      ],
      obtenerTotales: () => ({ sub: 10000, iva: 1900, total: 11900 }),
      vaciar: mockVaciar
    })

    // Render
    render(<CheckoutPage />)

    // Completar formulario
    fireEvent.change(screen.getByLabelText(/nombre y apellido/i), {
      target: { value: 'Juan Pérez' }
    })
    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: 'juan@correo.com' }
    })
    fireEvent.change(screen.getByLabelText(/teléfono/i), {
      target: { value: '+56911112222' }
    })
    fireEvent.change(screen.getByLabelText(/dirección/i), {
      target: { value: 'Calle Falsa 123' }
    })
    fireEvent.change(screen.getByLabelText(/comuna/i), {
      target: { value: 'Santiago' }
    })
    fireEvent.change(screen.getByLabelText(/fecha de entrega/i), {
      target: { value: '2099-12-12' }
    })
    fireEvent.change(screen.getByLabelText(/método de pago/i), {
      target: { value: 'webpay' }
    })

    // Click de pago
    fireEvent.click(screen.getByText(/pagar/i))

    // Espera a que el timeout y los efectos de React se procesen
    await act(async () => {
      jest.runAllTimers()
      await Promise.resolve() // fuerza ciclo del event loop
    })

    // Verificaciones
    expect(mockShowToast).toHaveBeenCalledTimes(1)
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Pago exitoso',
        variant: 'success'
      })
    )
    expect(mockVaciar).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/compra', { replace: true })
  })
})
