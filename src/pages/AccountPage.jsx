// src/pages/AccountPage.jsx
import { useEffect, useState, useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchMyOrders } from '../lib/apiClient'

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

export default function AccountPage() {
  const { user, isAuthenticated, loadingAuth, updateUserLocal } = useAuth()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 🔹 Estado de edición del perfil
  const [isEditing, setIsEditing] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  const [formNombre, setFormNombre] = useState('')
  const [formTelefono, setFormTelefono] = useState('')

  // Cuando cambie el usuario en contexto, refrescamos el formulario
  useEffect(() => {
    setFormNombre(user?.fullName || '')
    setFormTelefono(user?.phone || '')
  }, [user])

  // Cargar pedidos del usuario
  useEffect(() => {
    if (loadingAuth) return

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

  // Datos de perfil “amigables”
  const nombreMostrado = formNombre || user?.fullName || '—'
  const email = user?.email || '—'
  const telefonoMostrado = formTelefono || user?.phone || 'No registrado'
  const birthDate = user?.birthDate || null
  const registrationCode = user?.registrationCode || null

  // 🔹 Handlers de edición de perfil

  const handleStartEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    // Revertimos a los valores actuales del contexto
    setFormNombre(user?.fullName || '')
    setFormTelefono(user?.phone || '')
    setIsEditing(false)
  }

  const handleSaveProfile = async () => {
    // Por ahora actualizamos sólo en el contexto/localStorage.
    // Más adelante podemos agregar aquí un PUT /api/auth/profile.
    try {
      setSavingProfile(true)

      updateUserLocal({
        fullName: formNombre || user?.fullName || '',
        phone: formTelefono || null,
      })

      setIsEditing(false)
    } catch (err) {
      console.error('[AccountPage] Error al guardar perfil (frontend):', err)
      alert('No fue posible actualizar tus datos. Inténtalo más tarde.')
    } finally {
      setSavingProfile(false)
    }
  }

  return (
    <div className="container py-4">
      <h1 className="h3 mb-3">Mi Cuenta</h1>

      <div className="row g-3">
        {/* Columna izquierda: Perfil y ajustes */}
        <div className="col-md-4 d-flex flex-column gap-3">
          {/* Información personal */}
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Información personal</h5>

              {/* Nombre */}
              <p className="card-text mb-1">
                <strong>Nombre completo:</strong><br />
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control form-control-sm mt-1"
                    value={formNombre}
                    onChange={(e) => setFormNombre(e.target.value)}
                    placeholder="Tu nombre completo"
                  />
                ) : (
                  nombreMostrado
                )}
              </p>

              {/* Email (solo lectura) */}
              <p className="card-text mb-1">
                <strong>Correo electrónico:</strong><br />
                {email}
              </p>

              {/* Teléfono */}
              <p className="card-text mb-1">
                <strong>Teléfono de contacto:</strong><br />
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control form-control-sm mt-1"
                    value={formTelefono}
                    onChange={(e) => setFormTelefono(e.target.value)}
                    placeholder="Ingresa tu teléfono"
                  />
                ) : (
                  telefonoMostrado
                )}
              </p>

              {/* Solo lectura por ahora */}
              <p className="card-text mb-1">
                <strong>Fecha de nacimiento:</strong><br />
                {birthDate || 'No registrada'}
              </p>

              <p className="card-text mb-3">
                <strong>Código de promoción:</strong><br />
                {registrationCode || 'Sin código asociado'}
              </p>

              {/* Botones de edición */}
              {!isEditing ? (
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleStartEdit}
                >
                  Editar datos
                </button>
              ) : (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                  >
                    {savingProfile ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleCancelEdit}
                    disabled={savingProfile}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Seguridad y preferencias (placeholder futuro) */}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Seguridad y preferencias</h5>
              <ul className="list-unstyled mb-3 small">
                <li>• Cambio de contraseña (disponible próximamente).</li>
                <li>• Configuración de notificaciones y boletines.</li>
                <li>• Preferencias de idioma y región.</li>
                <li>• Opciones de seguridad avanzada (2FA).</li>
              </ul>
              <button className="btn btn-outline-secondary btn-sm" disabled>
                Gestionar preferencias (próximamente)
              </button>
            </div>
          </div>
        </div>

        {/* Columna derecha: Pedidos */}
        <div className="col-md-8">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Historial de pedidos</h5>

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
                          Sin pedidos aún.
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
                          <td>
                            <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
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
