import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react'

const ToastContext = createContext(null)

let counter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]) // [{id, title, message, variant, autohide, delay}]

  const showToast = useCallback(({ title = 'Aviso', message = '', variant = 'success', delay = 3000, autohide = true } = {}) => {
    const id = ++counter
    setToasts(prev => [...prev, { id, title, message, variant, delay, autohide, visible: true }])
    if (autohide && delay > 0) {
      setTimeout(() => setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: false } : t)), delay)
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), delay + 300) // margen para animación
    }
    return id
  }, [])

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: false } : t))
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300)
  }, [])

  const value = useMemo(() => ({ showToast, hideToast }), [showToast, hideToast])

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Contenedor visual de toasts */}
      <div className="ms-toasts position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }}>
        {toasts.map(t => (
          <div
            key={t.id}
            className={`toast align-items-center border-0 ${t.visible ? 'show' : 'hide'} ${variantBg(t.variant)}`}
            role="status" aria-live="polite" aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body text-white">
                {t.title ? <strong className="me-1">{t.title}:</strong> : null}
                <span>{t.message}</span>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                aria-label="Cerrar"
                onClick={() => hideToast(t.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>.')
  return ctx
}

function variantBg(variant) {
  // Mapea a clases Bootstrap
  switch (variant) {
    case 'success': return 'bg-success'
    case 'danger': return 'bg-danger'
    case 'warning': return 'bg-warning text-dark'
    case 'info': return 'bg-info text-dark'
    default: return 'bg-dark'
  }
}
