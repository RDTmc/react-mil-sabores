import { useEffect, useState, useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchMyOrders } from '../lib/apiClient'

export default function AccountPage() {
  const { user, isAuthenticated, loadingAuth } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return db - da
    })
  }, [orders])

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
              <p className="card-text mb-3">
                <strong>Teléfono:</strong> {/* aún no lo tenemos del backend de auth */}
                {' '}— 
              </p>
              <button className="btn btn-outline-secondary btn-sm" disabled>
                Editar (próximamente)
              </button>
            </div>
          </div>
        </div>

        {/* Pedidos */}
        <div className="col-md-8">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Pedidos</h5>

              {error && (
                <div className="alert alert-danger py-2">
                  {error}
                </div>
              )}

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan={4} className="text-center text-muted">
                          Cargando pedidos...
                        </td>
                      </tr>
                    )}

                    {!loading && sortedOrders.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center text-muted">
                          Sin pedidos
                        </td>
                      </tr>
                    )}

                    {!loading && sortedOrders.map((order, idx) => {
                      const total = Number(order.totalAmount ?? 0)
                      const discount = Number(order.discountAmount ?? 0)
                      const fecha = order.createdAt
                        ? new Date(order.createdAt).toLocaleString('es-CL')
                        : '—'

                      return (
                        <tr key={order.id}>
                          <td>{idx + 1}</td>
                          <td>{fecha}</td>
                          <td>{order.status || '—'}</td>
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
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <p className="text-muted small mb-0">
                Aquí verás el historial de tus compras realizadas con esta cuenta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
