import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { isAuthenticated, loadingAuth, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  // si ya hay sesión, redirige al destino (next) o a /account
  useEffect(() => {
    if (!loadingAuth && isAuthenticated) {
      const params = new URLSearchParams(location.search)
      const next = params.get('next') || '/account'
      navigate(next, { replace: true })
    }
  }, [isAuthenticated, loadingAuth, location.search, navigate])

  const onSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg(null)
    if (!email || !password) {
      setErrorMsg('Ingresa tu correo y contraseña.')
      return
    }
    try {
      setSubmitting(true)
      await login(email.trim(), password)
      // la redirección se hará por el useEffect al detectar sesión
    } catch (err) {
      setErrorMsg(err?.message || 'No fue posible iniciar sesión.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: 480 }}>
      <h1 className="h3 mb-3">Iniciar sesión</h1>

      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <form onSubmit={onSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label" htmlFor="login-email">Correo</label>
          <input
            id="login-email"
            type="email"
            className="form-control"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="login-password">Contraseña</label>
          <input
            id="login-password"
            type="password"
            className="form-control"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <button type="submit" className="btn btn-dark w-100" disabled={submitting}>
          {submitting ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      <div className="text-center mt-3">
        <small className="text-muted">
          ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
        </small>
      </div>
    </div>
  )
}
