import { Link } from 'react-router-dom'
import { resolveProductImageUrl } from '../../lib/imageUtils'

export default function GrillaDeProductos({ listaProductos = [] }) {
  if (!listaProductos.length) {
    return (
      <div className="alert alert-warning">
        No hay productos que coincidan con el filtro.
      </div>
    )
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
      {listaProductos.map((producto) => {
        const imgSrc = resolveProductImageUrl(
          producto.imagePath ?? producto.image_path
        )

        return (
          <div className="col" key={producto.id}>
            <div className="card h-100">
              <div className="ratio ratio-4x3">
                <img
                  src={imgSrc}
                  alt={producto.name}
                  className="card-img-top object-fit-cover"
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{producto.name}</h5>
                <p className="card-text text-muted">{producto.description}</p>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">
                    ${producto.price?.toLocaleString('es-CL')}
                  </span>
                  <Link className="btn btn-dark btn-sm" to={`/producto/${producto.id}`}>
                    Ver
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
