// src/routes/RequireAuth.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function RequireAuth() {
  const { isAuthenticated, loadingAuth } = useAuth()
  const location = useLocation()

  // Mientras carga el estado inicial de auth
  if (loadingAuth) {
    return (
      <div className="container py-4">
        <p>Cargando sesión...</p>
      </div>
    )
  }

  // Si no está autenticado → mandar a /login con ?next=<ruta actual>
  if (!isAuthenticated) {
    const next = `${location.pathname}${location.search || ''}`
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(next)}`}
        replace
      />
    )
  }

  // Si está autenticado, renderiza las rutas hijas
  return <Outlet />
}
