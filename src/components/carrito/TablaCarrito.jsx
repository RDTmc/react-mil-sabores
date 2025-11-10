// src/components/carrito/TablaCarrito.jsx
import { useCarrito } from '../../context/CartContext.jsx'
import { Link } from 'react-router-dom'

export default function TablaCarrito() {
  if (import.meta.env.DEV && typeof useCarrito !== 'function') {
    throw new Error('useCarrito no es una función. Revisa el import desde context/CartContext.jsx')
  }

  const { listaItems, removerItem, obtenerTotales } = useCarrito()
  const totales = obtenerTotales(listaItems)

  if (!listaItems.length) {
    return <div className="alert alert-info">Tu carrito está vacío.</div>
  }

  const toSrc = (p) => {
    const raw = p?.image_path || p?.imagePath || '/img/placeholder.png'
    return raw.startsWith('/') ? raw : `/${raw}`
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Tamaño</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {listaItems.map((item, idx) => (
              <tr key={`${item.id}-${item.size}-${idx}`}>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={toSrc(item)}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded border object-fit-cover"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="d-flex flex-column">
                      <Link to={`/producto/${item.id}`} className="text-decoration-none">
                        <strong>{item.name}</strong>
                      </Link>
                      <small className="text-muted">ID: {item.id}</small>
                    </div>
                  </div>
                </td>
                <td>{item.size ?? '-'}</td>
                <td>{item.qty}</td>
                <td>${item.price?.toLocaleString('es-CL')}</td>
                <td>${(item.price * item.qty)?.toLocaleString('es-CL')}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removerItem(item.id, item.size)}
                  >
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ms-auto" style={{ maxWidth: 360 }}>
        <ul className="list-group mb-3">
          <li className="list-group-item d-flex justify-content-between">
            <span>Subtotal</span><strong>${totales.sub.toLocaleString('es-CL')}</strong>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>IVA (19%)</span><strong>${totales.iva.toLocaleString('es-CL')}</strong>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>Total</span><strong>${totales.total.toLocaleString('es-CL')}</strong>
          </li>
        </ul>
        <Link className="btn btn-dark w-100" to="/pedido">Continuar</Link>
      </div>
    </>
  )
}
