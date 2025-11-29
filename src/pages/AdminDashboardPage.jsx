import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchAdminLatestOrders } from '../lib/apiClient'

export default function AdminDashboardPage() {
  const { user, isAuthenticated, loadingAuth } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar últimas órdenes para el dashboard admin
  useEffect(() => {
    if (loadingAuth) return

    // Si no está autenticado, no llamamos al backend
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    let active = true

    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        // Traemos, por ejemplo, las últimas 10 órdenes
        const data = await fetchAdminLatestOrders(10)
        if (!active) return

        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('[AdminDashboard] Error al cargar últimas órdenes', err)
        if (!active) return

        const status = err?.response?.status
        if (status === 403) {
          setError('Acceso restringido. Debes ser administrador para ver este panel.')
        } else {
          setError('No fue posible cargar las últimas órdenes. Inténtalo más tarde.')
        }
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [isAuthenticated, loadingAuth])

  // Redirección suave si NO está logueado
  if (!loadingAuth && !isAuthenticated) {
    return <Navigate to="/login?next=/admin/panel" replace />
  }

  // Métricas básicas para las tarjetas (KPIs)
  const metrics = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        totalOrders: 0,
        totalSales: 0,
        avgTicket: 0,
        uniqueCustomers: 0
      }
    }

    const totalOrders = orders.length
    const totalSales = orders.reduce(
      (sum, o) => sum + Number(o.totalAmount ?? 0),
      0
    )
    const avgTicket = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0

    const uniqueCustomers = new Set(
      orders.map(o => o.userId || 'desconocido')
    ).size

    return { totalOrders, totalSales, avgTicket, uniqueCustomers }
  }, [orders])

  return (
    <div className="container py-4">
      <h1 className="h3 mb-3">Panel administrador</h1>
      <p className="text-muted mb-4">
        Hola <strong>{user?.fullName || 'Admin'}</strong>, aquí puedes ver un resumen rápido
        de la actividad reciente de la pastelería.
      </p>

      {/* Tarjetas de KPIs */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="text-muted small mb-1">Órdenes recientes</div>
              <div className="fs-4 fw-bold">{metrics.totalOrders}</div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="text-muted small mb-1">Ventas totales (últimas N)</div>
              <div className="fs-5 fw-bold">
                ${metrics.totalSales.toLocaleString('es-CL')}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="text-muted small mb-1">Ticket promedio</div>
              <div className="fs-5 fw-bold">
                ${metrics.avgTicket.toLocaleString('es-CL')}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <div className="text-muted small mb-1">Clientes únicos</div>
              <div className="fs-4 fw-bold">{metrics.uniqueCustomers}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bloque de lista de órdenes */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 mb-0">Últimas órdenes</h2>
            <span className="text-muted small">
              Mostrando las {orders.length} órdenes más recientes.
            </span>
          </div>

          {error && (
            <div className="alert alert-danger py-2">
              {error}
            </div>
          )}

          {loading && !error && (
            <div className="text-center text-muted py-3">
              Cargando actividad reciente...
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="text-center text-muted py-3">
              Aún no hay órdenes registradas en el sistema.
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Usuario</th>
                    <th>Estado</th>
                    <th className="text-end">Total</th>
                    <th className="text-end">Descuento</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => {
                    const total = Number(order.totalAmount ?? 0)
                    const discount = Number(order.discountAmount ?? 0)
                    const fecha = order.createdAt
                      ? new Date(order.createdAt).toLocaleString('es-CL')
                      : '—'

                    const shortId = order.id
                      ? `...${String(order.id).slice(-8)}`
                      : '—'

                    return (
                      <tr key={order.id}>
                        <td className="text-muted small">{shortId}</td>
                        <td>{fecha}</td>
                        <td className="small">
                          {order.userId || '—'}
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">
                            {order.status || '—'}
                          </span>
                        </td>
                        <td className="text-end">
                          <strong>${total.toLocaleString('es-CL')}</strong>
                        </td>
                        <td className="text-end">
                          {discount > 0 ? (
                            <span className="text-success small">
                              -${discount.toLocaleString('es-CL')}
                            </span>
                          ) : (
                            <span className="text-muted small">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-muted small mb-0 mt-2">
            Más adelante podremos agregar filtros por rango de fechas, canal de venta
            y sucursal, además de gráficos descriptivos/predictivos.
          </p>
        </div>
      </div>
    </div>
  )
}
