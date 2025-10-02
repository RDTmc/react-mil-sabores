import { Link } from 'react-router-dom'

export default function FeaturedGrid({ items = [], loading }) {
  return (
    <section className="container mb-4">
      <div className="d-flex justify-content-between align-items-end mb-3">
        <div>
          <h2 className="h4 mb-0">Destacados</h2>
          <small className="text-muted">Selección especial</small>
        </div>
        <Link to="/catalogo" className="btn btn-outline-secondary btn-sm">Ver todo</Link>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {loading ? Array.from({length:3}).map((_,i)=>(
          <div className="col" key={i}><div className="card h-100 placeholder-glow">
            <div className="ratio ratio-4x3 placeholder"></div>
            <div className="card-body">
              <h5 className="card-title"><span className="placeholder col-6"></span></h5>
              <p className="card-text"><span className="placeholder col-10"></span></p>
              <button className="btn btn-secondary disabled placeholder col-5">&nbsp;</button>
            </div>
          </div></div>
        )) : items.map(p => (
          <div className="col" key={p.id}>
            <div className="card h-100">
              <div className="ratio ratio-4x3">
                <img src={p.image_path?.startsWith('/') ? p.image_path : `/${p.image_path}`} className="card-img-top object-fit-cover" alt={p.name}/>
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.name}</h5>
                <p className="text-muted mb-2">Desde ${p.price?.toLocaleString('es-CL')}</p>
                <div className="mt-auto">
                  <Link to={`/producto/${p.id}`} className="btn btn-primary">Comprar ahora</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
