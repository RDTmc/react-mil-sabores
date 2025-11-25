import { useCart, totals as obtenerTotales } from '../../context/CartContext'

export default function TablaCarrito() {
  const { items: listaItems, removerItem } = useCart()
  const totales = obtenerTotales(listaItems)

  if (!listaItems.length) {
    return <div className="alert alert-info">Tu carrito está vacío.</div>
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr><th>Producto</th><th>Tamaño</th><th>Cant.</th><th>Precio</th><th>Subtotal</th><th></th></tr>
          </thead>
          <tbody>
            {listaItems.map((item, idx) => (
              <tr key={`${item.id}-${item.size}-${idx}`}>
                <td>{item.name}</td>
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
          <li className="list-group-item d-flex justify-content-between"><span>Subtotal</span><strong>${totales.sub.toLocaleString('es-CL')}</strong></li>
          <li className="list-group-item d-flex justify-content-between"><span>IVA (19%)</span><strong>${totales.iva.toLocaleString('es-CL')}</strong></li>
          <li className="list-group-item d-flex justify-content-between"><span>Total</span><strong>${totales.total.toLocaleString('es-CL')}</strong></li>
        </ul>
        <a className="btn btn-dark w-100" href="/pedido">Continuar</a>
      </div>
    </>
  )
}
