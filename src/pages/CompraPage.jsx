// src/pages/CompraPage.jsx
import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function CompraPage() {
  const { user } = useAuth()
  const [pedido, setPedido] = useState(null)

  // Cargar el último pedido desde sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('ms_last_order')
      setPedido(raw ? JSON.parse(raw) : null)
    } catch {
      setPedido(null)
    }
  }, [])

  // Normalizamos el shape del pedido (aunque sea null)
  const normalized = useMemo(() => {
    if (!pedido) {
      return {
        items: [],
        subtotalAmount: 0,
        discountAmount: 0,
        discountCode: null,
        discountDescription: null,
        totalAmount: 0,
        createdAt: null,
        shippingAddress: '',
        paymentMethod: '',
      }
    }

    return {
      items: Array.isArray(pedido.items) ? pedido.items : [],
      subtotalAmount: Number(pedido.subtotalAmount ?? pedido.totalAmount ?? 0),
      discountAmount: Number(pedido.discountAmount ?? 0),
      discountCode: pedido.discountCode ?? null,
      discountDescription: pedido.discountDescription ?? null,
      totalAmount: Number(pedido.totalAmount ?? 0),
      createdAt: pedido.createdAt ?? null,
      shippingAddress: pedido.shippingAddress ?? '',
      paymentMethod: pedido.paymentMethod ?? '',
    }
  }, [pedido])

  const {
    items,
    subtotalAmount,
    discountAmount,
    discountCode,
    discountDescription,
    totalAmount,
    createdAt,
    shippingAddress,
    paymentMethod,
  } = normalized

  // Etiqueta legible para el método de pago
  const paymentMethodLabel = useMemo(() => {
    const pm = (paymentMethod || '').toLowerCase()

    switch (pm) {
      case 'webpay':
      case 'card':
        return 'Tarjeta (WebPay)'
      case 'transferencia':
      case 'transfer':
        return 'Transferencia bancaria'
      case 'efectivo':
      case 'cash':
        return 'Efectivo'
      default:
        return paymentMethod || 'No especificado'
    }
  }, [paymentMethod])

  const nombre = user?.fullName || 'Cliente Mil Sabores'
  const correo = user?.email || ''

  const handlePrint = () => window.print()

  // IVA aproximado (19 %) incluido en el total
  const total = totalAmount || 0
  const netoAprox = total > 0 ? Math.round(total / 1.19) : 0
  const iva = total > 0 ? total - netoAprox : 0

  const hasPedido = !!pedido

  return (
    <div className="container py-4">
      {!hasPedido ? (
        <>
          <h1 className="h4 mb-3">Confirmación de compra</h1>
          <div className="alert alert-info">
            No encontramos una compra reciente en esta sesión.
          </div>
          <div className="d-flex flex-wrap gap-2">
            <Link className="btn btn-dark" to="/catalogo">Ir al catálogo</Link>
            <Link className="btn btn-outline-secondary" to="/">Volver al inicio</Link>
          </div>
        </>
      ) : (
        <>
          {/* Encabezado */}
          <div className="mb-4">
            <h1 className="h3 mb-2">¡Gracias por comprar con nosotros!</h1>
            <p className="text-muted mb-0">
              Tu compra fue procesada correctamente. Enviaremos la confirmación a{' '}
              <strong>{correo || 'tu correo registrado'}</strong>.
            </p>
          </div>

          {/* Resumen */}
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                <h2 className="h5 mb-0">Resumen del pedido</h2>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    type="button"
                    onClick={handlePrint}
                  >
                    Imprimir comprobante
                  </button>
                  <Link className="btn btn-dark btn-sm" to="/catalogo">
                    Seguir comprando
                  </Link>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div><strong>Cliente:</strong> {nombre}</div>
                  <div><strong>Correo:</strong> {correo || '—'}</div>
                  <div><strong>Método de pago:</strong> {paymentMethodLabel}</div>
                </div>
                <div className="col-md-6 text-md-end">
                  <div>
                    <strong>Fecha:</strong>{' '}
                    {createdAt ? new Date(createdAt).toLocaleString('es-CL') : '--'}
                  </div>
                  <div>
                    <strong>Dirección:</strong>{' '}
                    {shippingAddress || '—'}
                  </div>
                </div>
              </div>

              {/* Si hubo promoción, la mostramos destacada */}
              {discountAmount > 0 && (
                <div className="alert alert-success py-2">
                  <strong>Promoción aplicada:</strong>{' '}
                  {discountDescription || discountCode || 'Descuento especial en tu compra.'}
                </div>
              )}

              {/* Tabla de productos */}
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th className="text-center">Cant.</th>
                      <th className="text-end">Precio</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it) => {
                      const nombreProd = it.productName ?? it.nombre ?? it.name ?? 'Producto'
                      const precio = Number(it.unitPrice ?? it.precio ?? it.price ?? 0)
                      const cantidad = Number(it.quantity ?? it.cantidad ?? 1)
                      const sub = precio * cantidad
                      return (
                        <tr key={it.id ?? `${nombreProd}-${precio}-${cantidad}`}>
                          <td>{nombreProd}</td>
                          <td className="text-center">{cantidad}</td>
                          <td className="text-end">
                            ${precio.toLocaleString('es-CL')}
                          </td>
                          <td className="text-end">
                            ${sub.toLocaleString('es-CL')}
                          </td>
                        </tr>
                      )
                    })}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center text-muted">Sin ítems</td>
                      </tr>
                    )}
                  </tbody>

                  <tfoot className="table-borderless">
                    <tr>
                      <td colSpan="3" className="text-end">
                        <strong>Subtotal (antes de descuentos):</strong>
                      </td>
                      <td className="text-end">
                        ${subtotalAmount.toLocaleString('es-CL')}
                      </td>
                    </tr>

                    {discountAmount > 0 && (
                      <tr>
                        <td colSpan="3" className="text-end text-success">
                          <strong>Descuento promoción:</strong>
                        </td>
                        <td className="text-end text-success">
                          -${discountAmount.toLocaleString('es-CL')}
                        </td>
                      </tr>
                    )}

                    <tr>
                      <td colSpan="3" className="text-end">
                        <strong>IVA (19 % aprox.):</strong>
                      </td>
                      <td className="text-end">
                        ${iva.toLocaleString('es-CL')}
                      </td>
                    </tr>

                    <tr className="table-light">
                      <td colSpan="3" className="text-end fs-5">
                        <strong>Total a pagar:</strong>
                      </td>
                      <td className="text-end fs-5">
                        <strong>${total.toLocaleString('es-CL')}</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Botones inferiores */}
              <div className="d-flex flex-wrap gap-2 justify-content-end mt-3">
                <Link className="btn btn-outline-secondary" to="/micuenta">
                  Ver mis pedidos
                </Link>
                <Link className="btn btn-dark" to="/">
                  Ir al inicio
                </Link>
              </div>
            </div>
          </div>

          {/* Síguenos */}
          <section aria-labelledby="siguenos" className="mb-3">
            <h2 id="siguenos" className="h5 mb-2">Síguenos</h2>
            <ul className="list-inline mb-0">
              <li className="list-inline-item me-2">
                <a className="btn btn-outline-dark btn-sm" href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li className="list-inline-item me-2">
                <a className="btn btn-outline-dark btn-sm" href="https://www.facebook.com/" target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>
              <li className="list-inline-item">
                <a className="btn btn-outline-dark btn-sm" href="https://www.tiktok.com/" target="_blank" rel="noreferrer">
                  TikTok
                </a>
              </li>
            </ul>
          </section>
        </>
      )}
    </div>
  )
}
