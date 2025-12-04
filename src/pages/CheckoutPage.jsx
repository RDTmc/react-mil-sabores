// src/pages/CheckoutPage.jsx
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CartContext'
import { useToast } from '../context/ToastContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { createOrder } from '../lib/apiClient'

// Reglas de validación por campo
const reglas = {
  nombreCompleto: (v) =>
    !v
      ? 'El nombre es obligatorio.'
      : v.trim().length < 3
      ? 'Indica tu nombre y apellido.'
      : '',
  email: (v) =>
    !v
      ? 'El correo es obligatorio.'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? 'Formato de correo no válido.'
      : '',
  telefono: (v) => {
    if (!v) return 'El teléfono es obligatorio.'
    const limpio = v.replace(/\s|-/g, '')
    return !/^\+?\d{9,15}$/.test(limpio)
      ? 'Ingresa un teléfono válido (9–15 dígitos).'
      : ''
  },
  direccion: (v) =>
    !v
      ? 'La dirección es obligatoria.'
      : v.trim().length < 5
      ? 'La dirección debe tener al menos 5 caracteres.'
      : '',
  comuna: (v) => (!v ? 'Selecciona tu comuna.' : ''),
  fechaEntrega: (v) => {
    if (!v) return 'Selecciona una fecha de entrega.'
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const f = new Date(v)
    f.setHours(0, 0, 0, 0)
    return f < hoy ? 'La fecha debe ser hoy o posterior.' : ''
  },
  metodoPago: (v) => (!v ? 'Selecciona un método de pago.' : ''),
  discountCode: _ => '',
  notas: (_) => '',
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { listaItems, obtenerTotales, vaciar } = useCarrito()
  const totales = useMemo(
    () => obtenerTotales(listaItems),
    [listaItems, obtenerTotales]
  )
  const { showToast } = useToast()
  const { isAuthenticated, user } = useAuth()

  const [valores, setValores] = useState({
  nombreCompleto: '',
  email: '',
  telefono: '',
  direccion: '',
  comuna: '',
  fechaEntrega: '',
  metodoPago: '',
  discountCode: '',   
  notas: ''
})

  const [errores, setErrores] = useState({})
  const [tocados, setTocados] = useState({})
  const [enviando, setEnviando] = useState(false)

  // Si el usuario no está logeado, lo mandamos a login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?next=/pedido', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // ⬅️ Pre-cargar nombre, correo y teléfono desde el usuario logeado
  useEffect(() => {
    if (!user) return

    setValores((prev) => ({
      ...prev,
      nombreCompleto: prev.nombreCompleto || user.fullName || '',
      email: prev.email || user.email || '',
      telefono: prev.telefono || user.phone || '',
    }))
  }, [user])

  const validarCampo = (nombre, valor) => {
    const fn = reglas[nombre]
    const msg = fn ? fn(valor) : ''
    setErrores((prev) => ({ ...prev, [nombre]: msg }))
    return msg
  }

  const manejarCambio = (e) => {
    const { name, value } = e.target
    setValores((p) => ({ ...p, [name]: value }))
    if (tocados[name]) validarCampo(name, value)
  }

  const manejarBlur = (e) => {
    const { name, value } = e.target
    setTocados((p) => ({ ...p, [name]: true }))
    validarCampo(name, value)
  }

  const validarFormulario = () => {
    const nuevos = {}
    Object.keys(valores).forEach((k) => {
      const msg = validarCampo(k, valores[k])
      if (msg) nuevos[k] = msg
    })
    return nuevos
  }

  // 🔎 Mensajes de promociones según el usuario
  const promoMensajes = useMemo(() => {
    if (!user) {
      return [
        'Si tienes un código de promoción (por ejemplo, FELICES50), úsalo al registrarte para que se aplique automáticamente en tus compras.',
      ]
    }

    const mensajes = []

    if (user.registrationCode === 'FELICES50') {
      mensajes.push(
        'Tienes activo el código FELICES50: 10% de descuento en todas tus compras realizadas con esta cuenta.'
      )
    }

    if (user.birthDate) {
      mensajes.push(
        'Tu fecha de nacimiento está registrada. Si corresponde, aplicaremos automáticamente beneficios por cumpleaños o adulto mayor.'
      )
    }

    if (mensajes.length === 0) {
      mensajes.push(
        'Si registras un código de promoción (como FELICES50) o tu fecha de nacimiento, aplicaremos automáticamente los descuentos disponibles en tus compras.'
      )
    }

    return mensajes
  }, [user])

  const manejarSubmit = async (e) => {
    e.preventDefault()

    // Marcamos todos como "tocados" para mostrar errores
    setTocados(
      Object.fromEntries(Object.keys(valores).map((k) => [k, true]))
    )

    const errs = validarFormulario()
    if (Object.values(errs).some(Boolean)) {
      // Al menos un campo con error → no enviamos
      return
    }

    if (!listaItems || listaItems.length === 0) return

    try {
      setEnviando(true)

      // Construimos la dirección de envío compacta
      const shippingAddress = [
        valores.direccion,
        valores.comuna,
        `Tel: ${valores.telefono}`,
        `Fecha entrega: ${valores.fechaEntrega}`,
        valores.notas ? `Notas: ${valores.notas}` : null,
      ]
        .filter(Boolean)
        .join(' | ')

      // Mapeamos items al formato de OrderDtos.CreateOrderItemRequest
      const orderItems = listaItems.map((item) => ({
        productId: String(item.id),
        productName: item.name,
        image: item.image_path || item.imagePath || null,
        unitPrice: Number(item.price),
        quantity: Number(item.qty),
        size: item.size ?? null,
        flavor: null,
      }))

      const order = await createOrder({
        paymentMethod: valores.metodoPago,
        shippingAddress,
        items: orderItems,
        discountCode: valores.discountCode?.trim() || null
      })


      // Guardamos snapshot de la orden en sessionStorage
      try {
        sessionStorage.setItem(
          'ms_last_order',
          JSON.stringify({
            orderId: order.id,
            userId: order.userId,
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            shippingAddress: order.shippingAddress,
            createdAt: order.createdAt,
            items: order.items,
            subtotalAmount: order.subtotalAmount,
            discountAmount: order.discountAmount,
            discountCode: order.discountCode,
            discountDescription: order.discountDescription,
          })
        )
      } catch (err) {
        console.error('Error guardando pedido en sessionStorage:', err)
      }

      // Vaciar carrito
      await vaciar()

      // Toast de éxito
      showToast({
        title: 'Pedido creado',
        message: 'Tu orden fue creada correctamente.',
        variant: 'success',
        delay: 4000,
      })

      // Ir al comprobante
      navigate('/compra', { replace: true })
    } catch (err) {
      console.error('Error al crear orden:', err)
      const backendMsg = err?.response?.data?.message
      showToast({
        title: 'Error',
        message:
          backendMsg || err?.message || 'No fue posible crear tu pedido.',
        variant: 'danger',
        delay: 5000,
      })
    } finally {
      setEnviando(false)
    }
  }

  // Si el carrito está vacío, no mostramos el formulario
  if (!listaItems || listaItems.length === 0) {
    return (
      <div className="container py-4">
        <h1 className="h4 mb-3">Confirmar pedido</h1>
        <div className="alert alert-warning">
          Tu carrito está vacío. Agrega productos antes de continuar con el
          pago.
        </div>
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-secondary" to="/catalogo">
            Ir al catálogo
          </Link>
          <Link className="btn btn-dark" to="/carrito">
            Ir al carrito
          </Link>
        </div>
      </div>
    )
  }

  const hayErroresVisibles = Object.values(errores).some(Boolean)

  return (
    <div className="container py-3">
      <h1 className="h3 mb-3">Confirmar pedido</h1>

      {/* Sección de promociones y beneficios */}
      <div className="alert alert-info" role="status">
        <h2 className="h6 mb-1">Promociones y beneficios</h2>
        <ul className="mb-0 ps-3">
          {promoMensajes.map((m) => (
            <li key={m} className="small">
              {m}
            </li>
          ))}
        </ul>
      </div>

      <form noValidate onSubmit={manejarSubmit} className="row g-3">
        {/* Nombre */}
        <div className="col-md-6">
          <label htmlFor="nombreCompleto" className="form-label">
            Nombre y Apellido
          </label>
          <input
            type="text"
            name="nombreCompleto"
            id="nombreCompleto"
            className={`form-control ${
              errores.nombreCompleto && tocados.nombreCompleto
                ? 'is-invalid'
                : ''
            }`}
            value={valores.nombreCompleto}
            onChange={manejarCambio}
            onBlur={manejarBlur}
            aria-invalid={!!(errores.nombreCompleto && tocados.nombreCompleto)}
            aria-describedby="err-nombre"
            placeholder="Ej: Ana Rodríguez"
          />
          {errores.nombreCompleto && tocados.nombreCompleto && (
            <div id="err-nombre" className="invalid-feedback">
              {errores.nombreCompleto}
            </div>
          )}
        </div>

        {/* Email */}
        <div className="col-md-6">
          <label htmlFor="email" className="form-label">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className={`form-control ${
              errores.email && tocados.email ? 'is-invalid' : ''
            }`}
            value={valores.email}
            onChange={manejarCambio}
            onBlur={manejarBlur}
            aria-invalid={!!(errores.email && tocados.email)}
            aria-describedby="err-email"
            placeholder="tucorreo@ejemplo.com"
          />
          {errores.email && tocados.email && (
            <div id="err-email" className="invalid-feedback">
              {errores.email}
            </div>
          )}
        </div>

        {/* Teléfono */}
        <div className="col-md-6">
          <label htmlFor="telefono" className="form-label">
            Teléfono
          </label>
          <input
            type="tel"
            name="telefono"
            id="telefono"
            className={`form-control ${
              errores.telefono && tocados.telefono ? 'is-invalid' : ''
            }`}
            value={valores.telefono}
            onChange={manejarCambio}
            onBlur={manejarBlur}
            aria-invalid={!!(errores.telefono && tocados.telefono)}
            aria-describedby="err-telefono"
            placeholder="+56912345678"
          />
          {errores.telefono && tocados.telefono && (
            <div id="err-telefono" className="invalid-feedback">
              {errores.telefono}
            </div>
          )}
        </div>

        {/* Dirección */}
        <div className="col-md-6">
          <label htmlFor="direccion" className="form-label">
            Dirección de entrega
          </label>
          <input
            type="text"
            name="direccion"
            id="direccion"
            className={`form-control ${
              errores.direccion && tocados.direccion ? 'is-invalid' : ''
            }`}
            value={valores.direccion}
            onChange={manejarCambio}
            onBlur={manejarBlur}
            aria-invalid={!!(errores.direccion && tocados.direccion)}
            aria-describedby="err-direccion"
            placeholder="Ej: Av. Siempre Viva 742"
          />
          {errores.direccion && tocados.direccion && (
            <div id="err-direccion" className="invalid-feedback">
              {errores.direccion}
            </div>
          )}
        </div>

        {/* Comuna */}
        <div className="col-md-6">
          <label htmlFor="comuna" className="form-label">
            Comuna
          </label>
          <select
            name="comuna"
            id="comuna"
            className={`form-select ${
              errores.comuna && tocados.comuna ? 'is-invalid' : ''
            }`}
            value={valores.comuna}
            onChange={manejarCambio}
            onBlur={manejarBlur}
            aria-invalid={!!(errores.comuna && tocados.comuna)}
            aria-describedby="err-comuna"
          >
            <option value="">Selecciona tu comuna</option>
            <option value="Santiago">Santiago</option>
            <option value="Maipú">Maipú</option>
            <option value="Puente Alto">Puente Alto</option>
            <option value="La Florida">La Florida</option>
            <option value="Providencia">Providencia</option>
            <option value="Ñuñoa">Ñuñoa</option>
            {/* agrega más si quieres */}
          </select>
          {errores.comuna && tocados.comuna && (
            <div id="err-comuna" className="invalid-feedback">
              {errores.comuna}
            </div>
          )}
        </div>

        {/* Fecha de entrega */}
        <div className="col-md-3">
          <label htmlFor="fechaEntrega" className="form-label">
            Fecha de entrega
          </label>
          <input
            type="date"
            name="fechaEntrega"
            id="fechaEntrega"
            className={`form-control ${
              errores.fechaEntrega && tocados.fechaEntrega ? 'is-invalid' : ''
            }`}
            value={valores.fechaEntrega}
            onChange={manejarCambio}
            onBlur={manejarBlur}
            aria-invalid={!!(errores.fechaEntrega && tocados.fechaEntrega)}
            aria-describedby="err-fecha"
          />
          {errores.fechaEntrega && tocados.fechaEntrega && (
            <div id="err-fecha" className="invalid-feedback">
              {errores.fechaEntrega}
            </div>
          )}
        </div>

        {/* Codigo descuento */}  
        <div className="col-md-6">
          <label htmlFor="discountCode" className="form-label">
            Código de promoción <span className="text-muted">(opcional)</span>
          </label>
          <input
            type="text"
            name="discountCode"
            id="discountCode"
            className="form-control"
            value={valores.discountCode}
            onChange={manejarCambio}
            onBlur={manejarBlur}
            placeholder="Ej: FELICES50"
          />
          <div className="form-text">
            Si tienes un cupón como <strong>FELICES50</strong>, escríbelo aquí.
          </div>
        </div>


        {/* Método de pago */}
        <div className="col-md-3">
          <label htmlFor="metodoPago" className="form-label">
            Método de pago
          </label>
          <select
            name="metodoPago"
            id="metodoPago"
            className={`form-select ${
              errores.metodoPago && tocados.metodoPago ? 'is-invalid' : ''
            }`}
            value={valores.metodoPago}
            onChange={manejarCambio}
            onBlur={manejarBlur}
            aria-invalid={!!(errores.metodoPago && tocados.metodoPago)}
            aria-describedby="err-metodoPago"
          >
            <option value="">Selecciona un método</option>
            <option value="WEBPAY">Tarjeta (WebPay)</option>
            <option value="TRANSFERENCIA">Transferencia bancaria</option>
            <option value="EFECTIVO">Efectivo</option>
          </select>
          {errores.metodoPago && tocados.metodoPago && (
            <div id="err-metodoPago" className="invalid-feedback">
              {errores.metodoPago}
            </div>
          )}
        </div>

        {/* Notas opcionales */}
        <div className="col-12">
          <label htmlFor="notas" className="form-label">
            Notas para la entrega (opcional)
          </label>
          <textarea
            name="notas"
            id="notas"
            rows="2"
            className="form-control"
            value={valores.notas}
            onChange={manejarCambio}
            onBlur={manejarBlur}
            placeholder="Ej: Timbre en mal estado, llamar al llegar; velas para cumpleaños, etc."
          />
        </div>

        {/* Resumen y errores generales */}
        {hayErroresVisibles && (
          <div className="col-12">
            <div className="alert alert-danger py-2">
              Revisa los campos marcados en rojo antes de continuar con el
              pago.
            </div>
          </div>
        )}

        <div className="col-12 d-flex justify-content-between align-items-center">
          <div className="text-muted small">
            Total del pedido:{' '}
            <strong>
              ${totales.total.toLocaleString('es-CL')}
            </strong>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => navigate('/carrito')}
              disabled={enviando}
            >
              Volver al carrito
            </button>
            <button
              className="btn btn-dark"
              type="submit"
              disabled={enviando}
            >
              {enviando
                ? 'Procesando pedido…'
                : `Pagar $${totales.total.toLocaleString('es-CL')}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
