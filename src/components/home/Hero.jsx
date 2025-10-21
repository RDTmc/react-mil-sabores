import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="container py-4">
      <div className="row align-items-center g-4">
        <div className="col-md-6">
          <div className="ratio ratio-4x3 rounded ms-shadow-sm" style={{ overflow:'hidden' }}>
            <img src="/img/imagen-principal.jpg" alt="Imagen principal" className="w-100 h-100 object-fit-cover" />
          </div>
        </div>
        <div className="col-md-6">
          <h1 className="display-6 ms-brand">Celebra la dulzura de la vida</h1>
          <p className="lead">Catálogo de tortas, postres y opciones sin azúcar, sin gluten y veganas.</p>
          <div className="d-flex gap-2">
            <Link className="btn btn-dark" to="/catalogo">Ver catálogo</Link>
            <Link className="btn btn-outline-dark" to="/blog">Recetas & Noticias</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
