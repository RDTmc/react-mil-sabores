// src/pages/CheckoutPage.jsx
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CartContext'
import { useToast } from '../context/ToastContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { createOrder } from '../lib/apiClient'

const reglas = {
  nombreCompleto: v => !v ? 'El nombre es obligatorio.' :
    v.trim().length < 3 ? 'Indica tu nombre y apellido.' : '',
  email: v => !v ? 'El correo es obligatorio.' :
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Formato de correo no válido.' : '',
  telefono: v => !v ? 'El teléfono es obligatorio.' :
    !/^\+?\d{9,15}$/.test(v.replace(/\s|-/g, '')) ? 'Ingresa un teléfono válido (9–15 dígitos).' : '',
  direccion: v => !v ? 'La dirección es obligatoria.' :
    v.trim().length < 5 ? 'La dirección debe tener al menos 5 caracteres.' : '',
  comuna: v => !v ? 'Selecciona tu comuna.' : '',
  fechaEntrega: v => {
    if (!v) return 'Selecciona una fecha de entrega.'
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
    const f = new Date(v); f.setHours(0, 0, 0, 0)
    return f < hoy ? 'La fecha debe ser hoy o posterior.' : ''
  },
  metodoPago: v => !v ? 'Selecciona un método de pago.' : '',
  notas: _ => ''
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { listaItems, obtenerTotales, vaciar } = useCarrito()
  const totales = useMemo(() => obtenerTotales(listaItems), [listaItems, obtenerTotales])
  const { showToast } = useToast()
  const { isAuthenticated } = useAuth()

  const [valores, setValores] = useState({
    nombreCompleto: '', email: '', telefono: '', direccion: '', comuna: '',
    fechaEntrega: '', metodoPago: '', notas: ''
  })
  const [errores, setErrores] = useState({})
  const [tocados, setTocados] = useState({})
  const [enviando, setEnviando] = useState(false)

  // Si el usuario no está logeado, lo mandamos a login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?next=/checkout', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const validarCampo = (nombre, valor) => {
    const fn = reglas[nombre]
    const msg = fn ? fn(valor) : ''
    setErrores(prev => ({ ...prev, [nombre]: msg }))
    return msg
  }

  const manejarCambio = e => {
    const { name, value } = e.target
    setValores(p => ({ ...p, [name]: value }))
    if (tocados[name]) validarCampo(name, value)
  }

  const manejarBlur = e => {
    const { name, value } = e.target
    setTocados(p => ({ ...p, [name]: true }))
    validarCampo(name, value)
  }

  const validarFormulario = () => {
    const nuevos = {}
    Object.keys(valores).forEach(k => {
      const msg = validarCampo(k, valores[k])
      if (msg) nuevos[k] = msg
    })
    return nuevos
  }

  const manejarSubmit = async e => {
    e.preventDefault()
    setTocados(Object.fromEntries(Object.keys(valores).map(k => [k, true])))
    const errs = validarFormulario()
    if (Object.values(errs).some(Boolean)) return
    if (!listaItems || listaItems.length === 0) return

    try {
      setEnviando(true)

      // Construimos shippingAddress compacto para la orden
      const shippingAddress = [
        valores.direccion,
        valores.comuna,
        `Tel: ${valores.telefono}`,
        `Fecha entrega: ${valores.fechaEntrega}`,
        valores.notas ? `Notas: ${valores.notas}` : null
      ].filter(Boolean).join(' | ')

      // Mapeamos items del carrito al formato de OrderDtos.CreateOrderItemRequest
      const orderItems = listaItems.map(item => ({
        productId: String(item.id),
        productName: item.name,
        image: item.imagePath || null, // si no tienes imagePath en el item, puedes dejar null
        unitPrice: Number(item.price),
        quantity: Number(item.qty),
        size: item.size ?? null,
        flavor: null
      }))

      const order = await createOrder({
        paymentMethod: valores.metodoPago,
        shippingAddress,
        items: orderItems
      })

      // Guardar snapshot del pedido ANTES de vaciar el carrito, usando la respuesta real
      try {
        sessionStorage.setItem('ms_last_order', JSON.stringify({
          orderId: order.id,
          userId: order.userId,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod,
          shippingAddress: order.shippingAddress,
          createdAt: order.createdAt,
          items: order.items
        }))
      } catch (err) {
        console.error('Error guardando pedido en sessionStorage:', err)
      }

      // Vaciar carrito (ms-cart + estado local)
      await vaciar()

      // Toast de éxito
      showToast({
        title: 'Pedido creado',
        message: 'Tu orden fue creada correctamente.',
        variant: 'success',
        delay: 4000
      })

      // Navegar a la página de confirmación
      navigate('/compra', { replace: true })
    } catch (err) {
      console.error('Error al crear orden:', err)
      const backendMsg = err?.response?.data?.message
      showToast({
        title: 'Error',
        message: backendMsg || err?.message || 'No fue posible crear tu pedido.',
        variant: 'danger',
        delay: 5000
      })
    } finally {
      setEnviando(false)
    }
  }

  if (!listaItems || listaItems.length === 0) {
    return (
      <div className="container py-4">
        <h1 className="h4 mb-3">Confirmar pedido</h1>
        <div className="alert alert-warning">
          Tu carrito está vacío. Agrega productos antes de continuar con el pago.
        </div>
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-secondary" to="/catalogo">Ir al catálogo</Link>
          <Link className="btn btn-dark" to="/carrito">Ir al carrito</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-3">
      <h1 className="h3 mb-3">Confirmar pedido</h1>

      <form noValidate onSubmit={manejarSubmit} className="row g-3">
        <div className="col-md-6">
          <label htmlFor="nombreCompleto" className="form-label">Nombre y Apellido</label>
          <input
            type="text" name="nombreCompleto" id="nombreCompleto"
            className={`form-control ${errores.nombreCompleto && tocados.nombreCompleto ? 'is-invalid' : ''}`}
            value={valores.nombreCompleto} onChange={manejarCambio} onBlur={manejarBlur}
            aria-invalid={!!(errores.nombreCompleto && tocados.nombreCompleto)}
            aria-describedby="err-nombre"
            placeholder="Ej: Ana Rodríguez"
          />
          {errores.nombreCompleto && tocados.nombreCompleto && (
            <div id="err-nombre" className="invalid-feedback">{errores.nombreCompleto}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="email" className="form-label">Correo electrónico</label>
          <input
            type="email" name="email" id="email"
            className={`form-control ${errores.email && tocados.email ? 'is-invalid' : ''}`}
            value={valores.email} onChange={manejarCambio} onBlur={manejarBlur}
            aria-invalid={!!(errores.email && tocados.email)}
            aria-describedby="err-email"
            placeholder="tu@correo.com"
          />
          {errores.email && tocados.email && (
            <div id="err-email" className="invalid-feedback">{errores.email}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="telefono" className="form-label">Teléfono</label>
          <input
            type="tel" name="telefono" id="telefono"
            className={`form-control ${errores.telefono && tocados.telefono ? 'is-invalid' : ''}`}
            value={valores.telefono} onChange={manejarCambio} onBlur={manejarBlur}
            aria-invalid={!!(errores.telefono && tocados.telefono)}
            aria-describedby="err-telefono"
            placeholder="+56912345678"
          />
          {errores.telefono && tocados.telefono && (
            <div id="err-telefono" className="invalid-feedback">{errores.telefono}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="comuna" className="form-label">Comuna</label>
          <select
            name="comuna" id="comuna"
            className={`form-select ${errores.comuna && tocados.comuna ? 'is-invalid' : ''}`}
            value={valores.comuna} onChange={manejarCambio} onBlur={manejarBlur}
            aria-invalid={!!(errores.comuna && tocados.comuna)}
            aria-describedby="err-comuna"
          >
            <option value="">Selecciona…</option>
            <option>Santiago</option>
            <option>Maipú</option>
            <option>Puente Alto</option>
            <option>Providencia</option>
          </select>
          {errores.comuna && tocados.comuna && (
            <div id="err-comuna" className="invalid-feedback">{errores.comuna}</div>
          )}
        </div>

        <div className="col-12">
          <label htmlFor="direccion" className="form-label">Dirección de entrega</label>
          <input
            type="text" name="direccion" id="direccion"
            className={`form-control ${errores.direccion && tocados.direccion ? 'is-invalid' : ''}`}
            value={valores.direccion} onChange={manejarCambio} onBlur={manejarBlur}
            aria-invalid={!!(errores.direccion && tocados.direccion)}
            aria-describedby="err-direccion"
            placeholder="Calle 123, depto/casa"
          />
          {errores.direccion && tocados.direccion && (
            <div id="err-direccion" className="invalid-feedback">{errores.direccion}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="fechaEntrega" className="form-label">Fecha de entrega</label>
          <input
            type="date" name="fechaEntrega" id="fechaEntrega"
            className={`form-control ${errores.fechaEntrega && tocados.fechaEntrega ? 'is-invalid' : ''}`}
            value={valores.fechaEntrega} onChange={manejarCambio} onBlur={manejarBlur}
            aria-invalid={!!(errores.fechaEntrega && tocados.fechaEntrega)}
            aria-describedby="err-fecha"
          />
          {errores.fechaEntrega && tocados.fechaEntrega  && (
            <div id="err-fecha" className="invalid-feedback">{errores.fechaEntrega}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="metodoPago" className="form-label">Método de pago</label>
          <select
            name="metodoPago" id="metodoPago"
            className={`form-select ${errores.metodoPago && tocados.metodoPago ? 'is-invalid' : ''}`}
            value={valores.metodoPago} onChange={manejarCambio} onBlur={manejarBlur}
            aria-invalid={!!(errores.metodoPago && tocados.metodoPago)}
            aria-describedby="err-pago"
          >
            <option value="">Selecciona…</option>
            <option value="webpay">WebPay (tarjeta)</option>
            <option value="transferencia">Transferencia</option>
            <option value="efectivo">Efectivo a contraentrega</option>
          </select>
          {errores.metodoPago && tocados.metodoPago && (
            <div id="err-pago" className="invalid-feedback">{errores.metodoPago}</div>
          )}
        </div>

        <div className="col-12">
          <label htmlFor="notas" className="form-label">Notas (opcional)</label>
          <textarea
            name="notas" id="notas" rows="3" className="form-control"
            value={valores.notas} onChange={manejarCambio} onBlur={manejarBlur}
            placeholder="Instrucciones para la entrega, alergias, etc."
          />
        </div>

        <div className="col-12 d-flex justify-content-end gap-2">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => navigate('/carrito')}
            disabled={enviando}
          >
            Volver al carrito
          </button>
          <button className="btn btn-dark" type="submit" disabled={enviando}>
            {enviando
              ? 'Procesando pedido…'
              : `Pagar $${totales.total.toLocaleString('es-CL')}`}
          </button>
        </div>
      </form>
    </div>
  )
}
