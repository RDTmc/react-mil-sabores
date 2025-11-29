import { useEffect, useState, useMemo } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchMyOrders } from '../lib/apiClient'

export default function AccountPage() {
  const { user, isAuthenticated, loadingAuth } = useAuth()
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Paginación simple
  const [page, setPage] = useState(0)
  const pageSize = 5

  useEffect(() => {
    // Si aún estamos cargando auth, no hacemos nada
    if (loadingAuth) return

    // Si no está autenticado, no llamamos API
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    let active = true

    ;(async () => {
      try {
        setLoading(true)
        const data = await fetchMyOrders()
        if (!active) return
        setOrders(Array.isArray(data) ? data : [])
        setError(null)
      } catch (err) {
        console.error('Error al cargar pedidos', err)
        if (!active) return
        setError('No fue posible cargar tus pedidos. Inténtalo más tarde.')
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [isAuthenticated, loadingAuth])

  // Redirección suave si no está logueado
  if (!loadingAuth && !isAuthenticated) {
    return <Navigate to="/login?next=/micuenta" replace />
  }

  // Ordenamos del más reciente al más antiguo
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return db - da
    })
  }, [orders])

  // Reiniciar página cuando cambia el listado
  useEffect(() => {
    setPage(0)
  }, [orders.length])

  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / pageSize))

  const pagedOrders = useMemo(() => {
    const start = page * pageSize
    const end = start + pageSize
    return sortedOrders.slice(start, end)
  }, [sortedOrders, page])

  // Datos de perfil
  const userId = user?.id ?? user?.userId ?? '—'
  const roleRaw = (user?.role || '').toUpperCase()
  const roleLabel = roleRaw === 'ADMIN'
    ? 'Administrador'
    : 'Cliente'

  const handleVerDetalle = (order) => {
    try {
      // Guardamos la orden completa; CompraPage usa orderId || id, etc.
      sessionStorage.setItem('ms_last_order', JSON.stringify(order))
    } catch (e) {
      console.error('Error guardando orden en sessionStorage:', e)
    }
    navigate('/compra')
  }

  const formatStatus = (status) => {
    const s = (status || '').toUpperCase()
    if (!s) return { text: '—', className: 'badge bg-secondary' }

    if (s === 'CREATED') {
      return { text: 'Creada', className: 'badge bg-warning text-dark' }
    }
    if (s === 'PAID' || s === 'COMPLETED') {
      return { text: 'Pagada', className: 'badge bg-success' }
    }
    if (s === 'CANCELLED' || s === 'CANCELED') {
      return { text: 'Cancelada', className: 'badge bg-danger' }
    }
    if (s === 'PENDING') {
      return { text: 'Pendiente', className: 'badge bg-info text-dark' }
    }

    return { text: status, className: 'badge bg-secondary' }
  }

  return (
    <div className="container py-4">
      <h1 className="h3 mb-3">Mi Cuenta</h1>

      <div className="row g-3">
        {/* Perfil */}
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Perfil</h5>

              <p className="card-text mb-1">
                <strong>Nombre:</strong> {user?.fullName || '—'}
              </p>
              <p className="card-text mb-1">
                <strong>Email:</strong> {user?.email || '—'}
              </p>
              <p className="card-text mb-1">
                <strong>ID de cuenta:</strong> {userId}
              </p>
              <p className="card-text mb-3">
                <strong>Rol:</strong> {roleLabel}
              </p>
              <p className="card-text mb-3">
                <strong>Teléfono:</strong>{' '}
                {/* A futuro cuando el backend lo devuelva */}
                — 
              </p>

              <button className="btn btn-outline-secondary btn-sm" disabled>
                Editar perfil (próximamente)
              </button>
            </div>
          </div>
        </div>

        {/* Pedidos */}
        <div className="col-md-8">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Mis pedidos</h5>
                <span className="text-muted small">
                  Total: {sortedOrders.length} pedido(s)
                </span>
              </div>

              {error && (
                <div className="alert alert-danger py-2">
                  {error}
                </div>
              )}

              <div className="table-responsive mb-3">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th className="text-end">Total</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">
                          Cargando pedidos...
                        </td>
                      </tr>
                    )}

                    {!loading && sortedOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">
                          Sin pedidos
                        </td>
                      </tr>
                    )}

                    {!loading && pagedOrders.map((order, idx) => {
                      const total = Number(order.totalAmount ?? 0)
                      const discount = Number(order.discountAmount ?? 0)
                      const fecha = order.createdAt
                        ? new Date(order.createdAt).toLocaleString('es-CL')
                        : '—'
                      const itemsCount = Array.isArray(order.items) ? order.items.length : 0
                      const { text: statusText, className: statusClass } = formatStatus(order.status)

                      // Usamos solo los últimos 6–8 caracteres para mostrar ID corto
                      const idCorto = order.id
                        ? `...${String(order.id).slice(-8)}`
                        : '—'

                      return (
                        <tr key={order.id}>
                          <td>
                            <div className="small fw-semibold">
                              {page * pageSize + idx + 1}
                            </div>
                            <div className="small text-muted">
                              {idCorto}
                            </div>
                          </td>
                          <td>
                            <div>{fecha}</div>
                            {itemsCount > 0 && (
                              <div className="small text-muted">
                                {itemsCount} ítem(s)
                              </div>
                            )}
                          </td>
                          <td>
                            <span className={statusClass}>{statusText}</span>
                          </td>
                          <td className="text-end">
                            <div>
                              <strong>${total.toLocaleString('es-CL')}</strong>
                            </div>
                            {discount > 0 && (
                              <div className="small text-success">
                                -${discount.toLocaleString('es-CL')}{' '}
                                ({order.discountDescription || 'Descuento aplicado'})
                              </div>
                            )}
                          </td>
                          <td className="text-end">
                            <button
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                              onClick={() => handleVerDetalle(order)}
                            >
                              Ver detalle
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Paginación simple */}
              {!loading && sortedOrders.length > pageSize && (
                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    ← Anteriores
                  </button>
                  <span className="small text-muted">
                    Página {page + 1} de {totalPages}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  >
                    Siguientes →
                  </button>
                </div>
              )}

              <p className="text-muted small mb-0 mt-3">
                Aquí verás el historial de tus compras realizadas con esta cuenta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
