import { useState } from 'react'
import { useCart } from '../../context/CartContext' 

export default function FichaProducto({ producto }) {
  const { agregarItem } = useCart()
  const [tamanioSeleccionado, setTamanioSeleccionado] = useState(producto?.sizes?.[0] ?? null)
  const [cantidad, setCantidad] = useState(1)

  if (!producto) return null

  const manejarAgregarAlCarrito = () => {
    agregarItem(
      { id: producto.id, name: producto.name, price: producto.price },
      cantidad,
      tamanioSeleccionado
    )
  }

  return (
    <div>
      <h1 className="h3">{producto.name}</h1>
      <p className="text-muted">{producto.description}</p>
      <div className="mb-2 fw-semibold">${producto.price?.toLocaleString('es-CL')}</div>

      {!!producto.sizes?.length && (
        <div className="mb-3">
          <label className="form-label">Tamaño</label>
          <select
            className="form-select"
            value={tamanioSeleccionado ?? ''}
            onChange={e => setTamanioSeleccionado(e.target.value)}
          >
            {producto.sizes.map(opcion => (
              <option key={opcion} value={opcion}>{opcion}</option>
            ))}
          </select>
        </div>
      )}

      <div className="d-flex align-items-center gap-2 mb-3">
        <input
          type="number"
          min="1"
          className="form-control"
          style={{maxWidth:120}}
          value={cantidad}
          onChange={e => setCantidad(Math.max(1, Number(e.target.value) || 1))}
          aria-label="Cantidad"
        />
        <button className="btn btn-primary" onClick={manejarAgregarAlCarrito}>Añadir al carrito</button>
        <a className="btn btn-outline-secondary" href="/carrito">Ir al carrito</a>
      </div>
    </div>
  )
}
