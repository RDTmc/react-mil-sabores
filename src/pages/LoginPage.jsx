import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  // ⬅️ ahora también traemos isAdmin desde el contexto
  const { isAuthenticated, loadingAuth, login, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)

  // controlar si mostramos o no la contraseña
  const [showPassword, setShowPassword] = useState(false)

  // si ya hay sesión, redirige al destino (next) o a /micuenta o /admin/panel
  useEffect(() => {
    if (!loadingAuth && isAuthenticated) {
      const params = new URLSearchParams(location.search)
      const next = params.get('next')

      if (next) {
        // si el login venía desde una ruta protegida, respetamos ese destino
        navigate(next, { replace: true })
      } else if (isAdmin) {
        // si no hay next y es admin → panel admin
        navigate('/admin/panel', { replace: true })
      } else {
        // usuario normal → mi cuenta
        navigate('/micuenta', { replace: true })
      }
    }
  }, [isAuthenticated, loadingAuth, isAdmin, location.search, navigate])

  const validarEmail = (value) => {
    if (!value) return 'El correo es obligatorio.'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Ingresa un correo válido.'
    return null
  }

  const validarPassword = (value) => {
    if (!value) return 'La contraseña es obligatoria.'
    if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
    return null
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg(null)

    const emailTrimmed = email.trim()

    const emailErr = validarEmail(emailTrimmed)
    const passwordErr = validarPassword(password)

    setEmailError(emailErr)
    setPasswordError(passwordErr)

    if (emailErr || passwordErr) {
      setErrorMsg('Revisa los campos marcados e inténtalo nuevamente.')
      return
    }

    try {
      setSubmitting(true)
      // login ya se encarga de guardar token + user (incluyendo role)
      await login(emailTrimmed, password)
      // la redirección la hace el useEffect cuando detecta sesión
    } catch (err) {
      const backendMsg = err?.response?.data?.message
      setErrorMsg(
        backendMsg ||
        err?.message ||
        'No fue posible iniciar sesión.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const onChangeEmail = (e) => {
    const value = e.target.value
    setEmail(value)
    setErrorMsg(null)
    if (emailError) {
      setEmailError(validarEmail(value.trim()))
    }
  }

  const onChangePassword = (e) => {
    const value = e.target.value
    setPassword(value)
    setErrorMsg(null)
    if (passwordError) {
      setPasswordError(validarPassword(value))
    }
  }

  const onBlurEmail = () => {
    setEmailError(validarEmail(email.trim()))
  }

  const onBlurPassword = () => {
    setPasswordError(validarPassword(password))
  }

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev)
  }

  const isBusy = submitting || loadingAuth

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
            className={`form-control ${emailError ? 'is-invalid' : ''}`}
            autoComplete="email"
            value={email}
            onChange={onChangeEmail}
            onBlur={onBlurEmail}
            required
            disabled={isBusy}
            aria-invalid={!!emailError}
          />
          {emailError && (
            <div className="invalid-feedback">
              {emailError}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="login-password">Contraseña</label>

          {/* Input + botón mostrar/ocultar usando Bootstrap input-group */}
          <div className="input-group">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className={`form-control ${passwordError ? 'is-invalid' : ''}`}
              autoComplete="current-password"
              value={password}
              onChange={onChangePassword}
              onBlur={onBlurPassword}
              required
              disabled={isBusy}
              aria-invalid={!!passwordError}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={toggleShowPassword}
              disabled={isBusy}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          {passwordError && (
            <div className="invalid-feedback d-block">
              {passwordError}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-dark w-100"
          disabled={isBusy}
        >
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
