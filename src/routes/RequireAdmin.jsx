// src/routes/RequireAdmin.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function RequireAdmin() {
  const { isAuthenticated, loadingAuth, isAdmin } = useAuth()
  const location = useLocation()

  if (loadingAuth) {
    return (
      <div className="container py-4">
        <p>Cargando sesión...</p>
      </div>
    )
  }

  // Si no está logueado o no es admin → login con next
  if (!isAuthenticated || !isAdmin) {
    const next = `${location.pathname}${location.search || ''}`
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(next)}`}
        replace
      />
    )
  }

  return <Outlet />
}
