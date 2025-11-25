import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import { useCarrito } from '../../context/CartContext.jsx' 

export default function FichaProducto({ producto }) {
  const { agregarItem } = useCarrito()
  const { showToast } = useToast()
  const [tamanioSeleccionado, setTamanioSeleccionado] = useState(producto?.sizes?.[0] ?? null)
  const [cantidad, setCantidad] = useState(1)
  const navigate = useNavigate()

  if (!producto) return null

  const manejarAgregarAlCarrito = () => {
    // ✅ Incluimos image_path para que el carrito tenga miniaturas
    const image_path = producto.image_path ?? producto.imagePath ?? '/img/placeholder.png'

    agregarItem(
      { id: producto.id, name: producto.name, price: producto.price, image_path },
      cantidad,
      tamanioSeleccionado
    )

    showToast({
      title: 'Añadido al carrito',
      message: `${producto.name} x${cantidad}${tamanioSeleccionado ? ` (${tamanioSeleccionado})` : ''}`,
      variant: 'success',
      delay: 2200,
      autohide: true
    })
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
        <button className="btn btn-dark" onClick={manejarAgregarAlCarrito}>Añadir al carrito</button>
        <a className="btn btn-outline-secondary" onClick={() => navigate('/carrito')}>Ir al carrito</a>
      </div>
    </div>
  )
}
