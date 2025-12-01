// src/pages/AdminDashboardPage.jsx
import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import {
  fetchAdminLatestOrders,
  fetchAdminUsers,
  updateAdminUser,
  deleteAdminUser
} from '../lib/apiClient'

// 🔹 Traduce el estado técnico a texto amigable
function getStatusLabel(status) {
  if (!status) return '—'
  switch (status) {
    case 'CREATED':
      return 'Pedido recibido'
    case 'PAID':
      return 'Pago confirmado'
    case 'PROCESSING':
      return 'En preparación'
    case 'SHIPPED':
      return 'En camino'
    case 'DELIVERED':
      return 'Entregado'
    case 'CANCELLED':
      return 'Cancelado'
    default:
      // Por si en el futuro agregas algo nuevo
      return status
  }
}

// 🔹 Define el color del badge según el estado
function getStatusBadgeClass(status) {
  switch (status) {
    case 'CREATED':
      return 'bg-secondary'
    case 'PAID':
      return 'bg-primary'
    case 'PROCESSING':
      return 'bg-warning text-dark'
    case 'SHIPPED':
      return 'bg-info text-dark'
    case 'DELIVERED':
      return 'bg-success'
    case 'CANCELLED':
      return 'bg-danger'
    default:
      return 'bg-secondary'
  }
}

export default function AdminDashboardPage() {
  const { user, isAuthenticated, loadingAuth } = useAuth()

  // === ÓRDENES ===
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [ordersError, setOrdersError] = useState(null)

  // === USUARIOS ===
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [usersError, setUsersError] = useState(null)

  // Edición de usuarios
  const [editingId, setEditingId] = useState(null)
  const [editingDraft, setEditingDraft] = useState({
    fullName: '',
    phone: '',
    role: 'CUSTOMER'
  })
  const [savingUser, setSavingUser] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState(null)

  // Cargar datos para el dashboard admin
  useEffect(() => {
    if (loadingAuth) return

    // Si no está autenticado, no llamamos al backend
    if (!isAuthenticated) {
      setLoadingOrders(false)
      setLoadingUsers(false)
      return
    }

    let active = true

    ;(async () => {
      // ===== ÓRDENES =====
      try {
        setLoadingOrders(true)
        setOrdersError(null)

        const data = await fetchAdminLatestOrders(10)
        if (!active) return

        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('[AdminDashboard] Error al cargar últimas órdenes', err)
        if (!active) return

        const status = err?.response?.status
        if (status === 403) {
          setOrdersError('Acceso restringido. Debes ser administrador para ver las órdenes.')
        } else {
          setOrdersError('No fue posible cargar las últimas órdenes. Inténtalo más tarde.')
        }
      } finally {
        if (active) setLoadingOrders(false)
      }

      // ===== USUARIOS =====
      try {
        setLoadingUsers(true)
        setUsersError(null)

        const dataUsers = await fetchAdminUsers()
        if (!active) return

        setUsers(Array.isArray(dataUsers) ? dataUsers : [])
      } catch (err) {
        console.error('[AdminDashboard] Error al cargar usuarios', err)
        if (!active) return

        const status = err?.response?.status
        if (status === 403) {
          setUsersError('Acceso restringido. Debes ser administrador para ver los usuarios.')
        } else {
          setUsersError('No fue posible cargar los usuarios. Inténtalo más tarde.')
        }
      } finally {
        if (active) setLoadingUsers(false)
      }
    })()

    return () => {
      active = false
    }
  }, [isAuthenticated, loadingAuth])

  // Redirección suave si NO está logueado
  if (!loadingAuth && !isAuthenticated) {
    return <Navigate to="/login?next=/admin" replace />
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

  // Ordenar usuarios alfabéticamente por email
  const sortedUsers = useMemo(() => {
    if (!users || users.length === 0) return []
    return [...users].sort((a, b) =>
      (a.email || '').localeCompare(b.email || '')
    )
  }, [users])

  const roleLabel = (role) => {
    if (!role) return '—'
    const r = String(role).toUpperCase()
    if (r === 'ADMIN') return 'Administrador'
    if (r === 'CUSTOMER') return 'Cliente'
    return r
  }

  // === Handlers edición de usuarios ===

  const startEditUser = (userRow) => {
    setEditingId(userRow.id)
    setEditingDraft({
      fullName: userRow.fullName || '',
      phone: userRow.phone || '',
      role: userRow.role || 'CUSTOMER'
    })
  }

  const cancelEditUser = () => {
    setEditingId(null)
  }

  const handleEditChange = (field, value) => {
    setEditingDraft((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveUser = async () => {
    if (!editingId) return
    try {
      setSavingUser(true)

      const updated = await updateAdminUser(editingId, {
        fullName: editingDraft.fullName,
        phone: editingDraft.phone,
        role: editingDraft.role
      })

      setUsers((prev) =>
        prev.map((u) => (u.id === editingId ? updated : u))
      )

      setEditingId(null)
    } catch (err) {
      console.error('[AdminDashboard] Error al actualizar usuario', err)
      alert(
        err?.response?.data?.message ||
        err?.message ||
        'No fue posible actualizar el usuario.'
      )
    } finally {
      setSavingUser(false)
    }
  }

  const handleDeleteUser = async (id) => {
    const ok = window.confirm(
      '¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.'
    )
    if (!ok) return

    try {
      setDeletingUserId(id)
      await deleteAdminUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      console.error('[AdminDashboard] Error al eliminar usuario', err)
      alert(
        err?.response?.data?.message ||
        err?.message ||
        'No fue posible eliminar el usuario.'
      )
    } finally {
      setDeletingUserId(null)
    }
  }

  return (
    <div className="container py-4">
      <h1 className="h3 mb-3">Panel administrador</h1>
      <p className="text-muted mb-4">
        Hola <strong>{user?.fullName || 'Admin'}</strong>, aquí puedes ver un resumen rápido
        de la actividad reciente de la pastelería y gestionar a tus clientes.
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
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 mb-0">Últimas órdenes</h2>
            <span className="text-muted small">
              Mostrando las {orders.length} órdenes más recientes.
            </span>
          </div>

          {ordersError && (
            <div className="alert alert-danger py-2">
              {ordersError}
            </div>
          )}

          {loadingOrders && !ordersError && (
            <div className="text-center text-muted py-3">
              Cargando actividad reciente...
            </div>
          )}

          {!loadingOrders && !ordersError && orders.length === 0 && (
            <div className="text-center text-muted py-3">
              Aún no hay órdenes registradas en el sistema.
            </div>
          )}

          {!loadingOrders && !ordersError && orders.length > 0 && (
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
                          <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                            {getStatusLabel(order.status)}
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
            Más adelante se agregaran filtros por rango de fechas, canal de venta
            y sucursal, además de gráficos descriptivos/predictivos.
          </p>
        </div>
      </div>

      {/* Bloque de gestión de usuarios */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 mb-0">Usuarios registrados</h2>
            <span className="text-muted small">
              Total: {users.length}
            </span>
          </div>

          {usersError && (
            <div className="alert alert-danger py-2">
              {usersError}
            </div>
          )}

          {loadingUsers && !usersError && (
            <div className="text-center text-muted py-3">
              Cargando usuarios...
            </div>
          )}

          {!loadingUsers && !usersError && sortedUsers.length === 0 && (
            <div className="text-center text-muted py-3">
              Aún no hay usuarios registrados.
            </div>
          )}

          {!loadingUsers && !usersError && sortedUsers.length > 0 && (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((u) => {
                    const isEditing = editingId === u.id

                    return (
                      <tr key={u.id}>
                        <td className="small">{u.email}</td>
                        <td>
                          {isEditing ? (
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editingDraft.fullName}
                              onChange={(e) => handleEditChange('fullName', e.target.value)}
                            />
                          ) : (
                            u.fullName || '—'
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editingDraft.phone}
                              onChange={(e) => handleEditChange('phone', e.target.value)}
                            />
                          ) : (
                            u.phone || '—'
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <select
                              className="form-select form-select-sm"
                              value={editingDraft.role}
                              onChange={(e) => handleEditChange('role', e.target.value)}
                            >
                              <option value="CUSTOMER">Cliente</option>
                              <option value="ADMIN">Administrador</option>
                            </select>
                          ) : (
                            <span className="badge bg-light text-dark">
                              {roleLabel(u.role)}
                            </span>
                          )}
                        </td>
                        <td className="text-end">
                          {isEditing ? (
                            <div className="d-flex justify-content-end gap-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-success"
                                onClick={handleSaveUser}
                                disabled={savingUser}
                              >
                                {savingUser ? 'Guardando...' : 'Guardar'}
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                onClick={cancelEditUser}
                                disabled={savingUser}
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div className="d-flex justify-content-end gap-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => startEditUser(u)}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteUser(u.id)}
                                disabled={deletingUserId === u.id}
                              >
                                {deletingUserId === u.id ? 'Eliminando...' : 'Eliminar'}
                              </button>
                            </div>
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
            Aquí puedes actualizar el nombre, teléfono y rol de tus usuarios, o eliminarlos del sistema.
          </p>
        </div>
      </div>
    </div>
  )
}
