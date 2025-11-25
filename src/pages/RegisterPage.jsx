import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
// import { useToast } from '../context/ToastContext.jsx'

const reglas = {
  nombre: v => !v ? 'El nombre es obligatorio.' :
    v.trim().length < 2 ? 'El nombre debe tener al menos 2 caracteres.' : '',
  email: v => !v ? 'El correo es obligatorio.' :
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Formato de correo no válido.' : '',
  password: v => !v ? 'La contraseña es obligatoria.' :
    v.length < 8 ? 'Mínimo 8 caracteres.' :
    !/[A-Z]/.test(v) ? 'Incluye al menos una mayúscula.' :
    !/[a-z]/.test(v) ? 'Incluye al menos una minúscula.' :
    !/\d/.test(v) ? 'Incluye al menos un número.' : '',
  confirmarPassword: (v, all) => v !== all.password ? 'Las contraseñas no coinciden.' : '',
  aceptaTerminos: v => !v ? 'Debes aceptar los términos y condiciones.' : ''
}

export default function RegisterPage() {
  const { register } = useAuth()
  // const { showToast } = useToast()

  const [valores, setValores] = useState({
    nombre:'', email:'', password:'', confirmarPassword:'', aceptaTerminos:false
  })
  const [errores, setErrores] = useState({})
  const [tocados, setTocados] = useState({})
  const [enviando, setEnviando] = useState(false)

  const [mensajeExito, setMensajeExito] = useState(null)
  const [mensajeError, setMensajeError] = useState(null)

  const validarCampo = (name, value, all = valores) => {
    const fn = reglas[name]
    const msg = fn ? fn(value, all) : ''
    setErrores(p => ({ ...p, [name]: msg }))
    return msg
  }

  const manejarCambio = e => {
    const { name, type } = e.target
    const value = type === 'checkbox' ? e.target.checked : e.target.value
    const next = { ...valores, [name]: value }
    setValores(next)
    setMensajeExito(null)
    setMensajeError(null)

    if (tocados[name]) validarCampo(name, value, next)
    if (name === 'password' && tocados.confirmarPassword) {
      validarCampo('confirmarPassword', next.confirmarPassword, next)
    }
  }

  const manejarBlur = e => {
    const { name, type } = e.target
    const value = type === 'checkbox' ? e.target.checked : e.target.value
    setTocados(p => ({ ...p, [name]: true }))
    validarCampo(name, value)
    if (name === 'password' && tocados.confirmarPassword) {
      validarCampo('confirmarPassword', valores.confirmarPassword, { ...valores, password: value })
    }
  }

  const validarFormulario = () => {
    const nuevos = {}
    Object.keys(valores).forEach(k => {
      const msg = validarCampo(k, valores[k])
      if (msg) nuevos[k] = msg
    })
    return nuevos
  }

  const manejarSubmit = async e => {
    e.preventDefault()
    setMensajeExito(null)
    setMensajeError(null)

    setTocados(Object.fromEntries(Object.keys(valores).map(k => [k,true])))
    const errs = validarFormulario()
    if (Object.values(errs).some(Boolean)) return

    try {
      setEnviando(true)

      // ms-usuarios: RegisterRequest(email, password, fullName, phone)
      await register({
        email: valores.email.trim(),
        password: valores.password,
        fullName: valores.nombre.trim(),
        phone: null, // opcional, por ahora no se pide en el formulario
      })

      setMensajeExito('Cuenta creada con éxito. Ahora puedes iniciar sesión.')
      setValores({ nombre:'', email:'', password:'', confirmarPassword:'', aceptaTerminos:false })
      setErrores({})
      setTocados({})

      // Si quisieras usar toasts:
      // showToast({ title: 'Registro', message: 'Cuenta creada con éxito. Ahora puedes iniciar sesión.', variant: 'success' })
    } catch (err) {
      const backendMsg = err?.response?.data?.message
      const msgLegible = backendMsg || err?.message || 'No fue posible crear la cuenta.'
      setMensajeError(msgLegible)

      // showToast({ title:'Error', message: msgLegible, variant:'danger' })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container py-3">
      <h1 className="h3 mb-3">Crear cuenta</h1>

      {mensajeExito && (
        <div className="alert alert-success" role="alert">
          {mensajeExito}
        </div>
      )}

      {mensajeError && (
        <div className="alert alert-danger" role="alert">
          {mensajeError}
        </div>
      )}

      <form noValidate onSubmit={manejarSubmit} className="row g-3">
        <div className="col-12">
          <label className="form-label">Nombre</label>
          <input
            type="text" name="nombre"
            className={`form-control ${errores.nombre && tocados.nombre ? 'is-invalid' : ''}`}
            value={valores.nombre} onChange={manejarCambio} onBlur={manejarBlur}
            aria-invalid={!!(errores.nombre && tocados.nombre)} aria-describedby="err-nombre"
            placeholder="Tu nombre"
          />
          {errores.nombre && tocados.nombre && (
            <div id="err-nombre" className="invalid-feedback">{errores.nombre}</div>
          )}
        </div>

        <div className="col-12">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email" name="email"
            className={`form-control ${errores.email && tocados.email ? 'is-invalid' : ''}`}
            value={valores.email} onChange={manejarCambio} onBlur={manejarBlur}
            aria-invalid={!!(errores.email && tocados.email)} aria-describedby="err-email"
            placeholder="tu@correo.com"
          />
          {errores.email && tocados.email && (
            <div id="err-email" className="invalid-feedback">{errores.email}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">Contraseña</label>
          <input
            type="password" name="password"
            className={`form-control ${errores.password && tocados.password ? 'is-invalid' : ''}`}
            value={valores.password} onChange={manejarCambio} onBlur={manejarBlur}
            aria-invalid={!!(errores.password && tocados.password)} aria-describedby="err-pass"
            placeholder="Mínimo 8 caracteres"
          />
          {errores.password && tocados.password && (
            <div id="err-pass" className="invalid-feedback">{errores.password}</div>
          )}
          <div className="form-text">
            Debe incluir mayúscula, minúscula y número.
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label">Confirmar contraseña</label>
          <input
            type="password" name="confirmarPassword"
            className={`form-control ${errores.confirmarPassword && tocados.confirmarPassword ? 'is-invalid' : ''}`}
            value={valores.confirmarPassword} onChange={manejarCambio} onBlur={manejarBlur}
            aria-invalid={!!(errores.confirmarPassword && tocados.confirmarPassword)} aria-describedby="err-pass2"
            placeholder="Repite tu contraseña"
          />
          {errores.confirmarPassword && tocados.confirmarPassword && (
            <div id="err-pass2" className="invalid-feedback">{errores.confirmarPassword}</div>
          )}
        </div>

        <div className="col-12 form-check">
          <input
            className={`form-check-input ${errores.aceptaTerminos && tocados.aceptaTerminos ? 'is-invalid' : ''}`}
            type="checkbox" id="chk-terminos" name="aceptaTerminos"
            checked={valores.aceptaTerminos} onChange={manejarCambio} onBlur={manejarBlur}
            aria-invalid={!!(errores.aceptaTerminos && tocados.aceptaTerminos)} aria-describedby="err-terminos"
          />
          <label className="form-check-label" htmlFor="chk-terminos">
            Acepto los términos y condiciones
          </label>
          {errores.aceptaTerminos && tocados.aceptaTerminos && (
            <div id="err-terminos" className="invalid-feedback d-block">{errores.aceptaTerminos}</div>
          )}
        </div>

        <div className="col-12 d-flex justify-content-end">
          <button className="btn btn-dark" type="submit" disabled={enviando}>
            {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </div>
      </form>
    </div>
  )
}
